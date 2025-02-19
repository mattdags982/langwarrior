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
      <div className="relative">
        <Disclosure as="nav" className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "text-white border-b-2 border-blue-400"
                        : "text-slate-300 hover:text-white hover:border-slate-400 border-b-2 border-transparent",
                      "inline-flex items-center px-1 pt-1 text-sm font-medium h-16 transition-colors duration-200"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    {user.photoURL && (
                      <div className="relative">
                        <Image
                          src={user.photoURL}
                          alt="User Avatar"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full ring-2 ring-blue-400"
                        />
                      </div>
                    )}
                    <button
                      onClick={logOut}
                      className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <a
                    href="/modules/login"
                    className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900"
                  >
                    Login
                  </a>
                )}
              </div>
            </div>
          </div>
        </Disclosure>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
      {children}
    </>
  );
}
