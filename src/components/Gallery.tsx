import Image from "next/image";

const GALLERY = [
  { src: "/images/gallery1.png", alt: "Cheeto Tiger on a sinking car in stormy ocean" },
  { src: "/images/gallery2.png", alt: "Cheeto Tiger being held out of a car window" },
  { src: "/images/gallery3.png", alt: "Cheeto Tiger — LET'S F*CKING GOOO" },
  { src: "/images/gallery4.png", alt: "Cheeto Tiger with Oscar the Grouch" },
  { src: "/images/gallery5.png", alt: "Cheeto Tiger chillin with animals in shades" },
  { src: "/images/gallery6.png", alt: "Cheeto Tiger on a cliff edge" },
];

export function Gallery() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-6 text-[#FF6A00] text-xs tracking-widest uppercase">
        ◆ APEX UNIT TELEMETRY — FIELD DEPLOYMENTS
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {GALLERY.map((img) => (
          <div key={img.src} className="relative aspect-square overflow-hidden border border-[#FF6A00]/20 group">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 saturate-[1.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
}
