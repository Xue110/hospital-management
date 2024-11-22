import { Tooltip } from 'antd';
import './index.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { CountUp } from 'countup.js';
const HospitalCard = (props:any) => {
  const [hospitalNum, setHospitalNum] = useState(10);
  useEffect(() => {
    setHospitalNum(props.hospitalNum)
  },[props.hospitalNum])
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  useEffect(() => {
    const countUp = new CountUp('countUpElement',hospitalNum);
    if (!countUp.error) {
        countUp.start();
    }
  },[hospitalNum])
  return (
    <div>
      <div className="count-card">
        <div className="header">
          <span>医院总数</span>
          <Tooltip title="系统医院总数量">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div className="content" id="countUpElement">
          <span>{hospitalNum}</span>
        </div>
        <div className="footer">
          <span>生命至上，健康同行</span>
        </div>
      </div>
    </div>
  );
};
export default HospitalCard;
