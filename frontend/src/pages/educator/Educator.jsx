import { Outlet } from "react-router-dom";

const Educator = () => {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Educator</h1>
      <Outlet />
    </div>
  );
};

export default Educator;
