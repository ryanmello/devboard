import getUserByUsername from "../actions/getUserByUsername";
import Profile from "./components/Profile";

interface IParams {
  username: string;
}

const Username = async ({ params }: { params: IParams }) => {
  const user = await getUserByUsername(params.username);
  
  return (
    <Profile user={user} />
  );
};

export default Username;
