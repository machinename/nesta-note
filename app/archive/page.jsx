'use client'

import { useContext } from "react";
import styles from "../page.module.css";
import { AppContext } from "../context/AppProvider";
import NoteGUI from "../components/NoteGUI";

export default function Archive() {
    const { notes } = useContext(AppContext);
    const archivedNotes = notes.filter(note => note.isArchived && !note.isTrash);

    return (
        <div className={styles.content}>
            {archivedNotes.length === 0 ? (
                <h3>Empty Archive</h3>
            ) : (
                archivedNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </div>
    );
}