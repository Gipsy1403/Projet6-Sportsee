

// import { Mistral } from "@mistralai/mistralai";

// export async function POST(req) {
// 	// lit le message envoyé par le front
// 	const { message } = await req.json();

// 	// nettoie en enlevant les espaces en début et fin puis supprime les balises HTML
// 	const cleaneMessage=message.trim().replace(/<\/?[^>]*>/g, ""); 

// 	// vérifie que le message n'est pas vide après nettoyage
// 	if (cleanedMessage.length === 0) {
// 		return new Response(JSON.stringify({ error: "Message vide" }), {
// 		status: 400,
// 		});
// 	}
// 	// Limite la taille du prompt 
// 	const MAX_LENGTH = 500; 
// 	if (cleanedMessage.length > MAX_LENGTH) {
// 		return new Response(
// 			JSON.stringify({
// 			error: `Le message est trop long. Maximum autorisé : ${MAX_LENGTH} caractères.`,
// 			}),
// 			{ status: 413 }
// 		);
// 	}

// 	// Timeout
// 	const controller = new AbortController();
// 	const timeout = setTimeout(() => controller.abort(), 10_000);

// 	try{
// 		// initialise l'API Mistral avec la clé secrète
// 		const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
	
// 		// envoie le message à Mistral
// 		const response = await client.chat.complete({
// 			model: "mistral-small",
// 			messages: [{ role: "user", content: cleaneMessage }],
// 		},
// 		// primordial pour le timeout
// 		{signal: controller.signal}
// 		);
// 		// annule le timeout si IA mistral répond à temps
// 		clearTimeout(timeout);
	
// 		// récupère le texte généré par l’IA
// 		const reply = response.choices[0].message.content;
	
// 		// renvoie la réponse au front
// 		return new Response(JSON.stringify({ reply }), {
// 		status: 200,
// 		headers: { "Content-Type": "application/json" },
// 		});

// 	} catch (error) {
// 	clearTimeout(timeout);
// 	// Timeout déclenché
// 		if (error.name === "AbortError") {
// 			return new Response(
// 			JSON.stringify({ error: "Le serveur met trop de temps à répondre. Réessayez plus tard." }),
// 			{ status: 504 }
// 			);
// 		}

// 	// Autres erreurs API
// 	console.error("Erreur API Mistral :", error);
// 		return new Response(
// 			JSON.stringify({ error: "Une erreur est survenue avec l'IA. Réessayez plus tard." }),
// 			{ status: 500 }
// 		);
// 	}
// }
