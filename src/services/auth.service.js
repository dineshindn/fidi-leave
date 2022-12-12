const firestoredb = require('../utils/firebasedb');

const orgService = require('./org.service');
const userService = require('./user.service');

const login = async (email) => {
    const user = await firestoredb.collection('users').where('email', '==', email).get();
    if (user.empty) {
        throw new Error('User does not exist');
    }
    const userRef = await firestoredb.collection('users').doc(user.docs[0].id).get();
    const userData = {
        id: userRef.id,
        ...userRef.data()
    }
    return userData;
}
 module.exports = {
        login
 }