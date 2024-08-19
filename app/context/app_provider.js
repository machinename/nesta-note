// context/noteProvider.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  const readNotes = () => {
    return notes;
  };

  const createNote = (newNote) => {
    console.log('Note Created:', newNote);
    setNotes([...notes, newNote]);
  };


  const updateNote = (id, updatedNote) => {
    const updatedNotes = notes.map(note => {
        if (note.id === id) {
            console.log('Note Updated:', updatedNote);
            return updatedNote;
        }
        return note;
    });
    setNotes(updatedNotes);
};

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
  };

  return (
    <AppContext.Provider value={{ notes, createNote, readNotes, updateNote, deleteNote }}>
      {children}
    </AppContext.Provider>
  );
};