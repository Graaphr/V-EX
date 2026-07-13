'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export type TutorialSubsection = {
    number: string;
    title: string;
    description?: string;
    steps: string[];
};

type TutorialSectionProps = {
    title: string;
    subtitle: string;
    intro: string;
    sections: TutorialSubsection[];
};

export default function TutorialSection({ title, subtitle, intro, sections }: TutorialSectionProps) {
    // Section pertama terbuka duluan biar pengguna langsung tahu formatnya
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (i: number) => {
        setOpenIndex((prev) => (prev === i ? null : i));
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="text-main-blue">
                <p className="font-poppins font-thin text-3xl sm:text-4xl leading-none">{title}</p>
                <p className="font-tilt-wrap font-bold text-3xl sm:text-4xl leading-none">{subtitle}</p>
            </div>

            <p className="font-poppins font-light text-gray-600 max-w-2xl">{intro}</p>

            <div className="flex flex-col gap-4">
                {sections.map((section, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div
                            key={section.number}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:border-main-blue/40 transition-all"
                        >
                            <button
                                type="button"
                                onClick={() => toggle(i)}
                                aria-expanded={isOpen}
                                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                            >
                                <span className="font-poppins font-medium text-main-blue text-sm sm:text-base">
                                    <span className="font-bold">{section.number}.</span> {section.title}
                                </span>
                                <FiChevronDown
                                    className={`text-lg text-main-blue shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-5 pb-5 flex flex-col gap-3 border-t border-gray-100 pt-4">
                                        {section.description && (
                                            <p className="font-poppins font-light text-gray-600 text-sm sm:text-base leading-relaxed">
                                                {section.description}
                                            </p>
                                        )}
                                        <ol className="flex flex-col gap-2 list-decimal list-inside marker:text-main-blue marker:font-medium">
                                            {section.steps.map((step, j) => (
                                                <li
                                                    key={j}
                                                    className="font-poppins font-light text-gray-600 text-sm sm:text-base leading-relaxed pl-1"
                                                >
                                                    {step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}