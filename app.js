// Maker
const Maker = require('@makerdao/dai');
const ethLend = require('./stuff');
const readline = require('readline');

let rl = readline.createInterface(process.stdin, process.stdout);

const currentId = 5293

require('dotenv').config()
const {
  MKR,
  DAI,
  ETH,
  WETH,
  PETH,
  USD_ETH,
  USD_MKR,
  USD_DAI,
  buildTestService
} = Maker;


// Varbiable Declarations
let cdp;
let cdpId;

// ############ SET UP ############

async function setUp() {

  const maker = await Maker.create("http", {
    privateKey: process.env.PRIVATE_KEY,
    url: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`,
    provider: {
      type: 'HTTP', // or 'TEST'
      network: 'kovan'
    },
  });

  await maker.authenticate();

  // Create a new CDP Object
  cdp = await maker.openCdp();
  console.log(`CDP successfully created. ID: ${cdp.id}`)

  console.log(`-----------------`);

  console.log(`Putting 0.3 ETH in CDP`);
  await cdp.lockEth(0.3, ETH);
  console.log(`done locking eth`);

  console.log(`-----------------`);

  console.log(`Drawing 6 dai`);
  await cdp.drawDai('6')
  .then(result => {
    console.log(result.toString())
    console.log(`done drawing dai`);
  })

  console.log(`-----------------`);
  console.log(`### SET UP END ###`)
      
}


// ##################### Get CDP id ##############

// 1. Ask for users CDP ID

async function showMakerInfo(id) {
  
  const maker = await Maker.create("http", {
    privateKey: process.env.PRIVATE_KEY,
    url: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`,
    provider: {
      type: 'HTTP', // or 'TEST'
      network: 'kovan'
    },
  });
  // makes sure all services are initialized
  await maker.authenticate();

  // 2. Find CDP and display details

  cdp = await maker.getCdp(parseInt(id));

  console.log(`-----------------`);
  console.log(``);

  // 2. Fetch & Display collateral, colla ratio & dai debt of current CDP

  let cdpColla;
  const ethCollateral = await cdp.getCollateralValue()
  .then(response => {
    cdpColla = response.toString()
    
  });
  console.log(`CDP Collateral: ${cdpColla}`);

  console.log(`-----------------`);
  console.log(``);

  // Colla Ratio
  let collaRatio;
  const ratio = await cdp.getCollateralizationRatio()
  .then(response => {
    collaRatio = response;
    console.log(`Collateralization Ratio: ${collaRatio * 100}%`);
  });

  console.log(`-----------------`);
  console.log(``);

  // Dai Debt
  let daiDebt;
  const debt = await cdp.getDebtValue()
  .then(response => {
    daiDebt = response.toString()
    console.log(`Dai Debt: ${daiDebt}`);
  });

  console.log(`-----------------`);
  console.log(``);

  // Accrued stability fees
  // Cant test that right now
  let accruedFees;
  const usdFee = await cdp.getGovernanceFee(Maker.USD)
  .then(result => {
    //console.log("Accrued Fees:")
    //console.log(result)
    accruedFees = result.toString();
  })
  console.log(`Governance Fees (USD) outstanding: ${accruedFees}`);

  console.log(`-----------------`);
  console.log(``);

  // 3. Fetch current Maker stability fee and display it

  // The ETH CDP Service exposes the risk parameter information for the Ether CDP type (in single-collateral Dai, this is the only CDP Type)

  const ethCdp = maker.service('cdp');

  // Fetch governance / stability fee
  let stabilityFee;
  const fee = await ethCdp.getAnnualGovernanceFee()
  .then(result => {
    stabilityFee = result
  })

  console.log(`You are currently paying: ${stabilityFee * 100}% Interst p.a.`)
  console.log(`-----------------`);
  console.log(``);
  rl.question("Would you like to see alternative fixed Interest Rate loans? (y/n) ", function(answer) {
    if (answer == 'y') {
      showEthlendLoans();
    }
    else {
      rl.setPrompt("Again")
      rl.promp()
    }
  })

}

// Assuming that the user agreed to refinance their loan to ethlend, require the user to wipe all debt in their cdp
async function repayCdp() {
  await cdp.shut()
  console.log("### CDP closed ###")
  console.log(`-----------------`);
  console.log(``);
}

async function showEthlendLoans() {
  console.log("########################################################")
  console.log("--------------Here are the available loans-------------")
  console.log("########################################################")
  loans = await ethLend.getLoans
  loan = loans[loans.length - 1]
  console.log(``);
  console.log(`Collateral Type: ${loan.collateralType}`)
  console.log(`-----------------`);
  console.log(`Collateral Amount: ${loan.collateralAmount}`)
  console.log(`-----------------`);
  console.log(`You receive: ${loan.moe}`)
  console.log(`-----------------`);
  console.log(`Max to borrow: ${loan.loanAmount}`)
  console.log(`-----------------`);
  console.log(``);

  rl.question(`Would you like to refinance to a ${loan.mpr * 12}% p.a. loan? (y/n) `, function(answer) {
    if (answer == 'y') {
      console.log(`-----------------`);
      console.log(``);
      console.log("### Initiating CDP sale ###")
      console.log(`-----------------`);
      console.log(``);
      repayCdp()

      console.log("### Refinancing to ETHLend platform ###")
      console.log(`-----------------`);
      console.log(``);
      ethLend.initateFunding
      console.log(`-----------------`);
      console.log(``);
      console.log("### Refinancing complete ###")
    }
    else {
      rl.setPrompt("Again")
      rl.promp()
    }
  })

}
async function takeLoan() {
  txReceipt = await ethLend.takeLoanOffer
  console.log(txReceipt)
}


// setUp()

// ##################### Get CDP id ##############

// 1. Ask for users CDP ID

function startProgram() {

  console.log("########################################################")
  console.log("-----------------WELCOME TO COLLATERALIZED-----------------")
  console.log("     YOUR GO-TO SERVICE FOR CRYPTO INTEREST RATE SWAPS")
  console.log("########################################################")
  console.log("----------------Check your MakerCDP Status-----------------")
  console.log("")

  rl.question("What is your CDP Number: ", function(answer) {
    if (answer == '5293') {
      showMakerInfo(answer)
    }
    else {
      rl.setPrompt("Again")
      rl.promp()
    }
  })

  //showMakerInfo(id)

  //refinance();

  //ethLend.getLoans

}

startProgram()