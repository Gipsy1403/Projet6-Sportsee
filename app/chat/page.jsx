"use client";
import { useState } from "react";
import Image from "next/image";
import Styles from "./chat.module.css"
import { useRouter } from "next/navigation";


export default function ChatPage() {
	// Historique du chat
	const [messages, setMessages] = useState([]);
	// Texte écrit par l'utilisateur
	const [textarea, setTextarea] = useState("");
	// initialise le router pour revenir au dashboard après avoir cliqué sur Fermer
	const router=useRouter();
	// Fonction appelée quand on clique sur "Envoyer"
	const handleSend = async () => {
		if (!textarea.trim()) return;

		// ajoute le message de l'utilisateur dans la liste
		const userMessage = { role: "user", content: textarea };
		setMessages((prev) => [...prev, userMessage]);

		// appelle la route API /api/mistral
		const res = await fetch("/api/mistral", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: textarea }),
		});

		const data = await res.json();

		// ajoute la réponse de l'IA à la liste
		const botMessage = { role: "assistant", content: data.reply };
		setMessages((prev) => [...prev, botMessage]);
		// vide le champ texte
		setTextarea(""); 
	};

	return (
		<section className={Styles.container_mistral}>
			<p onClick={()=>router.push("/dashboard")} className={Styles.closed_windows}>Fermer X</p>
			<h4 className={Styles.title}>Posez vos questions sur votre programme, <span>vos performances ou vos objectifs</span></h4>

			{/* Zone d'affichage des messages */}
			<div className={Styles.zone_messages}>
				{messages.map((msg, i) => (
					<div key={i}  className={`${Styles.messages_container} ${msg.role==="user"?Styles.user_message: Styles.ai_message}`}>
					<Image
						src={msg.role==="user"?"/assets/images/Photo profil.png": "/assets/images/AI agent.png"}
						alt={msg.role==="user"?"Avatar de l'utilisateur": "Coach IA"}
						width={32}
						height={32}
						className={Styles.avatar}
					/>
					<p className={Styles.content_message}>{msg.content}</p>
					</div>
				))}
			</div>
			{/* Champ de saisie */}
			<form onSubmit={handleSend} className={Styles.textarea_message}>
				{/* <Image
					src={"/assets/images/Icone AI (1).png"}
					alt="bouton envoyer"
					width={20}
					height={20}
				/> */}
				<textarea
					value={textarea}
					onChange={(e) => setTextarea(e.target.value)}
					placeholder="Comment puis-je vous aider ?"
				/>
				<button type="submit" className={Styles.btn_send}>
					<Image
						src={"/assets/images/Button.png"}
						alt="bouton envoyer"
						width={48}
						height={48}				
					/>
				</button>
			</form>
			<div className={Styles.btn_questions}>
				<p>Comment améliorer mon endurance ?</p>
				<p>Que signifie mon score de récupération ?</p>
				<p>Peux tu m'expliquer mon dernier graphique ?</p>
			</div>
		</section>
	);
}
