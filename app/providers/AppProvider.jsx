'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useAuthContext } from './AuthProvider';
import { collection, doc, getDocs, setDoc, query, where, runTransaction } from "firebase/firestore";
import { firestore } from '../firebase';
import { v4 as uuidv4 } from 'uuid';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [infoContent, setInfoContent] = useState('');
  const [info, setInfo] = useState('');
  const [infoTitle, setInfoTitle] = useState('');
  const { user } = useAuthContext();

  const fetchNotes = useCallback(async () => {
    try {
      if (user) {
        const notesRef = collection(firestore, "users", user.uid, "notes");
        const q = query(notesRef); // Order by createdAt
        const querySnapshot = await getDocs(q);

        const notesArray = querySnapshot.docs.map(doc => ({
          id: doc.data().id,
          ...doc.data()
        }));

        setNotes(notesArray);
        console.log("Notes fetched successfully", notesArray);
      } else {
        console.log("No user is logged in. Cannot fetch notes.");
      }
    } catch (error) {
      console.log('Error fetching notes:', error);
      // Consider user feedback here
    }
  }, [user, setNotes]);

  // Call fetchNotes when appropriate, such as on component mount or after adding a note
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(async (newNote) => {
    try {
      if (user) {
        const notesRef = collection(firestore, "users", user.uid, "notes");
        const noteID = uuidv4(); 
        const docRef = doc(notesRef, noteID);

        await runTransaction(firestore, async (transaction) => {
          const docSnapshot = await transaction.get(docRef);
          if (!docSnapshot.exists()) {
            const note = {
              ...newNote,
              createdAt: Date.now(),
              id: noteID
            };

            transaction.set(docRef, note);
            console.log("Note created successfully");
          } else {
            throw new Error("Note ID collision detected"); // Handle collision
          }
        });

        await fetchNotes();
      } else {
        const noteWithId = {
          ...newNote,
          createdAt: Date.now(),
          id: Date.now().toString()
        };
        console.log(noteWithId);
        setNotes(prevNotes => [...prevNotes, noteWithId]);
        console.log("Note created successfully");
      }
    } catch (error) {
      console.log('Error creating note:', error);
    }
  }, [user, fetchNotes]);



  const updateNote = useCallback(async (id, updatedNote) => {
    try {
      if (user) {
        const noteRef = doc(firestore, "users", user.uid, "notes", id);
        await runTransaction(firestore, async (transaction) => {
          const docSnapshot = await transaction.get(noteRef);
          if (docSnapshot.exists()) {
            transaction.update(noteRef, updatedNote);
            console.log("Note updated successfully");
          } else {
            throw new Error("Note does not exist");
          }
        });
        await fetchNotes();
      } else {
        const updatedNotes = notes.map(note => {
          if (note.id === id) {
            return { ...note, ...updatedNote };
          }
          return note;
        });
        setNotes(updatedNotes);
        console.log("Note updated successfully");
      }
    } catch (error) {
      console.log('Error updating note:', error);
    }
  }, [notes, user, fetchNotes]);

  const deleteNote = useCallback(async (id) => {
    try {
      if (user) {
        const noteRef = doc(firestore, "users", user.uid, "notes", id);
        await runTransaction(firestore, async (transaction) => {
          const docSnapshot = await transaction.get(noteRef);
          if (docSnapshot.exists()) {
            transaction.delete(noteRef);
            console.log("Note deleted successfully");
          } else {
            throw new Error("Note does not exist");
          }
        });
        await fetchNotes();
      } else {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        console.log("Note deleted successfully");
      }
    } catch (error) {
      console.log('Error deleting note:', error);
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
    notes,
    filteredNotes,
    searchTerm,
    createNote,
    updateNote,
    deleteNote,
    handleSearch,
    handleCloseSearch,
    setInfoContent,
    setInfo,
    setInfoTitle,
    setNotes,
  }), [
    infoContent, info, infoTitle, notes, filteredNotes, searchTerm,
    createNote, updateNote, deleteNote, handleSearch, handleCloseSearch
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
