'use client';

import { IconButton } from "@mui/material";
import { NoteOutlined } from "@mui/icons-material";
import CustomTooltip from "./CustomTooltip";
import styles from "./noteStyles.module.css"

export default function NoteNestedNotes({
    isNestedMode,
    nestedNotes,
    pushToNestedNote,
    toggleEditModeTrue
}) {
    const handlePushToNestedNote = (note) => {
        pushToNestedNote(note);
        toggleEditModeTrue();
    };
    
    return (
        <>
            {
                nestedNotes.length > 0 && !isNestedMode && (
                    <div className={styles.nestedNotesWrapper} onClick={toggleEditModeTrue}>
                        <div className={styles.nestedNotesContainer}>
                            {nestedNotes.map((note, index) => (
                                <CustomTooltip key={index} title={note.title.substring(0, 6)}>
                                    <IconButton onClick={
                                       ()=> handlePushToNestedNote(note)
                                    }>
                                        <NoteOutlined />
                                    </IconButton>
                                </CustomTooltip>
                            ))}
                        </div>
                    </div>
                )
            }

        </>
    );
}
