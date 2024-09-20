'use client'

import styles from "./note.module.css";
import NoteGUI from "../components/NoteGUI";
import ComingSoon from "../components/ComingSoon";
import { Note } from "../models/note";
import { useAppContext } from "../providers/AppProvider";


export default function Notes() {

    const { notes } = useAppContext();
    const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);

    // Creating a new Note instance with empty strings for id, title, and content,
    // and setting the default values for other optional parameters.
    const newNote = new Note(
        "",             // createdAt
        "",             // id
        "",             // title
        "",             // content
        false,          // isArchived (default)
        false,          // isPinned (default)
        false,          // isTrash (default)
        null,           // reminder (default)
        [],             // images (default)
        []              // nestedNotes (default)
    );

    return (
        <div className={styles.content}>
            <NoteGUI mode={'create'} note={newNote} />
            {activeNotes.length === 0 ? (
                <ComingSoon />
            ) : (
                activeNotes.map(note => (
                    <NoteGUI key={note.id} mode={'read'} note={note} />
                ))
            )}
        </div>
    );
}