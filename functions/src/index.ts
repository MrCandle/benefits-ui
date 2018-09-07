import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import { BenefitsController, UsersController } from "./controllers";

admin.initializeApp(functions.config().firebase);
const settings = { timestampsInSnapshots: true };

const db = admin.firestore();
const messaging = admin.messaging();

db.settings(settings);

const app = express();
const benefitsController: BenefitsController = new BenefitsController(db);
const usersController: UsersController = new UsersController(db);

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }
  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    return next();
  }).catch((error) => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(validateFirebaseIdToken);

app.get("/benefits", async (req: express.Request, res: express.Response) => {
  const list = await benefitsController.getAll().catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(list);
});
app.post("/benefits", async (req: express.Request, res: express.Response) => {
  const id = await benefitsController.create(req.body).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(id);
});
app.get("/benefits/:id", async (req: express.Request, res: express.Response) => {
  const benefit = await benefitsController.getById(req.params.id).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(benefit);
});
app.put("/benefits/:id", async (req: express.Request, res: express.Response) => {
  const status = await benefitsController.update(req.body).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(status);
});
app.delete("/benefits/:id", async (req: express.Request, res: express.Response) => {
  const status = await benefitsController.del(req.params.id).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(status);
});
app.get("/users/", async (req: express.Request, res: express.Response) => {
  const devices = await usersController.getAllDevices().catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(devices);
});
app.put('/users/:id', async (req: express.Request, res: express.Response) => {
  console.log('route /users/:id')
  const status = await usersController.attachDevice(req.params.id, req.body.deviceToken).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(status);
});

exports.api = functions.https.onRequest(app);

exports.sendNotifications = functions.firestore
  .document('benefits/{id}')
  .onCreate(async (snap, context) => {
    // const newValue = snap.data();

    // 'ev7rG8kkWiY:APA91bE1NSDD7JfPP4q4gx_LxXIQRDpgdtOpW9xDH6xy1_giLNp8TiVJVqZ9gkqswTCaXswR5Zyj48NfwcfJ4CJSg8SPupzr0BpvAXHkVMcO5mb30anRzvCguaPG96tMjgoB8K_UjDTq'
    const tokens: Array<string> = await usersController.getAllDevices();

    console.log(`sending to ${tokens.length} devices`)
    const response = await messaging.sendToDevice(tokens,
      {
        notification: {
          title: '$GOOG up 1.43% on the day',
          body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
          icon: 'https://my-server/icon.png'
        }
      });

      //TODO ESTO FALLA LPM, DEBUGGEAR ERROR
    console.log(response);
    console.log("created: " + response.successCount);
  });