import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import MintItem from './MintItem';
import RevenueToken from './RevenueToken'; // Import your RevenueToken component
import RevenueUser from './RevenueUser'; // Import your RevenueUser component
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';

function App() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);

    const handleConnect = (web3Instance, account) => {
        setWeb3(web3Instance);
        setAccount(account);
    };

    return (
        <Router>
            <div className="App">
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to="/">Lingkoop</Navbar.Brand>

                        {/* Left side: Home and Revenue Token */}
                        <Nav className="me-auto">
                            {account && (
                                <>
                                    <Nav.Link as={Link} to="/" className="text-light">Home</Nav.Link>
                                    <Nav.Link as={Link} to="/revenue-token" className="text-light">Buy Revenue Token</Nav.Link> {/* Link to RevenueToken */}
                                </>
                            )}
                        </Nav>

                        {/* Right side: WalletConnect and MyRevenue */}
                        <Nav className="ms-auto">
                            {account && (
                                <Button as={Link} to="/revenue-user" variant="link" className="text-light">
                                    MyRevenue
                                </Button>
                            )}
                            <WalletConnect onConnect={handleConnect} />
                        </Nav>
                    </Container>
                </Navbar>

                <Container className="mt-5">
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Routes>
                                <Route path="/" element={web3 && account ? <MintItem web3={web3} account={account} /> : <p className="text-center">Please connect your wallet.</p>} />
                                <Route path="/revenue-token" element={web3 && account ? <RevenueToken web3={web3} account={account} /> : <p className="text-center">Please connect your wallet.</p>} />
                                <Route path="/revenue-user" element={web3 && account ? <RevenueUser web3={web3} account={account} /> : <p className="text-center">Please connect your wallet.</p>} />
                            </Routes>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Router>
    );
}

export default App;
