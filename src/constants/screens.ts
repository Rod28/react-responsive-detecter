// Types
import type {
  ScreenSizesType,
  RowHeightType,
  ColumnDistributionType
} from '../types/components';

/**
 * The base sizes of the devices are exported.
 * If you change these values, you must change the corresponding values of
 * the css media queries.
 */
export const SCREENS: ScreenSizesType = {
  XS: 350,
  SM: 600,
  MD: 905,
  LG: 1280,
  XL: 1440,
  XX: 1920
};

/**
 * The number of base columns per screen size.
 */
export const COLUMNS_DISTRIBUTION: ColumnDistributionType = {
  INIT: 3,
  XS: 6,
  MD: 8,
  LG: 12
};

/**
 * Value of the grid separation, this value is equivalent to a multiple
 * of the base value of the sizes in _variables.scss.
 */
export const SCREEN_HEIGHT: RowHeightType = 16;
