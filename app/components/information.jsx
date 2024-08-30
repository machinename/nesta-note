import { useContext } from 'react';
import { IconButton } from '@mui/material';
import { AppContext } from '../context/app_provider';
import styles from "./information.module.css";
import { Close } from '@mui/icons-material';

export function Information() {
    const { infoContent, infoGeneral, infoTitle, setInfoContent, setInfoTitle, setInfoGeneral } = useContext(AppContext);

    const infoItems = [
        { show: infoGeneral.length > 0, info: infoGeneral, type: 'general' },
        { show: infoTitle.length > 0, info: infoTitle, type: 'title' },
        { show: infoContent.length > 0, info: infoContent, type: 'content' }
    ];

    return (
        <>
            {(infoContent.length > 0 || infoGeneral.length > 0 || infoTitle.length > 0) && (
                <div className={styles.container}>
                    {infoItems.map((item, index) =>
                        item.show && (
                            <div key={index} className={styles.information}>
                                <p>{item.info}</p>
                                {
                                    item.type === "general" && (
                                        <IconButton className={styles.button} onClick={() => setInfoGeneral('')}>
                                            <Close/>
                                        </IconButton>
                                    )
                                }
                            </div>
                        )
                    )}
                </div>
            )}
        </>
    );
}