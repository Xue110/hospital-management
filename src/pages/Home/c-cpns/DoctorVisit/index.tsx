
import './index.scss';

const doctorData = [
  { name: 'Dr. 张三', department: '内科', status: 0 },
  { name: 'Dr. 李四', department: '外科', status: 1 },
  { name: 'Dr. 王五', department: '牙科', status: 1 },
  { name: 'Dr. 赵六', department: '眼科', status: 1 },
  { name: 'Dr. 周七', department: '皮肤科', status: 1 },
  { name: 'Dr. 孙八', department: '儿科', status: 0 },
  { name: 'Dr. 钱九', department: '妇科', status: 0 },
  { name: 'Dr. 吴十', department: '内科', status: 0 },
  { name: 'Dr. 郑十一', department: '外科', status: 1 },
  { name: 'Dr. 陈十二', department: '牙科', status: 1 },
  { name: 'Dr. 蒋十三', department: '眼科', status: 1 },
  { name: 'Dr. 程十四', department: '皮肤科', status: 1 },
  { name: 'Dr. 韩十五', department: '儿科', status: 0 },
];

const DoctorVisit = () => {
  // 根据状态返回不同的颜色
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'green';  // 出诊中
      case 1: return 'red';    // 休息
      default: return 'gray';  // 默认颜色
    }
  };

  return (
    <div className="doctor-visit">
      <h3 style={{ marginTop: '-15px', fontSize: '18px', fontWeight: 'bold', color: '#333333', letterSpacing: '1px' }}>
        医院医生出诊情况
      </h3>
      <div className="table-container">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>科室</th>
              <th>医生</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {doctorData.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.department}</td>
                <td>{doctor.name}</td>
                <td style={{ color: getStatusColor(doctor.status) }}>
                  {doctor.status === 0 ? '出诊中' : '休息'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorVisit;
