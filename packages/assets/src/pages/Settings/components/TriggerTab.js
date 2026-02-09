import React from 'react';
import {
  BlockStack,
  Box,
  Card,
  Checkbox,
  FormLayout,
  Select,
  Text,
  TextField
} from '@shopify/polaris';
import {renderSlider} from '@assets/pages/Settings/components/RenderSlider';

export default function TriggersTab({settings, onChange}) {
  const options = [
    {label: 'All pages', value: 'all'},
    {label: 'Specific pages', value: 'specific'}
  ];

  return (
    <BlockStack gap="500">
      <Card>
        <BlockStack gap="400">
          <Select
            label="PAGES RESTRICTION"
            options={options}
            value={settings.allowShow}
            onChange={val => onChange('allowShow', val)}
          />

          {settings.allowShow === 'specific' && (
            <>
              <TextField
                label="Included pages"
                value={settings.includedUrls}
                onChange={val => onChange('includedUrls', val)}
                multiline={4}
                helpText="Page URLs to show the pop-up (separated by new lines)"
              />
            </>
          )}
          {settings.allowShow === 'all' && (
            <>
              <TextField
                label="Excluded pages"
                value={settings.excludedUrls}
                onChange={val => onChange('excludedUrls', val)}
                multiline={4}
                helpText="Page URLs NOT to show the pop-up (separated by new lines)"
              />
            </>
          )}
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h5">
            DISPLAY LOGIC
          </Text>

          <Checkbox
            label="Enable notification looping"
            checked={settings.allowLoop}
            onChange={val => onChange('allowLoop', val)}
            helpText="Automatically cycle through recent orders to keep displaying popups even when there are no new sales."
          />

          {settings.allowLoop && (
            <FormLayout.Group>
              {renderSlider(
                'Maximum random interval',
                'randomGap',
                10,
                300,
                'second(s)',
                'To ensure authenticity, the app will wait a random amount of time (between 5 seconds and this value) before showing the next looped notifications.',
                settings,
                onChange
              )}
            </FormLayout.Group>
          )}
        </BlockStack>
      </Card>
      <Box paddingBlockEnd="1600" />
    </BlockStack>
  );
}
