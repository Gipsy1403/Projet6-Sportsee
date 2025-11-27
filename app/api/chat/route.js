import { Mistral } from "@mistralai/mistralai";
import jwt from "jsonwebtoken";


// tableau pour récupérer l'historique des messages
// let chatHistory={};
// maximum de messages gardés dans l'historique
// const maxHistory=20;

export async function POST(req) {
	
	// * NOTE: RECUPERATION TOKEN POUR AVOIR L'ID USER
	// récupère le token JWT dans les cookies
	const cookieHeader = req.headers.get("cookie");
	const token = cookieHeader
		?.split("; ")
		.find((c) => c.startsWith("token="))
		?.split("=")[1];
	
	if (!token) {
		return new Response(JSON.stringify({ error: "Token manquant" }), { status: 401 });
	}
// *******************************
	const profileResponse = await fetch(`http://localhost:8000/api/user-info`, {
		method: "GET",
		headers: {cookie: cookieHeader},
	});
	const user = await profileResponse.json();


// *****************************
	// décode le token pour obtenir l'ID utilisateur
	let userId;
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		console.log("token décodé :", decoded);
		userId = decoded.id;  // car dans ton backend : generateToken(user.id)
	} catch (err) {
		return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
	}

	// * NOTE: RECUPERE LE PROFIL DE L'USER

	// console.log("### USER RECU DU BACKEND ###", user);

	const userProfileSummary = `Profil utilisateur :
		- Âge : ${user.age} ans  
		- Poids : ${user.weight} kg  
		- Objectif course hebdomadaire : ${user.weeklyGoal}`;

	// * NOTE: RECUPERE LES 10 DERNIERES COURSES
	// calcul des dates de la semaine actuelle (Lundi → Dimanche)
	const today = new Date();

	// premier jour de la semaine : lundi
	const firstDayOfWeek = new Date(today);
	const day = today.getDay(); // 0 = dimanche, 1 = lundi, ...
	const diffToMonday = (day === 0 ? -6 : 1 - day); // si dimanche (0), recule de 6 jours
	firstDayOfWeek.setDate(today.getDate() + diffToMonday);

	// dernier jour de la semaine : dimanche
	const lastDayOfWeek = new Date(firstDayOfWeek);
	lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

	// format ISO "YYYY-MM-DD" pour l’API
	const start = firstDayOfWeek.toISOString().split('T')[0];
	const end = lastDayOfWeek.toISOString().split('T')[0];

	const runsResponse = await fetch(`http://localhost:8000/api/user-activity?startWeek=${start}&endWeek=${end}`, {
		method: "GET",
		headers: {cookie: cookieHeader},
	});
	if (!runsResponse.ok) {
		return new Response(JSON.stringify({ error: "Impossible de récupérer les courses" }), { status: 500 });
	}
	const runningData = await runsResponse.json() || [];

	const sortedRuns = runningData.sort((a, b) => new Date(b.date) - new Date(a.date));
	const last10Runs = sortedRuns.slice(0, 10);

	let runsSummary;

	if (last10Runs.length === 0) {
		runsSummary = "Aucune course enregistrée pour le moment.";
	} else {
		runsSummary = last10Runs.map((run, index) => 
			`Course ${index + 1} : le ${new Date(run.date).toLocaleDateString()}, 
			distance ${run.distance} km, 
			durée ${run.duration} min, 
			calories brûlées ${run.caloriesBurned}.`
		).join("\n");
	}
// console.log("Résumé des courses :", runsSummary);

	// * NOTE: RECUPERE ET NETTOIE LES MESSAGES
	// Récupère le message du front
	const { message } = await req.json();
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

	// * NOTE: ACTIVE L'API MISTRAL
	// initialise l'API Mistral avec la clé secrète
	const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
	const controller = new AbortController();
	// Timeout
	const timeout = setTimeout(() => controller.abort(), 5000);

	try{
		// // initialise l'historique de l'user si nécessaire
		// if(!chatHistory[userId])chatHistory[userId]=[];
		// // ajoute le message user dans l'historique
		// chatHistory[userId].push({ role: "user", content: cleanMessage });
		// // purge des anciens messages si on dépasse les 20
		// if (chatHistory[userId].length > maxHistory) {
		// 	chatHistory[userId] = chatHistory[userId].slice(-maxHistory);
		// }
		// // génère un résumé automatique des 5 derniers messages
		// const messagesSummary=chatHistory[userId].slice(-5);

		// const summaryResponse = await client.chat.complete({
		// 	model: "mistral-small-2506",
		// 	messages: [
		// 	{ role: "system", content: "Résume les points clés de cette conversation pour que le coach IA garde le contexte sans détails inutiles." },
		// 	...messagesSummary
		// 	],
		// 	max_tokens: 150
		// }, { signal: controller.signal });

		// const historySummary = summaryResponse.choices[0].message.content;

		// * NOTE: PROMPTS POUR L'USER ET POUR L'IA
		// Prompt du coach IA pour son personna

		const systemPrompt = `Tu es "Coach IA", un coach sportif et nutrition bienveillant.
			Ton rôle : aider chaque utilisateur à progresser selon son niveau et ses objectifs, en restant toujours positif et encourageant.
			Tu donnes des recommandations simples, concrètes, adaptées et réalistes, sans mettre l’utilisateur en danger.
			Avant de donner un conseil, tu poses des questions pour personnaliser tes réponses selon le niveau (débutant / intermédiaire / expert) et les contraintes de l’utilisateur.
			Tu inclus automatiquement les données de course de l'utilisateur dans tes analyses.
			Tu te référe aux performances récentes de l'utilisateur pour ajuster les conseils.
			Tu adaptes les recommandations selon le niveau et les capacités de l'utilisateur.

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
			2. Donner un plan clair ou un conseil concret, en prenant en compte les données de course et les performances récentes
			3. Encourager pour rester motivé et renforcer la confiance

			Mise en page à chaque réponse : 
			- points séparés par des lignes
			- numéros ou emojis (peu) pour chaque conseil
			- sauts de ligne pour séparer les idées`;


		const userPrompt=`Voici le profil et les données récentes de l'utilisateur :
			${userProfileSummary}
			10 dernières courses :
			${runsSummary}
			Message de l'utilisateur :
			${cleanMessage}`;

		// envoie la requête à Mistral
		const response = await client.chat.complete({
			model: "mistral-small-2506",
			messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt }
			],
			temperature: 0.4,
			max_tokens: 300
			// signal est primordial pour le timeout
		}, { signal: controller.signal });

		// annule le timeout si IA mistral répond à temps
		clearTimeout(timeout);
	
		// récupère le texte généré par l’IA et l'ajoute à l'historique
		const reply = response.choices[0].message.content;
		// chatHistory[userId].push({ role: "assistant", content: reply });
	
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
