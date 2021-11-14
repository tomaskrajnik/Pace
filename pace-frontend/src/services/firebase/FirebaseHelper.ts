import { DocumentSnapshot, QuerySnapshot } from '@firebase/firestore';

type Class<T> = new (...args: any[]) => T;
export class FirebaseHelper {
    /**
     * Simple wrapper method to help with going from firestore snaps to objects
     * @param docs documents to convert
     */
    public static SnapDocumentsToModel<T>(snapshot: QuerySnapshot, Model: Class<T>): T[] {
        if (snapshot?.docs) {
            return snapshot.docs.map((documentSnapshot) => {
                const data = documentSnapshot.data();
                data.id = documentSnapshot.id;
                return new Model(data);
            });
        }
        return [];
    }

    /**
     * Simple wrapper method to help with going from firestore snaps to objects
     * @param docs documents to convert
     */
    public static SnapDocumentToObject<T>(snapshot: DocumentSnapshot): T | null {
        const data = snapshot.data();
        if (data) {
            data.uid = snapshot.id;
            return data as T;
        }
        return null;
    }
}
