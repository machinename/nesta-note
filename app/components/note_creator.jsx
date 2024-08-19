'use client';
import { AlarmOutlined, ArchiveOutlined, Brush, ImageOutlined, PushPin, PushPinOutlined, RedoOutlined, UndoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';
import styles from "./note_creator.module.css";
import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/app_provider';

export default function NoteCreator() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('');
    const { createNote } = useContext(AppContext);
    const noteEditorRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        if(title.trim() !== '' || content.trim() !== ''){
            console.log("Creating Note")
        } else {
            console.log("Not Creating Note")
        }
        
        setTitle('');
        setContent('');
        setIsPinned(false);
        setIsEditMode(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noteEditorRef.current && !noteEditorRef.current.contains(event.target)) {
                if(title.trim() !== '' || content.trim() !== ''){
                    console.log("Creating Note = True")
                } else {
                    console.log("Creating Note = False")
                }
                
                setTitle('');
                setContent('');
                setIsPinned(false);
                setIsEditMode(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [title, content]);

    return (
        <Box component="form" className={styles.note} onSubmit={handleSubmit} ref={noteEditorRef} >
            {isEditMode && (
                <div className={styles.titleContainer}>
                    <TextField
                        className={styles.titleTextField}
                        placeholder='Title'
                        multiline={false}
                        name='textField'
                        value={title}
                        onChange={(event) => {
                            const newTitle = event.target.value;
                            setTitle(newTitle);
                            console.log("Current Title: " + newTitle);
                        }}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' },
                            },
                        }}
                    />
                    <IconButton aria-label="Pin note" onClick={() => {
                        setIsPinned(!isPinned);
                        console.log("Current isPinned: " + !isPinned);

                    }}>
                        {isPinned ? <PushPin /> : <PushPinOutlined />}
                    </IconButton>
                </div>
            )}
            <div className={styles.contentContainer}>
                <TextField
                    className={styles.contentTextField}
                    placeholder='Take a note...'
                    multiline={true}
                    value={content}
                    onChange={(event) => {
                        const newContent = event.target.value;
                        setContent(newContent);
                        console.log("Current Content: " + newContent);
                    }}
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
            </div>
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
                        {/* <IconButton aria-label="Undo" onClick={handleUndo} disabled={historyIndex <= 0}>
                            <UndoOutlined />
                        </IconButton>
                        <IconButton aria-label="Redo" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                            <RedoOutlined />
                        </IconButton> */}
                    </div>
                    <Button type="submit">
                        Close
                    </Button>
                </div>
            )}
        </Box>
    );
}
