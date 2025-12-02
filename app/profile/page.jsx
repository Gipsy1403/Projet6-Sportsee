"use client";
import Header from "@/Components/Header";
import Styles from "./profile.module.css";
import Image from "next/image";
import DateFormated from "@/Components/DateFormated";
import { useState, useEffect } from "react";
import Footer from "@/Components/Footer";
import EffectsPages from "@/Components/EffectPage";


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


// Composant principal de la page profil
export default function PageProfile() {
    // Déclare un état pour stocker les infos du profil (initialement null)
	const [profile, setProfile] = useState(null);

    // Déclare un état pour stocker les statistiques utilisateur (initialement null)
	const [statistics, setStatistics] = useState(null);

    // Déclare un état pour afficher un message à l'utilisateur (ex: erreur)
	const [message, setMessage] = useState("");

    // useEffect sert à exécuter du code après le premier rendu du composant
	useEffect(() => {
        // Fonction interne asynchrone pour récupérer les infos du profil
	    const handleGetProfile = async () => {
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

                    // Affiche les données dans la console pour débogage
			        console.log("Profil :", data);
		        } else {
                    // Si la réponse n'est pas OK, on affiche un message d'erreur
			        setMessage(data.message || "Erreur lors de la récupération du profil");
		        }
		    } catch (err) {
                // Si erreur réseau ou autre problème, on affiche un message d'erreur
		        console.error(err);
		        setMessage("Erreur réseau");
		    }
	    };

        // Appelle la fonction pour récupérer les infos dès que le composant se charge
	    handleGetProfile();
	}, []); // [] signifie que l'effet ne s'exécute qu'une seule fois, au montage du composant

    // Si le profil n'est pas encore chargé, affiche un message de chargement
	if (!profile) {
	    return <p>Chargement du profil...</p>;
	}

    // Récupère la taille de l'utilisateur en centimètres
	const heightCm = profile.height;

    // Transforme les centimètres en mètres entiers
	const meter = Math.floor(heightCm / 100);

    // Récupère les centimètres restants
	const cm = heightCm % 100;

    // Construit une chaîne affichable du type "1m75"
	const heightMeter = `${meter}m${cm}`;

    // Dictionnaire pour traduire le genre en français
	const genderFR = {
		male: "Masculin",
		female: "Féminin",
		other: "Autre"
	};


  	return (
		<>
			<EffectsPages>
				<Header/>
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
								{statistics && (
									<>
							<div className={Styles.profile_one_stat}>
								<p>Temps total couru</p>
								<ConvertMinutesToHours statistics={statistics}/>
							</div>
							<div className={Styles.profile_one_stat}>
								<p>Calories brûlées</p>
								<h4>{statistics.totalCalories} <span>cal</span></h4>
							</div>
							<div className={Styles.profile_one_stat}>
								<p>Distance totale parcourues</p>
								<h4>{statistics.totalDistance} <span>km</span></h4>
							</div>
							<div className={Styles.profile_one_stat}>
								<p>Nombre de jours de repos</p>
								<h4>{statistics.totalRestDays} <span>jours</span></h4>
							</div>
							<div className={Styles.profile_one_stat}>
								<p>Nombre de sessions</p>
								<h4>{statistics.totalSessions} <span>sessions</span></h4>
							</div>
				
									</>
								)}
						</div>
					</div>
				</section>
				<Footer/>
			</EffectsPages>
		</>
	);
}