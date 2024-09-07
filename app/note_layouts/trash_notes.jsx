import { useContext } from 'react';
import NoteGUI from "../components/note_gui";
import { AppContext } from '../context/app_provider';
export default function TrashNotes() {
    const { notes } = useContext(AppContext);
    const trashNotes = notes.filter(note => note.isTrash);
    return (
        <>
            {trashNotes.length === 0 ? (
                <h1>No notes in Trash</h1>
            ) : (
                trashNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}