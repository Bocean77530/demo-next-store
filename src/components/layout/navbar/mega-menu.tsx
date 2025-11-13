"use client";

import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { jewelryLinks, collectionLinks, cultureLinks } from "./consts";

export default function MegaMenu() {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  return (
    <div
      className="h-14 border-b-2 border-transparent transition-colors duration-500 hover:border-b-black "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      
    >
      <Link
        href="/search"
        prefetch={true}
        aria-expanded={open}
        className="flex items-center justify-center h-full text-black hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300"
      >
        <span className=" text-sm font-medium">SHOP</span>
      </Link>

      <div
        role="MegaMenu"
        aria-hidden={!open}
        className={clsx(
          "absolute w-full translate-y-0.5 left-0 z-1 transition-all duration-500 ease-out",
          open ? " translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
        
      >
        <div className=" border border-neutral-200/70 bg-white p-6 shadow-xl shadow-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/40">
          
          <div className="grid grid-cols-3 gap-10" >
            <MegaMenuColumn title="Jewelry" links={jewelryLinks} />
            <MegaMenuColumn title="Collections" links={collectionLinks} />
            <MegaMenuColumn title="Culture" links={cultureLinks} />
          </div>
        </div>
      </div>
    </div>
  );
}

type MegaMenuColumnProps = {
  title: string;
  links: { label: string; href: string }[];
};

function MegaMenuColumn({ title, links }: MegaMenuColumnProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          {title}
        </p>
        <span className="block h-px w-12 bg-neutral-300 dark:bg-neutral-600" aria-hidden="true" />
      </div>
      <ul className="space-y-1" role="none">
        {links.map((link) => (
          <li key={link.label} role="none">
            <Link
              href={link.href}
              role="menuitem"
              className="block text-sm font-medium text-neutral-800 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

