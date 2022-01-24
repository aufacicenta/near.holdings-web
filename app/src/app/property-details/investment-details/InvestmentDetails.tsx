import React, { useEffect, useState } from "react";
import moment from "moment";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { useWalletSelectorContext } from "hooks/useWalletSelectorContext/useWalletSelectorContext";
import { CircularProgress } from "ui/circular-progress/CircularProgress";
import { Button } from "ui/button/Button";
import { useNearContract } from "hooks/useNearContract/useNearContract";
import formatAccountBalance from "providers/near/formatAccountBalance";

import styles from "./InvestmentDetails.module.scss";
import { InvestmentDetailsProps } from "./InvestmentDetails.types";

const VIEW_METHODS = [
  "deposits_of",
  "get_deposits",
  "get_total_funds",
  "get_expiration_date",
  "get_min_funding_amount",
  "get_recipient_account_id",
  "is_deposit_allowed",
  "is_withdrawal_allowed",
];

const CHANGE_METHODS = ["deposit", "withdraw", "delegate_funds"];

export const InvestmentDetails: React.FC<InvestmentDetailsProps> = ({ contractAddress }) => {
  const [values, setValues] = useState<{
    totalFunds?: string;
    expirationDate?: JSX.Element;
    minFundingAmount?: string;
    recipientAccountId?: string;
    isDepositAllowed?: boolean;
    isWithdrawalAllowed?: boolean;
    deposits?: string[];
    depositsOf?: string;
  }>({
    totalFunds: formatAccountBalance("0"),
    expirationDate: undefined,
    minFundingAmount: formatAccountBalance("0"),
    recipientAccountId: undefined,
    isDepositAllowed: false,
    isWithdrawalAllowed: false,
    deposits: [],
    depositsOf: undefined,
  });

  const wallet = useWalletSelectorContext();

  // @TODO pass the current contract address by pre-rendered props
  const contract = useNearContract(wallet, contractAddress, {
    viewMethods: VIEW_METHODS,
    changeMethods: CHANGE_METHODS,
  });

  useEffect(() => {
    if (!contract) {
      return;
    }

    const getConstantValues = async () => {
      const getTotalFundsResponse = await contract!.get_total_funds();
      const getMinFundingAmountResponse = await contract!.get_min_funding_amount();
      const deposits = await contract!.get_deposits();
      const expirationDate = await contract!.get_expiration_date();

      setValues({
        totalFunds: formatAccountBalance(BigInt(getTotalFundsResponse).toString()),
        minFundingAmount: formatAccountBalance(BigInt(getMinFundingAmountResponse).toString()),
        deposits,
        expirationDate: (
          <Typography.Description>
            Offer expires
            <br />
            {moment(expirationDate / 1000000)
              .utcOffset(0)
              .calendar()
              .toLowerCase()}
            , GMT-0
          </Typography.Description>
        ),
      });
    };

    getConstantValues();
  }, [contract]);

  const onClickAuthorizeWallet = () => {
    wallet.onClickConnect({
      contractId: contractAddress,
      methodNames: [...VIEW_METHODS, ...CHANGE_METHODS],
    });
  };

  return (
    <Card shadow>
      <Card.Content>
        <Typography.Headline2 className={styles["investment-details__heading2"]}>
          Investment Details
        </Typography.Headline2>
        <div className={styles["investment-details__sold"]}>
          <div className={styles["investment-details__circular-progress"]}>
            <CircularProgress size={70} strokeWidth={5} percentage={80} />
          </div>
          <div className={styles["investment-details__sold-description"]}>
            <Typography.Description>Funded</Typography.Description>
            <Typography.Text flat>{values.totalFunds}</Typography.Text>
            <Typography.MiniDescription>
              80% of property price · <Typography.Anchor href="#">1 Ⓝ = 11.99 USD</Typography.Anchor>
            </Typography.MiniDescription>
          </div>
        </div>
        <div className={styles["investment-details__price"]}>
          <div className={styles["investment-details__price-heading"]}>
            <Typography.TextBold className={styles["investment-details__price-heading-text"]} flat>
              Price
            </Typography.TextBold>
          </div>
          <div className={styles["investment-details__price-description"]}>
            <Typography.TextBold flat>{values.minFundingAmount}</Typography.TextBold>
            <Typography.MiniDescription>150,000.00 USD</Typography.MiniDescription>
          </div>
        </div>
        <hr />
        <Grid.Row>
          <Grid.Col lg={6}>
            <Typography.TextBold flat># of NEAR wallets</Typography.TextBold>
            <Typography.MiniDescription>See current investors</Typography.MiniDescription>
          </Grid.Col>
          <Grid.Col>
            <Typography.Text>{values.deposits?.length}</Typography.Text>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row nowrap>
          <Grid.Col lg={6}>
            <Typography.TextBold flat>Escrow Contract</Typography.TextBold>
            <Typography.MiniDescription>Your money is secured by the NEAR Protocol</Typography.MiniDescription>
          </Grid.Col>
          <Grid.Col>
            <Typography.Text>
              <Typography.Anchor href="#" truncate>
                {contractAddress}
              </Typography.Anchor>
            </Typography.Text>
          </Grid.Col>
        </Grid.Row>
      </Card.Content>
      <Card.Actions>
        {!wallet.isConnected ? (
          <>
            <Button onClick={onClickAuthorizeWallet}>Authorize Wallet</Button>
            <Typography.Description>to load the contract details.</Typography.Description>
          </>
        ) : (
          <>
            <Button>Invest Now</Button>
            {values.expirationDate}
          </>
        )}
      </Card.Actions>
    </Card>
  );
};
