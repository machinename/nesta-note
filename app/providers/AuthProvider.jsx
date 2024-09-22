'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useAppContext } from './AppProvider';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const createAccount = useCallback(async (email, password) => {
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            setUserEmail(userCredential.user.email);
            setUserUID(userCredential.user.uid);
            console.log(userCredential)
        } catch (error) {
            setError(error.message);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            setUserEmail(userCredential.user.email);
            setUserUID(userCredential.user.uid);
            console.log(userCredential)
        } catch (error) {
            setError(error.message);
        }
    }, []);

    const logOut = useCallback(async () => {
        setError(null);
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            setError(error.message);
        }
    }, []);

    const value = {
        user,
        loading,
        error,
        createAccount,
        login,
        logOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};
