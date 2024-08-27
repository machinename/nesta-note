'use client';
import { AddBox, AddBoxOutlined, AddBoxRounded, AddBoxTwoTone, AddCardOutlined, AddTask, AlarmOutlined, ArchiveOutlined, Brush, CardMembershipSharp, ChevronLeft, CloseOutlined, ImageOutlined, NoteAdd, NoteAddOutlined, NoteAltOutlined, NoteOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import styles from "./note.module.css";
import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/app_provider';

export default function NoteUpdate(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isNestedMode, setIsNestedMode] = useState(false);

    const [isPinned, setIsPinned] = useState(props.note.isPinned);
    const [title, setTitle] = useState(props.note.title)
    const [content, setContent] = useState(props.note.content);
    const [nestedNotes, setNestedNotes] = useState(props.note.nestedNotes);

    const [contentArray, setContentArray] = useState([content]);

    const [nestedNote, setNestedNote] = useState({ title: '', content: '' });
    const [nestedTitle, setNestedTitle] = useState(nestedNote.title);
    const [nestedContent, setNestedContent] = useState(nestedNote.content);
    const [nestedContentArray, setNestedContentArray] = useState([nestedContent]);

    const { updateNote } = useContext(AppContext);

    const index = useRef(0);
    const nestedIndex = useRef(0);
    const noteUpdateRef = useRef(null);

    const handleContentChange = (event) => {
        const newValue = event.target.value;
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

    const handleTitleChange = (event) => {
        const newValue = event.target.value;
        if (isNestedMode) {
            setNestedTitle(newValue);
        } else {
            setTitle(newValue);
        }
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

    const handleResetNote = () => {
        setContentArray(['']);
        setNestedContentArray(['']);
        setIsNestedMode(false);
        setIsEditMode(false);
        index.current = 0;
        nestedIndex.current = 0;
    };

    const handleNestedNote = () => {
        if (nestedTitle.trim() !== nestedNote.title || nestedContent.trim() !== nestedNote.content) {
            const nestedNote = ({
                title: nestedTitle.trim(),
                content: nestedContent.trim(),
            })
            setNestedNotes([...nestedNotes, nestedNote]);
            console.log('Adding Nested Note')
        } else {
            console.log("Not Adding Nested Note")
        }

        setNestedTitle('');
        setNestedContent('');
        setNestedContentArray(['']);
        setIsNestedMode(false);
        nestedIndex.current = 0;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const userNote = props.note;
        if (title.trim() !== userNote.title || content.trim() !== userNote.content || nestedNotes.length > 0) {
            const note = ({
                title: title.trim(),
                content: content.trim(),
                isPinned: isPinned,
                nestedNotes: nestedNotes
            })

            updateNote(note);
            console.log("Created Note")

        } else {
            console.log("Nothing To See Here")
        }

        handleResetNote();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const userNote = props.note;
            if (isEditMode && noteUpdateRef.current && !noteUpdateRef.current.contains(event.target)) {
                if (title.trim() !== userNote.title || content.trim() !== userNote.content || isPinned !== userNote.isPinned || nestedNotes.length > 0) {
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
                handleResetNote();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [content, updateNote, isEditMode, isPinned, title, nestedNotes, props.note]);

    return (
        <Box component="form" className={styles.note} onSubmit={handleSubmit} ref={noteUpdateRef} >

            <div className={styles.titleContainer}>
                {
                    isNestedMode && (
                        <IconButton aria-label="Back" onClick={handleNestedNote}>
                            <ChevronLeft />
                        </IconButton>
                    )
                }
                <TextField
                    inputProps={{ autoComplete: 'off' }}
                    className={styles.titleTextField}
                    placeholder={isNestedMode ? 'Nested - Title' : 'Title'}
                    multiline={false}
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
                {
                    !isNestedMode && (
                        <>
                            <IconButton aria-label="Add Note" onClick={() => {
                                setIsNestedMode(true);
                            }}>                  <NoteAddOutlined />
                            </IconButton>
                            <IconButton aria-label="Pin note" onClick={() => {
                                setIsPinned(!isPinned);
                            }}>
                                {isPinned ? <PushPin /> : <PushPinOutlined />}
                            </IconButton>
                        </>
                    )
                }
            </div>


            <div className={styles.contentContainer}>
                <TextField
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

            <>
                {
                    nestedNotes.length > 0 && !isNestedMode && (
                        <div className={styles.nestedNotesContainer}>
                            <div>
                                {nestedNotes.map((note, index) => (
                                    <IconButton key={index}>
                                        <NoteOutlined />
                                    </IconButton>
                                ))}
                            </div>
                        </div>
                    )
                }
            </>
            {isEditMode && (
                <div className={styles.footerContainer}>
                    <div>
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
            )}
        </Box >
    );
}