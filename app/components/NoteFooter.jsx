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
    RestoreOutlined,
    DeleteOutline
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import styles from "./Note.module.css"

import React, { useEffect, useRef } from 'react';

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
                                <DeleteForeverOutlined className={styles.icon} />
                            </IconButton>
                            <IconButton aria-label="Restore from trash" onClick={() => toggleDelete()}>
                                <RestoreFromTrashOutlined className={styles.icon} />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )}

            {((isEditMode && !isTrash) || (mode === 'read' && !isTrash)) && (
                <div className={styles.footerWrapper}>
                    <div className={styles.footerContainer}>
                        <div className={styles.footerLeading}>
                            {isEditMode && (
                                <>
                                    {isNestedMode ? (
                                        <IconButton
                                            aria-label="Add Note"
                                            onClick={handleNestedNote}
                                        >
                                            <ChevronLeft className={styles.icon} />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            aria-label="Set Nested Mode"
                                            onClick={() => setIsNestedMode(true)}
                                        >
                                            <NoteAddOutlined className={styles.icon} />
                                        </IconButton>
                                    )}
                                </>
                            )}
                            <div>
                                <IconButton
                                    ref={noteOptionsMenuRefButton}
                                    className={styles.noteOptionsMenuButton}
                                    onClick={() => setIsNoteOptionsMenu(!isNoteOptionsMenuOpen)}
                                >
                                    <MoreVert className={styles.icon} />
                                </IconButton>
                                {isNoteOptionsMenuOpen && (
                                    <div className={styles.noteOptionsMenu} ref={noteOptionsMenuRef}>
                                        <div className={styles.menuItem} onClick={toggleDelete}>Delete Note</div>
                                    </div>
                                )}
                            </div>
                            {initialMode !== 'create' && (
                                <IconButton aria-label="Archive" onClick={() => toggleArchive()}>
                                    {isArchived ? <Archive className={styles.icon} /> : <ArchiveOutlined className={styles.icon} />}
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
                                                <UndoOutlined
                                                />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Redo"
                                                onClick={handleRedo}
                                                sx={{
                                                    color: 'gray'
                                                }}
                                                disabled={nestedIndex.current === nestedContentArray.length - 1}
                                            >
                                                <RedoOutlined />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete nested note forever"
                                                onClick={handleDeleteNestedNote}
                                                sx={{
                                                    color: 'gray'
                                                }}
                                            >
                                                <DeleteForeverOutlined className={styles.icon} />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton
                                                aria-label="Undo"
                                                onClick={handleUndo}
                                                disabled={index.current === 0}
                                                    sx={{
                                                        color: 'gray'
                                                    }}
                                            >
                                                <UndoOutlined
                                                />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Redo"
                                                onClick={handleRedo}
                                                disabled={index.current === contentArray.length - 1}
                                                    sx={{
                                                        color: 'gray'
                                                    }}
                                            >
                                                <RedoOutlined
                                                />
                                            </IconButton>
                                            {
                                                isUndoNote && (
                                                    <IconButton
                                                        aria-label="Undo Deleted Nested Note"
                                                        onClick={handleUndoDeletedNestedNote}
                                                    >
                                                        <RestoreOutlined className={styles.icon} />
                                                    </IconButton>
                                                )
                                            }
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        {isEditMode && (
                            <Button sx={{
                                borderRadius:'0px'
                            }}type="submit">
                                Close
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
