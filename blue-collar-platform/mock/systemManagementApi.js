import Mock from 'mockjs'
import {
  registeredUsers,
  tenantTags,
  warningTemplates,
  educationPositions,
  platformAccounts
} from './systemManagement'

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 注册用户API
Mock.mock(/\/system\/registered-users/, 'get', async (options) => {
  await delay()
  const { page = 1, pageSize = 10, keyword = '', status = '' } = JSON.parse(
    options.url.split('?')[1] || '{}'
  ).params || {}

  let filtered = registeredUsers

  // 关键词搜索
  if (keyword) {
    filtered = filtered.filter(user =>
      user.username.includes(keyword) ||
      user.phone.includes(keyword) ||
      user.email?.includes(keyword) ||
      user.name?.includes(keyword) ||
      user.idCard?.includes(keyword)
    )
  }

  // 状态筛选
  if (status) {
    filtered = filtered.filter(user => user.status === status)
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filtered.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/registered-users\/\d+\/(enable|disable)/, 'put', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/registered-users\/(\d+)/)[1]
  const action = options.url.includes('enable') ? 'enabled' : 'disabled'
  const user = registeredUsers.find(u => u.id == id)
  if (user) {
    user.status = action
  }
  return {
    code: 200,
    message: 'success',
    data: user,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/registered-users\/\d+\/reset-password/, 'put', async (options) => {
  await delay()
  return {
    code: 200,
    message: 'success',
    data: { newPassword: '123456' },
    timestamp: Date.now()
  }
})

// 租户标签API
Mock.mock(/\/system\/tenant-tags/, 'get', async (options) => {
  await delay()
  const { page = 1, pageSize = 10, keyword = '' } = JSON.parse(
    options.url.split('?')[1] || '{}'
  ).params || {}

  let filtered = tenantTags

  // 关键词搜索
  if (keyword) {
    filtered = filtered.filter(tag =>
      tag.name.includes(keyword) ||
      tag.description?.includes(keyword)
    )
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filtered.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/tenant-tags/, 'post', async (options) => {
  await delay()
  const data = JSON.parse(options.body)
  const newTag = {
    id: tenantTags.length + 1,
    ...data,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }
  tenantTags.push(newTag)
  return {
    code: 201,
    message: 'success',
    data: newTag,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/tenant-tags\/\d+/, 'put', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/tenant-tags\/(\d+)/)[1]
  const data = JSON.parse(options.body)
  const tag = tenantTags.find(t => t.id == id)
  if (tag) {
    Object.assign(tag, data, {
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
  }
  return {
    code: 200,
    message: 'success',
    data: tag,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/tenant-tags\/\d+/, 'delete', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/tenant-tags\/(\d+)/)[1]
  const index = tenantTags.findIndex(t => t.id == id)
  if (index > -1) {
    tenantTags.splice(index, 1)
  }
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  }
})

// 预警消息模版API
Mock.mock(/\/system\/warning-templates/, 'get', async (options) => {
  await delay()
  const { page = 1, pageSize = 10, keyword = '' } = JSON.parse(
    options.url.split('?')[1] || '{}'
  ).params || {}

  let filtered = warningTemplates

  // 关键词搜索
  if (keyword) {
    filtered = filtered.filter(template =>
      template.name.includes(keyword) ||
      template.content.includes(keyword)
    )
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filtered.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/warning-templates/, 'post', async (options) => {
  await delay()
  const data = JSON.parse(options.body)
  const newTemplate = {
    id: warningTemplates.length + 1,
    ...data,
    variables: ['{租户名称}', '{套餐名称}', '{到期日期}', '{联系人}', '{手机号}'],
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }
  warningTemplates.push(newTemplate)
  return {
    code: 201,
    message: 'success',
    data: newTemplate,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/warning-templates\/\d+/, 'put', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/warning-templates\/(\d+)/)[1]
  const data = JSON.parse(options.body)
  const template = warningTemplates.find(t => t.id == id)
  if (template) {
    Object.assign(template, data, {
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
  }
  return {
    code: 200,
    message: 'success',
    data: template,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/warning-templates\/\d+/, 'delete', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/warning-templates\/(\d+)/)[1]
  const index = warningTemplates.findIndex(t => t.id == id)
  if (index > -1) {
    warningTemplates.splice(index, 1)
  }
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  }
})

// 学历对应岗位API
Mock.mock(/\/system\/education-positions/, 'get', async (options) => {
  await delay()
  const { page = 1, pageSize = 10, keyword = '' } = JSON.parse(
    options.url.split('?')[1] || '{}'
  ).params || {}

  let filtered = educationPositions

  // 关键词搜索
  if (keyword) {
    filtered = filtered.filter(position =>
      position.educationLevel.includes(keyword) ||
      position.jobName.includes(keyword)
    )
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filtered.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/education-positions/, 'post', async (options) => {
  await delay()
  const data = JSON.parse(options.body)
  const newPosition = {
    id: educationPositions.length + 1,
    ...data,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  }
  educationPositions.push(newPosition)
  return {
    code: 201,
    message: 'success',
    data: newPosition,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/education-positions\/\d+/, 'put', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/education-positions\/(\d+)/)[1]
  const data = JSON.parse(options.body)
  const position = educationPositions.find(p => p.id == id)
  if (position) {
    Object.assign(position, data, {
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
  }
  return {
    code: 200,
    message: 'success',
    data: position,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/education-positions\/\d+/, 'delete', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/education-positions\/(\d+)/)[1]
  const index = educationPositions.findIndex(p => p.id == id)
  if (index > -1) {
    educationPositions.splice(index, 1)
  }
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  }
})

// 平台账号API
Mock.mock(/\/system\/platform-accounts/, 'get', async (options) => {
  await delay()
  const { page = 1, pageSize = 10, keyword = '', status = '' } = JSON.parse(
    options.url.split('?')[1] || '{}'
  ).params || {}

  let filtered = platformAccounts

  // 关键词搜索
  if (keyword) {
    filtered = filtered.filter(account =>
      account.username.includes(keyword) ||
      account.phone.includes(keyword) ||
      account.email?.includes(keyword) ||
      account.name?.includes(keyword)
    )
  }

  // 状态筛选
  if (status) {
    filtered = filtered.filter(account => account.status === status)
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filtered.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/platform-accounts/, 'post', async (options) => {
  await delay()
  const data = JSON.parse(options.body)
  const newAccount = {
    id: platformAccounts.length + 1,
    ...data,
    registerTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    lastLoginTime: null,
    status: 'enabled'
  }
  platformAccounts.push(newAccount)
  return {
    code: 201,
    message: 'success',
    data: newAccount,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/platform-accounts\/\d+/, 'put', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/platform-accounts\/(\d+)/)[1]
  const data = JSON.parse(options.body)
  const account = platformAccounts.find(a => a.id == id)
  if (account) {
    Object.assign(account, data)
  }
  return {
    code: 200,
    message: 'success',
    data: account,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/platform-accounts\/\d+/, 'delete', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/platform-accounts\/(\d+)/)[1]
  const index = platformAccounts.findIndex(a => a.id == id)
  if (index > -1) {
    platformAccounts.splice(index, 1)
  }
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/platform-accounts\/\d+\/(enable|disable)/, 'put', async (options) => {
  await delay()
  const id = options.url.match(/\/system\/platform-accounts\/(\d+)/)[1]
  const action = options.url.includes('enable') ? 'enabled' : 'disabled'
  const account = platformAccounts.find(a => a.id == id)
  if (account) {
    account.status = action
  }
  return {
    code: 200,
    message: 'success',
    data: account,
    timestamp: Date.now()
  }
})

Mock.mock(/\/system\/platform-accounts\/\d+\/reset-password/, 'put', async (options) => {
  await delay()
  return {
    code: 200,
    message: 'success',
    data: { newPassword: '123456' },
    timestamp: Date.now()
  }
})

export default Mock
