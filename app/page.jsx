'use client'

import styles from "./page.module.css";
import { useContext } from 'react';
import { AppContext } from "./context/app_provider";
import NoteCreate from "./components/note_create";
import NoteUpdate from "./components/note_update";

export default function Home() {
  const { notes } = useContext(AppContext);
  const newNote = ({
    title: '',
    content: '',
    isPinned: false,
    nestedNotes: []
  });

  return (
    <main className={styles.content}>
      <NoteCreate note={newNote} />
      <div style={{
        marginBottom: '1rem'
      }} />
      <>
        {notes.map((note, index) => (
          <NoteUpdate note={note} key={index} />
        ))}
      </>
    </main>
  );
}

