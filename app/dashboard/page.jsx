// "use client";
// import Image from "next/image";
// import Styles from"./dashboard.module.css"
// import { useState,useEffect } from "react";
// import RunningChart from "@/Components/GraphOne";
// import WeekHeartRateChart from "@/Components/GraphTwo";
// import DateFormated from "@/Components/DateFormated";
// import ObjectifsChart from "@/Components/GraphThree";
// import { useUser } from "@/Components/GlobalContext";
// import Link from "next/link";
// import Header from "@/Components/Header";
// import Footer from "@/Components/Footer";
// import EffectsPages from "@/Components/EffectPage";
// // import userActivity from"@/src/mocks/userActivity.json"
// // import userInfo from"@/src/mocks/userInfo.json"


// // export function currentWeek(){
// // 	const today=new Date();
// // 	const monday=new Date(today);
// // 	monday.setDate(today.getDate()-today.getDay()+1);
// // 	const sunday=new Date(monday);
// // 	sunday.setDate(monday.getDate()+6);
// // 	return{monday,sunday};
// // }

// // function weekDuration(data){
// // 	// const {monday,sunday}=currentWeek();
// // 	const filterSession=data.filter(session=>{
// // 		const date=new Date(session.date);
// // 		return date >=monday&&date<=sunday;
// // 	})
// // 	const totalDuration=filterSession.reduce((sum,session)=> sum+session.duration,0);
// // 	return totalDuration
// // }
// function weekDuration(data, range) {
//   if (!data) return 0;

//   const weekSessions = data.filter(session => {
//     const date = new Date(session.date);
//     const start = new Date(range.start);
//     const end = new Date(range.end);
//     return date >= start && date <= end;
//   });

//   return weekSessions.reduce((sum, session) => sum + session.duration, 0);
// }

// // function weekDistance(data){
// // 	// const {monday,sunday}=currentWeek();
// // 	const filterSession=data.filter(session=>{
// // 		const date=new Date(session.date);
// // 		return date >=monday&&date<=sunday;
// // 	})
// // 	const totalDistance=filterSession.reduce((sum,session)=> sum+session.distance,0);
// // 	return totalDistance
// // }

// function weekDistance(data, range) {
//   if (!data) return 0;

//   const weekSessions = data.filter(session => {
//     const date = new Date(session.date);
//     const start = new Date(range.start);
//     const end = new Date(range.end);
//     return date >= start && date <= end;
//   });
//   const total=weekSessions.reduce((sum, session) => sum + session.distance, 0);
//   	return Number(total.toFixed(1));
// }

// function formatDateFR(dateString) {
// 	const date=new Date(dateString);
// 	const day = String(date.getDate()).padStart(2, "0");
// 	const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 car janvier = 0
// 	const year = date.getFullYear();
// 	return `${day}/${month}/${year}`;
// }

// // function weekPeriod() {
// // 	const {monday,sunday}=currentWeek();
// // 	return {
// // 		start: formatDateFR(monday),
// // 		end: formatDateFR(sunday)
// // 	};
// // }

// export default function PageDashboard() {
	
// 	// const{startEndWeek}=useUser();
// 	// const activities=startEndWeek.activities;
// 	// const range=startEndWeek.range;

// 	// console.log("activities dans Dashboard 1 :", activities);
	

// 	const[search,setSearch]=useState("");

// 	const [profile, setProfile] = useState(null);
// 	const [statistics, setStatistics] = useState(null);
// 	const [message, setMessage] = useState("");
	
// 	  useEffect(() => {
// 	    const handleDashboard = async () => {
// 		 try {
// 		   const res = await fetch("http://localhost:8000/api/user-info", {
// 			method: "GET",
// 			credentials: "include",
// 		   });
	
// 		   const data = await res.json();
	
// 		   if (res.ok) {
// 			setProfile(data.profile);
// 			setStatistics(data.statistics);

// 			console.log("Données reçues :", data.statistics);
// 			console.log("Profil :", data);
			
// 		   } else {
// 			setMessage(data.message || "Erreur lors de la récupération du profil");
// 		   }
// 		 } catch (err) {
// 		   console.error(err);
// 		   setMessage("Erreur réseau");
// 		 }
// 	    };
	
// 	    handleDashboard();
// 	  }, []);
	  
	
// 	 if (!profile) {
// 	  return <p>Chargement du profil...</p>;
// 	}

//   return (
// 	<>
// 		<EffectsPages>
// 			<Header/>
// 			<section >
// 				<div className={Styles.conversation}>
// 					<div className={Styles.text}>
// 						<Image
// 							src={"/assets/images/Icone AI.png"}
// 							alt="Photo de profil"
// 							width={16}
// 							height={16}
// 						/>
// 						<h5>Posez vos questions sur votre programme, vos performances ou vos objectifs.</h5>
// 					</div>
// 					<button><Link href={"/chat"}>Lancer une conversation</Link></button>
// 				</div>
// 				<div className={Styles.dashboard_profile_container}>
// 					<div className={Styles.dashboard_profile}>
// 						<Image
// 						src={"/assets/images/Photo profil.png"}
// 						alt="Photo de profil"
// 						width={104}
// 						height={117}/>
// 						<div>
// 							<h4>{profile.firstName} {profile.lastName}</h4>
// 							<p>Membre depuis le <DateFormated date={profile.createdAt}/></p>
// 						</div>
// 					</div>
// 					<div className={Styles.dashboard_distance}>
// 						<p>Distance totale parcourue</p>
// 						<div className={Styles.dashboard_distance_nbre}>
// 							<Image
// 							src={"/assets/images/OUTLINE.png"}
// 							alt="icone qu'une main tenant un fanion de victoire"
// 							width={34}
// 							height={34}/>
// 							<h4>{statistics.totalDistance} km</h4>
// 						</div>
// 					</div>
// 				</div>
// 				<h4 className={Styles.dashboard_performance_title}>Vos dernières performances</h4>
// 				{activities && activities.length>0? (
// 					<div className={Styles.dashboard_performance_month}>
// 						<RunningChart runningData={activities}/>
// 						<WeekHeartRateChart runningData={activities}/>
// 					</div>
// 				):"le graphique ne s'affiche pas"
// 				}
// 				<div>
// 					<h4>Cette semaine</h4>
// 					<h5 className={Styles.dashboard_performance_week_date}>Du {formatDateFR(range.start)} au {formatDateFR(range.end)}</h5>
// 					<div className={Styles.dashboard_performance_week}>
// 						<ObjectifsChart  runningData={activities} weeklyGoal={profile.weeklyGoal} weekRange={range}/>
// 						<div className={Styles.dashboard_performance_activities}>
// 							<div className={Styles.dashboard_performance_activity}>
// 								{/*// * NOTE:  code mis ainsi car react n'accepte pas l'apostrophe dans ce p */}
// 								<p>{"Durée d'activité"}</p>
// 								<h4 className={Styles.dashboard_performance_duration}>{weekDuration(activities, range)} <span>minutes</span></h4>
// 							</div>
// 							<div className={Styles.dashboard_performance_activity}>
// 								<p>Distance</p>
// 								<h4 className={Styles.dashboard_performance_distance}>{weekDistance(activities, range)} <span>kilomètres</span></h4>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 				<div className={Styles.dashboardAI_container}>
// 					<Image
// 						src={"/assets/images/Icons.png"}
// 						alt="icone d'un calendrier"
// 						width={66}
// 						height={66}
// 					/>
// 					<h3>Créez votre planning d'entraînements <span>intelligent</span></h3>
// 					<p>Notre IA vous aide à bâtir un planning 100 % personnalisé selon vos objectifs, votre <span>niveau et votre emploi du temps.</span></p>
// 					<h5>Commencer</h5>
// 				</div>
// 			</section>
// 			<Footer/>
// 		</EffectsPages>
// 	</>
//   );
// }

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
	const date = new Date(dateString);
	return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

// ----------------------------
// Page Dashboard
export default function PageDashboard() {
	const { running } = useUser(); // ⬅️ données du contexte
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
						<RunningChart />            {/* ⬅️ plus de props */}
						<WeekHeartRateChart />      {/* ⬅️ plus de props */}
					</div>
					) : (
					"Le graphique ne s'affiche pas"
					)}

				{/* Données semaine */}
				<div>
					<h4>Cette semaine</h4>
					<h5 className={Styles.dashboard_performance_week_date}>
						Du {formatDateFR(range.start)} au {formatDateFR(range.end)}
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
