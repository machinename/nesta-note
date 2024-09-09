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
import styles from "./note.module.css";

export default function NoteFormFooter({
    contentArray,
    handleNestedNote,
    handleRedo,
    handleUndo,
    initialMode,
    isArchived,
    isEditMode,
    isInfoScroll,
    isNestedMode,
    isNoteOptionsMenuOpen,
    isNoteReminderMenuOpen,
    isTrash,
    mode,
    nestedContentArray,
    noteOptionsMenuRef,
    noteOptionsMenuRefButton,
    noteReminderMenuRef,
    nestedIndex,
    index,
    setIsNestedMode,
    setIsNoteOptionsMenu,
    toggleArchive,
    toggleDelete
}) {
    return (
        <>
            {isTrash && (
                <div className={isInfoScroll ? styles.footerWrapperShadow : styles.footerWrapper}>
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
                <div className={isInfoScroll ? styles.footerWrapperShadow : styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div>
                            {isEditMode && (
                                <>
                                    {isNestedMode ? (
                                        <IconButton
                                            aria-label="Add Note"
                                            onClick={handleNestedNote}
                                        >
                                            <ChevronLeft />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            aria-label="Set Nested Mode"
                                            onClick={() => setIsNestedMode(true)}
                                        >
                                            <NoteAddOutlined />
                                        </IconButton>
                                    )}
                                </>
                            )}

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
                                    {isNestedMode ? (
                                        <>
                                            <IconButton
                                                aria-label="Undo"
                                                onClick={handleUndo}
                                                disabled={nestedIndex.current === 0}
                                            >
                                                <UndoOutlined />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Redo"
                                                onClick={handleRedo}
                                                disabled={nestedIndex.current === nestedContentArray.length - 1}
                                            >
                                                <RedoOutlined />
                                            </IconButton>
                                        </>
                                    ) : (
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
