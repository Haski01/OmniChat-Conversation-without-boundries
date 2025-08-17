const NoFriendsFound = ({ h3, p }) => {
  return (
    <div className="card bg-base-200 p-6 text-center">
      <h3 className="font-semibold text-lg mb-2">{h3}</h3>
      <p className="text-base-content opacity-70">{p}</p>
    </div>
  );
};

export default NoFriendsFound;
