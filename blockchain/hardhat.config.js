require("@nomicfoundation/hardhat-ethers")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-chai-matchers");
require('solidity-coverage'); 

require("dotenv").config()


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  namedAccounts:{
    deployer:{
      default:0
    },
    participant:{
      default:1
    }
  },
  networks:{

    localhost:{
      url:'http://127.0.0.1:8545',
      chainId:31337,
      blockConfirmations:1


    },
    hardhat:{
      chainId:31337,
      blockConfirmations:1

    },
    sepolia:{
      chainId:11155111,
      url:process.env.SEPOLIA_RPC_URL,
      accounts:[process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY],
      blockConfirmations:3
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY

  },
  mocha: {
    timeout: 200000 // Timeout set to 40 seconds (default is 2000ms)
  }
};
