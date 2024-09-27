'use client';

import { TextField } from '@mui/material';
import styles from "./Note.module.css"

export default function NoteHeader({
    handleTitleChange,
    initialMode,
    isEditMode,
    isDarkMode,
    isNestedMode,
    isViewMode,
    nestedTitle,
    setIsEditMode,
    title,
    toggleEditModeTrue
}) {
    const placeholderText = isNestedMode ? 'Nested - Title...' : 'Title...';
    const readOnlyMode = initialMode === 'read' && !isViewMode;

    const handleFocus = () => {
        if (!(readOnlyMode || isNestedMode)) {
            setIsEditMode(true);
        }
    };

    const handleClick = () => {
        if (readOnlyMode) {
            toggleEditModeTrue();
        }
    };

    return (
        <>
            {(isEditMode || title.length > 0) && (
                <div className={styles.titleContainer}>
                    <TextField
                        inputProps={{
                            autoComplete: 'off',
                            readOnly: readOnlyMode,
                            style:
                            {
                                fontSize: 'x-large',
                                fontWeight: 'lighter',
                                fontFamily: 'monospace',
                                color: isDarkMode ? '#fff' : '#000',
                                cursor: 'default',
                            },
                        }}
                        className={styles.textField}
                        multiline
                        onChange={handleTitleChange}
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
                        value={isNestedMode ? nestedTitle : title}
                    />
                </div>
            )}
        </>
    );
}
