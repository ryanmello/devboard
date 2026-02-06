package services

import (
	"encoding/json"
	"fmt"
	"net/http"
)

const leetcodeAPIEndpoint = "https://leetcode-stats-api.herokuapp.com"

// LeetCodeStats represents the statistics for a LeetCode user
type LeetCodeStats struct {
	Status             string         `json:"status"`
	Message            string         `json:"message,omitempty"`
	TotalSolved        int            `json:"totalSolved"`
	TotalQuestions     int            `json:"totalQuestions"`
	EasySolved         int            `json:"easySolved"`
	TotalEasy          int            `json:"totalEasy"`
	MediumSolved       int            `json:"mediumSolved"`
	TotalMedium        int            `json:"totalMedium"`
	HardSolved         int            `json:"hardSolved"`
	TotalHard          int            `json:"totalHard"`
	AcceptanceRate     float64        `json:"acceptanceRate"`
	Ranking            int            `json:"ranking"`
	ContributionPoints int            `json:"contributionPoints"`
	Reputation         int            `json:"reputation"`
	SubmissionCalendar map[string]int `json:"submissionCalendar"`
}

// LeetCodeService handles LeetCode API interactions
type LeetCodeService struct{}

// NewLeetCodeService creates a new LeetCode service instance
func NewLeetCodeService() *LeetCodeService {
	return &LeetCodeService{}
}

// GetStats fetches the statistics for a LeetCode user
func (s *LeetCodeService) GetStats(username string) (*LeetCodeStats, error) {
	url := fmt.Sprintf("%s/%s", leetcodeAPIEndpoint, username)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch LeetCode stats: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("LeetCode API returned status %d", resp.StatusCode)
	}

	var stats LeetCodeStats
	if err := json.NewDecoder(resp.Body).Decode(&stats); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Check if the API returned an error status
	if stats.Status == "error" {
		return nil, fmt.Errorf("LeetCode API error: %s", stats.Message)
	}

	return &stats, nil
}
