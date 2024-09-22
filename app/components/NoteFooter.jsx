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
    RestoreFromTrashOutlined,
    RestoreOutlined
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import styles from "./Note.module.css"

export default function NoteFooter({
    contentArray,
    handleDeleteNote,
    handleDeleteNestedNote,
    handleUndoDeletedNestedNote,
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
    isUndoNote,
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
                <div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div>
                            <IconButton aria-label="Delete note forever" onClick={() => handleDeleteNote()}>
                                <DeleteForeverOutlined />
                            </IconButton>
                            <IconButton aria-label="Restore from trash" onClick={() => toggleDelete()}>
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
                                            <IconButton
                                                aria-label="Delete nested note forever"
                                                onClick={handleDeleteNestedNote}
                                            >
                                                <DeleteForeverOutlined />
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
                                            {
                                                isUndoNote && (
                                                    <IconButton
                                                        aria-label="Undo Deleted Nested Note"
                                                        onClick={handleUndoDeletedNestedNote}
                                                    >
                                                        <RestoreOutlined />
                                                    </IconButton>
                                                )
                                            }
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {isEditMode && (
                            <button className={styles.closeBtn} type="submit">
                                Close
                            </button>
                        )}

                        {isNoteReminderMenuOpen && (
                            <div className={styles.noteReminderMenu} ref={noteReminderMenuRef}>
                                <div className={styles.menuItem}>Later Today</div>
                                <div className={styles.menuItem}>Tomorrow</div>
                                <div className={styles.menuItem}>Next Week</div>
                            </div>
                        )}

                        {isNoteOptionsMenuOpen && (
                            <div className={styles.noteOptionsMenu} ref={noteOptionsMenuRef}>
                                <div className={styles.menuItem} onClick={toggleDelete}>Delete Note</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
