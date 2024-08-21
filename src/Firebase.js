// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYdmQrQPSSLSPDjNmikTBftov8bCCSFrg",
  authDomain: "invoice-app-a2de8.firebaseapp.com",
  projectId: "invoice-app-a2de8",
  storageBucket: "invoice-app-a2de8.appspot.com",
  messagingSenderId: "619497481206",
  appId: "1:619497481206:web:6048be214abc7eb8ca5dd7",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
