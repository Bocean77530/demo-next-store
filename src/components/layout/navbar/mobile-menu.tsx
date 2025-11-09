"use client";

import { Menu } from "@/lib/shopify/types";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import Search from "./search";
import {
  MobileNavItem,
  mobileNavItems
} from "./consts";
import { ChevronLeft, ChevronRight, Menu as MenuIcon, X } from "lucide-react";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<MobileNavItem | null>(null);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  const topLevelItems = useMemo<MobileNavItem[]>(() => {
    if (menu.length === 0) return mobileNavItems;
    // merge Shopify menu with custom mobile nav items by matching titles
    const configuredByLabel = Object.fromEntries(
      mobileNavItems.map((item) => [item.label.toLowerCase(), item])
    );
    return menu.map((item) => {
      const custom = configuredByLabel[item.title.toLowerCase()];
      if (custom) {
        return {
          ...custom,
          label: item.title,
          href: custom.href ?? item.path
        };
      }
      return {
        label: item.title,
        href: item.path
      };
    });
  }, [menu]);

  const handleNavigate = (item: MobileNavItem) => {
    if (item.children && item.children.length) {
      console.log(item);
      setActiveItem(item);
      return;
    }
    if (item.href) {
      setActiveItem(null);
      closeMobileMenu();
    }
  };

  const handleClose = () => {
    setActiveItem(null);
    closeMobileMenu();
  };

  const handleBack = () => setActiveItem(null);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={handleClose} className="relative z-999">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black">
              <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={handleClose}
                  aria-label="Close mobile menu"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="mb-4 w-full">
                  <Search />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {activeItem ? (
                  <SubmenuView
                    item={activeItem}
                    onBack={handleBack}
                    onNavigate={handleClose}
                  />
                ) : (
                  <TopLevelView
                    items={topLevelItems}
                    onSelect={handleNavigate}
                    onDirectNavigate={handleClose}
                  />
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

type TopLevelViewProps = {
  items: MobileNavItem[];
  onSelect: (item: MobileNavItem) => void;
  onDirectNavigate: () => void;
};

function TopLevelView({
  items,
  onSelect,
  onDirectNavigate
}: TopLevelViewProps) {
  return (
    <ul className="flex w-full flex-col px-4 py-6">
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        if (hasChildren) {
          return (
            <li key={item.label} className="border-b border-neutral-200 py-4 dark:border-neutral-800">
              <button
                onClick={() => onSelect(item)}
                className="flex w-full items-center justify-between text-lg font-semibold uppercase tracking-wide text-black dark:text-white"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </li>
          );
        }

        if (item.href) {
          return (
            <li key={item.label} className="border-b border-neutral-200 py-4 dark:border-neutral-800">
              <Link
                href={item.href}
                prefetch={true}
                onClick={onDirectNavigate}
                className="block text-lg font-semibold uppercase tracking-wide text-black transition-colors hover:text-neutral-500 dark:text-white dark:hover:text-neutral-300"
              >
                {item.label}
              </Link>
            </li>
          );
        }

        return null;
      })}
    </ul>
  );
}

type SubmenuViewProps = {
  item: MobileNavItem;
  onBack: () => void;
  onNavigate: () => void;
};

function SubmenuView({ item, onBack, onNavigate }: SubmenuViewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          
        </button>
        <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-black dark:text-white">
          {item.label}
        </h2>
        <button
          onClick={onNavigate}
          className="opacity-0 pointer-events-none"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        
      </div>
      <ul className="flex-1 space-y-1 px-4 py-6">
        {item.children?.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              prefetch={true}
              onClick={onNavigate}
              className="block py-3 text-lg font-medium text-black transition-colors hover:text-neutral-500 dark:text-white dark:hover:text-neutral-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
