import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react';
import Listing from "../components/listings";
import Link from 'next/link';

const Home: NextPage = () => {
  const account = useAccount();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if(account.isConnected === true) {
      setLogged(true);
    }
  }, [account])

  return (
    <div className={styles.container}>
      <Head>
        <title>Lend-Market</title>
        <meta
          content="Lend-Market"
          name="description"
        />
      </Head>

      <main className={styles.main}>
        {!logged && <ConnectButton label='Sign In' />}
        {logged && 
        <div>
          <button><Link href="/new">New</Link></button>
          <h1>Listings</h1>
          <button><Link href="/my">My Listings</Link></button>
          <Listing></Listing>
        </div>}
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
};

export default Home;
