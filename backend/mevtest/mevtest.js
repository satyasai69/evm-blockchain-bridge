const Web3 = require('web3') 


require('dotenv').config()

const  originWebSockerProvider = new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/08568a2c104740e0822b69cbd77b81ab')//('wss://goerli.infura.io/ws/v3/08568a2c104740e0822b69cbd77b81ab')
const originHttpProvider = new Web3.providers.HttpProvider('https://testnet-rpc.nurascan.com')

const CHSD_ABIJSON = require('./mevAbI.json')

const BRIDGE_WALLET_KEY = process.env.BRIDGE_PRIV_KEY
const ORIGIN_TOKEN_CONTRACT_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const main = async () => {
 

  const web3 = new Web3(originWebSockerProvider);//(originWebSockerProvider);
  web3.eth.accounts.wallet.add(BRIDGE_WALLET_KEY);




  //const originHttpProvider = new Web3.providers.HttpProvider('https://testnet-rpc.nurascan.com')//('https://goerli.infura.io/v3/08568a2c104740e0822b69cbd77b81ab')

  //originWebSockerProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY)

    const originTokenContracts = new web3.eth.Contract(
        CHSD_ABIJSON.abi,
        ORIGIN_TOKEN_CONTRACT_ADDRESS
      )


      let options = {
       // filter: {
            // Replace '1000' with the minimum amount of ETH you're interested in
            //value: ['0.0000000001']
       // },
        fromBlock: 'latest',
        //toBlock: 'latest',
    };

    originTokenContracts.events
    /*.Transfer*/.PairCreated(options)
    .on('data', async (event) => {
      console.log(`Pair created: token0 = ${event.returnValues.token0}, token1 = ${event.returnValues.token1}, pair = ${event.returnValues.pair}`);
      /*await handleEthEvent(
        event,
        destinationWebSockerProvider,
        destinationTokenContract 
      ) */
    })
    .on('error', (err) => {
      console.error('Error: ', err)
    })
  console.log(`Waiting for Transfer events on `) //${ORIGIN_TOKEN_CONTRACT_ADDRESS}`)
}

main()