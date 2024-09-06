class Note {
  constructor(id, title, content, isPinned, reminder, mediaContent, nested) {
    this.title = title;
    this.id = id;
    this.isPinned = isPinned;
    this.isTrash = false;
    this.content = content;
    this.mediaContent = mediaContent;
    this.nested = nested;
    this.reminder = reminder;
    this.nestedNotes = [];
  }

  static fromJSON(jsonString) {
    const { id, title, content, isPinned, isTrash, reminder, mediaContent } = JSON.parse(jsonString);
    return new Note(id, title, content, isPinned, isTrash, reminder, mediaContent);
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      content: this.content,
      isPinned: this.isPinned,
      isTrash: this.isTrash,
      reminder: this.reminder,
      mediaContent: this.mediaContent,
      nestedNotes: this.nestedNotes.map(note => note.toJSON())
    });
  }

}

export default Note;