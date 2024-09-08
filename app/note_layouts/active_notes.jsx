import { useContext } from 'react';
import { AppContext } from '../context/app_provider';
import NoteGUI from "../components/note_gui/note_gui";

export default function ActiveNotes() {
    const { notes } = useContext(AppContext);
    const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);

    const newNote = ({
        title: '',
        content: '',
        isPinned: false,
        isArchived: false,
        isTrash: false,
        isMedia: false,
        nestedNotes: []
    });

    return (
        <>
            <div style={{ paddingTop: '6rem' }} />
            <NoteGUI note={newNote} mode='create' />
            {activeNotes.length === 0 ? (
                <h3>Notes you add appear here</h3>
            ) : (
                activeNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}