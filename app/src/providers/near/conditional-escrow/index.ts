import { Contract } from "near-api-js";

import ipfs from "providers/ipfs";
import near from "providers/near";
import date from "providers/date";
import currency from "providers/currency";
import { WalletSelectorContextType } from "context/wallet-selector/WalletSelectorContext.types";
import getCoinCurrentPrice from "providers/currency/getCoinCurrentPrice";

import { ConditionalEscrowMethods, ConditionalEscrowValues } from "./conditional-escrow.types";

export class ConditionalEscrow {
  contract: Contract & ConditionalEscrowMethods;

  constructor(contract: Contract & ConditionalEscrowMethods) {
    this.contract = contract;
  }

  static getDefaultContractValues = (): ConditionalEscrowValues => ({
    totalFunds: "0",
    fundingAmountLimit: near.formatAccountBalance("0"),
    unpaidFundingAmount: near.formatAccountBalance("0"),
    depositsOf: "0",
    depositsOfPercentage: 0,
    currentCoinPrice: 0,
    priceEquivalence: 0,
    totalFundedPercentage: 0,
    expirationDate: date.toNanoseconds(date.now().toDate().getTime()),
    daoFactoryAccountId: "",
    ftFactoryAccountId: "",
    daoName: "",
    metadataURL: "",
    isDepositAllowed: false,
    isWithdrawalAllowed: false,
    deposits: [],
  });

  static async getCurrentPriceEquivalence(price: number): Promise<number> {
    const currentCoinPrice = await currency.getCoinCurrentPrice("near", "usd");

    return currentCoinPrice * price;
  }

  static async getPropertyFromMetadataUrl(url: string) {
    const response = await fetch(ipfs.asHttpsURL(url), {
      method: "GET",
    });

    const data = await response.json();

    return data;
  }

  async getMetadataUrl(): Promise<string> {
    const metadataURL = await this.contract.get_metadata_url();

    return metadataURL;
  }

  async getTotalFundedPercentage(): Promise<bigint> {
    return (BigInt(await this.getTotalFunds()) * BigInt(100)) / BigInt(await this.getFundingAmountLimit());
  }

  async getTotalFunds(): Promise<number> {
    const response = await this.contract.get_total_funds();

    return response;
  }

  async getFundingAmountLimit(): Promise<number> {
    const response = await this.contract.get_funding_amount_limit();

    return response;
  }

  async getConstantValues(wallet: WalletSelectorContextType): Promise<ConditionalEscrowValues> {
    const getTotalFundsResponse = await this.getTotalFunds();
    const getFundingAmountLimitResponse = await this.getFundingAmountLimit();
    const totalFundedPercentage = await this.getTotalFundedPercentage();

    const getUnpaidFundingAmountResponse = await this.contract.get_unpaid_funding_amount();

    const isDepositAllowed = await this.contract.is_deposit_allowed();
    const isWithdrawalAllowed = await this.contract.is_withdrawal_allowed();

    const deposits = await this.contract.get_deposits();
    const expirationDate = await this.contract.get_expiration_date();
    const depositsOfResponse = await this.contract.deposits_of({
      payee: wallet.address ?? wallet.context.guest.address,
    });
    const depositsOfPercentage = (BigInt(depositsOfResponse) * BigInt(100)) / BigInt(getFundingAmountLimitResponse);

    const currentCoinPrice = await getCoinCurrentPrice("near", "usd");
    const priceEquivalence = await ConditionalEscrow.getCurrentPriceEquivalence(
      Number(near.formatAccountBalanceFlat(BigInt(getFundingAmountLimitResponse).toString()).replace(",", "")),
    );

    const daoFactoryAccountId = await this.contract.get_dao_factory_account_id();
    const ftFactoryAccountId = await this.contract.get_ft_factory_account_id();
    const daoName = await this.contract.get_dao_name();
    const metadataURL = await this.contract.get_metadata_url();

    return {
      totalFunds: BigInt(getTotalFundsResponse).toString(),
      fundingAmountLimit: near.formatAccountBalance(BigInt(getFundingAmountLimitResponse).toString(), 8),
      unpaidFundingAmount: near.formatAccountBalance(BigInt(getUnpaidFundingAmountResponse).toString(), 8),
      depositsOf: BigInt(depositsOfResponse).toString(),
      totalFundedPercentage: Number(totalFundedPercentage),
      depositsOfPercentage: Number(depositsOfPercentage),
      currentCoinPrice,
      priceEquivalence,
      deposits,
      expirationDate,
      isDepositAllowed,
      isWithdrawalAllowed,
      daoFactoryAccountId,
      ftFactoryAccountId,
      daoName,
      metadataURL,
    };
  }
}
