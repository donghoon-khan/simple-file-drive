import React from 'react';
import { mount, shallow } from 'enzyme';
import Nodes from './Nodes';

describe('<Nodes />', () => {
  it('render Nodes', () => {
    const data = [
      {
        "type": "DIRECTORY",
        "name": "childDirectory",
        "path": ".\\test-data\\childDirectory",
        "mimeType": null
      },
      {
        "type": "FILE",
        "name": "big-bunny.mp4",
        "path": ".\\test-data\\big-bunny.mp4",
        "mimeType": "video/mp4"
      },
    ];

    const wrapper = mount(<Nodes files={data} />);
    expect(wrapper.props().files).toBe(data);
    const NodeElement = wrapper.find('.Node');
    console.log(NodeElement)
    expect(NodeElement.length).toBe(3);
  });

  
});

//https://velog.io/@velopert/react-testing-with-enzyme

//shallow : 내부에component가 있다면 이를 렌더링 하지 않음
//mount : 내부에 component가 있을경우 내부의 내용까지 렌더링 됨 
 //wrapper.state() wrapper.props()
 //wrppaer.instance().handleIncrease()