"use client";
import { useState } from "react";
import Image from "next/image";
import Styles from "./chat.module.css"
import { useRouter } from "next/navigation";
import ChatMessages from "@/Components/ChatMessages";


export default function ChatPage() {
	// Historique du chat
	const [messages, setMessages] = useState([]);
	// Texte écrit par l'utilisateur
	const [textarea, setTextarea] = useState("");
	// etat de chargement pour l'IA
	const[loading,setLoading]=useState(false);
	// gestion des erreurs côté client
	const[error,setError]=useState(null);
	// gère l'état dès que la conversation est lancée pour faire disparaitre le h4
	const [conversationsStart, setConversationsStart]=useState(false);

	// initialise le router pour revenir au dashboard après avoir cliqué sur Fermer
	const router=useRouter();

	// limitation longueur message user
	const MAX_LENGTH=500;

	// Fonction appelée quand on clique sur "Envoyer"
	const handleSend = async (e) => {
		e?.preventDefault();
		if (!textarea.trim()) return;
		if(!conversationsStart)setConversationsStart(true);

		if (textarea.length > MAX_LENGTH) {
			setMessages((prev) => [
				...prev,
				{
				role: "error",
				content: `Message trop long. Maximum autorisé : ${MAX_LENGTH} caractères.`,
				},
			]);
			return;
		}

		const userMessage = { role: "user", content: textarea };
		setMessages((prev) => [...prev, userMessage]);
		setTextarea("");
		setLoading(true);
		// réinitialise l'erreur avant une nouvelle requête
		setError(null); 

		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials:"include",
				body: JSON.stringify({ message: textarea }),
			});
			if (!res.ok) {
				throw new Error("Réponse serveur invalide");
			}

			const data = await res.json();
			if (!data.reply) {
				throw new Error("Réponse AI manquante");
			}

			const botMessage = { role: "assistant", content: data.reply };
			setMessages((prev) => [...prev, botMessage]);

		} catch (err) {
			// Message d'erreur affiché dans la zone de messages
			setMessages((prev) => [...prev,{ role: "error", content: "Une erreur est survenue. Merci de réessayer." }
			]);
			setError(err.message);
		}
		setLoading(false);
	};

	const handleQuestionClick=(question)=>{
		setTextarea(question);
		if(!conversationsStart)setConversationsStart(true);
		setTimeout(()=>handleSend(),50);
	};

	return (
		<section className={Styles.container_mistral}>
			<p onClick={()=>router.push("/dashboard")} className={Styles.closed_windows}>Fermer X</p>
			{!conversationsStart && (
				<h4 className={Styles.title}>Posez vos questions sur votre programme, <span>vos performances ou vos objectifs</span></h4>
			)}

			{/* Zone d'affichage des messages */}
			<ChatMessages messages={messages} loading={loading} />

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
					onChange={(e) => {
						if(e.target.value.length<=MAX_LENGTH){
							setTextarea(e.target.value);
						}
					}}
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
				{["Comment améliorer mon endurance ?",
				"Que signifie mon score de récupération ?",
				"Peux tu m'expliquer mon dernier graphique ?"].map((q,i)=>(
					<p key={i} onClick={()=>handleQuestionClick(q)}>{q}</p>
				))}
			</div>
		</section>
	);
}
