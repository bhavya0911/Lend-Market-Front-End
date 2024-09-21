import type { NextPage } from 'next';
import styles from '../styles/new.module.css';
import { useAccount, useReadContract } from 'wagmi'
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSignMessage } from 'wagmi'
import axios from 'axios';

const New: NextPage = () => {
  const account = useAccount();
  const contract = '';
  const [type, setType] = useState('Lender');
  const [loanToken, setLoanToken] = useState();
  const [borrowToken, setBorrowToken] = useState();
  const [apr, setApr] = useState();
  const [duration, setDuration] = useState();
  const [repayAmount, setRepayAmount] = useState();
  const [amountLoan, setAmountLoan] = useState(0);
  const [amountBorrow, setAmountBorrow] = useState(0);
  const [sig, setSig] = useState();
  const [set, setSetter] = useState(false);

  const { signMessage } = useSignMessage({
    mutation: {
        onSuccess: (data: any) => {
            setSig(data)
        }
    }
});

  const tokenAddress = type === 'Lender' ? borrowToken : loanToken;
  const tokenAmount = type === 'Lender' ? amountBorrow : amountLoan;
  const seed = Math.random();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if(type && loanToken && borrowToken && amountBorrow && amountLoan && apr && duration && repayAmount) {
        if (type === "Lender") {
            createSignature(true);
        } else {
            setSetter(false);
           createSignature(false);
        }
        
    } else {
        toast.error("Not filled everything yet");
    }

  }

  const submitToBackend = (typeBool: Boolean) => {
    try {
        const data = {
            "maker": account.address,
            "type": typeBool,
            "token_loan": loanToken,
            "amount_loan": amountLoan,
            "token_borrow": borrowToken,
            "amount_borrow": amountBorrow,
            "amount_repay": repayAmount,
            "seed": seed,
            "curr_status": 1,
            "expire_time": 24 * 5 * 3600,
            "duration": duration,
            "apr": apr,
            "signature": sig,
            "users": [account.address],
        }
        axios.post('http://localhost:4000/api/v1/listings/new/', data)
        .then(() => toast.success("Successfully Submitted"));
    } catch (error) {
        console.log(error)
    }
  }

  const createSignature = async (typeBool: Boolean) => {
    const message = (
        "Maker is: " + account.address + " typeOf: " + typeBool + " borrow_token: " + borrowToken + " loan_token: " + loanToken + " borrow_amount: " + amountBorrow + " loan_amount: " + amountLoan + " repay_amount: " + repayAmount + " duration: " + duration + " seed: " + seed
    );
    signMessage({message})
  }

  const selectType = (event: any) => {
    setType(event.target.value);
  };

  const setCollateral = (event: any) => {
    setLoanToken(event.target.value);
  };

  const setAmountCollaterals = (event: any) => {
    setAmountLoan(event.target.value);
  }

  const setAmountBorrows = (event: any) => {
    setAmountBorrow(event.target.value);
  }

  const setBorrow = (event: any) => {
    setBorrowToken(event.target.value);
  };
  
  const setAPR = (event: any) => {
    setApr(event.target.value);
  }

  const setDurations = (event: any) => {
    setDuration(event.target.value);
  }

  const setRepayAmounts = (event: any) => {
    setRepayAmount(event.target.value)
  }

  useEffect(() => {
    if(sig !== undefined) {
        submitToBackend(set);
    }
  }, [sig])

  return (
    <div className={styles.cot}>
      <h1>New Listing</h1>
      <form>
        <label htmlFor="options">You are: </label>
        <select id="options" value={type} onChange={selectType}>
            <option value="Lender">Lender</option>
            <option value="Borrower">Borrower</option>
        </select>
        <div>
            <label>Collateral Token: </label>
            <input
            type="text"
            id="collateralToken"
            value={loanToken}
            onChange={setCollateral}
            placeholder="Address"
            />
            <label>Amount: </label>
            <input
            type="number"
            id="amoutCollateral"
            value={amountLoan}
            onChange={setAmountCollaterals}
            placeholder="Enter Amount"
            />
        </div>
        <div>
            <label>Lending Token: </label>
            <input
            type="text"
            id="borrowToken"
            value={borrowToken}
            onChange={setBorrow}
            placeholder="Address"
            />
            <label>Amount: </label>
            <input
            type="number"
            id="amoutCollateral"
            onChange={setAmountBorrows}
            value={amountBorrow}
            placeholder="Enter Amount"
            />
        </div>
        <div>
            <label>APR: </label>
            <input
            type="number"
            id="apr"
            value={apr}
            onChange={setAPR}
            placeholder="APR"
            />
            <label>Duration (Days):</label>
            <input
            type="number"
            id="apr"
            value={duration}
            onChange={setDurations}
            placeholder="Duration"
            />
        </div>
        <div>
            <label>Repay Amount: </label>
            <input
            type="number"
            id="repayAmount"
            value={repayAmount}
            onChange={setRepayAmounts}
            placeholder="Repay Amount"
            />
        </div>
        <button onClick={submit}>Submit</button>
      </form>
    </div>
  );
};

export default New;