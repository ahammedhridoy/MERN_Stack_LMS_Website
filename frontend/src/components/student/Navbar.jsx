import { assets } from "./../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const isCourseListPage = location.pathname.includes("/course-list");
  const { navigate } = useContext(AppContext);

  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 boder-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="cursor-pointer w-28 lg:w-32"
      />
      <div className="items-center hidden gap-5 text-gray-500 md:flex">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button>Become Educator</button> |{" "}
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={openSignIn}
            className="px-5 py-2 text-white bg-blue-600 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>

      {/* For Mobile Users */}
      <div className="flex items-center gap-2 text-gray-500 md:hidden sm:gap-5 ">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button>Become Educator</button> |{" "}
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={openSignIn}>
            <img src={assets.user_icon} alt="User" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
