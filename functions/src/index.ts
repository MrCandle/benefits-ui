import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import Benefits from "./benefits";

admin.initializeApp(functions.config().firebase);
const settings = { timestampsInSnapshots: true };

const db = admin.firestore();
db.settings(settings);

const app = express();
const benefits: Benefits = new Benefits(db);

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
  } else if(req.cookies) {
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
  const list = await benefits.getAll().catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(list);
});
app.post("/benefits", async (req: express.Request, res: express.Response) => {
  const id = await benefits.create(req.body).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(id);
});
app.get("/benefits/:id", async (req: express.Request, res: express.Response) => {
  const benefit = await benefits.getById(req.params.id).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(benefit);
});
app.put("/benefits/:id", async (req: express.Request, res: express.Response) => {
  const status = await benefits.update(req.body).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(status);
});
app.delete("/benefits/:id", async (req: express.Request, res: express.Response) => {
  const status = await benefits.del(req.params.id).catch((err) => {
    res.status(400).send(err);
  });
  res.status(200).send(status);
});

exports.api = functions.https.onRequest(app);
