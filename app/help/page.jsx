import styles from '../page.module.css';

export default function Page() {
    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                <div className={styles.helpHeader}>
                    <h1>How to use Nesta Notes</h1>
                    <p>You can create, edit, and share notes with Nesta Notes.</p>
                </div>
                <div className={styles.helpContainer}>
                    <h1>Notes</h1>
                    <h2>Creating a note</h2>
                    <p>To create a note click on the note interface on the home screen. Enter either a title, content, or create a nested note. Afterwards press the close button or outside of the note to create the note.</p>
                    <h2>Editing a note</h2>
                    <p>To edit a note click on the note interface on the home screen. Press close or outside of the note to create the note.</p>
                </div>
                <div className={styles.helpContainer}>
                    <h1>Account</h1>
                    <h2>Updating your email</h2>
                    <p>To update your email click on the account interface on the home screen. Enter your new email and press the submit button.</p>
                    <h2>Updating your display name</h2>
                    <p>To update your display name click on the account interface on the home screen. Enter your new display name and press the submit button.</p>
                    <h2>Updating your password</h2>
                    <p>To update your password click on the account interface on the home screen. Enter your new password and press the submit button.</p>
                    <h2>Deleting your account</h2>
                    <p>To delete your account click on the account interface on the home screen. Press the submit button.</p>

                </div>
                <div className={styles.helpContainer}>
                    <h1>Contact Us</h1>
                    <h2>Email</h2>
                    <p>support@machinename.dev</p>
                    <h2>Socials</h2>
                    <p>Twitter: @machinename</p>
                </div>
            </div>
        </div>
    )
}