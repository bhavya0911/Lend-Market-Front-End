import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextComponentType, NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi'
import { Key, useEffect, useState } from 'react';

interface TableData {
  _id: Key,
  maker: String,
  type: String,
  curr_status: Number,
  token_loan: String,
  name_loan: String,
  symbol_loan: String,
  amount_loan: Number,
  token_borrow: String,
  name_borrow: String,
  symbol_borrow: String,
  amount_borrow: Number,
  amount_repay: Number,
  expire_time: Number,
  duration: Number,
  apr: Number,
}

const MyListing: NextComponentType = () => {
    const [data, setData] = useState<TableData[]>([]);
    const [status, setStatus] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:4000/api/v1/listings/fetchAll/");
                const result = await response.json();
                setData(result.data);
                setLoading(false);
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();
    }, []);

    const accept = () => {
      console.log("accepted");
    }

    if (loading) {
        return <p>loading data..</p>
    }


  return (
    <div>
      <h2>Dynamic Table</h2>
      <table>
        <thead>
          <tr>
            <th>Listing Type</th>
            <th>Listing Creator</th>
            <th>Loan Token Name</th>
            <th>Loan Token Symbol</th>
            <th>Loan Token Address</th>
            <th>Amount Offered</th>
            <th>Collateral Token Name</th>
            <th>Collateral Token Symbol</th>
            <th>Collateral Token Address</th>
            <th>Amount Offered</th>
            <th>APR</th>
            <th>Duration (Days)</th>
            <th>Repay Amount</th>
            <th>Valid Till</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id}>
                <td>{item.type}</td>
                <td>{item.maker}</td>
                <td>{item.name_loan}</td>
                <td>{item.symbol_loan}</td>
                <td>{item.token_loan}</td>
                <td>{item.amount_loan.toString()}</td>
                <td>{item.name_borrow}</td>
                <td>{item.symbol_borrow}</td>
                <td>{item.token_borrow}</td>
                <td>{item.amount_borrow.toString()}</td>
                <td>{item.apr.toString()}</td>
                <td>{item.duration.toString()}</td>
                <td>{item.amount_repay.toString()}</td>
                <td>{item.expire_time.toString()}</td>
                {item.curr_status == 1 && <td><button onClick={accept}>Cancel</button></td>}
                {item.curr_status == 2 && <td><button onClick={accept}>Repay</button></td>}
                {item.curr_status == 3 && <td><button onClick={accept}>Reclaim</button></td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyListing;