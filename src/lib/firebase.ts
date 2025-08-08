// src/lib/firebase.ts
// Este arquivo é o ponto de entrada para todas as interações com o Firebase.

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Certifica-se de que as variáveis globais estão disponíveis
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Se a configuração não for encontrada, lança um erro para evitar falhas silenciosas.
if (!firebaseConfig) {
    throw new Error("Firebase config is not defined. Please ensure the __firebase_config global variable is set.");
}

// Inicializa o app Firebase, garantindo que seja feito apenas uma vez
const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Função para login de administrador com e-mail e senha
export async function adminSignIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
}

// Função para logout de administrador
export async function adminSignOut() {
    await signOut(auth);
}

// Função para garantir que o usuário está autenticado antes de qualquer operação
// Isso é crucial para as regras de segurança do Firestore
export async function ensureAuthenticatedUser() {
    if (auth.currentUser) {
        return auth.currentUser.uid;
    }

    try {
        if (initialAuthToken) {
            const userCredential = await signInWithCustomToken(auth, initialAuthToken);
            return userCredential.user.uid;
        } else {
            const userCredential = await signInAnonymously(auth);
            return userCredential.user.uid;
        }
    } catch (error) {
        console.error("Erro na autenticação do Firebase:", error);
        throw new Error("Falha na autenticação do usuário.");
    }
}
