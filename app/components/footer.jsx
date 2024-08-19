import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeading}>
        <p>
          © 2024 Machine Name LLC. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}