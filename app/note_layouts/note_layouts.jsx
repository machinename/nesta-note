
import { useContext } from "react";
import { AppContext } from "../context/app_provider";

const { notes, filteredNotes } = useContext(AppContext);

export const ActiveNotes = () => {
    const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);
    return (
        <>
            <NoteGUI note={newNote} mode='create' />
            {activeNotes.length === 0 ? (
                <h1>Notes you add appear here</h1>
            ) : (
                activeNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}

export const SearchNotes = () => {
    const searchNotes = filteredNotes.filter(note => !note.isTrash);
    return (
        <>
            {searchNotes.length === 0 ? (
                <h1>Search</h1>
            ) : (
                searchNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}
