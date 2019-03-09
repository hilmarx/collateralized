// Aaeve function

const Marketplace = require('aave-js').Marketplace;

// 1. Sign the user up in order to get the secret API key
async function signup() {
    console.log("Start Environment")
    const signupParams = [
      'test999@test.com',
      "hilmar2",
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

// signup();

// 2. Set Marketplace variable with collected API Key
const marketplace = new Marketplace('7d998a7163445d231e0a9f5d92203dcd711635ef21cd35b273');

// 3. Create a new borrow request with the rate being 1% under Makers rate

async function createLoanRequest() {
  // monthly rate is the Maker rate - 1% divided by 12 months
  const monthlyRate = (0.025 - 0.01) / 12
  console.log(`Monthly Rate: ${monthlyRate * 100}%`)
  const borrowerAddress = "0x518eAa8f962246bCe2FA49329Fe998B66d67cbf8"; // The wallet that creates the request
  const collateralAmount = 10000;
  const collateralType = "LEND";
  console.log(`Collateral: ${collateralAmount} ${collateralType}`)
  const loanCurrency = "ETH";
  
  // We get the maximum loan amount, depending on the Loan-To-Value ratio allowed
  try {
    const maxLoanAmount = await marketplace.utils.getMaxLoanAmountFromCollateral(
      collateralAmount, collateralType, loanCurrency
    );
  }
  catch(e) {
    console.log(e)
  }
  
  //console.log(`Max Loan Amount: ${collateralAmount} ${loanCurrency}`)

  /*const loanRequestParams = {
      loanAmount: maxLoanAmount,
      moe: loanCurrency,
      collateralAmount: collateralAmount,
      collateralType: collateralType,
      mpr: 1.5,
      duration: 2
  };
  /*
  const tx = await marketplace.requests.create(borrowerAddress,loanRequestParams)
  .then(result => {
    console.log(result)
  })
  .catch(error => {
    console.log(error)
  })

  await web3.eth.sendTransaction(tx);
  console.log("Tx successful")
  */
}

createLoanRequest();