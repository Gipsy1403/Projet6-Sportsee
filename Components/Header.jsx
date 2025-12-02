"use client";
import Image from "next/image"
import "@/app/globals.css"
import Link from "next/link"


export default function Header(){
	// Fonction pour déconnecter l'utilisateur
	const handleLogout = async () => {
	// Appel à l'API pour la déconnexion
	await fetch("/api/logout", {
		method: "POST",              // méthode POST pour signaler la déconnexion
		credentials: "include"       // inclut les cookies (très important pour que le serveur supprime la session)
	});

	// Redirige l'utilisateur vers la page de login après la déconnexion
	window.location.href = "/login";
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