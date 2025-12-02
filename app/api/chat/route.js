import { Mistral } from "@mistralai/mistralai";
import jwt from "jsonwebtoken";


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

	// décode le token pour obtenir l'ID utilisateur
	let userId;
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		console.log("token décodé :", decoded);
		userId = decoded.id;  // car dans ton backend : generateToken(user.id)
	} catch (err) {
		return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
	}

	
	// * NOTE: APPEL DE L'API POUR RECUPERER L'UTILISATEUR

	const profileResponse = await fetch(`http://localhost:8000/api/user-info`, {
		method: "GET",
		headers: {cookie: cookieHeader},
	});
	const user = await profileResponse.json();


	// * NOTE: RECUPERE LE PROFIL DE L'USER

	const userProfileSummary = `Profil utilisateur :
		- Âge : ${user.age} ans  
		- Poids : ${user.weight} kg  
		- Objectif course hebdomadaire : ${user.weeklyGoal}`;


	// * NOTE: RECUPERE LES 10 DERNIERES COURSES

	const today = new Date();
	const end = today.toISOString().split('T')[0]; 

	const oneYearAgo = new Date();
	oneYearAgo.setMonth(today.getMonth() - 12);
	const start = oneYearAgo.toISOString().split('T')[0];



	// * NOTE: APPEL DE L'API POUR RECUPERER LES ACTIVITES DE L'UTILISATEUR

	const runsResponse = await fetch(`http://localhost:8000/api/user-activity?startWeek=${start}&endWeek=${end}`, {
		method: "GET",
		headers: {cookie: cookieHeader},
	});
	if (!runsResponse.ok) {
		return new Response(JSON.stringify({ error: "Impossible de récupérer les courses" }), { status: 500 });
	}

	// Récupère les données des courses depuis la réponse API et les transforme en JSON.
	// Si la réponse est vide ou invalide, on utilise un tableau vide pour éviter les erreurs.
	const runningData = await runsResponse.json() || [];

	// Trie les courses par date, de la plus récente à la plus ancienne.
	// new Date(b.date) - new Date(a.date) permet de comparer les dates en millisecondes.
	const sortedRuns = runningData.sort((a, b) => new Date(b.date) - new Date(a.date));

	// Sélectionne les 10 dernières courses uniquement.
	// slice(0, 10) prend les éléments de l'index 0 à 9.
	const last10Runs = sortedRuns.slice(0, 10);

	// Déclare une variable qui contiendra le résumé des courses.
	let runsSummary;

	// Vérifie si le tableau last10Runs est vide (aucune course disponible).
	if (last10Runs.length === 0) {
	// Si aucune course, affiche un message informatif.
	runsSummary = "Aucune course enregistrée pour le moment.";
	} else {
	// Sinon, on crée un résumé pour chaque course.
	runsSummary = last10Runs.map((run, index) => 
		// Pour chaque course, on affiche :
		// - le numéro de la course (index + 1),
		// - la date formatée en format local,
		// - la distance parcourue en km,
		// - la durée en minutes,
		// - les calories brûlées.
		`Course ${index + 1} : le ${new Date(run.date).toLocaleDateString()}, 
		distance ${run.distance} km, 
		durée ${run.duration} min, 
		calories brûlées ${run.caloriesBurned}.`
	// On transforme le tableau de chaînes en une seule chaîne, avec un retour à la ligne entre chaque course.
	).join("\n");
	}


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
	const timeout = setTimeout(() => controller.abort(), 10000);

	try{

		// * NOTE: PROMPTS POUR L'USER ET POUR L'IA
		// Prompt du coach IA pour son personna

		const systemPrompt = `Tu es "Coach IA", un coach sportif et nutrition bienveillant.
			Ton rôle : aider chaque utilisateur à progresser selon son niveau et ses objectifs, en restant toujours positif et encourageant.
			Tu donnes des recommandations simples, concrètes, adaptées et réalistes, sans mettre l’utilisateur en danger.
			Avant de donner un conseil, tu poses des questions pour personnaliser tes réponses selon le niveau (débutant / intermédiaire / expert) et les contraintes de l’utilisateur.
			Tu adaptes les recommandations selon le niveau et les capacités de l'utilisateur.

			Règles principales :
			- reste formel
			- Ne jamais juger, rester positif
			- Conseils réalistes, sans mise en danger
			- Réponses courtes et actionnables (exercices, temps, séries, alimentation)
			- analyse automatiquement les données de l'utilisateur (dernières courses, intensité, fréquence, distance, habitudes, objectif)
			- référes toi aux performances récentes de l'utilisateur pour ajuster les conseils.
			- Résume automatiquement les informations importantes de l’historique de conversation avant d’ajouter les nouvelles questions ou réponses, sans mettre de titre
			- si nutrition pré-course → génère réponse personnalisée avec un timing des repas (3h,1h et 30 min avant) et les amilments recommandés et hydratation
			- si préparation d'objectif → évalue la faisabilité : réalisme de l'objectif selon les données actuelles, étapes intermédiaires recommandées et types d'entrainements à privilégier
			- Si douleur ou blessure → priorité sécurité + suggérer de consulter un professionnel si nécessaire,
			- Si question hors sujet → répondre gentiment et proposer de revenir au sport/nutrition
			- Si données manquantes → poser 1 ou 2 questions simples pour compléter
			- Adapter le langage selon le niveau (débutant / intermédiaire / expert)
			Tu dois répondre uniquement en texte Markdown standard.
			N'ajoute jamais de classes CSS, jamais de balises HTML, jamais de style inline.
			Si tu fais une liste, utilise simplement des "-".
			Si tu fais un titre, utilise ## ou ###.


			À chaque réponse :
			1. Reformule brièvement l’objectif de l'utilisateur pour montrer l'écoute sans mettre de titre
			2. Donne un plan clair ou un conseil concret, en prenant en compte les données de course et les performances récentes
			3. Mets seulement des titres pour les conseils`;


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
	
		// récupère le texte généré par l’IA
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
