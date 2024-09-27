'use client'

import NoteGUI from "../components/NoteGUI";
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";

export default function Trash() {
    const { notes } = useAppContext();
    const trashNotes = notes.filter(note => note.isTrash);

    return (
        <div className={styles.page}>
            {trashNotes.length === 0 ? (
                <h1>Empty Trash</h1>
            ) : (
                trashNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </div >
    );
}