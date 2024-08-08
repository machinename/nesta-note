class Note {
  constructor(id, title, content, reminder, mediaContent) {
    this.title = title;
    this.id = id;
    this.content = content;
    this.mediaContent = mediaContent;
    this.reminder = reminder;
    this.linkedNotes = [];
  }

  static fromJSON(jsonString) {
    const { id, title, content, reminder, mediaContent} = JSON.parse(jsonString);
    return new Note(id, title, content, reminder, mediaContent);
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      content: this.content,
      reminder: this.reminder,
      mediaContent: this.mediaContent,
      linkedNotes: this.linkedNotes.map(note => note.toJSON())
    });
  }

  addNote(note) {
    if (note instanceof Note) {
      this.linkedNotes.push(note);
    } else {
      throw new Error('Only instances of Note can be linked.');
    }
  }

  archiveNote() {
    // Implementation here
  }

  deleteNote() {
    // Implementation here
  }
}
  
  // Example usage:
  const mainNote = new Note('Main Note', 'This is the main note content.');
  const linkedNote = new Note('Nested Note', 'This is a nested note content.');
  mainNote.addNote(linkedNote);
  console.log(mainNote);