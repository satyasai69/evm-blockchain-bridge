// Create a web3 instance
const Web3 = require('web3') 
// Define the ABI of the contract
const contractAbi = require('./mevAbI.json')



const  originWebSockerProvider = new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/08568a2c104740e0822b69cbd77b81ab')//('wss://goerli.infura.io/ws/v3/08568a2c104740e0822b69cbd77b81ab')

const web3 = new Web3(originWebSockerProvider);//(originWebSockerProvider);

// Define the address of the contract
const contractAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // replace with your contract's address

// Create a contract instance
const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);

// Define the options for the event listener
const options = {
    fromBlock: 'latest'
};

// Listen for the 'MyEvent' event
contract.events.PairCreated(options)
    .on('data', (event) => {
        console.log(`Pair created: token0 = ${event.returnValues.token0}, token1 = ${event.returnValues.token1}, pair = ${event.returnValues.pair}`);
    })
    .on('error', console.error);