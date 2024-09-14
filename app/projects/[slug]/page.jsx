'use client'

import { TextField } from "@mui/material";
import styles from "../../page.module.css";

export default function Page({ params }) {

    return (
        <main className={styles.content}>
            <TextField
                inputProps={{
                    readOnly: true,
                    style: {
                        fontSize: 20,
                        cursor: 'pointer',
                    },
                }}
                onClick={() => router.push(`/projects/${project.id}`)}
                sx={{

                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' },
                        '&.Mui-focused fieldset': { border: 'none' },
                    },
                }}
                value={params.slug}
            />
            <h1>Hello{params.slug}</h1>
        </main>
    );
}
