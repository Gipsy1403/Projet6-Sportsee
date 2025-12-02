"use client";
import { useState } from "react";
import Image from "next/image";
import Styles from "./chat.module.css"
import { useRouter } from "next/navigation";
import ChatMessages from "@/Components/ChatMessages";
import EffectsPages from "@/Components/EffectPage";


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
	// const handleSend = async (e) => {
	// 	e?.preventDefault();
	// 	if (!textarea.trim()) return;
	// 	if(!conversationsStart)setConversationsStart(true);

	// 	if (textarea.length > MAX_LENGTH) {
	// 		setMessages((prev) => [
	// 			...prev,
	// 			{
	// 			role: "error",
	// 			content: `Message trop long. Maximum autorisé : ${MAX_LENGTH} caractères.`,
	// 			},
	// 		]);
	// 		return;
	// 	}

	// 	const userMessage = { role: "user", content: textarea };
	// 	setMessages((prev) => [...prev, userMessage]);
	// 	setTextarea("");
	// 	setLoading(true);
	// 	// réinitialise l'erreur avant une nouvelle requête
	// 	setError(null); 


	// Déclare une fonction asynchrone pour envoyer un message.
	// 'e' représente l'événement du formulaire ou du bouton.
	const handleSend = async (e) => {
	// Empêche le rechargement de la page si c'est un formulaire.
		e?.preventDefault();

		// Vérifie si le champ de texte n'est pas vide ou rempli seulement d'espaces.
		// Si vide, on quitte la fonction sans rien faire.
		if (!textarea.trim()) return;

		// Si la conversation n'a pas encore commencé, on la marque comme démarrée.
		if(!conversationsStart) setConversationsStart(true);

		// Vérifie si le message dépasse la longueur maximale autorisée.
		if (textarea.length > MAX_LENGTH) {
			// Si trop long, on ajoute un message d'erreur dans la liste des messages.
			setMessages((prev) => [
				...prev, // garde tous les messages précédents
				{
					role: "error", // rôle spécial pour identifier le message comme une erreur
					content: `Message trop long. Maximum autorisé : ${MAX_LENGTH} caractères.`,
				},
			]);
			// On quitte la fonction pour ne pas envoyer le message.
			return;
		}

		// Prépare le message de l'utilisateur sous forme d'objet.
		const userMessage = { role: "user", content: textarea };

		// Ajoute le message de l'utilisateur à la liste des messages.
		setMessages((prev) => [...prev, userMessage]);

		// Vide le champ de texte après envoi.
		setTextarea("");

		// Active le chargement (par exemple, pour afficher un spinner pendant la réponse).
		setLoading(true);

		// Réinitialise l'erreur avant d'envoyer une nouvelle requête.
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
		<>
		<EffectsPages>
			<section className={Styles.container_mistral}>
				<p onClick={()=>router.push("/dashboard")} className={Styles.closed_windows}>Fermer X</p>
				{!conversationsStart && (
					<h4 className={Styles.title}>Posez vos questions sur votre programme, <span>vos performances ou vos objectifs</span></h4>
				)}

				{/* Zone d'affichage des messages */}
				<ChatMessages messages={messages} loading={loading} />

				{/* Champ de saisie */}
				<form onSubmit={handleSend} className={Styles.textarea_message}>
					<textarea
						value={textarea}
						onChange={(e) => {
							if(e.target.value.length<=MAX_LENGTH){
								setTextarea(e.target.value);
							}
						}}
						placeholder="Comment puis-je vous aider ?"
						onKeyDown={(e) => {
						// si j'appuie sur Entrée
							if (e.key === "Enter" && !e.shiftKey) {
								// empêche le retour à la ligne
								e.preventDefault(); 
								handleSend();
							}
						}}
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
		</EffectsPages>
		</>
	);
}
