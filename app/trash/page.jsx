'use client'

import styles from "../page.module.css";
import { useContext } from 'react';
import { AppContext } from "../context/app_provider";
import SearchNotes from "../note_layouts/seach_notes";
import NoteGUI from "../components/note_gui";

export default function Trash() {
    const { notes, isSearch, filteredNotes } = useContext(AppContext);

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
                        <p>Notes in Trash are deleted after 7 days.</p>
                        {notes.filter(note => note.isTrash).length === 0 ? (
                            <h1>No notes in Trash</h1>
                        ) : (
                            notes
                                .filter(note => note.isTrash)
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