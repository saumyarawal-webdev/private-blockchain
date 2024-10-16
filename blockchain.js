// blockchain.js

const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data))
            .digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.createGenesisBlock();
    }

    createGenesisBlock() {
        const genesisBlock = new Block(0, new Date().toLocaleString(), "Genesis Block", "0");
        this.chain.push(genesisBlock);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock, user) {
        // Check if the user is authorized to add blocks
        if (!this.isAuthorized(user)) {
            console.log('User not authorized to add blocks.');
            throw new Error('User not authorized to add blocks');
            
        }
        this.chain.push(newBlock);
    }

    isAuthorized(user) {
        // Replace with your own authorization logic
        const authorizedUsers = ['user1', 'user2']; // Example authorized users
        return authorizedUsers.includes(user);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if the hash is correct
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Check if the previous hash is correct
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = { Blockchain, Block };
