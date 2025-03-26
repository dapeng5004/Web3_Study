const { getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    //判断是否是本地网络
    if (developmentChains.includes(network.name)) {

        const { deploy, log } = deployments;
        const { firstAccount } = await getNamedAccounts();
        log(`Deploying CCIPSimulator contract...`);
        const ccipSimulator = await deploy("CCIPLocalSimulator", {
            contract: "CCIPLocalSimulator",
            from: firstAccount,
            args: [],
            log: true
        });
        log(`CCIPSimulator contract deployed successfully`);
    }

}

module.exports.tags = ["test", "all"];