'use client';

import styles from "./noteStyles.module.css"

export default function NoteNestedNotes({
    isNestedMode,
    nestedNotes,
    pushToNestedNote,
    toggleEditModeTrue
}) {
    return (
        <>
            {
                nestedNotes.length > 0 && !isNestedMode && (
                    <div className={styles.nestedNotesWrapper} onClick={toggleEditModeTrue}>
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


