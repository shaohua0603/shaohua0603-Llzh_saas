import Mock from 'mockjs'

const { Random } = Mock

const responseDelay = 200

const successResponse = (data) => ({
  code: 200,
  message: 'success',
  data,
  timestamp: Date.now()
})

const createdResponse = (data) => ({
  code: 201,
  message: 'created',
  data,
  timestamp: Date.now()
})

const pageResponse = (list, total) => ({
  code: 200,
  message: 'success',
  data: {
    list,
    total,
    page: 1,
    pageSize: 10
  },
  timestamp: Date.now()
})

const errorResponse = (message, code = 400) => ({
  code,
  message,
  data: null,
  timestamp: Date.now()
})

const generatePickupData = (count = 20) => {
  const pickups = []
  const statuses = ['pending', 'in_progress', 'completed', 'cancelled']
  
  for (let i = 1; i <= count; i++) {
    const workerCount = Random.integer(1, 10)
    const workers = []
    for (let j = 1; j <= workerCount; j++) {
      workers.push({
        id: `W${Random.id()}`,
        name: Random.cname(),
        phone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
        idCard: Random.id()
      })
    }
    
    pickups.push({
      id: `PK${String(i).padStart(3, '0')}`,
      plateNumber: Random.pick(['粤B', '粤A', '粤S', '粤T', '粤E']) + Random.string('number', 5),
      pickupTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      startPoint: Random.pick(['深圳宝安汽车站', '深圳北站', '深圳西站', '广州南站', '东莞东站']),
      endPoint: Random.pick(['东莞长安工业区', '深圳宝安工业区', '惠州仲恺高新区', '中山火炬开发区']),
      pickupPerson: Random.cname(),
      manager: Random.cname(),
      managerPhone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
      groupNumber: Random.string('number', 9),
      status: Random.pick(statuses),
      workers,
      workerCount,
      materialCompleteCount: Random.integer(0, workerCount),
      remark: Random.cparagraph(1, 3),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  
  return pickups
}

const generateInitialInterviewData = (count = 20) => {
  const interviews = []
  const recommendationLevels = ['PRIORITY', 'NORMAL', 'NOT_RECOMMENDED']
  const imageLevels = ['EXCELLENT', 'NORMAL', 'OTHER']
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  
  for (let i = 1; i <= count; i++) {
    interviews.push({
      id: `II${String(i).padStart(3, '0')}`,
      interviewTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      interviewLocation: Random.pick(['深圳宝安面试点', '广州天河面试点', '东莞长安面试点']),
      interviewer: Random.cname(),
      managerId: `EMP${String(i).padStart(3, '0')}`,
      managerName: Random.cname(),
      managerPhone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
      recommendationLevel: Random.pick(recommendationLevels),
      imageLevel: Random.pick(imageLevels),
      recommendationReason: Random.cparagraph(1, 3),
      groupNumber: Random.string('number', 9),
      tenantId: 'TENANT001',
      departmentId: `DEPT${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
      creatorId: `USER${String(i).padStart(3, '0')}`,
      creatorName: Random.cname(),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      status: Random.pick(statuses)
    })
  }
  
  return interviews
}

const generateInterviewInvitationData = (count = 20) => {
  const invitations = []
  const statuses = ['accepted', 'pending', 'rejected']
  const factories = ['华为技术有限公司', '比亚迪股份有限公司', '富士康科技集团', 'OPPO广东移动通信有限公司']
  
  for (let i = 1; i <= count; i++) {
    invitations.push({
      id: `IV${String(i).padStart(3, '0')}`,
      workerName: Random.cname(),
      phone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
      idCard: Random.id(),
      factory: Random.pick(factories),
      position: Random.pick(['普工', '技工', '质检员', '仓管员', '操作工']),
      interviewTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      interviewLocation: Random.pick(['深圳宝安厂区', '东莞长安厂区', '惠州仲恺厂区']),
      inviter: Random.cname(),
      status: Random.pick(statuses),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  
  return invitations
}

const generateFactoryInterviewData = (count = 20) => {
  const interviews = []
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  const recommendLevels = ['PRIORITY', 'NORMAL', 'NOT_RECOMMEND']
  const imageLevels = ['EXCELLENT', 'NORMAL', 'OTHER']
  const positionCategories = ['WORKER', 'TECHNICIAN', 'MANAGER']
  const laborCompanies = ['深圳市蓝领劳务派遣有限公司', '东莞智汇人力资源有限公司', '广州优才劳务服务有限公司']
  
  for (let i = 1; i <= count; i++) {
    const personCount = Random.integer(1, 10)
    const persons = []
    for (let j = 1; j <= personCount; j++) {
      persons.push({
        id: `FIP${i}${String(j).padStart(3, '0')}`,
        workerId: `W${Random.id()}`,
        isReturnWorker: Random.boolean(),
        name: Random.cname(),
        phone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
        age: Random.integer(18, 55),
        gender: Random.pick(['MALE', 'FEMALE']),
        recommendLevel: Random.pick(recommendLevels),
        imageLevel: Random.pick(imageLevels),
        education: Random.pick(['初中', '高中', '中专', '大专', '本科']),
        positionCategory: Random.pick(positionCategories),
        expectedLocation: Random.pick(['深圳', '东莞', '惠州', '广州']),
        recommendReason: Random.cparagraph(1, 2)
      })
    }
    
    interviews.push({
      id: `FI${String(i).padStart(3, '0')}`,
      laborCompanyId: `LC${String(i).padStart(3, '0')}`,
      laborCompanyName: Random.pick(laborCompanies),
      socialCreditCode: `91440300MA5D${Random.string('number', 10)}`,
      manager: Random.cname(),
      managerPhone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
      interviewTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      interviewLocation: Random.pick(['深圳宝安厂区', '东莞长安厂区', '惠州仲恺厂区']),
      factoryContactId: `EMP${String(i).padStart(3, '0')}`,
      factoryContactName: Random.cname(),
      factoryContactPhone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
      factoryId: 'F001',
      remark: Random.cparagraph(1, 2),
      status: Random.pick(statuses),
      createdBy: `USER${String(i).padStart(3, '0')}`,
      createdByName: Random.cname(),
      createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updatedBy: `USER${String(i).padStart(3, '0')}`,
      updatedByName: Random.cname(),
      updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      personCount,
      persons
    })
  }
  
  return interviews
}

const generateWorkerData = (count = 50) => {
  const workers = []
  const jobCategories = ['普工', '技工', '干部']
  
  for (let i = 1; i <= count; i++) {
    workers.push({
      id: `W${String(i).padStart(4, '0')}`,
      name: Random.cname(),
      age: Random.integer(18, 55),
      gender: Random.pick(['男', '女']),
      phone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
      idCard: Random.id(),
      jobCategory: Random.pick(jobCategories),
      jobIntention: Random.pick(['普工', '技工', '质检员', '仓管员', '操作工']),
      expectedSalary: Random.integer(4000, 8000),
      expectedWorkLocation: Random.pick(['深圳', '东莞', '惠州', '广州']),
      materialComplete: Random.boolean(),
      education: Random.pick(['初中', '高中', '中专', '大专', '本科']),
      workExperience: Random.integer(0, 10),
      skills: Random.cparagraph(1, 2)
    })
  }
  
  return workers
}

const pickups = generatePickupData(30)
const initialInterviews = generateInitialInterviewData(30)
const interviewInvitations = generateInterviewInvitationData(30)
const factoryInterviews = generateFactoryInterviewData(30)
const workers = generateWorkerData(50)

Mock.mock(/^\/api\/interview\/pickups(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  const plateNumber = url.searchParams.get('plateNumber')
  const manager = url.searchParams.get('manager')
  const status = url.searchParams.get('status')
  
  let filteredPickups = [...pickups]
  
  if (plateNumber) {
    filteredPickups = filteredPickups.filter(p => p.plateNumber.includes(plateNumber))
  }
  
  if (manager) {
    filteredPickups = filteredPickups.filter(p => p.manager.includes(manager))
  }
  
  if (status) {
    filteredPickups = filteredPickups.filter(p => p.status === status)
  }
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredPickups.slice(start, end)
  
  return pageResponse(list, filteredPickups.length)
})

Mock.mock(/^\/api\/interview\/pickups\/[^\/]+$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const pickup = pickups.find(p => p.id === id)
  
  return new Promise(resolve => {
    setTimeout(() => {
      if (pickup) {
        resolve(successResponse({
          ...pickup,
          worker: {
            id: 'W001',
            name: pickup.workers[0]?.name || '',
            phone: pickup.workers[0]?.phone || '',
            idCard: pickup.workers[0]?.idCard || ''
          },
          operationRecords: [
            {
              id: 'OR001',
              operationType: 'create',
              operator: '张三',
              operationTime: pickup.createTime,
              operationContent: '创建接送安排'
            },
            {
              id: 'OR002',
              operationType: 'update',
              operator: '李四',
              operationTime: pickup.updateTime,
              operationContent: '更新接送信息'
            }
          ]
        }))
      } else {
        resolve(errorResponse('接送信息不存在', 404))
      }
    }, responseDelay)
  })
})

Mock.mock('/api/interview/pickups', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newPickup = {
    id: `PK${String(pickups.length + 1).padStart(3, '0')}`,
    ...body,
    status: 'pending',
    workerCount: body.workerIds?.length || 0,
    materialCompleteCount: 0,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  pickups.unshift(newPickup)
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(createdResponse({ id: newPickup.id }))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/pickups\/[^\/]+$/, 'put', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const body = JSON.parse(options.body)
  const index = pickups.findIndex(p => p.id === id)
  
  if (index !== -1) {
    pickups[index] = {
      ...pickups[index],
      ...body,
      updateTime: new Date().toISOString()
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(successResponse(pickups[index]))
      }, responseDelay)
    })
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(errorResponse('接送信息不存在', 404))
      }, responseDelay)
    })
  }
})

Mock.mock(/^\/api\/interview\/pickups\/[^\/]+$/, 'delete', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const index = pickups.findIndex(p => p.id === id)
  
  if (index !== -1) {
    pickups.splice(index, 1)
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(successResponse(null))
      }, responseDelay)
    })
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(errorResponse('接送信息不存在', 404))
      }, responseDelay)
    })
  }
})

Mock.mock('/api/interview/pickups/batch', 'delete', (options) => {
  const body = JSON.parse(options.body)
  const { ids } = body
  
  for (const id of ids) {
    const index = pickups.findIndex(p => p.id === id)
    if (index !== -1) {
      pickups.splice(index, 1)
    }
  }
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse(null))
    }, responseDelay)
  })
})

Mock.mock('/api/interview/pickups/import', 'post', (options) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse({
        successCount: 10,
        failCount: 0,
        failRecords: []
      }))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/pickups\/export(\?.*)?$/, 'get', (options) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      })
    }, responseDelay)
  })
})

Mock.mock('/api/interview/pickups/template', 'get', () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: new Blob(['Mock Template Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      })
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/initial-interviews(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  const interviewLocation = url.searchParams.get('interviewLocation')
  const interviewer = url.searchParams.get('interviewer')
  const manager = url.searchParams.get('manager')
  const recommendationLevel = url.searchParams.get('recommendationLevel')
  const imageLevel = url.searchParams.get('imageLevel')
  const status = url.searchParams.get('status')
  const interviewTime = url.searchParams.get('interviewTime')
  
  let filteredInterviews = [...initialInterviews]
  
  if (interviewLocation) {
    filteredInterviews = filteredInterviews.filter(i => i.interviewLocation.includes(interviewLocation))
  }
  
  if (interviewer) {
    filteredInterviews = filteredInterviews.filter(i => i.interviewer.includes(interviewer))
  }
  
  if (manager) {
    filteredInterviews = filteredInterviews.filter(i => i.managerName.includes(manager))
  }
  
  if (recommendationLevel) {
    filteredInterviews = filteredInterviews.filter(i => i.recommendationLevel === recommendationLevel)
  }
  
  if (imageLevel) {
    filteredInterviews = filteredInterviews.filter(i => i.imageLevel === imageLevel)
  }
  
  if (status) {
    filteredInterviews = filteredInterviews.filter(i => i.status === status)
  }
  
  if (interviewTime) {
    try {
      const timeRange = JSON.parse(interviewTime)
      if (timeRange && timeRange.length === 2) {
        const startTime = new Date(timeRange[0]).getTime()
        const endTime = new Date(timeRange[1]).getTime()
        filteredInterviews = filteredInterviews.filter(i => {
          const interviewTime = new Date(i.interviewTime).getTime()
          return interviewTime >= startTime && interviewTime <= endTime
        })
      }
    } catch (e) {
      console.error('解析面试时间失败:', e)
    }
  }
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredInterviews.slice(start, end)
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pageResponse(list, filteredInterviews.length))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/initial-interviews\/[^\/]+$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const interview = initialInterviews.find(i => i.id === id)
  
  return new Promise(resolve => {
    setTimeout(() => {
      if (interview) {
        resolve(successResponse({
          ...interview,
          operationRecords: [
            {
              id: 'OR001',
              operationType: 'create',
              operator: interview.creatorName,
              operationTime: interview.createTime,
              operationContent: '创建初步面试'
            },
            {
              id: 'OR002',
              operationType: 'update',
              operator: interview.managerName,
              operationTime: interview.updateTime,
              operationContent: '更新面试信息'
            }
          ]
        }))
      } else {
        resolve(errorResponse('初步面试信息不存在', 404))
      }
    }, responseDelay)
  })
})

Mock.mock('/api/interview/initial-interviews', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newInterview = {
    id: `II${String(initialInterviews.length + 1).padStart(3, '0')}`,
    ...body,
    status: 'PENDING',
    tenantId: 'TENANT001',
    departmentId: 'DEPT001',
    creatorId: 'USER001',
    creatorName: '张三',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  initialInterviews.unshift(newInterview)
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(createdResponse({ id: newInterview.id }))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/initial-interviews\/[^\/]+$/, 'put', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const body = JSON.parse(options.body)
  const index = initialInterviews.findIndex(i => i.id === id)
  
  if (index !== -1) {
    initialInterviews[index] = {
      ...initialInterviews[index],
      ...body,
      updateTime: new Date().toISOString()
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(successResponse(initialInterviews[index]))
      }, responseDelay)
    })
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(errorResponse('初步面试信息不存在', 404))
      }, responseDelay)
    })
  }
})

Mock.mock(/^\/api\/interview\/initial-interviews\/[^\/]+$/, 'delete', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const index = initialInterviews.findIndex(i => i.id === id)
  
  if (index !== -1) {
    initialInterviews.splice(index, 1)
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(successResponse(null))
      }, responseDelay)
    })
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(errorResponse('初步面试信息不存在', 404))
      }, responseDelay)
    })
  }
})

Mock.mock('/api/interview/initial-interviews/batch', 'delete', (options) => {
  const body = JSON.parse(options.body)
  const { ids } = body
  
  for (const id of ids) {
    const index = initialInterviews.findIndex(i => i.id === id)
    if (index !== -1) {
      initialInterviews.splice(index, 1)
    }
  }
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse(null))
    }, responseDelay)
  })
})

Mock.mock('/api/interview/initial-interviews/import', 'post', (options) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse({
        successCount: 10,
        failCount: 0,
        failRecords: []
      }))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/initial-interviews\/export(\?.*)?$/, 'get', (options) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      })
    }, responseDelay)
  })
})

Mock.mock('/api/interview/initial-interviews/template', 'get', () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: new Blob(['Mock Template Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      })
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/invitations(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = interviewInvitations.slice(start, end)
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pageResponse(list, interviewInvitations.length))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/invitations\/[^\/]+$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const invitation = interviewInvitations.find(i => i.id === id)
  
  return new Promise(resolve => {
    setTimeout(() => {
      if (invitation) {
        resolve(successResponse({
          ...invitation,
          worker: {
            id: 'W001',
            name: invitation.workerName,
            phone: invitation.phone,
            idCard: invitation.idCard
          },
          factoryInfo: {
            id: 'F001',
            name: invitation.factory,
            socialCreditCode: '91440300MA5DXXXXXX',
            contactPerson: '张三',
            contactPhone: '13800138000'
          }
        }))
      } else {
        resolve(errorResponse('面试邀约信息不存在', 404))
      }
    }, responseDelay)
  })
})

Mock.mock('/api/interview/invitations', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newInvitation = {
    id: `IV${String(interviewInvitations.length + 1).padStart(3, '0')}`,
    ...body,
    status: 'pending',
    createTime: new Date().toISOString()
  }
  interviewInvitations.unshift(newInvitation)
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(createdResponse({ id: newInvitation.id }))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/invitations\/[^\/]+$/, 'put', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const body = JSON.parse(options.body)
  const index = interviewInvitations.findIndex(i => i.id === id)
  
  if (index !== -1) {
    interviewInvitations[index] = {
      ...interviewInvitations[index],
      ...body
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(successResponse(interviewInvitations[index]))
      }, responseDelay)
    })
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(errorResponse('面试邀约信息不存在', 404))
      }, responseDelay)
    })
  }
})

Mock.mock(/^\/api\/interview\/invitations\/[^\/]+$/, 'delete', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const index = interviewInvitations.findIndex(i => i.id === id)
  
  if (index !== -1) {
    interviewInvitations.splice(index, 1)
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(successResponse(null))
      }, responseDelay)
    })
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(errorResponse('面试邀约信息不存在', 404))
      }, responseDelay)
    })
  }
})

Mock.mock('/api/interview/invitations/batch', 'delete', (options) => {
  const body = JSON.parse(options.body)
  const { ids } = body
  
  for (const id of ids) {
    const index = interviewInvitations.findIndex(i => i.id === id)
    if (index !== -1) {
      interviewInvitations.splice(index, 1)
    }
  }
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse(null))
    }, responseDelay)
  })
})

Mock.mock('/api/interview/invitations/import', 'post', (options) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse({
        successCount: 10,
        failCount: 0,
        failRecords: []
      }))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/invitations\/export(\?.*)?$/, 'get', (options) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      })
    }, responseDelay)
  })
})

Mock.mock('/api/interview/invitations/template', 'get', () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: new Blob(['Mock Template Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      })
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/factory-interviews(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  const laborCompany = url.searchParams.get('laborCompany')
  const socialCreditCode = url.searchParams.get('socialCreditCode')
  const manager = url.searchParams.get('manager')
  const factoryContact = url.searchParams.get('factoryContact')
  const status = url.searchParams.get('status')
  const interviewTime = url.searchParams.get('interviewTime')
  
  let filteredInterviews = [...factoryInterviews]
  
  if (laborCompany) {
    filteredInterviews = filteredInterviews.filter(i => i.laborCompanyName.includes(laborCompany))
  }
  
  if (socialCreditCode) {
    filteredInterviews = filteredInterviews.filter(i => i.socialCreditCode.includes(socialCreditCode))
  }
  
  if (manager) {
    filteredInterviews = filteredInterviews.filter(i => i.manager.includes(manager))
  }
  
  if (factoryContact) {
    filteredInterviews = filteredInterviews.filter(i => i.factoryContactName.includes(factoryContact))
  }
  
  if (status) {
    filteredInterviews = filteredInterviews.filter(i => i.status === status)
  }
  
  if (interviewTime) {
    try {
      const timeRange = JSON.parse(interviewTime)
      if (timeRange && timeRange.length === 2) {
        const startTime = new Date(timeRange[0]).getTime()
        const endTime = new Date(timeRange[1]).getTime()
        filteredInterviews = filteredInterviews.filter(i => {
          const interviewTime = new Date(i.interviewTime).getTime()
          return interviewTime >= startTime && interviewTime <= endTime
        })
      }
    } catch (e) {
      console.error('解析面试时间失败:', e)
    }
  }
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredInterviews.slice(start, end)
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pageResponse(list, filteredInterviews.length))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/factory-interviews\/[^\/]+$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const interview = factoryInterviews.find(i => i.id === id)
  
  return new Promise(resolve => {
    setTimeout(() => {
      if (interview) {
        resolve(successResponse({
          ...interview,
          operationRecords: [
            {
              id: 'OR001',
              operationType: 'create',
              operator: interview.createdByName,
              operationTime: interview.createdAt,
              operationContent: '创建工厂面试邀约'
            },
            {
              id: 'OR002',
              operationType: 'update',
              operator: interview.updatedByName,
              operationTime: interview.updatedAt,
              operationContent: '更新面试信息'
            }
          ]
        }))
      } else {
        resolve(errorResponse('工厂面试信息不存在', 404))
      }
    }, responseDelay)
  })
})

Mock.mock('/api/interview/factory-interviews', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newInterview = {
    id: `FI${String(factoryInterviews.length + 1).padStart(3, '0')}`,
    laborCompanyId: body.laborCompanyId || `LC${String(factoryInterviews.length + 1).padStart(3, '0')}`,
    laborCompanyName: body.laborCompanyName || '深圳市蓝领劳务派遣有限公司',
    socialCreditCode: body.socialCreditCode || `91440300MA5D${Random.string('number', 10)}`,
    manager: body.manager || Random.cname(),
    managerPhone: body.managerPhone || `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
    interviewTime: body.interviewTime,
    interviewLocation: body.interviewLocation,
    factoryContactId: body.factoryContactId || `EMP${String(factoryInterviews.length + 1).padStart(3, '0')}`,
    factoryContactName: body.factoryContactName || Random.cname(),
    factoryContactPhone: body.factoryContactPhone || `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
    factoryId: 'F001',
    remark: body.remark || '',
    status: 'PENDING',
    createdBy: 'USER001',
    createdByName: '张三',
    createdAt: new Date().toISOString(),
    updatedBy: 'USER001',
    updatedByName: '张三',
    updatedAt: new Date().toISOString(),
    personCount: body.persons?.length || 0,
    persons: body.persons || []
  }
  factoryInterviews.unshift(newInterview)
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(createdResponse({ id: newInterview.id }))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/factory-interviews\/[^\/]+$/, 'put', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const body = JSON.parse(options.body)
  const index = factoryInterviews.findIndex(i => i.id === id)
  
  if (index !== -1) {
    factoryInterviews[index] = {
      ...factoryInterviews[index],
      ...body
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(successResponse(factoryInterviews[index]))
      }, responseDelay)
    })
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(errorResponse('工厂面试信息不存在', 404))
      }, responseDelay)
    })
  }
})

Mock.mock(/^\/api\/interview\/factory-interviews\/[^\/]+$/, 'delete', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const id = url.pathname.split('/').pop()
  const index = factoryInterviews.findIndex(i => i.id === id)
  
  if (index !== -1) {
    factoryInterviews.splice(index, 1)
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(successResponse(null))
      }, responseDelay)
    })
  } else {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(errorResponse('工厂面试信息不存在', 404))
      }, responseDelay)
    })
  }
})

Mock.mock('/api/interview/factory-interviews/batch', 'delete', (options) => {
  const body = JSON.parse(options.body)
  const { ids } = body
  
  for (const id of ids) {
    const index = factoryInterviews.findIndex(i => i.id === id)
    if (index !== -1) {
      factoryInterviews.splice(index, 1)
    }
  }
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse(null))
    }, responseDelay)
  })
})

Mock.mock('/api/interview/factory-interviews/import', 'post', (options) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse({
        successCount: 10,
        failCount: 0,
        failRecords: []
      }))
    }, responseDelay)
  })
})

Mock.mock(/^\/api\/interview\/factory-interviews\/export(\?.*)?$/, 'get', (options) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      })
    }, responseDelay)
  })
})

Mock.mock('/api/interview/factory-interviews/template', 'get', () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: new Blob(['Mock Template Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      })
    }, responseDelay)
  })
})

Mock.mock('/api/system/workers/options', 'get', () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse(workers.map(w => ({
        id: w.id,
        name: w.name,
        phone: w.phone,
        idCard: w.idCard,
        jobCategory: w.jobCategory,
        materialComplete: w.materialComplete
      }))))
    }, responseDelay)
  })
})

Mock.mock('/api/system/factories/options', 'get', () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse([
        { id: 'F001', name: '华为技术有限公司', socialCreditCode: '91440300MA5DXXXXXX' },
        { id: 'F002', name: '比亚迪股份有限公司', socialCreditCode: '91440300MA5DXXXXXX' },
        { id: 'F003', name: '富士康科技集团', socialCreditCode: '91440300MA5DXXXXXX' }
      ]))
    }, responseDelay)
  })
})

Mock.mock('/api/system/positions/options', 'get', () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(successResponse([
        { id: 'P001', name: '普工', category: '生产' },
        { id: 'P002', name: '技工', category: '生产' },
        { id: 'P003', name: '质检员', category: '质量' },
        { id: 'P004', name: '仓管员', category: '仓储' },
        { id: 'P005', name: '操作工', category: '生产' }
      ]))
    }, responseDelay)
  })
})
