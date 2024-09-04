'use client';

import { AlarmOutlined, MoreVert, Archive, ArchiveOutlined, Bolt, Brush, ChevronLeft, ImageOutlined, NoteAddOutlined, NoteOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField, MenuItem } from '@mui/material';
import styles from "./note.module.css";
import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/app_provider';
import CustomTooltip from './custom_tooltip';

export default function NoteGUI(props) {
    // State for edit modes and UI elements
    const initialMode = props.mode;
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isNestedEdit, setIsNestedEdit] = useState(false);
    const [isNestedMode, setIsNestedMode] = useState(false);
    const [isNoteMenuOpen, setIsNoteMenu] = useState(false);
    const [isInfoScroll, setIsInfoScroll] = useState(false);

    // State for managing content arrays
    const [contentArray, setContentArray] = useState([props.note.content]);
    const [nestedContentArray, setNestedContentArray] = useState(['']);

    // State for nested note management
    const [nestedContent, setNestedContent] = useState('');
    const [nestedNote, setNestedNote] = useState({ title: '', content: '' });
    const [nestedTitle, setNestedTitle] = useState('');

    // State for note properties
    const [isArchived, setIsArchived] = useState(props.note.isArchived);
    const [isPinned, setIsPinned] = useState(props.note.isPinned);
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
    const noteModalRef = useRef(null);
    const noteMenuRef = useRef(null);
    const noteMenuRefButton = useRef(null);
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

    const handleDeleteNote = () => {
        if (initialMode === 'create') {
            setIsNoteMenu(false);
            handleResetNote();
        } else {
            setIsNoteMenu(false);
            deleteNote(props.note.id)
        }
    }

    const handleContentChange = (event) => {
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
        if (initialMode === "create" || initialMode === "update") {
            setContent('');
            setTitle('');
            setInfoContent('');
            setInfoTitle('');
            setNestedContent('');
            setNestedTitle('');
            setNestedNotes([]);
            setIsPinned(false);
            setIsArchived(false);
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
        if (initialMode === 'read') {
            setIsEditMode(true);
            setIsViewMode(true);
        }
    }

    const handleNote = useCallback(() => {
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
    }, [nestedNotes, isNestedMode, title, content, isArchived, isPinned, initialMode, props.note, handleNestedNote, createNote, deleteNote, updateNote, handleResetNote]);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        handleNote();
    };

    const isDeleteEnabled = () => {
        return title.length > 0 || content.length > 0 || nestedTitle.length > 0 || nestedContent.length > 0 || nestedNotes.length > 0;
    }

    const handleClickOutside = useCallback((event) => {
        if (isNoteMenuOpen && noteMenuRef.current && !noteMenuRef.current.contains(event.target) &&
            !noteMenuRefButton.current.contains(event.target)) {
            setIsNoteMenu(false);
        }

        if (isEditMode) {
            if (initialMode === 'create' && noteCreateRef.current && !noteCreateRef.current.contains(event.target)) {
                handleNote();
            } else if (noteEditRef.current && !noteEditRef.current.contains(event.target)) {
                handleNote();
            }
        }
    }, [isNoteMenuOpen, isEditMode, initialMode, handleNote]);

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

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (infoContainerRef.current) {
    //             const { scrollTop, scrollHeight, clientHeight } = infoContainerRef.current;
    //             setShowShadow(scrollTop + clientHeight < scrollHeight);
    //         }
    //     };

    //     const infoContainer = infoContainerRef.current;

    //     if (infoContainer) {
    //         infoContainer.addEventListener('scroll', handleScroll);
    //         handleScroll();
    //     }

    //     return () => {
    //         if (infoContainer) {
    //             infoContainer.removeEventListener('scroll', handleScroll);
    //         }
    //     };
    // }, [showShadow]);


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
                // style={{
                //     boxShadow: props.mode === 'create' ? '0 4px 8px rgba(0, 0, 0, 0.1)' : ''
                // }}
                onSubmit={handleSubmit} ref={initialMode === 'create' ? noteCreateRef : noteEditRef} onClick={isViewMode ? null : handleMode}>
                <div
                    className={(initialMode === 'read' && !isViewMode) ? styles.infoContainerRead : styles.infoContainer}
                    ref={infoContainerRef}
                >
                    {(isEditMode || title.length > 0) && (
                        <div className={styles.titleContainer}>
                            <TextField
                                inputProps={{
                                    style: { fontSize: 20 },
                                    readOnly: initialMode === 'read' && !isViewMode,
                                    autoComplete: 'off',
                                }}
                                className={styles.contentTextField}
                                placeholder={isNestedMode ? 'Nested - Title...' : 'Title...'}
                                multiline={true}
                                value={isNestedMode ? nestedTitle : title}
                                onFocus={((initialMode === 'read' && !isViewMode) || isNestedMode) ? null : () => setIsEditMode(true)}
                                onChange={handleTitleChange}
                                onClick={initialMode === 'read' && !isViewMode ? () => setIsEditMode(true) : null}
                                sx={{
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { border: 'none' },
                                        '&:hover fieldset': { border: 'none' },
                                        '&.Mui-focused fieldset': { border: 'none' },
                                    },
                                }}
                            />
                            {/* {
                                (initialMode === 'read' && !isViewMode) ? (
                                    <TextField
                                        inputProps={{
                                            style: { fontSize: 20 },
                                            readOnly: true
                                        }}
                                        className={styles.titleTextField}
                                        placeholder={'Title'}
                                        multiline={true}
                                        value={title}
                                        onClick={() => setIsEditMode(true)}
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { border: 'none' },
                                                '&:hover fieldset': { border: 'none' },
                                                '&.Mui-focused fieldset': { border: 'none' },
                                            },
                                        }}
                                    />
                                ) : (
                                    <TextField
                                        inputProps={{
                                            autoComplete: 'off',
                                            style: { fontSize: 20 }
                                        }}
                                        className={styles.titleTextField}
                                        placeholder={isNestedMode ? 'Nested - Title' : 'Title'}
                                        multiline={true}
                                        name='textField'
                                        value={isNestedMode ? nestedTitle : title}
                                        onFocus={isNestedMode ? null : () => setIsEditMode(true)}
                                        onChange={handleTitleChange}
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { border: 'none' },
                                                '&:hover fieldset': { border: 'none' },
                                                '&.Mui-focused fieldset': { border: 'none' },
                                            },
                                        }}
                                    />
                                )
                            } */}
                        </div>
                    )}
                    {
                        (
                            (initialMode === "create" || content.length > 0 || isEditMode) && (
                                <div className={styles.contentContainer}>
                                    {
                                        (initialMode === 'read' && !isViewMode) ? (
                                            <TextField
                                                inputProps={{
                                                    style: { fontSize: 16 },
                                                    readOnly: true
                                                }}
                                                className={styles.contentTextField}
                                                placeholder={'Take a note...'}
                                                multiline={true}
                                                value={content}
                                                onClick={() => setIsEditMode(true)}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { border: 'none' },
                                                        '&:hover fieldset': { border: 'none' },
                                                        '&.Mui-focused fieldset': { border: 'none' },
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <TextField
                                                inputProps={{
                                                    autoComplete: 'off',
                                                    style: { fontSize: 16 }
                                                }}
                                                className={styles.contentTextField}
                                                placeholder={isNestedMode ? 'Nested - Take a note...' : 'Take a note...'}
                                                multiline={true}
                                                value={isNestedMode ? nestedContent : content}
                                                onFocus={isNestedMode ? null : () => setIsEditMode(true)}
                                                onChange={handleContentChange}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { border: 'none' },
                                                        '&:hover fieldset': { border: 'none' },
                                                        '&.Mui-focused fieldset': { border: 'none' },
                                                    },
                                                }}
                                            />
                                        )
                                    }
                                </div>
                            )
                        )
                    }
                </div>
                {
                    nestedNotes.length > 0 && !isNestedMode && (
                        <div className={styles.nestedNotesWrapper} onClick={() => setIsEditMode(true)}>
                            <div className={styles.nestedNotesContainer}>
                                {nestedNotes.map((note, index) => (
                                    <CustomTooltip key={index} title={note.title.substring(0, 6)}>
                                        <IconButton onClick={() =>
                                            pushToNestedNote(note)
                                        }>
                                            <NoteOutlined />
                                        </IconButton>
                                    </CustomTooltip>
                                ))}
                            </div>
                        </div>
                    )
                }
                {isEditMode && (
                    <div className={isInfoScroll ? styles.footerWrapperShadow : styles.footerWrapper}>
                        <div className={styles.footerContainer}>
                            <div>
                                {
                                    isNestedMode ? (
                                        <IconButton aria-label="Add Note" onClick={handleNestedNote} style={{
                                        }}>
                                            <ChevronLeft />
                                        </IconButton>
                                    ) : (
                                        <IconButton aria-label="Set Nested Mode" onClick={() => { setIsNestedMode(true) }} style={{
                                        }}>
                                            <NoteAddOutlined />
                                        </IconButton>
                                    )
                                }
                                <IconButton aria-label="Add Reminder">
                                    <AlarmOutlined />
                                </IconButton>
                                <>
                                    <IconButton
                                        style={{
                                            position: 'relative'
                                        }}
                                        ref={noteMenuRefButton}
                                        onClick={() => setIsNoteMenu(!isNoteMenuOpen)}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                    {
                                        isNoteMenuOpen && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    marginLeft: '5rem',
                                                    width: 'fit-content',
                                                    backgroundColor: '#fbfdfb',
                                                    zIndex: '100',
                                                }}
                                                ref={noteMenuRef}
                                            >
                                                <MenuItem>Add Label</MenuItem>
                                                {
                                                    isDeleteEnabled() && (
                                                        <MenuItem onClick={handleDeleteNote}>Delete Note</MenuItem>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </>
                                {
                                    initialMode !== 'create' && (
                                        <IconButton aria-label="Archive" onClick={() => toggleArchive(props.note.id)}>
                                            {
                                                isArchived ? (
                                                    <Archive />
                                                ) : (
                                                    <ArchiveOutlined />
                                                )
                                            }
                                        </IconButton>
                                    )
                                }
                                {/* 
                            <IconButton aria-label="Background Color">
                                <Brush />
                            </IconButton>
          
                            <IconButton aria-label="Add Image">
                                <ImageOutlined />
                            </IconButton> */}
                                {
                                    isNestedMode ? (
                                        <>
                                            <IconButton aria-label="Undo" onClick={handleUndo} disabled={nestedIndex.current === 0}>
                                                <UndoOutlined />
                                            </IconButton>
                                            <IconButton aria-label="Redo" onClick={handleRedo} disabled={nestedIndex.current === nestedContentArray.length - 1}>
                                                <RedoOutlined />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton aria-label="Undo" onClick={handleUndo} disabled={index.current === 0}>
                                                <UndoOutlined />
                                            </IconButton>
                                            <IconButton aria-label="Redo" onClick={handleRedo} disabled={index.current === contentArray.length - 1}>
                                                <RedoOutlined />
                                            </IconButton>
                                        </>
                                    )
                                }
                            </div>
                            <Button type="submit">
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Box >
        );
    }

    return (
        <>
            {
                isViewMode ?
                    (
                        <div
                            className={styles.noteModal}
                        >
                            {noteForm()}
                        </div>

                    ) :
                    (
                        noteForm()
                    )
            }
        </>
    );
}