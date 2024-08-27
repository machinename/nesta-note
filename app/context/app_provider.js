// context/noteProvider.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [infoContent, setInfoContent] = useState('');
  const [infoGeneral, setInfoGeneral] = useState('');
  const [infoTitle, setInfoTitle] = useState('');

  const [notes, setNotes] = useState([]);

  const createNote = (newNote) => {
    console.log('Note Created:', newNote);
    newNote.id = Date.now();
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
    <AppContext.Provider value={{
      infoContent, infoGeneral, infoTitle, notes,
      createNote, deleteNote, setInfoContent, setInfoGeneral, setInfoTitle, updateNote
    }}>
      {children}
    </AppContext.Provider>
  );
};