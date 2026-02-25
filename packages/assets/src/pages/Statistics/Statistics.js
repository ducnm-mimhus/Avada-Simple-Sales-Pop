import React, {useCallback, useEffect, useState} from 'react';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import {
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  InlineStack,
  Layout,
  Page,
  ProgressBar,
  Select,
  SkeletonBodyText,
  Text
} from '@shopify/polaris';
import {RefreshIcon} from '@shopify/polaris-icons';
import {RatioClickChart} from '@assets/pages/Statistics/component/RatioClickChart';
import {TrendChart} from '@assets/pages/Statistics/component/TrentChart';

export default function Statistics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7');

  const options = [
    {label: 'Last 7 days', value: '7'},
    {label: 'Last 30 days', value: '30'},
    {label: 'Last 90 days', value: '90'},
    {label: 'Last year', value: '365'}
  ];

  const {data, loading, fetchApi} = useFetchApi({
    url: `/statistics?days=${selectedPeriod}`,
    defaultData: {totalImpressions: 0, totalClicks: 0, chartData: []}
  });

  useEffect(() => {
    fetchApi(`/statistics?days=${selectedPeriod}`);
  }, [selectedPeriod]);

  const handleSelectChange = useCallback(value => {
    setSelectedPeriod(value);
  }, []);

  const ratio =
    data.totalImpressions > 0
      ? ((data.totalClicks / data.totalImpressions) * 100).toFixed(1)
      : '0.0';

  if (loading) return <LoadingState />;

  return (
    <Page
      title="Statistics"
      subtitle="Track the performance of your sales popups"
      primaryAction={
        <Button icon={RefreshIcon} onClick={() => fetchApi(`/statistics?days=${selectedPeriod}`)}>
          Refresh Data
        </Button>
      }
    >
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="400">
            <div style={{maxWidth: '200px'}}>
              <Select
                label="Date range"
                labelHidden
                options={options}
                onChange={handleSelectChange}
                value={selectedPeriod}
              />
            </div>
          </Box>
        </Layout.Section>

        <Layout.Section>
          <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
              <Card>
                <Box padding="400">
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h3" color="subdued">
                      Total of pop up
                    </Text>
                    <Box paddingBlockStart="200" paddingBlockEnd="200">
                      <Text variant="heading3xl" as="p" fontWeight="bold">
                        {data.totalImpressions}
                      </Text>
                    </Box>
                    <ProgressBar progress={100} tone="secondary" size="small" />
                  </BlockStack>
                </Box>
              </Card>
            </Grid.Cell>

            <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
              <Card>
                <Box padding="400">
                  <BlockStack gap="400">
                    <InlineStack>
                      <Text variant="headingMd" as="h3" color="subdued">
                        Total of clicks: {data.totalClicks}
                      </Text>
                    </InlineStack>

                    <RatioClickChart
                      totalClicks={data.totalClicks}
                      totalImpressions={data.totalImpressions}
                      ctr={ratio}
                    />
                  </BlockStack>
                </Box>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Box padding="400">
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Performance over time
                </Text>
                <TrendChart data={data.chartData} />
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

const LoadingState = () => (
  <Page title="Statistics">
    <Layout>
      <Layout.Section>
        <Card>
          <SkeletonBodyText lines={5} />
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
);
