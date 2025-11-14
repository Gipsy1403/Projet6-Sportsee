import { dataMocks } from "@/src/mocks/users";
import Image from "next/image";
import { dateAndDistanceExtraction, extractionWeeklyGoal } from "./functGraphiq";
import { extractionBpm } from "./functGraphiq";

export default function MockTest() {
  console.log("Mock data:", dataMocks);

  const user = dataMocks[0].userInfos;
  const activity= dataMocks[0].runningData;
  const bpm=dataMocks[0].runningData.heartRate;
  console.log(extractionWeeklyGoal())

  return (
    <div>
      <h2>Prénom: {user.firstName}  Nom: {user.lastName}</h2>
      <p>Âge : {user.age}</p>
      <p>Taille : {user.height} cm</p>
      <p>Poids : {user.weight} kg</p>
	 <p>activité faite le : {activity[0].heartRate.min}</p>
	     <div>
      <Image
        src={user.profilePicture}
        alt={`${user.firstName} ${user.lastName}`}
        width={100}
	   height={100}
      />
      <h2>
        {user.firstName} {user.lastName}
      </h2>
      <p>Âge : {user.age}</p>
      <p>Taille : {user.height} cm</p>
      <p>Poids : {user.weight} kg</p>
      <p>Créé le : {user.createdAt}</p>
    </div>
    </div>
  );
}
