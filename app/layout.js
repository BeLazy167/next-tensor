import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Toxicity Classifier",
    description: "A simple toxicity classifier using TensorFlow.js and Next.js",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
