import UserProfile from "./components/UserProfile";

interface IParams {
  username: string;
}

const Username = async ({ params }: { params: IParams }) => {
  const username = params.username;

  return (
    <div className="flex justify-center">
      <UserProfile username={username} />
    </div>
  );
};

export default Username;
