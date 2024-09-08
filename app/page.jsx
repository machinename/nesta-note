'use client'

import styles from "./page.module.css";
import { useContext } from 'react';
import { AppContext } from "./context/app_provider";
import NoteGUI from './components/note_gui';
import ComingSoon from "./components/coming_soon";
import SearchNotes from "./note_layouts/seach_notes";

export default function Home() {
  const { notes, filteredNotes, isSearch } = useContext(AppContext);
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
      {
        isSearch ? (
          // <>
          //   {filteredNotes.filter(note => !note.isTrash).length === 0 ? (
          //     <h1>Search</h1>
          //   ) : (filteredNotes
          //     .filter(note => !note.isTrash)
          //     .map(note => (
          //       <NoteGUI note={note} mode='read' key={note.id} />
          //     ))
          //   )}
          // </>
          <SearchNotes/>
        ) : (
          <>
            <NoteGUI note={newNote} mode='create' />
            {
              notes.filter(note => !note.isArchived).length === 0 ? (
                <h1>Notes you add appear here</h1>
              ) : (
                notes
                  .filter(note => !note.isArchived && !note.isTrash)
                  .map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                  ))

              )
            }
          </>
        )
      }
      {/* <ComingSoon /> */}
    </main>
  );
}

