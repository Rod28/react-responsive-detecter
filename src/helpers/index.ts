import LocalStorage from 'local-storage-to-object';
// Constants
import {
  KEYS_LOCAL_STORAGE,
  SCREENS,
  COLUMNS_DISTRIBUTION,
  SCREEN_HEIGHT
} from '../constants';
// Types
import type {
  ScreenSizesType,
  SizeNamesTypes,
  SizeNamesBaseTypes,
  RowHeightType,
  ValidSizesType,
  ColumnDistributionType
} from '../types/components';

/**
 * The function receives an array of screen sizes and orders them in the following
 * way, XS, SM, MD, LG, XL, XX.
 * @param _sizeNames Array with screen sizes
 * @returns Array with sorted screen sizes
 */
export const sortScreenSize = (
  _sizeNames: Array<SizeNamesTypes>
): Array<SizeNamesTypes> => {
  const sortedSizes: Array<SizeNamesTypes> = [];

  if (_sizeNames.includes('XS')) {
    sortedSizes.push('XS');
  }

  if (_sizeNames.includes('SM')) {
    sortedSizes.push('SM');
  }

  if (_sizeNames.includes('MD')) {
    sortedSizes.push('MD');
  }

  if (_sizeNames.includes('LG')) {
    sortedSizes.push('LG');
  }

  if (_sizeNames.includes('XL')) {
    sortedSizes.push('XL');
  }

  if (_sizeNames.includes('XX')) {
    sortedSizes.push('XX');
  }

  return sortedSizes;
};

/**
 * The function may or may not receive an object with all or some of the screen sizes.
 * If it receives this data, the function sorts the values and validates them to determine
 * that they meet a value rule relative to size.
 * @param _customSize Object with custom values for screen sizes
 * @returns An array with the sorted sizes, the sizes object and a text string containing
 * an error if it exists.
 */
export const validateAndSortSizes = (
  _customSize?: ScreenSizesType
): ValidSizesType => {
  let error = '';
  const sizes =
    _customSize && Object.keys(_customSize).length > 0 ? _customSize : SCREENS;

  // We get all the keys of the 'sizes' object
  let sizeNames = Object.keys(sizes) as Array<SizeNamesTypes>;

  // Validate and sort sizes, only if '_customSize' exists
  if (_customSize && Object.keys(_customSize).length > 0) {
    // Sort screen names
    sizeNames = sortScreenSize(sizeNames);

    // Check if there are no errors in the custom values
    sizeNames.forEach((sizeName, index) => {
      const currentValue = sizes[sizeName] || 0;
      const nextValue = sizeNames[index + 1];

      if (currentValue <= 0) {
        error = `Error in 'responsiveSizes', the value of '${sizeName}' cannot be 0 or less than 0`;
      }

      if (nextValue && currentValue > (sizes[nextValue] || 0)) {
        error = `Error in 'responsiveSizes', the value of '${sizeName}' cannot be greater than '${nextValue}'`;
      }
    });
  }

  return {
    sizeNames,
    screenSizes: sizes,
    error
  };
};

/**
 * The function receives a current screen value, and will return the name of the screen that
 * value belongs to.
 * In addition, the function has a flag, '_validate', which is used so that the values are
 * only checked and sorted the first time, since it is expected that once the component has
 * been loaded, the function receives the values already corrected and validated, and it is
 * called with this flag off, and the validations are not run again.
 * @param _currentScreenSize Current screen size
 * @param _customSize Object with custom values for screen sizes
 * @param _validate Bool that indicates if the screen sizes should be validated and sorted
 * @param _sortedSizes Array with the names of the sorted sizes
 * @returns A text string indicating the current screen size
 */
export const getScreenSize = (
  _currentScreenSize: number,
  _customSize?: ScreenSizesType,
  _validate = true,
  _sortedSizes: Array<SizeNamesTypes> = []
): SizeNamesBaseTypes => {
  let currentSize = '';
  let sizes = _customSize || SCREENS;
  let sizeNames: Array<SizeNamesTypes> = _sortedSizes;

  // Validates the relationship of values to screen names and sorts the screen names
  if (_validate) {
    const { sizeNames: names, screenSizes } = validateAndSortSizes(_customSize);
    sizes = screenSizes;
    sizeNames = names;
  }

  // Find the value corresponding to the size of the screen
  sizeNames.forEach((sizeName, index) => {
    const value = sizes[sizeName] || 0;
    if (!currentSize && _currentScreenSize < value) {
      currentSize = sizeNames[index - 1] || 'INIT';
    }
  });

  return (
    !currentSize ? sizeNames[sizeNames.length - 1] : currentSize
  ) as SizeNamesBaseTypes;
};

/**
 * The function gets a specific value from localStorage, always accessing the object under
 * the same 'key'.
 * @param key Specific value to extract from localStorage
 * @param defaultValue Default value in case no values are found in localStorage
 * @returns Value extracted from localStorage or default value
 */
export const createDefaultValue = (key: string, defaultValue: any): any => {
  return LocalStorage.getItem(
    KEYS_LOCAL_STORAGE.LayoutConfig,
    key,
    defaultValue
  );
};

/**
 * The function gets the number of columns that should be painted, according to the height
 * of the window. This calculation is done including the vertical scroll.
 * @param _customRowHeight Custom size of grid rows
 * @returns A number of columns according to the height of the window.
 */
export const generateRowsNumber = (
  _customRowHeight?: RowHeightType
): number => {
  const rowHeight = _customRowHeight || SCREEN_HEIGHT;
  const height = document.documentElement.scrollHeight;
  return Math.floor(height / rowHeight);
};

/**
 * The function receives a current screen name, and according to this it will search in the default
 * object or the custom object that the user provides, the number of columns according to the name
 * of the screen that matches '_currentScreen'.
 *
 * If a screen name is passed inside '_customColumns' that is not specified in the 'screenSizes' prop,
 * the function returns 0, to indicate that this value should not be represented in columns.
 * @param _currentScreen Current screen size name
 * @param _sortedSizes Array with the names of the sorted sizes
 * @param _customColumns Object with custom values for the number of columns according to screen size
 * @returns Number of columns according to screen size
 */
export const updateColumnsNumber = (
  _currentScreen: SizeNamesBaseTypes,
  _sortedSizes: Array<SizeNamesTypes>,
  _customColumns?: ColumnDistributionType
) => {
  let numberColumns = 0;
  const columnDistribution = _customColumns || COLUMNS_DISTRIBUTION;
  const screenSizes = Object.keys(
    columnDistribution
  ) as Array<SizeNamesBaseTypes>;

  // We will search for the number of columns according to the name of the current screen
  if (screenSizes.includes(_currentScreen)) {
    numberColumns =
      columnDistribution[_currentScreen] || columnDistribution.INIT;
  }

  // We look for the index of the name of the current screen inside '_sortedSizes'
  const index = _sortedSizes.indexOf(_currentScreen as SizeNamesTypes);
  let sortedSizesCopy = [..._sortedSizes];

  // Only if 'index' is greater than 0 elements will be extracted from 'sortedSizesCopy'
  if (index > 0) {
    sortedSizesCopy = sortedSizesCopy.slice(0, index).reverse();
  }

  /**
   * Of all the available screen sizes, it is reduced from the smallest to the one that is equal
   * to the name of the current screen, and on top of those, it is searched if there is one that
   * matches one of the sizes established in 'screenSizes',
   */
  sortedSizesCopy.forEach((item) => {
    if (!numberColumns && screenSizes.includes(item)) {
      numberColumns = columnDistribution[item] || columnDistribution.INIT;
    }
  });

  return !numberColumns ? columnDistribution.INIT : numberColumns;
};
