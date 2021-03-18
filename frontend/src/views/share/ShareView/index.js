/* eslint padded-blocks: ["error", "always"] */
import React from 'react';
import './main.css';

const ShareView = () => {

  return (
    <>
      <div className="directory">
        <header>
          <h1>고양이 사진첩</h1>
        </header>
        <main className="App">
          <nav className="Breadcrumb">
            <div>root</div>
            <div>노란고양이</div>
          </nav>
          <div className="Nodes">
            <div className="Node">
              <img src="/static/images/asset/prev.png" alt="상위폴더" />
            </div>
            <div className="Node">
              <img src="/static/images/asset/directory.png" alt="폴더" />
              <div>노란 고양이</div>
            </div>
            <div className="Node">
              <img src="/static/images/asset/cat.jpg" alt="이미지" />
              <div>물먹는 고양이</div>
            </div>
            <div className="Node">
              <img src="/static/images/asset/cat.jpg" alt="이미지" />
              <div>물먹는 고양이</div>
            </div>
            <div className="Node">
              <img src="/static/images/asset/cat.jpg" alt="이미지" />
              <div>물먹는 고양이</div>
            </div>
            <div className="Node">
              <img src="/static/images/asset/cat.jpg" alt="이미지" />
              <div>물먹는 고양이</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );

};

export default ShareView;
