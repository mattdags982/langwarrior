'use client'

import {
  Disclosure,
} from "@headlessui/react";
import { ReactNode } from "react";
import { usePathname } from 'next/navigation'
import { useAuth } from "../AuthContext";
import Image from "next/image";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ExampleProps {
  children: ReactNode;
}

export default function Example({ children }: ExampleProps) {
  const { user, logOut } = useAuth();
  const pathname = usePathname()
  const navigation = [
    { name: "Home", href: "/", current: pathname === "/" },
    { name: "Stories", href: "/modules", current: pathname === "/modules" },
  ];

  if (process.env.NODE_ENV === 'development') {
    navigation.push({ name: "Dev", href: "/modules/dev", current: pathname === "/dev" });
  }

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800 flex sm:justify-start justify-center">
        <div className="relative flex h-16 items-center justify-between sm:ml-6 w-full">
          <div className="flex space-x-6 sm:space-x-4 justify-center sm:justify-start w-full">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
              {item.name}
            </a>
          ))}
          </div>
          <div className="flex space-x-6 sm:space-x-4 justify-center sm:justify-end w-full">
              {user ? <div className="flex items-center">
                {user.photoURL && <Image src={user.photoURL} alt="User Avatar" width={32} height={32} className="w-8 h-8 rounded-full mr-2" />}
                <button
                onClick={logOut}
                aria-current={pathname === "/login" ? "page" : undefined}
                className={classNames(
                pathname === "/login"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                Logout
              </button></div> : <a
                href={"/modules/login"}
                aria-current={pathname === "/login" ? "page" : undefined}
                className={classNames(
                pathname === "/login"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                Login
              </a>}
          </div>
        </div>
      </Disclosure>
      {children}
    </>
  );
}
