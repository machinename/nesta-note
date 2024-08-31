'use client'

import styles from "./page.module.css";
import { useContext } from 'react';
import { AppContext } from "./context/app_provider";
import NoteGUI from './components/note_gui';

export default function Home() {
  const { notes } = useContext(AppContext);
  const newNote = ({
    title: '',
    content: '',
    isPinned: false,
    isArchived: false,
    nestedNotes: []
  });

  return (
    <main className={styles.content}>
      <NoteGUI note={newNote} mode={'create'} />
      <>
        {notes.map((note, index) => (
          !note.isArchived && <NoteGUI note={note} mode={'update'} key={index}  />
        ))}
      </>
      <p>
      App Is Still In Very Early Development.
      </p>
    </main>
  );
}

