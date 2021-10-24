class FirebaseHelper {
  /**
   * Empty constructor
   */
  constructor() {}

  /**
   * Docs to objects
   * @param {any} docs
   * @param {any} key_name
   * @return {any}
   */
  docsToObjects(docs: any, key_name: string = "uid"): any {
    return docs.map((e: any) => {
      const docData = e.data();
      docData[key_name] = e.id;
      return docData;
    });
  }
}

export const firebaseHelper = new FirebaseHelper();
