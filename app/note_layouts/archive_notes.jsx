import { useContext } from 'react';
import { AppContext } from '../context/app_provider';
import NoteGUI from "../components/note_gui/note_gui";

export default function ArchiveNotes() {
    const { notes } = useContext(AppContext);
    const archivedNotes = notes.filter(note => note.isArchived && !note.isTrash);

    return (
        <>
            <div style={{ paddingTop: '6rem' }} />
            {archivedNotes.length === 0 ? (
                <h3>Your archived notes appear here</h3>
            ) : (
                archivedNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}