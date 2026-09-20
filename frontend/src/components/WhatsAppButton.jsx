import React from "react";
import { whatsappNumber } from "../data/data";

export default function WhatsAppButton() {
  if (!whatsappNumber) return null;

  const href = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="
        fixed bottom-6 right-6
        sm:bottom-8 sm:right-8
        z-50
        group
      "
    >
      <div
        className="
          flex items-center
          bg-white
          rounded-full
          pl-2 pr-4 py-2
          shadow-[0_6px_25px_rgba(0,0,0,0.16)]
          border border-gray-100
          transition-all duration-300
          hover:shadow-[0_8px_30px_rgba(37,211,102,0.25)]
          hover:-translate-y-1
        "
      >
        {/* WhatsApp Icon */}
        <div
          className="
            w-12 h-12
            sm:w-14 sm:h-14
            rounded-full
            bg-[#25D366]
            flex items-center justify-center
            text-white
            shadow-sm
            transition-transform duration-300
            group-hover:scale-105
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M380.9 97.1C339.5 55.7 285 32 226.8 32 101.5 32 0 133.5 0 258.8c0 45.6 12 90 34.8 128.9L0 480l97.1-32.5c36.9 20.4 78.1 31 120 31 125.3 0 226.8-101.5 226.8-226.8 0-58.2-23.7-112.6-66-154zM226.8 395.2c-34.8 0-68.8-9.1-99.1-26.3l-7.1-4.2-58.6 19.6 19.7-57.1-4.1-6.9c-17.4-29.1-26.4-62.8-26.4-97.5 0-100.5 81.8-182.3 182.3-182.3 48.7 0 94.5 19 128.9 53.5 34.4 34.4 53.5 80.2 53.5 128.9 0 100.5-81.8 182.3-182.3 182.3zM328.8 292.6c-5.4-2.7-31.9-15.7-36.8-17.5-4.9-1.8-8.5-2.7-12.1 2.7-3.6 5.4-14 17.5-17.1 21.1-3.1 3.6-6.2 4-11.6 1.3-31.5-15.7-52-27.9-73.1-63.5-5.8-9.9 5.8-9.2 16.6-30.6 1.8-3.6.9-6.7-.5-9.4-1.4-2.7-12.1-29.1-16.6-39.8-4.4-10.4-8.9-9-12.1-9.1-3.1-.1-6.7-.1-10.2-.1-3.6 0-9.4 1.3-14.3 6.7-4.9 5.4-18.8 18.4-18.8 44.8s19.3 52 22 55.6c2.7 3.6 38 58 92.2 79.7 64.5 25.2 64.5 17 76 15.9 11.6-1 31.9-13 36.4-25.6 4.6-12.7 4.6-23.6 3.2-25.6-1.4-2-5.1-3.6-10.5-6.3z" />
          </svg>
        </div>

        {/* Contact text */}
        <div className="ml-3 hidden sm:block">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
            Contact Us
          </p>

          <p className="text-sm font-semibold text-gray-800">
            WhatsApp
          </p>
        </div>

        {/* Arrow */}
        <div
          className="
            hidden sm:flex
            ml-3
            w-7 h-7
            items-center justify-center
            rounded-full
            bg-gray-100
            text-gray-500
            transition-all duration-300
            group-hover:bg-[#25D366]
            group-hover:text-white
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M13 6l6 6-6 6"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
