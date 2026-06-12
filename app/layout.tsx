import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부합성 심의제도 안내 챗봇",
  description: "부합성 심의 안내 서비스"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}