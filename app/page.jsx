import MockTest from "@/Composents/MockTest";
import Image from "next/image";
import Link from "next/link";
import PageLogin from "./login/page";
import PageProfile from "./profile/page";
import PageDashboard from "./dashboard/page";

export default function Home() {
  return (
    <div>
      <main>
		<PageProfile />
		<PageDashboard/>
		<MockTest />
      </main>
    </div>
  );

}
