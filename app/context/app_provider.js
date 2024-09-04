import React, { createContext, useState, useMemo, useCallback } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [infoContent, setInfoContent] = useState('');
  const [infoGeneral, setInfoGeneral] = useState('');
  const [infoTitle, setInfoTitle] = useState('');

  const [notes, setNotes] = useState([]);

  const createNote = useCallback((newNote) => {
    try {
      const noteWithId = {
        ...newNote,
        id: Date.now(), // Temp solution for local usage.
      };
      setNotes(prevNotes => [...prevNotes, noteWithId]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }, []);

  const updateNote = useCallback((id, updatedNote) => {
    try {
      const updatedNotes = notes.map(note => {
        if (note.id === id) {
          console.log('Note Updated:', updatedNote);
          return { ...note, ...updatedNote };
        }
        return note;
      });
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }, [notes]);

  const deleteNote = useCallback((id) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      setInfoGeneral('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, [notes]);

  const contextValue = useMemo(() => ({
    infoContent,
    infoGeneral,
    infoTitle,
    notes,
    createNote,
    updateNote,
    deleteNote,
    setInfoContent,
    setInfoGeneral,
    setInfoTitle,
    setNotes
  }), [infoContent, infoGeneral, infoTitle, notes, createNote, updateNote, deleteNote]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
