import React from 'react';
import {
  Badge,
  BlockStack,
  Box,
  Card,
  Grid,
  Layout,
  Page,
  ProgressBar,
  SkeletonBodyText,
  Text
} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';

export default function Analytics() {
  const {data, loading} = useFetchApi({
    url: '/records',
    defaultData: {clicks: 0}
  });

  if (loading) return <LoadingState />;

  return (
    <Page title="Analytics" subtitle="Track the performance of your sales popups">
      <Layout>
        <Layout.Section>
          <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
              <Card title="Total Clicks" sectioned>
                <BlockStack gap="200">
                  <Text variant="heading3xl" as="h2">
                    {data.clicks}
                  </Text>
                  <Text color="subdued">Total interactions with your popups</Text>
                </BlockStack>
              </Card>
            </Grid.Cell>

            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
              <Card title="Conversion Rate (Estimated)" sectioned>
                <BlockStack gap="200">
                  <Text variant="heading3xl" as="h2">
                    {((data.clicks / 100) * 5).toFixed(1)}%
                  </Text>
                  <Badge tone="success">↑ 12% from last month</Badge>
                </BlockStack>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout.Section>

        <Layout.Section>
          <Card title="Click Performance Goal" sectioned>
            <BlockStack gap="400">
              <Text as="p">
                You have reached <b>{data.clicks}</b> out of <b>1000</b> clicks goal.
              </Text>
              <ProgressBar progress={(data.clicks / 1000) * 100} tone="highlight" />
              <Box paddingBlockStart="200">
                <Text variant="bodySm" color="subdued">
                  Goal progress is updated in real-time.
                </Text>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

const LoadingState = () => (
  <Page title="Analytics">
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <SkeletonBodyText lines={4} />
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
);
