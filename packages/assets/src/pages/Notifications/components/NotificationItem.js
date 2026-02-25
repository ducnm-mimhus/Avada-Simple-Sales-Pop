import React from 'react';
import {BlockStack, Icon, InlineStack, ResourceItem, Text, Thumbnail} from '@shopify/polaris';
import {CheckIcon} from '@shopify/polaris-icons';
import {formatDate, timeAgo} from '@assets/helpers/utils/timeFormater';

const NotificationItem = ({item}) => {
  const {id, firstName, city, country, productName, productImage, timestamp} = item;
  const media = <Thumbnail source={productImage} alt={productName} size="medium" />;

  return (
    <ResourceItem id={id} media={media} persistActions>
      <InlineStack align="space-between" blockAlign="start">
        <BlockStack gap="100">
          <Text as="p" variant="bodyMd">
            {firstName} in {city}, {country}
          </Text>
          <Text as="p" fontWeight="bold">
            {productName}
          </Text>
          <InlineStack gap="200" blockAlign="center">
            <Text as="span" tone="subdued" variant="bodySm">
              {timeAgo(timestamp)}
            </Text>
            <InlineStack gap="050" blockAlign="center">
              <div style={{width: 16, color: '#2C6ECB'}}>
                <Icon source={CheckIcon} />
              </div>
              <Text as="span" tone="subdued" variant="bodySm">
                by {firstName}
              </Text>
            </InlineStack>
          </InlineStack>
        </BlockStack>
        <div style={{textAlign: 'right'}}>
          <Text as="span" tone="subdued" variant="bodySm">
            {formatDate(timestamp)}
          </Text>
        </div>
      </InlineStack>
    </ResourceItem>
  );
};

export default NotificationItem;
