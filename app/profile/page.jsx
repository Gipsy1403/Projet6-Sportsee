import Header from "@/Composents/Header";
import Styles from "./profile.module.css";
import Image from "next/image";


export default function PageProfile() {
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
						<h4>NOM</h4>
						<p className={Styles.profile_date_membership}>Membre depuis le DATE</p>
					</div>
				</div>
				<div className={Styles.profile_content}>
					<h4 className={Styles.profile_title}>Votre profil</h4>
					<h5>Age : AGE</h5>
					<h5>Genre : Genre</h5>
					<h5>Taille : TAILLE</h5>
					<h5>Poids : Poids</h5>
				</div>
			</div>
			<div>
				
				<h4>Vos statistiques</h4>
				<p className={Styles.profile_date_membership}>depuis le DATE</p>
			
				<div className={Styles.profile_all_stats}>
					<div className={Styles.profile_one_stat}>
						<p>Temps total couru</p>
						<h4>TEMPS <span>min</span></h4>
					</div>
					<div className={Styles.profile_one_stat}> 
						<p>Calories brûlées</p>
						<h4>CALORIE <span>cal</span></h4>
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Distance totale parcourues</p>
						<h4>KMTOTAL <span>km</span></h4>
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Nombre de jours de repos</p>
						<h4>JOURS <span>jours</span></h4>
					</div>
					<div className={Styles.profile_one_stat}>
						<p>Nombre de sessions</p>
						<h4>SESSIONS <span>sessions</span></h4>
					</div>
				</div>
			</div>
		</section>
	);
}