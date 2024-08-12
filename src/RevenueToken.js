import React, { useState, useEffect } from 'react';
import { Button, Card, ProgressBar, Form } from 'react-bootstrap';

function RevenueToken({ web3, account }) {
    const [amountToMint, setAmountToMint] = useState("");
    const [status, setStatus] = useState(null);
    const [creator, setCreator] = useState("");
    const [creatorPortion, setCreatorPortion] = useState(0);
    const [pricePerToken, setPricePerToken] = useState(0);
    const [targetInvestment, setTargetInvestment] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [progress, setProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState("");

    const contractAddress = "0x73DeAB1fF060B80FbCD980F3713EEbe2Cfdb1036"; 
    const abi = []; // Masukkan ABI kontrak di sini

    const contract = new web3.eth.Contract(abi, contractAddress);
    const revenueItemId =230;

    // Fungsi ini menghitung hitung mundur 30 hari dari sekarang
    const calculateCountdown = (deadline) => {
        const now = new Date().getTime();
        const timeLeft = deadline - now;

        if (timeLeft <= 0) {
            return "Investment period ended";
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const fetchTokenData = async () => {
        try {
            const item = await contract.methods.revenueItems(revenueItemId).call();
            setCreator(item.creator);
            setCreatorPortion(Number(item.creatorPortion));
            setPricePerToken(Number(item.pricePerToken));
            setTargetInvestment(Number(item.targetInvestment));
            setTotalTokens(Number(item.totalTokens));
            setTotalSupply(Number(item.totalSupply));
            setProgress((Number(item.totalSupply) / Number(item.totalTokens)) * 100);

            // Set investment deadline as 30 days from the creation time
            const creationDate = new Date();
            creationDate.setDate(creationDate.getDate() + 30);
            const deadline = creationDate.getTime();

            setInterval(() => {
                setTimeRemaining(calculateCountdown(deadline));
            }, 1000);
        } catch (error) {
            console.error("Error fetching token data:", error);
        }
    };

    useEffect(() => {
        fetchTokenData(); 
    }, []);

    const handleMinting = async () => {
        try {
            const weiAmount = web3.utils.toWei(amountToMint, "ether");
            const tokensToMint = weiAmount / pricePerToken;

            await contract.methods.mintRevenueToken(revenueItemId, tokensToMint).send({
                from: account,
                value: weiAmount,
                gas: 100000,
            });

            setStatus("Minting successful!");
            fetchTokenData();
        } catch (error) {
            setStatus("Minting failed. Please try again.");
            console.error(error);
        }
    };

    return (
        <Card style={{ width: '300px', margin: '0 auto' }}>
			<Card.Header as="h1">Next Project</Card.Header>
            <Card.Header as="h6">ABC Stand Up Comedy Revenue Share</Card.Header>
            <Card.Body>
                <div>
                    <p><strong>Creator Address:</strong> {creator}</p>
                    <p><strong>Creator Portion:</strong> {creatorPortion}%</p>
                    <p><strong>Price per Token:</strong> {web3.utils.fromWei(pricePerToken.toString(), 'ether')} ETH</p>
                    <p><strong>Target Investment:</strong> {web3.utils.fromWei(targetInvestment.toString(), 'ether')} ETH</p>
                    <p><strong>Total Tokens:</strong> {totalTokens}</p>
                    <p><strong>Total Supply:</strong> {totalSupply}</p>
                    <p><strong>Investment Deadline</strong> (not implemented yet in smart contract):
                        <strong> {timeRemaining}</strong>
                    </p>
                </div>
                <Form>
                    <Form.Group controlId="formMintAmount">
                        <Form.Label>Enter Ether Amount</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={amountToMint}
                            onChange={(e) => setAmountToMint(e.target.value)}
                            placeholder="0.001 ETH (min)" 
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        className="w-100 mt-3" 
                        onClick={handleMinting}
                        disabled={!amountToMint || amountToMint < 0.001}
                    >
                        Mint Tokens
                    </Button>
                </Form>

                {status && <p className="mt-3 text-center">{status}</p>}

                <div className="mt-3">
                    <ProgressBar now={progress} label={`${progress.toFixed(2)}%`} />
                    <p className="text-center mt-2">
                        Total Minted: {totalSupply}/{totalTokens} Tokens
                    </p>
                </div>
            </Card.Body>
        </Card>
    );
}

export default RevenueToken;
