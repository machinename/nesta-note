import { useContext } from 'react';
import { AppContext } from '../context/app_provider';
import NoteGUI from "../components/note_gui/note_gui";

export default function ReminderNotes() {
    const { notes } = useContext(AppContext);
    const reminderNotes = notes.filter(note => note.isReminder && !note.isTrash);

    return (
        <>
            <div style={{ paddingTop: '6rem' }} />
            {mediaNotes.length === 0 ? (
                <h3>Your reminder notes appear here</h3>
            ) : (
                reminderNotes.map(note => (
                    <NoteGUI note={note} mode='read' key={note.id} />
                ))
            )}
        </>
    );
}