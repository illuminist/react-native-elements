/*eslint no-unused-vars: 0*/
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon';
// To be stubbed
import { Animated } from 'react-native';

import Rating from '../Rating';

describe('Rating Component', function() {
  let onChangeValue;

  beforeEach(function() {
    onChangeValue = sinon.stub();
  });

  it('should render without issues', function() {
    const component = shallow(<Rating />);

    expect(component.length).toBe(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render custom icon', function() {
    const component = shallow(
      <Rating
        blankIconColor="#ddd"
        blankIconName="help-outline"
        fullIconColor="#dba"
        fullIconName="help"
      />
    );

    expect(component.length).toBe(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render 10 images', function() {
    const component = shallow(<Rating maxValue={10} />);

    expect(component.length).toBe(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render images with the size of 30', function() {
    const component = shallow(<Rating iconSize={30} />);

    expect(component.length).toBe(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render in readonly mode', function() {
    const component = shallow(<Rating readonly />);

    expect(component.length).toBe(1);
    expect(toJson(component)).toMatchSnapshot();
  });

  describe('value rounding', function() {
    it('should round value to integer', function() {
      const component = shallow(<Rating fractions={0} />);
      const instance = component.renderer._instance;

      expect(instance.cleanValue(3.33)).toEqual(3);
    });

    it('should round value to nearest quarter', function() {
      const component = shallow(<Rating fractions={0.25} />);
      const instance = component.renderer._instance;

      expect(instance.cleanValue(3.33)).toEqual(3.25);
    });

    it('should round value to nearest decimal precision', function() {
      const component = shallow(<Rating fractions={2} />);
      const instance = component.renderer._instance;

      expect(instance.cleanValue(3.336)).toEqual(3.34);
    });

    it('should not round value for readonly component', function() {
      const component = shallow(<Rating readonly />);
      const instance = component.renderer._instance;

      expect(instance.cleanValue(3.336)).toEqual(3.336);
    });
  });

  describe('fractions prop type check', function() {
    let errorStub;

    beforeEach(function() {
      errorStub = sinon.stub(console, 'error');
    });

    afterEach(function() {
      errorStub.restore();
    });

    it('should not accept fraction value greater than 20', function() {
      shallow(<Rating fractions={21} />);
      expect(errorStub.calledOnce).toBe(true);
    });

    // this error can't be produced due to the error has been produced
    // in the earier function
    it.skip('should not accept fraction value less than 0', function() {
      shallow(<Rating fractions={-1} />);
      expect(errorStub.calledOnce).toBe(true);
    });

    it('should not accept decimal value greater than 1', function() {
      shallow(<Rating fractions={1.5} />);
      expect(errorStub.calledOnce).toBe(true);
    });

    it('should not accept argument other than number', function() {
      shallow(<Rating fractions={'0'} />);
      expect(errorStub.calledOnce).toBe(true);
    });
  });

  describe('component updating', function() {
    let stubSpring;

    beforeEach(function() {
      stubSpring = sinon
        .stub(Animated, 'spring')
        .returns({ start: sinon.stub() });
    });

    afterEach(function() {
      stubSpring.restore();
    });

    it('should start animation after component is mounted', function() {
      const component = shallow(
        <Rating value={5} onChangeValue={onChangeValue} />
      );
      const instance = component.renderer._instance;
      instance.componentDidMount();
      expect(stubSpring.args[0][1]).toEqual({ toValue: 5 });
      expect(onChangeValue.called).toEqual(false);
    });

    it('should start animation after invoking touch event', function() {
      const component = shallow(<Rating onChangeValue={onChangeValue} />);
      const instance = component.renderer._instance;
      instance.handleIconPress(4)();
      expect(stubSpring.args[0][1]).toEqual({ toValue: 4 });
      expect(onChangeValue.calledOnceWith(4)).toEqual(true);
    });

    it('should start animation after updating value props', function() {
      const component = shallow(
        <Rating value={5} onChangeValue={onChangeValue} />
      );
      const instance = component.renderer._instance;

      instance.componentDidUpdate({ value: 3 }); // Let's pretend this to be previous prop instead

      expect(stubSpring.args[0][1]).toEqual({ toValue: 5 });
      expect(onChangeValue.called).toEqual(false);
    });

    it('should not start animation if updated value are same as previous', function() {
      const component = shallow(
        <Rating value={5} onChangeValue={onChangeValue} />
      );
      const instance = component.renderer._instance;

      instance.componentDidUpdate({ value: 5 }); // Let's pretend this to be previous prop instead

      expect(stubSpring.called).toEqual(false);
      expect(onChangeValue.called).toEqual(false);
    });
  });

  describe('panning', function() {
    let setStateSpy;
    let instance;

    beforeEach(function() {
      const component = shallow(
        <Rating value={3} onChangeValue={onChangeValue} />
      );
      instance = component.renderer._instance;
      setStateSpy = sinon.spy(instance, 'setState');
    });

    afterEach(function() {
      setStateSpy.restore();
    });

    it('should update targetValue (move to left)', function() {
      instance.handlePanMove({}, { dx: -40 });
      expect(setStateSpy.calledOnceWith({ targetValue: 2 })).toBe(true);
      expect(onChangeValue.called).toEqual(false);
    });

    it('should update targetValue (move to right)', function() {
      instance.handlePanMove({}, { dx: 60 });
      expect(setStateSpy.calledOnceWith({ targetValue: 5 })).toBe(true);
      expect(onChangeValue.called).toEqual(false);
    });

    it('should call onChangeValue after releasing pan', function() {
      instance.handlePanMove({}, { dx: 60 });
      instance.handlePanRelease();
      expect(onChangeValue.calledOnceWith(5)).toEqual(true);
    });
  });
});
