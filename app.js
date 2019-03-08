console.log("hi")

const Maker = require('@makerdao/dai');

console.log(Maker)


/*
Maker.create('http',{
        privateKey: YOUR_PRIVATE_KEY,
        url: 'https://kovan.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    })
        .then(maker => { window.maker = maker })
        .then(() => maker.authenticate())
      .then(() => maker.openCdp())
      .then(cdp => console.log(cdp.id));



// ### Variable Definition ###

var web3 = new Web3(Web3.givenProvider);

var utils = web3.utils;


// HTML elements to add and delete

// For fee sharing program
const walletId = "0x1bF3e7EDE31dBB93826C2aF8686f80Ac53f9ed93"

// Ether balance to update it according to the addresses ether balance
let etherBalance;

// TO check whether proposed Gas price is lower than 10, if so, set to 10 automatically
let defaultGasPrice;
let chosenGasPrice;

// Define variable successful, which if set to false, will stop after the first tx and avoid asking to user to confirm the second one.
let successful;

// Counter to protect users from creating two event listeners on the swap button that will result in 2 tx's to be signed
let counter = 0

// ############# Functions ###############

// Function to be called after the final event has been triggered
function reloadMainPage() {
  location.reload();
};


// Change Swap to Loader and back

// Change Swap button to Loader
function swapToLoader() {
  swapButton.style.display = "none";
  swapButtonDiv.insertAdjacentHTML("afterbegin", loader);
}

// Change Loader back to Swap Button
function loaderToSwap() {
  document.querySelector('.loader').remove();
  swapButton.style.display = "";
}

// Check if web3 is injected
window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined' && web3.currentProvider !== null) {
    console.log('web3 is enabled')
    if (web3.currentProvider.isMetaMask === true) {
      console.log('MetaMask is active')
    } else {
      console.log('MetaMask is not available')
    }
    // opens web3 client
    ethereum.enable();
    // Change modal to only show title and close button
    modalBody.style.display = "none";
    metaMaskBtn.style.display = "none";
  } else {
    // Change inner HTML of Error message
    console.log('web3 is not found')
    console.log('Please install Metamask')
    $('.modal').modal('show');
    // Create Error Message
  }
})


// Check if client is on the right network and create alert if not
web3.eth.net.getNetworkType()
.then((result) => {
  if (`${result}` == "main" && selectedEthereumNetwork == "ropsten") {
    modalTitle.innerText = "Please switch your web3 client to the Ropsten Testnet";
    $('.modal').modal('show');
  } else if (`${result}` == "ropsten" && selectedEthereumNetwork == "mainnet") {
      modalTitle.innerText = "Please switch your web3 client to the Mainnet";
      $('.modal').modal('show');
  } else if (`${result}` == "ropsten" && selectedEthereumNetwork == "ropsten") {return 0;
  } else if (`${result}` == "main" && selectedEthereumNetwork == "mainnet") {return 0;
  } else {
      modalTitle.innerText = "Please switch your web3 client to either Mainnet or Ropsten";
      $('.modal').modal('show');
  }
})

// Set ETH Balance to show on front end
async function setEthBalance(fetchedUserAddress) {
  etherBalance = await web3.eth.getBalance(fetchedUserAddress)
  if (addressToSell == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
  document.getElementById('sell-max-token').innerText = `Max: ${(etherBalance / 10 ** srcDecimal).toFixed(5)} ${srcSymbol}`
  }
}

async function getEthereumGasPrice() {
  defaultGasPrice = await web3.eth.getGasPrice()
  chosenGasPrice = (defaultGasPrice < 10000000000) ? `${10000000000}` : `${defaultGasPrice}`;
}

getEthereumGasPrice()


// Check if user swapped web3 accounts & Set initial Ether Balance

function newMetaMaskAddress(error,data) {
  fetchedUserAddress = `${error['selectedAddress']}`
  if(fetchedUserAddress !== "undefined") setEthBalance(fetchedUserAddress);
}

web3.currentProvider.publicConfigStore.on('update', newMetaMaskAddress);

*/