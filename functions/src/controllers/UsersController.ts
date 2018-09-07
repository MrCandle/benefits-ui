import { DocumentData, CollectionReference } from "@google-cloud/firestore";
import { user } from "firebase-functions/lib/providers/auth";

export default class UsersController {

    private collectionRef: CollectionReference;

    constructor(db: FirebaseFirestore.Firestore) {
        this.getAllDevices = this.getAllDevices.bind(this);
        this.attachDevice = this.attachDevice.bind(this);
        // this.update = this.update.bind(this);
        this.collectionRef = db.collection('users');
    }

    getAllDevices(): Promise<Array<string>> {
        console.log(`Users.getAllDevices`);
        return new Promise<Array<string>>(async (resolve, reject) => {
            let data: DocumentData;

            const snapshot = await this.collectionRef.get();
            const devices: Array<string> = [];

            snapshot.forEach(doc => {
                data = doc.data();
                devices.push(...data.devices);
            });

            console.log(`devices found: ${devices.length}` )
            resolve(devices);
        });
    }

    attachDevice(userId: string, deviceToken: string): Promise<boolean> {
        console.log(`Users.attachDevice user: ${userId} \n device:${deviceToken}`);
        return new Promise<boolean>(async (resolve, reject) => {
            const userDoc = await this.collectionRef.doc(userId).get();

            let devices: Array<string> = [];
            if (userDoc.exists) {
                devices = !(userDoc.data().devices) ? userDoc.data().devices : [];
            }

            devices.push(deviceToken);

            const result = await this.collectionRef.doc(userId).set({ devices: devices });
            if (!result) {
                reject();
            }

            resolve(true);
        })
    }

}
