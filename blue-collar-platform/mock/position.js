import Mock from 'mockjs';

const positionList = Mock.mock({
  'list|20': [{
    'id|+1': 1,
    'positionName': '@ctitle(3, 6)',
    'departmentId': '@pick(["1", "2", "3", "4", "5"])',
    'departmentName': '@pick(["人力资源部", "财务部", "技术部", "市场部", "运营部"])',
    'dataPermissionType': '@pick(["ALL", "DEPARTMENT", "DEPARTMENT_AND_BELOW", "SELF", "CUSTOM"])',
    'customDepartments|1-3': ["1", "2", "3"],
    'includeCreator': '@boolean',
    'includeManager': '@boolean',
    'includeContact': '@boolean',
    'menuPermissions|5-15': ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
    'description': '@csentence(10, 30)',
    'status': '@pick(["enabled", "disabled"])',
    'createdAt': '@datetime',
    'updatedAt': '@datetime',
    'createdBy': '@cname',
    'updatedBy': '@cname'
  }]
});

export default [
  {
    url: '/system/positions',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, positionName, departmentId, status } = query;
      let filteredList = [...positionList.list];

      if (positionName) {
        filteredList = filteredList.filter(item => item.positionName.includes(positionName));
      }

      if (departmentId) {
        filteredList = filteredList.filter(item => item.departmentId === departmentId);
      }

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
  {
    url: /\/system\/positions\/\d+/,
    method: 'get',
    response: ({ url }) => {
      const id = url.match(/\d+/)?.[0];
      const position = positionList.list.find(item => item.id == id) || positionList.list[0];

      return {
        code: 200,
        message: 'success',
        data: {
          ...position,
          departmentPath: '技术部 / 开发组',
          menuPermissionNames: ['工作中心', '招聘管理', '面试管理'],
          customDepartmentNames: position.customDepartments.length > 0 ? ['技术部', '开发组'] : []
        },
        timestamp: Date.now()
      };
    }
  },
  {
    url: '/system/positions',
    method: 'post',
    response: ({ body }) => {
      const data = JSON.parse(body);
      const newPosition = {
        id: positionList.list.length + 1,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '赵管理员',
        updatedBy: '赵管理员'
      };
      positionList.list.unshift(newPosition);

      return {
        code: 200,
        message: '创建成功',
        data: newPosition,
        timestamp: Date.now()
      };
    }
  },
  {
    url: /\/system\/positions\/\d+/,
    method: 'put',
    response: ({ url, body }) => {
      const id = url.match(/\d+/)?.[0];
      const data = JSON.parse(body);
      const index = positionList.list.findIndex(item => item.id == id);

      if (index !== -1) {
        positionList.list[index] = {
          ...positionList.list[index],
          ...data,
          updatedAt: new Date().toISOString(),
          updatedBy: '赵管理员'
        };
      }

      return {
        code: 200,
        message: '更新成功',
        data: positionList.list[index],
        timestamp: Date.now()
      };
    }
  },
  {
    url: /\/system\/positions\/\d+/,
    method: 'delete',
    response: ({ url }) => {
      const id = url.match(/\d+/)?.[0];
      const index = positionList.list.findIndex(item => item.id == id);

      if (index !== -1) {
        positionList.list.splice(index, 1);
      }

      return {
        code: 200,
        message: '删除成功',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  {
    url: '/system/positions/batch',
    method: 'delete',
    response: ({ body }) => {
      const { ids } = JSON.parse(body);
      ids.forEach(id => {
        const index = positionList.list.findIndex(item => item.id == id);
        if (index !== -1) {
          positionList.list.splice(index, 1);
        }
      });

      return {
        code: 200,
        message: '批量删除成功',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  {
    url: '/system/positions/check-name',
    method: 'get',
    response: ({ query }) => {
      const { positionName, id } = query;
      const exists = positionList.list.some(item => 
        item.positionName === positionName && item.id != id
      );

      return {
        code: 200,
        message: 'success',
        data: exists,
        timestamp: Date.now()
      };
    }
  }
];
