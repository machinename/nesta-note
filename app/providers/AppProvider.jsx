'use client'

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [infoContent, setInfoContent] = useState('');
  const [info, setInfo] = useState('');
  const [infoTitle, setInfoTitle] = useState('');

  const createNote = useCallback((newNote) => {
    const noteWithId = {
      ...newNote,
      createdAt: Date.now(),
      id: uuidv4()
    };
    setNotes(prevNotes => [...prevNotes, noteWithId]);

  }, []);

  const updateNote = useCallback((updatedNote) => {
    const originalNote = notes.find(note => note.id === updatedNote.id);
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === updatedNote.id ? { ...note, ...updatedNote } : note
      )
    );
  }, [notes]);

  const deleteNote = useCallback((noteId) => {
    const noteToDelete = notes.find(note => note.id === noteId);
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  } , [notes]);

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
  }), [infoContent, info, infoTitle, notes, filteredNotes, searchTerm, createNote, updateNote, deleteNote, handleSearch, handleCloseSearch]);

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
