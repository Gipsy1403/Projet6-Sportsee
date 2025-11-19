import { Inter} from "next/font/google";
import "./globals.css";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
// ! IMPORTANT: le chemin du global provider est celui du mocks à modifier lors de la mise en oeuvre avec l'API
import { MockDataProvider } from "@/Components/GlobalContextMOCK";

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
		<MockDataProvider>
		{/* <GlobalProvider> */}
			<Header />
			{children}
			<Footer />
		{/* <GlobalProvider> */}
		</MockDataProvider>
		</body>
	</html>
  );
}
