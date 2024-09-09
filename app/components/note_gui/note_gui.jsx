'use client';

import { AlarmOutlined, MoreVert, Archive, ArchiveOutlined, Bolt, Brush, ChevronLeft, ImageOutlined, NoteAddOutlined, NoteOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined, DeleteForever, DeleteForeverOutlined, RestoreOutlined, RestoreFromTrashOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField, MenuItem } from '@mui/material';
import styles from "./note.module.css"
import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../context/app_provider';

import NoteFormContent from './note_form_content';
import NoteFormTitle from './note_form_title';
import NoteFormFooter from './note_form_footer';
import NoteFormNestedNotes from './note_form_nested_notes';

export default function NoteGUI(props) {
    // State for edit modes and UI elements
    const initialMode = props.mode;
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isNestedEdit, setIsNestedEdit] = useState(false);
    const [isNestedMode, setIsNestedMode] = useState(false);
    const [isNoteReminderMenuOpen, setIsNoteReminderMenu] = useState(false);
    const [isNoteOptionsMenuOpen, setIsNoteOptionsMenu] = useState(false);
    const [isInfoScroll, setIsInfoScroll] = useState(false);

    // State for managing content arrays
    const [contentArray, setContentArray] = useState([props.note.content]);
    const [nestedContentArray, setNestedContentArray] = useState(['']);

    // State for nested note management
    const [nestedContent, setNestedContent] = useState('');
    const [nestedNote, setNestedNote] = useState({ title: '', content: '' });
    const [nestedTitle, setNestedTitle] = useState('');

    // State for note properties
    const isArchived = props.note.isArchived;
    const isPinned = props.note.isPinned;
    const isTrash = props.note.isTrash;
    const [title, setTitle] = useState(props.note.title);
    const [content, setContent] = useState(props.note.content);
    const [nestedNotes, setNestedNotes] = useState(props.note.nestedNotes);

    // Context for application-wide state and actions
    const { createNote, deleteNote, updateNote, setInfoContent, setInfoTitle, setNotes, setInfoGeneral, notes } = useContext(AppContext);

    // Refs for DOM elements and indexes
    const index = useRef(0);
    const nestedIndex = useRef(0);
    const noteCreateRef = useRef(null);
    const noteEditRef = useRef(null);
    const noteReminderMenuRef = useRef(null);
    const noteOptionsMenuRef = useRef(null);
    const noteOptionsMenuRefButton = useRef(null);
    const infoContainerRef = useRef(null);

    const toggleArchive = () => {
        if (isArchived) {
            setInfoGeneral('Note unarchived')
        } else {
            setInfoGeneral('Note archived')
        }
        setNotes(notes.map(note =>
            note.id === props.note.id ? { ...note, isArchived: !note.isArchived } : note
        ));
    };

    const toggleEditModeTrue = () => {
        if (isTrash) {
            setInfoGeneral('Cannot edit note in trash');
        } else if (props.mode === 'read') {
            setIsEditMode(true);
            setIsViewMode(true)
        } else {
            setIsEditMode(true);
        }
    }

    const toggleDelete = () => {
        if (initialMode === 'create') {
            handleResetNote();
            setInfoGeneral('Note deleted');
        } else {

            if (isTrash) {
                setInfoGeneral('Note restored from trash')
            } else {
                setInfoGeneral('Note moved to trash')
            }

            setNotes(notes.map(note =>
                note.id === props.note.id ? { ...note, isTrash: !note.isTrash } : note
            ));
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
            setInfoContent('');
            setInfoTitle('');
            setNestedContent('');
            setNestedTitle('');
            setNestedNotes([]);
        }

        setIsViewMode(false);
        setContentArray([content]);
        setNestedContentArray([nestedContent]);
        setIsNestedMode(false);
        setIsEditMode(false);
        index.current = 0;
        nestedIndex.current = 0;
    }, [initialMode, content, nestedContent, setInfoContent, setInfoTitle]);

    const pushToNestedNote = (note) => {
        console.log(note.id);
        setNestedNote(note);
        setNestedTitle(note.title);
        setNestedContent(note.content);
        setIsNestedMode(true);
        setIsNestedEdit(true);
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
        setIsNestedEdit(false);
        return updatedNestedNotes;
    }, [nestedNotes, nestedNote]);

    const addNestedNote = useCallback((newNote) => {
        newNote.id = Date.now();
        return [...nestedNotes, newNote];
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
            if (isNestedEdit) {
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
    }, [createNewNestedNote, hasNoteContentChanged, updateNestedNote, addNestedNote, resetNestedNoteForm, nestedNotes, nestedNote, isNestedEdit]);

    const handleMode = () => {
        if (isTrash) {
            setIsViewMode(true);
        } else if (initialMode === 'read') {
            setIsEditMode(true);
            setIsViewMode(true);
        }
    }

    const handleUndo = () => {
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

    const handleRedo = () => {
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

    const handleNote = useCallback(() => {

        if (isTrash) {
            handleResetNote();
            return;
        }

        let newNestedNotes = nestedNotes;

        console.log(isNestedMode);
        if (isNestedMode) {
            newNestedNotes = handleNestedNote();
        }

        const note = {
            title: title,
            content: content,
            isArchived: isArchived,
            isPinned: isPinned,
            nestedNotes: newNestedNotes
        };

        const prevNote = props.note;

        if (initialMode === 'create') {
            if (note.title !== prevNote.title || note.content !== prevNote.content || note.nestedNotes.length > 0) {
                createNote(note);
                console.log("Created Note");
            } else {
                console.log("No Note Created");
            }
        } else {
            let nestedNotesChanged = compareNestedNotesDifferent(newNestedNotes, prevNote.nestedNotes);

            if (note.title.trim().length === 0 && note.content.trim().length === 0 && note.nestedNotes.length === 0) {
                deleteNote(props.note.id);
                console.log("Deleted Note");
            } else {
                if (note.title !== prevNote.title || note.content !== prevNote.content || nestedNotesChanged || note.isArchived !== prevNote.isArchived) {
                    updateNote(note);
                    console.log("Updated Note");
                } else {
                    console.log("No Note Updated");
                }
            }
        }

        handleResetNote();
    }, [isTrash, nestedNotes, isNestedMode, title, content, isArchived, isPinned, props.note, initialMode, handleResetNote, handleNestedNote, createNote, deleteNote, updateNote]);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleNote();
    };

    const handleClickOutside = useCallback((event) => {
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

    const noteForm = () => {
        return (
            <Box component="form"
                className={isViewMode ? styles.centeredNote : styles.note}
                style={{
                    boxShadow: props.mode === 'create' ? '0 4px 8px rgba(0.4, 0.4, 0.4, 0.4)' : ''
                }}
                onSubmit={handleSubmit} ref={initialMode === 'create' ? noteCreateRef : noteEditRef}>
                <div
                    className={(initialMode === 'read' && !isViewMode) ? styles.infoContainerRead : styles.infoContainer}
                    ref={infoContainerRef}
                >
                    <NoteFormTitle
                        handleTitleChange={handleTitleChange}
                        initialMode={initialMode}
                        isEditMode={isEditMode}
                        isNestedMode={isNestedMode}
                        isViewMode={isViewMode}
                        nestedTitle={nestedTitle}
                        setIsEditMode={setIsEditMode}
                        title={title}
                        toggleEditModeTrue={toggleEditModeTrue}
                    />
                    <NoteFormContent
                        content={content}
                        handleContentChange={handleContentChange}
                        initialMode={initialMode}  // Fixed the formatting here
                        isEditMode={isEditMode}
                        isNestedMode={isNestedMode}
                        isViewMode={isViewMode}
                        nestedContent={nestedContent}
                        toggleEditModeTrue={toggleEditModeTrue}
                    />
                </div>
                <NoteFormNestedNotes
                    isNestedMode={isNestedMode}
                    nestedNotes={nestedNotes}
                    pushToNestedNote={pushToNestedNote}
                    setIsEditMode={setIsEditMode}
                />
                <NoteFormFooter
                    contentArray={contentArray}
                    handleNestedNote={handleNestedNote}
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
                    mode={props.mode}
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
                />
            </Box >
        );
    }

    return (
        <>
            {isViewMode ? (
                <div className={styles.noteModal}>
                    {noteForm()}
                </div>)
                :
                (noteForm())
            }
        </>
    );
}



// {
//     isTrash && (
//         <div className={isInfoScroll ? styles.footerWrapperShadow : styles.footerWrapper}>
//             <div className={styles.footerContainer}>
//                 <div>
//                     <IconButton
//                         aria-label="Delete forever"
//                     >
//                         <DeleteForeverOutlined />
//                     </IconButton>
//                     <IconButton
//                         aria-label="Restore from trash"
//                     >
//                         <RestoreFromTrashOutlined />
//                     </IconButton>
//                 </div>
//             </div>
//         </div>
//     )
// }

// {
//     ((isEditMode && !isTrash) || (mode === 'read' && !isTrash)) && (
//         <div className={isInfoScroll ? styles.footerWrapperShadow : styles.footerWrapper}>
//             <div className={styles.footerContainer}>
//                 <div>

//                     {
//                         isEditMode && (
//                             <>
//                                 {
//                                     isNestedMode ? (
//                                         <IconButton
//                                             aria-label="Add Note"
//                                             onClick={() => handleNestedNote()}
//                                         >
//                                             <ChevronLeft />
//                                         </IconButton>
//                                     ) : (
//                                         <IconButton
//                                             aria-label="Set Nested Mode"
//                                             onClick={() => setIsNestedMode(true)}
//                                         >
//                                             <NoteAddOutlined />
//                                         </IconButton>
//                                     )
//                                 }
//                             </>

//                         )}


//                     {/* <IconButton aria-label="Add Reminder">
//                                     <AlarmOutlined />
//                                 </IconButton> */}
//                     <IconButton
//                         ref={noteOptionsMenuRefButton}
//                         className={styles.noteOptionsMenuButton}
//                         onClick={() => setIsNoteOptionsMenu(!isNoteOptionsMenuOpen)}
//                     >
//                         <MoreVert />
//                     </IconButton>
//                     {
//                         initialMode !== 'create' && (
//                             <IconButton aria-label="Archive" onClick={() => toggleArchive(note.id)}>
//                                 {
//                                     isArchived ? (
//                                         <Archive />
//                                     ) : (
//                                         <ArchiveOutlined />
//                                     )
//                                 }
//                             </IconButton>
//                         )
//                     }
//                     {/* 
//                             <IconButton aria-label="Background Color">
//                                 <Brush />
//                             </IconButton>
//                             <IconButton aria-label="Add Image">
//                                 <ImageOutlined />
//                             </IconButton> */}
//                     {
//                         isEditMode && (
//                             <>
//                                 {
//                                     isNestedMode ? (
//                                         <>
//                                             <IconButton aria-label="Undo" onClick={handleUndo} disabled={nestedIndex.current === 0}>
//                                                 <UndoOutlined />
//                                             </IconButton>
//                                             <IconButton aria-label="Redo" onClick={handleRedo} disabled={nestedIndex.current === nestedContentArray.length - 1}>
//                                                 <RedoOutlined />
//                                             </IconButton>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <IconButton aria-label="Undo" onClick={handleUndo} disabled={index.current === 0}>
//                                                 <UndoOutlined />
//                                             </IconButton>
//                                             <IconButton aria-label="Redo" onClick={handleRedo} disabled={index.current === contentArray.length - 1}>
//                                                 <RedoOutlined />
//                                             </IconButton>
//                                         </>
//                                     )
//                                 }
//                             </>
//                         )
//                     }
//                 </div>
//                 {
//                     isEditMode && (
//                         <Button type="submit">
//                             Close
//                         </Button>
//                     )
//                 }

//                 <>
//                     {
//                         isNoteReminderMenuOpen && (
//                             <div
//                                 className={styles.noteReminderMenu}
//                                 ref={noteReminderMenuRef}
//                             >
//                                 <MenuItem>Later Today</MenuItem>
//                                 <MenuItem>Tommorrow</MenuItem>
//                                 <MenuItem>Next Week</MenuItem>
//                             </div>
//                         )
//                     }
//                 </>
//                 <>
//                     {
//                         isNoteOptionsMenuOpen && (
//                             <div
//                                 className={styles.noteOptionsMenu}
//                                 ref={noteOptionsMenuRef}
//                             >
//                                 <MenuItem onClick={toggleDelete}>Delete Note</MenuItem>
//                             </div>
//                         )
//                     }
//                 </>
//             </div>
//         </div>
//     )
// }