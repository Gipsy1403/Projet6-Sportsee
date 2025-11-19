import Login from "@/Components/Login";
import Image from "next/image";
import Styles from "./login.module.css"

export default function PageLogin() {

  return (
	<section className={Styles.login_container}>
		<div className={Styles.left_column}>
			<Image
				className={Styles.logo}
				src={"/assets/images/Logo (1).png"}
				alt="Logo Sportsee"
				width={157}
				height={23}/>
			<Login />
		</div>
		<div className={Styles.right_column}>
			<p className={Styles.phrase}>Analysez vos performances en un clin d’œil,
<span>suivez vos progrès et atteignez vos objectifs.</span></p>
		</div>
	</section>

  );
}