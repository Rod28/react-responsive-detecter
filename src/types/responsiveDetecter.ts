import {
  ScreenSizesType,
  ColumnDistributionType,
  RowHeightType
} from './components';

/**
 * Describes the data types used by ResponsiveDetecter.
 */
export interface ResponsiveDetecterProps {
  /** Disable the component, this will prevent the functions and eventListeners from executing */
  disable?: boolean;
  /** Replace all styles of the container that wraps the columns and the grid */
  classNameContainer?: string;
  /** Allows you to customize all default screen sizes */
  screenSizes?: ScreenSizesType;
  /** Allows you to customize the number of columns in relation to the current screen size */
  columnDistribution?: ColumnDistributionType;
  /** Allows you to change the size of the grid rows */
  rowHeight?: RowHeightType;
}
