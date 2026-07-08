'use client';

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#FF5733] font-semibold">
      {children}
    </span>
  );
}