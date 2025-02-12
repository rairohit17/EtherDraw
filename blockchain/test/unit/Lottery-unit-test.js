const {assert, expect} = require("chai")
const { deployments ,ethers, network, getNamedAccounts} = require("hardhat");
const { describe } = require("node:test");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");


!developmentChains.includes(network.name) 
? describe.skip                               // tests only for development chains
 : describe("Lottery" , async()=>{
    let Lottery,mockVrfCoordinatorInterface , chainId, minimumEntryFees,interval, vrfInstance , lotteryDetails
    
    beforeEach(async()=>{
        await deployments.fixture(["all"])
        mockVrfCoordinatorInterface = await deployments.get("VRFCoordinatorV2_5Mock")
         
        
         lotteryDetails = await deployments.get("Lottery")
           const [signer] = await ethers.getSigners()
            // console.log(signer);
         chainId = await network.config.chainId;
         Lottery = await ethers.getContractAt("Lottery",lotteryDetails.address, signer )
         vrfInstance = await ethers.getContractAt("VRFCoordinatorV2_5Mock",mockVrfCoordinatorInterface.address, signer )
        minimumEntryFees = BigInt(networkConfig[chainId]["minimumEntryFees"])
         interval = BigInt(networkConfig[chainId]["interval"]) 
    })

    describe("Constructor" , ()=>{

        it("initializes the Lottery correctly ", async()=>{
            const initialState = ( await Lottery.getLotteryState()).toString()
            // console.log(initialState)
            const interval = ( await Lottery.getInterval())
            const minFees  = ( await Lottery.getMinimumEntryFees());
            assert.equal(initialState, "0" , "the initial state of lottery is not 'OPEN'")
            assert.equal(interval,networkConfig[chainId]["interval"],"invalid interval for lottery")
            assert.equal( minFees , networkConfig[chainId]["minimumEntryFees"],"wrong minimum entry fees initialized "  )
            
        })
    })
    describe("participate in lottery ", ()=>{
        it("reverts if the fees is less than minimum entry fees ", async()=>{
           await expect(  Lottery.participateInLottery()).to.be.revertedWithCustomError(Lottery,"Lottery_EntryFeesNotSufficient")
            
        })
        it("reverts of lottery  is  closed " , async ()=>{
            const fund  = await Lottery.participateInLottery({
                value:minimumEntryFees
            })
            await network.provider.send("evm_increaseTime",[ Number(interval)+20000])
            await network.provider.send("evm_mine", []);
            // need  to mine a block after increasing time stamp of blochchain
            // console.log( await Lottery.getTimeStamp())
            // console.log(Number(interval) + 3000)
            await Lottery.performUpkeep("0x")
            await expect (Lottery.participateInLottery({value:minimumEntryFees})).to.be.revertedWithCustomError(Lottery,"Lottery_LotteryIsClosed")   
    })
    it("add the participant to the participants array " , async()=>{
        await Lottery.participateInLottery({value:minimumEntryFees});
        const participant = await Lottery.getParticipant(0);
         const {deployer} = await getNamedAccounts()
        //  console.log(deployer)
        assert.equal(participant,deployer, "participant not added to participants array ")
    })
    it ( " emits the participant in logs ", async ()=>{
        const {deployer} = await getNamedAccounts()
        await expect(Lottery.participateInLottery({value:minimumEntryFees})).to.emit(Lottery, "ParticipantAdded").withArgs(deployer)
        
    })
})
    describe("checkUpkeep" , ()=>{
        it("returns false if there is no eth " , async()=>{
            await network.provider.send("evm_increaseTime",[ Number(interval)+1])
            await network.provider.send("evm_mine",[])
            const {upkeepNeeded} = await Lottery.checkUpkeep("0x")
            assert(!upkeepNeeded);
        })
        it ("returns false if the lottery is in CLOSED state" , async()=>{
            await Lottery.participateInLottery({value:
                minimumEntryFees
            })
            await network.provider.send("evm_increaseTime",[ Number(interval)+1])
            await network.provider.send("evm_mine",[]);
            await Lottery.performUpkeep("0x") // Lottery status chenged from open to calculating 
            const {upkeepNeeded} = await Lottery.checkUpkeep("0x")
            assert(!upkeepNeeded)
        })
        it("returns false till the time does not exceed  by interval ", async()=>{
            await Lottery.participateInLottery({value:
                minimumEntryFees
            })
            let {upkeepNeeded} = await Lottery.checkUpkeep("0x");
            assert(!upkeepNeeded,)
            await network.provider.send("evm_increaseTime",[ Number(interval)+1])
            await network.provider.send("evm_mine",[]);
             let newResult = await Lottery.checkUpkeep("0x");
            // console.log(newResult.upkeepNeeded)
            assert(newResult.upkeepNeeded)
            

        })
        describe("performUpkeep" , ()=>{
            it("must revert if checkUpkeep returns false ", async()=>{
                await expect(Lottery.performUpkeep("0x")).to.be.revertedWithCustomError(Lottery, "Lottery__UpkeepNotNeeded")
            })
            it ("must update the lastRequestId with the request id ", async()=>{
                await Lottery.participateInLottery({value:
                    minimumEntryFees
                })
                await network.provider.send("evm_increaseTime",[ Number(interval)+1])
                await network.provider.send("evm_mine",[]);
                // console.log("sjjsdjdnfjdn")
                const tx = await Lottery.performUpkeep("0x")
                const txReciept= await tx.wait(1)
                const recentRequestId = await Lottery.s_lastRequestId();
                const recieved = await txReciept.logs[1].args[0]
                assert.equal(recentRequestId, recieved);
            })
            it("emits request id upon successful calling " ,async()=>{
                await Lottery.participateInLottery({value:
                    minimumEntryFees
                })
                await network.provider.send("evm_increaseTime",[ Number(interval)+1])
                await network.provider.send("evm_mine",[]);
               
                await expect(Lottery.performUpkeep("0x")).to.emit(Lottery,"RequestIdForRandomWords")
            })

        })
        describe( "fulfillRandomWords", ()=>{
            
            it ( "reverts if wrong requestId is  send ",async ()=>{
                await Lottery.participateInLottery({value:
                    minimumEntryFees
                })
                await network.provider.send("evm_increaseTime",[ Number(interval)+1])
                await network.provider.send("evm_mine",[]);
                const {deployer} = await  getNamedAccounts()
               await expect(vrfInstance.fulfillRandomWords(0, deployer)).to.be.revertedWithCustomError(vrfInstance,"InvalidRequest")
            })
            it("selects the recent winner, updates the lottery status and resets the participants array", async () => {
                await Lottery.participateInLottery({ value: minimumEntryFees });
            
                const accounts = await ethers.getSigners();
                for (let i = 1; i < 4; i++) {
                    const newPart = await Lottery.connect(accounts[i]);
                    await newPart.participateInLottery({ value: minimumEntryFees });
                }
            
                await network.provider.send("evm_increaseTime", [Number(interval) + 1]);
                await network.provider.send("evm_mine", []);
            
                console.log("Waiting for WinnerPicked event...");
            
                const winnerPromise = new Promise((resolve, reject) => {
                    Lottery.once("WinnerPicked", async (winner) => {
                        try {
                            // console.log("WinnerPicked event emitted!");
                            const participantsList = await Lottery.getNUmberOfParticipants();
                            // console.log("Participants after winner picked:", participantsList.toString());
                            const latestWinner = await Lottery.getRecentWinner()
                            assert.equal(participantsList.toString(), "0");
                            assert.equal(latestWinner, winner, 'latest winner not updated');
                            assert.equal( (await Lottery.getLotteryState()).toString() , "0", "state not updated properly")
            
                            resolve(); 
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            
                const tx = await Lottery.performUpkeep("0x");
                const txReceipt = await tx.wait(1);
                // console.log("HELLO ");
            
                const requestId = txReceipt.logs[1].args[0];
                // console.log("Request ID:", requestId);
                // console.log("Lottery Contract Address:", await Lottery.getAddress());
            
                const txn = await vrfInstance.fulfillRandomWords(requestId, await Lottery.getAddress());
                await txn.wait(1);
            
                await winnerPromise;
            });
            


        }) 
  

        
    })
 })