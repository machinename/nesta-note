'use client';
import { AlarmOutlined, ArchiveOutlined, Bolt, Brush, ChevronLeft, ImageOutlined, NoteAddOutlined, NoteOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField, Tooltip } from '@mui/material';
import styles from "./note.module.css";
import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/app_provider';
import CustomTooltip from './custom_tooltip';

export default function NoteGUI(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isNestedMode, setIsNestedMode] = useState(false);
    const [isNestedEdit, setIsNestedEdit] = useState(false);
    const [showShadow, setShowShadow] = useState(false);

    const [isPinned, setIsPinned] = useState(props.note.isPinned);
    const [title, setTitle] = useState(props.note.title)
    const [content, setContent] = useState(props.note.content);
    const [nestedNotes, setNestedNotes] = useState(props.note.nestedNotes);

    const [contentArray, setContentArray] = useState([content]);

    const [nestedNote, setNestedNote] = useState({ title: '', content: '', });
    const [nestedTitle, setNestedTitle] = useState('');
    const [nestedContent, setNestedContent] = useState('');
    const [nestedContentArray, setNestedContentArray] = useState([nestedContent]);

    const { createNote, updateNote, setInfoContent, setInfoTitle, setInfoGeneral } = useContext(AppContext);

    const index = useRef(0);
    const nestedIndex = useRef(0);
    const noteCreateRef = useRef(null);
    const noteUpdateRef = useRef(null);
    const infoContainerRef = useRef(null);

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

    const handleResetNote = () => {
        if (props.mode === "create") {
            setContent('');
            setTitle('');
            setInfoContent('');
            setInfoTitle('');
            setNestedContent('');
            setNestedTitle('');
            setNestedNotes([]);
            setIsPinned(false);
        }

        setContentArray(['']);
        setNestedContentArray(['']);
        setIsNestedMode(false);
        setIsEditMode(false);
        index.current = 0;
        nestedIndex.current = 0;
    };

    const pushToNestedNote = (note) => {
        console.log(note.id);
        setNestedNote(note);
        setNestedTitle(note.title);
        setNestedContent(note.content);
        setIsNestedMode(true);
        setIsNestedEdit(true);
    }

    const handleNestedNote = () => {
        // Create a new note object with trimmed values
        const newNestedNote = {
            title: nestedTitle.trim(),
            content: nestedContent.trim(),
        };

        // Check if the note content has changed
        if (newNestedNote.title !== nestedNote.title || newNestedNote.content !== nestedNote.content) {
            if (isNestedEdit) {
                // Update the existing nested note
                const updatedNestedNotes = nestedNotes.map((note) =>
                    note.id === nestedNote.id ? { ...note, ...newNestedNote } : note
                );
                setNestedNotes(updatedNestedNotes);
                console.log('Updated Nested Note');
                setIsNestedEdit(false);
            } else {
                // Add a new nested note
                newNestedNote.id = Date.now(); // Ensure id is added only for new notes
                setNestedNotes([...nestedNotes, newNestedNote]);
                console.log('Adding Nested Note');
            }
        } else {
            console.log("Not Adding Nested Note");
        }

        // Reset the nested note form
        setNestedTitle('');
        setNestedContent('');
        setNestedContentArray(['']);

        setIsNestedMode(false);
        nestedIndex.current = 0;
    };


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

    const compareNestedNotesDifferent = (notes1, notes2) => {
        if (notes1.length !== notes2.length) return true;
        for (let i = 0; i < notes1.length; i++) {
            if (notes1[i].title !== notes2[i].title || notes1[i].content !== notes2[i].content) {
                return true;
            }
        }
        return false;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isNestedMode) {
            handleNestedNote();
        }

        let note = ({
            title: title.trim(),
            content: content.trim(),
            isPinned: isPinned,
            nestedNotes: nestedNotes
        })

        const userNote = props.note;


        if (props.mode === 'create') {
            if (title.trim() !== userNote.title || content.trim() !== userNote.content || nestedNotes.length > 0) {
                createNote(note);
                console.log("Created Note")
            } else {
                console.log("Nothing To Create")
            }
        } else {
            let nestedNotesChanged = compareNestedNotesDifferent(nestedNotes, userNote.nestedNotes);

            if (title.trim() !== userNote.title || content.trim() !== userNote.content || nestedNotesChanged) {
                updateNote(note);
                console.log("Created Note")
            } else {
                console.log("Nothing To Update")
            }
        }

        handleResetNote();
    };

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         const userNote = props.note;

    //         if (isEditMode && noteCreateRef.current && !noteCreateRef.current.contains(event.target)) {

    //             if () {

    //             }

    //             if (title.trim() !== userNote.title || content.trim() !== userNote.content || nestedNotes.length > 0) {
    //                 const note = ({
    //                     title: title.trim(),
    //                     content: content.trim(),
    //                     isPinned: isPinned,
    //                     nestedNotes: nestedNotes
    //                 })
    //                 createNote(note);
    //             } else {
    //                 console.log("Nothing To See Here")
    //             }
    //             setContent('');
    //             setTitle('');
    //             setInfoContent('');
    //             setInfoTitle('');
    //             setNestedContent('')
    //             setNestedTitle('')
    //             setNestedNotes([]);
    //             setContentArray(['']);
    //             setNestedContentArray(['']);
    //             setIsPinned(false);
    //             setIsNestedMode(false);
    //             setIsEditMode(false);
    //             index.current = 0;
    //             nestedIndex.current = 0;
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [content, createNote, updateNote, isEditMode, isPinned, nestedNotes, props.note, props.mode, setInfoContent, setInfoTitle, title]);

    useEffect(() => {
        const handleScroll = () => {
            if (infoContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = infoContainerRef.current;
                setShowShadow(scrollTop + clientHeight < scrollHeight);
            }
        };

        const infoContainer = infoContainerRef.current;

        if (infoContainer) {
            infoContainer.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (infoContainer) {
                infoContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <Box component="form" className={styles.note} onSubmit={handleSubmit} ref={props.mode === 'create' ? noteCreateRef : noteUpdateRef}>
            <div className={styles.infoContainer} ref={infoContainerRef}>
                {(isEditMode || title.length > 0) && (
                    <div className={styles.titleContainer}>
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
                    </div>
                )}
                {
                    (
                        (props.mode === "create" || content.length > 0 || isEditMode) && (
                            <div className={styles.contentContainer}>
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
                <div className={showShadow ? styles.footerWrapperShadow : styles.footerWrapper}>
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
                            {/* <IconButton aria-label="Add Reminder">
                                <AlarmOutlined />
                            </IconButton>
                            <IconButton aria-label="Background Color">
                                <Brush />
                            </IconButton>
                            <IconButton aria-label="Archive">
                                <ArchiveOutlined />
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