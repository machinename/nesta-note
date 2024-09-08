import { useContext } from 'react';
import { AppContext } from '../context/app_provider';
import NoteGUI from "../components/note_gui";

export default function TrashNotes() {
    const { notes } = useContext(AppContext);
    const trashNotes = notes.filter(note => note.isTrash);

    return (
        <>
            {trashNotes.length === 0 ? (
                <h3>No notes in Trash</h3>
            ) : (
                trashNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}