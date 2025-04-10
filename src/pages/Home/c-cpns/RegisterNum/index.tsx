import { useEffect } from 'react';
import * as echarts from 'echarts';
import './index.scss';

const RegisterNum = (props:any) => {
  useEffect(() => {
    const data = props.number

    // 获取图表容器
    const chartDom = document.getElementById('registerNumChart');
    const myChart = echarts.init(chartDom);

    // 配置项
    const option = {
      title: {
        text: '吉林省内医院今日挂号人数',
        subtext: '数据来源：李欣雨',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 人',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: data.map((item:any) => item.name),
      },
      series: [
        {
          name: '挂号人数',
          type: 'pie',
          radius: ['20%', '70%'], // 内外半径，控制玫瑰图的形状
          center: ['50%', '50%'], // 图表的中心位置
          roseType: 'area', // 设置为玫瑰图
          data: data.map((item:any) => ({
            name: item.name,
            value: item.value,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);

    // 销毁图表实例以防内存泄漏
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div>
      <div id="registerNumChart" style={{ width: '1000px', height: '450px' }}></div>
    </div>
  );
};

export default RegisterNum;
