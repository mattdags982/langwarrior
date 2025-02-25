"use client";

import { useState } from "react";
import { Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { Blurb } from "@/app/types";

interface BlurbProps {
  blurb: Blurb;
  languageCode: string;
}

const transitionClasses = {
  enter: "transition-all duration-600 ease-in-out",
  enterFrom: "max-h-0 overflow-hidden",
  enterTo: "max-h-screen overflow-visible",
  leave: "transition-all duration-600 ease-in-out",
  leaveFrom: "max-h-screen overflow-visible",
  leaveTo: "max-h-0 overflow-hidden",
};

export default function BlurbRead({ blurb, languageCode }: BlurbProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  const translation = blurb.translations.find(
    (translation) => translation.languageCode === languageCode
  );

  return (
    <li key={blurb.id} className="py-6">
      <div className="w-full">
        <div>
          <p className="text-lg font-medium mb-4">{blurb.characterName}:</p>
          <p className="text-lg">
            {translation ? translation.translatedContent : ""}
          </p>
        </div>
        <Transition show={showTranslation} {...transitionClasses}>
          <p className="text-lg text-gray-500 mt-6">{blurb.contentEnglish}</p>
        </Transition>
      </div>
      <div className="relative mt-6">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              setShowTranslation(!showTranslation);
            }}
          >
            <ChevronUpIcon
              className={`text-gray-300 size-4 stroke-2 transition-transform duration-300 ${
                showTranslation ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </li>
  );
}
