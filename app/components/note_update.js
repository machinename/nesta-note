'use client';
import { AlarmOutlined, ArchiveOutlined, Brush, ChevronLeft, ImageOutlined, Note, NoteAdd, NoteAddOutlined, NoteOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import styles from "./note.module.css";
import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/app_provider';

export default function NoteUpdate(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isNestedMode, setIsNestedMode] = useState(false);
    const [showShadow, setShowShadow] = useState(false);

    const [isPinned, setIsPinned] = useState(props.note.isPinned);
    const [title, setTitle] = useState(props.note.title)
    const [content, setContent] = useState(props.note.content);
    const [nestedNotes, setNestedNotes] = useState(props.note.nestedNotes);

    const [contentArray, setContentArray] = useState([content]);

    const [nestedNote, setNestedNote] = useState({ title: '', content: '' });
    const [nestedTitle, setNestedTitle] = useState(nestedNote.title);
    const [nestedContent, setNestedContent] = useState(nestedNote.content);
    const [nestedContentArray, setNestedContentArray] = useState([nestedContent]);

    const { updateNote, setInfoContent, setInfoTitle } = useContext(AppContext);

    const index = useRef(0);
    const nestedIndex = useRef(0);
    const noteCreateRef = useRef(null);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const userNote = props.note;
        if (title.trim() !== userNote.title || content.trim() !== userNote.content) {
            const note = ({
                id: userNote.id,
                title: title.trim(),
                content: content.trim(),
                isPinned: isPinned,
                nestedNotes: nestedNotes
            })

            updateNote(note);
            console.log("Updated Note")

        } else {
            console.log("Nothing To See Here")
        }

        handleResetNote();
    };

    const handleResetNote = () => {
        setContent('');
        setTitle('');
        setInfoContent('');
        setInfoTitle('');
        setNestedContent('')
        setNestedTitle('')
        setNestedNotes([]);
        setContentArray(['']);
        setNestedContentArray(['']);
        setIsPinned(false);
        setIsNestedMode(false);
        setIsEditMode(false);
        index.current = 0;
        nestedIndex.current = 0;
    };

    const handleNestedNote = () => {
        // if (nestedTitle.trim() !== nestedNote.title || nestedContent.trim() !== nestedNote.content) {
        //     const nestedNote = ({
        //         title: nestedTitle.trim(),
        //         content: nestedContent.trim(),
        //     })
        //     setNestedNotes([...nestedNotes, nestedNote]);
        //     console.log('Adding Nested Note')
        // } else {
        //     console.log("Not Adding Nested Note")
        // }

        // setNestedTitle('');
        // setNestedContent('');
        // setNestedContentArray(['']);
        // setIsNestedMode(false);
        // nestedIndex.current = 0;
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            const userNote = props.note;

            if (isEditMode && noteCreateRef.current && !noteCreateRef.current.contains(event.target)) {
                if (title.trim() !== userNote.title || content.trim() !== userNote.content || nestedNotes.length > 0) {
                    const note = ({
                        title: title.trim(),
                        content: content.trim(),
                        isPinned: isPinned,
                        nestedNotes: nestedNotes
                    })
                    updateNote(note);
                } else {
                    console.log("Nothing To See Here")
                }
                setContent('');
                setTitle('');
                setInfoContent('');
                setInfoTitle('');
                setNestedContent('')
                setNestedTitle('')
                setNestedNotes([]);
                setContentArray(['']);
                setNestedContentArray(['']);
                setIsPinned(false);
                setIsNestedMode(false);
                setIsEditMode(false);
                index.current = 0;
                nestedIndex.current = 0;
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [content, updateNote, isEditMode, isPinned, nestedNotes, props.note, setInfoContent, setInfoTitle, title]);

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
        <Box component="form" className={styles.note} onSubmit={handleSubmit} ref={noteCreateRef}>
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
            </div>
            {isEditMode && (
                <>

                    {
                        nestedNotes.length > 0 && !isNestedMode && (
                            <div className={styles.nestedNotesWrapper}>
                                <div className={styles.nestedNotesContainer}>
                                    <div>
                                        {nestedNotes.map((note, index) => (
                                            <IconButton key={index}>
                                                <NoteOutlined />
                                            </IconButton>

                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }
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
                                <IconButton aria-label="Add Reminder">
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
                                </IconButton>
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
                </>
            )}
        </Box >
    );
}