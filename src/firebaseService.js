import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getProducts = async () => {
    try {
        console.log("Tentative de connexion à Firestore...");
        const colRef = collection(db, 'equipement');
        console.log("Référence de collection obtenue:", colRef);

        const querySnapshot = await getDocs(colRef);
        console.log("Nombre de documents:", querySnapshot.size);

        const products = querySnapshot.docs.map(doc => {
            console.log("Document ID:", doc.id);
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        console.log("Produits transformés:", products);
        return products;

    } catch (error) {
        console.error("ERREUR CRITIQUE dans getProducts:", error);
        throw error;
    }
};