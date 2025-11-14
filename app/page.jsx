import MockTest from "@/Composents/MockTest";
import Image from "next/image";
import Link from "next/link";
import PageLogin from "./login/page";

export default function Home() {
  return (
    <div>
      <main>
		{/* <Link href={ROUTES.LOGIN}>Se connecter</Link>
		<Link href={ROUTES.DASHBOARD}>Dashboard</Link> */}
		{/* <h1>hello ma poule</h1> */}
		<MockTest />
      </main>
    </div>
  );

}
