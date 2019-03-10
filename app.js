// Maker
const Maker = require('@makerdao/dai');
const readline = require('readline');
// const ethLend = require('./stuff');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
function getCdpId() {
  // Prompt User for CDP number:
  rl.question('What is your CDP id? ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Your CDP id is: ${answer}`);
    cdpId = answer
    rl.close();
  });
  return answer
}


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

  // 2. Fetch & Display collateral, colla ratio & dai debt of current CDP

  let cdpColla;
  const ethCollateral = await cdp.getCollateralValue()
  .then(response => {
    cdpColla = response.toString()
    
  });
  console.log(`CDP Collateral Wei: ${cdpColla}`);

  console.log(`-----------------`);

  let cdpCollaEth = cdpColla / 10**14
  console.log(`CDP Collateral: ${cdpCollaEth}`);

  // Colla Ratio
  let collaRatio;
  const ratio = await cdp.getCollateralizationRatio()
  .then(response => {
    collaRatio = response;
    console.log(`Collateralization Ratio: ${collaRatio}`);
  });

  console.log(`-----------------`);

  // Dai Debt
  let daiDebt;
  const debt = await cdp.getDebtValue()
  .then(response => {
    daiDebt = response.toString()
    console.log(`Dai Debt: ${daiDebt}`);
  });

  console.log(`-----------------`);

  // Accrued stability fees
  // Cant test that right now
  let accruedFees;
  const usdFee = await cdp.getGovernanceFee(Maker.USD)
  .then(result => {
    //console.log("Accrued Fees:")
    //console.log(result)
    accruedFees = result.toString();
  })
  console.log(`Governance Fees (USD): ${accruedFees}`);

  console.log(`-----------------`);

  // 3. Fetch current Maker stability fee and display it

  // The ETH CDP Service exposes the risk parameter information for the Ether CDP type (in single-collateral Dai, this is the only CDP Type)

  const ethCdp = maker.service('cdp');

  // Fetch governance / stability fee
  let stabilityFee;
  const fee = await ethCdp.getAnnualGovernanceFee()
  .then(result => {
    stabilityFee = result
    console.log(`Maker Stability Fee: ${stabilityFee}`);
  })

  console.log(`-----------------`);
}

// Assuming that the user agreed to refinance their loan to ethlend, require the user to wipe all debt in their cdp
async function repayCdp() {
  cdp.shut()
  console.log("CDP closed")
}

// setUp()

// ##################### Get CDP id ##############

// 1. Ask for users CDP ID
function refinance() {
  string = "######### Would you like to refinance your variable CDP for a fixed Interest Rate loan? (y/n) ####### "
  // Prompt User for CDP number:
  rl.question(string, (answer) => {
    // TODO: Log the answer in a database
    console.log(`Great, fetching the ETHLends ETH / DAI Loans...`);
    rl.close();
  });
  return answer
}

function startProgram() {
  console.log("########################################################")
  console.log("-----------------WELCOME TO LEHMAN BROS-----------------")
  console.log("     YOUR GO TO SERVICE FOR CRYPTO INTEREST RATE SWAPS")
  console.log("########################################################")

  console.log("")
  console.log("-----------------Check your MakerCDP Status-----------------")

  id = getCdpId();

  showMakerInfo(id)

  refinance();

  //ethLend.getLoans

}

