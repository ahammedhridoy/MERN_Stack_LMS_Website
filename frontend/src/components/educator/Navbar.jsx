import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-500 md:px-8">
      <Link to="/">
        <img
          src={assets.eduka}
          alt="Logo"
          className="cursor-pointer w-14 lg:w-14"
        />
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
