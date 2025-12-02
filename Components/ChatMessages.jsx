"use client";
import Image from "next/image";
import Styles from "@/app/chat/chat.module.css";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";


// Composant pour afficher les messages du chat
export default function ChatMessages({ messages, loading }) {
    // Créé une référence vers un élément DOM, ici pour le dernier message
	const bottomRef = useRef(null);

    // useEffect pour gérer le défilement automatique
	useEffect(() => {
        // Si l'élément référencé existe, on fait défiler la page jusqu'à lui
        // 'behavior: "smooth"' = défilement fluide et agréable à l'œil
	    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]); // Déclenché à chaque fois que le tableau 'messages' change

    // 💡 Astuce visuelle :
    // bottomRef = un signet placé sur le dernier message.
    // Dès qu'un nouveau message arrive, on "tourne la page" pour atteindre ce signet.

	return (
	<div className={Styles.zone_messages}>
		 {messages.map((msg, i) => (
			<div key={i} className={`${Styles.messages_row} ${ msg.role === "user" ? Styles.user_row : Styles.ai_row}`}>
				{/* Avatar IA avant, Avatar user après */}
				{msg.role === "assistant" && (
					<Image
						src="/assets/images/AI agent.png"
						alt="Avatar Coach IA"
						width={32}
						height={32}
						className={Styles.avatar}
					/>
				)}
				{/* Ici on affiche un message du chat selon son rôle (assistant, user ou erreur) */}
				{msg.role === "assistant" ? (
				// Si le rôle est "assistant", on crée une bulle spéciale pour l'IA
				<div className={`${Styles.bubble} ${Styles.ai_bubble}`}>
					{/* ReactMarkdown permet d'afficher du texte en Markdown (titres, listes, etc.) */}
					<ReactMarkdown skipHtml={false}
						components={{
							// On peut personnaliser chaque balise HTML générée par Markdown
							h1: ({ children }) => <h1 className={Styles.titreh1}>{children}</h1>, // titre niveau 1
							h2: ({ children }) => <h2 className={Styles.titreh2}>{children}</h2>, // titre niveau 2
							h3: ({ children }) => <h3 className={Styles.titreh3}>{children}</h3>, // titre niveau 3
							ul: ({ children }) => <ul className={Styles.ul}>{children}</ul>,       // liste non ordonnée
							li: ({ children }) => <li className={Styles.li}>{children}</li>,       // élément de liste
							p: ({ children }) => <p className={Styles.p}>{children}</p>,           // paragraphe
						}}
					>
						{/* Contenu du message envoyé par l'assistant */}
						{msg.content}
					</ReactMarkdown>
				</div>
				) : (
				// Sinon, pour les messages "user" ou "error"
				<p className={`${Styles.bubble} ${
					msg.role === "user"
					? Styles.user_bubble   // si c'est l'utilisateur, bulle utilisateur
					: Styles.error_bubble  // sinon, bulle d'erreur
				}`}>
					{/* Contenu du message */}
					{msg.content}
				</p>
				)}

				{msg.role === "user" && (
					<Image
						src="/assets/images/Photo profil.png"
						alt="Avatar de l'utilisateur"
						width={32}
						height={32}
						className={Styles.avatar}
					/>
				)}
			</div>
			))}

		{/* Affiche le loader pendant que l'IA travaille */}
		{loading && (
			<div className={`${Styles.messages_container} ${Styles.ai_message}`}>
				<Image
				src="/assets/images/AI agent.png"
				alt="Coach IA"
				width={32}
				height={32}
				className={Styles.avatar}
				/>
				<div>
					<span className={Styles.loader}></span>
				</div>
			</div>
		)}
		{/* Permet le scroll automatique */}
		<div ref={bottomRef}></div> 
	</div>
	);
}
