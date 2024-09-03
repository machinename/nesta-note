'use client'

import styles from "./page.module.css";
import { useContext } from 'react';
import { AppContext } from "../context/app_provider";
import NoteGUI from '../components/note_gui';

export default function Archive() {
  const { notes } = useContext(AppContext);
  
  return (
    <main className={styles.content}>
      <>
      {notes
        .filter(note => note.isArchived)
        .map(note => (
          <NoteGUI note={note} mode='update' key={note.id} />
        ))
      }
      </>
      <p>
        Not A Final Version
      </p>
    </main>
  );
}

