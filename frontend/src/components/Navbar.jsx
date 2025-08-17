import { Link, useLocation } from "react-router";

import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";

import ThemeSelector from "./ThemeSelector"; // component

// custom hooks
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();

  const location = useLocation(); // finding current location of user
  const isChatPage = location.pathname?.startsWith("/chat"); // to check is the user on chat page for displaying logo and app name

  // when we don't use custome hook
  /*
  const queryClient = useQueryClient();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
*/

  // with custom hook
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex item-center mb-2">
      <div className="container mx-2 p-2 ">
        <div className="flex items-center justify-end w-full ">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  OmniChat
                </span>
              </Link>
            </div>
          )}

          {/* NOTIFICATION LINK */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* CALL THEME SELECTOR COMPONENT */}
          <ThemeSelector />

          {/* PROFILE PICTURE */}
          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
