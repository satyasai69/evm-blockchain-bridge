const ethers = require('ethers');

require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/08568a2c104740e0822b69cbd77b81ab');
const CHSD_ABIJSON = require('./lock.json');

const BRIDGE_WALLET_KEY = process.env.BRIDGE_PRIV_KEY;
const ORIGIN_TOKEN_CONTRACT_ADDRESS = '0x0c6f40B80A5809f72b2FBA13B9fC5803Cf34CF10';

const main = async () => {
  const wallet = new ethers.Wallet(BRIDGE_WALLET_KEY, provider);

  const originTokenContract = new ethers.Contract(
    ORIGIN_TOKEN_CONTRACT_ADDRESS,
    CHSD_ABIJSON.abi,
    wallet
  );

  let options = {
    // your options here
  };


  originTokenContract.on("Received", (sender, amount, event) => {
    console.log(`Received ${amount} from ${sender}`);
    // You can handle the event here
    // await handleEthEvent(event, destinationWebSockerProvider, destinationTokenContract);
});

originTokenContract.on("error", (err) => {
    console.error('Error: ', err);
});

};

main()