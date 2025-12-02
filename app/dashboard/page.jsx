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

// ----------------------------
// Fonctions calcul
function weekDuration(data, range) {
	if (!data) return 0;
		const sessions = data.filter(s => {
		const d = new Date(s.date);
		return d >= new Date(range.start) && d <= new Date(range.end);
		});
	return sessions.reduce((sum, s) => sum + s.duration, 0);
}

function weekDistance(data, range) {
	if (!data) return 0;
		const sessions = data.filter(s => {
		const d = new Date(s.date);
		return d >= new Date(range.start) && d <= new Date(range.end);
		});
	return Number(sessions.reduce((sum, s) => sum + s.distance, 0).toFixed(1));
}

function formatDateFR(dateString) {
	const date=new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 car janvier = 0
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

// ----------------------------
// Page Dashboard
export default function PageDashboard() {
	const { running,heartRate } = useUser(); 
	const activities = running.activities;
	const range = running.range;

	const [profile, setProfile] = useState(null);
	const [statistics, setStatistics] = useState(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
	const handleDashboard = async () => {
		try {
		const res = await fetch("http://localhost:8000/api/user-info", {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();

		if (res.ok) {
			setProfile(data.profile);
			setStatistics(data.statistics);
		} else {
			setMessage(data.message || "Erreur lors de la récupération du profil");
		}
		} catch (err) {
		console.error(err);
		setMessage("Erreur réseau");
		}
	};

	handleDashboard();
	}, []);

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
						Du {formatDateFR(heartRate.start)} au {formatDateFR(heartRate.end)}
					</h5>

					<div className={Styles.dashboard_performance_week}>
						<ObjectifsChart runningData={activities} weeklyGoal={profile.weeklyGoal} weekRange={range} />

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
