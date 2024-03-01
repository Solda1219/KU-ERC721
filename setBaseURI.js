const { Web3 } = require('web3');
const ethers = require('ethers');

// Create Web3 instance
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');
const abifile = require("./artifacts/contracts/KU_OCEAN.sol/KU_OCEAN.json");

const privateToaddr= web3.eth.accounts.privateKeyToAccount('0xf925f6975c5100f91b1bada3c9b3aecc6604753fd7d7c620ea3a43dff9611358');


const accountFrom = {
    privateKey: privateToaddr.privateKey,
    address: privateToaddr.address,
};


const contractAddress = '0xC4ef5790D0762b06cD10bf694E9483B39404c730'; 
const ku= new web3.eth.Contract(abifile.abi, contractAddress);
const baseURI= "ipfs://";
const setBaseURITx= ku.methods.setBaseURI(baseURI);

const setBaseURI= async () =>{
    const gasEx= await web3.eth.getGasPrice();
    console.log("gasEx", gasEx);
    // console.log("tx gas", web3.utils.toHex(await setBaseURITx.estimateGas()));
    console.log("gas pR", web3.utils.toHex(await web3.eth.getGasPrice()));
    console.log("nonce", web3.utils.toHex(await web3.eth.getTransactionCount(accountFrom.address)));
    const tx= {
        to: contractAddress,
        data: setBaseURITx.encodeABI(),
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        gasLimit: web3.utils.toHex(90000),
        nonce: web3.utils.toHex(await web3.eth.getTransactionCount(accountFrom.address)),
    }
    
    const createTransaction = await web3.eth.accounts.signTransaction(
      tx,
      accountFrom.privateKey
    );
      console.log("createTx", createTransaction);
    // 8. Send transaction and wait for receipt
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
}
  
setBaseURI();



// 5. Create get function
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // 6. Call contract
  const data = await ku.methods._baseURIextended().call();
//   const data1= await ku.methods.isAuthorized(accountFrom.address).call();

  console.log(`The current base uri stored is: ${data}`);
};

// 7. Call get function
// get();
// pri();