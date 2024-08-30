class Note {
  constructor(id, title, content, isPinned, reminder, mediaContent, nested) {
    this.title = title;
    this.id = id;
    this.isPinned = isPinned;
    this.content = content;

    this.mediaContent = mediaContent;
    this.nested = nested;
    this.reminder = reminder;
    this.nestedNotes = [];
  }

  static fromJSON(jsonString) {
    const { id, title, content, isPinned, reminder, mediaContent } = JSON.parse(jsonString);
    return new Note(id, title, content, isPinned, reminder, mediaContent);
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      content: this.content,
      isPinned: this.isPinned,
      reminder: this.reminder,
      mediaContent: this.mediaContent,
      nestedNotes: this.nestedNotes.map(note => note.toJSON())
    });
  }

  addNestedNote(note) {
    if(this.nested === false){
      if (note instanceof Note) {
        this.nestedNotes.push(note);
      } else {
        throw new Error('Only instances of Note can be stored.');
      }
    } else {
      throw new Error('Nested notes can not add notes');
    }
  }

  deleteNestedNote(id) {
    const index = this.nestedNotes.findIndex(note => note.id === id);
    if (index !== -1) {
      this.nestedNotes.splice(index, 1);
    } else {
      throw new Error('Note not found.');
    }
  }
}

export default Note;