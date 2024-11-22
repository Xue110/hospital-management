import { Tooltip } from 'antd';
import './index.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { CountUp } from 'countup.js';
const DoctorCount = (props:any) => {
  const [doctorNum, setDoctorNum] = useState(100);
  useEffect(() => {
    setDoctorNum(props.doctorNum)
  },[props.doctorNum])
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  useEffect(() => {
    const countUp = new CountUp('DoctorCount',doctorNum);
    if (!countUp.error) {
        countUp.start();
    }
  },[doctorNum])
  return (
    <div>
      <div className="count-card">
        <div className="header">
          <span>医生总数</span>
          <Tooltip title="系统医生总数量">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div className="content" id="DoctorCount">
          <span>{doctorNum}</span>
        </div>
        <div className="footer">
          <span>患者至上，关爱每一个生命</span>
        </div>
      </div>
    </div>
  );
};
export default DoctorCount;
