'use client'

import styles from "../page.module.css";
import { useAuthContext } from "../providers/AuthProvider";
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { Divider } from "@mui/material";
import { useRouter } from 'next/navigation'

export default function Account() {
    const { user } = useAuthContext();
    const router = useRouter();

    const pushToEmail =()=> {
        if(user){
            router.push('/email')
        } else {
            router.push('/');
        }
    }

    const pushToPassword = () => {
        if (user) {
            router.push('/password')
        } else {
            router.push('/');
        }
    }

    return (
        <main className={styles.content}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <h2>Personal Info</h2>
                </div>
                <Divider />
                <div className={styles.containerItem} onClick={pushToEmail}>
                    <div className={styles.containerItemLeading}>
                        <p>Email</p>
                        {user?.email ? <p>{user.email}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
                {/* <Divider />
                <div className={styles.containerItem}>
                    <div className={styles.containerItemLeading}>
                        <p>Phone</p>
                        {user?.phoneNumber ? <p>{user.phoneNumber}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
                <Divider />
                <div className={styles.containerItem}>
                    <div className={styles.containerItemLeading}>
                        <p>Display Name</p>
                        {user?.displayName ? <p>{user.displayName}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div> */}
            </div>

            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <h2>Data & Security Info</h2>
                </div>
                <Divider />
                <div className={styles.containerItem} onClick={pushToPassword}>
                    <div className={styles.containerItemLeading}>
                        <p>Password</p>
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
                <Divider />
                {/* <div className={styles.containerItem}>
                    <div className={styles.containerItemLeading}>
                        <p>Download Data</p>
                        {user?.phoneNumber ? <p>{user.phoneNumber}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
                <Divider /> */}
                <div className={styles.containerItem}>
                    <div className={styles.containerItemLeading}>
                        <p>Delete Account</p>
                        {user?.displayName ? <p>{user.displayName}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
            </div>
        </main>
    );
}
