/**
 * 空闲工人模块类型定义
 */

/**
 * 工人标签枚举
 */
export enum WorkerTag {
  REGISTERED = 'registered',           // 注册
  PICKUP = 'pickup',                   // 接送
  INITIAL_INTERVIEW = 'initial_interview', // 初次面试
  CONTRACT_SIGNED = 'contract_signed', // 合同签订
  INTERVIEW_INVITATION = 'interview_invitation', // 面试邀约
  FACTORY_INTERVIEW = 'factory_interview', // 工厂面试
  ENTERED_FACTORY = 'entered_factory', // 进厂
  RESIGNED = 'resigned',               // 离职
}

/**
 * 工人标签文本映射
 */
export const WorkerTagText: Record<WorkerTag, string> = {
  [WorkerTag.REGISTERED]: '注册',
  [WorkerTag.PICKUP]: '接送',
  [WorkerTag.INITIAL_INTERVIEW]: '初次面试',
  [WorkerTag.CONTRACT_SIGNED]: '合同签订',
  [WorkerTag.INTERVIEW_INVITATION]: '面试邀约',
  [WorkerTag.FACTORY_INTERVIEW]: '工厂面试',
  [WorkerTag.ENTERED_FACTORY]: '进厂',
  [WorkerTag.RESIGNED]: '离职',
};

/**
 * 工人标签颜色映射
 */
export const WorkerTagColor: Record<WorkerTag, string> = {
  [WorkerTag.REGISTERED]: '#909399',
  [WorkerTag.PICKUP]: '#409EFF',
  [WorkerTag.INITIAL_INTERVIEW]: '#67C23A',
  [WorkerTag.CONTRACT_SIGNED]: '#E6A23C',
  [WorkerTag.INTERVIEW_INVITATION]: '#F56C6C',
  [WorkerTag.FACTORY_INTERVIEW]: '#909399',
  [WorkerTag.ENTERED_FACTORY]: '#409EFF',
  [WorkerTag.RESIGNED]: '#F56C6C',
};

/**
 * 工人基本信息
 */
export interface WorkerBasicInfo {
  id: number;
  name: string;
  phone: string;
  idCard?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  age?: number;
  avatar?: string;
  tags: WorkerTag[];
  tagTexts: string[];
  registerTime: string;
  lastLoginTime?: string;
}

/**
 * 工人详细信息
 */
export interface WorkerDetailInfo {
  // 个人证件照片
  idCardFrontPhoto?: string;          // 身份证正面
  idCardBackPhoto?: string;           // 身份证背面

  // 基本信息
  id: number;
  name: string;
  phone: string;
  idCard?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  age?: number;
  avatar?: string;
  nation?: string;                    // 民族
  nativePlace?: string;               // 籍贯
  address?: string;                   // 现住址
  maritalStatus?: string;             // 婚姻状况
  education?: string;                 // 学历

  // 工作信息
  factoryName?: string;               // 工厂名称
  area?: string;                      // 区域
  productionLine?: string;            // 产线
  positionCategory?: string;           // 岗位类别
  positionName?: string;               // 岗位名称
  laborCompany?: string;               // 劳务公司

  // 生活照片
  lifePhotos?: string[];              // 生活照片

  // 教育背景
  educationBackground?: Array<{
    school: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;

  // 当前工作情况
  currentWorkStatus?: {
    status: string;                   // 在职/离职
    entryDate?: string;               // 入职日期
    workDuration?: number;            // 工作时长(天)
    currentSalary?: number;            // 当前薪资
  };

  // 求职意向
  jobIntention?: {
    expectedPosition?: string;        // 期望岗位
    expectedSalary?: number;          // 期望薪资
    expectedArea?: string;             // 期望区域
    availableDate?: string;           // 可到岗日期
  };

  // 紧急联系方式
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    address?: string;
  };

  // 工资方法银行卡
  bankCard?: {
    bankName: string;
    cardNumber: string;
    cardholderName: string;
  };

  // 技能与证书
  skills?: string[];                  // 技能列表
  certificates?: Array<{
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate?: string;
  }>;

  // 特殊情况与健康状况
  specialConditions?: string[];        // 特殊情况
  healthStatus?: {
    height?: number;                  // 身高
    weight?: number;                  // 体重
    bloodType?: string;               // 血型
    healthCondition?: string;         // 健康状况
    medicalHistory?: string;          // 病史
  };

  // 个人经历
  personalExperience?: string;

  // 工作履历
  workHistory?: Array<{
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    reasonForLeaving?: string;
  }>;

  // 其他信息
  tags: WorkerTag[];
  tagTexts: string[];
  registerTime: string;
  lastLoginTime?: string;
  createdBy?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 空闲工人查询参数
 */
export interface IdleWorkerQueryParams {
  page: number;
  pageSize: number;
  keyword?: string;                  // 关键词搜索(姓名、手机号)
  tags?: WorkerTag[];                 // 标签筛选
  startTime?: string;                // 开始时间
  endTime?: string;                  // 结束时间
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}
