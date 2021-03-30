import React, { Component } from 'react';

// eslint-disable-next-line react/prefer-stateless-function
class BreadCrumb extends Component {

  onClickBread = (path) =>{
    console.log('onClickBread', this.props.path);
    if(path === '/Root'){
      this.props.onClickBread('/');  
    }else{
      this.props.onClickBread(path);
    }
  }

  render() {
    const { path } = this.props;
    
    const newPath = ['/Root', ...path.slice(1)];
    return (
      <>
        <nav className="Breadcrumb">
          {/* <div>root</div> */}
          {newPath.map((p) => <div onClick={()=>{this.onClickBread(p)}} key={p}>{p.slice(1)}</div>)}
        </nav>
      </>

    )
  }
}

export default BreadCrumb;
