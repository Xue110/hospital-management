import { Tooltip } from 'antd';
import './index.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { CountUp } from 'countup.js';
const DepartmentCount = (props:any) => {
  const [department, setDepartment] = useState(20);
  useEffect(() => {
    setDepartment(props.departmentNum)
  },[props.departmentNum])
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  useEffect(() => {
    const countUp = new CountUp('departmentCount',department);
    if (!countUp.error) {
        countUp.start();
    }
  },[department])
  return (
    <div>
      <div className="count-card">
        <div className="header">
          <span>科室总数</span>
          <Tooltip title="系统科室总数量">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div className="content" id="departmentCount">
          <span>{department}</span>
        </div>
        <div className="footer">
          <span>数字化医疗，让健康更精准</span>
        </div>
      </div>
    </div>
  );
};
export default DepartmentCount;
