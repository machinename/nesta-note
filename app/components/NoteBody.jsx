'use client';

import { TextField } from '@mui/material';
import styles from "./Note.module.css"

export default function NoteBody({
    content,
    handleContentChange,
    initialMode,
    isEditMode,
    isDarkMode,
    isNestedMode,
    isViewMode,
    nestedContent,
    toggleEditModeTrue
}) {
    const readOnlyMode = initialMode === 'read' && !isViewMode;
    const placeholderText = isNestedMode ? 'Nested - Create a note...' : 'Create a note...';

    const handleFocus = () => {
        if (!readOnlyMode && !isNestedMode) {
            toggleEditModeTrue();
        }
    };

    const handleClick = () => {
        if (readOnlyMode) {
            toggleEditModeTrue();
        }
    };

    return (
        <>
            {((initialMode === "create" || content.length > 0 || isEditMode) && (
                <div className={styles.contentContainer}>
                    <TextField
                        inputProps={{
                            autoComplete: 'off',
                            readOnly: readOnlyMode,
                            style: 
                            { 
                                fontSize: 'large',
                                fontWeight: 'lighter',
                                fontFamily: 'monospace',
                                color: isDarkMode ? '#fff' : '#000',
                                cursor: 'default',
                            },
                        }}
                        multiline
                        onChange={handleContentChange}
                        onClick={handleClick}
                        onFocus={handleFocus}
                        placeholder={placeholderText}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' },
                            },
                        }}
                        value={isNestedMode ? nestedContent : content}
                    />
                </div>
            ))}
        </>
    );
}
