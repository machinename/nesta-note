'use client'

import styles from "../page.module.css";
import { useContext } from 'react';
import { AppContext } from "../context/app_provider";
import NoteGUI from "../components/note_gui";
import SearchNotes from "../note_layouts/seach_notes";
import ArchiveNotes from "../note_layouts/archive_notes";

export default function Archive() {
    const { filteredNotes, isSearch, notes } = useContext(AppContext);

    return (
        <main className={styles.content}>
            <div style={{ paddingTop: '6rem' }} />
            {
                isSearch ? (
                    // <>
                    //     {filteredNotes.filter(note => !note.isTrash).length === 0 ? (
                    //         <h3>Search</h3>
                    //     ) : (filteredNotes
                    //         .filter(note => !note.isTrash)
                    //         .map(note => (
                    //             <NoteGUI note={note} mode='read' key={note.id} />
                    //         ))
                    //     )}
                     
                    // </>
                       <SearchNotes />
                ) : (
                    // <>
                    //     {notes.filter(note => note.isArchived).length === 0 ? (
                    //         <h2>Your archived notes appear here</h2>
                    //     ) : (
                    //         notes
                    //             .filter(note => note.isArchived)
                    //             .map(note => (
                    //                 <NoteGUI note={note} mode='read' key={note.id} />
                    //             ))
                    //     )}
                    // </>
                    <ArchiveNotes/>
                )
            }


        </main>
    );
}