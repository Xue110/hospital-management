import { Tooltip } from 'antd';
import './index.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { CountUp } from 'countup.js';
const ZhuYuan = (props: any) => {
  const [register,setRegister] = useState(0);
  useEffect(() =>{
    setRegister(props.number);
  },[props.number])
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  useEffect(() => {
    const countUp = new CountUp('ZhuYuan',register);
    if (!countUp.error) {
        countUp.start();
    }
  },[register])
  return (
    <div>
      <div className="count-card">
        <div className="header">
          <span>住院人数</span>
          <Tooltip title="住院患者总数量">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div className="content" id="ZhuYuan">
          <span>{register}</span>
        </div>
        <div className="footer">
          <span>医者心，患者安</span>
        </div>
      </div>
    </div>
  );
};
export default ZhuYuan;
