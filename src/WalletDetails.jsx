import React, {useState} from 'react';
import './walletdetails.css';

const WalletDetails =() => {

    //declare variables for error message, account address, and list of owned nfts
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userNFTs, setUserNFTs] = useState([]);

    //handling calling the function to connect to metamask and get users address
    const connectWalletHandler= () =>{
        if(window.ethereum){
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
            })
        } else{
            setErrorMessage('Install MetaMask');
        }
    }

    //set the address in the variable when new account  detected, call the function to retrieve nfts
    const accountChangedHandler=(newAccount) =>{
        setDefaultAccount(newAccount);
        getUserNFTs(newAccount.toString());
    } 

    //function to retrieve users nfts using moralis API
    const getUserNFTs=(address)=>{
        const  headers= {'accept': 'application/json',
                        'X-API-Key': 'ykiQ2jlGw3WKJemyW1nCbA7C1Xi1dTOYNNnUP4DzbCeta4X7NZH4uV7onlRyqQ4H'};
        let requestURL=`https://deep-index.moralis.io/api/v2/${address}/nft/0x434f7e5713100ace27310e45a8b78bd82e43054e?chain=polygon&format=decimal`;             

        fetch(requestURL, {headers})
        .then(response =>{
            console.log(response.json);
            return response.json();
        })
        .then(jsonResponse =>{
            setUserNFTs(jsonResponse.result)
        });
    }

    //if the user switches the account they are using detect it and display the corresponding info
    window.ethereum.on('accountsChanged', accountChangedHandler);

    return (
        <div className="walletdetails">
            <h2>
                {"Press button to  connect wallet and view owned NFTs from the BitDriver Collection"} 
            </h2>
            <button  onClick={connectWalletHandler} className="ConnectButton">Connect Wallet</button>
            <div className="accountInfo">
                <h3>
                    Address: 
                    <div className="addressText">
                        {defaultAccount}
                    </div>
                </h3>
            </div>
            <div className="accountNFTs">
                <h3>
                    NFTs: 
                    <ul className="NFTList">
                        {userNFTs.map(NFT => <li key="{NFT.token_address + NFT.block_number_minted}">
                        {NFT.token_id}</li>)}
                    </ul>
                </h3>
            </div>
            {errorMessage}
        </div>
    )
}

export default WalletDetails;