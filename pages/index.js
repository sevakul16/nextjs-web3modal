import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { ethers } from "ethers";
import { abi } from "../constants/abi";

let web3Modal;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        5: "https://eth-goerli.g.alchemy.com/v2/dqhgKqq3rl09jnFDsA38P0KurmhCA60V",
      },
    },
  },
};

if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions, //required
  });
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(undefined);

  async function connect() {
    web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions, //require
    });
    const web3ModalProvider = await web3Modal.connect();
    setIsConnected(true);
    const provider = new ethers.providers.Web3Provider(web3ModalProvider);
    setSigner(provider.getSigner());
  }

  async function execute() {
    if (typeof window.ethereum !== "undefined") {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        await contract.store(42);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  return (
    <div>
      {isConnected ? (
        "Connected! "
      ) : (
        <button onClick={() => connect()}>Connect</button>
      )}
      {isConnected ? <button onClick={() => execute()}>Execute</button> : ""}{" "}
    </div>
  );
}
