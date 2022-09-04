import React from 'react';
import LocalStorage from 'local-storage-to-object';
// Constants
import { SCREEN_HEIGHT, KEYS_LOCAL_STORAGE } from './constants';
// Components
import { Container, Settings, ToggleSwitch } from './components';
// Helpers
import {
  createDefaultValue,
  generateRowsNumber,
  validateAndSortSizes,
  updateColumnsNumber,
  getScreenSize
} from './helpers';
// Types
import type { ResponsiveDetecterProps } from './types/responsiveDetecter';
import type {
  ResponsiveDetecterState,
  SizeNamesBaseTypes
} from './types/components';
// Styles
import './sass/main.scss';

/**
 * Este componente es únicamente para desallorro.
 * Detecta el tamaño de pantalla y pinta los pixeles en la misma.
 * Sirve para estructurar de acuerdo al dispositivo, responsive-design
 */
class ResponsiveDetecter extends React.Component<
  ResponsiveDetecterProps,
  ResponsiveDetecterState
> {
  readonly key = KEYS_LOCAL_STORAGE.LayoutConfig;
  readonly columnsNumber = 12;
  private columnBody: React.RefObject<HTMLDivElement>;

  constructor(props: ResponsiveDetecterProps) {
    super(props);
    this.columnBody = React.createRef();
    this.state = {
      isShowGrid: createDefaultValue('isShowGrid', true),
      isGridFront: createDefaultValue('isGridFront', false),
      isHideRows: createDefaultValue('isHideRows', false),
      isOpenSettings: false,
      rowsNumber: generateRowsNumber(this.props.rowHeight),
      validSizes: validateAndSortSizes(this.props.screenSizes),
      screen: getScreenSize(window.innerWidth, this.props.screenSizes),
      sizeScreen: {
        w: window.innerWidth,
        h: window.innerHeight
      },
      positionHorizontal: createDefaultValue('positionHorizontal', 'right'),
      positionVertical: createDefaultValue('positionVertical', 'bottom')
    };
    this.handleupdateColumnsNumber = this.handleupdateColumnsNumber.bind(this);
    this.handleResizeScreen = this.handleResizeScreen.bind(this);
    this.handleOpenSettings = this.handleOpenSettings.bind(this);
    this.handleToggleShowGrid = this.handleToggleShowGrid.bind(this);
    this.handleToggleGridElevation = this.handleToggleGridElevation.bind(this);
    this.handleToggleHideRows = this.handleToggleHideRows.bind(this);
    this.handleChangePositionH = this.handleChangePositionH.bind(this);
    this.handleChangePositionV = this.handleChangePositionV.bind(this);
  }

  /**
   * Detect every time the screen changes size.
   */
  componentDidMount(): void {
    this.handleupdateColumnsNumber(this.state.screen);
    window.addEventListener('resize', this.handleResizeScreen);
  }

  /**
   * We remove the eventListener resize.
   */
  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleResizeScreen);
  }

  /**
   * We detect changes in the states of the application, to apply different effects according to
   * the old values against the new ones.
   * @param prevState Previous value of state before a new change
   */
  componentDidUpdate(
    _: ResponsiveDetecterProps,
    prevState: ResponsiveDetecterState
  ) {
    const { isShowGrid, isHideRows, sizeScreen, screen } = this.state;
    const hasChangeSize = prevState.sizeScreen.h !== sizeScreen.h;

    /**
     * Every time a change in screen height is detected, or the 'isShowGrid' or 'isHideRows' flags
     * change state, the number of rows to render is recalculated.
     */
    if (
      !isHideRows &&
      ((hasChangeSize && isShowGrid) ||
        (!prevState.isShowGrid && isShowGrid) || // reactivate grid
        (prevState.isHideRows && !isHideRows)) // reactivate rows
    ) {
      this.setState({ rowsNumber: generateRowsNumber(this.props.rowHeight) });
    }

    /**
     * Every time the state of 'isShowGrid' changes from false to true, the number of columns to
     * render is recalculated.
     */
    if (!prevState.isShowGrid && isShowGrid) {
      console.log('reactivate');

      this.handleupdateColumnsNumber(screen);
    }
  }

  /**
   * Update the number of columns to paint, according to the current screen size, it is
   * handled from here and not with css, since the number of columns per screen is dynamic
   * and can be modified by the user.
   * @param _currentScreen Current screen size name
   */
  handleupdateColumnsNumber(_currentScreen: SizeNamesBaseTypes): void {
    if (!this.state.isShowGrid || this.props.disable) return;

    const numberColumns = updateColumnsNumber(
      _currentScreen,
      this.state.validSizes.sizeNames,
      this.props.columnDistribution
    );

    this.columnBody.current?.style.setProperty(
      'grid-template-columns',
      `repeat(${numberColumns}, 1fr)`
    );
  }

  /**
   * We update various state values, as well as the number of columns to render according to
   * the current screen size, every time the screen changes size.
   */
  handleResizeScreen(): void {
    if (this.props.disable) return;

    // Get the name of the current screen
    const newScreenSize = getScreenSize(
      window.innerWidth,
      this.state.validSizes.screenSizes,
      false,
      this.state.validSizes.sizeNames
    );

    // We update the number of columns according to the current screen
    this.handleupdateColumnsNumber(newScreenSize);

    // We update the values in the state
    this.setState((state) => {
      /**
       * We check if the height of the screen has changed, if so, the value of 'rowsNumber' becomes
       * 0 to prevent the new number of columns from being added to the existing ones.
       */
      const hasSameHeight = window.innerHeight === state.sizeScreen.h;

      return {
        sizeScreen: {
          w: window.innerWidth,
          h: window.innerHeight
        },
        screen: newScreenSize,
        rowsNumber: hasSameHeight ? state.rowsNumber : 0
      };
    });
  }

  /**
   * Function that is responsible for opening or closing the configuration menu.
   */
  handleOpenSettings(): void {
    this.setState((state) => ({ isOpenSettings: !state.isOpenSettings }));
  }

  /**
   * The function changes the state of `isShowGrid` to show or hide the `grid` component,
   * likewise, its current value is stored in localStorage so that the decision is preserved
   * when reload the browser.
   * @param value Turn input 'grid' on or off
   */
  handleToggleShowGrid(value: boolean): void {
    this.setState({ isShowGrid: value });
    LocalStorage.setItem(this.key, { isShowGrid: value });
  }

  /**
   * Function that is responsible for changing the position of the grid, whether it is sent above
   * the elements, or at the bottom.
   * @param value Turn input 'gridFront' on or off
   */
  handleToggleGridElevation(value: boolean): void {
    this.setState({ isGridFront: value });
    LocalStorage.setItem(this.key, { isGridFront: value });
  }

  /**
   * Function that is responsible for enabling or disabling the visibility of the rows of the grid.
   * @param value Turn input 'hideRows' on or off
   */
  handleToggleHideRows(value: boolean): void {
    this.setState({ isHideRows: value });
    LocalStorage.setItem(this.key, { isHideRows: value });
  }

  /**
   * Function that is responsible for changing the horizontal position of the component that paints
   * the pixels of the current screen.
   * @param value Turn input 'positionH' on or off
   */
  handleChangePositionH(value: boolean): void {
    const newPosition = value ? 'left' : 'right';
    this.setState({ positionHorizontal: newPosition });
    LocalStorage.setItem(this.key, { positionHorizontal: newPosition });
  }

  /**
   * Function that is responsible for changing the vertical position of the component that paints
   * the pixels of the current screen.
   * @param value Turn input 'positionV' on or off
   */
  handleChangePositionV(value: boolean): void {
    const newPosition = value ? 'top' : 'bottom';
    this.setState({ positionVertical: newPosition });
    LocalStorage.setItem(this.key, { positionVertical: newPosition });
  }

  render() {
    // State
    const {
      isShowGrid,
      isGridFront,
      isHideRows,
      isOpenSettings,
      rowsNumber,
      validSizes,
      screen,
      sizeScreen,
      positionHorizontal,
      positionVertical
    } = this.state;

    // Props
    const { disable, classNameContainer, rowHeight } = this.props;

    // Generate styles for open and closed menu
    const menuClass = isOpenSettings
      ? 'label-responsive-detecter__menu--open'
      : 'label-responsive-detecter__menu--close';

    // Generate styles for open and closed overlay
    const overlayClass = isOpenSettings
      ? 'label-responsive-detecter__overlay--open'
      : 'label-responsive-detecter__overlay--close';

    // Dynamic style to put the grid at the bottom
    const currentElevation = isGridFront
      ? ''
      : 'grid-layout-responsive-detecter__column-container--at-bottom';

    // We convert the numeric value 'rowsNumber' to an array with values
    const numberCurrentRows = new Array(rowsNumber).fill('*');

    // We convert the numeric value 'columnsNumber' to an array with values
    const numberCurrentColumns = new Array(this.columnsNumber).fill('*');

    return (
      <>
        {!disable && isShowGrid && (
          <div className="grid-layout-responsive-detecter">
            {/* Columns */}
            <div
              className={`grid-layout-responsive-detecter__column-container ${currentElevation}`}
            >
              <Container className={classNameContainer}>
                <div
                  ref={this.columnBody}
                  // id="responsive-detecter__column-body"
                  className="grid-layout-responsive-detecter__column-body"
                >
                  {numberCurrentColumns.map((_, index) => (
                    <div
                      key={index}
                      className="grid-layout-responsive-detecter__column"
                    />
                  ))}
                </div>
              </Container>
            </div>

            {/* Rows */}
            {!isHideRows && (
              <Container className={classNameContainer}>
                <div className="grid-layout-responsive-detecter__row-container">
                  {numberCurrentRows.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        top: `${(rowHeight || SCREEN_HEIGHT) * (index + 1)}px`
                      }}
                      className="grid-layout-responsive-detecter__row-line"
                    />
                  ))}
                </div>
              </Container>
            )}
          </div>
        )}

        {!disable && (
          <>
            <button
              className={`label-responsive-detecter__overlay ${overlayClass}`}
              onClick={this.handleOpenSettings}
            />

            <div
              className={`
              label-responsive-detecter
              label-responsive-detecter--${positionHorizontal}
              label-responsive-detecter--${positionVertical}
            `}
            >
              {/* Settings Icon */}
              {!validSizes.error && (
                <button
                  className="label-responsive-detecter__button-icon"
                  onClick={this.handleOpenSettings}
                >
                  <Settings
                    className="label-responsive-detecter__icon"
                    color={isOpenSettings ? 'gray' : 'primary-light'}
                  />
                </button>
              )}

              {/* Screen size */}
              <div
                className={`label-responsive-detecter__container--${positionHorizontal}`}
              >
                {validSizes.error ? (
                  <p className="label-responsive-detecter__title-screen-size label-responsive-detecter__title-screen-size--error">
                    {validSizes.error}
                  </p>
                ) : (
                  <>
                    <p className="label-responsive-detecter__title-screen-size">
                      Size: {screen}
                    </p>
                    <p className="label-responsive-detecter__screen-size">
                      {sizeScreen.w} x {sizeScreen.h}
                    </p>
                  </>
                )}
              </div>

              {/* Menu */}
              <div
                className={`
                label-responsive-detecter__menu
                label-responsive-detecter__menu--${positionHorizontal}
                label-responsive-detecter__menu--${positionVertical}
                ${menuClass}
              `}
              >
                <p className="label-responsive-detecter__title-menu">
                  Settings
                </p>

                <p className="label-responsive-detecter__title-field">Grid</p>
                <div className="label-responsive-detecter__field-menu">
                  <ToggleSwitch
                    name="grid"
                    title="Enable grid"
                    defaultValue={isShowGrid}
                    onValue={this.handleToggleShowGrid}
                  />
                </div>

                <div className="label-responsive-detecter__field-row">
                  <div className="label-responsive-detecter__field-menu">
                    <ToggleSwitch
                      name="gridFront"
                      title="Grid in front"
                      defaultValue={isGridFront}
                      disabled={!isShowGrid}
                      onValue={this.handleToggleGridElevation}
                    />
                  </div>
                  <div className="label-responsive-detecter__field-menu">
                    <ToggleSwitch
                      name="hideRows"
                      title="Hide rows"
                      defaultValue={isHideRows}
                      disabled={!isShowGrid}
                      onValue={this.handleToggleHideRows}
                    />
                  </div>
                </div>

                <p className="label-responsive-detecter__title-field">
                  Position
                </p>
                <div className="label-responsive-detecter__field-row">
                  <div className="label-responsive-detecter__field-menu">
                    <ToggleSwitch
                      name="positionH"
                      title="Left position"
                      defaultValue={positionHorizontal === 'left'}
                      onValue={this.handleChangePositionH}
                    />
                  </div>
                  <div className="label-responsive-detecter__field-menu">
                    <ToggleSwitch
                      name="positionV"
                      title="Top position"
                      onValue={this.handleChangePositionV}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default ResponsiveDetecter;
