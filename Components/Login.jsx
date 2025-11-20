"use client"

import { useState } from "react";
import Styles from "@/app/login/login.module.css"
// import { useUser } from "./GlobalContext";
import { useRouter } from "next/navigation";

export default function Login() {
	// const {user}=useUser();
	const [username, setUsername]=useState("");
	const [password, setPassword]=useState("");
	const [message, setMessage] = useState("");
	const router=useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("http://localhost:8000/api/login", {
			method: "POST",
			credentials: "include",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage("Connexion réussie !");
				console.log("Login success :", data);
				router.push("/profile");
			} else {
				setMessage(data.message || "Erreur lors du login");
			}
		} catch (err) {
			console.error(err);
			setMessage("Erreur réseau");
		}
	};

  return (
	<form className={Styles.form_login}>
		<h3 className={Styles.title_login}>Transformez <span>vos stats en résultats</span></h3>
		<h4>Se connecter</h4>
		<p className={Styles.input_name}>Nom utilisateur</p>
		<input 
			className={Styles.input_login}
			type="text"
			id="username"
			value={username}
			onChange={(e) => setUsername(e.target.value)}
		/>
		<p className={Styles.input_name}>Mot de passe</p>
		<input
			className={Styles.input_login}
			type="password"
			value={password}
			onChange={(e) => setPassword(e.target.value)}
		/>
		<button type="submit" className={Styles.btn_login} onClick={handleLogin}>Se connecter</button>
		{message && <p className={Styles.message}>{message}</p>}
		<p className={Styles.mdp_forget}>Mot de passe oublié ?</p>
		
	</form>
  );
}