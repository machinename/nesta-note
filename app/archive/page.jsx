'use client'

import styles from "../page.module.css";
import NoteGUI from "../components/NoteGUI";
import { useAppContext } from "../providers/AppProvider";

export default function Archive() {
    const { notes } = useAppContext();
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