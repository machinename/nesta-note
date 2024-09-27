'use client'

import NoteGUI from "../components/NoteGUI";
import styles from "../page.module.css";
import { useAppContext } from '../providers/AppProvider';

export default function Search() {
    const { filteredNotes } = useAppContext();
    const searchNotes = filteredNotes.filter(note => !note.isTrash);

    return (
        <div className={styles.page}>
            {searchNotes.length === 0 ? (
                <h1>Search</h1>
            ) : (
                searchNotes.map(note => (
                        <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </div>
    );
}