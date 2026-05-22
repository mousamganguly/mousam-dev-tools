"use client";

import { useState } from "react";
import Link from "next/link";

// test difference
/* function diffLines(a: string, b: string) {
const aLines = a.split("\n");
const bLines = b.split("\n");

const max = Math.max(aLines.length, bLines.length);
const result = [];

for (let i = 0; i < max; i++) 
const lineA = aLines[i];
const lineB = bLines[i];

if (lineA === lineB) {
result.push({
type: "same",
a: lineA,
b: lineB,
});
} else if (lineA === undefined) {
result.push({
type: "added",
b: lineB,
});
} else if (lineB === undefined) {
result.push({
type: "removed",
a: lineA,
});
} else {
result.push({
type: "changed",
a: lineA,
b: lineB,
});
}
}

return result;
} */

function similarity(a: string, b: string) {
const wordsA = a.toLowerCase().split(/\s+/);
const wordsB = b.toLowerCase().split(/\s+/);

let matches = 0;

for (const word of wordsA) {
if (wordsB.includes(word)) {
matches++;
}
}

return matches / Math.max(wordsA.length, wordsB.length);
}

function diffLines(a: string, b: string) {
const aLines = a.split("\n");
const bLines = b.split("\n");

const result = [];

let i = 0;
let j = 0;

while (i < aLines.length && j < bLines.length) {
const lineA = aLines[i];
const lineB = bLines[j];

// Exact same line
if (lineA === lineB) {
result.push({
type: "same",
a: lineA,
b: lineB,
});

i++;
j++;
continue;
}

// Find best future match in doc2
let futureMatch = -1;

for (
let k = j + 1;
k < Math.min(j + 5, bLines.length);
k++
) {
const score = similarity(lineA, bLines[k]);

if (score > 0.5) {
futureMatch = k;
break;
}
}

// Insert added lines until match found
if (futureMatch !== -1) {
while (j < futureMatch) {
result.push({
type: "added",
a: "",
b: bLines[j],
});

j++;
}

// Compare matched line
result.push({
type: "changed",
a: lineA,
b: bLines[j],
});

i++;
j++;
continue;
}

// Similar line = changed
const score = similarity(lineA, lineB);

if (score > 0.4) {
result.push({
type: "changed",
a: lineA,
b: lineB,
});

i++;
j++;
continue;
}

// Removed line
result.push({
type: "removed",
a: lineA,
b: "",
});

i++;
}

// Remaining lines in doc2
while (j < bLines.length) {
result.push({
type: "added",
a: "",
b: bLines[j],
});

j++;
}

// Remaining lines in doc1
while (i < aLines.length) {
result.push({
type: "removed",
a: aLines[i],
b: "",
});

i++;
}

return result;
}

export default function DiffPage() {
const [left, setLeft] = useState("");
const [right, setRight] = useState("");
const [result, setResult] = useState<any[]>([]);

const compare = () => {
setResult(diffLines(left, right));
};

const clearAll = () => {
setLeft("");
setRight("");
setResult([]);
};

return (
<main className="min-h-screen bg-[#FFF8E8] p-8">

<div className="mx-auto max-w-6xl">

<Link
href="/"
className="text-sm text-slate-600 hover:text-black"
>
← Back to tools
</Link>

<h1 className="mt-6 text-4xl font-semibold text-[#5A3B2A]">
Diff Checker
</h1>

<p className="mt-3 text-slate-600">
Compare text, code, logs, or configs side by side.
</p>

<div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

{/* Inputs */}
<div className="mt-8 grid gap-6 md:grid-cols-2">

<textarea
value={left}
onChange={(e) =>
setLeft(e.target.value)
}
placeholder="Original text"
className="h-64 w-full rounded-xl border bg-white p-4 font-mono text-sm"
/>

<textarea
value={right}
onChange={(e) =>
setRight(e.target.value)
}
placeholder="Modified text"
className="h-64 w-full rounded-xl border bg-white p-4 font-mono text-sm"
/>

</div>

<div className="mt-4 flex gap-3">
<button
onClick={compare}
className="rounded-xl bg-[#5A3B2A] px-5 py-2 text-white hover:bg-[#CC7A00]"
>
Compare
</button>

<button
onClick={clearAll}
className="rounded-xl border px-5 py-2"
>
Clear
</button>
</div>

{/* Output */}
{result.length > 0 && (
<div className="mt-10 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">

{/* Header */}
<div className="grid grid-cols-2 border-b bg-[#FFF3D6] px-4 py-3 font-semibold text-[#5A3B2A]">
<div>Original</div>
<div>Modified</div>
</div>

{/* Diff rows */}
<div className="divide-y">

{result.map((line, idx) => (
<div
key={idx}
className={`grid grid-cols-2 text-sm font-mono ${line.type === "same"
? "bg-green-50"
: ""
}`}
>

{/* Left side */}
<div
className={`min-h-[44px] whitespace-pre-wrap border-r p-3 ${line.type === "removed"
? "bg-red-100 text-red-700"
: line.type === "changed"
? "bg-red-50 text-red-700"
: line.type === "same"
? "text-slate-800"
: "text-slate-400"
}`}
>
{line.a ?? ""}
</div>

{/* Right side */}
<div
className={`min-h-[44px] whitespace-pre-wrap p-3 ${line.type === "added"
? "bg-green-100 text-green-700"
: line.type === "changed"
? "bg-green-50 text-green-700"
: line.type === "same"
? "text-slate-800"
: "text-slate-400"
}`}
>
{line.b ?? ""}
</div>

</div>
))}

</div>
</div>
)}

</div>

</div>
</main>
);
}