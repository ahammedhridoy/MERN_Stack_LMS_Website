import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-8 md:px-12 lg:px-24 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <img
            src={assets.eduka}
            alt="Eduka LMS Logo"
            className="w-10 sm:w-12 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-brand-700 to-indigo-600 bg-clip-text text-transparent hidden sm:inline-block tracking-tight">
            Eduka
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link
            to="/course-list"
            className={`transition-colors duration-200 hover:text-brand-600 py-1.5 px-3 rounded-lg hover:bg-slate-100/80 ${
              location.pathname.startsWith("/course-list")
                ? "text-brand-600 font-semibold bg-brand-50/80"
                : ""
            }`}
          >
            Explore Courses
          </Link>

          {user && (
            <>
              <Link
                to="/my-enrollments"
                className={`transition-colors duration-200 hover:text-brand-600 py-1.5 px-3 rounded-lg hover:bg-slate-100/80 ${
                  location.pathname === "/my-enrollments"
                    ? "text-brand-600 font-semibold bg-brand-50/80"
                    : ""
                }`}
              >
                My Enrollments
              </Link>

              <button
                onClick={becomeEducator}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-brand-700 border border-brand-200/70 hover:bg-brand-100 hover:border-brand-300 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
            </>
          )}

          <div className="h-5 w-px bg-slate-200"></div>

          {user ? (
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 ring-2 ring-brand-100",
                  },
                }}
              />
            </div>
          ) : (
            <button
              onClick={openSignIn}
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-brand-600 rounded-full hover:bg-brand-700 active:scale-95 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Get Started
            </button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            <button
              onClick={becomeEducator}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-brand-700 border border-brand-200/60"
            >
              {isEducator ? "Dashboard" : "Teach"}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/my-enrollments"
                className="p-1.5 text-xs text-slate-600 hover:text-brand-600"
                aria-label="My Enrollments"
              >
                <span className="font-medium">Courses</span>
              </Link>
              <UserButton />
            </div>
          ) : (
            <button
              onClick={openSignIn}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-600 rounded-full active:scale-95 transition-all shadow-xs"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;