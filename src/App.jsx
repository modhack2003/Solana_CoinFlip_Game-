// App.js

import React, { useState, useEffect } from 'react';
import WalletContextProvider from './components/WalletContextProvider';
import Coinflip from './components/Coinflip';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { IoInvertModeOutline, IoInvertModeSharp } from "react-icons/io5";
import { Tooltip as ReactTooltip } from 'react-tooltip';

function App() {
  const [demoMode, setDemoMode] = useState(true); // Default to demo mode
  const [showTooltip, setShowTooltip] = useState(false); // Control tooltip visibility

  // Show tooltip when the button is pressed
  const handleModeToggle = () => {
    setDemoMode(!demoMode); // Toggle mode

    // Show tooltip after mode is changed for 3 seconds
    setShowTooltip(true);
    const timer = setTimeout(() => {
      setShowTooltip(false); // Hide after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup
  };

  return (
    <WalletContextProvider>
      <div className="min-h-screen flex flex-col items-center justify-evenly bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white font-sans">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 animate-pulse">
            Solana Coinflip
          </h1>

          <div className="flex mt-6 absolute top-2 right-20">
            {!demoMode && (
              <WalletMultiButton className="wallet-button bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-md transition-all hover:scale-105 transform mt-4" />
            )}
            <button
              className={`px-4 py-4 rounded-md text-black ${
                demoMode ? 'bg-blue-500 ' : 'bg-[#512DA8] rounded-l-none '
              } text-white`}
              onClick={handleModeToggle} // Show tooltip for 3s after toggle
              data-tooltip-id="mode-toggle-tooltip"
              data-tooltip-content={demoMode ? "Switch to Live Mode" : "Switch to Demo Mode"}
            >
              {demoMode ? <IoInvertModeOutline /> : <IoInvertModeSharp />}
            </button>

            {/* Tooltip only shows on hover or after the button is clicked */}
            <ReactTooltip
              id="mode-toggle-tooltip"
              place="bottom"
              effect="solid"
              type="light"
              openOnClick={true} // Show when clicked
              className="animate-bounce"
            />
          </div>
        </header>
        <Coinflip demoMode={demoMode} />
      </div>
    </WalletContextProvider>
  );
}

export default App;
