'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    signInWithEmailAndPassword, 
    updateProfile,
    verifyBeforeUpdateEmail,
} from "firebase/auth";

import { auth } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userDisplayName, setUserDisplayName] = useState(null);
    const [isAuthloading, setIsAuthLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setUserEmail(user?.email);
            setUserDisplayName(user?.displayName);
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAuthError = useCallback((error) => { 
        switch (error.code) {
            default:
                setAuthError("An error occurred. Try again later.");
                break;;
        }
    }, []);

    const createAccount = useCallback(async (email, password) => {
        setAuthError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            // Define ActionCodeSettings
            const actionCodeSettings = {
                url: 'http://nestanote.com/notes',
                // iOS: {
                //     bundleId: 'com.example.ios', // Replace with your iOS bundle ID
                // },
                // android: {
                //     packageName: 'com.example.android', // Replace with your Android package name
                //     installApp: true, // Set to true if you want to prompt to install the app if not installed
                //     minimumVersion: '12', // Optional: specify minimum version
                // },
                handleCodeInApp: true, // Set to true to handle in app directly
            };
            await sendEmailVerification(userCredential.user, actionCodeSettings);
            return true;
        } catch (error) {
            setAuthError(error.code);
            // handleAuthError(error); 
            console.log(error);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setAuthError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            console.log(userCredential);
            return true;
        } catch (error) {
            setAuthError(error.code);
            // handleAuthError(error);
            console.log(error);
            return false
        }
    }, []);

    const logOut = useCallback(async () => {
        setAuthError(null);
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            setAuthError(error.code);
            // handleAuthError(error);
            console.log(error);
        }
    }, []);

    const updateUserDisplayName = useCallback(async (newDisplayName) => {
        setAuthError(null);
        if (!user) {
            setAuthError("User must be signed in to update display name.");
            return;
        }

        if (newDisplayName === user.displayName) {
            setAuthError("New display name must be different from current display name.");
            return;
        }

        try {
            await updateProfile(user, { displayName: newDisplayName });
            console.log('Display name updated');
            setUserDisplayName(newDisplayName);
            return true;
        } catch (error) {
            setAuthError(error.code);
            console.log(error);
        }
    }, [user]);

    const updateUserEmail = useCallback(async (newEmail, password) => {
        setAuthError(null);
        if (!user) {
            setAuthError("User must be signed in to update email.");
            return;
        }

        if (user?.emailVerified === false) {
            setAuthError("You must verify your current email before making account changes.");
            return;
        }

        if (newEmail === user.email) {
            setAuthError("New email must be different from current email.");
            return;
        }
        // Define ActionCodeSettings
        const actionCodeSettings = {
            url: 'http://localhost:3000/notes',
            // iOS: {
            //     bundleId: 'com.example.ios', // Replace with your iOS bundle ID
            // },
            // android: {
            //     packageName: 'com.example.android', // Replace with your Android package name
            //     installApp: true, // Set to true if you want to prompt to install the app if not installed
            //     minimumVersion: '12', // Optional: specify minimum version
            // },
            handleCodeInApp: true, // Set to true to handle in app directly
        };
        try {
            const credential = EmailAuthProvider.credential(user?.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);
            // console.log('Reauthentication successful');
            await verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings);
            // await updateEmail(user, newEmail);
            console.log("Email update initiated. Check your inbox for verification.");
            return true;
        } catch (error) {
            setAuthError(error.code);
            // handleAuthError(error);
            console.log(error);
        }
    }, [user]);

    const deleteUserAccount = useCallback(async (password) => {
        setAuthError(null);
        if (!user) {
            setAuthError("User must be signed in to update email.");
            return;
        }

        // if (user?.emailVerified === false) {
        //     setAuthError("You must verify your current email before making account changes.");
        //     return;
        // }

        try {
            const credential = EmailAuthProvider.credential(user?.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);
            console.log('Reauthentication successful!');
            await deleteUser(user);
            console.log("Account deleted!");
            return true;
        } catch (error) {
            setAuthError(error.code);
            // handleAuthError(error);
            console.log(error);
        }
    }, [user]);

    const reauthenticate = useCallback(async (password) => {
        setError(null);
        try {
            const credential = EmailAuthProvider.credential(user?.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);
            console.log('Reauthentication successful!');
        } catch (error) {
            setAuthError(error.code);
            handleAuthError(error);
        }
    }, [handleAuthError, user]);

    const value = {
        user,
        userEmail,
        userDisplayName,
        isAuthloading,
        authError,
        createAccount,
        deleteUserAccount,
        login,
        logOut,
        reauthenticate,
        updateUserDisplayName,
        updateUserEmail,
        setAuthError,
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