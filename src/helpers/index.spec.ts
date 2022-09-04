/**
 * @jest-environment jsdom
 */

import LocalStorage from 'local-storage-to-object';
// Helpers
import {
  sortScreenSize,
  validateAndSortSizes,
  getScreenSize,
  createDefaultValue,
  generateRowsNumber,
  updateColumnsNumber
} from './';
// Constants
import { KEYS_LOCAL_STORAGE } from '../constants';

describe('All helper tests', () => {
  describe('sortScreenSize() =>', () => {
    it('Sort by screen size', () => {
      expect(sortScreenSize(['XL', 'SM', 'LG', 'MD', 'XX', 'XS'])).toEqual([
        'XS',
        'SM',
        'MD',
        'LG',
        'XL',
        'XX'
      ]);
    });
  });

  describe('validateAndSortSizes() =>', () => {
    it('Order without errors', () => {
      expect(
        validateAndSortSizes({ XL: 1200, SM: 500, MD: 900, XS: 300 })
      ).toEqual({
        error: '',
        screenSizes: {
          MD: 900,
          SM: 500,
          XL: 1200,
          XS: 300
        },
        sizeNames: ['XS', 'SM', 'MD', 'XL']
      });
    });

    it('Invalid size order error failure', () => {
      expect(
        validateAndSortSizes({ XL: 100, SM: 200, MD: 500, XS: 800 })
      ).toEqual({
        error:
          "Error in 'responsiveSizes', the value of 'MD' cannot be greater than 'XL'",
        screenSizes: {
          MD: 500,
          SM: 200,
          XL: 100,
          XS: 800
        },
        sizeNames: ['XS', 'SM', 'MD', 'XL']
      });
    });

    it('Fails for having values with 0 or less than 0', () => {
      expect(
        validateAndSortSizes({ XL: 100, SM: 200, MD: 0, XS: 800 })
      ).toEqual({
        error:
          "Error in 'responsiveSizes', the value of 'MD' cannot be 0 or less than 0",
        screenSizes: {
          MD: 0,
          SM: 200,
          XL: 100,
          XS: 800
        },
        sizeNames: ['XS', 'SM', 'MD', 'XL']
      });

      expect(
        validateAndSortSizes({ XL: 100, SM: 200, MD: -10, XS: 800 })
      ).toEqual({
        error:
          "Error in 'responsiveSizes', the value of 'MD' cannot be 0 or less than 0",
        screenSizes: {
          MD: -10,
          SM: 200,
          XL: 100,
          XS: 800
        },
        sizeNames: ['XS', 'SM', 'MD', 'XL']
      });
    });
  });

  describe('getScreenSize() =>', () => {
    it('Get INIT screen size', () => {
      expect(getScreenSize(0)).toEqual('INIT');
      expect(getScreenSize(349)).toEqual('INIT');
    });

    it('Get XS screen size', () => {
      expect(getScreenSize(350)).toEqual('XS');
      expect(getScreenSize(599)).toEqual('XS');
    });

    it('Get SM screen size', () => {
      expect(getScreenSize(600)).toEqual('SM');
      expect(getScreenSize(904)).toEqual('SM');
    });

    it('Get MD screen size', () => {
      expect(getScreenSize(905)).toEqual('MD');
      expect(getScreenSize(1279)).toEqual('MD');
    });

    it('Get LG screen size', () => {
      expect(getScreenSize(1280)).toEqual('LG');
      expect(getScreenSize(1439)).toEqual('LG');
    });

    it('Get XL screen size', () => {
      expect(getScreenSize(1440)).toEqual('XL');
      expect(getScreenSize(1919)).toEqual('XL');
    });

    it('Get XX screen size', () => {
      expect(getScreenSize(1920)).toEqual('XX');
      expect(getScreenSize(1921)).toEqual('XX');
    });

    it('Validation and sorting of automatic values', () => {
      expect(
        getScreenSize(150, { XL: 100, SM: 200, MD: 500, XS: 800 })
      ).toEqual('INIT');
    });

    it('Without validation and ordering of manual values', () => {
      expect(
        getScreenSize(150, { XL: 100, SM: 200, MD: 500, XS: 800 }, false, [
          'XS',
          'SM',
          'MD',
          'XL'
        ])
      ).toEqual('INIT');
    });
  });

  describe('createDefaultValue() =>', () => {
    it('Returns a value in the store', () => {
      LocalStorage.setItem(KEYS_LOCAL_STORAGE.LayoutConfig, {
        example: 'test'
      });
      expect(createDefaultValue('example', '- - -')).toEqual('test');
      LocalStorage.removeItem();
    });

    it('Returns a default value', () => {
      expect(createDefaultValue('example', '- - -')).toEqual('- - -');
    });
  });

  describe('generateRowsNumber() =>', () => {
    it('Returns a number', () => {
      expect(generateRowsNumber()).toEqual(0);
    });

    it('Receive a custom row height number', () => {
      expect(generateRowsNumber(18)).toEqual(0);
    });
  });

  describe('updateColumnsNumber() =>', () => {
    it('Default number of columns', () => {
      expect(updateColumnsNumber('SM', ['XS', 'SM', 'MD', 'LG'])).toEqual(6);
    });

    it('Custom number of columns', () => {
      expect(
        updateColumnsNumber('SM', ['XS', 'SM', 'MD'], {
          INIT: 2,
          SM: 6,
          MD: 8,
          XL: 12
        })
      ).toEqual(6);
    });

    it('The current screen name does not exist in the custom column layout', () => {
      expect(
        updateColumnsNumber('SM', ['XS', 'SM', 'MD'], {
          INIT: 1,
          XS: 4,
          MD: 8,
          XL: 6
        })
      ).toEqual(4);
    });
  });
});
