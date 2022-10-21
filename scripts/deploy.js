const { ethers, run, network } = require("hardhat")

async function main() {
    // this helps in deploying the contract
    const Tipfactory = await ethers.getContractFactory("TipContract")
    console.log("Deploying Contract...")
    const tipContract = await Tipfactory.deploy()
    await tipContract.deployed()
    console.log(`Deployed contract to: ${tipContract.address}`)

    //-------------------- verifying our contract on etherscan ----------------
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await tipContract.deployTransaction.wait(6)
        await verify(tipContract.address, [])
    }
}

// function to verify our contract automatically
async function verify(contractAddress, args) {
    console.log("Verifying the contract...")

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified.")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
