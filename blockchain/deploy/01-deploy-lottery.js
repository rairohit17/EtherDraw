const {network, ethers} = require("hardhat")
const  { developmentChains ,networkConfig, verify} = require("../helper-hardhat-config")




module.exports = async function (hre){
    const {getNamedAccounts, deployments} = hre
    const {deployer,participant} = await  getNamedAccounts();
    const {deploy,log} = deployments;
    const chainId = await network.config.chainId;
    let VRF_Coordinator ;
    const signer = await ethers.getSigner(deployer);
    const keyHash = networkConfig[chainId]["keyHash"];
    const MINIMUM_ENTRY_FEES= BigInt( networkConfig[chainId]["minimumEntryFees"])
    let SUBSCRIPTION_ID ,mockVrf

    const INTERVAL = BigInt( networkConfig[chainId]["interval"])
    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2_5Mock = await deployments.get("VRFCoordinatorV2_5Mock");
        mockVrf = await ethers.getContractAt("VRFCoordinatorV2_5Mock", VRFCoordinatorV2_5Mock.address, signer);
        VRF_Coordinator = VRFCoordinatorV2_5Mock.address;
        

        const createSubTx = await mockVrf.createSubscription();
        const createSubReceipt = await createSubTx.wait();
        // console.log("Transaction Logs:", createSubReceipt.logs);
        const event =  await createSubReceipt.logs[0];
         SUBSCRIPTION_ID  = await event.args.subId;
        
        const fundAmount = ethers.parseEther("100"); // Fund with 100 LINK (or any amount)

        await mockVrf.fundSubscription(SUBSCRIPTION_ID, fundAmount)
        // Fund the mock subscription
        // const fundAmount = ethers.parseEther("100");
        // await mockVrf.fundSubscription(SUBSCRIPTION_ID, fundAmount);
    }
    else{
        VRF_Coordinator= networkConfig[chainId]["vrfCoordinatorV2_5"]
        SUBSCRIPTION_ID = BigInt(networkConfig[chainId]["subscriptionId"]) 

    }
//     console.log('hello there ')
//     console.log('SUBSCRIPTION_ID:', SUBSCRIPTION_ID);
// console.log('VRF_Coordinator:', VRF_Coordinator);
// console.log('keyHash:', keyHash);
// console.log('MINIMUM_ENTRY_FEES:', MINIMUM_ENTRY_FEES);
// console.log('INTERVAL:', INTERVAL);

    const Lottery = await deploy("Lottery",{
        from:deployer,
        log:true,
        waitConfirmations:network.config.blockConfirmations || 1 ,
        args:[SUBSCRIPTION_ID,VRF_Coordinator,keyHash,MINIMUM_ENTRY_FEES,INTERVAL]

    })
    if ( developmentChains.includes(network.name)){
        await mockVrf.addConsumer(SUBSCRIPTION_ID, Lottery.address);

    }

    console.log("contract deployed ")
    console.log("-------------------------------------------------")
    if (! developmentChains.includes(network.name)){
        await verify(Lottery.address ,[SUBSCRIPTION_ID,VRF_Coordinator,keyHash,MINIMUM_ENTRY_FEES,INTERVAL] )
    }

}
module.exports.tags = ["all", "lottery"]
// uint256 subscriptionId,
//         address vrfCoordinator,
//         bytes32 keyHash,
//         uint256 minimumFees,
//         uint256 interval
        