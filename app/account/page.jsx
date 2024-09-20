'use client'

import accountStyles from "./accountStyles.module.css";
import { useAuthContext } from "../providers/AuthProvider";
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { Divider } from "@mui/material";
import { usePathname, useRouter } from 'next/navigation'

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
        <main className={accountStyles.content}>
            <div className={accountStyles.container}>
                <div className={accountStyles.containerHeader}>
                    <h2>Personal Info</h2>
                </div>
                <Divider />
                <div className={accountStyles.containerItem} onClick={pushToEmail}>
                    <div className={accountStyles.containerItemLeading}>
                        <p>Email</p>
                        {user?.email ? <p>{user.email}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
                {/* <Divider />
                <div className={accountStyles.containerItem}>
                    <div className={accountStyles.containerItemLeading}>
                        <p>Phone</p>
                        {user?.phoneNumber ? <p>{user.phoneNumber}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
                <Divider />
                <div className={accountStyles.containerItem}>
                    <div className={accountStyles.containerItemLeading}>
                        <p>Display Name</p>
                        {user?.displayName ? <p>{user.displayName}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div> */}
            </div>

            <div className={accountStyles.container}>
                <div className={accountStyles.containerHeader}>
                    <h2>Data & Security Info</h2>
                </div>
                <Divider />
                <div className={accountStyles.containerItem} onClick={pushToPassword}>
                    <div className={accountStyles.containerItemLeading}>
                        <p>Password</p>
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
                <Divider />
                {/* <div className={accountStyles.containerItem}>
                    <div className={accountStyles.containerItemLeading}>
                        <p>Download Data</p>
                        {user?.phoneNumber ? <p>{user.phoneNumber}</p> : null}
                    </div>
                    <ArrowForwardIos style={{
                        color: 'grey'
                    }} />
                </div>
                <Divider /> */}
                <div className={accountStyles.containerItem}>
                    <div className={accountStyles.containerItemLeading}>
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
