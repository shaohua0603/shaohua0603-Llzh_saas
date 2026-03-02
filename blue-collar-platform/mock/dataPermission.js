import Mock from 'mockjs';

// 模拟部门树结构
const departmentTree = [
  {
    id: '1',
    name: '蓝领智汇总部',
    parentId: '',
    code: 'HQ',
    level: 1,
    children: [
      {
        id: '1-1',
        name: '技术研发部',
        parentId: '1',
        code: 'TECH',
        level: 2,
        children: [
          {
            id: '1-1-1',
            name: '前端开发组',
            parentId: '1-1',
            code: 'FE',
            level: 3
          },
          {
            id: '1-1-2',
            name: '后端开发组',
            parentId: '1-1',
            code: 'BE',
            level: 3
          },
          {
            id: '1-1-3',
            name: '测试组',
            parentId: '1-1',
            code: 'QA',
            level: 3
          }
        ]
      },
      {
        id: '1-2',
        name: '人力资源部',
        parentId: '1',
        code: 'HR',
        level: 2,
        children: [
          {
            id: '1-2-1',
            name: '招聘组',
            parentId: '1-2',
            code: 'HR-REC',
            level: 3
          },
          {
            id: '1-2-2',
            name: '培训组',
            parentId: '1-2',
            code: 'HR-TRN',
            level: 3
          }
        ]
      },
      {
        id: '1-3',
        name: '财务部',
        parentId: '1',
        code: 'FIN',
        level: 2
      },
      {
        id: '1-4',
        name: '市场部',
        parentId: '1',
        code: 'MKT',
        level: 2
      },
      {
        id: '1-5',
        name: '运营部',
        parentId: '1',
        code: 'OPS',
        level: 2
      }
    ]
  }
];

// 模拟用户数据权限信息
const userDataPermission = {
  userId: 'user001',
  username: '张三',
  departmentId: '1-2',
  departmentName: '人力资源部',
  positionId: 'pos001',
  positionName: '人事专员',
  dataPermission: {
    type: 'DEPARTMENT',
    includeCreator: false,
    includeManager: false,
    includeContact: false
  },
  isAdmin: false
};

// 模拟数据权限申请记录
const permissionApplications = Mock.mock({
  'list|10': [{
    'id|+1': 'app001',
    'applicantId': '@pick(["user001", "user002", "user003"])',
    'applicantName': '@cname',
    'permissionType': '@pick(["ALL", "DEPARTMENT_AND_BELOW", "CUSTOM"])',
    'departments|1-3': ['1', '1-1', '1-2'],
    'reason': '@csentence(10, 30)',
    'status': '@pick(["pending", "approved", "rejected"])',
    'approverId|1': ['@pick(["admin001", "admin002"])', null],
    'approverName|1': ['@pick(["管理员A", "管理员B"])', null],
    'approvalTime|1': ['@datetime', null],
    'approvalComment|1': ['@csentence(5, 20)', null],
    'createdAt': '@datetime'
  }]
});

export default [
  // 获取用户数据权限
  {
    url: '/api/v1/data-permission/user',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: userDataPermission,
        timestamp: Date.now()
      };
    }
  },

  // 获取部门树结构
  {
    url: '/api/v1/data-permission/departments/tree',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: departmentTree,
        timestamp: Date.now()
      };
    }
  },

  // 更新数据权限配置
  {
    url: '/api/v1/data-permission/update',
    method: 'put',
    response: ({ body }) => {
      const data = JSON.parse(body);
      userDataPermission.dataPermission = {
        ...userDataPermission.dataPermission,
        ...data
      };
      return {
        code: 200,
        message: '更新成功',
        data: userDataPermission.dataPermission,
        timestamp: Date.now()
      };
    }
  },

  // 申请数据权限
  {
    url: '/api/v1/data-permission/apply',
    method: 'post',
    response: ({ body }) => {
      const data = JSON.parse(body);
      const newApplication = {
        id: `app${Date.now()}`,
        applicantId: userDataPermission.userId,
        applicantName: userDataPermission.username,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      permissionApplications.list.unshift(newApplication);
      return {
        code: 200,
        message: '申请已提交',
        data: newApplication,
        timestamp: Date.now()
      };
    }
  },

  // 获取申请记录
  {
    url: '/api/v1/data-permission/applications',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, status } = query;
      let filteredList = [...permissionApplications.list];

      if (status) {
        filteredList = filteredList.filter(item => item.status === status);
      }

      const start = (page - 1) * pageSize;
      const end = start + parseInt(pageSize);
      const list = filteredList.slice(start, end);

      return {
        code: 200,
        message: 'success',
        data: {
          list,
          total: filteredList.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        },
        timestamp: Date.now()
      };
    }
  },

  // 审批数据权限申请
  {
    url: /\/api\/v1\/data-permission\/applications\/[^/]+\/approve/,
    method: 'post',
    response: ({ url, body }) => {
      const applicationId = url.match(/applications\/([^/]+)/)?.[1];
      const { approved, comment } = JSON.parse(body);
      const index = permissionApplications.list.findIndex(item => item.id === applicationId);

      if (index !== -1) {
        permissionApplications.list[index].status = approved ? 'approved' : 'rejected';
        permissionApplications.list[index].approverId = 'admin001';
        permissionApplications.list[index].approverName = '管理员A';
        permissionApplications.list[index].approvalTime = new Date().toISOString();
        permissionApplications.list[index].approvalComment = comment;
      }

      return {
        code: 200,
        message: approved ? '审批通过' : '审批驳回',
        data: permissionApplications.list[index],
        timestamp: Date.now()
      };
    }
  },

  // 撤销数据权限申请
  {
    url: /\/api\/v1\/data-permission\/applications\/[^/]+\/withdraw/,
    method: 'post',
    response: ({ url }) => {
      const applicationId = url.match(/applications\/([^/]+)/)?.[1];
      const index = permissionApplications.list.findIndex(item => item.id === applicationId);

      if (index !== -1 && permissionApplications.list[index].status === 'pending') {
        permissionApplications.list[index].status = 'withdrawn';
      }

      return {
        code: 200,
        message: '申请已撤销',
        data: null,
        timestamp: Date.now()
      };
    }
  },

  // 获取数据权限统计信息
  {
    url: '/api/v1/data-permission/statistics',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          totalUsers: 100,
          permissionTypeDistribution: {
            ALL: 5,
            DEPARTMENT: 45,
            DEPARTMENT_AND_BELOW: 30,
            SELF: 15,
            CUSTOM: 5
          },
          pendingApplications: 3,
          approvedApplications: 25,
          rejectedApplications: 2
        },
        timestamp: Date.now()
      };
    }
  }
];
