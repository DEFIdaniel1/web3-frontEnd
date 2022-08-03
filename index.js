//connect to metamask
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            document.getElementById("connectButton").innerHTML = "Connected!"
        } catch (error) {
            console.log(error)
        }
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        document.getElementById("connectButton").innerHTML =
            "Metamask not available."
    }
}

//fund function

//withdraw function
