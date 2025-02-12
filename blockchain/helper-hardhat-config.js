const {run}= require("hardhat");

const networkConfig = {
    11155111:{
        name:"sepolia",
        vrfCoordinatorV2_5:'0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B',
        keyHash:"0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        minimumEntryFees:10000000000000000,
        interval:30,
        subscriptionId:process.env.SUBSCRIPTION_ID
    },
    31337:{
        name:"localhost", 
        keyHash:"0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        minimumEntryFees:10000000000000000,
        interval:3000


    }
}

const developmentChains= ["hardhat", "localhost"]   
 
async function verify(contractAddress , constructorArguments){
    try{
        console.log("verifying contracts")
        await run("verify:verify",{
            address:contractAddress,
            constructorArguments:constructorArguments,
        })
        console.log("contract verified successfully")
        console.log("--------------------------------------------------")
    }
    catch(error){
        if ( (error.message).includes("already verified")){
            console.log("contract already verified")
        }

        else{
            console.log("verification failed : " + error.message)
        }

    }
}


module.exports= {
    networkConfig,
    developmentChains,
    verify
}