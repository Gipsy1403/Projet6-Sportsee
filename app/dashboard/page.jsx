"use client";
import Image from "next/image";
import Styles from "./dashboard.module.css";
import { useState } from "react";
import RunningChart from "@/Components/GraphOne";
import WeekHeartRateChart from "@/Components/GraphTwo";
import DateFormated from "@/Components/DateFormated";
import ObjectifsChart from "@/Components/GraphThree";

export function currentWeek(){
	const today=new Date();
	const monday=new Date(today);
	monday.setDate(today.getDate()-today.getDay()+1);
	const sunday=new Date(monday);
	sunday.setDate(monday.getDate()+6);
	return{monday,sunday};
}

function weekDuration(data){
	const {monday,sunday}=currentWeek();
	const filterSession=data.filter(session=>{
		const date=new Date(session.date);
		return date >=monday&&date<=sunday;
	})
	const totalDuration=filterSession.reduce((sum,session)=> sum+session.duration,0);
	return totalDuration
}

function weekDistance(data){
	const {monday,sunday}=currentWeek();
	const filterSession=data.filter(session=>{
		const date=new Date(session.date);
		return date >=monday&&date<=sunday;
	})
	const totalDistance=filterSession.reduce((sum,session)=> sum+session.distance,0);
	return totalDistance
}

function formatDateFR(date) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 car janvier = 0
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

function weekPeriod() {
	const {monday,sunday}=currentWeek();
	return {
		start: formatDateFR(monday),
		end: formatDateFR(sunday)
	};
}

export default function PageDashboard({user}) {
	const[search,setSearch]=useState("");

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
					<h4>{user.userInfos.firstName} {user.userInfos.lastName}</h4>
					<p>Membre depuis le <DateFormated date={user.userInfos.createdAt}/></p>
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
			<RunningChart user={user}/>
			<WeekHeartRateChart user={user}/>
		</div>
		<div>
			<h4>Cette semaine</h4>
			<h5 className={Styles.dashboard_performance_week_date}>Du {weekPeriod().start} au {weekPeriod().end}</h5>
			<div className={Styles.dashboard_performance_week}>
				<ObjectifsChart user={user} />
				<div className={Styles.dashboard_performance_activities}>
					<div className={Styles.dashboard_performance_activity}>
						{/* code mis ainsi car react n'accepte pas l'apostrophe dans ce p */}
						<p>{"Durée d'activité"}</p>
						<h4 className={Styles.dashboard_performance_duration}>{weekDuration(user.runningData)} <span>minutes</span></h4>
					</div>
					<div className={Styles.dashboard_performance_activity}>
						<p>Distance</p>
						<h4 className={Styles.dashboard_performance_distance}>{weekDistance(user.runningData)} <span>kilomètres</span></h4>
					</div>
				</div>
			</div>
		</div>

	</section>
  );
}