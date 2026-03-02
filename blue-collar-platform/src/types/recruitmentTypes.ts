/**
 * 招聘管理模块类型定义
 */

/**
 * 招聘需求状态枚举
 */
export enum RecruitmentStatus {
  DRAFT = 'draft',           // 草稿
  PUBLISHED = 'published',   // 已发布
  ONGOING = 'ongoing',       // 进行中
  PAUSED = 'paused',         // 已暂停
  COMPLETED = 'completed',   // 已完成
  CANCELLED = 'cancelled',   // 已取消
}

/**
 * 招聘需求状态对应的中文描述
 */
export const RecruitmentStatusText: Record<RecruitmentStatus, string> = {
  [RecruitmentStatus.DRAFT]: '草稿',
  [RecruitmentStatus.PUBLISHED]: '已发布',
  [RecruitmentStatus.ONGOING]: '进行中',
  [RecruitmentStatus.PAUSED]: '已暂停',
  [RecruitmentStatus.COMPLETED]: '已完成',
  [RecruitmentStatus.CANCELLED]: '已取消',
}

/**
 * 招聘需求状态对应的标签类型
 */
export const RecruitmentStatusTagType: Record<RecruitmentStatus, string> = {
  [RecruitmentStatus.DRAFT]: 'info',
  [RecruitmentStatus.PUBLISHED]: 'success',
  [RecruitmentStatus.ONGOING]: 'primary',
  [RecruitmentStatus.PAUSED]: 'warning',
  [RecruitmentStatus.COMPLETED]: 'success',
  [RecruitmentStatus.CANCELLED]: 'danger',
}

/**
 * 简历状态枚举
 */
export enum ResumeStatus {
  PENDING = 'pending',       // 待审核
  REVIEWING = 'reviewing',   // 审核中
  APPROVED = 'approved',     // 已通过
  REJECTED = 'rejected',     // 已拒绝
  INTERVIEWING = 'interviewing', // 面试中
  HIRED = 'hired',           // 已录用
  WITHDRAWN = 'withdrawn',   // 已撤回
}

/**
 * 简历状态对应的中文描述
 */
export const ResumeStatusText: Record<ResumeStatus, string> = {
  [ResumeStatus.PENDING]: '待审核',
  [ResumeStatus.REVIEWING]: '审核中',
  [ResumeStatus.APPROVED]: '已通过',
  [ResumeStatus.REJECTED]: '已拒绝',
  [ResumeStatus.INTERVIEWING]: '面试中',
  [ResumeStatus.HIRED]: '已录用',
  [ResumeStatus.WITHDRAWN]: '已撤回',
}

/**
 * 简历状态对应的标签类型
 */
export const ResumeStatusTagType: Record<ResumeStatus, string> = {
  [ResumeStatus.PENDING]: 'warning',
  [ResumeStatus.REVIEWING]: 'primary',
  [ResumeStatus.APPROVED]: 'success',
  [ResumeStatus.REJECTED]: 'danger',
  [ResumeStatus.INTERVIEWING]: 'primary',
  [ResumeStatus.HIRED]: 'success',
  [ResumeStatus.WITHDRAWN]: 'info',
}

/**
 * 性别枚举
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

/**
 * 性别对应的中文描述
 */
export const GenderText: Record<Gender, string> = {
  [Gender.MALE]: '男',
  [Gender.FEMALE]: '女',
  [Gender.UNKNOWN]: '未知',
}

/**
 * 学历枚举
 */
export enum Education {
  JUNIOR_HIGH = 'junior_high',   // 初中
  HIGH_SCHOOL = 'high_school',   // 高中
  VOCATIONAL = 'vocational',     // 中专
  JUNIOR_COLLEGE = 'junior_college', // 大专
  BACHELOR = 'bachelor',         // 本科
  MASTER = 'master',             // 硕士
  DOCTOR = 'doctor',             // 博士
  OTHER = 'other',               // 其他,
}

/**
 * 学历对应的中文描述
 */
export const EducationText: Record<Education, string> = {
  [Education.JUNIOR_HIGH]: '初中',
  [Education.HIGH_SCHOOL]: '高中',
  [Education.VOCATIONAL]: '中专',
  [Education.JUNIOR_COLLEGE]: '大专',
  [Education.BACHELOR]: '本科',
  [Education.MASTER]: '硕士',
  [Education.DOCTOR]: '博士',
  [Education.OTHER]: '其他',
}

/**
 * 工作经验枚举
 */
export enum Experience {
  LESS_THAN_ONE = 'less_than_one',   // 1年以下
  ONE_TO_THREE = 'one_to_three',     // 1-3年
  THREE_TO_FIVE = 'three_to_five',   // 3-5年
  FIVE_TO_TEN = 'five_to_ten',       // 5-10年
  MORE_THAN_TEN = 'more_than_ten',   // 10年以上,
}

/**
 * 工作经验对应的中文描述
 */
export const ExperienceText: Record<Experience, string> = {
  [Experience.LESS_THAN_ONE]: '1年以下',
  [Experience.ONE_TO_THREE]: '1-3年',
  [Experience.THREE_TO_FIVE]: '3-5年',
  [Experience.FIVE_TO_TEN]: '5-10年',
  [Experience.MORE_THAN_TEN]: '10年以上',
}

/**
 * 招聘需求查询参数
 */
export interface RecruitmentQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  status?: RecruitmentStatus;
  factoryId?: string;
  laborCompanyId?: string;
  positionId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 招聘需求信息
 */
export interface Recruitment {
  id: string;
  title: string;                    // 需求标题
  factoryId: string;                // 工厂ID
  factoryName: string;              // 工厂名称
  laborCompanyId: string;           // 劳务公司ID
  laborCompanyName: string;         // 劳务公司名称
  positionId: string;               // 岗位ID
  positionName: string;             // 岗位名称
  recruitCount: number;             // 招聘人数
  salaryMin: number;                // 最低薪资
  salaryMax: number;                // 最高薪资
  salaryUnit: string;               // 薪资单位
  workLocation: string;             // 工作地点
  workTime: string;                 // 工作时间
  jobRequirements: string;          // 岗位要求
  jobDescription: string;          // 岗位描述
  welfareBenefits: string;          // 福利待遇
  contactPerson: string;            // 联系人
  contactPhone: string;             // 联系电话
  status: RecruitmentStatus;        // 状态
  publishTime?: string;             // 发布时间
  startTime?: string;               // 开始时间
  endTime?: string;                 // 结束时间
  createdBy: string;                // 创建人
  createdAt: string;                // 创建时间
  updatedBy?: string;               // 更新人
  updatedAt?: string;               // 更新时间
}

/**
 * 招聘需求详情
 */
export interface RecruitmentDetail extends Recruitment {
  appliedCount: number;             // 已投递人数
  interviewCount: number;           // 面试人数
  hiredCount: number;               // 已录用人数
  viewCount: number;                // 浏览次数
  attachments: Array<{
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
  }>;
}

/**
 * 招聘需求表单数据
 */
export interface RecruitmentFormData {
  title: string;
  factoryId: string;
  laborCompanyId: string;
  positionId: string;
  recruitCount: number;
  salaryMin: number;
  salaryMax: number;
  salaryUnit: string;
  workLocation: string;
  workTime: string;
  jobRequirements: string;
  jobDescription: string;
  welfareBenefits: string;
  contactPerson: string;
  contactPhone: string;
  startTime?: string;
  endTime?: string;
  attachments?: string[];
}

/**
 * 简历查询参数
 */
export interface ResumeQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  status?: ResumeStatus;
  positionId?: string;
  recruitmentId?: string;
  gender?: Gender;
  education?: Education;
  experience?: Experience;
  startDate?: string;
  endDate?: string;
}

/**
 * 简历信息
 */
export interface Resume {
  id: string;
  name: string;                     // 姓名
  phone: string;                    // 手机号
  gender: Gender;                   // 性别
  age: number;                      // 年龄
  idCard: string;                   // 身份证号
  education: Education;            // 学历
  school: string;                   // 毕业院校
  major: string;                    // 专业
  experience: Experience;          // 工作经验
  workYears: number;                // 工作年限
  currentCity: string;              // 现居城市
  expectedCity: string;             // 期望城市
  expectedSalary: string;           // 期望薪资
  positionId: string;               // 应聘岗位ID
  positionName: string;             // 应聘岗位名称
  recruitmentId: string;            // 招聘需求ID
  recruitmentTitle: string;        // 招聘需求标题
  factoryId: string;               // 工厂ID
  factoryName: string;             // 工厂名称
  laborCompanyId: string;           // 劳务公司ID
  laborCompanyName: string;         // 劳务公司名称
  selfIntroduction: string;         // 自我介绍
  workExperience: string;           // 工作经历
  skills: string;                   // 技能特长
  status: ResumeStatus;             // 状态
  submitTime: string;               // 提交时间
  reviewTime?: string;              // 审核时间
  reviewer?: string;                // 审核人
  reviewComment?: string;           // 审核意见
  attachments: Array<{
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
  }>;
  createdBy: string;                // 创建人
  createdAt: string;                // 创建时间
  updatedBy?: string;               // 更新人
  updatedAt?: string;               // 更新时间
}

/**
 * 简历详情
 */
export interface ResumeDetail extends Resume {
  interviewRecords: Array<{
    id: string;
    interviewType: string;
    interviewTime: string;
    interviewer: string;
    interviewResult: string;
    interviewComment: string;
  }>;
  operationRecords: Array<{
    id: string;
    operation: string;
    operator: string;
    operationTime: string;
    remark: string;
  }>;
}

/**
 * 简历表单数据
 */
export interface ResumeFormData {
  name: string;
  phone: string;
  gender: Gender;
  age: number;
  idCard: string;
  education: Education;
  school: string;
  major: string;
  experience: Experience;
  workYears: number;
  currentCity: string;
  expectedCity: string;
  expectedSalary: string;
  positionId: string;
  recruitmentId: string;
  selfIntroduction: string;
  workExperience: string;
  skills: string;
  attachments?: string[];
}
