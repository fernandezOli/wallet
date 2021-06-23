// loader from : https://github.com/n1c01a5/web3-labo
// Web from : https://www.figma.com/file/CCPlNOj9I081vUai2T2c2v/Wallet_DogeSchool?node-id=0%3A1
import { useCallback, useState, useEffect } from 'react'
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Web3 from 'web3'

function App() {
  const [isConnectedWeb3, setIsConnectedWeb3] = useState(false)
  //const [idBlockchain, setIdBlockchain] = useState(0)
  const [nameBlockchain, setNameBlockchain] = useState("Unknow network")
  const [idAccount, setIdAccount] = useState("")
  const [idAccountOverflow, setIdAccountOverflow] = useState("")
  const [linkAccount, setLinkAccount] = useState("")
  const [balanceValue, setBalanceValue] = useState(0)
  const [value, setValue] = useState(0)
  const [txHash, setTxHash] = useState("")
  const [isMined, setIsMined] = useState(false)
  const [addressSend, sendAddress] = useState("")

  useEffect(() => {
    connectToWeb3AtStartup()
  });

  function toastSuccess() {
    toast.success('Success', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
      });
  }

  function toastError(message) {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
      });
  }

  const connectToWeb3AtStartup = useCallback(
    async () => {
      if(window.ethereum) {
        try {
          const web3 = new Web3(Web3.givenProvider)

          const accounts = await web3.eth.getAccounts()
          if (accounts.length !== 0) {
            getInfoAccount()
            setIsConnectedWeb3(true)
          }

        } catch (err) {
          console.log(err)
        }
      } else {
        alert("Install Metamask")
      }
    },
  )

  const getInfoAccount = useCallback(
  async () => {
    try {
      const web3 = new Web3(Web3.givenProvider)
      const accounts = await web3.eth.getAccounts()
      setIdAccount(accounts[0])
      let addresstext = idAccount.toLowerCase();
      let addressStar = addresstext.substring(0, 5)
      let addressEnd = addresstext.substring(addresstext.length - 4, addresstext.length - 1)
      setIdAccountOverflow(addressStar + "..." + addressEnd)

      let idChain = await web3.eth.getChainId().then(value => { return value})

      switch(idChain) {
        case 1:
          setNameBlockchain("Ethereum")
          setLinkAccount("https://etherscan.io/address/" + accounts[0])
          break
        case 3:
          setNameBlockchain("Ropsten")
          setLinkAccount("https://Ropsten.etherscan.io/address/" + accounts[0])
          break
        case 4:
          setNameBlockchain("Rinkeby")
          setLinkAccount("https://Rinkeby.etherscan.io/address/" + accounts[0])
          break
        case 5:
          setNameBlockchain("Goerli")
          setLinkAccount("https://Goerli.etherscan.io/address/" + accounts[0])
          break
        case 42:
            setNameBlockchain("Kovan")
            setLinkAccount("https://kovan.etherscan.io/address/" + accounts[0])
            break
        case 97:
            setNameBlockchain("Binance testnet")
            break
        default:
          setNameBlockchain("Unknow network (id Blockchain: " + idChain + ")")
          setLinkAccount("")
      }

      const value = await web3.eth.getBalance(accounts[0])
      setBalanceValue(parseFloat(web3.utils.fromWei(value, "ether")).toFixed(2))

    } catch (err) {
      console.log(err)
    }
  }
  )

  const connectToWeb3 = useCallback(
    async () => {
      if(window.ethereum) {
        try {
          //const web3 = new Web3(Web3.givenProvider)

          const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
          if (accounts.length !== 0) {
            getInfoAccount()
            setIsConnectedWeb3(true)
            toastSuccess()
          }

        } catch (err) {
          console.log(err)
        }
      } else {
        alert("Install Metamask")
      }
    },
  )

  const sendWei = useCallback(
    async () => {
      //isConnectedWeb3
      if (addressSend.length === 0) {
        toastError("address cannot be empty !")
        return
      }

      //console.log(value)
      if (isNaN(value)) {
        toastError("amount can only be number !")
        return
      }

      if (!value) {
        toastError("amount cannot be empty !")
        return
      }

      if (parseFloat(value) === 0) {
        toastError("amount cannot be 0 !")
        return
      }

      const web3 = new Web3(Web3.givenProvider)

      const accounts = await web3.eth.getAccounts()

      let contractAddress = addressSend.toLowerCase();
      let accountAddress = accounts[0].toLowerCase();
      // account and address is the same
      if (contractAddress === accountAddress) {
        toastError("address send and receive are the same !")
        return
      }

      const check = web3.utils.isAddress(contractAddress)
      if (!check) {
        toastError("invalid address")
        return
      }
      let ETHamount = web3.utils.toWei(value, 'ether')

      web3.eth.sendTransaction({to: contractAddress, from: accountAddress, value: ETHamount})
      .once('transactionHash', (transactionHash) => setTxHash(transactionHash))
      .on('confirmation', (confNumber, receipt) => {
        setIsMined(true)
        toastSuccess()
      })  
    }, [value, addressSend]
  )

  return (
    <div className="App">
      <main className="main">
              <ToastContainer />
        <div id="connect">
          <div className="flex-item">
            <h2>Wallet dApp</h2>
          </div>
          <div className="cnx-item">
            {
              isConnectedWeb3 ? <label id="labelBC">{nameBlockchain}</label> : <label>Not connected</label>
            }
          </div>
          <div className="raw-item">
            {
              isConnectedWeb3 ? <label id="labelAdr"><a href={linkAccount} rel="noreferrer" target="_blank">{idAccountOverflow}</a></label> : <button onClick={connectToWeb3} id="web3Btn">Connect web3</button>
            }
          </div>
        </div>

        <div>
        {
          isConnectedWeb3 ? <div><p>Amount Ethers: {balanceValue}</p></div> : <div><p>Amount Ethers:</p></div>
        }
        </div>
        <div><p>Address: 
          <input type="text" id="inputAddress" onChange={e => sendAddress(e.target.value)} placeholder="address wallet to reveive fund 0x..." size="50" /></p>
          <p>Amount:
          <input type="text" onChange={e => setValue(e.target.value)} placeholder="amount ether ex: 10 or 0.001" size="30" /></p>
          <p><button onClick={sendWei} className="sendBtn">Envoyer</button></p><p></p></div>

        {
          (txHash && !isMined) 
            && 
            <div>
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
              <a href={`https://kovan.etherscan.io/tx/${txHash}`} rel="noreferrer" target="_blank">
                Loader ...
              </a>
            </div>
        }

      </main>
    </div>
  );
}

export default App;
