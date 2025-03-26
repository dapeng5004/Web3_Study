const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { firstAccount } = await getNamedAccounts();

    log(`Deploying NFTPoolBurnAndMint contract...`);

    let destChainRouter, linkTokenAddr
    //address _router,address _link,address _nftAddr
    if (developmentChains.includes(network.name)) {
        const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
        const ccipConfig = await ccipSimulator.configuration();
        destChainRouter = ccipConfig.destinationRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    } else {
        destChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }

    const wnftDeployment = await deployments.get("WrappedMyToken");
    const wnftAddr = wnftDeployment.address;

    const lockAndRelease = await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        //address _router,address _link,address _nftAddr
        args: [destChainRouter, linkTokenAddr, wnftAddr],
        log: true,
    });

    log(`NFTPoolBurnAndMint contract deployed successfully`);
}
module.exports.tags = ["destchain", "all"];