import firebaseApp from 'firebase/app';

import firebaseConfig from './config/firebase';

const firebase = firebaseApp.initializeApp(firebaseConfig);

if (process.env.NODE_ENV === 'development') {
  firebaseApp.auth().useEmulator('http://localhost:9099');
  firebaseApp.firestore().useEmulator('localhost', 8080);
}

export default firebase;
