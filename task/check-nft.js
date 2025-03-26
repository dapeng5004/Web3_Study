// const { getNamedAccounts } = require("hardhat")
const { task } = require("hardhat/config")

task("check-nft").setAction(async (taskArgs, hre) => {

    const { firstAccount } = await getNamedAccounts()
    const nft = await ethers.getContract("MyToken", firstAccount)

    console.log("checking status of MyToken")

    const totalSupply = await nft.totalSupply()
    console.log(`totalspply: ${totalSupply}`)
    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const owner = await nft.ownerOf(tokenId)
        console.log(`owner: ${owner} --> tokenID: ${tokenId}`)
    }
})
module.exports = {}