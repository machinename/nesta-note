import { useContext } from 'react';
import { AppContext } from '../context/app_provider';
import NoteGUI from "../components/note_gui";

export default function MediaNotes() {
    const { notes } = useContext(AppContext);
    const mediaNotes = notes.filter(note => note.isMedia && !note.isTrash);

    return (
        <>
            {mediaNotes.length === 0 ? (
                <h3>Your media notes appear here</h3>
            ) : (
                mediaNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}