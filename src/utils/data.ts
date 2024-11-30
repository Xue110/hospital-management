import store from '../store';
import { Doctor, Hospital } from '../type/order';
const hospitalData = store.getState().hospital.hospitalList;
const assignDoctorsToHospitals = (
  doctorCounts: Doctor[],
  hospitalCounts: any[]
): void => {
  const hospitalMap = new Map<string, Hospital>();
  hospitalCounts.forEach((hospital) => {
    if (!hospital.children) {
      hospital.children = [];
    }
    hospitalMap.set(hospital.value, hospital);
  });
  doctorCounts.forEach((doctor) => {
    const hospital = hospitalMap.get(doctor.hospitalId);
    if (hospital) {
      // 将医生添加到医院的 `children` 数组中
      hospital.children?.push(doctor);
    }
  });
};
const hospitalOptions = hospitalData.hospitalCounts.map(
  (hospital: Hospital) => ({
    value: hospital.id,
    label: hospital.name,
    children: hospital.children?.map((doctor: Doctor) => ({
      value: doctor.id,
      label: doctor.name,
    })),
  })
);
const doctorOptions = hospitalData.doctorCounts.map((doctor: Doctor) => ({
  value: doctor.id,
  label: `${doctor.name}医生`,
  hospitalId: doctor.hospitalId,
}));

assignDoctorsToHospitals(doctorOptions, hospitalOptions);
interface Bed {
  id: string;
  name: string;
  roomId: string;
}

interface Room {
  id: string;
  name: string;
  children?: Bed[]; // 每个房间有多个床位
}

// const assignBedsToRooms = (
//   roomsOptions: any[], // 房间信息
//   bedsOptions: Bed[] // 床位信息
// ): void => {
//   const roomMap = new Map<string, Room>();

//   // 将房间数据存入 roomMap，key 是 room.id，value 是 Room 对象
//   roomsOptions.forEach((room) => {
//     room.children = room.children || []; // 确保每个房间都有一个 children 数组
//     roomMap.set(room.value, room); // 使用 room.id 作为唯一标识
//   });

//   // 遍历床位数据，将床位分配到对应的房间
//   bedsOptions.forEach((bed) => {
//     const room = roomMap.get(bed.roomId);
//     if (room) {
//       room.children?.push(bed); // 将床位添加到对应的房间的 children 数组中
//     }
//   });
// };

// const roomsOptions: Room[] = hospitalData.roomCounts.map((room: any) => ({
//   value: room.id,
//   label: room.number,
//   children: room.children?.map((bed: any) => ({
//     value: bed.id,
//     label: bed.bedNumber,
//   })),
// }));

// const bedsOptions: Bed[] = hospitalData.bedCounts.map((bed: any) => ({
//   value: bed.id,
//   label: bed.bedNumber,
//   roomId: bed.roomId, // 床位和房间的映射关系
// }));

// // 调用函数进行床位分配
// assignBedsToRooms(roomsOptions, bedsOptions);
// export const roomOptions = roomsOptions;
export const optionsData = hospitalOptions;
export const hospitalList = [
  { id: 1, name: '吉林省人民医院' },
  { id: 2, name: '长春市第一医院' },
  { id: 3, name: '吉林大学第一医院' },
  { id: 4, name: '吉林省中医院' },
  { id: 5, name: '长春市第二医院' },
  { id: 6, name: '吉林省肿瘤医院' },
  { id: 7, name: '长春市儿童医院' },
  { id: 8, name: '长春市妇产医院' },
  { id: 9, name: '吉林省心血管病医院' },
  { id: 10, name: '松原市人民医院' },
];
export const departmentList = [
  { id: 1, name: '内科' },
  { id: 2, name: '外科' },
  { id: 3, name: '儿科' },
  { id: 4, name: '妇产科' },
  { id: 5, name: '骨科' },
  { id: 6, name: '皮肤科' },
  { id: 7, name: '神经内科' },
  { id: 8, name: '耳鼻喉科' },
  { id: 9, name: '眼科' },
  { id: 10, name: '肿瘤科' },
  { id: 11, name: '精神科' },
  { id: 12, name: '急诊科' },
  { id: 13, name: '口腔科' },
  { id: 14, name: '内分泌科' },
  { id: 15, name: '泌尿科' },
  { id: 16, name: '呼吸科' },
  { id: 17, name: '中医科' },
  { id: 18, name: '心血管科' },
  { id: 19, name: '消化科' },
  { id: 20, name: '康复科' },
];
export const qualificationList = [
  { name: '医学博士' },
  { name: '主治医师' },
  { name: '副主任医师' },
  { name: '医学硕士' },
];
export const cityList = [
  { id: 1, name: '长春市' },
  { id: 2, name: '吉林市' },
  { id: 3, name: '四平市' },
  { id: 4, name: '辽源市' },
  { id: 5, name: '通化市' },
  { id: 6, name: '白山市' },
  { id: 7, name: '松原市' },
  { id: 8, name: '白城市' },
  { id: 9, name: '延边朝鲜族自治州' },
];
