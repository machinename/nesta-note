'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useAuthContext } from './AuthProvider';
import { collection, doc, getDocs, setDoc, query, where, runTransaction } from "firebase/firestore";
import { firestore } from '../firebase';
import { v4 as uuidv4 } from 'uuid';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [infoContent, setInfoContent] = useState('');
  const [info, setInfo] = useState('');
  const [infoTitle, setInfoTitle] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(false);

  const resetAppProviderData = () => {
    setNotes([]);
    setFilteredNotes([]);
    setSearchTerm('');
    setInfoContent('');
    setInfo('');
    setInfoTitle('');
    setIsAppLoading(false);
  }
  
  const fetchNotes = useCallback(async () => {
    try {
      setIsAppLoading(true);
      if (user) {

        const notesRef = collection(firestore, "users", user.uid, "notes");
        const q = query(notesRef);
        const querySnapshot = await getDocs(q);

        const notesArray = querySnapshot.docs.map(doc => ({
          id: doc.data().id,
          ...doc.data()
        }));

        setNotes(notesArray);
        console.log("Notes fetched successfully");
      } else {
        console.log("No user is logged in, fetching notes from local storage");
      }
    } catch (error) {
      console.log('Error fetching notes:', error);
      setNotes([]);
    } finally {
      setIsAppLoading(false);
    }
  }, [user, setNotes]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(async (newNote) => {
    const noteWithId = {
      ...newNote,
      createdAt: Date.now(),
      id: user ? uuidv4() : Date.now().toString()
    };
    setNotes(prevNotes => [...prevNotes, noteWithId]);
    try {
      if (user) {
        const notesRef = collection(firestore, "users", user.uid, "notes");
        const docRef = doc(notesRef, noteWithId.id);

        await runTransaction(firestore, async (transaction) => {
          const docSnapshot = await transaction.get(docRef);
          if (docSnapshot.exists()) {
            throw new Error("Note ID collision detected");
          } else {
            transaction.set(docRef, noteWithId);
            console.log("Note created in Firestore");
          }
        });
        await fetchNotes(); 
      } 
    } catch (error) {
      console.error('Error creating note: ', error);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteWithId.id));
    }
  }, [user, fetchNotes]);

  const updateNote = useCallback(async (updatedNote) => {
    const originalNote = notes.find(note => note.id === updatedNote.id);
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === updatedNote.id ? { ...note, ...updatedNote } : note
      )
    );
    try {
      if (user) {
        const notesRef = collection(firestore, "users", user.uid, "notes");
        const docRef = doc(notesRef, updatedNote.id);

        await runTransaction(firestore, async (transaction) => {
          const docSnapshot = await transaction.get(docRef);
          if (!docSnapshot.exists()) {
            throw new Error("Note does not exist");
          } else {
            transaction.update(docRef, updatedNote);
            console.log("Note updated in Firestore");
          }
        });

        await fetchNotes();
      }
    } catch (error) {
      console.error('Error updating note: ', error);
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === updatedNote.id ? originalNote : note
        )
      );
    }
  }, [notes, user, fetchNotes]);

  const deleteNote = useCallback(async (id) => {
    const noteToDelete = notes.find(note => note.id === id);
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    try {
      if (user) {
        const noteRef = doc(firestore, "users", user.uid, "notes", id);
        await runTransaction(firestore, async (transaction) => {
          const docSnapshot = await transaction.get(noteRef);
          if (docSnapshot.exists()) {
            transaction.delete(noteRef);
            console.log("Note deleted in Firestore");
          } else {
            throw new Error("Note does not exist");
          }
        });
        await fetchNotes();
      }  
    } catch (error) {
      console.log('Error deleting note: ', error);
      setNotes(prevNotes => [...prevNotes, noteToDelete]);
    }
  }, [notes, user, fetchNotes]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredNotes([]);
    } else {
      const lowercasedTerm = term.toLowerCase();
      setFilteredNotes(
        notes.filter(note =>
          note.title.toLowerCase().includes(lowercasedTerm) ||
          note.content.toLowerCase().includes(lowercasedTerm)
        )
      );
    }
  }, [notes]);

  const handleCloseSearch = useCallback(() => {
    setSearchTerm('');
    setFilteredNotes([]);
  }, []);

  const contextValue = useMemo(() => ({
    infoContent,
    info,
    infoTitle,
    isAppLoading,
    notes,
    filteredNotes,
    searchTerm,
    createNote,
    fetchNotes,
    updateNote,
    deleteNote,
    handleSearch,
    handleCloseSearch,
    setInfoContent,
    setInfo,
    setInfoTitle,
    setNotes,
  }), [
    infoContent, info, infoTitle, isAppLoading, notes, filteredNotes, searchTerm,
    createNote, fetchNotes, updateNote, deleteNote, handleSearch, handleCloseSearch
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
