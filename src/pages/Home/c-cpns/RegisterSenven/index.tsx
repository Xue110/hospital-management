import { useEffect } from 'react';
import * as echarts from 'echarts';
import './index.scss';
// 格式化日期为 'YYYY-MM-DD'
const formatDate = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，+1使其符合常规
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const RegisterSenven = () => {
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
    // 模拟数据，可以替换成从后台获取的真实数据
    const data = {
      hospitals: [
        '长春市人民医院',
        '吉林大学第一医院',
        '吉林省人民医院',
        '松原市中心医院',
        '德惠市医院',
      ],
      dates: days,
      values: [
        [120, 132, 101, 134, 90, 230, 210], // 长春市人民医院
        [220, 182, 191, 234, 290, 330, 310], // 吉林大学第一医院
        [150, 232, 201, 154, 190, 330, 410], // 吉林省人民医院
        [320, 332, 301, 334, 390, 330, 320], // 松原市中心医院
        [120, 132, 101, 134, 90, 230, 210], // 德惠市医院
      ],
    };

    // 获取图表容器
    const chartDom = document.getElementById('registerSevenChart');
    const myChart = echarts.init(chartDom);

    // 配置项
    const option = {
      title: {
        text: '吉林省内医院七天挂号人数',
        subtext: '数据来源：假设数据',
        left: 'center',
        top: '20px',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#aaa',
            type: 'dashed',
          },
        },
      },
      legend: {
        data: data.hospitals,
        left: 'center',
        top: '-5px',
        orient: 'horizontal',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false, // 使得线条连接到每个刻度点
        data: data.dates,
      },
      yAxis: {
        type: 'value',
        name: '挂号人数',
        min: 0,
      },
      series: data.hospitals.map((hospital, index) => ({
        name: hospital,
        type: 'line', // 折线图
        data: data.values[index],
        smooth: true, // 平滑曲线
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          borderWidth: 2,
        },
        emphasis: {
          focus: 'series',
        },
      })),
    };

    // 使用配置项显示图表
    myChart.setOption(option);

    // 销毁图表实例以防内存泄漏
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div style={{ height: '450px' }}>
      <div
        id="registerSevenChart"
        style={{ width: '800px', height: '400px' }}
      ></div>
    </div>
  );
};

export default RegisterSenven;
