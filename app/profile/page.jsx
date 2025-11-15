import Header from "@/Components/Header";
import Styles from "./profile.module.css";
import Image from "next/image";
import DateFormated from "@/Components/DateFormated";

function ConvertMinutesToHours({user}){
	const minutes=user.statistics.totalDuration;
	const hours=Math.floor(minutes/60);
	const restMinutes=minutes%60;
	return (
		<div>
			<h4>{hours}h <span>{restMinutes}min</span></h4>
		</div>
	)
}


export default function PageProfile({user}) {
	const heightCm=user.userInfos.height;
	const meter=Math.floor(heightCm/100);
	const cm= heightCm%100;
	const heightMeter=`${meter}m${cm}`

	const genderFR={
		male:"Masculin",
		female :"Féminin",
		other :"Autre"
	};
  	return (
		<section className={Styles.profile_container}>
			<div >
				<div className={Styles.profile_photo}>
					<Image
					src={"/assets/images/Photo profil.png"}
					alt="Photo de profil"
					width={104}
					height={117}/>
					<div>
						<h4>{user.userInfos.firstName} {user.userInfos.lastName}</h4>
						<p className={Styles.profile_date_membership}>Membre depuis le <DateFormated date={user.userInfos.createdAt}/></p>
					</div>
				</div>
				<div className={Styles.profile_content}>
					<h4 className={Styles.profile_title}>Votre profil</h4>
					<h5>Age : {user.userInfos.age}</h5>
					<h5>Genre : {genderFR[user.userInfos.gender]}</h5>
					<h5>Taille : {heightMeter}</h5>
					<h5>Poids : {user.userInfos.weight} kg</h5>
				</div>
			</div>
			<div>
				
				<h4>Vos statistiques</h4>
				<p className={Styles.profile_date_membership}>depuis le <DateFormated date={user.userInfos.createdAt}/></p>
			
				<div className={Styles.profile_all_stats}>
					<div className={Styles.profile_one_stat}>
						<p>Temps total couru</p>
						{/* <ConvertMinutesToHours user={user}/> */}
						{/* <h4>{user.statistics.totalDuration} <span>min</span></h4> */}
					</div>
					<div className={Styles.profile_one_stat}> 
						<p>Calories brûlées</p>
						{/* <h4>{user.statistics.totalCalories} <span>cal</span></h4> */}
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Distance totale parcourues</p>
						{/* <h4>{user.statistics.totalDistance} <span>km</span></h4> */}
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Nombre de jours de repos</p>
						{/* <h4>{user.statistics.totalRestDays} <span>jours</span></h4> */}
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Nombre de sessions</p>
						{/* <h4>{user.statistics.totalSessions} <span>sessions</span></h4> */}
					</div>
				</div>
			</div>
		</section>
	);
}