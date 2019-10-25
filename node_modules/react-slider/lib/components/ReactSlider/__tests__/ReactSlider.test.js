"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _ReactSlider = _interopRequireDefault(require("../ReactSlider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<ReactSlider>', function () {
  it('can render', function () {
    var tree = _reactTestRenderer.default.create(_react.default.createElement(_ReactSlider.default, null)).toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('should call onAfterChange callback when onEnd is called', function () {
    var onAfterChange = jest.fn();

    var testRenderer = _reactTestRenderer.default.create(_react.default.createElement(_ReactSlider.default, {
      onAfterChange: onAfterChange
    }));

    var testInstance = testRenderer.root;
    expect(onAfterChange).not.toHaveBeenCalled();
    testInstance.instance.onBlur();
    expect(onAfterChange).toHaveBeenCalledTimes(1);
  });
});