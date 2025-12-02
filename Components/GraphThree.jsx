import { currentWeek } from "@/app/dashboard/page";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Styles from "@/app/dashboard/dashboard.module.css";


// Fonction pour filtrer les courses d'une semaine donnée
function datesWeek(runningData, start, end) {
    // Transforme la date de début et de fin en objets Date
	const monday = new Date(start);
	const sunday = new Date(end);

    // Filtre les courses dont la date est comprise entre lundi et dimanche
	return runningData.filter(run => {
		const runDate = new Date(run.date); // transforme la date de la course en objet Date
		return runDate >= monday && runDate <= sunday; // garde uniquement celles dans la semaine
	});
}

// Fonction pour calculer les objectifs hebdomadaires réalisés et restants
function calculObjectifs(runningData, start, end, weeklyGoal) {
    // Récupère toutes les courses de la semaine
	const runsThisWeek = datesWeek(runningData, start, end);

    // Nombre de courses réalisées cette semaine
	const objectifAccomplished = runsThisWeek.length;

    // Nombre de courses restantes pour atteindre l'objectif
	const objectifNotAccomplished = weeklyGoal - objectifAccomplished;

    // Retourne un tableau d'objets utilisable pour un graphique ou un affichage
	return [
		{ name: "réalisées", value: objectifAccomplished }, 
		{ 
            name: "restantes", 
            value: objectifNotAccomplished > 0 ? objectifNotAccomplished : 0 // si négatif, met 0
        },
	];
}


// Fonction pour obtenir le lundi et le dimanche de la semaine en cours
function currentWeekStartEnd() {
    // Récupère la date d'aujourd'hui
	const today = new Date();

    // Crée une copie de la date d'aujourd'hui pour calculer le lundi
	const monday = new Date(today);

    // Récupère le jour de la semaine (0 = dimanche, 1 = lundi, ...)
	const day = monday.getDay();

    // Calcule le décalage pour revenir au lundi
    // si c'est dimanche (0), recule de 6 jours ; sinon, recule jusqu'au lundi
	const diff = (day === 0 ? -6 : 1 - day);

    // Ajuste la date pour obtenir le lundi de la semaine
	monday.setDate(monday.getDate() + diff);

    // Crée la date du dimanche correspondant
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);

    // Retourne les dates sous forme de chaînes "yyyy-mm-dd"
	return {
		start: monday.toISOString().split("T")[0],
		end: sunday.toISOString().split("T")[0],
	};
}

// Fonction pour créer un label correct selon le nombre et le nom
function labelAccord(value, name) {
    // Si c'est pour "réalisées"
	if (name === "réalisées") {
        // singulier si 1 ou moins, pluriel sinon
		return value <= 1 ? `${value} réalisée` : `${value} réalisées`;
	}

    // Si c'est pour "restantes"
	if (name === "restantes") {
        // singulier si 1 ou moins, pluriel sinon
		return value <= 1 ? `${value} restante` : `${value} restantes`;
	}

    // Par défaut, retourne "valeur nom" (ex: 3 objectifs)
	return `${value} ${name}`;
}


// Composant pour afficher un graphique des objectifs hebdomadaires
export default function ObjectifsChart({ runningData, weeklyGoal }) {
    // Récupère le lundi et le dimanche de la semaine en cours
	const { start, end } = currentWeekStartEnd();

    // Calcule les objectifs réalisés et restants pour la semaine
	const objectifData = calculObjectifs(runningData, start, end, weeklyGoal);

    // Couleurs utilisées pour le graphique (réalisé / restant)
	const colors = ["#0b23f4", "#b6bdfc"];

    // Récupère la valeur des objectifs réalisés
	const objectifAccomplished = objectifData[0].value;

    // Choisit le label correct selon le nombre d'objectifs réalisés
	const objectifLabel = objectifAccomplished <= 1 ? "objectif réalisé" : "objectifs réalisés";

    // Fonction pour calculer la position d'un label personnalisé sur le graphique
	const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
	    const RADIAN = Math.PI / 180; // conversion degrés → radians pour trigonométrie

	    // Calcule la distance entre le centre et le label (un peu en dehors du graphique)
	    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;

	    // Calcule la position X du label en utilisant le cosinus de l'angle
	    const x = cx + radius * Math.cos(-midAngle * RADIAN);

	    // Calcule la position Y du label en utilisant le sinus de l'angle
	    const y = cy + radius * Math.sin(-midAngle * RADIAN);


	// Retourne un élément <text> SVG pour afficher le label personnalisé sur le graphique
		return (
			<text
			x={x} // position horizontale calculée précédemment
			y={y} // position verticale calculée précédemment
			fill="black" // couleur du texte
			textAnchor={x > cx ? "start" : "end"} // aligne le texte à gauche ou à droite selon la position par rapport au centre
			dominantBaseline="central" // aligne verticalement le texte au centre
			fontSize={10} // taille du texte
			fontWeight={400} // épaisseur du texte (normal)
			color="#707070" // couleur secondaire (attention : pour SVG c'est fill qui compte)
			>
			{/* Affiche le label correctement accordé (singulier/pluriel) avec la valeur et le nom */}
			{labelAccord(objectifData[index].value, objectifData[index].name)} 
			</text>
		);

	};

	return (
		<section>
				<div className={Styles.chart_objectif}>
					<div className={Styles.objectif_title}>
						<h3>{objectifAccomplished}<span className={Styles.objectif_subtitle}> {objectifLabel} sur {weeklyGoal}</span></h3>
					</div>
					<p>Courses hebdomadaire réalisées</p>

					<PieChart width={300} height={200}>
						<Pie
							data={objectifData} // on utilise les données calculées
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={30}
							outerRadius={70}
							label={renderCustomLabel}
							labelLine={false}
							className={Styles.chart_objectif_label}
						>
						{objectifData.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
						))}
						</Pie>
						<Tooltip />
					</PieChart>
				</div>
		</section>
	);
}
