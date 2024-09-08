import { useContext } from 'react';
import { AppContext } from '../context/app_provider';
import NoteGUI from "../components/note_gui/note_gui";

export default function SearchNotes() {
    const { filteredNotes } = useContext(AppContext);
    const searchNotes = filteredNotes.filter(note => !note.isTrash);

    return (
        <>
            <div style={{ paddingTop: '6rem' }} />
            {searchNotes.length === 0 ? (
                <h3>Search</h3>
            ) : (
                searchNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}