import React, { useContext } from 'react';
import NoteGUI from "../components/note_gui";
import { AppContext } from '../context/app_provider';

export default function SearchNotes() {
  const { filteredNotes } = useContext(AppContext);

  const searchNotes = filteredNotes.filter(note => !note.isTrash);

  return (
    <>
      {searchNotes.length === 0 ? (
        <h1>Search</h1>
      ) : (
        searchNotes.map(note => (
          <NoteGUI note={note} mode='read' key={note.id} />
        ))
      )}
    </>
  );
}