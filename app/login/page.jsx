import Login from "@/Composents/Login";
import Image from "next/image";
import Styles from "./login.module.css"

export default function PageLogin() {
	
// 	 const handleLogin = async (e) => {
//     e.preventDefault(); // empêche le rechargement de la page

//     const response = await fetch("http://localhost:8000/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include", // 🔥 important pour les cookies
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       console.log("Connexion réussie !", data);
//       // ➕ Redirection vers une page protégée, par ex. /dashboard
//     } else {
//       console.error("Erreur :", data.message);
//     }
//   };

  return (
	<section className={Styles.login_container}>
		<div className={Styles.left_column}>
			<Image
				className={Styles.logo}
				src={"/assets/images/Logo (1).png"}
				alt="Logo Sportsee"
				width={157}
				height={23}/>
			<Login />
		</div>
		<div className={Styles.right_column}>
			<p className={Styles.phrase}>Analysez vos performances en un clin d’œil,
<span>suivez vos progrès et atteignez vos objectifs.</span></p>
		</div>
	</section>

  );
}