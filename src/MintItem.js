import React, { useState, useEffect } from 'react';
import { Button, Card, ListGroup, Image, Modal } from 'react-bootstrap';
import QRCode from 'qrcode.react';

function MintItem({ web3, account }) {
    const [status, setStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [qrCodeValue, setQrCodeValue] = useState("");
    const [timeLeft, setTimeLeft] = useState(45);

    const contractAddress = "0x51EBd1A609631D2b7B9bf2b9Ba80179dE714b6F1"; 
    const abi = []; // Replace with your contract ABI

    const contract = new web3.eth.Contract(abi, contractAddress);

    const purchaseNFT = async () => {
        try {
            const price = web3.utils.toWei("0.005", "ether"); // Example price
            const itemId = 12; // Example item ID
            const amount = 1; // Example amount

            await contract.methods.purchaseItem(itemId, amount).send({
                from: account,
                value: price,
                gas: 100000, // Set the gas limit here
            });

            setStatus("Purchase successful!");
        } catch (error) {
            setStatus("Purchase failed. Please try again.");
            console.error(error);
        }
    };

    const checkTicketValidity = async () => {
        try {
            const itemId = 12; // Example item ID

            console.log("Checking ticket validity...");

            const balance = await contract.methods.balanceOf(account, itemId).call();
            console.log("Balance for item ID 12:", balance);

            if (balance > 0) {
                setModalMessage("You have a valid ticket");
                generateQrCode(); // Generate initial QR code
                setShowModal(true);
            } else {
                setModalMessage("You don't have a valid ticket");
                setShowModal(true);
            }
        } catch (error) {
            setStatus("Failed to check ticket validity.");
            console.error(error);
        }
    };

    const generateQrCode = () => {
        const url = `https://sepolia-blockscout.lisk.com/address/${account}?tab=tokens_nfts`;
        setQrCodeValue(url);
        setTimeLeft(45); // Reset the timer each time a new QR code is generated
        console.log("QR Code generated:", url);
    };

    useEffect(() => {
        let interval;
        let timer;

        if (showModal && modalMessage === "You have a valid ticket") {
            generateQrCode(); // Generate the first QR code

            // Update QR code every 45 seconds
            interval = setInterval(generateQrCode, 45000);

            // Countdown timer
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    console.log("Time left:", prev - 1);
                    return prev > 0 ? prev - 1 : 45;
                });
            }, 1000);
        }

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, [showModal, modalMessage]);

    const closeModal = () => setShowModal(false);

    return (
        <>
            <Card style={{ width: '300px', margin: '0 auto' }}>
                <Card.Header as="h6">Checkout Ticket</Card.Header>
                <Card.Body>
                    <Image 
                        src="https://img.freepik.com/premium-photo/confetti-fireworks-crowd-music-festival_989072-16.jpg" 
                        alt="NFT Item" 
                        fluid 
                        rounded 
                        className="mb-3"
                        style={{ objectFit: 'cover', width: '100%', height: '150px' }} // Adjust image height
                    />

                    <ListGroup variant="flush" style={{ fontSize: '0.9rem' }}>
                        <ListGroup.Item>
                            <div className="d-flex justify-content-between">
                                <span>Item Name</span>
                                <span>Ticket ABC Concert</span>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <div className="d-flex justify-content-between">
                                <span>Price</span>
                                <span>0.005 ETH</span>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <div className="d-flex justify-content-between">
                                <span>Description</span>
                                <span>This is a dummy ticket.</span>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>

                    <Button 
                        variant="primary" 
                        className="w-100 mt-2" // Adjust margin-top
                        onClick={purchaseNFT}
                        size="sm" // Smaller button size
                    >
                        Buy Ticket
                    </Button>

                    <Button 
                        variant="secondary" 
                        className="w-100 mt-2 text-white" 
                        onClick={checkTicketValidity}
                        size="sm" // Smaller button size
                    >
                        Use Ticket (If You Have It)
                    </Button>

                    {status && <p className="mt-2 text-center">{status}</p>} {/* Adjust margin-top */}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={closeModal} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Ticket Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalMessage}
                    {modalMessage === "You have a valid ticket" && (
                        <div className="mt-3 text-center">
                            <QRCode value={qrCodeValue} size={128} />
                            <p className="mt-2">QR code will refresh in {timeLeft} seconds.</p>
                        </div>
                    )}
                    <p className="mt-3 text-muted" style={{ fontSize: '0.8rem' }}>
                        Note: At this stage, we are only providing an overview and have not yet implemented QR Code secure verification.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeModal} size="sm">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MintItem;
