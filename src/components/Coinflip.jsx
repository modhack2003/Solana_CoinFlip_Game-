import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SiSolana } from "react-icons/si"; // Solana logo for Heads
import { RiAliensLine } from "react-icons/ri"; // Question mark for Tails

const Coinflip = ({ demoMode }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [flipResult, setFlipResult] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoBalance, setDemoBalance] = useState(10000); // Demo balance in SOL
  const [flipping, setFlipping] = useState(false);
  const [error, setError] = useState(''); // Error message state
  const [resultMessage, setResultMessage] = useState(''); // Result message state

  const isBetAmountValid = parseFloat(betAmount) > 0 && !isNaN(parseFloat(betAmount));
  const isBetAmountExceeded = demoMode ? parseFloat(betAmount) > demoBalance : false;

  const flipCoin = async (side) => {
    if (demoMode) {
      if (!isBetAmountValid) {
        setError('Please enter a valid bet amount.');
        return;
      } else if (isBetAmountExceeded) {
        setError('Insufficient balance for the bet amount.');
        return;
      } else {
        setError('');
      }
    } else if (!publicKey) {
      return;
    }

    setLoading(true);
    setFlipping(true);
    setFlipResult(null); // Hide the result while flipping

    setTimeout(() => {
      const isHeads = Math.random() < 0.5;
      setFlipResult(isHeads ? 'Heads' : 'Tails');
      handleFlipResult(side, isHeads);
      setFlipping(false); // Stop flipping once result is determined
      setLoading(false);
    }, 3000); // Coin flip animation duration
  };

  const handleFlipResult = (side, isHeads) => {
    if ((side === 'heads' && isHeads) || (side === 'tails' && !isHeads)) {
      if (demoMode) {
        payDemoWinner();
        setResultMessage('You won!');
      } else {
        payRealWinner();
        setResultMessage('You won!');
      }
    } else {
      if (demoMode) {
        loseDemoBet();
        setResultMessage('You lost!');
      }
    }
  };

  const payDemoWinner = () => {
    setDemoBalance(demoBalance + parseFloat(betAmount)); // Double the bet amount in demo mode
  };

  const loseDemoBet = () => {
    setDemoBalance(demoBalance - parseFloat(betAmount)); // Deduct the bet amount in demo mode
  };

  const payRealWinner = async () => {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: publicKey,
        lamports: parseFloat(betAmount) * LAMPORTS_PER_SOL,
      })
    );

    try {
      await sendTransaction(transaction, connection);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-8">
        <input
          type="number"
          className="bg-gray-900 text-white text-center w-72 py-3 rounded-lg shadow-xl border-2 border-blue-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="Enter bet amount (SOL)"
          disabled={loading}
        />
        {demoMode && <p className="text-gray-400 mt-2">Demo Balance: {demoBalance} SOL</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error message */}
      </div>
      <div className="flex space-x-8 mb-12">
        <button
          className={`bg-gradient-to-r text-white font-semibold py-3 px-12 rounded-full shadow-lg transform transition-all ${
            !isBetAmountValid || isBetAmountExceeded ? 'from-gray-400 to-gray-500 cursor-not-allowed' : 'from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600'
          }`}
          onClick={() => flipCoin('heads')}
          disabled={!isBetAmountValid || isBetAmountExceeded || loading} // Disable if amount is invalid or exceeds balance
        >
          Bet on Heads
        </button>
        <button
          className={`bg-gradient-to-r text-white font-semibold py-3 px-12 rounded-full shadow-lg transform transition-all ${
            !isBetAmountValid || isBetAmountExceeded ? 'from-gray-400 to-gray-500 cursor-not-allowed' : 'from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600'
          }`}
          onClick={() => flipCoin('tails')}
          disabled={!isBetAmountValid || isBetAmountExceeded || loading} // Disable if amount is invalid or exceeds balance
        >
          Bet on Tails
        </button>
      </div>

      {/* New Section for Showing Result */}
      {resultMessage && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Result</h2>
          <p className={`text-2xl font-bold ${resultMessage === 'You won!' ? 'text-green-500' : 'text-red-500'}`}>
            {resultMessage}
          </p>
        </div>
      )}

      {/* Show Coin Flip Animation */}
      {flipping && (
        <div className="relative w-32 h-32 mb-12">
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              animation: 'flip 1s infinite linear',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center bg-yellow-400 rounded-full"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
              }}
            >
              <SiSolana className="text-6xl text-purple-500" />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center bg-purple-400 rounded-full"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <RiAliensLine className="text-6xl text-yellow-400" />
            </div>
          </div>
        </div>
      )}

      {/* Show Flip Result After Animation */}
      {!flipping && flipResult && (
        <div className="flex flex-col items-center mt-8 w-32 h-32">
          <div className={`flex justify-center items-center rounded-full p-6 w-full h-full ${flipResult === 'Heads' ? 'bg-yellow-400' : 'bg-purple-400'}`}>
            {flipResult === 'Heads' ? (
              <SiSolana className="text-7xl text-purple-500" />
            ) : (
              <RiAliensLine className="text-7xl text-yellow-400" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Coinflip;
