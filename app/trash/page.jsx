'use client'

import styles from "../page.module.css";
import { useContext } from 'react';
import { AppContext } from "../context/app_provider";
import SearchNotes from "../note_layouts/seach_notes";
import TrashNotes from "../note_layouts/trash_notes";

export default function Trash() {
    const { notes, isSearch, filteredNotes } = useContext(AppContext);

    return (
        <main className={styles.content}>
            <div style={{ paddingTop: '6rem' }} />
            {
                isSearch ? (
                    <SearchNotes />
                ) : (
                    <TrashNotes/>
                )
            }
        </main>
    );
}