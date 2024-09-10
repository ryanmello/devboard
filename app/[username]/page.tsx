import getUserByUsername from "../actions/getUserByUsername";

interface IParams {
  username: string;
}

const Username = async ({ params }: { params: IParams }) => {
  const user = await getUserByUsername(params.username);

//   if (!user?.username) {
//     return <EmptyState currentUser={currentUser} />;
//   }

  return (
    <div>
      <p>{user?.username}</p>
    </div>
  );
};

export default Username;
