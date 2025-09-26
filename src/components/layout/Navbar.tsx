"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                SocialBlast
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === "/"
                    ? "border-indigo-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200"
                }`}
              >
                Home
              </Link>
              <Link
                href="/phone-numbers"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === "/phone-numbers"
                    ? "border-indigo-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200"
                }`}
              >
                Phone Numbers
              </Link>
              <Link
                href="/esim"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === "/esim"
                    ? "border-indigo-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200"
                }`}
              >
                eSIM
              </Link>
              <Link
                href="/gift-cards"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === "/gift-cards"
                    ? "border-indigo-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200"
                }`}
              >
                Gift Cards
              </Link>
              <Link
                href="/smm"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  pathname === "/smm"
                    ? "border-indigo-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200"
                }`}
              >
                SMM Services
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="rounded-full bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {theme === "dark" ? <FiSun className="h-6 w-6" /> : <FiMoon className="h-6 w-6" />}
            </button>
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700"
            >
              Register
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            <Link
              href="/"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname === "/"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-gray-800 dark:text-indigo-400"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/phone-numbers"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname === "/phone-numbers"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-gray-800 dark:text-indigo-400"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              Phone Numbers
            </Link>
            <Link
              href="/esim"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname === "/esim"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-gray-800 dark:text-indigo-400"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              eSIM
            </Link>
            <Link
              href="/gift-cards"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname === "/gift-cards"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-gray-800 dark:text-indigo-400"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              Gift Cards
            </Link>
            <Link
              href="/smm"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname === "/smm"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-gray-800 dark:text-indigo-400"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              SMM Services
            </Link>
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="rounded-full bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {theme === "dark" ? <FiSun className="h-6 w-6" /> : <FiMoon className="h-6 w-6" />}
                </button>
              </div>
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}