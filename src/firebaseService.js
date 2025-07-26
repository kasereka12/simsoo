import { db, storage } from './firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const getProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'equipement'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// Supprimer une image du storage
export const deleteImageFromStorage = async (imageUrl) => {
    try {
        // Extraire le nom du fichier de l'URL
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
        // Ne pas faire échouer la suppression du produit si l'image ne peut pas être supprimée
        return false;
    }
};

// Supprimer toutes les images d'un produit
export const deleteProductImages = async (images) => {
    if (!images || images.length === 0) return;

    const deletePromises = images.map(imageUrl => {
        if (imageUrl) {
            return deleteImageFromStorage(imageUrl);
        }
        return Promise.resolve(false);
    });

    try {
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Erreur lors de la suppression des images:", error);
    }
};
// Mettre à jour un produit existant
export const updateProduct = async (productId, productData) => {
    try {
        const productRef = doc(db, 'equipement', productId);
        await updateDoc(productRef, productData);
        return { id: productId, ...productData };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du produit:", error);
        throw error;
    }
};

// Supprimer un produit
export const deleteProduct = async (productId) => {
    try {
        await deleteDoc(doc(db, 'equipement', productId));
        return productId;
    } catch (error) {
        console.error("Erreur lors de la suppression du produit:", error);
        throw error;
    }
};


export const uploadImageAndGetURL = async (file, progressCallback) => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (progressCallback) progressCallback(progress);
            },
            (error) => {
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};