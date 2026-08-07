import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Math Tutor 1:1 - Toán lớp 7",
  description:
    "Nền tảng gia sư AI 1:1 giúp học sinh lớp 7 học Toán theo năng lực cá nhân.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
