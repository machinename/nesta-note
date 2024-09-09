'use client';

import CustomTooltip from "../custom_tooltip";
import { NoteOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import styles from "./note.module.css"

export default function NoteFormNestedNotes({
    isNestedMode,
    nestedNotes,
    pushToNestedNote,
    setIsEditMode,
}) {
    return (
        <>
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

        </>
    );
}


