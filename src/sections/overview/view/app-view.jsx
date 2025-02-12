import axios from 'axios';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactLoading from 'react-loading';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { fTimestampToDate } from 'src/utils/format-time';

import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------




export default function AppView() {

  const [user, setUser] = useState({});
  const [statistics, setStatistics] = useState({});
  const [lastsTransactions, setLastsTransactions] = useState([]);
  const [graphData, setGraphData] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_ENVIRONMENT === "development" ? import.meta.env.VITE_SERVER_DEVELOPMENT : import.meta.env.VITE_SERVER_PRODUCTION

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    const auth_token_type = localStorage.getItem("auth_token_type");
    const token = `${auth_token_type} ${auth_token}`;


    axios.all([axios.get(`${API_URL}users/`, {
      headers: { Authorization: token },
    }), axios.get(`${API_URL}tangle/transaction/statistics`, {
      headers: { Authorization: token }
    }), axios.get(`${API_URL}tangle/transaction/user`, {
      headers: { Authorization: token }
    }), axios.get(`${API_URL}tangle/transactions/graph`, {
      headers: { Authorization: token }
    })]).then(axios.spread((res1, res2, res3, res4) => {
      setUser(res1.data.result)
      setStatistics(res2.data.result)
      setLastsTransactions(res3.data.result)
      setGraphData(res4.data.result)
      console.log(res4.data.result)
      setIsLoading(false);
    }))
  }, [API_URL]);


  return (
    isLoading ? <Grid container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center">
      <ReactLoading type="spin" color='black' height='50px' width='50px' />
    </Grid>
      :
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back {`${user.first_name} ${user.last_name}`} 👋
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Transations Sended"
              total={statistics.total_sended_transactions}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Transactions Received"
              total={statistics.total_received_transactions}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Transactions"
              total={statistics.total_transactions}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            />
          </Grid>


          <Grid xs={12} md={5} lg={15}>
            <AppWebsiteVisits
              title="Transaction Graph"
              subheader="Graph of transactions received and/or sent"
              chart={{
                labels: graphData.labels,
                series: [
                  {
                    name: 'Send',
                    type: 'area',
                    fill: 'gradient',
                    data: graphData.transactions_sended_per_day,
                  },
                  {
                    name: 'Receive',
                    type: 'line',
                    fill: 'solid',
                    data: graphData.transactions_received_per_day,
                  },
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Last Transactions"
              list={lastsTransactions.map((value, index) => ({
                id: faker.string.uuid(),
                title: value.type === "sender" ? "Transaction Sended" : "Transaction Received",
                description: value.type === "sender" ? `You send a transaction to ${value.recipient}` : `You received a transaction from ${value.sender}`,
                type: value.type,
                postedAt: fTimestampToDate(value.timestamp),
              }))}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Last Transactions Timeline"
              list={lastsTransactions.map((value, index) => ({
                id: faker.string.uuid(),
                title: lastsTransactions.map((i) => i.type === "sender" ? `Send to ${i.recipient}` : `Receive from ${i.sender}`)[index],
                type: `order${index + 1}`,
                time: fTimestampToDate(value.timestamp),
              }))}
            />
          </Grid>
        </Grid>
      </Container>
  );
}
