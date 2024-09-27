'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "../page.module.css";
import { useAuthContext } from "../providers/AuthProvider";
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { Divider } from "@mui/material";
import { useRef, useRouter } from 'next/navigation'
import AccountModal from '../components/AccountModal';

export default function Account() {
    const { user, userEmail, userDisplayName, reauthenticate } = useAuthContext();

    const [method, setMethod] = useState('');
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    // const [displayName, setDisplayName] = useState(localStorage.getItem('displayName') || '');

    const pushToEmail = () => {
        // if (user?.emailVerified === false) {
        //     alert("You must verify your current email before making account changes.");
        //     return;
        // }
        setMethod('email');
        setIsAccountModalOpen(true);
    }

    const pushToDisplayName = () => {
        // if (user?.emailVerified === false) {
        //     alert("You must verify your current email before making account changes.");
        //     return;
        // }
        setMethod('displayName');
        setIsAccountModalOpen(true);
    }

    const pushToPassword = () => {
        // if (user?.emailVerified === false) {
        //     alert("You must verify your current email before making account changes.");
        //     return;
        // }
        setMethod('password');
        setIsAccountModalOpen(true);
    }

    const pushToDeleteAccount = () => {
        // if (user?.emailVerified === false) {
        //     alert("You must verify your current email before making account changes.");
        //     return;
        // }
        setMethod('delete');
        setIsAccountModalOpen(true);
    }

    const pushToSendVerification = () => {
        setMethod('verification');
        setIsAccountModalOpen(true);
    }

    // useEffect(() => {
    //     if (userDisplayName) {
    //         setDisplayName(userDisplayName);
    //         localStorage.setItem('displayName', userDisplayName);
    //     }
    // }, [userDisplayName]);

    return (
        <main className={styles.account}>
            <div className={styles.accountContainer}>
                <div className={styles.accountContainerHeader}>
                    <h1>Personal Info</h1>
                </div>
                {
                    user?.emailVerified === false &&
                    <>
                        {/* <div className={styles.divider}>
                            <Divider />
                        </div> */}
                        <div className={styles.accountContainerItem} onClick={pushToSendVerification}>
                            <p style={{
                                color: 'red'
                            }}>Needs Attention! Resend Email Account Verification</p>
                            <ArrowForwardIos style={{
                                color: 'red'
                            }} />
                        </div>
                    </>
                }
                {/* <div className={styles.divider}>
                    <Divider />
                </div> */}
                <div className={styles.accountContainerItem} onClick={pushToEmail} >
                    <div className={styles.accountContainerItemLeading}>
                        <p>Email</p>
                    </div>
                    {
                        userEmail
                            ?
                            <div className={styles.accountContainerItemTrailing}>
                                {userEmail}
                                <ArrowForwardIos />
                            </div>
                            :
                            <ArrowForwardIos />
                    }
                </div>
                {/* <div className={styles.divider}>
                    <Divider />
                </div> */}
                <div className={styles.accountContainerItem} onClick={pushToDisplayName} >
                    <div className={styles.accountContainerItemLeading}>
                        <p>Display Name </p>
                    </div>
                    {
                        userDisplayName
                            ?
                            <div className={styles.accountContainerItemTrailing}>
                                {userDisplayName}
                                <ArrowForwardIos />
                            </div>
                            :
                            <ArrowForwardIos />
                    }
                </div>
            </div>
            <div className={styles.accountContainer}>
                <div className={styles.accountContainerHeader}>
                    <h1>Data & Security</h1>
                </div>
                {/* <div className={styles.divider}>
                    <Divider />
                </div> */}
                <div className={styles.accountContainerItem} onClick={pushToPassword}>
                    <p>Password</p>
                    <ArrowForwardIos />
                </div>
                {/* <div className={styles.divider}>
                    <Divider />
                </div> */}
                <div className={styles.accountContainerItem} onClick={pushToDeleteAccount}>
                    <p>Delete Account</p>
                    <ArrowForwardIos />
                </div>
            </div>
            <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} method={method} />
        </main>
    );
}