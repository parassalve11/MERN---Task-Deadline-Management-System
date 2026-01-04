

import { Bell, Bookmark, Home, MessageSquare, Search, Settings, User, Shield, Twitter, Github, LayoutDashboard } from "lucide-react";
import Navbar from "./Navbar";
import SidebarLayout from "../UI/sidebar/SidebarLayout";
// import { FaGithub, FaTwitter } from "react-icons/fa";
import { useLocation } from "react-router-dom"; // Import useLocation

function Layout({ children }) {
  const location = useLocation(); 


  const menuItems = [
    { label: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { label: "Dashboard", href: "/Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Notification", href: "/notification", icon: <Search className="h-5 w-5" /> },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      subItems: [
        { label: "Profile", href: "/settings/profile", icon: <User className="h-4 w-4" /> },
      
      ],
    },
  ];

  // Define routes where the sidebar should be hidden
  const hideSidebarRoutes = ["/signup","/signin"];

  // Check if the current route is one where the sidebar should be hidden
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname) 

  return (
    <div className="min-h-screen bg-white overflow-visible">
      
      {shouldHideSidebar ? (
        <main className="h-screen">{children}</main>
      ) : (
        <>
        <Navbar />
        <SidebarLayout
          menuItems={menuItems}
          logo={<div className="text-2xl font-bold text-blue-600">MyApp</div>}
          footer={
            <div className="flex flex-col gap-3 p-4 bg-gradient-to-t from-gray-100 to-white rounded-lg shadow-sm">
              <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
              <div className="text-xs text-gray-500 text-center">
                © 2025 MyApp. All rights reserved.
              </div>
            </div>
          }
        >
          <main className="h-screen">{children}</main>
        </SidebarLayout>
        </>
      )}
    </div>
  );
}

export default Layout;