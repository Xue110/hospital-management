import { Tooltip } from 'antd';
import './index.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { CountUp } from 'countup.js';
const PatientCount = (props:any) => {
  const [register,setRegister] = useState(0);
  useEffect(() =>{
    setRegister(props.number)
  },[props.number])
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  useEffect(() => {
    const countUp = new CountUp('PatientCount',register);
    if (!countUp.error) {
        countUp.start();
    }
  },[register])
  return (
    <div>
      <div className="count-card">
        <div className="header">
          <span>患者人数</span>
          <Tooltip title="患者总数量">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div className="content" id="PatientCount">
          <span>{register}</span>
        </div>
        <div className="footer">
          <span>为健康，为生命，为未来</span>
        </div>
      </div>
    </div>
  );
};
export default PatientCount;
