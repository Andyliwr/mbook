import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 'asdhakjsdaisdahjsdg123kjasgdasdgaisd123129924jslkdanskd',
    userId: 'asdg1asda1231asdasd01',
    username: 'admin',
    password: '123456',
    avatar: './assets/personal.png',
    name: '李迪康'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    userId: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1),
    avatar: Mock.Random.image()
  }));
}

export { LoginUsers, Users };
