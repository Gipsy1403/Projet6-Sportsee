"use client";
import Image from "next/image";
import Styles from"./dashboard.module.css"
import { useState,useEffect } from "react";
import RunningChart from "@/Components/GraphOne";
import WeekHeartRateChart from "@/Components/GraphTwo";
import DateFormated from "@/Components/DateFormated";
import ObjectifsChart from "@/Components/GraphThree";
import { useMockData } from "@/Components/GlobalContextMOCK";
import userActivity from"@/src/mocks/userActivity.json"
import userInfo from"@/src/mocks/userInfo.json"


// export function currentWeek(){
// 	const today=new Date();
// 	const monday=new Date(today);
// 	monday.setDate(today.getDate()-today.getDay()+1);
// 	const sunday=new Date(monday);
// 	sunday.setDate(monday.getDate()+6);
// 	return{monday,sunday};
// }

// function weekDuration(data){
// 	// const {monday,sunday}=currentWeek();
// 	const filterSession=data.filter(session=>{
// 		const date=new Date(session.date);
// 		return date >=monday&&date<=sunday;
// 	})
// 	const totalDuration=filterSession.reduce((sum,session)=> sum+session.duration,0);
// 	return totalDuration
// }
function weekDuration(data, range) {
  if (!data) return 0;

  const weekSessions = data.filter(session => {
    const date = new Date(session.date);
    const start = new Date(range.start);
    const end = new Date(range.end);
    return date >= start && date <= end;
  });

  return weekSessions.reduce((sum, session) => sum + session.duration, 0);
}

// function weekDistance(data){
// 	// const {monday,sunday}=currentWeek();
// 	const filterSession=data.filter(session=>{
// 		const date=new Date(session.date);
// 		return date >=monday&&date<=sunday;
// 	})
// 	const totalDistance=filterSession.reduce((sum,session)=> sum+session.distance,0);
// 	return totalDistance
// }

function weekDistance(data, range) {
  if (!data) return 0;

  const weekSessions = data.filter(session => {
    const date = new Date(session.date);
    const start = new Date(range.start);
    const end = new Date(range.end);
    return date >= start && date <= end;
  });

  return weekSessions.reduce((sum, session) => sum + session.distance, 0);
}

function formatDateFR(date) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 car janvier = 0
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

// function weekPeriod() {
// 	const {monday,sunday}=currentWeek();
// 	return {
// 		start: formatDateFR(monday),
// 		end: formatDateFR(sunday)
// 	};
// }

export default function PageDashboard() {
	const{range, activities}=useMockData();
	// const{range, activities}=useUser();
	const[search,setSearch]=useState("");

	const [profile, setProfile] = useState(null);
	const [statistics, setStatistics] = useState(null);
	const [message, setMessage] = useState("");

  useEffect(() => {
    const loadMockUserInfo = async () => {
      try {
        // simule un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));

        // on récupère les données du mock
        setProfile(userInfo.profile);
        setStatistics(userInfo.statistics);
      } catch (err) {
        console.error(err);
        setMessage("Erreur réseau");
      }
    };

    loadMockUserInfo();
  }, []);

  if (!profile) {
    return <p>Chargement du profil...</p>;
  }
	
	//   useEffect(() => {
	//     const handleDashboard = async () => {
	// 	 try {
	// 	   const res = await fetch("http://localhost:8000/api/user-info", {
	// 		method: "GET",
	// 		credentials: "include",
	// 	   });
	
	// 	   const data = await res.json();
	
	// 	   if (res.ok) {
	// 		setProfile(data.profile);
	// 		setStatistics(data.statistics);
	
	// 		console.log("Profil :", data);
	// 	   } else {
	// 		setMessage(data.message || "Erreur lors de la récupération du profil");
	// 	   }
	// 	 } catch (err) {
	// 	   console.error(err);
	// 	   setMessage("Erreur réseau");
	// 	 }
	//     };
	
	//     handleDashboard();
	//   }, []);
	
	//  if (!profile) {
	//   return <p>Chargement du profil...</p>;
	// }

  return (
	<section >
		<form className={Styles.form_coachAI}>
			<input
			type="text"
			value={search}
			placeholder="Posez vos questions sur votre programme, vos performances ou vos objectifs."
			onChange={(e)=>setSearch(e.target.value)}
				/>
				<button>Lancer une conversation</button>
		</form>
		<div className={Styles.dashboard_profile_container}>
			<div className={Styles.dashboard_profile}>
				<Image
				src={"/assets/images/Photo profil.png"}
				alt="Photo de profil"
				width={104}
				height={117}/>
				<div>
					<h4>{profile.firstName} {profile.lastName}</h4>
					<p>Membre depuis le <DateFormated date={profile.createdAt}/></p>
				</div>
			</div>
			<div className={Styles.dashboard_distance}>
				<p>Distance totale parcourue</p>
				<div className={Styles.dashboard_distance_nbre}>
					<Image
					src={"/assets/images/OUTLINE.png"}
					alt="icone qu'une main tenant un fanion de victoire"
					width={34}
					height={34}/>
					<h4>KM km</h4>
				</div>
			</div>
		</div>
		<h4 className={Styles.dashboard_performance_title}>Vos dernières performances</h4>
		<div className={Styles.dashboard_performance_month}>
			<RunningChart user={statistics.runningData}/>
			<WeekHeartRateChart user={statistics.runningData}/>
		</div>
		<div>
			<h4>Cette semaine</h4>
			{/* <h5 className={Styles.dashboard_performance_week_date}>Du {weekPeriod().start} au {weekPeriod().end}</h5> */}
			<div className={Styles.dashboard_performance_week}>
				{/* <ObjectifsChart user={user} /> */}
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
	</section>
  );
}