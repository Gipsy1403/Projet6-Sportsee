"use client";
import Image from "next/image";
import Styles from "./dashboard.module.css";
import { useState, useEffect } from "react";
import RunningChart from "@/Components/GraphOne";
import WeekHeartRateChart from "@/Components/GraphTwo";
import DateFormated from "@/Components/DateFormated";
import ObjectifsChart from "@/Components/GraphThree";
import { useUser } from "@/Components/GlobalContext";
import Link from "next/link";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import EffectsPages from "@/Components/EffectPage";

// Fonction pour calculer la durée totale des sessions d'une semaine
// 'data' = tableau d'objets de course avec date et durée
// 'range' = objet avec 'start' et 'end' définissant la période de la semaine
function weekDuration(data, range) {
	 // Si le tableau de données est vide ou inexistant, on retourne 0
	if (!data) return 0;
    // Filtre les sessions qui sont dans la plage de dates spécifiée
    const sessions = data.filter(s => {
        const d = new Date(s.date); // transforme la date de la session en objet Date
        // garde seulement les sessions dont la date est >= start et <= end
        return d >= new Date(range.start) && d <= new Date(range.end);
    });

    // Additionne la durée de toutes les sessions filtrées
    // reduce prend chaque session 's' et additionne 's.duration' au total
    return sessions.reduce((sum, s) => sum + s.duration, 0);
}

// Fonction pour calculer la distance totale parcourue pendant une semaine
// 'data' = tableau d'objets de course avec date et distance
// 'range' = objet avec 'start' et 'end' définissant la période de la semaine
function weekDistance(data, range) {
    // Si le tableau de données est vide ou inexistant, on retourne 0
    if (!data) return 0;

    // Filtre les sessions qui sont dans la plage de dates spécifiée
    const sessions = data.filter(s => {
        const d = new Date(s.date); // transforme la date de la session en objet Date
        // garde seulement les sessions dont la date est >= start et <= end
        return d >= new Date(range.start) && d <= new Date(range.end);
    });

    // Additionne la distance de toutes les sessions filtrées
    // reduce prend chaque session 's' et additionne 's.distance' au total
    // toFixed(1) arrondit le résultat à 1 chiffre après la virgule
    // Number() transforme la chaîne obtenue par toFixed en nombre réel
    return Number(sessions.reduce((sum, s) => sum + s.distance, 0).toFixed(1));
}


// Fonction pour formater une date en français (jj/mm/aaaa)
function formatDateFR(dateString) {
    // Transforme la chaîne de caractères en objet Date
    const date = new Date(dateString);

    // Récupère le jour du mois et ajoute un zéro devant si besoin (01, 02, ..., 31)
    const day = String(date.getDate()).padStart(2, "0");

    // Récupère le mois et ajoute un zéro devant si besoin (01, 02, ..., 12)
    // Attention : en JavaScript, janvier = 0, donc on ajoute +1
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // Récupère l'année à 4 chiffres
    const year = date.getFullYear();

    // Construit la chaîne finale au format jj/mm/aaaa
    return `${day}/${month}/${year}`;
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

// Composant principal du tableau de bord
export default function PageDashboard() {
    // Récupère les données de l'utilisateur via un hook personnalisé `useUser`
    // 'running' contient les activités de course et la plage de dates
	const { running } = useUser(); 
	// Récupère le lundi et le dimanche de la semaine en cours
	const { start, end } = currentWeekStartEnd();

    // Récupère la liste des activités de course
	const activities = running.activities;

    // Récupère la plage de dates utilisée pour le dashboard
	const range = running.range;

    // Déclare un état pour stocker le profil utilisateur (initialement null)
	const [profile, setProfile] = useState(null);

    // Déclare un état pour stocker les statistiques utilisateur (initialement null)
	const [statistics, setStatistics] = useState(null);

    // Déclare un état pour afficher un message à l'utilisateur (ex: erreur)
	const [message, setMessage] = useState("");

    // useEffect sert à exécuter du code après le premier rendu du composant
	useEffect(() => {
        // Fonction interne asynchrone pour récupérer les infos du dashboard
	    const handleDashboard = async () => {
		    try {
                // Envoie une requête GET vers l'API pour récupérer les infos utilisateur
		        const res = await fetch("http://localhost:8000/api/user-info", {
			        method: "GET",
			        credentials: "include", // envoie les cookies pour l'authentification
		        });

                // Transforme la réponse en JSON pour pouvoir l'utiliser
		        const data = await res.json();

                // Si la réponse est OK (statut 200)
		        if (res.ok) {
                    // On met à jour l'état 'profile' avec les infos du profil
			        setProfile(data.profile);

                    // On met à jour l'état 'statistics' avec les statistiques
			        setStatistics(data.statistics);
		        } else {
                    // Si la réponse n'est pas OK, on affiche un message d'erreur
			        setMessage(data.message || "Erreur lors de la récupération du profil");
		        }
		    } catch (err) {
                // Si erreur réseau ou autre problème, on affiche un message d'erreur dans la console
		        console.error(err);
		        setMessage("Erreur réseau");
		    }
	    };

        // Appelle la fonction pour récupérer les infos dès que le composant se charge
	    handleDashboard();
	}, []); // Le tableau vide [] signifie que l'effet ne s'exécute qu'une seule fois, au montage du composant

	if (!profile) return <p>Chargement du profil...</p>;

	return (
	<>
		<EffectsPages>
			<Header />
			<section>
				{/* Zone conversation IA */}
				<div className={Styles.conversation}>
					<div className={Styles.text}>
						<Image src="/assets/images/Icone AI.png" alt="Icone AI" width={16} height={16} />
						<h5>Posez vos questions sur vos performances ou objectifs.</h5>
					</div>
					<button><Link href="/chat">Lancer une conversation</Link></button>
				</div>

				{/* Profil */}
				<div className={Styles.dashboard_profile_container}>
					<div className={Styles.dashboard_profile}>
						<Image src="/assets/images/Photo profil.png" alt="Photo de profil" width={104} height={117} />
						<div>
							<h4>{profile.firstName} {profile.lastName}</h4>
							<p>Membre depuis le <DateFormated date={profile.createdAt} /></p>
						</div>
					</div>
					<div className={Styles.dashboard_distance}>
						<p>Distance totale parcourue</p>
						<div className={Styles.dashboard_distance_nbre}>
							<Image src="/assets/images/OUTLINE.png" alt="icone distance" width={34} height={34} />
							<h4>{statistics.totalDistance} km</h4>
						</div>
					</div>
				</div>
				{/* Graphiques */}
				<h4 className={Styles.dashboard_performance_title}>Vos dernières performances</h4>

				{activities?.length > 0 ? (
					<div className={Styles.dashboard_performance_month}>
						<RunningChart />
						<WeekHeartRateChart />
					</div>
					) : (
					"Le graphique ne s'affiche pas"
					)}

				{/* Données semaine */}
				<div>
					<h4>Cette semaine</h4>
					<h5 className={Styles.dashboard_performance_week_date}>
						Du {formatDateFR(start)} au {formatDateFR(end)}
					</h5>

					<div className={Styles.dashboard_performance_week}>
						<ObjectifsChart runningData={activities} weeklyGoal={profile.weeklyGoal} />

						<div className={Styles.dashboard_performance_activities}>
							<div className={Styles.dashboard_performance_activity}>
								{/*// * NOTE:  code mis ainsi car react n'accepte pas l'apostrophe dans ce p */}
								<p>{"Durée d'activité"}</p>
								<h4 className={Styles.dashboard_performance_duration}>{weekDuration(activities, range)} <span>minutes</span></h4>
							</div>
							<div className={Styles.dashboard_performance_activity}>
								<p>Distance</p>
								<h4 className={Styles.dashboard_performance_distance}>{weekDistance(activities, range)} <span>kilomètres</span></h4>
							</div>
						</div>
					</div>
				</div>
				<div className={Styles.dashboardAI_container}>
					<Image src="/assets/images/Icons.png" alt="icone IA" width={66} height={66} />
					<h3>Créez votre planning d'entraînements <span>intelligent</span></h3>
					<p>Notre IA crée un planning 100 % personnalisé selon vos objectifs.</p>
					<h5>Commencer</h5>
				</div>
			</section>
			<Footer />
		</EffectsPages>
	</>
	);
	}
