import NoteGUI from "../components/note_gui";

export default function ArchiveNotes() {
  const { notes } = useContext(AppContext);

  const archivedNotes = notes.filter(note => note.isArchived);

  return (
    <>
      {archivedNotes.length === 0 ? (
        <h2>Your archived notes appear here</h2>
      ) : (
        archivedNotes.map(note => (
          <NoteGUI note={note} mode='read' key={note.id} />
        ))
      )}
    </>
  );
}