'use client'

import { useContext } from 'react';
import NoteGUI from "../components/NoteGUI";
import styles from "../page.module.css";
import { useAppContext } from '../providers/AppProvider';

export default function Search() {

    const { filteredNotes } = useAppContext();
    const searchNotes = filteredNotes.filter(note => !note.isTrash);

    return (
        <div className={styles.content}>
            {searchNotes.length === 0 ? (
                <h3>Search</h3>
            ) : (
                searchNotes.map(note => (
                    <>
                        <div style={{
                            height: '1rem'
                        }} key={note.id} />
                        <NoteGUI note={note} mode='read' key={note.id} />
                    </>
                ))
            )}
        </div>
    );
}