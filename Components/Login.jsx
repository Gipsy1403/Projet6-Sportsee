"use client"
import { dataMocks } from "@/src/mocks/users";
import { useState } from "react";
import Styles from "@/app/login/login.module.css"

export default function Login() {
	const [username, setUsername]=useState("");
	const [password, setPassword]=useState("");

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
		<button className={Styles.btn_login}>Se connecter</button>
		<p className={Styles.mdp_forget}>Mot de passe oublié ?</p>
		
	</form>
  );
}