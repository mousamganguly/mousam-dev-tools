"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export default function PdfSplitterPage() {
    const [file, setFile] =
        useState<File | null>(null);

    const [mode, setMode] =
        useState("extract");

    const [input, setInput] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    // Parse: 2,5,7
    const parsePageList = (
        text: string
    ) => {
        return text
            .split(",")
            .map((x) =>
                parseInt(x.trim())
            )
            .filter((x) => !isNaN(x))
            .map((x) => x - 1);
    };

    // Parse: 1-5,6-10
    const parseRanges = (
        text: string
    ) => {
        return text
            .split(",")
            .map((range) => {
                const [
                    start,
                    end,
                ] = range
                    .trim()
                    .split("-")
                    .map(Number);

                return {
                    start:
                        start - 1,
                    end:
                        end - 1,
                };
            });
    };

    const downloadBlob = (
        blob: Blob,
        filename: string
    ) => {
        const url =
            window.URL.createObjectURL(
                blob
            );

        const a =
            document.createElement(
                "a"
            );

        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(
            url
        );
    };

    const splitPDF = async () => {
        if (!file) {
            alert(
                "Please upload a PDF"
            );
            return;
        }

        if (!input.trim()) {
            alert(
                "Please enter page numbers or ranges"
            );
            return;
        }

        try {
            setLoading(true);

            const bytes =
                await file.arrayBuffer();

            const pdf =
                await PDFDocument.load(
                    bytes
                );

            const totalPages =
                pdf.getPageCount();

            // ==========================
            // MODE 1: Extract pages
            // ==========================
            if (
                mode === "extract"
            ) {
                const pages =
                    parsePageList(
                        input
                    );

                const validPages =
                    pages.filter(
                        (page) =>
                            page >= 0 &&
                            page <
                                totalPages
                    );

                if (
                    validPages.length ===
                    0
                ) {
                    alert(
                        "No valid pages found"
                    );
                    return;
                }

                const newPdf =
                    await PDFDocument.create();

                const copiedPages =
                    await newPdf.copyPages(
                        pdf,
                        validPages
                    );

                copiedPages.forEach(
                    (page) =>
                        newPdf.addPage(
                            page
                        )
                );

                const pdfBytes =
                    await newPdf.save();

                const blob =
                    new Blob(
                        [
                            pdfBytes as BlobPart,
                        ],
                        {
                            type: "application/pdf",
                        }
                    );

                downloadBlob(
                    blob,
                    "selected-pages.pdf"
                );
            }

            // ==========================
            // MODE 2: Split by ranges
            // ==========================
            else {
                const ranges =
                    parseRanges(
                        input
                    );

                if (
                    ranges.length ===
                    0
                ) {
                    alert(
                        "Invalid range input"
                    );
                    return;
                }

                const zip =
                    new JSZip();

                for (
                    let i = 0;
                    i <
                    ranges.length;
                    i++
                ) {
                    const {
                        start,
                        end,
                    } = ranges[i];

                    const safeStart =
                        Math.max(
                            0,
                            start
                        );

                    const safeEnd =
                        Math.min(
                            totalPages -
                                1,
                            end
                        );

                    if (
                        safeStart >
                        safeEnd
                    ) {
                        continue;
                    }

                    const newPdf =
                        await PDFDocument.create();

                    const pages =
                        Array.from(
                            {
                                length:
                                    safeEnd -
                                    safeStart +
                                    1,
                            },
                            (
                                _,
                                idx
                            ) =>
                                safeStart +
                                idx
                        );

                    const copiedPages =
                        await newPdf.copyPages(
                            pdf,
                            pages
                        );

                    copiedPages.forEach(
                        (
                            page
                        ) =>
                            newPdf.addPage(
                                page
                            )
                    );

                    const pdfBytes =
                        await newPdf.save();

                    zip.file(
                        `part-${
                            i + 1
                        }.pdf`,
                        pdfBytes
                    );
                }

                const zipBlob =
                    await zip.generateAsync(
                        {
                            type: "blob",
                        }
                    );

                downloadBlob(
                    zipBlob,
                    "split-pdf.zip"
                );
            }
        } catch (error) {
            console.error(error);

            alert(
                "Failed to process PDF"
            );
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setFile(null);
        setInput("");
        setMode(
            "extract"
        );
    };

    return (
        <main className="min-h-screen bg-[#FFF8E8] p-8">
            <div className="mx-auto max-w-4xl">

                <Link
                    href="/"
                    className="text-sm text-slate-600 hover:text-black"
                >
                    ← Back to tools
                </Link>

                <h1 className="mt-6 text-4xl font-semibold text-[#5A3B2A]">
                    PDF Splitter
                </h1>

                <p className="mt-3 text-slate-600">
                    Extract specific
                    pages or split PDFs
                    by custom ranges.
                </p>

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

                    {/* Upload */}
                    <div className="mt-4">

                        <label className="block font-medium text-[#5A3B2A]">
                            Upload PDF
                        </label>

                        <label
                            htmlFor="pdf-upload"
                            className="mt-2 inline-flex cursor-pointer rounded-xl bg-[#5A3B2A] px-5 py-2 text-white hover:bg-[#CC7A00]"
                        >
                            Choose PDF
                        </label>

                        <input
                            id="pdf-upload"
                            type="file"
                            accept="application/pdf"
                            onChange={(
                                e
                            ) =>
                                setFile(
                                    e
                                        .target
                                        .files?.[0] ||
                                        null
                                )
                            }
                            className="hidden"
                        />

                        {file && (
                            <p className="mt-3 text-sm text-slate-600">
                                Selected
                                file:{" "}
                                <span className="font-medium">
                                    {
                                        file.name
                                    }
                                </span>
                            </p>
                        )}
                    </div>

                    {/* Mode */}
                    <div className="mt-6">
                        <label className="font-medium">
                            Mode
                        </label>

                        <select
                            value={
                                mode
                            }
                            onChange={(
                                e
                            ) =>
                                setMode(
                                    e
                                        .target
                                        .value
                                )
                            }
                            className="mt-2 w-full rounded-xl border p-3"
                        >
                            <option value="extract">
                                Extract
                                specific
                                pages
                            </option>

                            <option value="ranges">
                                Split by
                                ranges
                            </option>
                        </select>
                    </div>

                    {/* Input */}
                    <div className="mt-6">
                        <label className="font-medium">
                            {mode ===
                            "extract"
                                ? "Pages (example: 2,5,7)"
                                : "Ranges (example: 1-5,6-10)"}
                        </label>

                        <input
                            type="text"
                            value={
                                input
                            }
                            onChange={(
                                e
                            ) =>
                                setInput(
                                    e
                                        .target
                                        .value
                                )
                            }
                            placeholder={
                                mode ===
                                "extract"
                                    ? "2,5,7"
                                    : "1-5,6-10"
                            }
                            className="mt-2 w-full rounded-xl border p-3"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-3">

                        <button
                            onClick={
                                splitPDF
                            }
                            className="rounded-xl bg-[#5A3B2A] px-5 py-2 text-white hover:bg-[#CC7A00]"
                        >
                            {loading
                                ? "Processing..."
                                : "Process PDF"}
                        </button>

                        <button
                            onClick={
                                clearAll
                            }
                            className="rounded-xl border px-5 py-2"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}