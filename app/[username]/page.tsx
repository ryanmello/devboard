import UserProfile from "./components/UserProfile";

interface IParams {
  username: string;
}

const Username = async ({ params }: { params: IParams }) => {
  const username = params.username;

  return <UserProfile username={username} />;
};

export default Username;
