const { network , ethers} = require("hardhat");
const { developmentChains , networkConfig } = require("../../helper-hardhat-config");
const {assert, expect} = require("chai")


developmentChains.includes(network.name) 
?describe.skip 
: describe("Lottery", async () => {
    let Lottery , chainId, minimumEntryFees,interval , lotteryDetails
    
    beforeEach(async()=>{         
        
         lotteryDetails = await deployments.get("Lottery")
           const [signer] = await ethers.getSigners()
            // console.log(signer);
         chainId = await network.config.chainId;
         Lottery = await ethers.getContractAt("Lottery",lotteryDetails.address, signer )
        minimumEntryFees = BigInt(networkConfig[chainId]["minimumEntryFees"])
         interval = BigInt(networkConfig[chainId]["interval"]) 
    })
    describe("fulfillRandomWords", ()=>{
        it("selects the recentWinner , updates the lotteryStatus and updates the participants array ", async()=>{
            const accounts = ethers.getSigners();
           const promise =  new Promise( (resolve,reject)=>{
                Lottery.once("WinnerPicked", async(winner)=>{
                    try{
                        // console.log("2222222222222222")

                          const participantsList = await Lottery.getNUmberOfParticipants();
                                // console.log("Participants after winner picked:", participantsList.toString());
                                    const latestWinner = await Lottery.getRecentWinner()
                                    assert.equal(participantsList.toString(), "0");
                                    console.log("number of participants : " ,await Lottery.getNUmberOfParticipants() )
                                    assert.equal(latestWinner, winner, 'latest winner not updated');
                                    assert.equal( (await Lottery.getLotteryState()).toString() , "0", "state not updated properly")
                                    console.log("recentWinner: "+await Lottery.getRecentWinner())
                                    // console.log("initial balance of participant : "+ ethers.parseEther(initialBalance))
                                    // console.log("final Balance of Winner " +  ethers.parseEther( await signer.provider.getBalance()))
                                    resolve();
                                    

                    }
                    catch(e){
                        console.log(e.message);
                    }
                })
                
            })
            const [signer] = await ethers.getSigners();
            await Lottery.participateInLottery({value:minimumEntryFees});
            // const initialBalance = await signer.provider.getBalance();
            // console.log("111111111111111111111")
            await promise;
        })
    })
})