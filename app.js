// Declaration
const Maker = require('@makerdao/dai');
require('dotenv').config()

console.log("hi")
console.log(process.env.PRIVATE_KEY)
console.log(`https://kovan.infura.io/v3/${process.env.INFURA_ID}`)

// Ask for CDP ID





async function openLockDraw() {
    const maker = await Maker.create("http", {
        privateKey: process.env.PRIVATE_KEY,
        url: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`
    });

  // makes sure all services are initialized
  await maker.authenticate();

  // Create a new CDP Object
  // // const cdp = await maker.openCdp();
  
  // Find existing CDP
  const cdp = await maker.getCdp(5284);
  console.log(cdp.id);

  // Get Dai Debbt
  // // const daiDebt = await cdp.getDebtValue();
  // // console.log(daiDebt);

  // lock eth
  await cdp.lockEth(0.1);

  // Check collateral balance
  const ethCollateral = await cdp.getCollateralValue();
  console.log(ethCollateral);
  
  /*
  await cdp.drawDai(1);

  const debt = await cdp.getDebtValue();
  console.log(debt.toString); // '50.00 DAI'
  */

}

openLockDraw();