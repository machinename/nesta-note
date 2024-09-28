'use client';

import { Box } from '@mui/material';
import { useCallback,  useEffect, useState, useRef } from 'react';
import { useAppContext } from '../providers/AppProvider';
import { useAuthContext } from '../providers/AuthProvider';
import { useThemeContext } from '../providers/ThemeProvider';
import NoteBody from './NoteBody';
import NoteHeader from './NoteHeader';
import NoteFooter from './NoteFooter';
import NoteNestedNotes from './NoteNestedNotes';
import styles from "./Note.module.css"


export default function NoteGUI({mode, note}) {
    const { user } = useAuthContext();
    const { createNote, deleteNote, updateNote, setInfoContent, setInfoTitle, setNotes, setInfo, notes } = useAppContext();
    const { isDarkMode } = useThemeContext();

    // State for edit modes and UI elements
    const initialMode = mode;
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isNestedMode, setIsNestedMode] = useState(false);
    const [isNoteReminderMenuOpen, setIsNoteReminderMenu] = useState(false);
    const [isNoteOptionsMenuOpen, setIsNoteOptionsMenu] = useState(false);
    const [isInfoScroll, setIsInfoScroll] = useState(false);
    const [wasNestedEdited, setWasNestedEdited] = useState(false);

    const [showDialog, setShowDialog] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);

    // State for managing content arrays
    const [contentArray, setContentArray] = useState([note.content]);
    const [nestedContentArray, setNestedContentArray] = useState(['']);

    // State for nested note management
    const [nestedContent, setNestedContent] = useState('');
    const [nestedNote, setNestedNote] = useState({ title: '', content: '' });
    const [nestedTitle, setNestedTitle] = useState('');

    // State for note properties
    const isArchived = note.isArchived;
    const isPinned = note.isPinned;
    const isTrash = note.isTrash;
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [nestedNotes, setNestedNotes] = useState(note.nestedNotes);
    const [prevNestedNotes, setPrevNestedNotes] = useState([]);

    // Refs for DOM elements and indexes
    const index = useRef(0);
    const nestedIndex = useRef(0);
    // const dialogRef = useRef(null);
    const noteCreateRef = useRef(null);
    const noteEditRef = useRef(null);
    const noteReminderMenuRef = useRef(null);
    const noteOptionsMenuRef = useRef(null);
    const noteOptionsMenuRefButton = useRef(null);
    const infoContainerRef = useRef(null);

    const isUndoNote = prevNestedNotes.length > 0;

    const toggleArchive = () => {
        if (isArchived) {
            setInfo('Note unarchived')
        } else {
            setInfo('Note archived')
        }

        const updatedNote = {
            content: content,
            createdAt: note.createdAt,
            isArchived: !isArchived,
            isPinned: isPinned,
            nestedNotes: nestedNotes,
            title: title,
            id: note.id,
        };

        setNotes(notes.map(note =>
            note.id === updatedNote.id ? { ...note, isArchived: !note.isArchived } : note
        ));
        if (user) {
            updateNote(updatedNote);
            console.log("Note Archived");
        }
    };

    const toggleEditModeTrue = () => {
        if (isTrash) {
            setInfoGeneral('Cannot edit note in trash');
        } else if (mode === 'read') {
            setIsEditMode(true);
            setIsViewMode(true);

        } else {
            setIsEditMode(true);
        }
        console.log(note);
    }

    const toggleDelete = () => {
        if (initialMode === 'create') {
            handleResetNote();
            setInfo('Note deleted');
        } else {
            if (isTrash) {
                setInfo('Note restored from trash');
            } else {
                setInfo('Note moved to trash');
            }
            const updatedNotes = notes.map(existingNote =>
                existingNote.id === note.id ? { ...existingNote, isTrash: !existingNote.isTrash } : existingNote
            );
            setNotes(updatedNotes);
            const updatedNote = updatedNotes.find(note => note.id === note.id);
            if (user) {
                updateNote(note.id, { isTrash: updatedNote.isTrash });
            }
        }
        setIsNoteOptionsMenu(false);
    };

    const compareNestedNotesDifferent = (notes1, notes2) => {
        if (notes1.length !== notes2.length) return true;
        for (let i = 0; i < notes1.length; i++) {
            if (notes1[i].title !== notes2[i].title || notes1[i].content !== notes2[i].content) {
                return true;
            }
        }
        return false;
    }

    const handleTitleChange = (event) => {
        if (isTrash) {
            return;
        }
        const newValue = event.target.value;
        if (newValue.length <= 1000) {
            if (newValue.length > 900) {
                setInfoTitle(1000 - newValue.length + ' characters remaining.');
            } else {
                setInfoTitle('');
            }
            if (isNestedMode) {
                setNestedTitle(newValue);
            } else {
                setTitle(newValue);
            }
        }
    };

    const handleContentChange = (event) => {
        if (isTrash) {
            return;
        }
        const newValue = event.target.value;

        if (newValue.length <= 5000) {
            if (newValue.length > 4500) {
                setInfoContent(5000 - newValue.length + ' characters remaining.');
            } else {
                setInfoContent('');
            }
            if (isNestedMode) {
                setNestedContent(newValue);
                nestedIndex.current = nestedIndex.current + 1;
                setNestedContentArray(
                    [...nestedContentArray.slice(0, nestedIndex.current), newValue]
                );
            } else {
                setContent(newValue);
                index.current = index.current + 1;
                setContentArray(
                    [...contentArray.slice(0, index.current), newValue]
                );
            }
        }
    };

    const handleResetNote = useCallback(() => {
        if (initialMode === "create") {
            setContent('');
            setTitle('');
            setNestedContent('');
            setNestedTitle('');
            setNestedNotes([]);
        }
        setIsInfoScroll(false);
        setIsViewMode(false);
        setContentArray([content]);
        setNestedContentArray([nestedContent]);
        setIsNestedMode(false);
        setIsEditMode(false);
        index.current = 0;
        nestedIndex.current = 0;
    }, [initialMode, content, nestedContent],);

    const pushToNestedNote = (note) => {
        console.log(note.id);
        setNestedNote(note);
        setNestedTitle(note.title);
        setNestedContent(note.content);
        setIsNestedMode(true);
        setWasNestedEdited(true);
    }

    const createNewNestedNote = useCallback(() => ({
        title: nestedTitle.trim(),
        content: nestedContent.trim(),
    }), [nestedTitle, nestedContent]);

    const hasNoteContentChanged = useCallback((newNote, existingNote) =>
        newNote.title !== existingNote.title || newNote.content !== existingNote.content
        , []);

    const updateNestedNote = useCallback((newNote) => {
        const updatedNestedNotes = nestedNotes.map((note) =>
            note.id === nestedNote.id ? { ...note, ...newNote } : note
        );
        setWasNestedEdited(false);
        return updatedNestedNotes;
    }, [nestedNotes, nestedNote]);

    const addNestedNote = useCallback((newNestedNote) => {
        newNestedNote.createdAt = Date.now();
        return [...nestedNotes, newNestedNote];
    }, [nestedNotes]);

    const resetNestedNoteForm = useCallback(() => {
        setNestedTitle('');
        setNestedContent('');
        setNestedContentArray(['']);
        setIsNestedMode(false);
        nestedIndex.current = 0;
    }, []);

    const handleNestedNote = useCallback(() => {
        const newNestedNote = createNewNestedNote();

        let updatedNestedNotes;
        if (hasNoteContentChanged(newNestedNote, nestedNote)) {
            if (wasNestedEdited) {
                updatedNestedNotes = updateNestedNote(newNestedNote);
            } else {
                updatedNestedNotes = addNestedNote(newNestedNote);
            }
        } else {
            console.log("Not Adding Nested Note");
            updatedNestedNotes = nestedNotes;
        }

        resetNestedNoteForm();
        setNestedNotes(updatedNestedNotes);

        return updatedNestedNotes;
    }, [createNewNestedNote, hasNoteContentChanged, updateNestedNote, addNestedNote, resetNestedNoteForm, nestedNotes, nestedNote, wasNestedEdited]);

    const handleUndo = (event) => {
        event.preventDefault();
        if (isNestedMode) {
            if (nestedIndex.current > 0) {
                nestedIndex.current = nestedIndex.current - 1;
                setNestedContent(nestedContentArray[nestedIndex.current]);
            }
        } else {
            if (index.current > 0) {
                index.current = index.current - 1;
                setContent(contentArray[index.current]);
            }
        }
    };

    const handleRedo = (event) => {
        event.preventDefault();
        if (isNestedMode) {
            if (nestedIndex.current < nestedContentArray.length - 1) {
                nestedIndex.current = nestedIndex.current + 1;
                setNestedContent(nestedContentArray[nestedIndex.current]);
            }
        } else {
            if (index.current < contentArray.length - 1) {
                index.current = index.current + 1;
                setContent(contentArray[index.current]);
            }
        }
    };

    const handleDeleteNote = async() => {
        // setActionToConfirm('deleteNote');
        // setShowDialog(true);
        try {
            await deleteNote(note.id);
            setInfo('Note deleted');
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteNestedNote = () => {
        // setActionToConfirm('deleteNestedNote');
        // setShowDialog(true);
        resetNestedNoteForm();
        setPrevNestedNotes(nestedNotes);
        const updatedNestedNotes = nestedNotes.filter(note => note.createdAt !== nestedNote.createdAt);
        setNestedNotes(updatedNestedNotes);
        setIsNestedMode(false);
        setInfo('Nested Note Deleted');
    };

    const handleUndoDeletedNestedNote = () => {
        setNestedNotes(prevNestedNotes);
        setInfo('Deleted Nested Note Restored');
        setPrevNestedNotes([]);
    }


    const handleNote = useCallback(() => {
        if (isTrash) {
            // handleResetNote();
            return;
        }
        let newNestedNotes = nestedNotes;

        console.log("Is Nested Mode? " + isNestedMode);

        if (isNestedMode) {
            newNestedNotes = handleNestedNote();
        }

        const currrentNote = {
            content: content,
            createdAt: note.createdAt,
            isArchived: isArchived,
            isPinned: isPinned,
            nestedNotes: newNestedNotes,
            title: title,
            id: note.id,
        };

        const prevNote = note;

        if (initialMode === 'create') {
            if (currrentNote.title !== prevNote.title || currrentNote.content !== prevNote.content || currrentNote.nestedNotes.length > 0) {
                createNote(currrentNote);
            } else {
                console.log("No Note Created");
            }
        } else {
            let nestedNotesChanged = compareNestedNotesDifferent(newNestedNotes, prevNote.nestedNotes);

            if (currrentNote.title.trim().length === 0 && currrentNote.content.trim().length === 0 && currrentNote.nestedNotes.length === 0) {
                deleteNote(note.id);
                console.log("Deleted Note");
            } else {
                if (currrentNote.title !== prevNote.title || currrentNote.content !== prevNote.content || nestedNotesChanged || currrentNote.isArchived !== prevNote.isArchived) {
                    updateNote(currrentNote);
                    console.log("Updated Note");
                } else {
                    console.log("No Note Updated");
                }
            }
        }

        handleResetNote();
    }, [isTrash, nestedNotes, isNestedMode, title, content, isArchived, isPinned, note, initialMode, handleResetNote, handleNestedNote, createNote, deleteNote, updateNote]);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleNote();
    };

    const handleClickOutside = useCallback((event) => {
        event.stopPropagation();
        if (isNoteOptionsMenuOpen && noteOptionsMenuRef.current && !noteOptionsMenuRef.current.contains(event.target) &&
            !noteOptionsMenuRefButton.current.contains(event.target)) {

            setIsNoteOptionsMenu(false);
        }

        if (isEditMode || isTrash) {
            if (initialMode === 'create' && noteCreateRef.current && !noteCreateRef.current.contains(event.target)) {
                handleNote();
            } else if (noteEditRef.current && !noteEditRef.current.contains(event.target)) {
                handleNote();
            }
        }
    }, [isNoteOptionsMenuOpen, isEditMode, isTrash, initialMode, handleNote]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        const handleScroll = () => {
            if (infoContainerRef.current) {
                if (infoContainerRef.current.scrollTop > 0) {
                    setIsInfoScroll(true);
                } else {
                    setIsInfoScroll(false);
                }
            }

        };

        const container = infoContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isViewMode]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflowY;
        document.body.style.overflowY = isViewMode ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflowY = previousOverflow;
        };
    }, [isViewMode]);

    return (
        <div className={!isViewMode ? styles.container : styles.containerModal}>
            <form
                id={isDarkMode ? "NoteGUIDark" : "NoteGUI"}
                className={!isViewMode ? (initialMode === 'create' ? styles.noteCreate : styles.noteRead) : styles.noteEdit}
                onSubmit={handleSubmit} ref={initialMode === 'create' ? noteCreateRef : noteEditRef}>
                <div
                    className={(initialMode === 'read' && !isViewMode) ? styles.infoContainerRead : styles.infoContainer}
                    ref={infoContainerRef}
                >
                    <NoteHeader
                        handleTitleChange={handleTitleChange}
                        initialMode={initialMode}
                        isEditMode={isEditMode}
                        isDarkMode={isDarkMode}
                        isNestedMode={isNestedMode}
                        isViewMode={isViewMode}
                        nestedTitle={nestedTitle}
                        setIsEditMode={setIsEditMode}
                        title={title}
                        toggleEditModeTrue={toggleEditModeTrue}
                    />
                    <NoteBody
                        content={content}
                        handleContentChange={handleContentChange}
                        initialMode={initialMode} 
                        isEditMode={isEditMode}
                        isDarkMode={isDarkMode}
                        isNestedMode={isNestedMode}
                        isViewMode={isViewMode}
                        nestedContent={nestedContent}
                        toggleEditModeTrue={toggleEditModeTrue}
                    />
                </div>
                <NoteNestedNotes
                    isNestedMode={isNestedMode}
                    nestedNotes={nestedNotes}
                    pushToNestedNote={pushToNestedNote}
                    toggleEditModeTrue={toggleEditModeTrue}
                />
                <NoteFooter
                    contentArray={contentArray}
                    handleNestedNote={handleNestedNote}
                    handleUndoDeletedNestedNote={handleUndoDeletedNestedNote}
                    handleRedo={handleRedo}
                    handleUndo={handleUndo}
                    initialMode={initialMode}
                    isArchived={isArchived}
                    isEditMode={isEditMode}
                    isInfoScroll={isInfoScroll}
                    isNestedMode={isNestedMode}
                    isNoteOptionsMenuOpen={isNoteOptionsMenuOpen}
                    isNoteReminderMenuOpen={isNoteReminderMenuOpen}
                    isTrash={isTrash}
                    isUndoNote={isUndoNote}
                    mode={mode}
                    nestedContentArray={nestedContentArray}
                    noteOptionsMenuRef={noteOptionsMenuRef}
                    noteOptionsMenuRefButton={noteOptionsMenuRefButton}
                    noteReminderMenuRef={noteReminderMenuRef}
                    nestedIndex={nestedIndex}
                    index={index}
                    setIsNestedMode={setIsNestedMode}
                    setIsNoteOptionsMenu={setIsNoteOptionsMenu}
                    toggleArchive={toggleArchive}
                    toggleDelete={toggleDelete}
                    handleDeleteNote={handleDeleteNote}
                    handleDeleteNestedNote={handleDeleteNestedNote}
                />
            </form >
        </div>
    );
}