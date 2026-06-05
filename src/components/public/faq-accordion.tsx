"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={isOpen ? "border-l-2 border-brand-gold" : ""}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className={`flex w-full items-center justify-between px-6 py-5 text-left transition-colors ${
                isOpen ? "bg-brand-gold-light/30" : "hover:bg-gray-50"
              }`}
              aria-expanded={isOpen}
            >
              <span className={`pr-4 font-medium ${isOpen ? "text-brand-blue" : "text-gray-900"}`}>
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-brand-gold" : "text-gray-500"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-5 pt-1 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
