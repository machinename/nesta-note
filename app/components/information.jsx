import { useContext, useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import { AppContext } from '../context/AppProvider';
import styles from "./information.module.css";
import { Close } from '@mui/icons-material';

export default function Information() {
    const { infoContent, infoGeneral, infoTitle, setInfoContent, setInfoGeneral, setInfoTitle } = useContext(AppContext);

    const infoItems = [
        { show: infoGeneral.length > 0, info: infoGeneral, type: 'general' },
        { show: infoTitle.length > 0, info: infoTitle, type: 'title' },
        { show: infoContent.length > 0, info: infoContent, type: 'content' }
    ];

    const informationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (informationRef.current && !informationRef.current.contains(event.target)) {
                setInfoContent('');
                setInfoGeneral('');
                setInfoTitle('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setInfoContent, setInfoGeneral, setInfoTitle]);

    return (
        <>
            {(infoContent.length > 0 || infoGeneral.length > 0 || infoTitle.length > 0) && (
                <div className={styles.container} ref={informationRef}>
                    {infoItems.map((item, index) =>
                        item.show && (
                            <div key={index} className={styles.information}>
                                <p>{item.info}</p>
                                {
                                    item.type === "general" && (
                                        <IconButton onClick={() => setInfoGeneral('')}>
                                            <Close style={{
                                                color: 'white'
                                            }} color='white'/>
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