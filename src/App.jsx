import React, { useState } from "react";
import {
  Link as RouterLink,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { Map } from "./Map";

/*
 * Using Tailwind CSS for styling.
 * See: https://tailwindcss.com
 */

export const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col w-full">
      <div>
        <div className="relative p-4 border-b-2 border-indigo-400">
          <nav
            className="relative flex items-center justify-between sm:h-10 lg:justify-start"
            aria-label="Global"
          >
            <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div className="flex items-center justify-between w-full md:w-auto">
                <div>
                  <span className="sr-only">Geosoftware</span>
                  <span className="h-6 w-6 text-3xl">🌍</span>
                </div>
                <div className="-mr-2 flex items-center md:hidden">
                  <button
                    type="button"
                    onClick={() => setShowMenu(true)}
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    {/* Heroicon name: outline/menu */}
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
              <Link to="/" active={pathname === "/"}>
                Map
              </Link>
              <Link to="/about" active={pathname === "/about"}>
                About
              </Link>
            </div>
          </nav>
        </div>

        <div
          className={`absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden ${
            showMenu ? "" : "hidden"
          } z-10`}
        >
          <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5 pt-4 flex items-center justify-between">
              <div>
                <span className="h-6 w-6 text-3xl">🌍</span>
              </div>
              <div className="-mr-2">
                <button
                  type="button"
                  onClick={() => setShowMenu(false)}
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Close main menu</span>
                  {/* Heroicon name: outline/x */}
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                active={pathname === "/"}
                onClick={() => setShowMenu(false)}
                className="block px-3 py-2 rounded-md  hover:bg-gray-50"
              >
                Map
              </Link>
              <Link
                to="/about"
                active={pathname === "/about"}
                onClick={() => setShowMenu(false)}
                className="block px-3 py-2 rounded-md hover:bg-gray-50"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* React router dom for routing: */}
      <Switch>
        <Route path="/about">
          <div className="flex flex-col flex-1 flex-start text-center p-6">
            <h1 className="text-3xl text-indigo-600">About</h1>
            <div className="py-4">
              For information see&nbsp;
              <a
                href="https://github.com/nschnierer/geosoft-1-2021"
                className="text-indigo-600 underline"
              >
                GitHub
              </a>
              .
            </div>
          </div>
        </Route>

        <Route path="/">
          <Map />
        </Route>
      </Switch>
    </div>
  );
};

/* eslint-disable react/prop-types */
const Link = ({
  to = "",
  active = false,
  children,
  className = "",
  onClick = () => {},
}) => (
  <RouterLink
    to={to}
    className={`${className} 
      ${
        active
          ? "font-medium text-gray-500 hover:text-gray-900"
          : "font-medium text-indigo-600 hover:text-indigo-500"
      }
    `}
    onClick={onClick}
  >
    {children}
  </RouterLink>
);
