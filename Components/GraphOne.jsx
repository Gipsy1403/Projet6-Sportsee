"use client";
import { useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar , ReferenceLine, Cell } from "recharts";
import Styles from "@/app/dashboard/dashboard.module.css";
import { useUser } from "./GlobalContext";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Fonction pour grouper les courses par semaine à partir d'une date de départ
export function groupByWeek(runningData, startDate) {
    // Transforme la date de départ en objet dayjs pour manipuler facilement les dates
	const start = dayjs(startDate);

    // Crée un tableau de 4 semaines (0 à 3)
	const weeks = [0, 1, 2, 3].map(i => {
        // Calcule le début de la semaine i (start + i*7 jours)
		const weekStart = start.add(i * 7, "day");

        // Calcule la fin de la semaine i (6 jours après le début)
		const weekEnd = weekStart.add(6, "day");

        // Filtre les courses qui sont dans cette semaine et additionne leur distance
		const totalDistance = runningData
			.filter(a =>
                // garde seulement les courses >= début de la semaine
			    dayjs(a.date).isSameOrAfter(weekStart) &&
                // et <= fin de la semaine
			    dayjs(a.date).isSameOrBefore(weekEnd)
			)
            // additionne les distances de toutes les courses filtrées
			.reduce((sum, a) => sum + a.distance, 0);

        // Retourne un objet pour la semaine courante
		return {
            week: `S${i + 1}`, // étiquette de la semaine (S1, S2, S3, S4)
            dateRange: `${weekStart.format("DD/MM")} au ${weekEnd.format("DD/MM")}`, // plage de dates
            totalDistance: Number(totalDistance.toFixed(1)) // distance totale arrondie à 1 décimale
		};
	});

    // Retourne le tableau contenant les 4 semaines avec leur distance totale
	return weeks;
}


// Fonction pour calculer la distance moyenne sur plusieurs semaines
function averageDistance(weeks) {
    // Additionne toutes les distances totales de chaque semaine
	const total = weeks.reduce((sum, w) => sum + w.totalDistance, 0);

    // Calcule la moyenne en divisant par le nombre de semaines et arrondit à l'entier le plus proche
	return Math.round(total / weeks.length);
}

// Composant pour afficher un tooltip personnalisé sur un graphique
function CustomTooltip({ active, payload }) {
    // Si le tooltip n'est pas actif ou s'il n'y a pas de données, ne rien afficher
	if (!active || !payload || payload.length === 0) return null;

    // Récupère les données de la première entrée du payload
	const data = payload[0].payload;

    // Retourne un petit encadré stylisé pour le tooltip
	return (
		<div style={{
			backgroundColor: "#000",  // fond noir
			color: "#fff",            // texte blanc
			padding: "6px 10px",      // un peu de marge intérieure
			borderRadius: 10           // coins arrondis
		}}>
			{/* Affiche la plage de dates de la semaine */}
			<div>{data.dateRange}</div>

			{/* Affiche la distance totale de la semaine */}
			<div>{data.totalDistance} km</div> 
		</div>
	);
};


export default function RunningChart() {
	// Récupère les données et fonctions de navigation depuis le contexte global
	const { running, goToNextMonth, goToPreviousMonth } = useUser(); // ⬅️ running = données des courses, fonctions pour changer de mois

	// État pour savoir si la souris survole un élément (ex: pour un effet visuel)
	const [isHovered, setIsHovered] = useState(false);

	// Si les données sont en train de charger, afficher un message d'attente
	if (running.loading) return <p>Chargement des données...</p>;

	// Déstructure les informations principales des courses
	const { activities, start, end } = running;

	// Regroupe les courses par semaine à partir de la date de début
	const weeks = groupByWeek(activities, start);

	// Calcule la distance moyenne sur les semaines
	const average = averageDistance(weeks);

	// Transforme les dates de début et de fin en objets dayjs pour manipulation plus facile
	const startDate = dayjs(start);
	const endDate = dayjs(end);


  return (
	<section>
		<div className={Styles.chart_km}>
		<div className={Styles.km_header}>
			<h4>{average}km en moyenne</h4>
			<button onClick={goToPreviousMonth}>&lt;</button>
			<span>{startDate.format("DD MMM")} - {endDate.format("DD MMM")}</span>
			<button onClick={goToNextMonth}>&gt;</button>
		</div>

		<p className={Styles.km_title}>Total des kilomètres des 4 dernières semaines</p>

		<BarChart
			width={403}
			height={350}
			data={weeks}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<XAxis dataKey="week" orientation="bottom" dy={10} tickLine={false} tick={{ fontSize: 12 }} />
			<YAxis tickLine={false} domain={[0, 30]} ticks={[0, 10, 20, 30]} tick={{ fontSize: 10 }} />
			<Tooltip content={<CustomTooltip />} />
			<Legend iconType="circle" iconSize={8} align="left" formatter={(value) => <span style={{ color: "#707070" }}>{value}</span>} wrapperStyle={{ fontSize: 12, marginLeft: 40 }} />
			<ReferenceLine y={14} stroke="#f1f1f1" strokeDasharray="2 2" />
			<ReferenceLine y={28} stroke="#f1f1f1" strokeDasharray="2 2" />
			<Bar dataKey="totalDistance" name="km" fill="#b6bdfc" radius={30} barSize={14}>
			{weeks.map((_, index) => (
			<Cell key={index} fill={isHovered ? "#0b23f4" : "#b6bdfc"} />
			))}
			</Bar>
		</BarChart>
		</div>
	</section>
  );
}