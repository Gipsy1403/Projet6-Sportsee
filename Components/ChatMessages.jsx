"use client";
import Image from "next/image";
import Styles from "@/app/chat/chat.module.css";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";


export default function ChatMessages({ messages,loading }) {
	const bottomRef = useRef(null);

	// Auto-scroll vers le dernier message
	useEffect(() => {
	bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

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
				{msg.role === "assistant" ? (
					<div className={`${Styles.bubble} ${Styles.ai_bubble}`}>
						<ReactMarkdown>{msg.content}</ReactMarkdown>
					</div>
				) : (
				// <p className={`${Styles.bubble} ${
				// 	msg.role === "user" 
				// 		? Styles.user_bubble 
				// 		: msg.role === "assistant"
				// 		? Styles.ai_bubble
				// 		:Styles.error_bubble
				// }`}>
					<p className={`${Styles.bubble} ${
						msg.role === "user"
						? Styles.user_bubble
						: Styles.error_bubble
					}`}>
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
				<div className={Styles.loader_dots}>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				</div>
			</div>
		)}
		{/* Permet le scroll automatique */}
		<div ref={bottomRef}></div> 
	</div>
	);
}
