"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
    ProdiType,
} from "@/components/shared/filter/SelectProdi";

import {
    TahunType,
} from "@/components/shared/filter/SelectTahun";

import {
    SemesterType,
} from "@/components/shared/filter/SelectSemester";

import FilterSection from "@/components/pameran/FilterSection";
import CategorySection from "@/components/pameran/CategorySection";

import {
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

import ALL_KARYA from "@/public/data/Karya.json";
import ALL_PAMERAN from "@/public/data/Pameran.json";

/* =========================
   TYPES
========================= */
interface KaryaProps {
    href?: string;
}

interface KaryaItem {
    id: number;
    title: string;
    category: string;
    image: string;
    year: string;
    semester?: string;
    description?: string;
    booth?: string;
    exhibitionId?: number;
}

interface PameranItem {
    id: number;
    title: string;
}

/* =========================
   CARD
========================= */
function PosterCard({
    karya,
}: {
    karya: KaryaItem;
}) {
    const pameran = (
        ALL_PAMERAN as PameranItem[]
    ).find(
        (item) =>
            item.id === karya.exhibitionId
    );

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group">
            <div className="relative aspect-[3/4] w-full">
                <Image
                    src={karya.image}
                    alt={karya.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                />
            </div>

            <div className="p-3">
                <h3 className="font-bold text-sm line-clamp-2">
                    {karya.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                    {karya.category}
                </p>

                {pameran && (
                    <p className="text-xs text-main-blue mt-1 line-clamp-1">
                        {pameran.title}
                    </p>
                )}
            </div>
        </div>
    );
}

/* =========================
   HEADER PAGINATION
========================= */
function SectionHeader({
    title,
    currentPage,
    totalPages,
    onNext,
    onPrev,
}: any) {
    const showPagination =
        totalPages > 1;

    return (
        <div className="flex justify-between items-center mb-4 gap-3">
            <h3 className="font-semibold text-[18px] sm:text-[22px] border-b-2 w-full pb-2">
                Karya Saya
            </h3>

            {showPagination && (
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={onPrev}
                        disabled={
                            currentPage === 1
                        }
                        className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-40"
                    >
                        <FiChevronLeft />
                    </button>

                    <span className="text-sm font-medium min-w-[45px] text-center">
                        {currentPage}/{totalPages}
                    </span>

                    <button
                        onClick={onNext}
                        disabled={
                            currentPage ===
                            totalPages
                        }
                        className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-40"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}

/* =========================
   PAGE
========================= */
export default function PageKarya({
    href = "/ketua-pbl/karya/",
}: KaryaProps) {
    const [selectedProdi, setSelectedProdi] =
        useState<ProdiType | null>(null);

    const [selectedTahun, setSelectedTahun] =
        useState<TahunType | null>(null);

    const [
        selectedSemester,
        setSelectedSemester,
    ] = useState<SemesterType | null>(
        null
    );

    const [search, setSearch] =
        useState("");

    const [pages, setPages] =
        useState<
            Record<string, number>
        >({});

    const PER_PAGE = 4;

    const isFiltering =
        selectedProdi ||
        selectedTahun ||
        selectedSemester ||
        search.trim() !== "";

    /* =========================
       CHANGE PAGE
    ========================= */
    const changePage = (
        category: string,
        type: "next" | "prev",
        totalPages: number
    ) => {
        setPages((prev) => {
            const current =
                prev[category] || 1;

            const nextPage =
                type === "next"
                    ? Math.min(
                        current + 1,
                        totalPages
                    )
                    : Math.max(
                        current - 1,
                        1
                    );

            return {
                ...prev,
                [category]: nextPage,
            };
        });
    };

    /* =========================
       FILTER DATA
    ========================= */
    const filteredData =
        useMemo(() => {
            return (
                ALL_KARYA as KaryaItem[]
            ).filter((item) => {
                const matchSearch =
                    item.title
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    item.category
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchProdi =
                    !selectedProdi ||
                    item.category ===
                    selectedProdi.name;

                const matchTahun =
                    !selectedTahun ||
                    item.year ===
                    selectedTahun.name;

                const matchSemester =
                    !selectedSemester ||
                    item.semester ===
                    selectedSemester.name;

                return (
                    matchSearch &&
                    matchProdi &&
                    matchTahun &&
                    matchSemester
                );
            });
        }, [
            search,
            selectedProdi,
            selectedTahun,
            selectedSemester,
        ]);

    /* =========================
       CATEGORY AUTO
    ========================= */
    const categories = [
        ...new Set(
            filteredData.map(
                (i) => i.category
            )
        ),
    ];

    return (
        <div className="min-h-screen bg-secondary-color font-poppins">

            {/* HERO */}
            <section className="bg-main-blue rounded-b-[25px] md:rounded-b-[40px] py-6">
                <div className="autoMid">
                    <FilterSection
                        search={search}
                        setSearch={setSearch}
                        selectedProdi={
                            selectedProdi
                        }
                        setSelectedProdi={
                            setSelectedProdi
                        }
                        selectedTahun={
                            selectedTahun
                        }
                        setSelectedTahun={
                            setSelectedTahun
                        }
                        selectedSemester={
                            selectedSemester
                        }
                        setSelectedSemester={
                            setSelectedSemester
                        }
                    />
                </div>
            </section>

            {/* CONTENT */}
            <main className="autoMid py-10 space-y-10">

                {/* =========================
            FILTER MODE
        ========================= */}
                {isFiltering ? (
                    categories.map((cat) => (
                        <CategorySection
                            key={cat}
                            title={cat}
                        >
                            {filteredData
                                .filter(
                                    (item) =>
                                        item.category ===
                                        cat
                                )
                                .map((karya) => (
                                    <Link
                                        key={karya.id}
                                        href={`${href}${karya.id}`}
                                    >
                                        <PosterCard
                                            karya={karya}
                                        />
                                    </Link>
                                ))}
                        </CategorySection>
                    ))
                ) : (
                    /* =========================
                       DEFAULT MODE PAGINATION
                    ========================= */
                    categories.map((cat) => {
                        const data =
                            filteredData.filter(
                                (item) =>
                                    item.category ===
                                    cat
                            );

                        const totalPages =
                            Math.ceil(
                                data.length /
                                PER_PAGE
                            );

                        const currentPage =
                            pages[cat] || 1;

                        const start =
                            (currentPage - 1) *
                            PER_PAGE;

                        const currentData =
                            data.slice(
                                start,
                                start +
                                PER_PAGE
                            );

                        return (
                            <section
                                key={cat}
                            >
                                <SectionHeader
                                    title={cat}
                                    currentPage={
                                        currentPage
                                    }
                                    totalPages={
                                        totalPages
                                    }
                                    onPrev={() =>
                                        changePage(
                                            cat,
                                            "prev",
                                            totalPages
                                        )
                                    }
                                    onNext={() =>
                                        changePage(
                                            cat,
                                            "next",
                                            totalPages
                                        )
                                    }
                                />

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                                    {currentData.map(
                                        (
                                            karya
                                        ) => (
                                            <Link
                                                key={
                                                    karya.id
                                                }
                                                href={`${href}${karya.id}`}
                                            >
                                                <PosterCard
                                                    karya={
                                                        karya
                                                    }
                                                />
                                            </Link>
                                        )
                                    )}
                                </div>
                            </section>
                        );
                    })
                )}
            </main>
        </div>
    );
}