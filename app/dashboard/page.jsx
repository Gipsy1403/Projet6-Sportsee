"use client";
import Image from "next/image";
import Styles from "./dashboard.module.css";
import { useState } from "react";
import RunningChart from "@/Components/GraphOne";
import WeekHeartRateChart from "@/Components/GraphTwo";

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
					<h4>NOM</h4>
					<p>Membre depuis le DATE</p>
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
			<h5 className={Styles.dashboard_performance_week_date}>Du DATE au DATE</h5>
			<div className={Styles.dashboard_performance_week}>
				<p>1er tableau</p>
				<div className={Styles.dashboard_performance_activities}>
					<div className={Styles.dashboard_performance_activity}>
						<p>Durée d'activité</p>
						<h4 className={Styles.dashboard_performance_duration}>DUREE <span>minutes</span></h4>
					</div>
					<div className={Styles.dashboard_performance_activity}>
						<p>Distance</p>
						<h4 className={Styles.dashboard_performance_distance}>DISTANCE <span>kilomètres</span></h4>
					</div>
				</div>
			</div>
		</div>

	</section>
  );
}