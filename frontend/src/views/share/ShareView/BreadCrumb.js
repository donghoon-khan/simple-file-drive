import React, { Component } from 'react';

// eslint-disable-next-line react/prefer-stateless-function
class BreadCrumb extends Component {
  render() {

    const { breadCrumb } = this.props;

    return (
      <>
        <nav className="Breadcrumb">
          <div>root</div>
          {breadCrumb.map((bread) => <div>{bread}</div>)}
        </nav>
      </>

    )
  }
}

export default BreadCrumb;
