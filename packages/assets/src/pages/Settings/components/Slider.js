import {RangeSlider, TextField} from '@shopify/polaris';
import React from 'react';

/**
 * \
 * @param label
 * @param key
 * @param min
 * @param max
 * @param unit
 * @param helpText
 * @param settings
 * @param onChange
 * @returns {React.JSX.Element}
 * @constructor
 */
export const Slider = (label, key, min, max, unit, helpText, settings, onChange) => (
  <RangeSlider
    label={label}
    value={settings[key]}
    onChange={val => onChange(key, val)}
    min={min}
    max={max}
    helpText={helpText}
    output
    suffix={
      <div style={{width: '137px'}}>
        <TextField
          type="number"
          value={String(settings[key])}
          onChange={val => onChange(key, Number(val))}
          suffix={unit}
          autoComplete="off"
          min={min}
          max={max}
        />
      </div>
    }
  />
);
