import { Tooltip } from 'antd';
import './index.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { CountUp } from 'countup.js';
const BedCount = (props:any) => {
  const [bedNum, setBedNum] = useState(666);
  useEffect(() => {
    setBedNum(props.bedNum)
  },[props.bedNum])
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  useEffect(() => {
    const countUp = new CountUp('BedCount',bedNum);
    if (!countUp.error) {
        countUp.start();
    }
  },[bedNum])
  return (
    <div>
      <div className="count-card">
        <div className="header">
          <span>剩余床位数</span>
          <Tooltip title="医院床位剩余数">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div className="content" id="BedCount">
          <span>{bedNum}</span>
        </div>
        <div className="footer">
          <span>健康，是最美的礼物</span>
        </div>
      </div>
    </div>
  );
};
export default BedCount;
