import Mock from 'mockjs'

// 注册用户Mock数据
const registeredUsers = Mock.mock({
  'list|50': [
    {
      'id|+1': 1,
      username: '@cname',
      phone: /^1[3-9]\d{9}$/,
      email: '@email',
      name: '@cname',
      idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      registerTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      lastLoginTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      'status|1': ['enabled', 'disabled']
    }
  ]
}).list

// 租户标签Mock数据
const tenantTags = Mock.mock({
  'list|20': [
    {
      'id|+1': 1,
      name: '@ctitle(5, 10)',
      description: '@csentence(10, 30)',
      createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
  ]
}).list

// 预警消息模版Mock数据
const warningTemplates = Mock.mock({
  'list|15': [
    {
      'id|+1': 1,
      name: '@ctitle(5, 15)',
      content: '尊敬的{租户名称}，您的套餐{套餐名称}将于{到期日期}到期，请及时续费。',
      'variables|3-5': ['{租户名称}', '{套餐名称}', '{到期日期}', '{联系人}', '{手机号}'],
      createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
  ]
}).list

// 学历对应岗位Mock数据
const educationPositions = Mock.mock({
  'list|20': [
    {
      'id|+1': 1,
      'educationLevel|1': ['初中及以下', '高中/中专', '大专', '本科', '硕士及以上'],
      jobName: '@ctitle(10, 30)',
      createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
  ]
}).list

// 平台账号Mock数据
const platformAccounts = Mock.mock({
  'list|30': [
    {
      'id|+1': 1,
      username: '@word(5, 10)',
      phone: /^1[3-9]\d{9}$/,
      email: '@email',
      name: '@cname',
      idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      registerTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      lastLoginTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      'status|1': ['enabled', 'disabled']
    }
  ]
}).list

export {
  registeredUsers,
  tenantTags,
  warningTemplates,
  educationPositions,
  platformAccounts
}
