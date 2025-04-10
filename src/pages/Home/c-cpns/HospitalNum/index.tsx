import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import './index.scss';

// 创建 HospitalNum 组件
const HospitalNum = (props: any) => {
  // 定义状态变量来存储地图数据
  const [mapData, setMapData] = useState<any>(null);

  // 使用 useEffect 获取地图数据
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(
          'https://geo.datav.aliyun.com/areas_v3/bound/220000_full.json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch map data');
        }
        const data = await response.json();
        setMapData(data); // 将获取到的地图数据存储在状态中
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };

    fetchMapData();
  }, []);

  // 使用 useEffect 初始化图表
  useEffect(() => {
    if (!mapData) return; // 如果没有加载地图数据，跳过图表初始化

    // 初始化 ECharts 实例
    const chart = echarts.init(document.getElementById('hospital-map') as HTMLDivElement);

    // 注册吉林省地图
    echarts.registerMap('吉林', mapData);

    // 需要展示的数据：各地区医院数量
    const hospitalData = props.number
    console.log(hospitalData,"我来看看怎么个事")

    // 配置 ECharts 地图图表
    const option = {
      title: {
        text: '吉林省各地区医院数量',
        subtext: '数据来源：李欣雨',
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>医院数量: {c}', // 显示地区名称和医院数量
      },
      visualMap: {
        min: 0,
        max: 10,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#e0ffff', '#006edd'],
        },
      },
      series: [
        {
          type: 'map',
          map: '吉林', // 使用吉林省地图
          roam: true, // 允许地图缩放和拖拽
          label: {
            show: true,
            color: '#000', // 设置标签颜色
          },
          data: hospitalData,
        },
      ],
    };

    // 设置图表配置
    chart.setOption(option);

    // 清理函数，组件卸载时销毁图表
    return () => {
      chart.dispose();
    };
  }, [mapData]); // 依赖于 mapData，只有当 mapData 加载完成后才会初始化图表

  return (
    <div>
      <div id="hospital-map" style={{ width: '900px', height: '500px' }}></div>
    </div>
  );
};

export default HospitalNum;
