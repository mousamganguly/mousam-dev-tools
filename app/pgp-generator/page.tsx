"use client";

import { useState } from "react";
import Link from "next/link";
import * as openpgp from "openpgp";

export default function PGPGeneratorPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [passphrase, setPassphrase] =
        useState("");

    const [keyType, setKeyType] =
        useState("ecc");

    const [publicKey, setPublicKey] =
        useState("");

    const [privateKey, setPrivateKey] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const generateKeys = async () => {
        try {
            setLoading(true);

            const userIDs = [
                {
                    name:
                        name.trim() ||
                        "Anonymous",
                    ...(email.trim() && {
                        email: email.trim(),
                    }),
                },
            ];

            let generated;

            // ECC (recommended)
            if (keyType === "ecc") {
                generated =
                    await openpgp.generateKey({
                        type: "ecc",
                        curve: "ed25519",
                        userIDs,
                        passphrase,
                    });
            }

            // RSA 2048
            else if (
                keyType === "rsa2048"
            ) {
                generated =
                    await openpgp.generateKey({
                        type: "rsa",
                        rsaBits: 2048,
                        userIDs,
                        passphrase,
                    });
            }

            // RSA 4096
            else {
                generated =
                    await openpgp.generateKey({
                        type: "rsa",
                        rsaBits: 4096,
                        userIDs,
                        passphrase,
                    });
            }

            setPublicKey(
                generated.publicKey
            );

            setPrivateKey(
                generated.privateKey
            );
        } catch (error) {
            console.error(error);

            alert(
                "Failed to generate PGP keys"
            );
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (
        text: string
    ) => {
        try {
            await navigator.clipboard.writeText(
                text
            );

            alert("Copied!");
        } catch {
            alert("Copy failed");
        }
    };

    const downloadFile = (
        content: string,
        filename: string
    ) => {
        const blob = new Blob(
            [content],
            {
                type: "text/plain",
            }
        );

        const url =
            window.URL.createObjectURL(
                blob
            );

        const a =
            document.createElement("a");

        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setName("");
        setEmail("");
        setPassphrase("");
        setKeyType("ecc");

        setPublicKey("");
        setPrivateKey("");
    };

    return (
        <main className="min-h-screen bg-[#FFF8E8] p-8">

            <div className="mx-auto max-w-5xl">

                <Link
                    href="/"
                    className="text-sm text-slate-600 hover:text-black"
                >
                    ← Back to tools
                </Link>

                <h1 className="mt-6 text-4xl font-semibold text-[#5A3B2A]">
                    PGP Key Generator
                </h1>

                <p className="mt-3 text-slate-600">
                    Generate secure public
                    and private PGP keys
                    locally in your browser.
                </p>

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

                    {/* Inputs */}
                    <div className="grid gap-4 md:grid-cols-2">

                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target
                                        .value
                                )
                            }
                            className="rounded-xl border p-3"
                        />

                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target
                                        .value
                                )
                            }
                            className="rounded-xl border p-3"
                        />

                    </div>

                    <input
                        type="password"
                        placeholder="Passphrase"
                        value={passphrase}
                        onChange={(e) =>
                            setPassphrase(
                                e.target
                                    .value
                            )
                        }
                        className="mt-4 w-full rounded-xl border p-3"
                    />

                    {/* Key Type */}
                    <div className="mt-4">

                        <label className="font-medium text-[#5A3B2A]">
                            Key Type
                        </label>

                        <select
                            value={keyType}
                            onChange={(e) =>
                                setKeyType(
                                    e.target
                                        .value
                                )
                            }
                            className="mt-2 w-full rounded-xl border p-3"
                        >
                            <option value="ecc">
                                ECC (Recommended)
                            </option>

                            <option value="rsa2048">
                                RSA 2048
                            </option>

                            <option value="rsa4096">
                                RSA 4096
                            </option>
                        </select>

                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                        Keys are generated
                        locally in your
                        browser. Nothing is
                        sent to any server.
                    </p>

                    {/* Buttons */}
                    <div className="mt-5 flex flex-wrap gap-3">

                        <button
                            onClick={
                                generateKeys
                            }
                            className="rounded-xl bg-[#5A3B2A] px-5 py-2 text-white hover:bg-[#CC7A00]"
                        >
                            {loading
                                ? "Generating..."
                                : "Generate Keys"}
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

                {/* Generated Keys */}
                {publicKey && (
                    <div className="mt-8 space-y-6">

                        {/* Public Key */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <div className="flex flex-wrap items-center justify-between gap-3">

                                <h2 className="text-lg font-semibold text-[#5A3B2A]">
                                    Public Key
                                </h2>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                publicKey
                                            )
                                        }
                                        className="rounded-lg border px-4 py-2"
                                    >
                                        Copy
                                    </button>

                                    <button
                                        onClick={() =>
                                            downloadFile(
                                                publicKey,
                                                "public.asc"
                                            )
                                        }
                                        className="rounded-lg border px-4 py-2"
                                    >
                                        Download
                                    </button>

                                </div>

                            </div>

                            <textarea
                                readOnly
                                value={
                                    publicKey
                                }
                                className="mt-4 h-48 w-full rounded-xl border p-4 font-mono text-sm"
                            />

                        </div>

                        {/* Private Key */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">

                            <div className="flex flex-wrap items-center justify-between gap-3">

                                <h2 className="text-lg font-semibold text-[#5A3B2A]">
                                    Private Key
                                </h2>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                privateKey
                                            )
                                        }
                                        className="rounded-lg border px-4 py-2"
                                    >
                                        Copy
                                    </button>

                                    <button
                                        onClick={() =>
                                            downloadFile(
                                                privateKey,
                                                "private.asc"
                                            )
                                        }
                                        className="rounded-lg border px-4 py-2"
                                    >
                                        Download
                                    </button>

                                </div>

                            </div>

                            <textarea
                                readOnly
                                value={
                                    privateKey
                                }
                                className="mt-4 h-64 w-full rounded-xl border p-4 font-mono text-sm"
                            />

                        </div>

                    </div>
                )}

            </div>
        </main>
    );
}