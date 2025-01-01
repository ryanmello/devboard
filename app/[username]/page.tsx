import getUserByUsername from "../actions/getUserByUsername";
import LeftProfile from "./components/LeftProfile";
import RightProfile from "./components/RightProfile";

interface IParams {
  username: string;
}

const Username = async ({ params }: { params: IParams }) => {
  const user = await getUserByUsername(params.username);

  if (!user) {
    return null;
  }

  return (
    <div className="flex pt-8 px-8">
      <LeftProfile user={user} />
      <RightProfile user={user} />
    </div>
  );
};

export default Username;
