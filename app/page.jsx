'use client'

import styles from "./page.module.css";
import NoteContainer from "./components/note_container";
import { useContext } from 'react';
import { AppContext } from "./context/app_provider";
import NoteCreator from "./components/note_creator";

export default function Home() {
  const { notes } = useContext(AppContext);
  const newNote = { id: '', title: '', content: '', isPinned: false };

  return (
    <main className={styles.content}>
      <NoteCreator />
      <div style={{
        marginBottom: '1rem'
      }} />

      {notes.map((note, index) => (
        <NoteContainer key={index} note={note} />
      ))}
    </main>
  );
}

