import Image from "next/image"
import "@/app/globals.css"
import Link from "next/link"


export default function Header(){
	return(
		<header>
			<Link href="/">
				<Image
					className="logo"
					src={"/assets/images/Logo (1).png"}
					alt="Logo Sportsee"
					width={157}
					height={23}/>
			</Link>
			<div className="bar_navigation">
				<ul>
					<li><Link href="/app/dashboard/page.jsx">Dashboard</Link></li>
					<li>Coach AI</li>
					<li><Link href="/app/profile/page.jsx">Mon profil</Link></li>
					<li>Se déconnecter</li>
				</ul>
			</div>
		</header>
	)
}