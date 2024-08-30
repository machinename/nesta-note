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
    nestedNotes: []
  });

  return (
    <main className={styles.content}>
      <NoteGUI note={newNote} mode={'create'} />
      <div style={{
        marginBottom: '2rem'
      }} />
      <>
        {notes.map((note, index) => (
          <NoteGUI note={note} mode={'update'} key={index}  />
        ))}
      </>
      <p>
        Warning App Is Still In Planning Stage.
      </p>
    </main>
  );
}

