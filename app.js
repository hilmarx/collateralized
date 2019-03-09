// Declarations
// Maker
const Maker = require('@makerdao/dai');
require('dotenv').config()


console.log("######")
//console.log(process.env.PRIVATE_KEY)
//console.log(`https://kovan.infura.io/v3/${process.env.INFURA_ID}`)


// 1. Ask for users CDP ID with button called "check refinancing opportunities"

// 2. Fetch & Display collateral, colla ratio & dai debt of current CDP

// 3. Fetch current Maker stability fee and display it

// 4. Fetch current ETHLend lending offers (rate + Maximum amount)

// 5. Display EthLend offers and ask if user wants to refinance loan

// 6. If yes, show the accrued cost of the Maker CDP => Dai debt plus accrued interest fee

// Ask for CDP ID

// If CDP exist, fetch Maker stability fee & 

async function openLockDraw() {
    const maker = await Maker.create("http", {
        privateKey: process.env.PRIVATE_KEY,
        url: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`
    });

  // makes sure all services are initialized
  await maker.authenticate();

  // Create a new CDP Object
  // // const cdp = await maker.openCdp();
  
  // 1. Ask for users CDP ID with button called "check refinancing opportunities"

  const cdp = await maker.getCdp(5284);
  console.log(cdp.id);

  // 2. Fetch & Display collateral, colla ratio & dai debt of current CDP

  let cdpColla;
  const ethCollateral = await cdp.getCollateralValue()
  .then(response => {
    cdpColla = response['_amount']['c'][0];
    
  });
  console.log(cdpColla);
  let cdpCollaEth = cdpColla / 10**14
  console.log(cdpCollaEth);

  // Colla Ratio
  let collaRatio;
  const ratio = await cdp.getCollateralizationRatio()
  .then(response => {
    collaRatio = response;
    console.log(collaRatio)
  });

  // Dai Debt
  let daiDebt;
  const debt = await cdp.getDebtValue()
  .then(response => {
    daiDebt = response['_amount']['c'][0] + response['_amount']['c'][1] / 10**14;
    console.log(daiDebt)
  });

  // Accrued stability fees
  // Cant test that right now
  let accruedFees;
  const usdFee = await cdp.getGovernanceFee(Maker.USD)
  .then(result => {
    //console.log("Accrued Fees:")
    //console.log(result)
    accruedFees = result;
  })

  // 3. Fetch current Maker stability fee and display it

  // The ETH CDP Service exposes the risk parameter information for the Ether CDP type (in single-collateral Dai, this is the only CDP Type)

  const ethCdp = maker.service('cdp');

  // Fetch governance / stability fee
  let stabilityFee;
  const fee = await ethCdp.getAnnualGovernanceFee()
  .then(result => {
    console.log(result);
    stabilityFee = result
  })

}
// openLockDraw();

// ###############################
// Aaeve


//console.log(aaeve);
//const Marketplace = aaeve.Marketplace
//console.log(Marketplace)

// 1. Log User In

// 2. Fetch current ETHLend lending offers (rate + Maximum amount)

// 3. Display EthLend offers (if available) and ask if user wants to refinance loan 
