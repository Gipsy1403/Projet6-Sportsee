"use client";
import { createContext, useState, useContext, useEffect} from "react"

// 🔹 Création du contexte global
const GlobalContext = createContext();

// Composant fournisseur global pour partager des données dans toute l'application
export function GlobalProvider({ children }) {

    // État pour gérer les données de course ("running")
    const [running, setRunning] = useState({
        start: "",               // date de début sélectionnée
        end: "",                 // date de fin sélectionnée
        activities: [],          // tableau des activités de course
        range: { start: "", end: "" }, // plage de dates utilisée pour filtrer les courses
        loading: false           // indique si les données sont en cours de chargement
    });

    // État pour gérer les données de fréquence cardiaque ("heartRate")
    const [heartRate, setHeartRate] = useState({
        start: "",      // date de début sélectionnée
        end: "",        // date de fin sélectionnée
        bpmData: [],    // tableau contenant les mesures de battements par minute
        loading: false  // indique si les données sont en cours de chargement
    });

	// Fonction asynchrone pour récupérer les données de course sur une période donnée
	const fetchRunning = async (endDate) => {
	// Indique que le chargement des données est en cours
	// 'prev' = état précédent, on ne change que la propriété 'loading'
		setRunning(prev => ({ ...prev, loading: true }));

	// Détermine la date de fin :
	// - si endDate est fourni, on l'utilise
	// - sinon, on prend la date actuelle
		const end = endDate ? new Date(endDate) : new Date();

	// Crée une date de début à partir de la date de fin
		const start = new Date(end);

	// Ajuste la date de début pour avoir une période de 28 jours au total
	// end.getDate() - 27 → on recule de 27 jours à partir de la date de fin
		start.setDate(end.getDate() - 27);

	// Transforme la date de début en chaîne au format ISO et ne garde que la partie "yyyy-mm-dd"
		const startStr = start.toISOString().split("T")[0];

	// Transforme la date de fin en chaîne au format ISO et ne garde que la partie "yyyy-mm-dd"
		const endStr = end.toISOString().split("T")[0];


		const res = await fetch(
			`http://localhost:8000/api/user-activity?startWeek=${startStr}&endWeek=${endStr}`,
			{ credentials: "include" }
		);
		const data = await res.json();

		// Met à jour l'état 'running' avec les nouvelles données récupérées
		setRunning({
		// Date de début de la période (chaîne "yyyy-mm-dd")
			start: startStr,

		// Date de fin de la période (chaîne "yyyy-mm-dd")
			end: endStr,

		// Les activités récupérées depuis l'API
			activities: data,

		// La plage de dates utilisée pour le filtrage, utile pour d'autres calculs ou affichages
			range: { start: startStr, end: endStr },

		// Chargement terminé, on éteint le voyant "loading"
			loading: false
		});

	};


	// Fonction asynchrone pour récupérer les données de fréquence cardiaque sur une semaine
	const fetchHeartRate = async (endDate) => {
	// Active le chargement dans l'état 'heartRate' sans toucher aux autres données
		setHeartRate(prev => ({ ...prev, loading: true }));

	// Détermine la date de référence :
	// - si endDate est fourni, on l'utilise
	// - sinon, on prend aujourd'hui
		const today = endDate ? new Date(endDate) : new Date();

		// Trouve le lundi de la semaine contenant 'today'
		const monday = new Date(today);          // commence avec la date du jour
		const day = monday.getDay();             // récupère le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
		const diff = (day === 0 ? -6 : 1 - day); // calcule le décalage pour revenir au lundi
		monday.setDate(monday.getDate() + diff); // recule ou avance pour arriver au lundi

		// Trouve le dimanche de la même semaine
		const sunday = new Date(monday);        // commence avec le lundi
		sunday.setDate(monday.getDate() + 6);   // avance de 6 jours pour arriver au dimanche

		// Transforme les dates en chaînes ISO au format "yyyy-mm-dd" pour l'API ou le filtrage
		const startStr = monday.toISOString().split("T")[0];
		const endStr = sunday.toISOString().split("T")[0];


		const res = await fetch(
			`http://localhost:8000/api/user-activity?startWeek=${startStr}&endWeek=${endStr}`,
			{ credentials: "include" }
		);
		const data = await res.json();

		// Transforme les données brutes des activités en format plus simple pour le suivi de la fréquence cardiaque
		const bpmData = data.map(activity => ({
			date: activity.date,                 // date de l'activité
			minBpm: activity.heartRate.min,      // fréquence cardiaque minimale pendant l'activité
			maxBpm: activity.heartRate.max,      // fréquence cardiaque maximale pendant l'activité
			avgBpm: activity.heartRate.average   // fréquence cardiaque moyenne pendant l'activité
		}));

		// Met à jour l'état 'heartRate' avec les nouvelles données
		setHeartRate({
			start: startStr,      // début de la semaine
			end: endStr,          // fin de la semaine
			bpmData,              // tableau contenant min, max et moyenne des bpm pour chaque activité
			loading: false        // le chargement est terminé
		});

	};


// Fonction pour passer au mois suivant dans les données de course
const goToNextMonth = () => {
    // Crée une nouvelle date à partir de la date de fin actuelle
	const newEnd = new Date(running.end);

    // Avance de 28 jours pour aller au mois suivant
	newEnd.setDate(newEnd.getDate() + 28);

    // Récupère les données de course pour la nouvelle période
	fetchRunning(newEnd);
};

	// Fonction pour revenir au mois précédent dans les données de course
	const goToPreviousMonth = () => {
	// Crée une nouvelle date à partir de la date de début actuelle
		const newEnd = new Date(running.start);

	// Recule d'un jour pour prendre la veille du début actuel
		newEnd.setDate(newEnd.getDate() - 1);

	// Récupère les données de course pour la nouvelle période
		fetchRunning(newEnd);
	};

	// Fonction pour passer à la semaine suivante dans les données de fréquence cardiaque
	const goToNextWeek = () => {
	// Crée une nouvelle date à partir de la date de fin actuelle
		const newEnd = new Date(heartRate.end);

	// Avance de 7 jours pour aller à la semaine suivante
		newEnd.setDate(newEnd.getDate() + 7);

	// Récupère les données de fréquence cardiaque pour la nouvelle semaine
		fetchHeartRate(newEnd);
	};

	// Fonction pour revenir à la semaine précédente dans les données de fréquence cardiaque
	const goToPreviousWeek = () => {
	// Crée une nouvelle date à partir de la date de début actuelle
		const newEnd = new Date(heartRate.start);

	// Recule d'un jour pour prendre la veille du début actuel
		newEnd.setDate(newEnd.getDate() - 1);

	// Récupère les données de fréquence cardiaque pour la nouvelle semaine
		fetchHeartRate(newEnd);
	};

	// useEffect pour initialiser les données dès que le composant est monté
	useEffect(() => {
	// Récupère les données de course pour la période actuelle
		fetchRunning(new Date());

	// Récupère les données de fréquence cardiaque pour la semaine actuelle
		fetchHeartRate(new Date());
	}, []); // [] = exécute l'effet une seule fois au montage du composant

	// Retourne le composant Provider pour partager les données globales
	return (
	<GlobalContext.Provider 
		value={{
			running,            // données de course
			heartRate,          // données de fréquence cardiaque
			goToNextMonth,      // fonction pour passer au mois suivant
			goToPreviousMonth,  // fonction pour revenir au mois précédent
			goToNextWeek,       // fonction pour passer à la semaine suivante
			goToPreviousWeek    // fonction pour revenir à la semaine précédente
		}}
	>
		{/* rend tous les composants enfants qui auront accès au contexte */}
		{children}
	</GlobalContext.Provider>
	);
}
// Hook personnalisé pour utiliser le contexte global
export const useUser = () => useContext(GlobalContext);


