import Profile from "./components/UserProfile";

interface IParams {
  username: string;
}

const Username = async ({ params }: { params: IParams }) => {
  const username = params.username;

  return <Profile username={username} />;
};

export default Username;
