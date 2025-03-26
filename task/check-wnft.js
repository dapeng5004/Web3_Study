
// const { getNamedAccounts } = require("hardhat")
const { task } = require("hardhat/config")

task("check-wnft").setAction(async (taskArgs, hre) => {

    const { firstAccount } = await getNamedAccounts()
    const wnft = await ethers.getContract("WrappedMyToken", firstAccount)

    console.log("checking status of WrappedMyToken")

    const totalSupply = await wnft.totalSupply()
    console.log(`totalspply: ${totalSupply}`)

    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const owner = await wnft.ownerOf(tokenId)
        console.log(`owner: ${owner} --> tokenID: ${tokenId}`)
    }
})

module.exports = {}