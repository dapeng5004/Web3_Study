const{getNamedAccounts}=require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const {firstAccount} = await getNamedAccounts();

    log(`Deploying WNFT contract...`);
    const WNFT = await deploy("WrappedMyToken", {
        contract: "WrappedMyToken",
        from: firstAccount,
        args: ["WrappedMyToken", "WMT"],
        log: true,
    });
    log(`WNFT contract deployed successfully`);
}

module.exports.tags = ["destchain", "all"];