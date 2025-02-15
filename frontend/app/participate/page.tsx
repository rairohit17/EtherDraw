"use client";
import { Contract, ethers } from "ethers";
import lotteryABI from "../utils/lotteryABI.json";
import { useWalletClient } from "wagmi";
import { useState } from "react";
import {toast,ToastContainer} from "react-toastify"

export default function Participate() {
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [ethAmount, setEthAmount] = useState('0')

  async function getLotteryContract(walletClient: any): Promise<Contract | null> {
    if (!walletClient) return null;

    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0xB74526504013C0cB35E8a9791470f0A215155C32",
      lotteryABI,
      signer
    );
    return contract;
  }

  async function participateInLottery() {
    if (!walletClient) {
        toast.warn(' connect your wallet to participate ', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: {
              backgroundColor: '#374151',
              color: '#e2e8f0',
            },
          });
      return;
    }

    setIsLoading(true);
    try {
      const contract = await getLotteryContract(walletClient);
      if (!contract) return;
      const ethAmount = parseFloat('.01');
      const weiAmount = Math.floor(ethAmount * 1e18);
      console.log(weiAmount); 
        
      const tx = await contract.participateInLottery({
        value: BigInt(`${weiAmount}`), // value in wei for better understanding
      });
      await tx.wait();
        toast.success(' participation added ', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        style: {
          backgroundColor: '#374151',
          color: '#e2e8f0',
        },
      });
      console.log("Participated in the lottery!", tx);
    } catch (err: any) {
        toast.warn(err.message, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        style: {
          backgroundColor: '#374151',
          color: '#e2e8f0',
        },
      });

      console.error("Error participating:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="text-white mt-[100px] px-[50px]">
        <ToastContainer/>
      
      <div className="flex gap-2 w-full">
      <button
        onClick={participateInLottery}
        disabled={isLoading}
        className="bg-[#3898FF] text-sm sm:text-xl rounded-md text-white p-2  disabled:opacity-50"
      >
        {isLoading ? "pending..." : "Participate"}
      </button>
      <input onChange={(e)=>setEthAmount(e.target.value)} placeholder=".01(eth)" className="w-full bg-gray-700 hover rounded-md border-none active:border-gray-300 p-[5px] text-gray-300 "></input>
      </div>
      <div className="w-full border mt-[50px] sm:text-md p-[5px] text-xs text-center rounded-md bg-gray-800 sm:p-2">🎉 Participate in this decentralized raffle and test your luck! 🍀 Results are declared automatically within ⏱️ 60 seconds of entry for first participant, ensuring quick outcomes. This contract uses 🛡️ Chainlink VRF for absolute randomness in winner selection. 💰 A minimum entry fee of 0.01 ETH is required, and you can participate multiple times to boost your chances of winning! 🚀 However, please avoid spamming, as each entry consumes 💎 LINK tokens for Chainlink Automation. 🎯 Best of luck, and enjoy the thrill of decentralized Lottery! 🎉

</div>
    </div>
  );
}
