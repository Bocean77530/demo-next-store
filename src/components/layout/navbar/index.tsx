import { getMenu } from "@/lib/shopify";
import { Menu } from "@/lib/shopify/types";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Search from "./search";
import LogoSquare from "@/components/logo-square";
import CartModal from "@/components/cart/modal";
import { User } from "lucide-react";
import MegaMenu from "./mega-menu";

export async function Navbar() {
  const menu = await getMenu("sidebar-menu");
  
  return (
    <nav className="flex h-16 items-center justify-between p-4 lg:px-6 sticky top-0 backdrop-blur-sm z-999">
      <div className="block flex-none md:hidden">
        <MobileMenu menu={[]} />
      </div>
      <div className="flex h-full w-full items-center">
        <div className="flex h-full w-full md:w-1/3">
          <Link
            href={"/"}
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            {/* <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {process.env.SITE_NAME}
            </div> */}
          </Link>

          {/* {menu.length > 0 ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-gray-700 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null} */}
          <div className="hidden gap-6 text-sm md:flex md:items-center md:h-9">
            <MegaMenu />
          </div>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Search />
        </div>
        <div className="flex justify-end items-center gap-4 md:w-1/3">
          <Link
            href="https://shopify.com/73808052381/account"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:scale-110 transition-opacity"
            aria-label="Account"
          >
            <User size={24} className="text-gray-700 dark:text-neutral-400" />
          </Link>
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
