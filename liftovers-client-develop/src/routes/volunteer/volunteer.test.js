import React from "react";
import { shallow } from "enzyme";
import { Volunteer } from "./volunteer";
import { findByTestAtrr } from "../../utils";

const setUp = (props = {}) => {
  const component = shallow(<Volunteer {...props} />);
  return component;
};

describe("Volunteer Page", () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      volunteers: {},
      loading: false,
      getVolunteers: jest.fn()
    };
    wrapper = setUp(props);
  });
  it("renders without errors", () => {
    const component = findByTestAtrr(wrapper, "volunteer");
    expect(component.length).toBe(1);
  });
  it("renders page title", () => {
    const component = findByTestAtrr(wrapper, "title");
    expect(component.text()).toBe("Volunteers");
  });
});
