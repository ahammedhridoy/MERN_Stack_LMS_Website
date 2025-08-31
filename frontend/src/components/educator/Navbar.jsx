import { Link } from "react-router-dom";
import { assets, dummyEducatorData } from "../../assets/assets";
import { useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-500 md:px-8">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>
      <div className="relative flex items-center gap-5 text-gray-500">
        <span>Hi! {user ? user.fullName : "Developers"}</span>
        {user ? (
          <UserButton />
        ) : (
          <img className="max-w-8" src={assets.profile_img} alt="Profile" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
