'use client'

import styles from "./page.module.css";
import { useContext } from 'react';
import { AppContext } from "../context/app_provider";
import ComingSoon from "../components/coming_soon";
import NoteGUI from "../components/note_gui";

export default function Search() {
    const { notes } = useContext(AppContext);

    return (
        <main className={styles.content}>
            <div style={{ paddingTop: '6rem' }} />
            <>
                {notes.filter(note => note.isArchived).length === 0 ? (
                    <h1>Archive Empty</h1>
                ) : (
                    notes
                        .filter(note => note.isArchived)
                        .map(note => (
                            <NoteGUI note={note} mode='update' key={note.id} />
                        ))
                )}
            </>
            <ComingSoon />
        </main>
    );
}