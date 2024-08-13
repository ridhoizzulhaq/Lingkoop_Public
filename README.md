
# Lingkoop : Build for ETH SEA

## Smart Contract
### ERC -1155 Ticketing Smart Contract
deployed on :
https://sepolia-blockscout.lisk.com/address/0x51EBd1A609631D2b7B9bf2b9Ba80179dE714b6F1


code :
https://github.com/ridhoizzulhaq/Lingkoop_Public/blob/main/ticketing%20smart%20contract/lingkoop.sol

#### setDistributionContract: 
Allows the owner to set the address of the revenue distribution contract. This address is used to distribute payments if the recipient is the distribution contract.

#### createItem: 
Allows the owner to create a new item (NFT) with a specified ID, price, recipient, and metadata URI. It stores the item in the items mapping.

#### purchaseItem: 
Allows users to purchase an NFT by sending the required Ether. It handles payment to either the recipient or the distribution contract and mints the NFT to the buyer.


### ERC - 1155 Revenue Smart Contract
Deployed on :
https://sepolia-blockscout.lisk.com/address/0x73DeAB1fF060B80FbCD980F3713EEbe2Cfdb1036

code :
https://github.com/ridhoizzulhaq/Lingkoop_Public/blob/main/ticketing%20smart%20contract/RevenueToken.sol

createRevenueItem:
Creates a new revenue item with specified parameters like id, creator, creatorPortion, totalTokens, and targetInvestment.

Calculates the price per token and stores the item details in the revenueItems mapping.

#### mintRevenueToken:
Allows users to mint tokens for a specific revenue item by sending the appropriate amount of Ether.
Updates the total supply of tokens and tracks holders who have purchased tokens.
Accumulates revenue from minting for the creator.

#### distributeRevenue:
Distributes revenue among token holders and the creator based on the creatorPortion.
Calculates the amount each holder and the creator should receive and stores it in pendingWithdrawals.

#### withdrawMintingRevenue:
Allows creators to withdraw the revenue accumulated from the minting of their tokens.

#### withdrawRoyalty:
Enables both creators and token holders to withdraw their share of the distributed revenue.



##  How Calculates the price per token work
In Lingkoop user can purchase ERC1155 NFT-based funding tokens in any amount they wish, starting from 0.001 ETH
##### formula #####
Maximum Token suppy = 1000 x (investment target ) 

## React DApp

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

