'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { Note } from '../models/note';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [infoContent, setInfoContent] = useState('');
  const [infoGeneral, setInfoGeneral] = useState('');
  const [infoTitle, setInfoTitle] = useState('');

  /**
   * // Creates a new note and adds it to the notes state.
   * @param { Note } newNote - The new note object to be created, which should include note details.
   */
  const createNote = useCallback((newNote) => {
    try {
      const noteWithId = {
        ...newNote,
        id: Date.now(), // Temporary solution for local usage
      };
      setNotes(prevNotes => [...prevNotes, noteWithId]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }, []);

  /**
   * Updates an existing note based on its ID.
   * @param { number } id - The ID of the note to be updated.
   * @param { Note } updatedNote - The updated note data to be applied.
   */
  const updateNote = useCallback((id, updatedNote) => {
    try {
      const updatedNotes = notes.map(note => {
        if (note.id === id) {
          return { ...note, ...updatedNote };
        }
        return note;
      });
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }, [notes]);

  /**
   * Deletes a note based on its ID.
   * @param { number } id - The ID of the note to be deleted.
   */
  const deleteNote = useCallback((id) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      setInfoGeneral('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, [notes]);

  /**
   * Filters notes based on the search term.
   * @param { string } term - The term to search for within note titles and content.
   */
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

  // Clears the search term and filtered notes.
  const handleCloseSearch = useCallback(() => {
    setSearchTerm('');
    setFilteredNotes([]);
  }, []);

  // Memoized context value to avoid unnecessary re-renders.
  const contextValue = useMemo(() => ({
    infoContent,
    infoGeneral,
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
    setInfoGeneral,
    setInfoTitle,
    setNotes,
  }), [
    infoContent, infoGeneral, infoTitle, notes, filteredNotes, searchTerm,
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
    throw new Error('useAppContext must be used within AppProvider.jsx');
  }
  return context;
};