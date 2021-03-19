/* eslint padded-blocks: ["error", "always"] */
import React, { useEffect, useState } from 'react';
import './main.css';
import axios from 'axios';

const ShareView = () => {

  const [files, setFiles] = useState([]);

  useEffect(() => {

    axios.get('/files').then((res) => {

      console.log(res);
      setFiles(res.data);

    });

  }, []);

  console.log(files, setFiles);

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
            {
              files.map((file) => {

                if (file.type === 'DIRECTORY') {

                  return (
                    <div className="Node">
                      <img src="/static/images/asset/directory.png" alt="이미지" />
                      <div>{file.name}</div>
                    </div>
                  );

                }

                if (file.mimeType === 'image/jpeg' || file.mimeType === 'image/png') {

                  return (
                    <div className="Node">
                      <img src="/static/images/asset/cat.jpg" alt="이미지" />
                      <div>{file.name}</div>
                    </div>
                  );

                }

                return (
                  <div className="Node">
                    <img src="/static/images/asset/cat.jpg" alt="이미지" />
                    <div>{file.name}</div>
                  </div>
                );

              })
            }
          </div>
        </main>
      </div>
    </>
  );

};

export default ShareView;
