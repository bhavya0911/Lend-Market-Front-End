import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextComponentType } from 'next';
import styles from '../styles/Home.module.css';
import { useAccount } from 'wagmi';
import { Key, useEffect, useState } from 'react';
import abi from '../abi.json';
import { useWriteContract } from 'wagmi';

interface TableData {
  _id: Key,
  maker: string,
  type: string,
  token_loan: string,
  name_loan: string,
  symbol_loan: string,
  amount_loan: number,
  token_borrow: string,
  name_borrow: string,
  symbol_borrow: string,
  amount_borrow: number,
  amount_repay: number,
  expire_time: number,
  duration: number,
  apr: number,
  signature: string,
  status: number,
  seed: number,
}

const Listing: NextComponentType = () => {
    const [data, setData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const address = "";
    const account = useAccount();
    const [list, setList] = useState<any>(undefined);
    const [writeNow, setWrite] = useState(false);
    const [signature, setSignature] = useState<string | undefined>(undefined);

    useWriteContract({
      abi,
      address,
      functionName: 'accept',
      args: [
        list,
        signature,
      ],
      enable: writeNow,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:4000/api/v1/listings/fetchAll/");
                const result = await response.json();
                setData(result.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [writeNow]);

    const accept = (item: TableData) => {
      let borrower, lender;
      if (item.type === 'Lender') {
        borrower = account.address;
        lender = item.maker;
      } else {
        borrower = item.maker;
        lender = account.address;
      }
      const listing = {
        "borrower": borrower,
        "lender": lender,
        "borrow_token": item.token_borrow,
        "loan_token": item.token_loan,
        "borrow_amount": item.amount_borrow,
        "loan_amount": item.amount_loan,
        "repay_amount": item.amount_repay,
        "startTimestamp": Date.now(),
        "duration": item.duration,
        "status": item.status,
        "seed": item.seed,
      };
      setList(listing); // Set the list based on the selected item
      setSignature(item.signature); // Set the signature based on the selected item
      setWrite(true); // Enable the contract write
    };

    if (loading) {
        return <p>Loading data...</p>;
    }

    return (
        <div>
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
                                <td>
                                    <button onClick={() => accept(item)}>Accept</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Listing;