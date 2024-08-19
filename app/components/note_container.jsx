'use client';
import { AlarmOutlined, ArchiveOutlined, Brush, PushPin, ImageOutlined, PushPinOutlined, RedoOutlined, UndoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import styles from "./note_container.module.css";
import { useContext, useEffect, useState, useRef } from 'react';
import CustomTooltip from './custom_tooltip';
import { AppContext } from '../context/app_provider';

export default function NoteInput(props) {
    const inputMode = props.inputMode;
    const [isInputMode, setIsInputMode] = useState(props.isInputMode);
    const [isEditMode, setIsEditMode] = useState(false);
    const [title, setTitle] = useState(props.note.title);
    const [content, setContent] = useState(props.note.content);
    const [isPinned, setIsPinned] = useState(props.note.isPinned);
    const { createNote, updateNote } = useContext(AppContext);
    // const isDisabled = title.trim() === '' && content.trim() === '';
    const noteEditorRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noteEditorRef.current && !noteEditorRef.current.contains(event.target)) {
                handleNote();
                setIsEditMode(false);
                if(inputMode){
                    setIsInputMode(true)
                    setTitle('')
                    setContent('')
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleNote();
        setIsEditMode(false);
        if(inputMode){
            setIsInputMode(true)
            setTitle('')
            setContent('')
        }
    };

    const handleNote = () => {
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (
            (trimmedTitle !== '' || trimmedContent !== '') &&
            (trimmedTitle !== note.title || trimmedContent !== note.content || isPinned !== note.isPinned)
        ) {
            if (props.isNewNote) {
                const note = { id: Date.now(), title: trimmedTitle, content: trimmedContent, isPinned: isPinned };
                createNote(note);
            } else {
                const note = { id: props.note.id, title: trimmedTitle, content: trimmedContent, isPinned: isPinned };
                updateNote(note);
            }
        } else {
            console.log("Nothing")
        }
    }

    return (
        <Box component="form" className={styles.note} style={{
            cursor: 'pointer'
        }} onSubmit={handleSubmit} onClick={() => {
            setIsEditMode(true);
            setIsInputMode(false);
        }} ref={noteEditorRef}>
            {!isInputMode && (
                <div className={styles.titleContainer} ref={noteEditorRef}>
                    {
                        isEditMode ? (
                            <TextField
                                className={styles.titleTextField}
                                placeholder={'Title'}
                                multiline={true}
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
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
                            <div className={styles.titleDiv}>
                                <p>{title}</p>
                            </div>
                        )
                    }
                    <CustomTooltip title="Pin note">
                        <IconButton aria-label="Pin note" onClick={() => setIsPinned(!isPinned)}>
                            {
                                isPinned ? (
                                    <PushPin />
                                ) :
                                    (
                                        <PushPinOutlined />
                                    )
                            }
                        </IconButton>
                    </CustomTooltip>
                </div>
            )}
            <div className={styles.contentContainer} ref={noteEditorRef}>
                {
                    isEditMode ? (
                        <TextField
                            className={styles.contentTextField}
                            placeholder='Take a note...'
                            multiline={true}
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
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
                        <div className={styles.contentDiv}>
                            <p>{content}</p>
                        </div>
                    )
                }
            </div>
            {!isInputMode && (
                <div className={styles.indicatorsContainer}>
                    <div>
                        <p>{props.note.id}</p>
                    </div>
                    <div>
                        <p>{props.note.id}</p>
                    </div>
                </div>
            )}
            {!isInputMode && (
                <div className={styles.footerContainer}>
                    <div>
                        <CustomTooltip title="Add Reminder">
                            <IconButton aria-label="Add Reminder">
                                <AlarmOutlined />
                            </IconButton>
                        </CustomTooltip>
                        <CustomTooltip title="Background Color">
                            <IconButton aria-label="Background Color">
                                <Brush />
                            </IconButton>
                        </CustomTooltip>
                        <CustomTooltip title="Archive">
                            <IconButton aria-label="Archive">
                                <ArchiveOutlined />
                            </IconButton>
                        </CustomTooltip>
                        <CustomTooltip title="Add Image">
                            <IconButton aria-label="Add Image">
                                <ImageOutlined />
                            </IconButton>
                        </CustomTooltip>
                        {isEditMode && (
                            <>
                                <CustomTooltip title="Undo">
                                    <IconButton aria-label="Undo">
                                        <UndoOutlined />
                                    </IconButton>
                                </CustomTooltip>
                                <CustomTooltip title="Redo">
                                    <IconButton aria-label="Redo">
                                        <RedoOutlined />
                                    </IconButton>
                                </CustomTooltip>
                            </>
                        )}
                    </div>
                    {isEditMode && (
                        <Button type="submit" disabled={isDisabled}>
                            Close
                        </Button>
                    )}
                </div>
            )}
        </Box>
    );
}
