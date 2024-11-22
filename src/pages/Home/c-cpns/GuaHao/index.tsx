import './index.scss'

const GuaHao = () => {
  // 模拟的患者数据
  const patients = [
    { id: 1, name: '张三', gender: '男' },
    { id: 2, name: '李四', gender: '女' },
    { id: 3, name: '王五', gender: '男' },
    { id: 4, name: '赵六', gender: '女' },
    { id: 5, name: '孙七', gender: '男' },
    { id: 6, name: '周八', gender: '女' },
    { id: 7, name: '吴九', gender: '男' },
    { id: 8, name: '郑十', gender: '女' },
    { id: 9, name: '陈十一', gender: '男' },
    { id: 10, name: '刘十二', gender: '女' },
  ]


  return (
    <div className="gua-hao-container">
      <h1>今日患者挂号信息</h1>
      <div className="patient-table">
        <div className="table-header">
          <div className="table-cell">序号</div>
          <div className="table-cell">姓名</div>
          <div className="table-cell">性别</div>
        </div>
        <div className="table-body">
          {patients.map((patient) => (
            <div className="table-row" key={patient.id}>
              <div className="table-cell">{patient.id}</div>
              <div className="table-cell">{patient.name}</div>
              <div className="table-cell">{patient.gender}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GuaHao
