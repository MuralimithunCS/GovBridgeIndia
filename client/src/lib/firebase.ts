import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDeTNGKK3ZiOG4t5vYB1JNgrEDqbBv4WdM",
  authDomain: "govbridgeindia-58e79.firebaseapp.com",
  projectId: "govbridgeindia-58e79",
  storageBucket: "govbridgeindia-58e79.firebasestorage.app",
  messagingSenderId: "2338942295",
  appId: "1:2338942295:web:0f314f5a6ac39d0059a212"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
