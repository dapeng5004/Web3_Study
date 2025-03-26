const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")
// const { network, getNamedAccounts, deployments, ethers } = require("hardhat")

task("lock-and-cross")
    .addOptionalParam("chainselector", "chain selector if dest chain")
    .addOptionalParam("receiver", "receiver address on dest chain")
    .addParam("tokenid", "token id to be cross chain")
    .setAction(async (taskArgs, hre) => {

        let chainSelector, receiver
        const tokenId = taskArgs.tokenid
        const { firstAccount } = await getNamedAccounts()

        if (taskArgs.chainselector) {
            chainSelector = taskArgs.chainselector
        } else {
            chainSelector = networkConfig[network.config.chainId].destChainSelector
            console.log("chain selector is not set in command")
        }
        console.log(`chainSelector is -> ${chainSelector}`)

       
        if (taskArgs.receiver) {
            receiver = taskArgs.receiver
        } else {
            //receiver: NFTPoolBurnAndMint  netwrok: amoy
            const nftPoolBurnMintDeployment = await hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint")
            receiver = nftPoolBurnMintDeployment.address
            console.log("receiver is not set in command")

        }

        console.log(`receiver address is -> ${receiver}`)

        //tansfer link token to address of the pool
        const nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount)


        const linkTokenAddress = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress)
ß
        const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther("1"))
        await transferTx.wait(6)
        const balance = await linkToken.balanceOf(nftPoolLockAndRelease.target)

        console.log(`balance of pool is ${balance}`)

        // approve pool address to call transform

        const ntf = await ethers.getContract("MyToken", firstAccount)
        await ntf.approve(nftPoolLockAndRelease.target, tokenId)

        console.log("approve success...")

        // call lockAndSendNFT
        const lockAndSendNTFTx = await nftPoolLockAndRelease.lockAndSendNFT(
            tokenId,
            firstAccount,
            chainSelector,
            receiver)

        console.log(`ccip transaction is sent, the tx hash is: ${lockAndSendNTFTx.hash}`)

    })

    module.exports={}