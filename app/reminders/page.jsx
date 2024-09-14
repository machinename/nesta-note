'use client'

import { useContext } from "react";
import styles from "../page.module.css";
import { AppContext } from "../context/AppProvider";
import NoteGUI from "../components/NoteGUI";

export default function Archive() {
    const { notes } = useContext(AppContext);
    const reminderNotes = notes.filter(note => note.isReminder && !note.isTrash);

    return (
        <div className={styles.content}>
            {reminderNotes.length === 0 ? (
                <h3>Empty Reminders</h3>
            ) : (
                archivedNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </div>
    );
}