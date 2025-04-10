import { useEffect } from 'react';
import './index.scss';
import * as echarts from 'echarts';

// 格式化日期为 'YYYY-MM-DD'
const formatDate = (date:Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，+1使其符合常规
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
};

const PatientTrafficByDoctor = (props: any) => {
  useEffect(() => {
    // 获取今天的日期
    const today = new Date();
    // 生成过去7天的日期
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i)); // 设置为过去6天到今天的日期
      days.push(formatDate(date));
    }

    // 初始化图表
    const chart = echarts.init(document.getElementById('patient-traffic-chart'));

    // 设置图表的配置项
    const option = {
      title: {
        text: '七天内患者流量趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: days,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '患者流量',
          type: 'line',
          smooth: true, // 平滑曲线
          data: props.number,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: '#fff',
          },
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表
    chart.setOption(option);

    // 处理组件卸载时销毁图表实例
    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop: '80px'}}>
      <div id="patient-traffic-chart" style={{ width: '700px', height: '400px' }}></div>
    </div>
  );
};

export default PatientTrafficByDoctor;
