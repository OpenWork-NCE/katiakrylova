import * as migration_20260626_155653 from './20260626_155653';
import * as migration_20260712_142043 from './20260712_142043';
import * as migration_20260720_120000 from './20260720_120000';
import * as migration_20260720_160000 from './20260720_160000';
import * as migration_20260720_180000 from './20260720_180000';
import * as migration_20260720_190000 from './20260720_190000';

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
  {
    up: migration_20260720_160000.up,
    down: migration_20260720_160000.down,
    name: '20260720_160000',
  },
  {
    up: migration_20260720_180000.up,
    down: migration_20260720_180000.down,
    name: '20260720_180000',
  },
  {
    up: migration_20260720_190000.up,
    down: migration_20260720_190000.down,
    name: '20260720_190000',
  },
];
