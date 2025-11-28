import { Inter} from "next/font/google";
import "./globals.css";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { GlobalProvider } from "@/Components/GlobalContext";
import EffectsPages from "@/Components/EffectPage";

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
	<html lang="fr">
		<body suppressHydrationWarning className={`${inter.variable}`}>
		<GlobalProvider>
			{children}
		</GlobalProvider>
		</body>
	</html>
  );
}
