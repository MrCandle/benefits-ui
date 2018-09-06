import Benefit from "../model/Benefit";
import { DocumentData, CollectionReference } from "@google-cloud/firestore";

export default class BenefitsController {

  private collectionRef: CollectionReference;

  constructor(db: FirebaseFirestore.Firestore) {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.collectionRef = db.collection('benefits');
  }

  getAll(): Promise<Array<Benefit>> {
    console.log(`Benefits.getAll`);
    return new Promise<Array<Benefit>>(async (resolve, reject) => {
      let data: DocumentData;

      const snapshot = await this.collectionRef.get();
      const benefits: Array<Benefit> = [];

      snapshot.forEach(doc => {
        data = doc.data();
        benefits.push({
          id: doc.id,
          name: data.name,
          ownerUserId: data.ownerUserId
        });
      });

      resolve(benefits);
    });
  }

  getById(id: string): Promise<Benefit> {
    console.log(`Benefits.getById: ${id}`);
    return new Promise<Benefit>(async (resolve, reject) => {

      let data: DocumentData;
      const doc = await this.collectionRef.doc(id).get();

      if (!doc.exists) {
        reject(`Document ${id} doesn't exist`);
      }

      data = doc.data();

      resolve({
        id: id,
        name: data.name,
        ownerUserId: data.ownerUserId
      });

    });
  }

  update(benefit: Benefit): Promise<boolean> {
    console.log(`Benefits.update: ${benefit}`);
    return new Promise<boolean>(async (resolve, reject) => {
      const result = await this.collectionRef.doc(benefit.id).set(benefit);
      if (!result) {
        reject();
      }

      resolve(true);
    });
  }

  create(benefit: Benefit): Promise<String> {
    console.log(`Benefits.create: ${Object.entries(benefit)}`);
    return new Promise<String>(async (resolve, reject) => {
      const doc = await this.collectionRef.add(benefit);
      console.log(``)
      resolve(doc.id);
    });
  }

  del(id: string): Promise<boolean> {
    console.log(`Benefits.delete: ${id}`);
    return new Promise<boolean>(async (resolve, reject) => {
      const status = await this.collectionRef.doc(id).delete();
      if (!status) {
        reject();
      }
      resolve(true);
    })
  }
}
