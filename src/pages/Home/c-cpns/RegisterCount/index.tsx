import { Tooltip } from 'antd';
import './index.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { CountUp } from 'countup.js';
const RegisterCount = (props:any) => {
  const [register, setRegister] = useState(null);
  useEffect(() => {
    setRegister(props.registerNum)
  },[props.registerNum])
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  useEffect(() => {
    const countUp = new CountUp('registerCount',Number(register));
    if (!countUp.error) {
        countUp.start();
    }
  },[register])
  return (
    <div>
      <div className="count-card">
        <div className="header">
          <span>今日挂号人数</span>
          <Tooltip title="系统今日挂号总数量">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div className="content" id="registerCount">
          <span>{register}</span>
        </div>
        <div className="footer">
          <span>每一诊，每一疗，尽显专业</span>
        </div>
      </div>
    </div>
  );
};
export default RegisterCount;
