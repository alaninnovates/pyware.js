"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Buffer } from "buffer";
import { parsePyware3DAFile } from "pyware.js";

export default function Home() {
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const parseArrayBuffer = useCallback((arrayBuffer: ArrayBuffer, name: string) => {
        try {
            const parsed = parsePyware3DAFile(Buffer.from(arrayBuffer));
            setResult(JSON.stringify(parsed, null, 2));
            setError(null);
            setFileName(name);
        } catch (err) {
            setResult(null);
            setFileName(null);
            setError(err instanceof Error ? err.message : String(err));
        }
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        file.arrayBuffer().then((arrayBuffer) => parseArrayBuffer(arrayBuffer, file.name));
    }, [parseArrayBuffer]);

    const onViewSample = useCallback(() => {
        fetch("/HexedMov3.3da")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch :(`);
                }
                return response.arrayBuffer();
            })
            .then((arrayBuffer) => parseArrayBuffer(arrayBuffer, "HexedMov3.3da"))
            .catch((err) => {
                setResult(null);
                setFileName(null);
                setError(err instanceof Error ? err.message : String(err));
            });
    }, [parseArrayBuffer]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/octet-stream": [".3da"] },
        multiple: false,
    });

    return (
        <div className="flex min-h-screen flex-col">
            <header className="px-8 py-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Pyware.js Demo</h1>
                <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                    Drop a Pyware <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.3da</code> file
                    to see its contents.
                </p>
            </header>

            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-8 pb-12 lg:flex-row">
                <section className="flex flex-1 flex-col gap-4">
                    <h2 className="text-lg font-semibold">Upload</h2>
                    <div
                        {...getRootProps()}
                        className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <p>
                            {isDragActive
                                ? "Drop the .3da file here"
                                : "Drag & drop a .3da file here, or click to select"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onViewSample}
                        className="self-start rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                    >
                        View sample file (HexedMov3.3da)
                    </button>
                    {error && (
                        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            Failed to parse file: {error}
                        </p>
                    )}
                </section>

                <section className="flex flex-1 flex-col gap-4">
                    <h2 className="text-lg font-semibold">
                        Parsed JSON{fileName ? `: ${fileName}` : ""}
                    </h2>
                    <pre className="h-[32rem] flex-1 overflow-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                        <code>{result ?? "Parsed output will appear here."}</code>
                    </pre>
                </section>
            </main>
        </div>
    );
}
