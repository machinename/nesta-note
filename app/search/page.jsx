'use client'

import styles from "../page.module.css";
import SearchNotes from "../note_layouts/seach_notes";

export default function Search() {
    return (
        <main className={styles.content}>
            <SearchNotes />
        </main>
    );
}