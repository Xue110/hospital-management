import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import './index.scss';

const PatientsNum = () => {
  const chartRef = useRef(null);  // 用于引用图表的 DOM 容器

  useEffect(() => {
    const chart = echarts.init(chartRef.current);  // 初始化 ECharts 实例

    const option = {
      title: {
        text: '吉林省内医院患者数量',
        subtext: '数据来源：假设数据',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: '20%',
        left: '10%',
        right: '10%',
        bottom: '10%',
      },
      xAxis: {
        type: 'category',
        data: ['医院A', '医院B', '医院C', '医院D', '医院E'],  // 模拟医院名称
        axisLabel: {
          interval: 0,  // 确保所有医院名称都能显示
          rotate: 30,  // 旋转标签，防止重叠
        },
      },
      yAxis: {
        type: 'value',
        name: '患者数量',
      },
      series: [
        {
          name: '患者数量',
          type: 'bar',  // 使用柱状图
          data: [1200, 2300, 1800, 1500, 2500],  // 模拟患者数量数据
          itemStyle: {
            color: '#4e8ef7',
          },
        },
      ],
    };

    chart.setOption(option);  // 设置图表的配置项

    // 组件卸载时销毁图表
    return () => {
      chart.dispose();
    };
  }, []);  // 空依赖数组表示只在组件挂载时执行一次

  return (
    <div className="patients-num">
      <div
        ref={chartRef}  // 图表的容器
        style={{ width: '600px', height: '400px' }}
      ></div>
    </div>
  );
};

export default PatientsNum;
