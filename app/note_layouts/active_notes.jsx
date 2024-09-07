import { useContext } from 'react';
import NoteGUI from "../components/note_gui";
import { AppContext } from '../context/app_provider';
export default function ActiveNotes() {
  const { notes } = useContext(AppContext);
  const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);
  return (
    <>
      <NoteGUI note={newNote} mode='create' />
      {activeNotes.length === 0 ? (
        <h1>Notes you add appear here</h1>
      ) : (
        activeNotes.map(note => (
          <NoteGUI note={note} mode='read' key={note.id} />
        ))
      )}
    </>
  );
}