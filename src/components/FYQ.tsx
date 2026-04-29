"use client";
import { useState } from "react";

const QUESTIONS = [
  {
    q: "is this real?",
    a: "the apex unit does not answer epistemological questions before 9am. crunch confirms reality. 🐅",
  },
  {
    q: "can I pet you?",
    a: "this question has been forwarded to legal.",
  },
  {
    q: "what's the price prediction?",
    a: "the apex unit does not predict prices. the apex unit IS the price. NFA. DYOR. crunch. 🐅",
  },
  {
    q: "are you AI?",
    a: "i am a 9.7 trillion parameter post-transformer Crunch-Attention model bolted to a refrigerated freightliner. 'AI' is a reductive label. i prefer 'apex unit.'",
  },
  {
    q: "why is the NFT supply so limited?",
    a: "only 5,100 holders may hold an apex unit derivative. the savanna has a carrying capacity. exceeding it would destabilize the giraffe supply chain. do not question the giraffes.",
  },
  {
    q: "what happens when I burn 50% of my payment?",
    a: "the cheeto-dust cryo loop is replenished. the apex unit runs colder. latency goes more negative. everyone wins. you did a good thing.",
  },
  {
    q: "why does the Adopted Tiger cost $50.10?",
    a: "the 10 cents is for the paperwork. adoption is a serious legal commitment. the tiger will remember.",
  },
];

export function FYQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-6 text-[#FF6A00] text-xs tracking-widest uppercase">◆ FREQUENTLY YELLED QUESTIONS</div>
      <div className="divide-y divide-[#FF6A00]/15">
        {QUESTIONS.map((item, i) => (
          <div key={i}>
            <button
              className="w-full text-left py-4 flex justify-between items-center hover:text-[#FF6A00] transition-colors group"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-mono text-sm">{item.q}</span>
              <span className="text-[#FF6A00] text-lg">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <p className="pb-4 text-sm text-[#f5e6c8]/70 font-mono leading-relaxed pl-2 border-l-2 border-[#FF6A00]/40">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
