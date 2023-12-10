import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import FileUpload from './components/FileUpload.js';
import Modal from './components/Modal.js';
import Remove from './components/Remove.js';

import './App.css';
import DriveShare from "./artifacts/contracts/DriveShare.sol/DriveShare.json";
import Display from "./components/Display.js";
function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [renvoke,setRenvoke]=useState(false);
  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    async function wallet() {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        setAccount(address);
      // contract address
        const contract = new ethers.Contract(
          process.env.contractAddress,
          DriveShare.abi,
          signer
        );
        console.log("contact is deployed on ");
        console.log(contract);
        setContract(contract);
        setProvider(signer);
      } else {
        alert("Mask is not available");
      }
    }
    provider && wallet();
  }, []);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
      {!renvoke && (
        <button className="share" onClick={() => setRenvoke(true)}>
          Revoke
        </button>
      )}
      {renvoke && (
        <Remove setRenvoke={setRenvoke} contract={contract}></Remove>
      )}
      <div className="App" >
        <h1 style={{ color: "white" }}>Ethio Drive 0.1</h1>
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload account={account} contract={contract} />
        <Display account={account} contract={contract} />
      </div>
    </>

  );
}

export default App;
