"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavItems, quickCreateItems } from "../config/navItems";
import { isPathActive } from "../model/isPathActive";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const isCreateButtonShown = pathname === "/" || pathname === "/chats";

  return (
    <nav className="relative h-16">
      {isCreateButtonShown ? (
        <button
          type="button"
          aria-label="빠른 생성 메뉴 닫기"
          onClick={() => setIsExpanded(false)}
          className={`fixed inset-y-0 left-1/2 z-40 w-full max-w-[500px] -translate-x-1/2 bg-black/20 transition-opacity duration-200 ${
            isExpanded ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      ) : null}
      {isCreateButtonShown ? (
        <div className="absolute bottom-22 right-7 z-50 flex flex-col items-end">
          <div
            className={`mb-3 flex flex-col items-end gap-3 transition-all duration-200 ${
              isExpanded ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {quickCreateItems.map((item, index) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsExpanded(false)}
                className={`flex translate-y-0 gap-1 items-center rounded-full border border-2 border-primary-purple bg-white text-label !font-[600] text-gray-700 transition-all duration-200 ${
                  isExpanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{ transitionDelay: isExpanded ? `${index * 45}ms` : "0ms" }}
                aria-label={item.label}
              >
                <span className="flex pl-1 h-8 w-8 items-center justify-center rounded-full text-primary">
                  <item.Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="pr-4">{item.label}</span>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? "빠른 생성 메뉴 닫기" : "빠른 생성 메뉴 열기"}
            className="flex h-12 w-12 items-center justify-center rounded-full border-1 border-primary-purple bg-primary-purple text-gray-purple shadow-[0_10px_20px_rgba(91,123,255,0.18)]"
          >
            {isExpanded ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" strokeWidth={2} />
            ) : (
              <PlusIcon className="h-6 w-6" aria-hidden="true" strokeWidth={2} />
            )}
          </button>
        </div>
      ) : null}
      <div className="grid h-full grid-cols-4 border-t border-t-1 border-gray-200">
        {bottomNavItems.map((item) => {
          const isActive = isPathActive({ pathname, href: item.href });

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-semibold ${
                isActive ? "text-primary-purple" : "text-gray-400"
              }`}
            >
              <item.Icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
