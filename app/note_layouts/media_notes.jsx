import React, { useContext } from 'react';
import NoteGUI from "../components/note_gui";
import { AppContext } from '../context/app_provider';

export default function MediaNotes() {
  const { notes } = useContext(AppContext);

  const mediaNotes = notes.filter(note => note.isMedia && !note.isTrash);

  return (
    <>
      {mediaNotes.length === 0 ? (
        <h2>Your media notes appear here</h2>
      ) : (
        mediaNotes.map(note => (
          <NoteGUI note={note} mode='read' key={note.id} />
        ))
      )}
    </>
  );
}