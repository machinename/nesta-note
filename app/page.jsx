'use client'

import styles from "./page.module.css";
import ActiveNotes from "./note_layouts/active_notes";

export default function Home() {
  return (
    <main className={styles.content}>
          <ActiveNotes/>
    </main>
  );
}

