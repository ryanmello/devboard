const TOKEN = process.env.GITHUB_TOKEN;
const query = `
query($userName:String!) {
    user(login: $userName){
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
`;

export const getGitHubContributionData = async (
  userName: string
): Promise<Externals.Github.ApiResponse> => {
  const variables = `
  {
    "userName": "${userName}"
  }
`;
  const body = {
    query,
    variables,
  };

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: process.env.GITHUB_AUTHORIZATION || "",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};
