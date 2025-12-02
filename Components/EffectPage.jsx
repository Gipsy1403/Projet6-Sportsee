'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function EffectsPages({ children }) {
	// Déclare un état pour contrôler la visibilité d'un élément (false = invisible au départ)
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// Crée un délai (timeout) avant de rendre l'élément visible
		// Ici, après 20 millisecondes, on passe visible à true
		const timeout = setTimeout(() => setVisible(true), 20);

		// Nettoie le timeout si le composant est démonté ou l'effet relancé
		// Cela évite des erreurs ou fuites mémoire
		return () => clearTimeout(timeout);
	}, []); // Le tableau vide [] signifie que l'effet s'exécute une seule fois au montage du composant

	return (
	<div className={`page-fade ${visible ? 'visible' : ''}`}>
		{children}
	</div>
	);
}
