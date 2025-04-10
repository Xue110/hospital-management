import { useEffect } from 'react';
import './index.scss';
import * as echarts from 'echarts';  // 引入 ECharts

const DoctorNum = (props: any) => {
  // 假设的数据：吉林省内医院及其医生数量
  const hospitalData = props.number

  useEffect(() => {
    // 获取图表的 DOM 容器
    const chartDom = document.getElementById('doctor-num-chart');
    const myChart = echarts.init(chartDom);  // 初始化 ECharts 实例

    // 设置图表的配置项
    const option = {
      title: {
        text: '吉林省各医院医生数量',
        subtext: '数据来源：李欣雨',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      xAxis: {
        type: 'category',
        data: hospitalData.map((item:any) => item.name),  // 医院名称
        axisLabel: {
          rotate: 30,  // 使医院名称倾斜，避免重叠
        },
      },
      yAxis: {
        type: 'value',
        name: '医生数量',
      },
      series: [
        {
          data: hospitalData.map((item:any) => item.value),  // 医生数量
          type: 'bar',  // 使用柱状图
          itemStyle: {
            color: '#4CAF50',  // 设置柱子颜色
          },
        },
      ],
    };

    // 使用刚定义的配置项填充图表
    myChart.setOption(option);

    // 监听窗口大小变化，确保图表响应式调整
    window.addEventListener('resize', () => {
      myChart.resize();
    });

    // 清理函数：组件卸载时销毁 ECharts 实例
    return () => {
      myChart.dispose();
    };
  }, []);  // 只在组件挂载时执行一次

  return (
    <div className="doctor-num-container">
      <div id="doctor-num-chart" style={{ width: '650px', height: '430px' }}></div>
    </div>
  );
};

export default DoctorNum;
