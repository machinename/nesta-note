export class Note {
    constructor(createdAt, id, title, content, isArchived = false, isPinned = false, isTrash = false, reminder = null, images = [], nestedNotes = []) {
        this.createdAt = createdAt;
        this.id = id;
        this.title = title;
        this.content = content;
        this.isArchived = isArchived;
        this.isPinned = isPinned;
        this.isTrash = isTrash;
        this.reminder = reminder;
        this.images = images;
        this.nestedNotes = nestedNotes;
    }

    static fromJSON(jsonString) {
        try {
            const { createdAt, id, title, content, isArchived, isPinned, isTrash, reminder, images, nestedNotes } = JSON.parse(jsonString);
            return new Note(
                createdAt,
                id,
                title,
                content,
                isArchived,
                isPinned,
                isTrash,
                reminder,
                images,
                nestedNotes.map(noteJSON => {
                    if (noteJSON && noteJSON.createdAt && noteJSON.id && noteJSON.title && noteJSON.content) {
                        return new Note(
                            noteJSON.createdAt,
                            noteJSON.id,
                            noteJSON.title,
                            noteJSON.content
                        );
                    } else {
                        console.error('Invalid nested note format');
                        return null;
                    }
                }).filter(note => note !== null)
            );
        } catch (error) {
            console.error('Failed to parse JSON', error);
            return null;
        }
    }

    toJSON() {
        return JSON.stringify({
            createdAt: this.id,
            id: this.id,
            title: this.title,
            content: this.content,
            isArchived: this.isArchived,
            isPinned: this.isPinned,
            isTrash: this.isTrash,
            reminder: this.reminder,
            images: this.images,
            nestedNotes: this.nestedNotes.map(note => ({
                id: note.id,
                title: note.title,
                content: note.content
            }))
        });
    }
}
