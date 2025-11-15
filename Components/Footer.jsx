import Image from "next/image"
import "@/app/globals.css"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopyright } from "@fortawesome/free-regular-svg-icons"


export default function Footer(){
	return(
		<footer>
			<div>
				<p><FontAwesomeIcon icon={faCopyright} className="icon_copyright" /> Sportsee    Tous drois réservés</p>
			</div>
			<div className="bar_footer">
				<ul>
					<li><Link href="">Conditions générales</Link></li>
					<li><Link href="">Contact</Link></li>
					<li>
						<Link href="/">
							<Image
								className="icon"
								src={"/assets/images/Property 1=Default.png"}
								alt="Icone Sportsee"
								width={20}
								height={20}/>
						</Link>
					</li>
				</ul>
			</div>
		</footer>
	)
}