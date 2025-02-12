const { network, ethers } = require("hardhat");
const {developmentChains} = require("../helper-hardhat-config");
const { bigint } = require("hardhat/internal/core/params/argumentTypes");


 module.exports= async function ({getNamedAccounts,deployments}){
    const {deploy,log} = deployments ;
    const {deployer}=  await getNamedAccounts();
    const chainId = network.config.chainId 
    // // i_base_fee = _baseFee;
    // i_gas_price = _gasPrice;
    // i_wei_per_unit_link = _weiPerUnitLink;
    const BASE_FEES= BigInt("250000000000000000");
    const GAS_PRICE = BigInt("1000000000000");
    const WEI_PER_UNIT_LINK = BigInt("10000000000000000000")
    if (developmentChains.includes(network.name)){
        log("local network detected deploying mocks ")
        //deploy a mock vrf coordinator contract 
        const mock = await deploy("VRFCoordinatorV2_5Mock", {
            from :deployer,
            log:true,
            args:[BASE_FEES,GAS_PRICE,WEI_PER_UNIT_LINK]

        })
        console.log("MOCKS CONTRACT DEPLOYED ")
        console.log("------------------------------------------------------------------")
  }         

 }
 module.exports.tags = ["all", "mocks"]