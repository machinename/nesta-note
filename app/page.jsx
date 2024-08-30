'use client'

import styles from "./page.module.css";
import { useContext } from 'react';
import { AppContext } from "./context/app_provider";
import NoteGUI from './components/note_gui';
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
        Warning App Is Only 10% Complete. So Much Work To Be Done.
      </p>
    </main>
  );
}

