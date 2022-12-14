const firebase = require("firebase-admin");

if(process.env.NODE_ENV) {
  require('dotenv').config({
      path: `.${process.env.NODE_ENV}.env`
  });
}
else{
  require('dotenv').config();
}

const  serviceAccount = require(`../../firebase-stage.json`);
// console.log(serviceAccount, "-----")
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});
const firestoredb = firebase.firestore();

const leavetrackerdb = firestoredb
  .collection(`dev`)
  .doc("leavetrackerdb");

module.exports = leavetrackerdb;
