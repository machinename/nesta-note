'use client';

import { TextField } from '@mui/material';
import styles from "./noteStyles.module.css"
import { useState } from 'react';

export default function NoteHeader({
    handleTitleChange,
    initialMode,
    isEditMode,
    isViewMode,
    setIsEditMode,
    title,
    toggleEditModeTrue
}) {
    const readOnlyMode = initialMode === 'read' && !isViewMode;
    const placeholderText = 'Title...';

    const handleFocus = () => {
        if (!readOnlyMode) {
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
            {(isEditMode || title.length > 0) && (
                <div className={styles.titleContainer}>
                    <TextField
                        inputProps={{
                            autoComplete: 'off',
                            readOnly: readOnlyMode,
                            style: { fontSize: 20 },
                        }}
                        className={styles.textField}
                        multiline
                        onChange={handleTitleChange}
                        onClick={initialMode === 'create' ? null : handleClick}
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
                        value={title}
                    />
                </div>
            )}
        </>
    );
}
