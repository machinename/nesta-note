'use client';
import { AlarmOutlined, ArchiveOutlined, Brush, ImageOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import styles from "./note.module.css";
import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/app_provider';

export default function NoteContainer(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPinned, setIsPinned] = useState(props.note.isPinned);
    const [title, setTitle] = useState(props.note.title)
    const [content, setContent] = useState(props.note.content);
    const [contentArray, setContentArray] = useState([content]);
    const { updateNote } = useContext(AppContext);
    const index = useRef(0);
    const noteEditorRef = useRef(null);

    const handleContentChange = (event) => {
        const newValue = event.target.value;
        setContent(newValue);
        index.current = index.current + 1;
        setContentArray(
            [...contentArray.slice(0, index.current), newValue]
        );
    };


    const handleTitleChange = (event) => {
        const newValue = event.target.value;
        setTitle(newValue);
    };


    const handleUndo = () => {
        if (index.current > 0) {
            index.current = index.current - 1;
            setContent(contentArray[index.current]);
        }
    };

    const handleRedo = () => {
        if (index.current < contentArray.length - 1) {
            index.current = index.current + 1;
            setContent(contentArray[index.current]);
        }
    };


    const handleResetNote = () => {
        setTitle("");
        setContent("");
        setContentArray([""]);
        setIsEditMode(false);
        index.current = 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (title.trim() !== '' || content.trim() !== '') {
            const updatedNote = ({
                title: title.trim(),
                content: content.trim(), 
                isPinned: isPinned
            })

            updateNote(props.note.id, updatedNote);
        } else {
            console.log("Not Creating Note")
        }

        handleResetNote();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noteEditorRef.current && !noteEditorRef.current.contains(event.target)) {
                if (title.trim() !== '' || content.trim() !== '') {
                    console.log("Creating Note = True")
                } else {
                    console.log("Creating Note = False")
                }
                handleResetNote();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [title, content]);

    return (
        <Box component="form" className={styles.note} onSubmit={handleSubmit} ref={noteEditorRef} >
            <div className={styles.titleContainer}>
                {
                    isEditMode ?
                        (<TextField
                            className={styles.titleTextField}
                            placeholder='Title'
                            multiline={false}
                            name='textField'
                            value={title}
                            onChange={handleTitleChange}
                            sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                },
                            }}
                        />) :
                        (<div className={styles.titleTextField}>
                            <p>{title}</p>
                        </div>)
                }
                <IconButton aria-label="Pin note" onClick={() => {
                    setIsPinned(!isPinned);
                    console.log("Current isPinned: " + !isPinned);

                }}>
                    {isPinned ? <PushPin /> : <PushPinOutlined />}
                </IconButton>
            </div>
            <div className={styles.contentContainer}>
                {
                    isEditMode ? (
                        <TextField
                            className={styles.contentTextField}
                            placeholder='Take a note...'

                            multiline={true}
                            value={content}
                            onChange={handleContentChange}
                            onClick={() => setIsEditMode(true)}
                            sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                },
                            }}
                        />) :
                        (<div className={styles.titleTextField}>
                            <p>{title}</p>
                        </div>)
                }
                <div className={styles.titleTextField}>
                    <p>{content}</p>
                </div>
            </div>
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
                    <IconButton aria-label="Undo" onClick={handleUndo} disabled={index.current === 0}>
                        <UndoOutlined />
                    </IconButton>
                    <IconButton aria-label="Redo" onClick={handleRedo} disabled={index.current === contentArray.length - 1}>
                        <RedoOutlined />
                    </IconButton>
                </div>
                <Button type="submit" >
                    Close
                </Button>
            </div>
        </Box>
    );
}
