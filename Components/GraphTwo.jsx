"use client";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";
import { ResponsiveContainer, BarChart, Bar, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from "recharts";
import { useState } from "react";
import "dayjs/locale/fr";
import Styles from "@/app/dashboard/dashboard.module.css";
import { useUser } from "./GlobalContext";

// 🔹 Étendre dayjs avec des plugins utiles
dayjs.extend(isoWeek);     // pour travailler avec les semaines ISO (lundi = début)
dayjs.extend(weekday);     // pour accéder facilement aux jours de la semaine
dayjs.extend(isBetween);   // pour vérifier si une date est entre deux autres
dayjs.locale("fr");        // définir la langue en français

// 🔹 Calcul de la moyenne de la semaine
function calculateWeekAverage(weekData) {
    // Ne garder que les jours où il y a des données (avgBpm != null)
    const daysWithData = weekData.filter(day => day.avgBpm !== null);

    // Additionner toutes les moyennes de bpm
    const total = daysWithData.reduce((sum, day) => sum + day.avgBpm, 0);

    // Retourne la moyenne si on a des jours avec données, sinon 0
    return daysWithData.length > 0 ? total / daysWithData.length : 0;
}

// 🔹 Préparer les données pour afficher la semaine complète
function getWeekHeartRateData(bpmData, selectedDate) {
    // Calculer le lundi et le dimanche de la semaine de la date sélectionnée
    const weekStart = dayjs(selectedDate).isoWeekday(1).startOf("day"); // lundi
    const weekEnd = dayjs(selectedDate).isoWeekday(7).endOf("day");     // dimanche

    // Créer un tableau avec les 7 jours de la semaine
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const day = weekStart.add(i, "day"); // jour courant
        const label = day.format("ddd")      // nom court du jour (ex: lun.)
            .replace(".", "")                // enlever le point
            .charAt(0).toUpperCase() +       // mettre la première lettre en majuscule
            day.format("ddd").replace(".", "").slice(1); // reste du nom

        // Ajouter le jour avec des valeurs initiales null pour bpm
        weekDays.push({ 
            label, 
            date: day.format("YYYY-MM-DD"), 
            minBpm: null, 
            maxBpm: null, 
            avgBpm: null 
        });
    }

    // Associer les données existantes aux jours correspondants
    if (Array.isArray(bpmData)) {
        bpmData.forEach((entry) => {
            const d = dayjs(entry.date);

            // Vérifie si la date de la donnée est dans la semaine
            if (d.isBetween(weekStart, weekEnd, null, "[]")) { // [] inclus
                const index = d.isoWeekday() - 1; // 0 = lundi, 6 = dimanche

                // Remplit les bpm existants dans le tableau
                weekDays[index].minBpm = entry.minBpm;
                weekDays[index].maxBpm = entry.maxBpm;
                weekDays[index].avgBpm = entry.avgBpm;
            }
        });
    }

    // Retourne la semaine complète avec bpm pour chaque jour (ou null si pas de données)
    return weekDays;
};


// Composant pour afficher le graphique de la fréquence cardiaque hebdomadaire
export default function WeekHeartRateChart() {
    // Récupère depuis le contexte global :
    // - les données de fréquence cardiaque
    // - les fonctions pour naviguer entre les semaines
	const { heartRate, goToNextWeek, goToPreviousWeek } = useUser();

    // État pour la date sélectionnée (par défaut aujourd'hui)
    const [selectedDate, setSelectedDate] = useState(new Date());

    // État pour la couleur de la ligne du graphique (modifiable si besoin)
    const [lineColor, setLineColor] = useState('#f2f3ff');

    // Prépare les données de la semaine complète pour le graphique
    const weekData = getWeekHeartRateData(heartRate.bpmData, selectedDate);

    // Calcule le lundi de la semaine sélectionnée
    const weekStart = dayjs(selectedDate).isoWeekday(1).startOf("day"); 

    // Calcule le dimanche de la semaine sélectionnée
    const weekEnd = dayjs(selectedDate).isoWeekday(7).endOf("day"); 

    // Calcule la moyenne des bpm de la semaine
    const weekAverage = calculateWeekAverage(weekData);


    return (
        <section>
            <div className={Styles.chart_bpm}>
                <div className={Styles.bpm_header}>
                    <h4>{Math.round(weekAverage)} BPM</h4>
                    <div>
					<button onClick={() => {
						const prevWeek = dayjs(selectedDate).subtract(1, "week").toDate();
						setSelectedDate(prevWeek);
						goToPreviousWeek();
					}}>&lt;</button>
					<span>{weekStart.format("DD MMM")} - {weekEnd.format("DD MMM")}</span>
					<button onClick={() => {
						const nextWeek = dayjs(selectedDate).add(1, "week").toDate();
						setSelectedDate(nextWeek);
						goToNextWeek();
					}}>&gt;</button>
                    </div>
                </div>
                <p className={Styles.bpm_title}>Fréquence cardiaque moyenne</p>
                <ResponsiveContainer width={503} height={350}>
                    <BarChart data={weekData} onMouseEnter={()=>setLineColor("#0b23f4")} onMouseLeave={()=>setLineColor("#f2f3ff")}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="label" tickLine={false} orientation="bottom" dy={10} tick={{fontSize:12}}/>
                        <YAxis tickLine={false} domain={[130, 187]} ticks={[130, 145, 160, 187]} tick={{fontSize:10}}/>
                        <Bar dataKey="minBpm" fill="#fcc1b6" radius={30} barSize={14} name="Min" legendType="square"/>
                        <Bar dataKey="maxBpm" fill="#f4320b" radius={30} barSize={14} name="Max" legendType="square"/>
                        <Line type="monotone" dataKey="avgBpm" stroke={lineColor} strokeWidth={3} dot={{ r: 3 ,stroke: '#0b23f4',fill: '#0b23f4'}} name="Moyenne BPM" legendType="line" activeDot={{ r: 5, stroke: '#0b23f4', strokeWidth: 2, fill: '#0b23f4' }}/>
                        <Legend
                            payload={[
                                { value: 'Moyenne BPM', type: 'line', color: '#f2f3ff' },
                                { value: 'Max', type: 'square', color: '#f4320b' },
                                { value: 'Min', type: 'square', color: '#fcc1b6' },
                            ]}
                            formatter={(value) => <span style={{ color: '#707070' }}>{value}</span>}
                            wrapperStyle={{ fontSize: 12, marginLeft:40 }}
                            iconType="circle"
                            iconSize={8}
                            align="left"
                        />
                        <ReferenceLine y={145} stroke="#f1f1f1" strokeDasharray="2 2" />
                        <ReferenceLine y={160} stroke="#f1f1f1" strokeDasharray="2 2" />
                        <ReferenceLine y={187} stroke="#f1f1f1" strokeDasharray="2 2" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>    
    );
};
