const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")
// const { network, getNamedAccounts, deployments, ethers } = require("hardhat")

task("burn-and-cross")
    .addOptionalParam("chainselector", "chain selector if dest chain")
    .addOptionalParam("receiver", "receiver address on dest chain")
    .addParam("tokenid", "token id to be cross chain")
    .setAction(async (taskArgs, hre) => {

        let chainSelector, receiver

        const tokenId = taskArgs.tokenid
        const { firstAccount } = await getNamedAccounts()

        //get chainselector
        if (taskArgs.chainselector) {
            chainSelector = taskArgs.chainselector
        } else {
            chainSelector = networkConfig[network.config.chainId].destChainSelector
            console.log("chain selector is not set in command")
        }
        console.log(`chainSelector is -> ${chainSelector}`)

        //get receiver
        if (taskArgs.receiver) {
            receiver = taskArgs.receiver
        } else {
            //receiver: NFTPoolLockAndRelease  netwrok: sepolia
            const nftPoolLockReleseDeployment = await hre.companionNetworks["destChain"].deployments.get("NFTPoolLockAndRelease")
            receiver = nftPoolLockReleseDeployment.address
            console.log("receiver is not set in command")
        }

        console.log(`receiver address is -> ${receiver}`)

        //tansfer link token to address of the pool
        const nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount)

        const linkTokenAddress = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress)
        const transferTx = await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther("1"))
        await transferTx.wait(6)
        const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target)

        console.log(`balance of pool is ${balance}`)

        // approve pool address to call transform

        const wntf = await ethers.getContract("WrappedMyToken", firstAccount)
        await wntf.approve(nftPoolBurnAndMint.target, tokenId)

        console.log("approve success...")

        // call lockAndSendNFT
        const burnAndSendNTFTX = await nftPoolBurnAndMint.burnAndSendNFT(
            tokenId,
            firstAccount,
            chainSelector,
            receiver)

        console.log(`ccip transaction is sent, the tx hash is: ${burnAndSendNTFTX.hash}`)

    })

module.exports = {}