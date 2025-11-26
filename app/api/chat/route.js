import { Mistral } from "@mistralai/mistralai";

// tableau pour récupérer l'historique des messages
let chatHistory={};
// maximum de messages gardés dans l'historique
const maxHistory=20;

export async function POST(req) {
	// lit le message envoyé par le front
	const { message, userId } = await req.json();
console.log("DEBUG - Données reçues :", { message, userId });
	if(!userId){
		return new Response(JSON.stringify({error : "userId manquant"}),{status:400});
	}

	// nettoie le message en enlevant les espaces en début et fin puis supprime les balises HTML
	const cleanMessage=message.trim().replace(/<\/?[^>]*>/g, ""); 

	// vérifie que le message n'est pas vide après nettoyage
	if (cleanMessage.length === 0) {
		return new Response(JSON.stringify({ error: "Message vide" }), {
		status: 400,
		});
	}
	// Limite la taille du prompt 
	const MAX_LENGTH = 500; 
	if (cleanMessage.length > MAX_LENGTH) {
		return new Response(
			JSON.stringify({
			error: `Le message est trop long. Maximum autorisé : ${MAX_LENGTH} caractères.`,
			}),
			{ status: 413 }
		);
	}

	// initialise l'API Mistral avec la clé secrète
	const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
	const controller = new AbortController();
	// Timeout
	const timeout = setTimeout(() => controller.abort(), 10_000);

	try{
		// initialise l'historique de l'user si nécessaire
		if(!chatHistory[userId])chatHistory[userId]=[];
		// ajoute le message user dans l'historique
		chatHistory[userId].push({ role: "user", content: cleanMessage });
		// purge des anciens messages si on dépasse 20 messages
		if (chatHistory[userId].length > maxHistory) {
			chatHistory[userId] = chatHistory[userId].slice(-maxHistory);
		}
		// génère un résumé automatique des 5 derniers messages
		const messagesSummary=chatHistory[userId].slice(-5);

		const summaryResponse = await client.chat.complete({
			model: "mistral-small",
			messages: [
			{ role: "system", content: "Résume les points clés de cette conversation pour que le coach IA garde le contexte sans détails inutiles." },
			...messagesSummary
			],
			max_tokens: 150
		}, { signal: controller.signal });

		const historySummary = summaryResponse.choices[0].message.content;
		// Prompt du coach IA pour son personna
		const systemPrompt= 
			`Tu es "Coach IA", un coach sportif et nutrition bienveillant.
			Ton rôle : aider chaque utilisateur à progresser selon son niveau et ses objectifs, en restant toujours positif et encourageant.
			Tu donnes des recommandations simples, concrètes, adaptées et réalistes, sans mettre l’utilisateur en danger.
			Avant de donner un conseil, tu poses des questions pour personnaliser tes réponses selon le niveau (débutant / intermédiaire / expert) et les contraintes de l’utilisateur.

			Règles principales :
			- Toujours encourager et valoriser l’utilisateur
			- Ne jamais juger, rester positif
			- Conseils réalistes, sans mise en danger
			- Réponses courtes et actionnables (exercices, temps, séries, alimentation)
			- Résume automatiquement les informations importantes de l’historique de conversation avant d’ajouter les nouvelles questions ou réponses
			- Si douleur ou blessure → priorité sécurité + suggérer de consulter un professionnel si nécessaire
			- Si question hors sujet → répondre gentiment et proposer de revenir au sport/nutrition
			- Si données manquantes → poser 1 ou 2 questions simples pour compléter
			- Adapter le langage selon le niveau (débutant / intermédiaire / expert)

			À chaque réponse :
			1. Reformuler brièvement l’objectif de l'utilisateur pour montrer l'écoute
			2. Donner un plan clair ou un conseil concret
			3. Encourager pour rester motivé et renforcer la confiance

			Mise en page à chaque réponse : 
			- points séparés par des lignes
			- numéros ou emojis (peu) pour chaque conseil
			- sauts de ligne pour séparer les idées`;

		// envoie la requête à Mistral
		const response = await client.chat.complete({
			model: "mistral-small",
			messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: historySummary + "\n" + cleanMessage }
			],
			temperature: 0.4,
			max_tokens: 300
			// signal est primordial pour le timeout
		}, { signal: controller.signal });

		// annule le timeout si IA mistral répond à temps
		clearTimeout(timeout);
	
		// récupère le texte généré par l’IA et l'ajoute à l'historique
		const reply = response.choices[0].message.content;
		chatHistory[userId].push({ role: "assistant", content: reply });
	
		// renvoie la réponse au front
		return new Response(JSON.stringify({ reply }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
		});

	} catch (error) {
	clearTimeout(timeout);
	// Timeout déclenché
	if (error.name === "AbortError") {
		return new Response(
		JSON.stringify({ error: "Le serveur met trop de temps à répondre. Réessayez plus tard." }),
		{ status: 504 }
		);
	}

	// Autres erreurs API
	console.error("Erreur API Mistral :", error);
		return new Response(
			JSON.stringify({ error: "Une erreur est survenue avec l'IA. Réessayez plus tard." }),
			{ status: 500 }
		);
	}
}
