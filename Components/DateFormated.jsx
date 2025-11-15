export default function DateFormated({date}){
	  if (!date) {
    return <span>…</span>;   // affichage temporaire (tu peux choisir)
  }
	const dateObjet=new Date(date);
	const formatedDate=dateObjet.toLocaleDateString("fr-FR",{
		day: "numeric",
		month:"long",
		year:"numeric",
	});
	return <span>{formatedDate}</span>
}