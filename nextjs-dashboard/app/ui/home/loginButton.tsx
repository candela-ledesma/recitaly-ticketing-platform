

import { useSession, signIn, signOut } from "next-auth/react";
import { PowerIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
   const btnClass =
    "flex items-center gap-2 rounded-md bg-pink-200 text-[#23232b] p-2 px-4 text-sm font-medium hover:bg-pink-300 transition";

  return  (
    <div>
      {isLoggedIn ? (
        <button
          onClick={() => signOut()}
          className={btnClass}
          aria-label="Log out"
        >
          <PowerIcon className="w-6 h-6" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className={btnClass}
          aria-label="Log in"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          <span className="hidden sm:inline">Log In</span>
        </button>
      )}
    </div>
  );
    }