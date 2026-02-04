import React, {useState} from 'react';
import {BlockStack, Button, Card, InlineStack, Layout, Page, Text} from '@shopify/polaris';

/**
 *
 * @returns {Element}
 * @constructor
 */
export default function Home() {
  const [enabled, setEnabled] = useState(false);
  const handleToggle = () => {
    setEnabled(pre => !pre);
  };
  return (
    <Page title="Home">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap={'400'}>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="span">
                    App status is{' '}
                    <Text as="span" fontWeight="bold">
                      {enabled ? 'enable' : 'disable'}
                    </Text>
                  </Text>
                  <Button
                    variant="primary"
                    tone={enabled ? 'critical' : 'success'}
                    onClick={handleToggle}
                  >
                    {enabled ? 'Disable' : 'Enable'}
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
