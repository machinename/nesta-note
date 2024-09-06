'use client'

import styles from "./page.module.css";
import { useContext } from 'react';
import { AppContext } from "../context/app_provider";
import ComingSoon from "../components/coming_soon";
import NoteGUI from "../components/note_gui";

export default function Search() {
    const { filteredNotes } = useContext(AppContext);

    return (
        <main className={styles.content}>
                  <div style={{
        paddingTop: '6rem',
      }} />
            {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            ) : (
                <h1>Nothing Found</h1>
            )}

            <ComingSoon />
        </main>
    );
}



