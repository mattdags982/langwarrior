"use client";

import { useState } from "react";
import { Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { Blurb } from "@/app/types";

interface BlurbProps {
  blurb: Blurb;
}

const transitionClasses = {
  enter: "transition-all duration-600 ease-in-out",
  enterFrom: "max-h-0 overflow-hidden",
  enterTo: "max-h-screen overflow-visible",
  leave: "transition-all duration-600 ease-in-out",
  leaveFrom: "max-h-screen overflow-visible",
  leaveTo: "max-h-0 overflow-hidden",
};

export default function BlurbWrite({ blurb }: BlurbProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const translation = blurb.translations.find(
    (translation) => translation.languageCode === "es"
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const normalizeText = (text: string) => {
    return text
      .normalize("NFD") // Normalize to NFD (Normalization Form Decomposition)
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
      .replace(/\(.*?\)/g, "") // Remove text within parentheses
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿]/g, "") // Remove punctuation and question marks
      .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
      .trim()
      .toLowerCase(); // Convert to lowercase
  };

  const isCorrect =
    translation &&
    normalizeText(inputValue) === normalizeText(translation.translatedContent);

  return (
    <li key={blurb.id} className="py-6">
      <div className="w-full">
        <div>
          <p className="text-lg font-medium mb-4">{blurb.characterName}:</p>
          <p className="text-lg mb-4">{blurb.contentEnglish}</p>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            className={`text-lg p-2 border w-full ${
              isCorrect ? "border-green-500" : "border-gray-300"
            }`}
            placeholder="Type the translation here"
            rows={4}
          />
        </div>
        <Transition show={showTranslation} {...transitionClasses}>
          <p className="text-lg text-gray-500 mt-6">
            {translation ? translation.translatedContent : ""}
          </p>
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
