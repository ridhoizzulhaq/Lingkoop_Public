import React, { useState } from 'react';
import Web3 from 'web3';

function WalletConnect({ onConnect }) {
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const selectedAccount = accounts[0];
                setAccount(selectedAccount);
                onConnect(web3, selectedAccount);

                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        onConnect(web3, accounts[0]);
                    } else {
                        setAccount(null);
                        onConnect(null, null);
                    }
                });
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }
        } else {
            console.log('Please install MetaMask!');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        onConnect(null, null);
    };

    const explorerLink = account ? `https://sepolia-blockscout.lisk.com/address/${account}?tab=tokens_nfts` : '#';

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={connectWallet} className="btn btn-primary">
                {account ? (
                    <a href={explorerLink} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
                        Check Your NFT Balances: {account}
                    </a>
                ) : (
                    'Connect Wallet'
                )}
            </button>
            {account && (
                <button onClick={disconnectWallet} className="btn btn-secondary ml-2">
                    Logout
                </button>
            )}
        </div>
    );
}

export default WalletConnect;
