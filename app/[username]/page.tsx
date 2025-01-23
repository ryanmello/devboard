import { getGitHubContributionData } from "../actions/getGitHubContributionData";
import UserProfile from "./components/UserProfile";

interface IParams {
  username: string;
}

const Username = async ({ params }: { params: IParams }) => {
  const username = params.username;
  // const contributionData = await getGitHubContributionData(username) as Externals.Github.ApiResponse;

  return <UserProfile username={username} />;
};

export default Username;
