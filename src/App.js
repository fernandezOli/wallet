// loader from : https://github.com/n1c01a5/web3-labo
// Web from : https://www.figma.com/file/CCPlNOj9I081vUai2T2c2v/Wallet_DogeSchool?node-id=0%3A1
import { useCallback, useState, useEffect } from 'react'
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abiInterface from "./abi.json";
//import erc20Interface from "./contract.adr";

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
  const [addressSend, sendAddress] = useState("")
  const [txHash, setTxHash] = useState("")
  const [isMined, setIsMined] = useState(false)
  const [valueEdu, setValueEdu] = useState(0)
  const [addressSendEdu, sendAddressEdu] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [balanceEduValue, setBalanceEduValue] = useState(0)
  //const [erc20Interface, contractAddressERC20] = useState("")

  var contract = null;
  var erc20Interface = "0xC1eD9763170607bbd0961ce57a3B0A1022187834";

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

  function initContract() {
    // Chargement du contract
    const web3 = new Web3(Web3.givenProvider);
    const myContract = new web3.eth.Contract(
      abiInterface,
      "0xC1eD9763170607bbd0961ce57a3B0A1022187834"
    );
    contract = myContract;

    contract.methods.name().call({from: idAccount}).then((result) => {
      setTokenName(result);
    }).catch((error) => {
      console.error(error);
    });

    contract.methods.balanceOf(idAccount).call({from: idAccount}).then((result) => {
      console.log(result);
      setBalanceEduValue(parseFloat(web3.utils.fromWei(result, "ether")).toFixed(2));
    }).catch((error) => {
      console.error(error);
    });
  }

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

      const balance = await web3.eth.getBalance(accounts[0])
      setBalanceValue(parseFloat(web3.utils.fromWei(balance, "ether")).toFixed(2))

    } catch (err) {
      console.log(err)
    }
  },[idAccount]
  )

  const connectToWeb3AtStartup = //useCallback(
    async () => {
      if(window.ethereum) {
        try {
          const web3 = new Web3(Web3.givenProvider)

          const accounts = await web3.eth.getAccounts()
          if (accounts.length !== 0) {
            getInfoAccount()
            setIsConnectedWeb3(true)
            initContract(idAccount)
          }

        } catch (err) {
          console.log(err)
        }
      } else {
        alert("Install Metamask")
      }
    }
  //)

  const connectToWeb3 = //useCallback(
    async () => {
      if(window.ethereum) {
        try {
          //const web3 = new Web3(Web3.givenProvider)

          const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
          if (accounts.length !== 0) {
            getInfoAccount()
            setIsConnectedWeb3(true)
            initContract(idAccount)
            toastSuccess()
          }

        } catch (err) {
          console.log(err)
        }
      } else {
        alert("Install Metamask")
      }
    }
  //)

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

  const sendWeiEdu = useCallback(
    async () => {
      //isConnectedWeb3
      if (addressSendEdu.length === 0) {
        toastError("address cannot be empty !")
        return
      }

      //console.log(value)
      if (isNaN(valueEdu)) {
        toastError("amount can only be number !")
        return
      }

      if (!valueEdu) {
        toastError("amount cannot be empty !")
        return
      }

      if (parseFloat(valueEdu) === 0) {
        toastError("amount cannot be 0 !")
        return
      }

      const web3 = new Web3(Web3.givenProvider)

      const accounts = await web3.eth.getAccounts()

      let eduAddress = addressSendEdu.toLowerCase()
      let accountAddress = accounts[0].toLowerCase()
      //contractAddress
      if (eduAddress === accountAddress) {
        toastError("address send and receive are the same !")
        return
      }

      const check = web3.utils.isAddress(eduAddress)
      if (!check) {
        toastError("invalid address")
        return
      }
      let ETHamount = web3.utils.toWei(valueEdu, 'ether')

      contract.methods.transfer(eduAddress, ETHamount).send({from: idAccount}).then((result) => {
        //console.log(result);
        setIsMined(true)
        toastSuccess()
      }).catch((error) => {
        console.error(error);
      });

      contract.methods.balanceOf(idAccount).call({from: idAccount}).then((result) => {
        //console.log(result);
        setBalanceEduValue(parseFloat(web3.utils.fromWei(result, "ether")).toFixed(2));
      }).catch((error) => {
        console.error(error);
      });

    }, [valueEdu, addressSendEdu, idAccount, contract]
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
          <p><button onClick={sendWei} className="sendBtn">Envoyer</button></p><p></p>
        </div>

        <div>
        {
          isConnectedWeb3 ? <div><p>Amount {tokenName}: {balanceEduValue}</p></div> : <div><p>Amount:</p></div>
        }
        </div>
        <div>
          <p>Address ERC20: 
            <input type="text" id="inputContract" size="50" value={erc20Interface} disabled />
          </p>
          <p>Address: 
            <input type="text" id="inputAddress" onChange={e => sendAddressEdu(e.target.value)} placeholder="address wallet to reveive fund 0x..." size="50" />
          </p>
          <p>Amount:
            <input type="text" onChange={e => setValueEdu(e.target.value)} placeholder="amount Edu Token in ether ex: 10 or 0.001" size="30" />
          </p>
          <p><button onClick={sendWeiEdu} className="sendBtn">Envoyer</button></p><p></p>
        </div>

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
