import styles from "./InfoAside.module.css"

export function InfoAside() {
    return(
        <aside className={styles.container}>
            <h3 className={styles.heading}>A little info perhaps?</h3>
            <p className={styles.paragraph}>Just a little on the side?</p>
        </aside>
    )
}