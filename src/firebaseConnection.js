import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCbAXWpAkgRIOoDLVlCKUFtveYIxtD-qRc",
    authDomain: "curso-react-c43b2.firebaseapp.com",
    projectId: "curso-react-c43b2",
    storageBucket: "curso-react-c43b2.appspot.com",
    messagingSenderId: "30739873636",
    appId: "1:30739873636:web:3e74aa4b03963247634471",
    measurementId: "G-6N9WBFR3GJ"
};

const firebaseapp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseapp);
const auth = getAuth(firebaseapp);

export { db, auth };