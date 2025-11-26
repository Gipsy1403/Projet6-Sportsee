"use client";
import Image from "next/image"
import "@/app/globals.css"
import Link from "next/link"


export default function Header(){
	const handleLogout = async () => {
		await fetch("/api/logout", {
			method: "POST",
			credentials: "include" // très important pour envoyer le cookie
			});

		window.location.href = "/login"; // redirection après déconnexion
	};
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
					<li><Link href="/dashboard">Dashboard</Link></li>
					<li><Link href={"/chat"}>Coach AI</Link></li>
					<li><Link href="/profile">Mon profil</Link></li>
					<li onClick={handleLogout}>Se déconnecter</li>
				</ul>
			</div>
		</header>
	)
}