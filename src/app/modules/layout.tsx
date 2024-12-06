'use client'

import {
  Disclosure,
} from "@headlessui/react";
import { ReactNode } from "react";
import { usePathname } from 'next/navigation'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ExampleProps {
  children: ReactNode;
}

export default function Example({ children }: ExampleProps) {
  const pathname = usePathname()
  const navigation = [
    { name: "Home", href: "/", current: pathname === "/" },
    { name: "Stories", href: "/modules", current: pathname === "/modules" },
  ];
  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="relative flex h-16 items-center justify-between sm:ml-6">
          <div className="flex space-x-4">
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
        </div>
      </Disclosure>
      {children}
    </>
  );
}
