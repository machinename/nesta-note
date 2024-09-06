'use client'

import styles from "./page.module.css";
import { useContext, useState } from 'react';
import { AppContext } from "./context/app_provider";
import NoteGUI from './components/note_gui';
import ComingSoon from "./components/coming_soon";

export default function Home() {
  const { notes } = useContext(AppContext);
  const newNote = ({
    title: '',
    content: '',
    isPinned: false,
    isArchived: false,
    isTrash: false,
    nestedNotes: []
  });

  return (
    <main className={styles.content}>
      <div style={{
        paddingTop: '6rem',
      }} />
      <NoteGUI note={newNote} mode='create' />
      {notes
        .filter(note => !note.isArchived && !note.isTrash)
        .map(note => (
          <NoteGUI note={note} mode='read' key={note.id}/>
        ))
      }
      <ComingSoon />
    </main>
  );
}

