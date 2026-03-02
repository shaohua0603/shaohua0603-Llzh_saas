import Mock from 'mockjs';

const tenantList = Mock.mock({
  'list|30': [{
    'id|+1': 1,
    'tenantName': '@ctitle(4, 10)',
    'creditCode': /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
    'businessLicense': '@image("300x400", "@color", "营业执照")',
    'adminName': '@cname',
    'adminPhone': /^1[3-9]\d{9}$/,
    'contactName': '@cname',
    'contactPhone': /^1[3-9]\d{9}$/,
    'packageId': '@pick(["1", "2", "3", "4", "5"])',
    'packageName': '@pick(["基础套餐", "标准套餐", "高级套餐", "企业套餐", "旗舰套餐"])',
    'tenantType': '@pick(["labor_company", "factory"])',
    'status': '@pick(["enabled", "disabled"])',
    'createdAt': '@datetime',
    'updatedAt': '@datetime',
    'createdBy': '@cname',
    'updatedBy': '@cname'
  }]
});

const packageOptions = [
  { label: '基础套餐', value: '1' },
  { label: '标准套餐', value: '2' },
  { label: '高级套餐', value: '3' },
  { label: '企业套餐', value: '4' },
  { label: '旗舰套餐', value: '5' }
];

export default [
  // 获取租户列表
  {
    url: '/system/tenants',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, keyword, packageId, status, tenantType } = query;
      let filteredList = [...tenantList.list];

      if (keyword) {
        filteredList = filteredList.filter(item =>
          item.tenantName.includes(keyword) ||
          item.creditCode.includes(keyword) ||
          item.adminPhone.includes(keyword) ||
          item.contactPhone.includes(keyword)
        );
      }

      if (packageId) {
        filteredList = filteredList.filter(item => item.packageId === packageId);
      }

      if (status) {
        filteredList = filteredList.filter(item => item.status === status);
      }

      if (tenantType) {
        filteredList = filteredList.filter(item => item.tenantType === tenantType);
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
  // 获取租户详情
  {
    url: /\/system\/tenants\/\d+/,
    method: 'get',
    response: ({ url }) => {
      const id = url.split('/').pop();
      const tenant = tenantList.list.find(item => item.id === parseInt(id));
      if (tenant) {
        return {
          code: 200,
          message: 'success',
          data: tenant,
          timestamp: Date.now()
        };
      }
      return {
        code: 404,
        message: '租户不存在',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  // 创建租户
  {
    url: '/system/tenants',
    method: 'post',
    response: ({ body }) => {
      const newTenant = {
        id: tenantList.list.length + 1,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        updatedBy: 'admin'
      };
      tenantList.list.unshift(newTenant);
      return {
        code: 201,
        message: '创建成功',
        data: newTenant,
        timestamp: Date.now()
      };
    }
  },
  // 更新租户
  {
    url: /\/system\/tenants\/\d+/,
    method: 'put',
    response: ({ url, body }) => {
      const id = url.split('/').pop();
      const index = tenantList.list.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        tenantList.list[index] = {
          ...tenantList.list[index],
          ...body,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin'
        };
        return {
          code: 200,
          message: '更新成功',
          data: tenantList.list[index],
          timestamp: Date.now()
        };
      }
      return {
        code: 404,
        message: '租户不存在',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  // 删除租户
  {
    url: /\/system\/tenants\/\d+/,
    method: 'delete',
    response: ({ url }) => {
      const id = url.split('/').pop();
      const index = tenantList.list.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        tenantList.list.splice(index, 1);
        return {
          code: 200,
          message: '删除成功',
          data: null,
          timestamp: Date.now()
        };
      }
      return {
        code: 404,
        message: '租户不存在',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  // 批量删除租户
  {
    url: '/system/tenants/batch',
    method: 'delete',
    response: ({ body }) => {
      const { ids } = body;
      ids.forEach(id => {
        const index = tenantList.list.findIndex(item => item.id === id);
        if (index !== -1) {
          tenantList.list.splice(index, 1);
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
  // 导出租户列表
  {
    url: '/system/tenants/export',
    method: 'get',
    response: ({ query }) => {
      // 模拟导出文件
      return {
        code: 200,
        message: '导出成功',
        data: new Blob(['模拟Excel文件内容'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        timestamp: Date.now()
      };
    }
  },
  // 启用租户
  {
    url: /\/system\/tenants\/\d+\/enable/,
    method: 'put',
    response: ({ url }) => {
      const id = url.split('/')[3];
      const index = tenantList.list.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        tenantList.list[index].status = 'enabled';
        tenantList.list[index].updatedAt = new Date().toISOString();
        return {
          code: 200,
          message: '启用成功',
          data: tenantList.list[index],
          timestamp: Date.now()
        };
      }
      return {
        code: 404,
        message: '租户不存在',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  // 禁用租户
  {
    url: /\/system\/tenants\/\d+\/disable/,
    method: 'put',
    response: ({ url }) => {
      const id = url.split('/')[3];
      const index = tenantList.list.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        tenantList.list[index].status = 'disabled';
        tenantList.list[index].updatedAt = new Date().toISOString();
        return {
          code: 200,
          message: '禁用成功',
          data: tenantList.list[index],
          timestamp: Date.now()
        };
      }
      return {
        code: 404,
        message: '租户不存在',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  // 检查租户名称是否重复
  {
    url: '/system/tenants/check-name',
    method: 'get',
    response: ({ query }) => {
      const { tenantName, id } = query;
      const exists = tenantList.list.some(item =>
        item.tenantName === tenantName && item.id !== parseInt(id)
      );
      return {
        code: 200,
        message: 'success',
        data: !exists,
        timestamp: Date.now()
      };
    }
  },
  // 检查统一社会信用代码是否重复
  {
    url: '/system/tenants/check-credit-code',
    method: 'get',
    response: ({ query }) => {
      const { creditCode, id } = query;
      const exists = tenantList.list.some(item =>
        item.creditCode === creditCode && item.id !== parseInt(id)
      );
      return {
        code: 200,
        message: 'success',
        data: !exists,
        timestamp: Date.now()
      };
    }
  },
  // 获取套餐下拉选项
  {
    url: '/system/packages/options',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: packageOptions,
        timestamp: Date.now()
      };
    }
  }
];
