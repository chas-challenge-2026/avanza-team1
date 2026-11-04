import styles from "./InfoAside.module.css"

export function InfoAside() {
    return(
        <aside className={styles.container}>
            <h3 className={`${styles.heading} ${styles.topHeading}`}>Förstå din portfölj</h3>
            <article>
                <h3 className={styles.heading}>Vad är riskallokering?</h3> 
                <p className={styles.paragraph}>Vissa av dina placeringar kan vara mer rörliga än andra, och utgör en större risk att ha investeringar i. Andra placeringar har historiskt haft en stabilare utveckling, och lämpar sig därför bättre för långsiktigt sparande. Riskallokeringen mäter hur stor del av din samlade portföljs värde som är placerad i den ena eller andra kategorin. Du kan sätta ett mål för din riskallokering för att enkelt se om din portfölj håller sig till den risknivå du önskar.</p>
            </article>
        </aside>
    )
}