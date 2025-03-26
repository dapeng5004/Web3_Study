const { getNamedAccounts } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { firstAccount } = await getNamedAccounts();

    log(`Deploying NFT contract...`);
    const NFT = await deploy("MyToken", {
        contract: "MyToken",
        from: firstAccount,
        args: ["MyToken", "MT"],
        log: true,
    });
    log(`NFT contract deployed successfully`);
}

module.exports.tags = ["sourcechain", "all"];