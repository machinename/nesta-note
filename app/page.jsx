'use client'

import styles from "./page.module.css";
import { useContext, useState } from 'react';
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
      <NoteGUI note={newNote} mode='create' />
      {notes
        .filter(note => !note.isArchived)
        .map(note => (
          <NoteGUI note={note} mode='read' key={note.id} />
        ))
      }
      <p>
        Nesta Note Beta
      </p>
      {/* {selectedNote && (     
          <NoteGUI note={selectedNote} key={selectedNote.id} mode='update' />
      )} */}
    </main>
  );
}

