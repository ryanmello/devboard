package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

const githubGraphQLEndpoint = "https://api.github.com/graphql"

const contributionQuery = `
query($userName: String!) {
    user(login: $userName) {
        contributionsCollection {
            contributionCalendar {
                totalContributions
                weeks {
                    contributionDays {
                        contributionCount
                        date
                    }
                }
            }
        }
    }
}
`

// ContributionDay represents a single day's contribution data
type ContributionDay struct {
	ContributionCount int    `json:"contributionCount"`
	Date              string `json:"date"`
}

// ContributionWeek represents a week of contribution data
type ContributionWeek struct {
	ContributionDays []ContributionDay `json:"contributionDays"`
}

// ContributionCalendar represents the full contribution calendar
type ContributionCalendar struct {
	TotalContributions int                `json:"totalContributions"`
	Weeks              []ContributionWeek `json:"weeks"`
}

// GitHubContributionData is the response structure for contribution data
type GitHubContributionData struct {
	TotalContributions int                `json:"totalContributions"`
	Weeks              []ContributionWeek `json:"weeks"`
}

// graphqlRequest represents a GitHub GraphQL API request
type graphqlRequest struct {
	Query     string            `json:"query"`
	Variables map[string]string `json:"variables"`
}

// graphqlResponse represents the GitHub GraphQL API response
type graphqlResponse struct {
	Data struct {
		User struct {
			ContributionsCollection struct {
				ContributionCalendar ContributionCalendar `json:"contributionCalendar"`
			} `json:"contributionsCollection"`
		} `json:"user"`
	} `json:"data"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
}

// GitHubService handles GitHub API interactions
type GitHubService struct {
	token string
}

// NewGitHubService creates a new GitHub service instance
func NewGitHubService() *GitHubService {
	return &GitHubService{
		token: os.Getenv("GITHUB_TOKEN"),
	}
}

// GetContributions fetches the contribution data for a GitHub user
func (s *GitHubService) GetContributions(username string) (*GitHubContributionData, error) {
	if s.token == "" {
		return nil, fmt.Errorf("GITHUB_TOKEN environment variable is not set")
	}

	// Build the GraphQL request
	reqBody := graphqlRequest{
		Query: contributionQuery,
		Variables: map[string]string{
			"userName": username,
		},
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", githubGraphQLEndpoint, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.token)
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub API returned status %d", resp.StatusCode)
	}

	// Parse response
	var result graphqlResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Check for GraphQL errors
	if len(result.Errors) > 0 {
		return nil, fmt.Errorf("GitHub API error: %s", result.Errors[0].Message)
	}

	calendar := result.Data.User.ContributionsCollection.ContributionCalendar

	return &GitHubContributionData{
		TotalContributions: calendar.TotalContributions,
		Weeks:              calendar.Weeks,
	}, nil
}
