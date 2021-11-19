import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';

export type FirebaseStorageFolders = 'users' | 'projects';

export const useFirebaseStorage = (storageFolder: FirebaseStorageFolders, fileName: string) => {
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<null | string>(null);

    const storage = getStorage();

    const uploadImage = async (image: string) => {
        setUploading(true);

        // Create refrence
        const storageRef = ref(storage, `${storageFolder}/${fileName}`);

        try {
            // Upload to storage
            const { ref } = await uploadString(storageRef, image, 'data_url');

            // Get download link by refrence
            const downloadLink = await getDownloadURL(ref);

            // Set download link to state
            if (downloadLink) setDownloadUrl(downloadLink);
        } catch (err) {
            console.log(err);
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, downloadUrl, uploading };
};
