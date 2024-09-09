'use client'

import styles from "../page.module.css";
import MediaNotes from "../note_layouts/media_notes";

export default function Media() {
    return (
        <main className={styles.content}>
            <MediaNotes />
        </main>
    );
}