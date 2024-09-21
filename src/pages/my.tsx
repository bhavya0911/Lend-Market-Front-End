import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react';
import MyListing from "../components/myListings";

const My: NextPage = () => {
  const account = useAccount();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if(account.isConnected === true) {
      setLogged(true);
    }
  }, [account])

  return (
    <div>
      <h1>My Listings</h1>
      <MyListing></MyListing>
    </div>
  );
};

export default My;