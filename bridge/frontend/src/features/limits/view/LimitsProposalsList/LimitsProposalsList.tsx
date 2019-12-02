import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { useTranslate, tKeys as tKeysAll } from 'services/i18n';
import { VotingCard } from 'components/VotingCard/VotingCard';
import { Checked, ContainedCross } from 'components/icons';
import { Loading, Hint } from 'components';
import { useLimitProposalsQuery } from 'generated/bridge-graphql';

import { useStyles } from './LimitsProposalsList.style';
import { LimitsList } from '../LimitsList/LimitsList';
import { VoteButton } from '../VoteButton/VoteButton';

const tKeys = tKeysAll.features.settings.limitsProposalsList;

function LimitsProposalsList() {
  const { t } = useTranslate();
  const classes = useStyles();

  const limitsProposalsResult = useLimitProposalsQuery();
  const limitProposals = limitsProposalsResult.data?.limitProposals;

  return (
    <Grid container spacing={3}>
      <Loading gqlResults={limitsProposalsResult}>
        {!limitProposals?.length ? (
          <Grid item xs={12}>
            <Hint>
              <Typography>{t(tKeys.notFound.getKey())}</Typography>
            </Hint>
          </Grid>
        ) : (
          limitProposals.map(({ ethBlockNumber, ethAddress, status }, index) => (
            <Grid key={index} item xs={6}>
              <VotingCard
                ethBlockNumber={ethBlockNumber}
                ethAddress={ethAddress}
                status={status}
                expansionPanelTitle={t(tKeys.showLimits.getKey())}
                expansionPanelDetails={<LimitsList variant="compact" />}
              >
                {status === 'PENDING' ? (
                  <VotingCard.Voting>
                    <VoteButton />
                  </VotingCard.Voting>
                ) : (
                  <VotingCard.Result>
                    {status === 'APPROVED' && <Checked className={classes.votingForIcon} />}
                    {status === 'DECLINED' && (
                      <ContainedCross className={classes.votingAgainstIcon} />
                    )}
                    <Typography variant="h6">{t(tKeys.status[status].getKey())}</Typography>
                  </VotingCard.Result>
                )}
              </VotingCard>
            </Grid>
          ))
        )}
      </Loading>
    </Grid>
  );
}

export { LimitsProposalsList };
