import axios from 'axios';
import { faker } from '@faker-js/faker';
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

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    const auth_token_type = localStorage.getItem("auth_token_type");
    const token = `${auth_token_type} ${auth_token}`;


    axios.all([axios.get("http://localhost:5555/users/", {
      headers: { Authorization: token },
    }), axios.get("http://localhost:5555/tangle/transaction/statistics", {
      headers: { Authorization: token }
    }), axios.get("http://localhost:5555/tangle/transaction/user", {
      headers: { Authorization: token }
    }), axios.get("http://localhost:5555/tangle/transactions/graph", {
      headers: { Authorization: token }
    })]).then(axios.spread((res1, res2, res3, res4) => {
      console.log(res2)
      console.log(res1)
      console.log(res3)
      console.log(res4.data.result.transactions_sended_per_day)
      setUser(res1.data.result)
      setStatistics(res2.data.result)
      setLastsTransactions(res3.data.result)
      setGraphData(res4.data.result)
    }))
  }, []);


  return (
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

        {/* <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Networkign Status"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Graph's Transaction"
            subheader="Transactions send/recieve per day"
            chart={{
              labels: graphData.labels,
              series: [
                {
                  name: 'Send',
                  type: 'column',
                  fill: 'solid',
                  data: graphData.transactions_sended_per_day,
                },
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
                  data: [graphData.transactions_received_per_day],
                },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="Last Transactions"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="Last Transactions"
            list={lastsTransactions.map((value, index) => ({
              id: faker.string.uuid(),
              title: value.type === "sender" ? "Transaction Sended" : "Transaction Received",
              description: value.type === "sender" ? `You send a transaction to ${value.recipient}` : `You received a transaction from ${value.sender}`,
              image: value.type === "sender" ? "/assets/icons/sender-icon.png" : "/assets/icons/recipient-icon.png",
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
