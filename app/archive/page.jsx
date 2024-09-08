'use client'

import styles from "../page.module.css";
import ArchiveNotes from "../note_layouts/archive_notes";

export default function Archive() {
    return (
        <main className={styles.content}>
            <ArchiveNotes />
        </main>
    );
}