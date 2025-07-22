import { db, storage } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const getProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'equipement'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
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