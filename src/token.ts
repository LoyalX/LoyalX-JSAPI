import { Web3Service } from './web3-service';
import { BigNumber } from 'bignumber.js';

export class Token {

	/**
	 * 
	 * @param tokenAddress the token contract address OR null for the main loyalX tokens
	 */
	constructor(private tokenAddress: string) { }

	/**
	 * @return {string} the contract name
	 */
	private get contractName() { return "LoyaltyToken" };

	/**
	 * @return {TruffleContract} the contract
	 */
	public async getContract() {
		var web3ServiceInstance = await (Web3Service.getInstance());
		return await web3ServiceInstance.getContract(this.contractName);
	}

	/**
	 * @return {TruffleContract Instance} the contract instance
	 */
	public async getContractInstance() {
		var contract = await this.getContract();
		return this.tokenAddress ? contract.at(this.tokenAddress) : await contract.deployed();
	}

	/**
	 * get the current user balance
	 * @returns {Promise<BigNumber>}
	 */
	public async getBalance(): Promise<BigNumber> {
		try {
			var web3ServiceInstance = await (Web3Service.getInstance());
			var account = await web3ServiceInstance.getAccount();
			var contractInstance = await this.getContractInstance();
			var result = await contractInstance.balanceOf(account);

			console.log("getBalance", result);
			return result;
		} catch (err) {
			console.warn(err.message);
			throw err;
		}
	}

	/**
	 * 
	 * @param amount amount of tokens to transfer
	 * @param toAddress recipient address
	 */
	public async transfer(amount: number, toAddress: string) {
		try {
			var contractInstance = await this.getContractInstance();
			var web3ServiceInstance = await (Web3Service.getInstance());
			var account = await web3ServiceInstance.getAccount();
			var result = await contractInstance.transfer(toAddress, amount, { from: account });

			console.log("transfer", result);
			return result;
		} catch (err) {
			console.warn(err.message);
			throw err;
		}
	}

}
