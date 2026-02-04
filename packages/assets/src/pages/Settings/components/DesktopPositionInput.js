import React from 'react';
import {BlockStack, InlineGrid, Text} from '@shopify/polaris';

// eslint-disable-next-line react/prop-types
export default function DesktopPositionInput({value, onChange}) {
  const positions = [
    {label: 'Bottom Left', value: 'bottom-left'},
    {label: 'Bottom Right', value: 'bottom-right'},
    {label: 'Top Left', value: 'top-left'},
    {label: 'Top Right', value: 'top-right'}
  ];

  return (
    <BlockStack gap="400">
      <Text variant="bodyMd" as="span" tone="subdued">
        Desktop Position
      </Text>

      <InlineGrid columns={4} gap="400">
        {positions.map(pos => {
          const isSelected = value === pos.value;
          return (
            <div
              key={pos.value}
              onClick={() => onChange(pos.value)}
              style={{
                cursor: 'pointer',
                border: isSelected ? '2px solid #2C6ECB' : '1px solid #D4D4D4',
                borderRadius: '8px',
                padding: '10px',
                height: '60px',
                backgroundColor: isSelected ? '#F1F8FC' : '#FFFFFF',
                display: 'flex',
                alignItems: pos.value.includes('top') ? 'flex-start' : 'flex-end',
                justifyContent: pos.value.includes('left') ? 'flex-start' : 'flex-end'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '25px',
                  backgroundColor: isSelected ? '#2C6ECB' : '#E4E5E7',
                  borderRadius: '4px'
                }}
              />
            </div>
          );
        })}
      </InlineGrid>
      <Text variant="bodySm" tone="subdued">
        The display position of the pop on your website.
      </Text>
    </BlockStack>
  );
}
