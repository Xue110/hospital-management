import './index.scss'

const GuaHao = (props: any) => {

  const patients = props.number
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
          {patients.map((patient:any) => (
            <div className="table-row" key={patient.id}>
              <div className="table-cell">{patient.id}</div>
              <div className="table-cell">{patient.name}</div>
              <div className="table-cell">{patient.gender === 0 ? '男' : '女'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GuaHao
