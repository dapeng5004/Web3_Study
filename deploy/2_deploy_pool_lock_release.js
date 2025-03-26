const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { firstAccount } = await getNamedAccounts()

    log(`Deploying NFTPoolLockAndRelease contract...`)

    let sourceChainRouter, linkTokenAddr
    //address _router,address _link,address _nftAddr
    if (developmentChains.includes(network.name)) {
        const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
        const ccipConfig = await ccipSimulator.configuration();
        sourceChainRouter = ccipConfig.sourceRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    } else {
        sourceChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }

    const nftDeployment = await deployments.get("MyToken");
    const nftAddr = nftDeployment.address;

    const lockAndRelease = await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        //address _router,address _link,address _nftAddr
        args: [sourceChainRouter, linkTokenAddr, nftAddr],
        log: true,
    });

    log(`NFTPoolLockAndRelease contract deployed successfully`);
}
module.exports.tags = ["sourcechain", "all"];