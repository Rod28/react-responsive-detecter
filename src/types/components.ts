import React from 'react';
// Types
import Colors from './colors';

/* ---------------------------- ResponsiveDetecter ---------------------------- */

/**
 * Tipos de tema que acepta el menu de configuracion
 */
export type ThemeType = 'dark' | 'light';

/**
 * Types of valid screen sizes
 */
export type SizeNamesTypes = 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | 'XX';
export type SizeNamesBaseTypes =
  | 'INIT'
  | 'XS'
  | 'SM'
  | 'MD'
  | 'LG'
  | 'XL'
  | 'XX';

/**
 * Allows you to customize all default screen sizes
 */
export type ScreenSizesType = {
  [key in SizeNamesTypes]?: number;
};

/**
 * Allows you to change the size of the grid rows
 */
export type RowHeightType = 7 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24;

/**
 * Number of valid columns
 */
export type DistributionType = 1 | 2 | 3 | 4 | 6 | 8 | 12;

/**
 * Allows you to customize the number of columns in relation to the current screen size
 */
export interface ColumnDistributionType {
  INIT: DistributionType;
  XS?: DistributionType;
  SM?: DistributionType;
  MD?: DistributionType;
  LG?: DistributionType;
  XL?: DistributionType;
  XX?: DistributionType;
}

/**
 * Data that helps avoid repeated validations on 'getScreenSize', and detect if there
 * are errors passing invalid custom screen sizes.
 */
export interface ValidSizesType {
  sizeNames: Array<SizeNamesTypes>;
  screenSizes: ScreenSizesType;
  error: string;
}

/**
 * Describes the types that 'positionHorizontal' can take
 */
export type PositionHorizontal = 'left' | 'right';

/**
 * Describes the types that 'positionVertical' can take
 */
export type PositionVertical = 'top' | 'bottom';

/**
 * Describes the state used by ResponsiveDetecter.
 */
export interface ResponsiveDetecterState {
  isShowGrid: boolean;
  isGridFront: boolean;
  isHideRows: boolean;
  isOpenSettings: boolean;
  rowsNumber: number;
  validSizes: ValidSizesType;
  screen: SizeNamesBaseTypes;
  sizeScreen: { w: number; h: number };
  positionHorizontal: PositionHorizontal;
  positionVertical: PositionVertical;
  theme: ThemeType;
}

/* ---------------------------- Components ---------------------------- */

/**
 * Describes the data types used by the Grid component.
 */
export interface IconProps {
  color: Colors;
  className?: string;
}

/**
 * Describes the data types used by the Container component.
 */
export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Describes the data types used by the ToggleSwitch component.
 */
export interface ToggleSwitchProps {
  name: string;
  title?: string;
  defaultValue: boolean;
  color: Colors;
  colorOff: Colors;
  textColor: Colors;
  disabled: boolean;
  onValue?(val: boolean): void;
}

/**
 * Describes the state used by ToggleSwitchState.
 */
export interface ToggleSwitchState {
  checked: boolean;
}
