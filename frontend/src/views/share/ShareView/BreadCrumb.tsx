import React from 'react';

// eslint-disable-next-line react/prefer-stateless-function
type Props ={
  path: string[]; 
  onClickBread: (path: string) => void;
}

const BreadCrumb = (props : Props) => {

  function onClickBread (path: string) : void {
    console.log('onClickBread', props.path);
    if (path === '//') {
      props.onClickBread('');
    } else {
      props.onClickBread(path);
    }
  }


  const { path } = props;

  const newPath = ['//', ...path.slice(1)];
  return (

    <>
      <nav className="Breadcrumb">
        {newPath.map((p) => <div onClick={() => { onClickBread(p) }} key={p}>{p.slice(1)}</div>)}
      </nav>
    </>

  )

}


export default BreadCrumb;