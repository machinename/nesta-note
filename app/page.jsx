'use client'

import { useContext } from "react";
import styles from "./page.module.css";
import { AppContext } from "./context/AppProvider";
import NoteGUI from "./components/NoteGUI";

export default function Home() {
  const { notes } = useContext(AppContext);
  const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);

  const newNote = ({
    title: '',
    content: '',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    isMedia: false,
  });

  return (
    <div className={styles.content}>
      <NoteGUI note={newNote} mode={'create'} />
      {activeNotes.length === 0 ? (
        <h3>Notes you add appear here</h3>
      ) : (
        activeNotes.map(note => (
          <>
            <div style={{
              height:'1rem'
            }} key={note.id}/>
            <NoteGUI note={note} mode={'read'} key={note.id} />
          </>
         
        ))
      )}
    </div>
  );
}