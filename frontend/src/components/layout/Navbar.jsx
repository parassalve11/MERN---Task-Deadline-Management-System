// components/Navbar.jsx

import { Link } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { User2 } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated } = useUserStore();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/">
            <img
              className="mx-auto size-10 transition-transform duration-300 hover:scale-105 "
              src="/logo.png"
              alt="YourBrand"
            />
          </a>

          {isAuthenticated ? (
            <div className="flex items-center  ">
              {/* <DropdownComponent
                triggerElement={<AvatarComponent src={authUser.avatar} />}
                options={options}
                className="z-50"
                onSelect={handleOptionSelect}
                variant="default"
              /> */}

              <User2 className="border rounded-2xl size-10 text-white bg-blue-500 border-blue-700" />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to={"/signup"}>
                <button className="w-full bg-blue-500 font-semibold  text-white px-3 py-2 border rounded-2xl">
                  SignUp
                </button>
              </Link>
              <Link to={"/signin"}>
                <button className="w-full bg-blue-500 font-semibold  text-white px-3 py-2 border rounded-2xl">
                  SignIn
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
