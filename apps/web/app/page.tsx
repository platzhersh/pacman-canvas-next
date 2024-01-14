import { Code } from "@repo/ui/code";
import Image from "next/image";
import GameCanvas from "./components/gameCanvas";
import styles from "./page.module.css";


export default function Page(): JSX.Element {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          examples/basic&nbsp;
          <Code className={styles.code}>web</Code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"
            rel="noopener noreferrer"
            target="_blank"
          >
            By{" "}
            <Image
              alt="Vercel Logo"
              className={styles.vercelLogo}
              height={24}
              priority
              src="/vercel.svg"
              width={100}
            />
          </a>
        </div>
      </div>

      <GameCanvas />

    </main>
  );
}
