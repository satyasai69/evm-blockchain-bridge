const Web3 = require("web3");

//load env file
require('dotenv').config()

const DESTINATION_TOKEN_CONTRACT_ADDRESS =
  process.env.DESTINATION_TOKEN_CONTRACT_ADDRESS; //'0x781F9421611f96d58FD26BE7bA4FEC58A972d198'//'0xb4525f7e08B205C8D578abf0CBf9E2f5fF97e3da'//process.env.destinationTokenContract
const destinationWebSockerProvider = new Web3.providers.WebsocketProvider(
  process.env.DESTINATION_WSS_ENDPOINT,
);
const originWebSockerProvider = new Web3.providers.WebsocketProvider(
  process.env.ORIGIN_WSS_ENDPOIN,
);
const ORIGIN_TOKEN_CONTRACT_ADDRESS = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS; //'0x7D4557Fb6f3a24915bF7076a814C5acFD6BD671B'

const BRIDGE_WALLET = process.env.BRIDGE_WALLET;
const Bridge_contract = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS;

const {
  mintTokens,
  approveForBurn,
  burnTokens,
  transferToEthWallet,
} = require("./contract-methods-test");

require("dotenv").config();

const handleEthEvent = async (event, provider, contract) => {
  console.log("handleEthEvent");
  //const { from, to, value } = event.returnValues
  const { amount, sender, receiver } = event.returnValues;
  /*console.log('to :>> ', receiver )
  console.log('from :>> ', sender)
  console.log('value :>> ', amount)
  console.log('============================') */

  /*if (from == BRIDGE_WALLET) {
    console.log('Transfer is a bridge back')
    return
  } */
  if (Bridge_contract == Bridge_contract) {
    //&& to != from) {
    console.log(
      "Tokens Locked on bridge contrant from nura chain! Time to bridge to BSC chain!",
    );

    try {
      const tokensMinted = await mintTokens(provider, contract, amount, sender);
      //console.log(provider, contract, amount, sender)
      if (!tokensMinted) return;
      //console.log('🌈🌈🌈🌈🌈 Bridge to destination completed')
    } catch (err) {
      console.error("Error processing transaction", err);
      // TODO: return funds
    }
  } else {
    console.log("Another transfer");
  }
};

const handleDestinationEvent = async (
  event,
  provider,
  contract,
  providerDest,
  contractDest,
) => {
  const { sender, to, amount } = event.returnValues;
  /*console.log('handleDestinationEvent')
  console.log('to :>> ', to)
  console.log('from :>> ', sender)
  console.log('value :>> ', amount)
  console.log('============================') */

  if (sender == process.env.WALLET_ZERO) {
    console.log("Tokens minted");
    return;
  }

  if (BRIDGE_WALLET == BRIDGE_WALLET && to != sender) {
    /* console.log(
      'Tokens received on bridge from destination chain! Time to bridge back!'
    ) */
    //console.log(amount,'DTokens bridge brun by ', sender,'on BSC chain ')

    try {
      // we need to approve burn, then burn
      /* const tokenBurnApproved = await approveForBurn(
        providerDest,
        contractDest,
        value
      )
      if (!tokenBurnApproved) return
      console.log('Tokens approved to be burnt')
      const tokensBurnt = await burnTokens(providerDest, contractDest, value)

      if (!tokensBurnt) return
      console.log(
        'Tokens burnt on destination, time to transfer tokens in ETH side'
      ) */
      const transferBack = await transferToEthWallet(
        provider,
        contract,
        amount, //value,
        sender, //from
      );
      if (!transferBack) return;

      //console.log('Tokens transfered to ETH wallet')
      //console.log('🌈🌈🌈🌈🌈 Bridge back operation completed')
    } catch (err) {
      console.error("Error processing transaction", err);
      // TODO: return funds
    }
  } else {
    console.log("Something else triggered Transfer event");
  }
};

const originHttpProvider = new Web3.providers.HttpProvider(
  process.env.ORIGIN_HTTP_ENDPOINT,
);

const CHSD_ABIJSON = require("./lock.json");
//const QCHSD_ABIJSON = require('./TokenTest.json')
const QCHSD_ABIJSON = require("./DToken.json");

const main = async () => {
  const BRIDGE_WALLET_KEY = process.env.BRIDGE_PRIV_KEY;

  //const web3 = new Web3(originWebSockerProvider);//(originWebSockerProvider);
  // const web3d = new Web3(destinationWebSockerProvider);

  const originWebSockerProvider = new Web3(process.env.ORIGIN_WSS_ENDPOINT);

  const destinationWebSockerProvider = new Web3(
    process.env.DESTINATION_WSS_ENDPOINT,
  );

  destinationWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY);

  originWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY);
  // web3d.eth.accounts.wallet.add(BRIDGE_WALLET_KEY);

  //const originHttpProvider = new Web3.providers.HttpProvider('https://testnet-rpc.nurascan.com')//('https://goerli.infura.io/v3/08568a2c104740e0822b69cbd77b81ab')

  //originWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY)

  const originTokenContracts = new originWebSockerProvider.eth.Contract(
    CHSD_ABIJSON.abi,
    ORIGIN_TOKEN_CONTRACT_ADDRESS,
  );

  const destinationTokenContract =
    new destinationWebSockerProvider.eth.Contract(
      QCHSD_ABIJSON.abi,
      DESTINATION_TOKEN_CONTRACT_ADDRESS,
    );

  let options = {
    filter: {
      // Replace '1000' with the minimum amount of ETH you're interested in
      value: ["0.0000000001"],
    },
    fromBlock: "latest",
  };

  originTokenContracts.events
    /*.Transfer*/ .Received(options)
    .on("data", async (event) => {
      // Wait for the transaction to be confirmed
      console.log(
        "====🛰️====💸💸💸💸💸====🛰️======💸💸💸💸💸======🛰️======💸💸💸💸💸=====🛰️======",
      );
      //console.log(`Received ${event.returnValues.amount} from ${event.returnValues.sender}. Transaction hash: ${event.transactionHash}`);
      await handleEthEvent(
        event,
        destinationWebSockerProvider,
        destinationTokenContract,
      );
    })
    .on("error", (err) => {
      console.error("Error: ", err);
    });

  destinationTokenContract.events
    /*.Transfer*/ .Burn(options)
    .on("data", async (event) => {
      console.log(
        "====🛰️====💸💸💸💸💸====🛰️======💸💸💸💸💸======🛰️======💸💸💸💸💸=====🛰️======",
      );
      console.log(
        `Burn 🔥🔥🔥 on BSC --- https://testnet.bscscan.com/tx/${event.transactionHash}`,
      );
      await handleDestinationEvent(
        event,
        originWebSockerProvider,
        originTokenContracts,
        destinationWebSockerProvider,
        destinationTokenContract,
      );
      // console.log(` Amount: ${event.returnValues.amount}  Token: ${event.address} spender: ${event.returnValues.sender}`);
    })
    .on("error", (err) => {
      console.error("Error: ", err);
    });

  console.log(`Waiting for Transfer events🛰️🛰️🛰️ on BSC and NUSA `); //${ORIGIN_TOKEN_CONTRACT_ADDRESS}`)
};

main();
