// src/firebase.js

// استيراد Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // التخزين

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHf1YDxwySXUCI__gkVdgP-TjX1YXfBwM",
  authDomain: "project-4a1d3.firebaseapp.com",
  projectId: "project-4a1d3",
  storageBucket: "project-4a1d3.firebasestorage.app",
  messagingSenderId: "817782918123",
  appId: "1:817782918123:web:58d83269a3378f1e31e7ae",
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// الخدمات: قاعدة البيانات، تسجيل الدخول، التخزين
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// تصدير للاستعمال
export { app, db, auth, storage };