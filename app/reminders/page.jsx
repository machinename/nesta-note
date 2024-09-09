'use client'

import styles from "../page.module.css";
import ReminderNotes from "../note_layouts/trash_notes";

export default function Reminders() {
    return (
        <main className={styles.content}>
            <ReminderNotes />
        </main>
    );
}