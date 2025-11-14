import { Inter} from "next/font/google";
import "./globals.css";
import Header from "@/Composents/Header";
import Footer from "@/Composents/Footer";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight:["400","500","600","700","800","900"]
});


export const metadata = {
  title: "Sportsee",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
	   <Header />
        {children}
	   <Footer />
      </body>
    </html>
  );
}
