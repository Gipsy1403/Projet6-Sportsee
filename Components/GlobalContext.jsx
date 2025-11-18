"use client";
import users from "@/src/mocks/users.json"
import { createContext, useState, useContext, useEffect} from "react"

const GlobalContext=createContext();

export function GlobalProvider({children}){
	const[user,setUser]=useState(users[0]);

	// * NOTE: Pour le fetch et la gestion des erreurs
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [errorCode, setErrorCode] = useState(null);
	useEffect(() => {
		const fetchUser = async () => {
    			setLoading(true);
    			setError(null);
    			setErrorCode(null);

		try {
			const response = await fetch("http://localhost:8000/users/1")

			if (!response.ok) {
				setErrorCode(response.status);

				switch (response.status) {
					case 400:
						setError("Requête incorrecte : identifiants manquants.");
					break;
					case 401:
						setError("Non autorisé : token manquant ou invalide.");
					break;
					case 403:
						setError("Accès interdit : token invalide.");
					break;
					case 404:
						setError("Utilisateur introuvable.");
					break;
					case 500:
						setError("Erreur serveur.");
					break;
					default:
						setError("Erreur inconnue.");
				}
			return;
		}

		const data = await response.json();
		setUser(data);
	}catch (error){
		setError("Impossible de contacter le serveur.");
	}finally{
		setLoading(false);
	}
	};
	fetchUser();
}, []);


	return (
		// ! IMPORTANT: ne pas oublier de remplacer :
		// <GlobalContext.Providervalue={{user,setUser,loading,error,errorCode,}}
		<GlobalContext.Provider value={{user, setUser}}> 
		{children}
		</GlobalContext.Provider>
	)
}

export function useUser(){
	return useContext(GlobalContext);
}