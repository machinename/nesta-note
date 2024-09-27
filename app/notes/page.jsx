'use client'

import styles from "../page.module.css";
import NoteGUI from "../components/NoteGUI";
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
        <div className={styles.page}>
            <NoteGUI mode={'create'} note={newNote} />
            {activeNotes.length === 0 ? (
                <>
                    <h1>
                        Notes you add appear here
                    </h1>
                    <p>--------------------</p>
                    <h3>
                        Features Coming Soon
                    </h3>
                    <p>
                        Application Settings
                    </p>
                    <p>
                        Offline Mode
                    </p>
                    <p>
                        Drawing & Background Options
                    </p>
                    <p>
                        Grid Layouts
                    </p>
                    <p>
                        Reminder Functionality
                    </p>
                    <p>
                        Help & Feedback Page
                    </p>
                </>
            ) : (
                activeNotes.map(note => (
                    <NoteGUI key={note.id} mode={'read'} note={note} />
                ))
            )}
        </div>
    );
}