'use client';

import type { ApiOption } from '../../lib/types';
import type { OptionValue } from '../../lib/builder/types';
import { inferControl } from '../../lib/builder/controlKind';

type Props = {
  option: ApiOption;
  value: OptionValue;
  onChange: (value: OptionValue) => void;
};

export function OptionField({ option, value, onChange }: Props) {
  const control = inferControl(option);
  const isColor =
    option.name.toLowerCase().includes('color') ||
    option.name.toLowerCase().includes('fill') ||
    option.name.toLowerCase().includes('stroke') ||
    option.name.toLowerCase().includes('ink') ||
    option.name.toLowerCase().includes('accent');

  if (control.kind === 'unsupported') {
    return (
      <div className="opt-field opt-unsupported" title={option.desc ? String(option.desc) : undefined}>
        <span className="opt-name">{option.name}</span>
        <span className="opt-note">code ({option.type})</span>
      </div>
    );
  }

  if (control.kind === 'boolean') {
    return (
      <div className="opt-field opt-boolean">
        <span className="opt-name">{option.name}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="slider round" />
        </label>
      </div>
    );
  }

  if (control.kind === 'number') {
    return (
      <div className="opt-field" title={option.desc ? String(option.desc) : undefined}>
        <span className="opt-name">{option.name}</span>
        <input
          type="number"
          className="opt-input"
          value={typeof value === 'number' ? value : ''}
          placeholder={option.default}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        />
      </div>
    );
  }

  if (control.kind === 'enum') {
    return (
      <div className="opt-field" title={option.desc ? String(option.desc) : undefined}>
        <span className="opt-name">{option.name}</span>
        <select
          className="opt-select"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value || undefined)}
        >
          <option value="">{option.default || '— default —'}</option>
          {control.values.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (isColor && typeof value === 'string' && value.startsWith('#')) {
    return (
      <div className="opt-field" title={option.desc ? String(option.desc) : undefined}>
        <span className="opt-name">{option.name}</span>
        <div className="color-field-wrap">
          <input
            type="color"
            className="color-picker-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            type="text"
            className="opt-input color-text-input"
            value={value}
            placeholder={option.default}
            onChange={(e) => onChange(e.target.value || undefined)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="opt-field" title={option.desc ? String(option.desc) : undefined}>
      <span className="opt-name">{option.name}</span>
      <input
        type="text"
        className="opt-input"
        value={typeof value === 'string' ? value : ''}
        placeholder={option.default}
        onChange={(e) => onChange(e.target.value || undefined)}
      />
    </div>
  );
}
