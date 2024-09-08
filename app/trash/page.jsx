'use client'

import styles from "../page.module.css";
import TrashNotes from "../note_layouts/trash_notes";

export default function Trash() {
    return (
        <main className={styles.content}>
            <TrashNotes />
        </main>
    );
}