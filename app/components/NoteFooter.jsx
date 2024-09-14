'use client';

import {
    AlarmOutlined,
    Archive,
    ArchiveOutlined,
    ChevronLeft,
    DeleteForeverOutlined,
    ImageOutlined,
    MoreVert,
    NoteAddOutlined,
    RedoOutlined,
    UndoOutlined,
    RestoreFromTrashOutlined
} from '@mui/icons-material';
import { Button, IconButton, MenuItem } from '@mui/material';
import styles from "./noteStyles.module.css"

export default function NoteFooter({
    contentArray,
    handleRedo,
    handleUndo,
    initialMode,
    isArchived,
    isEditMode,
    isNoteOptionsMenuOpen,
    isNoteReminderMenuOpen,
    isTrash,
    mode,
    noteOptionsMenuRef,
    noteOptionsMenuRefButton,
    noteReminderMenuRef,
    index,
    setIsNoteOptionsMenu,
    toggleArchive,
    toggleDelete
}) {
    return (
        <>
            {isTrash && (
                <div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div>
                            <IconButton aria-label="Delete forever">
                                <DeleteForeverOutlined />
                            </IconButton>
                            <IconButton aria-label="Restore from trash">
                                <RestoreFromTrashOutlined />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )}

            {((isEditMode && !isTrash) || (mode === 'read' && !isTrash)) && (
                <div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div>
                            <IconButton
                                ref={noteOptionsMenuRefButton}
                                className={styles.noteOptionsMenuButton}
                                onClick={() => setIsNoteOptionsMenu(!isNoteOptionsMenuOpen)}
                            >
                                <MoreVert />
                            </IconButton>

                            {initialMode !== 'create' && (
                                <IconButton aria-label="Archive" onClick={() => toggleArchive()}>
                                    {isArchived ? <Archive /> : <ArchiveOutlined />}
                                </IconButton>
                            )}
                            {isEditMode && (
                                <>
                                    <IconButton
                                        aria-label="Undo"
                                        onClick={handleUndo}
                                        disabled={index.current === 0}
                                    >
                                        <UndoOutlined />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Redo"
                                        onClick={handleRedo}
                                        disabled={index.current === contentArray.length - 1}
                                    >
                                        <RedoOutlined />
                                    </IconButton>
                                </>
                            )}
                        </div>
                        {isEditMode && (
                            <Button type="submit">
                                Close
                            </Button>
                        )}
                        {isNoteReminderMenuOpen && (
                            <div className={styles.noteReminderMenu} ref={noteReminderMenuRef}>
                                <MenuItem>Later Today</MenuItem>
                                <MenuItem>Tomorrow</MenuItem>
                                <MenuItem>Next Week</MenuItem>
                            </div>
                        )}
                        {isNoteOptionsMenuOpen && (
                            <div className={styles.noteOptionsMenu} ref={noteOptionsMenuRef}>
                                <MenuItem onClick={toggleDelete}>Delete Note</MenuItem>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
