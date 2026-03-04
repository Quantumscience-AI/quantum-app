import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBErnniVMJNTKTBfWHHGzlJoS2hGTxIB0o",
  authDomain: "openscience-ai.firebaseapp.com",
  projectId: "openscience-ai",
  storageBucket: "openscience-ai.firebasestorage.app",
  messagingSenderId: "31592090909",
  appId: "1:31592090909:web:0be4f4addd5618db91a5f4",
  measurementId: "G-FG1ST7X1E0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
};
