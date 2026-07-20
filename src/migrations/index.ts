import * as migration_20260626_155653 from './20260626_155653';
import * as migration_20260712_142043 from './20260712_142043';
import * as migration_20260720_120000 from './20260720_120000';

export const migrations = [
  {
    up: migration_20260626_155653.up,
    down: migration_20260626_155653.down,
    name: '20260626_155653',
  },
  {
    up: migration_20260712_142043.up,
    down: migration_20260712_142043.down,
    name: '20260712_142043',
  },
  {
    up: migration_20260720_120000.up,
    down: migration_20260720_120000.down,
    name: '20260720_120000',
  },
];
