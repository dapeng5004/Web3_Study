
const { getNamedAccounts, deployments, ethers } = require('hardhat')
const { expect } = require('chai')

let firstAccount
let ccipSimulator
let nft
let nftPoolLockAndRelease
let wnft
let nftPoolBurnAndMint
let destChainSelector
before(async function () {
    //prepare variables: contract, account
    firstAccount = (await getNamedAccounts()).firstAccount
    console.log("firstAccount", firstAccount)

    //deploy all contract
    await deployments.fixture(["all"])

    nft = await ethers.getContract("MyToken", firstAccount)
    wnft = await ethers.getContract("WrappedMyToken", firstAccount)
    //source chain(sender)
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount)
    //dest chain(receiver)
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount)

    ccipSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount)
    const ccipConfig = await ccipSimulator.configuration()
    destChainSelector = ccipConfig.chainSelector_


})


//source chain -->destination chain
describe("source chain -->dest chain tests", async function () {
    it("test if user can mint a NFT from MyToken contract successfully",
        async function () {
            await nft.safeMint(firstAccount)
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAccount)
            console.log("nft owner: ", owner);

        }
    )

    it("test if user can lock the NFT in the pool and send CCIP message on the source chain",
        async function () {

            await ccipSimulator.requestLinkFromFaucet(nftPoolLockAndRelease.target, ethers.parseEther("10"))
            // lock and send with CCIP
            await nft.approve(nftPoolLockAndRelease.target, 0)
            await nftPoolLockAndRelease.lockAndSendNFT(0,
                firstAccount,
                destChainSelector,
                nftPoolBurnAndMint.target)


            //check if owner of nft is poor's address
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(nftPoolLockAndRelease.target)

            console.log("nft owner  address:", owner)
            console.log("source poor's address:", nftPoolLockAndRelease.target)

            //check if the nft is locked
            const isLocked = await nftPoolLockAndRelease.tokenLocked(0)
            expect(isLocked).to.equal(true)
        }
    )

    it("test if user can mint the wrapped nft on the dest chain",
        async function () {
            const owner = await wnft.ownerOf(0)
            expect(owner).to.equal(firstAccount)

            console.log("wnft owner: ", owner);
        }
    )


})

// uint256 tokenId,
// address newOwner,
// uint64 destinationChainSelector,
// address receiver

describe("dest chain -> source chain tests", async function () {
    it("test if user can burn the wrapped nft and send ccip message on the destination chain",
        async function () {
            await ccipSimulator.requestLinkFromFaucet(
                nftPoolBurnAndMint.target, ethers.parseEther("10"))
            // lock and send with CCIP
            await wnft.approve(nftPoolBurnAndMint.target, 0)
            await nftPoolBurnAndMint.burnAndSendNFT(0,
                firstAccount,
                destChainSelector,
                nftPoolLockAndRelease.target)

            //check if the wnft's totalSupply is equal 0
            const totalSupply = await wnft.totalSupply();
            expect(totalSupply).to.equal(0)

        })

        it("test if the nft is unlocked from the pool on the source chain",
            async function () {
                //check if the nft is unlocked
                const owner = await nft.ownerOf(0)
                expect(owner).to.equal(firstAccount)
    
                console.log("nft owner: ", owner);
            }
        )
})






