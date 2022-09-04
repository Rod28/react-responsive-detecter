import React from 'react';
// Types
import type {
  ToggleSwitchProps,
  ToggleSwitchState
} from '../../types/components';
// Styles
import '../../sass/components/toggleSwitch.scss';

class ToggleSwitch extends React.Component<
  ToggleSwitchProps,
  ToggleSwitchState
> {
  static defaultProps = {
    defaultValue: false,
    disabled: false,
    color: 'primary',
    colorOff: 'gray-dark'
  };

  constructor(props: ToggleSwitchProps) {
    super(props);
    this.state = {
      checked: this.props.defaultValue
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  /**
   * Function that changes the current state of the component.
   */
  handleOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!this.props.disabled) {
      this.setState({ checked: e.target.checked });
      this.props.onValue && this.props.onValue(e.target.checked);
    }
  }

  render() {
    // state
    const { checked } = this.state;

    // Props
    const { title, name, color, colorOff, disabled } = this.props;

    // Gets the current background color of the component.
    const currentColor = checked ? `rd-bg-${color}` : `rd-bg-${colorOff}`;

    return (
      <div className="toggle-switch-responsive-detecter">
        {title && (
          <p className="toggle-switch-responsive-detecter__title">{title}:</p>
        )}

        <div className="toggle-switch-responsive-detecter__container">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            disabled={disabled}
            className="toggle-switch-responsive-detecter__checkbox"
            onChange={this.handleOnChange}
          />

          <label
            htmlFor={name}
            className={`toggle-switch-responsive-detecter__label ${currentColor}`}
          />
        </div>
      </div>
    );
  }
}

export default ToggleSwitch;
