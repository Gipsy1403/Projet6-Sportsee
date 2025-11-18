"use client";
import Header from "@/Components/Header";
import Styles from "./profile.module.css";
import Image from "next/image";
import DateFormated from "@/Components/DateFormated";
import { useState, useEffect } from "react";
// import { useUser } from "@/Components/GlobalContext";

function ConvertMinutesToHours({statistics}){
	const minutes=statistics.totalDuration;
	const hours=Math.floor(minutes/60);
	const restMinutes=minutes%60;
	return (
		<div>
			<h4>{hours}h <span>{restMinutes}min</span></h4>
		</div>
	)
}


export default function PageProfile() {
	// const{user, loading,error}=useUser();
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleGetProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user-info", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setProfile(data.profile);
          setStatistics(data.statistics);

          console.log("Profil :", data);
        } else {
          setMessage(data.message || "Erreur lors de la récupération du profil");
        }
      } catch (err) {
        console.error(err);
        setMessage("Erreur réseau");
      }
    };

    handleGetProfile();
  }, []);

 if (!profile) {
  return <p>Chargement du profil...</p>;
}


	const heightCm= profile.height;
	const meter=Math.floor(heightCm/100);
	const cm= heightCm%100;
	const heightMeter=`${meter}m${cm}`

	const genderFR={
		male:"Masculin",
		female :"Féminin",
		other :"Autre"
	};
	// if (loading) return <p>Chargement...</p>;
  	// if (error) return <p>{error}</p>;

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
						<h4>{profile.firstName} {profile.lastName}</h4>
						<p className={Styles.profile_date_membership}>Membre depuis le <DateFormated date={profile.createdAt}/></p>
					</div>
				</div>
				<div className={Styles.profile_content}>
					<h4 className={Styles.profile_title}>Votre profil</h4>
					<h5>Age : {profile.age}</h5>
					<h5>Genre : {genderFR[profile.gender]}</h5>
					<h5>Taille : {heightMeter}</h5>
					<h5>Poids : {profile.weight} kg</h5>
				</div>
			</div>
			<div>
				
				<h4>Vos statistiques</h4>
				<p className={Styles.profile_date_membership}>depuis le <DateFormated date={profile.createdAt}/></p>
			
				<div className={Styles.profile_all_stats}>
					<div className={Styles.profile_one_stat}>
						<p>Temps total couru</p>
						<ConvertMinutesToHours statistics={profile.statistics}/>
						<h4>{profile.statistics.totalDuration} <span>min</span></h4>
					</div>
					<div className={Styles.profile_one_stat}> 
						<p>Calories brûlées</p>
						<h4>{profile.statistics.totalCalories} <span>cal</span></h4>
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Distance totale parcourues</p>
						<h4>{profile.statistics.totalDistance} <span>km</span></h4>
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Nombre de jours de repos</p>
						<h4>{profile.statistics.totalRestDays} <span>jours</span></h4>
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Nombre de sessions</p>
						<h4>{profile.statistics.totalSessions} <span>sessions</span></h4>
					</div>
				</div>
			</div>
		</section>
	);
}