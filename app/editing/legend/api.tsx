import type { ApiEntry } from '../../../lib/types';

export const api: ApiEntry[] = [
  {
    name: 'edit.legend.category()',
    summary: 'Turn legend swatches into click targets that set a categorical field on target rows.',
    signature: 'edit.legend.category(options?)',
    options: [
      {
        name: 'row',
        type: 'number | number[] | Function',
        default: 'chart selection (or row 0 for 1-row data)',
        desc: 'Which row or rows to update when a swatch is clicked. Defaults to the current selection.',
      },
    ],
  },
  {
    name: 'edit.legend.value()',
    summary: 'Add a draggable handle to a continuous gradient colour ramp.',
    signature: 'edit.legend.value(options?)',
    options: [
      {
        name: 'row',
        type: 'number | Function',
        default: '0',
        desc: 'Target row whose numeric value is updated when dragging the ramp handle.',
      },
    ],
  },
  {
    name: 'edit.scale.categories()',
    summary: 'Inline add, rename, and remove affordances for the scale domain.',
    signature: 'edit.scale.categories(options?)',
    options: [
      {
        name: 'mode',
        type: '"rescale" | "grow"',
        default: '"rescale"',
        desc: '"rescale" compresses items to keep chart size fixed; "grow" widens the chart when categories are added.',
      },
    ],
  },
];
