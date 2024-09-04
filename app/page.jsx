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

  const [isViewMode, setIsViewMode] = useState(false);

  const handleViewMode =()=> {
    isViewMode(!isViewMode);
  }

  return (
    <main className={styles.content}>
      <div style={{
        paddingTop: '6rem',
      }}/>
      <NoteGUI note={newNote} mode='create' />
      {notes
        .filter(note => !note.isArchived)
        .map(note => (
          <NoteGUI note={note} mode='read' key={note.id} onclick={handleViewMode} />
 
        ))
      }
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

