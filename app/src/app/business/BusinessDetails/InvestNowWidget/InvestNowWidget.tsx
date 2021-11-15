import clsx from "clsx";
import { Container } from "react-grid-system";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { Button } from "ui/button/Button";
import { Icon } from "ui/icon/Icon";
import { Tooltip } from "ui/tooltip/Tooltip";

import { InvestNowWidgetProps } from "./InvestNowWidget.types";
import styles from "./InvestNowWidget.module.scss";

export const InvestNowWidget: React.FC<InvestNowWidgetProps> = ({ className, content }) => (
  <div className={clsx(styles["invest-now-widget"], className)}>
    <Container>
      <Grid.Row>
        <Grid.Col lg={4} offset={{ lg: 8 }} className={styles["invest-now-widget__fixed-col"]}>
          <Card shadow>
            <Card.Content>
              <Typography.Description>
                Nivel de Riesgo: Medio{" "}
                <Tooltip
                  title="Nivel de Riesgo Medio"
                  description={`${content.title} tiene una edad de 2 años. Tiene libros contables en orden y tiene un score 8.5 de 10 en el Protocolo de Inversión.`}
                />
              </Typography.Description>
              <hr />
              <Typography.Headline3 className={styles["invest-now-widget__cta-text"]}>
                Invierte en {content.title}
              </Typography.Headline3>
              <div className={styles["invest-now-widget__terms"]}>
                <Grid.Row>
                  <Grid.Col lg={6}>
                    <Typography.Headline4>1.5x</Typography.Headline4>
                    <Typography.Text>
                      Retorno sobre tu inversión.{" "}
                      <Tooltip
                        title="ROI"
                        description={`Si inviertes 10 SAT, ${content.title} se compromete a devolverte 15 SAT a lo largo de la vida útil del acuerdo: Nov 21, 2025.`}
                      />
                    </Typography.Text>
                  </Grid.Col>
                  <Grid.Col lg={6}>
                    <Typography.Headline4>25 SAT</Typography.Headline4>
                    <Typography.Text>Inversión mínima.</Typography.Text>
                  </Grid.Col>
                </Grid.Row>
              </div>
              <Button fullWidth>
                Depositar BTC&nbsp;
                <Icon name="icon-power" />
              </Button>
              <div className={styles["invest-now-widget__goal"]}>
                <div>
                  <Typography.Headline4>
                    <Icon name="icon-bag-dollar" /> 3500 SAT
                  </Typography.Headline4>
                  <Typography.Description>Invertidos hasta hoy: $3,000.00 USD</Typography.Description>
                </div>
                <div>
                  <Typography.Headline4>
                    <Icon name="icon-users" /> 23
                  </Typography.Headline4>
                  <Typography.Description>Inversionistas</Typography.Description>
                </div>
                <div>
                  <Typography.Headline4>
                    <Icon name="icon-timer" /> 15 días
                  </Typography.Headline4>
                  <Typography.Description>Restantes para invertir</Typography.Description>
                </div>
              </div>
              <div className={styles["invest-now-widget__warnings"]}>
                <div>
                  <Typography.Description>
                    <strong>Volatilidad 0</strong>
                  </Typography.Description>
                  <Typography.Description>
                    Tu depósito estará respaldado en un <strong>Stable Coin Escrow</strong> hasta cumplir la meta de
                    inversión.
                  </Typography.Description>
                </div>
                <div>
                  <Typography.Description>
                    <strong>Periodo de Retorno</strong>
                  </Typography.Description>
                  <Typography.Description>
                    Por ejemplo, si inviertes 10 SAT, {content.title} se compromete a devolverte 15 SAT durante la vida
                    útil del acuerdo: <strong>Nov 21, 2025.</strong>
                  </Typography.Description>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </Container>
  </div>
);
