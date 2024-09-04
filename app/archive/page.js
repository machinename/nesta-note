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
      <h1>
        Not A Final Version
      </h1>
      <h2>
        Features Coming Soon
      </h2>
      <p>
        Account Management
      </p>
      <p>
        Drawing & Background Options
      </p>
      <p>
        Grid Layouts 
      </p>
      <p>
        Reminder Functionality
      </p>
      <p>
        Settings Page
      </p>
      <p>
        Help & Feedback Page
      </p>
      <p>
        Search Functionality
      </p>
    </main>
  );
}

