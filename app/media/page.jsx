'use client'

import styles from "../page.module.css";
import { useContext } from 'react';
import { AppContext } from "../context/app_provider";
import NoteGUI from "../components/note_gui";

export default function Media() {
    const { filteredNotes, isSearch, notes } = useContext(AppContext);

    return (
        <main className={styles.content}>
            <div style={{ paddingTop: '6rem' }} />
            {
                isSearch ? (
                    <>
                        {filteredNotes.filter(note => !note.isTrash).length === 0 ? (
                            <h1>Search</h1>
                        ) : (filteredNotes
                            .filter(note => !note.isTrash)
                            .map(note => (
                                <NoteGUI note={note} mode='read' key={note.id} />
                            ))
                        )}
                    </>
                ) : (
                    <>
                        {notes.filter(note => note.isMedia).length === 0 ? (
                            <h1>Your media notes appear here</h1>
                        ) : (
                            notes
                                .filter(note => note.isMedia)
                                .map(note => (
                                    <NoteGUI note={note} mode='read' key={note.id} />
                                ))
                        )}
                    </>
                )
            }


        </main>
    );
}