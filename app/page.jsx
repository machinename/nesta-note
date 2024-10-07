'use client'

import styles from "./page.module.css";
import NoteGUI from "./components/NoteGUI";
import { Note } from "./models/note";
import { useAppContext } from "./providers/AppProvider";
import Link from "next/link";

export default function Notes() {
  const { notes } = useAppContext();
  const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);

  // Creating a new Note instance with empty strings for id, title, and content,
  // and setting the default values for other optional parameters.
  const newNote = new Note(
    "",             // createdAt
    "",             // id
    "",             // title
    "",             // content
    false,          // isArchived (default)
    false,          // isPinned (default)
    false,          // isTrash (default)
    null,           // reminder (default)
    [],             // images (default)
    []              // nestedNotes (default)
  );

  return (
    <main className={styles.page}>
      <NoteGUI mode={'create'} note={newNote} />
      {activeNotes.length === 0 ? (
        <div style={{
          gap: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h1>
            Welcome To Nesta Notes, It&apos;s a POC for <Link style={{
              color: 'black',
              textDecoration: 'underline'
            }} href={'https://papertake.io'}
              target="_blank"
              rel="noopener noreferrer"
            >Paper Take</Link>
          </h1>
          <p>
            If you like the concept of Nesta Notes, please try Paper Take. It allows you to create an account and save your notes. Paper Take includes more features such as account management, project creation, task management, and more.
          </p>
        </div>
      ) : (
        activeNotes.map(note => (
          <NoteGUI key={note.id} mode={'read'} note={note} />
        ))
      )}
    </main>
  );
}