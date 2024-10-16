// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, Block } = require('./blockchain');  // Import Blockchain and Block classes

// Initialize the Express app
const app = express();
const PORT = 3000;

// Create a new instance of Blockchain
const myBlockchain = new Blockchain();

// Use middleware to parse JSON data
app.use(bodyParser.json());

// Define the /blockchain route (GET)
app.get('/blockchain', (req, res) => {
    console.log('GET request received at /blockchain'); // Log when this endpoint is hit
    console.log('Current Blockchain:', JSON.stringify(myBlockchain, null, 2)); // Log the current state of the blockchain
    res.json(myBlockchain);
});

// Define the /mineBlock route (POST)
app.post('/mineBlock', (req, res) => {
    const data = req.body.data;  // Extract data from the request
    const user = req.body.user;   // Extract user from the request

    const newBlock = new Block(
        myBlockchain.chain.length,     
        new Date().toLocaleString(),   
        data,                          
        myBlockchain.getLatestBlock().hash  
    );

    try {
        myBlockchain.addBlock(newBlock, user);
        console.log('New Block Added:', newBlock);
        res.json({ message: 'Block added successfully', blockchain: myBlockchain });
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
});

// Define the /verify route (GET) to verify the blockchain
app.get('/verify', (req, res) => {
    console.log('GET request received at /verify'); // Log when this endpoint is hit
    const isValid = myBlockchain.isChainValid(); // Check if the blockchain is valid

    if (isValid) {
        res.json({ message: 'Blockchain is valid' });
        console.log('Blockchain is valid.');
    } else {
        res.status(400).json({ message: 'Blockchain is not valid' });
        console.log('Blockchain is not valid.');
    }
});

// Define the /delete route (DELETE) to delete a block by index
app.delete('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index); // Get the index from the request parameters

    // Check if the index is valid
    if (index < 0 || index >= myBlockchain.chain.length) {
        return res.status(400).json({ message: 'Invalid block index' });
    }

    // Remove the block from the blockchain
    const removedBlock = myBlockchain.chain.splice(index, 1)[0]; // Remove block by index

    // Log the removed block and the updated blockchain in the terminal
    console.log('Block Deleted:', removedBlock);
    console.log('Updated Blockchain:', myBlockchain);

    // Send response back to Postman
    res.json({ message: 'Block deleted successfully', removedBlock, blockchain: myBlockchain });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Blockchain server is running on port ${PORT}`);
});
