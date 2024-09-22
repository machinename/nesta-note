'use client'

import NoteGUI from "../components/NoteGUI";
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";

export default function Trash() {
    const { notes } = useAppContext();
    const trashNotes = notes.filter(note => note.isTrash);

    return (
        <div className={styles.content}>
            {trashNotes.length === 0 ? (
                <h3>Empty Trash</h3>
            ) : (
                trashNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </div >
    );
}