// Aaeve declaration
const Marketplace = require('aave-js').Marketplace;
const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan-node.ethlend.io/`));
const web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/process.env.PRIVATE_KEY`));


const Tx = require('ethereumjs-tx');
const privateKey = Buffer.from('process.env.PRIVATE_KEY', 'hex')
const privateKey2 = Buffer.from('process.env.PRIVATE_KEY', 'hex')
const borrowerAddress = "0x518eAa8f962246bCe2FA49329Fe998B66d67cbf8";
const lenderAddress = "0xb779bEa600c94D0a2337A6A1ccd99ac1a8f08866"; 

async function getTxCount() {
  // Get tx count
  txCount = await web3.eth.getTransactionCount(borrowerAddress);
  return txCount
}

async function getTxCount2() {
  // Get tx count
  txCount = await web3.eth.getTransactionCount(lenderAddress);
  return txCount
}


// 1. Sign the user up in order to get the secret API key
async function signup() {
    console.log("Start Environment")
    const signupParams = [
      'test998@test.com',
      "hilmar3",
      'dshaksajdhkasdh',
    ]
    const marketplace = new Marketplace("");
    try {
      const API_SECRET_KEY = await marketplace.utils.signup(...signupParams);
      console.log(API_SECRET_KEY);
    }
    catch(e) {
      console.log(e)
    }
    
    console.log("done");
}



// 2. Set Marketplace variable with collected API Key
const marketplace = new Marketplace('7d998a7163445d231e0a9f5d92203dcd711635ef21cd35b273');
const marketplace2 = new Marketplace('4863efb8610ab111fb545d95daa557ef773b3cdef96ddef48c');

// 3. Create a new borrow request with the rate being 1% under Makers rate

async function createLoanRequest() {
  // monthly rate is the Maker rate - 1% divided by 12 months
  const monthlyRate = (0.025 - 0.01) / 12
  console.log(`Monthly Rate: ${monthlyRate * 100}%`)
  const collateralAmount = 0.25;
  const collateralType = "ETH";
  console.log(`Collateral: ${collateralAmount} ${collateralType}`)
  const loanCurrency = "DAI";
  
  // We get the maximum loan amount, depending on the Loan-To-Value ratio allowed
  console.log("### Get Max Loan Amount ###")
  const maxLoanAmount = await marketplace.utils.getMaxLoanAmountFromCollateral(
    collateralAmount, collateralType, loanCurrency
  );
  console.log("✅")
  
  //console.log(`Max Loan Amount: ${collateralAmount} ${loanCurrency}`)

  const loanRequestParams = {
      loanAmount: maxLoanAmount,
      moe: loanCurrency,
      collateralAmount: collateralAmount,
      collateralType: collateralType,
      mpr: monthlyRate,
      duration: 2
  };
  
  // Get Data
  console.log("### Call create Method  ###")
  const rawTx = await marketplace.requests.create(borrowerAddress,loanRequestParams)
  console.log("✅")

  transactionCount = await getTxCount()
  const rawTx2 = {
    nonce: web3.utils.toHex(transactionCount),
    gasPrice: web3.utils.toHex(rawTx.gasPrice * 10),
    gasLimit: web3.utils.toHex(rawTx.gas),
    to: rawTx.to,
    from: rawTx.from,
    value: web3.utils.toHex(rawTx.value),
    data: rawTx.data
  }

  // Create Tx
  const tx = new Tx(rawTx2);
  // console.log(tx.gasLimit.toString())

  // Sign Tx
  console.log("### Sign Tx ###")
  tx.sign(privateKey);
  console.log("✅")

  // Serialize Tx
  const serializedTx = tx.serialize()

  // Send signed Tx
  console.log("### Send Create Tx ###")
  await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  .on('receipt', function(data) {
    // console.log(data)
    console.log("✅Tx mined & Loan request created")
  })
  .catch(error => {
    console.log(error)
  });

}

// 4. Place collateral in loan request
async function placeCollateral() {
  // Get all loan requests
  console.log("## Get all Loan requests of user")
  const requestsAddressesByBorrower = await marketplace.requests.getDataAllLoansByBorrower(borrowerAddress)
  console.log("✅")

  // Get last loan request
  requestAddress = requestsAddressesByBorrower[requestsAddressesByBorrower.length - 1].loanAddress;
  //console.log(requestAddress);

  
  // Get data of loan
  console.log("### Get data of last loan created ###")
  loanData = await marketplace.requests.getLoanData(requestAddress)
  console.log("✅")
  
  //console.log(loanData)
  
  const { loanAddress, collateralType, collateralAmount, state } = loanData;
  
  const isCollateralPriceUpdated = await marketplace.requests.isCollateralPriceUpdated(loanAddress)


  // Check if price is updated
  if (!isCollateralPriceUpdated.updated) {
    console.log("### Update price ###")
    // Fetch updated price transactions
    rawTxPriceUpdate = await marketplace.requests.refreshCollateralPrice(loanAddress, borrowerAddress)
    // console.log(rawTxPriceUpdate)

    // Get tx count
    transactionCount = await getTxCount()

    // Make updated tx object
    const priceUpdateTx = {
      nonce: web3.utils.toHex(transactionCount),
      gasPrice: web3.utils.toHex(rawTxPriceUpdate.gasPrice * 20),
      gasLimit: web3.utils.toHex(rawTxPriceUpdate.gas * 2),
      value: web3.utils.toHex(rawTxPriceUpdate.value),
      to: rawTxPriceUpdate.to,
      from: rawTxPriceUpdate.from,
      data: rawTxPriceUpdate.data
    }
    // console.log(priceUpdateTx)
    
  
    // Create Tx
    const tx = new Tx(priceUpdateTx);
    // console.log(tx.gasLimit.toString())
  
    // Sign Tx
    tx.sign(privateKey);
    // console.log("tx3 signed")
  
    // Serialize Tx
    const serializedTx = tx.serialize()
  
    // Send signed Tx
  
    txReceipt5 = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .catch(error => {
      console.log(error)
    })
    // console.log(txReceipt5);
    console.log("✅")
  }

  // console.log(`Price updated: ${isCollateralPriceUpdated.updated}`)
  
  if (state === "WaitingForCollateral") {
    
      const isApproved = await marketplace.utils.isTransferApproved(
        borrowerAddress, collateralType, collateralAmount
      );
      // console.log(isApproved)
      if (!isApproved) {
        console.log("## Approve ERC20 Transfer")
        const approveTx = await marketplace.utils.approveTransfer(borrowerAddress, collateralType);
        // console.log(approveTx)
        // console.log("approved")
        // Send approval tx
        transactionCount = await getTxCount()
        // console.log(`TX count: ${transactionCount}`)

        const rawTx2 = {
          nonce: web3.utils.toHex(transactionCount),
          gasPrice: web3.utils.toHex(approveTx.gasPrice * 10),
          gasLimit: web3.utils.toHex(approveTx.gas),
          to: approveTx.to,
          from: approveTx.from,
          value: web3.utils.toHex(approveTx.value),
          data: approveTx.data
        }
      
        // Create Tx
        const tx = new Tx(rawTx2);
      
        // Sign Tx
        tx.sign(privateKey);
        // console.log("tx1 signed")
      
        // Serialize Tx
        const serializedTx = tx.serialize()
      
        // Send signed Tx
        
        txReceipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        // console.log(txReceipt);
        console.log("✅");
      
      }
      // console.log(`Loan: ${loanAddress}, Borrower: ${borrowerAddress}`)
      console.log("### Place Collateral ###")
      const collateralTx = await marketplace.requests.placeCollateral(loanAddress, borrowerAddress);
      // console.log(collateralTx)
      
      transactionCount = await getTxCount()
      // console.log(`TX count: ${transactionCount}`)

      const rawTx3 = {
        nonce: web3.utils.toHex(transactionCount),
        gasPrice: web3.utils.toHex(collateralTx.gasPrice * 10),
        gasLimit: web3.utils.toHex(collateralTx.gas * 14),
        to: collateralTx.to,
        from: collateralTx.from,
        data: collateralTx.data
      }
      // console.log(rawTx3)
      
      // Create Tx
      const tx = new Tx(rawTx3);
      // console.log(tx.gasLimit.toString())
    
      // Sign Tx
      tx.sign(privateKey);
      // console.log("tx3 signed")
    
      // Serialize Tx
      const serializedTx = tx.serialize()
    
      // Send signed Tx
      console.log("### Send Place Collateral Tx ###")
      txReceipt2 = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .then(response => {
        console.log("### ✅Collateral placed successfully ###")
      })
      .catch(error => {
        console.log(error)
      })
      // console.log(txReceipt2);
      
  } 
}

// Get all available lending options
// System checks if any fixed interest rate loans are available on ETHLend and “hey” there is one

async function getLoans() {
  ethLoans = []
  const requestsData = await marketplace.requests.getDataAllLoans();
  //console.log(requestsData)+
  requestsData.forEach(function(loan) {
    if (loan.collateralType == 'ETH') {
      ethLoans.push(loan)
    }
    
  })
  return ethLoans
}

async function createLoanOffer() {
  console.log("Create Loan Offer")
  const minimumLoanAmount = 1;
  const maximumLoanAmount = 12;
  const monthlyRate = 0.3
  const collaterals = [0, "ETH", monthlyRate, 50, true];
  const collaterals2 = [{mpr: 0.3, id: 0, symbol: "ETH", ltv: 50, valid: true}];
  const durationRange = {min: 1, max: 12};

  const loanOfferParams = {
      minimumLoanAmount,
      maximumLoanAmount,
      moe: "DAI",
      collaterals: collaterals2,
      durationRange      
  };
  console.log("Lender Address:")
  console.log(lenderAddress)
  
  const rawOfferJSON = await marketplace2.offers.create(lenderAddress,loanOfferParams)
  console.log(rawOfferJSON)
  
  transactionCount = await getTxCount2();
  
  const newRawOfferJSON = {
    nonce: web3.utils.toHex(transactionCount),
    gasPrice: web3.utils.toHex(rawOfferJSON.gasPrice * 10),
    gasLimit: web3.utils.toHex(8000000),
    to: rawOfferJSON.to,
    from: rawOfferJSON.from,
    data: rawOfferJSON.data
  }
  // console.log(rawTx3)
  //console.log("TEST2")
  
  // Create Tx
  const tx = new Tx(newRawOfferJSON);
  // Sign Tx
  tx.sign(privateKey2);
  // console.log("tx3 signed")

  // Serialize Tx
  const serializedTx = tx.serialize()

  // Send signed Tx
  console.log("Sending tx...")
  txReceipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  .catch(error => {
    console.log(error)
  })
  console.log("✅");
  
}

// #################################################

async function takeLoanOffer() {
  // borrower params need to be in the range of params specified for the particular loan offer the borrower wants to take. this is enforced at smart contracts level

  const loanAmount = 10; //needs to be between maximumLoanAmount and minimumLoanAmount specified in the offer
  const loanCurrency = "DAI";  //same currency as the offer
  const collateralType = "ETH";  //needs to be in the list of the specified collaterals
  const collateralAmount = await marketplace.utils.getCollateralFromLoanAmount(loanAmount, collateralType, loanCurrency);

  const borrowerParams = {

      loanAmount, 
      moe: loanCurrency,
      collateralAmount, 
      collateralType,
      duration: 4 //needs to be in the duration range of the offer
  };

  const takeLoanJSON = await marketplace.offers.takeLoanOffer(borrowerAddress,borrowerParams);
  console.log(takeLoanJSON)

  transactionCount = await getTxCount()
  
  const newtakeLoanJSON = {
    nonce: web3.utils.toHex(transactionCount),
    gasPrice: web3.utils.toHex(takeLoanJSON.gasPrice * 14),
    gasLimit: web3.utils.toHex(takeLoanJSON.gas * 14),
    to: takeLoanJSON.to,
    from: takeLoanJSON.from,
    data: takeLoanJSON.data
  }
  // console.log(rawTx3)
  
  // Create Tx
  const tx = new Tx(newtakeLoanJSON);
  // console.log(tx.gasLimit.toString())

  // Sign Tx
  tx.sign(privateKey);
  // console.log("tx3 signed")

  // Serialize Tx
  const serializedTx = tx.serialize()

  // Send signed Tx

  txReceipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  .catch(error => {
    console.log(error)
  })
  console.log("✅");
}

//###########################################################

async function fundRequest() {
  // Get loan Data of newly created loan request
  console.log("### Get data of last loan created ###")
  console.log("## Get all Loan requests of user")
  const requestsAddressesByBorrower = await marketplace.requests.getDataAllLoansByBorrower(borrowerAddress)
  console.log("✅")

  // Get last loan request
  requestAddress = requestsAddressesByBorrower[requestsAddressesByBorrower.length - 1].loanAddress;
  //console.log(requestAddress);
  loanData = await marketplace2.requests.getLoanData(requestAddress)
  // console.log(loanData)
  console.log("✅")

  const { loanAddress, moe, loanAmount } = loanData;

  console.log(`### Loan Details: ${loanAddress}, ${moe},${loanAmount} ###`)

  const isCollateralPriceUpdated = await marketplace2.requests.isCollateralPriceUpdated(loanAddress)

  // Check if price is updated
  if (!isCollateralPriceUpdated.updated) {
    console.log("### Update price ###")
    // Fetch updated price transactions
    rawTxPriceUpdate = await marketplace2.requests.refreshCollateralPrice(loanAddress, lenderAddress)
    // console.log(rawTxPriceUpdate)

    // Get tx count
    transactionCount = await getTxCount2()

    // Make updated tx object
    const priceUpdateTx = {
      nonce: web3.utils.toHex(transactionCount),
      gasPrice: web3.utils.toHex(rawTxPriceUpdate.gasPrice * 20),
      gasLimit: web3.utils.toHex(rawTxPriceUpdate.gas * 2),
      value: web3.utils.toHex(rawTxPriceUpdate.value),
      to: rawTxPriceUpdate.to,
      from: rawTxPriceUpdate.from,
      data: rawTxPriceUpdate.data
    }
    // console.log(priceUpdateTx)
    
  
    // Create Tx
    const tx = new Tx(priceUpdateTx);
    // console.log(tx.gasLimit.toString())
  
    // Sign Tx
    tx.sign(privateKey2);
    // console.log("tx3 signed")
  
    // Serialize Tx
    const serializedTx = tx.serialize()
  
    // Send signed Tx
    console.log("Send update price tx")
    txReceipt5 = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .catch(error => {
      console.log(error)
    })
    // console.log(txReceipt5);
    console.log("✅")
  }

  const isApproved = await marketplace2.utils.isTransferApproved(lenderAddress, moe, loanAmount);

  // console.log(isApproved)
  
  if (!isApproved) {
      const rawApproveTx = await marketplace2.utils.approveTransfer(lenderAddress, moe);
      
      transactionCount = await getTxCount2()
      // console.log(`TX count: ${transactionCount}`)

      const newRawApproveTx = {
        nonce: web3.utils.toHex(transactionCount),
        gasPrice: web3.utils.toHex(rawApproveTx.gasPrice * 10),
        gasLimit: web3.utils.toHex(rawApproveTx.gas),
        to: rawApproveTx.to,
        from: rawApproveTx.from,
        value: web3.utils.toHex(rawApproveTx.value),
        data: rawApproveTx.data
      }
    
      // Create Tx
      const tx = new Tx(newRawApproveTx);
    
      // Sign Tx
      tx.sign(privateKey2);
      // console.log("tx1 signed")
    
      // Serialize Tx
      const serializedTx = tx.serialize()
    
      // Send signed Tx
      
      txReceipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
      // console.log(txReceipt);
      console.log("✅");
  }

  console.log("### Fund Borrow Request ###")
  const rawFundJSON = await marketplace2.requests.fund(loanAddress, lenderAddress, loanAmount);
  
  console.log(rawFundJSON)

  transactionCount = await getTxCount2()
  // console.log(`TX count: ${transactionCount}`)

  const newRawFundJSON = {
    nonce: web3.utils.toHex(transactionCount),
    gasPrice: web3.utils.toHex(rawFundJSON.gasPrice * 14),
    gasLimit: web3.utils.toHex(8000000),
    tokenSymbol: 'DAI',
    tokenAmount: web3.utils.toHex(rawFundJSON.tokenAmount),
    to: rawFundJSON.to,
    from: rawFundJSON.from,
    data: rawFundJSON.data
  }
  
  // Create Tx
  const tx = new Tx(newRawFundJSON);
  // console.log(tx.gasLimit.toString())

  // Sign Tx
  console.log("### Lender Signs Tx ###")
  tx.sign(privateKey2);
  console.log("✅");

  // Serialize Tx
  const serializedTx = tx.serialize()

  // Send signed Tx
  console.log("### Send Funding Tx ###")
  txReceipt2 = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  .then(response => {
    console.log("### ✅Borrow request successfully funded ###")
  })
  .catch(error => {
    console.log(error)
  })
  // console.log(txReceipt2);
  
}

// Exports
module.exports = {
  getLoans: getLoans()
}




// ###############################################
// Application Start:

// Plan B

// 1. Create a loan request
// createLoanRequest();

// 2. Place Collateral
// placeCollateral();

// 3. Fund the Loan with lender
// fundRequest()

// Plan A

// 1. Create a Loan Offer
createLoanOffer();

// 2. Get Loans
//getLoans();

// 3. Take a loan offer
// takeLoanOffer()

// placeCollateral();
// signup2();

// createLoanRequest();
