import React, { useState, useEffect } from 'react';
import { Button, Card, ProgressBar, Row, Col } from 'react-bootstrap';

function RevenueUser({ web3, account }) {
    const [revenueItem, setRevenueItem] = useState({});
    const [tokenBalance, setTokenBalance] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [pendingWithdraw, setPendingWithdraw] = useState(0);
    const [status, setStatus] = useState(null);

    const contractAddress = "0x73DeAB1fF060B80FbCD980F3713EEbe2Cfdb1036"; 
    const abi = []; // Masukkan ABI kontrak di sini

    const contract = new web3.eth.Contract(abi, contractAddress);

    useEffect(() => {
        const fetchData = async () => {
			try {
				const id = 12; // Contoh ID revenue item
				const item = await contract.methods.revenueItems(id).call();
				const balance = await contract.methods.balanceOf(account, id).call();
				const totalSupply = await contract.methods.totalSupply(id).call();
				const pendingWithdraw = await contract.methods.pendingWithdrawals(id, account).call();
		
				setRevenueItem({
					id,
					creator: item.creator,
					creatorPortion: item.creatorPortion,
					pricePerToken: web3.utils.fromWei(item.pricePerToken.toString(), "ether"),
					targetInvestment: web3.utils.fromWei(item.targetInvestment.toString(), "ether"),
					totalTokens: Number(item.totalTokens),
				});
				setTokenBalance(Number(balance));
				setTotalSupply(Number(totalSupply));
				setPendingWithdraw(web3.utils.fromWei(pendingWithdraw.toString(), "ether"));
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		

        fetchData();
    }, [contract, account]);

    const withdrawRoyalty = async () => {
        try {
            await contract.methods.withdrawRoyalty(revenueItem.id).send({
                from: account,
                gas: 100000,
            });

            setStatus("Withdrawal successful!");
            setPendingWithdraw(0);
        } catch (error) {
            setStatus("Withdrawal failed. Please try again.");
            console.error(error);
        }
    };

    return (
		
        <div>
            {/* Bagian Deskripsi Revenue Item */}
            <Card className="mb-4">
                <Card.Header as="h5">Your Revenue Item Details : ABC Concert</Card.Header>
                <Card.Body>
                    <p><strong>ID:</strong> {revenueItem.id}</p>
                    <p><strong>Creator:</strong> {revenueItem.creator}</p>
                    <p><strong>Creator Portion : 30 </strong> %</p>  {/* masih ditulis manual */}
					<p><strong>Public Ownership : 70 </strong> %</p>  {/* masih ditulis manual */}
                    <p><strong>Total Tokens (Maximum tokens that can be minted):</strong> {revenueItem.totalTokens}</p>
                    <p><strong>Target Investment:</strong> {revenueItem.targetInvestment} ETH</p>
                </Card.Body>
            </Card>

            {/* Bagian Your Investment Info */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header as="h5">Your Investment Info</Card.Header>
                        <Card.Body>
                            <ProgressBar
                                now={(tokenBalance / totalSupply) * 100}
                                label={`${((tokenBalance / totalSupply) * 100).toFixed(2)}% of Total Supply (Public Ownersip)`}
                            />
                            <p className="mt-3">
                                Your Token Balance: <span>{tokenBalance}</span> / <span>{totalSupply}</span>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header as="h5">Pending Withdrawals</Card.Header>
                        <Card.Body>
                            <p>Pending Withdrawal Balance: {pendingWithdraw} ETH</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Bagian Penarikan */}
            <Button 
                variant="secondary" 
                className="w-100 mb-3" 
                onClick={withdrawRoyalty}
            >
                Withdraw Revenue
            </Button>
            {/* Status */}
            {status && <p className="text-center">{status}</p>}
        </div>
    );
}

export default RevenueUser;
