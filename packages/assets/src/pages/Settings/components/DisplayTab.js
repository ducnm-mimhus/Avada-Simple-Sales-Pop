import React from 'react';
import {BlockStack, Card, Checkbox, FormLayout, Text} from '@shopify/polaris';
import DesktopPositionInput from './DesktopPositionInput';
import {Slider} from '@assets/pages/Settings/components/Slider';

// eslint-disable-next-line react/prop-types
export default function DisplayTab({settings, onChange}) {
  return (
    <BlockStack gap="500">
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h5">
            APPEARANCE
          </Text>

          <DesktopPositionInput
            value={settings.position}
            onChange={val => onChange('position', val)}
          />

          <Checkbox
            label="Hide time ago"
            checked={settings.hideTimeAgo}
            onChange={val => onChange('hideTimeAgo', val)}
          />

          <Checkbox
            label="Truncate content text"
            helpText="If your product name is long for one line, it will be truncated to 'Product na...'"
            checked={settings.truncateProductName}
            onChange={val => onChange('truncateProductName', val)}
          />
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h5">
            TIMING
          </Text>
          <FormLayout>
            <FormLayout.Group>
              {Slider(
                'Display duration',
                'displayDuration',
                1,
                20,
                'second(s)',
                'How long each pop will display on your page.',
                settings,
                onChange
              )}
              {Slider(
                'Time before the first pop',
                'firstDelay',
                0,
                60,
                'second(s)',
                'The delay time before the first notifications.',
                settings,
                onChange
              )}
            </FormLayout.Group>

            <FormLayout.Group>
              {Slider(
                'Gap time between two pops',
                'popsInterval',
                0,
                60,
                'second(s)',
                'The time interval between two popup notifications.',
                settings,
                onChange
              )}
              {Slider(
                'Maximum of popups',
                'maxPopsDisplay',
                1,
                80,
                'pop(s)',
                'The maximum number of popups are allowed to show after page loading.',
                settings,
                onChange
              )}
            </FormLayout.Group>
          </FormLayout>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
