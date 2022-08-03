import { ethers } from './ethers-5.6.esm.min.js'
import { fundMeAbi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const withdrawButton = document.getElementById('withdrawButton')
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

//connect to metamask
async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            connectButton.innerHTML = 'Connected!'
        } catch (error) {
            console.log(error)
        }
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        console.log(accounts)
    } else {
        connectButton.innerHTML = 'Metamask not available.'
    }
}

async function fund() {
    const ethAmount = ethers.utils.parseEther(
        document.getElementById('ethAmount').value
    )
    console.log(`Funding with ${ethAmount}`)

    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, fundMeAbi, signer)
        try {
            const fundTxResponse = await contract.fund({
                value: ethAmount,
            })
            await listenForTransactionMine(fundTxResponse, provider)
            console.log('Done')
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = 'Metamask not available.'
    }
}

function listenForTransactionMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`)
    //listen for transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, fundMeAbi, signer)
        try {
            const withdrawTxResponse = await contract.withdraw()
            await listenForTransactionMine(withdrawTxResponse, provider)
            console.log('Funds withdrawn successfully!')
        } catch (error) {
            console.log(error)
        }
    } else {
        withdrawButton.innerHTML = 'Metamask not available.'
    }
}

async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            const balance = await provider.getBalance(contractAddress)
            const formattedBalance = ethers.utils.formatEther(balance)
            console.log(formattedBalance)
            balanceButton.innerHTML = `Balance is ${formattedBalance} ETH`
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = 'Metamask not available.'
    }
}
