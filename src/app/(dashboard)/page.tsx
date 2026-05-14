import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { LandingWrapper } from "@/components/landing/LandingWrapper";
import "@/app/landing.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

export default function LandingPage() {
  return (
    <LandingWrapper fontClasses={`${jakarta.variable} ${inter.variable}`} />
  );
}
