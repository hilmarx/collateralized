// Declaration
const Maker = require('@makerdao/dai');
require('dotenv').config()

console.log("######")
//console.log(process.env.PRIVATE_KEY)
//console.log(`https://kovan.infura.io/v3/${process.env.INFURA_ID}`)


// 1. Ask for users CDP ID with button called "check refinancing opportunities"

// 2. Fetch & Display collateral, colla ratio & dai debt of current CDP

// 3. Fetch current Maker stability fee and display it

// 4. Fetch current ETHLend lending offers (rate + Maximum amount)

// 5. Display EthLend offers and ask if user wants to refinace loan

// 6. If yes, execute refinancing

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

  // 3. Fetch current Maker stability fee and display it

  // The ETH CDP Service exposes the risk parameter information for the Ether CDP type (in single-collateral Dai, this is the only CDP Type)

  const ethCdp = maker.service('cdp');

  // Fetch governance / stability fee
  const fee = await ethCdp.getAnnualGovernanceFee()
  .then(result => {
    console.log(result);
  })



  // Get Dai Debbt
  // // const daiDebt = await cdp.getDebtValue();
  // // console.log(daiDebt);

  // lock eth
  // await cdp.lockEth(0.1);

  // Check collateral balance
  
  /*
  await cdp.drawDai(1);

  const debt = await cdp.getDebtValue();
  console.log(debt.toString); // '50.00 DAI'
  */

}

openLockDraw();