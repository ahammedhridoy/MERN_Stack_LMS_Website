import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={assets.eduka}
            alt="Eduka Logo"
            className="w-10 sm:w-11 transition-transform group-hover:scale-105"
          />
          <span className="text-lg font-bold text-slate-900 tracking-tight hidden sm:inline">
            Eduka
          </span>
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/70">
          Educator Studio
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 text-sm">
        <Link
          to="/"
          className="text-xs sm:text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors hidden md:inline-flex items-center gap-1"
        >
          <span>←</span>
          <span>Switch to Student View</span>
        </Link>

        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800">
              {user ? user.fullName : "Educator"}
            </p>
            <p className="text-[11px] text-slate-400">Instructor Account</p>
          </div>

          {user ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 ring-2 ring-brand-100",
                },
              }}
            />
          ) : (
            <img
              className="w-8 h-8 rounded-full border"
              src={assets.profile_img}
              alt="Profile"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;