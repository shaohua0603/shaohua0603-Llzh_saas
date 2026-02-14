<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElIcon } from 'element-plus'
import { ArrowLeft, Edit, Close, Check, Delete, Plus } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const userInfo = ref(null)
const loading = ref(true)
const isEditMode = ref(false)
const editUserInfo = ref({})
const originalUserInfo = ref({})

// 获取用户信息
const getUserInfo = () => {
  loading.value = true
  try {
    const storedUserInfo = localStorage.getItem('userInfo')
    // 一寸证件照默认头像
    const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square'
    
    // 默认用户信息
    const defaultUserInfo = {
      name: '张三',
      phone: '13800138001',
      avatar: defaultAvatar,
      lifePhotos: [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20in%20casual%20clothes%20outdoor%20in%20park%2C%20natural%20smile%2C%20sunny%20day%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20with%20friends%20at%20restaurant%2C%20casual%20wear%2C%20enjoying%20meal%2C%20natural%20lighting%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20playing%20basketball%20outdoor%2C%20sportswear%2C%20active%20pose%2C%20daytime%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20traveling%20at%20scenic%20spot%2C%20casual%20outfit%2C%20background%20with%20mountains%2C%20natural%20light%2C%20realistic%20photo&image_size=square'
      ],
      idCard: '410101199005151234',
      gender: '男',
      age: '34',
      birthDate: '1990-05-15',
      ethnicity: '汉族',
      maritalStatus: '已婚',
      politicalStatus: '群众',
      nativePlace: '河南省郑州市中原区',
      currentAddress: '广东省深圳市南山区科技园南区高新南一道',
      highestEducation: '高中',
      education: [
        {
          degree: '高中',
          school: '郑州市第一高级中学',
          major: '文科',
          graduationDate: '2008-06'
        },
        {
          degree: '初中',
          school: '郑州市第二初级中学',
          major: '全科',
          graduationDate: '2005-06'
        }
      ],
      workInfo: {
        factorySection: '组装车间',
        group: '第三组',
        position: '流水线操作员',
        supervisor: '李四',
        entryDate: '2023-01-01',
        paymentMethod: '月结',
        contractAttachment: 'https://example.com/contract.pdf'
      },
      jobIntent: {
        positionCategory: '普工',
        positionPreference: '质检员、仓库管理员',
        salaryExpectation: '5000-6000元/月',
        workLocation: '广东省深圳市南山区'
      },
      specialNotes: '右腿有钢板植入（2019年车祸），查看医疗证明',
      personalExperience: '2015-2017年在郑州某超市担任理货员，2017-2019年在广州某餐厅担任服务员，2019-2022年在深圳某电子厂担任操作工。',
      workHistory: [
        {
          startDate: '2023.01',
          endDate: '至今',
          laborCompany: '南通富民劳务服务有限公司',
          factory: '富士康科技集团',
          position: '操作工',
          laborCompanyRewards: '2023年度优秀员工',
          laborCompanyPunishments: '无',
          factoryRewards: '2023年第三季度生产效率标兵',
          factoryPunishments: '2023年6月迟到1次',
          attendanceRecords: '异常: 1次'
        },
        {
          startDate: '2020.03',
          endDate: '2022.12',
          laborCompany: '深圳诚信劳务派遣有限公司',
          factory: '华为技术有限公司',
          position: '质检员',
          laborCompanyRewards: '2021年度优秀员工',
          laborCompanyPunishments: '无',
          factoryRewards: '2021年质量标兵',
          factoryPunishments: '无',
          attendanceRecords: '异常: 0次'
        }
      ],
      currentLaborCompany: '南通富民劳务服务有限公司',
      currentFactory: '富士康科技集团',
      factoryArea: 'A区',
      productionLine: '智能手机组装',
      factorySection: '组装车间',
      factoryLine: 'A线',
      position: '操作工',
      positionType: '普工',
      workType: '派遣',
      emergencyContact: '李四',
      emergencyPhone: '139****9999',
      accountName: '张三',
      bankCard: '6222021234567890123',
      bankType: '中国工商银行',
      bankName: '深圳市南山支行',
      healthStatus: '健康',
      height: '175cm',
      weight: '68kg',
      skills: '熟练操作流水线设备，具备基础质检能力',
      certificates: '身份证、健康证',
      certificateAttachments: [
        {
          name: '身份证',
          fileName: 'id-card.pdf'
        },
        {
          name: '健康证',
          fileName: 'health-certificate.pdf'
        }
      ],
      specialNoteAttachments: [
        {
          name: '医疗证明',
          fileName: 'medical-certificate.pdf'
        }
      ],
      hasFactoryExperience: '是',
      factoryName: '富士康科技集团, 华为技术有限公司, 比亚迪股份有限公司',
      factoryNote: '在富士康工作期间获得了优秀员工称号，在华为工作期间参与了新产品的研发测试。'
    }
    
    if (storedUserInfo) {
      // 从localStorage获取用户信息
      const storedData = JSON.parse(storedUserInfo)
      // 合并默认信息和存储的信息，确保所有字段都存在
      userInfo.value = {
        ...defaultUserInfo,
        ...storedData
      }
      // 确保添加新的字段
      if (!userInfo.value.factoryArea) userInfo.value.factoryArea = 'A区'
      if (!userInfo.value.productionLine) userInfo.value.productionLine = '智能手机组装'
      if (!userInfo.value.factorySection) userInfo.value.factorySection = '组装车间'
      if (!userInfo.value.factoryLine) userInfo.value.factoryLine = 'A线'
      if (!userInfo.value.hasFactoryExperience) userInfo.value.hasFactoryExperience = '是'
      if (!userInfo.value.factoryName) userInfo.value.factoryName = ''
      if (!userInfo.value.factoryNote) userInfo.value.factoryNote = ''
      if (!userInfo.value.lifePhotos || userInfo.value.lifePhotos.length === 0) userInfo.value.lifePhotos = defaultUserInfo.lifePhotos
    } else {
      // 使用默认用户信息
      userInfo.value = defaultUserInfo
    }
    
    // 保存用户信息到localStorage，确保其他页面可以使用
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 返回个人中心
const goBack = () => {
  router.push('/worker/profile')
}

// 进入编辑模式
const enterEditMode = () => {
  // 复制原始数据到编辑数据
  editUserInfo.value = JSON.parse(JSON.stringify(userInfo.value))
  originalUserInfo.value = JSON.parse(JSON.stringify(userInfo.value))
  isEditMode.value = true
}

// 保存编辑
const saveEdit = () => {
  try {
    // 更新本地存储的用户信息
    localStorage.setItem('userInfo', JSON.stringify(editUserInfo.value))
    // 更新页面显示的数据
    userInfo.value = JSON.parse(JSON.stringify(editUserInfo.value))
    // 退出编辑模式
    isEditMode.value = false
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  }
}

// 取消编辑
const cancelEdit = () => {
  ElMessageBox.confirm('确定要取消编辑吗？未保存的更改将会丢失。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 恢复原始数据
    editUserInfo.value = JSON.parse(JSON.stringify(originalUserInfo.value))
    isEditMode.value = false
  }).catch(() => {
    // 取消取消操作
  })
}

// 添加教育经历
const addEducation = () => {
  if (!editUserInfo.value.education) {
    editUserInfo.value.education = []
  }
  editUserInfo.value.education.push({
    degree: '',
    school: '',
    major: '',
    graduationDate: ''
  })
}

// 处理头像上传
const handleAvatarUpload = (file: any) => {
  // 这里可以添加图片上传的逻辑
  // 由于是模拟环境，我们可以使用图片的本地URL
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      editUserInfo.value.avatar = e.target.result
    }
  }
  reader.readAsDataURL(file.raw)
}

// 处理生活照片上传
const handleLifePhotoUpload = (file: any) => {
  // 这里可以添加图片上传的逻辑
  // 由于是模拟环境，我们可以使用图片的本地URL
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      if (!editUserInfo.value.lifePhotos) {
        editUserInfo.value.lifePhotos = []
      }
      editUserInfo.value.lifePhotos.push(e.target.result)
    }
  }
  reader.readAsDataURL(file.raw)
}

// 删除生活照片
const removeLifePhoto = (index: number) => {
  if (editUserInfo.value.lifePhotos && editUserInfo.value.lifePhotos.length > 0) {
    editUserInfo.value.lifePhotos.splice(index, 1)
  }
}

// 页面加载时获取数据
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="worker-resume">
    <!-- 返回按钮 -->
    <BackButton />
    
    <!-- 顶部个人信息 -->
    <div class="home-header">
      <div class="user-info">
        <div class="avatar">
          <img v-if="isEditMode ? editUserInfo.avatar : userInfo?.avatar" :src="isEditMode ? editUserInfo.avatar : userInfo?.avatar" alt="头像">
          <div v-else class="default-avatar">
            {{ userInfo?.name ? userInfo.name.charAt(0) : '用' }}
          </div>
          <template v-if="isEditMode">
            <div class="avatar-upload-overlay">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :on-change="handleAvatarUpload"
                :auto-upload="false"
              >
                <el-button size="small" type="primary">更换照片</el-button>
              </el-upload>
            </div>
          </template>
        </div>
        <div class="user-details">
          <div class="name-section">
            <h3>{{ userInfo?.name || '未登录' }}</h3>
            <span v-if="userInfo?.workType === '派遣工' || userInfo?.workType === '派遣'" class="dispatch-tag">派遣</span>
          </div>
          <p class="factory-info">
            {{ userInfo?.currentFactory || '暂无工厂信息' }}
            <span class="factory-location-info">
              {{ userInfo?.factoryArea ? userInfo.factoryArea : '暂无区域信息' }} | {{ userInfo?.productionLine ? userInfo.productionLine : '暂无生产线信息' }}
            </span>
          </p>
          <p class="position-info">{{ userInfo?.positionType || '暂无岗位类型' }} | {{ userInfo?.position || '暂无职位信息' }}</p>
        </div>
      </div>
    </div>
    
    <!-- 生活照片区域 -->
    <div class="life-photos-section">
      <h3 class="section-title">生活照片</h3>
      <template v-if="isEditMode">
        <el-upload
          class="upload-demo"
          action="#"
          :on-change="handleLifePhotoUpload"
          :auto-upload="false"
          :show-file-list="false"
          multiple
        >
          <el-button class="life-photo-upload-btn">上传生活照片</el-button>
        </el-upload>
        <p class="upload-tip">请确保生活照真实性，过度ps或非本人照片将影响面试通过率!</p>
        <div v-if="editUserInfo.lifePhotos && editUserInfo.lifePhotos.length > 0" class="life-photos-grid">
          <div v-for="(photo, index) in editUserInfo.lifePhotos" :key="index" class="life-photo-item">
            <el-image
              :src="photo"
              alt="生活照"
              :preview-src-list="editUserInfo.lifePhotos"
              fit="cover"
            >
            </el-image>
            <el-button class="life-photo-delete-btn" type="danger" size="mini" @click="removeLifePhoto(index)">删除</el-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="userInfo?.lifePhotos && userInfo.lifePhotos.length > 0" class="life-photos-grid">
          <div v-for="(photo, index) in userInfo.lifePhotos" :key="index" class="life-photo-item">
            <el-image
              :src="photo"
              alt="生活照"
              :preview-src-list="userInfo.lifePhotos"
              fit="cover"
            >
            </el-image>
          </div>
        </div>
        <div v-else class="empty-life-photos">
          <p>暂无生活照片</p>
        </div>
      </template>
    </div>
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        <h2>个人简历</h2>
      </div>
      <div class="header-right">
        <!-- 编辑模式按钮 -->
        <div v-if="!isEditMode" class="normal-mode-buttons">
          <el-button type="primary" @click="enterEditMode">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
        </div>
        <div v-else class="edit-mode-buttons">
          <el-button @click="cancelEdit">
            <el-icon><Close /></el-icon> 取消
          </el-button>
          <el-button type="primary" @click="saveEdit">
            <el-icon><Check /></el-icon> 保存
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 个人信息详情 -->
    <div class="personal-info-content">
        
        <!-- 个人基本信息 -->
        <div class="info-section">
          <h3 class="section-title">个人基本信息</h3>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">姓名</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.name" placeholder="请输入姓名"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.name || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">证件号</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.idCard" placeholder="请输入证件号"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.idCard || '暂无信息' }}</span>
              </template>
            </div>

            <div class="info-item">
              <span class="info-label">性别</span>
              <template v-if="isEditMode">
                <el-select v-model="editUserInfo.gender" placeholder="请选择性别">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.gender || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">年龄</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.age" placeholder="请输入年龄"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.age || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">出生日期</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.birthDate" placeholder="请输入出生日期"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.birthDate || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">民族</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.ethnicity" placeholder="请输入民族"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.ethnicity || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">婚姻状况</span>
              <template v-if="isEditMode">
                <el-select v-model="editUserInfo.maritalStatus" placeholder="请选择婚姻状况">
                  <el-option label="未婚" value="未婚"></el-option>
                  <el-option label="已婚" value="已婚"></el-option>
                  <el-option label="离异" value="离异"></el-option>
                  <el-option label="丧偶" value="丧偶"></el-option>
                </el-select>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.maritalStatus || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">政治面貌</span>
              <template v-if="isEditMode">
                <el-select v-model="editUserInfo.politicalStatus" placeholder="请选择政治面貌">
                  <el-option label="群众" value="群众"></el-option>
                  <el-option label="共青团员" value="共青团员"></el-option>
                  <el-option label="中共党员" value="中共党员"></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.politicalStatus || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">最高学历</span>
              <template v-if="isEditMode">
                <el-select v-model="editUserInfo.highestEducation" placeholder="请选择最高学历">
                  <el-option label="小学" value="小学"></el-option>
                  <el-option label="初中" value="初中"></el-option>
                  <el-option label="高中" value="高中"></el-option>
                  <el-option label="大专" value="大专"></el-option>
                  <el-option label="本科" value="本科"></el-option>
                  <el-option label="研究生" value="研究生"></el-option>
                </el-select>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.highestEducation || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">籍贯</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.nativePlace" placeholder="请输入籍贯"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.nativePlace || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">现居地址</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.currentAddress" placeholder="请输入现居地址" type="textarea"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.currentAddress || '暂无信息' }}</span>
              </template>
            </div>
          </div>
        </div>
        
        <!-- 教育背景 -->
        <div class="info-section">
          <h3 class="section-title">教育背景</h3>
          
          <!-- 编辑模式 -->
          <template v-if="isEditMode">
            <div v-for="(edu, index) in editUserInfo.education" :key="index" class="education-item">
              <div class="education-header">
                <el-select v-model="edu.degree" placeholder="请选择学历" style="width: 120px; margin-right: 10px;">
                  <el-option label="小学" value="小学"></el-option>
                  <el-option label="初中" value="初中"></el-option>
                  <el-option label="高中" value="高中"></el-option>
                  <el-option label="大专" value="大专"></el-option>
                  <el-option label="本科" value="本科"></el-option>
                  <el-option label="研究生" value="研究生"></el-option>
                </el-select>
                <el-input v-model="edu.graduationDate" placeholder="毕业日期" style="width: 150px;"></el-input>
                <el-button type="danger" @click="editUserInfo.education.splice(index, 1)" style="margin-left: 10px;">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
              <div class="education-details">
                <el-input v-model="edu.school" placeholder="学校名称" style="margin-bottom: 10px;"></el-input>
                <el-input v-model="edu.major" placeholder="专业" style="margin-bottom: 10px;"></el-input>
              </div>
            </div>
            <el-button type="primary" @click="addEducation" style="margin-top: 10px;">
              <el-icon><Plus /></el-icon> 添加教育经历
            </el-button>
          </template>
          
          <!-- 查看模式 -->
          <template v-else>
            <div v-for="(edu, index) in userInfo?.education" :key="index" class="education-item">
              <div class="education-header">
                <span class="education-degree">{{ edu.degree }}</span>
                <span class="education-date">{{ edu.graduationDate }}</span>
              </div>
              <div class="education-details">
                <p class="education-school">{{ edu.school }}</p>
                <p class="education-major">专业：{{ edu.major }}</p>
                <!-- 附件显示 -->
                <div v-if="edu.attachments && edu.attachments.length > 0" class="education-attachments-view">
                  <h4 class="attachment-title">附件</h4>
                  <div class="attachment-list">
                    <div v-for="(attachment, attIndex) in edu.attachments" :key="attIndex" class="attachment-item">
                      <a href="#" class="attachment-link">{{ attachment.name || attachment.fileName }}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!userInfo?.education || userInfo.education.length === 0" class="empty-education">
              暂无教育背景信息
            </div>
          </template>
        </div>
        
        <!-- 求职意向 -->
        <div class="info-section">
          <h3 class="section-title">求职意向</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">岗位类别</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.jobIntent.positionCategory" placeholder="请输入岗位类别"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.jobIntent?.positionCategory || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">岗位意向</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.jobIntent.positionPreference" placeholder="请输入岗位意向"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.jobIntent?.positionPreference || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">薪资期望</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.jobIntent.salaryExpectation" placeholder="请输入薪资期望"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.jobIntent?.salaryExpectation || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">工作地点</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.jobIntent.workLocation" placeholder="请输入工作地点"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.jobIntent?.workLocation || '暂无信息' }}</span>
              </template>
            </div>
          </div>
        </div>
        
        <!-- 紧急联系方式 -->
        <!-- <div class="info-section">
          <h3 class="section-title">紧急联系方式</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">紧急联系人</span>
              <span class="info-value">{{ userInfo?.emergencyContact || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">紧急联系电话</span>
              <span class="info-value">{{ userInfo?.emergencyPhone || '暂无信息' }}</span>
            </div>
          </div>
        </div> -->
        
        <!-- 技能与证书 -->
        <div class="info-section">
          <h3 class="section-title">技能与证书</h3>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="info-label">技能特长</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.skills" placeholder="请输入技能特长" type="textarea"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.skills || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item full-width">
              <span class="info-label">持有证书</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.certificates" placeholder="请输入持有证书" type="textarea"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.certificates || '暂无信息' }}</span>
              </template>
            </div>
          </div>
          <!-- 证书附件 -->
          <div v-if="userInfo?.certificateAttachments" class="certificate-attachments">
            <h4 class="attachment-title">证书附件</h4>
            <div class="attachment-list">
              <div v-for="(attachment, index) in userInfo.certificateAttachments" :key="index" class="attachment-item">
                <a href="#" class="attachment-link">{{ attachment.name }}</a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 特殊情况与健康状况 -->
        <div class="info-section">
          <h3 class="section-title">特殊情况与健康状况</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">健康状况</span>
              <template v-if="isEditMode">
                <el-select v-model="editUserInfo.healthStatus" placeholder="请选择健康状况">
                  <el-option label="健康" value="健康"></el-option>
                  <el-option label="一般" value="一般"></el-option>
                  <el-option label="较差" value="较差"></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.healthStatus || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">身高</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.height" placeholder="请输入身高"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.height || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">体重</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.weight" placeholder="请输入体重"></el-input>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.weight || '暂无信息' }}</span>
              </template>
            </div>
          </div>
          <div class="special-note">
            <template v-if="isEditMode">
              <el-input v-model="editUserInfo.specialNotes" placeholder="请输入特殊情况说明" type="textarea"></el-input>
            </template>
            <template v-else>
              {{ userInfo?.specialNotes || '暂无特殊情况说明' }}
            </template>
            <div v-if="userInfo?.specialNoteAttachments && userInfo.specialNoteAttachments.length > 0" class="special-note-attachments">
              <h4 class="attachment-title">特殊情况附件</h4>
              <div class="attachment-list">
                <div v-for="(attachment, index) in userInfo.specialNoteAttachments" :key="index" class="attachment-item">
                  <a href="#" class="attachment-link">{{ attachment.name }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 个人经历 -->
        <div class="info-section">
          <h3 class="section-title">个人经历</h3>
          <template v-if="isEditMode">
            <el-input v-model="editUserInfo.personalExperience" placeholder="请输入个人经历" type="textarea" style="margin-bottom: 15px;"></el-input>
            <div class="work-experience-info">
              <span class="info-label">是否在工厂工作过：</span>
              <el-select v-model="editUserInfo.hasFactoryExperience" placeholder="请选择" style="width: 120px; margin-left: 10px;">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </div>
            
            <!-- 工厂名称输入 -->
            <div v-if="editUserInfo.hasFactoryExperience === '是'" class="factory-name-info" style="margin-top: 15px;">
              <span class="info-label">工厂名称：</span>
              <el-input v-model="editUserInfo.factoryName" placeholder="请输入工厂名称，多个用逗号分隔" style="margin-top: 10px;"></el-input>
            </div>
            
            <!-- 备注信息输入 -->
            <div v-if="editUserInfo.hasFactoryExperience === '是'" class="factory-note-info" style="margin-top: 15px;">
              <span class="info-label">备注：</span>
              <el-input v-model="editUserInfo.factoryNote" placeholder="请输入备注信息" type="textarea" style="margin-top: 10px;"></el-input>
            </div>
          </template>
          <template v-else>
            <div class="experience-item">
              {{ userInfo?.personalExperience || '暂无信息' }}
            </div>
            <div class="work-experience-info">
              <span class="info-label">是否在工厂工作过：</span>
              <span class="info-value">{{ userInfo?.hasFactoryExperience || '是' }}</span>
            </div>
            
            <!-- 工厂名称显示 -->
            <div v-if="userInfo?.hasFactoryExperience === '是' && userInfo?.factoryName" class="factory-name-info">
              <span class="info-label">工厂名称：</span>
              <div class="factory-name-list">
                <el-tag 
                  v-for="(factory, index) in userInfo.factoryName.split(',')" 
                  :key="index"
                  type="info"
                  size="small"
                >
                  {{ factory.trim() }}
                </el-tag>
              </div>
            </div>
            
            <!-- 备注信息显示 -->
            <div v-if="userInfo?.hasFactoryExperience === '是' && userInfo?.factoryNote" class="factory-note-info">
              <span class="info-label">备注：</span>
              <span class="info-value">{{ userInfo.factoryNote }}</span>
            </div>
          </template>
        </div>
        
        <!-- 工作履历 -->
        <!-- <div class="info-section">
          <h3 class="section-title">工作履历</h3>
          <div v-for="(history, index) in userInfo?.workHistory" :key="index" class="work-history-item">
            <div class="work-period">
              {{ history.startDate }} - {{ history.endDate }}
            </div>
            <div class="work-details">
              <p>入职劳务公司: {{ history.laborCompany }}</p>
              <p>入职工厂: {{ history.factory }}</p>
              <p>岗位: {{ history.position }}</p>
              <div class="reward-punishment">
                <h4>劳务公司奖惩记录:</h4>
                <p>奖励: <span class="reward">{{ history.laborCompanyRewards }}</span>
                   处罚: <span class="punishment">{{ history.laborCompanyPunishments }}</span></p>
              </div>
              <div class="reward-punishment">
                <h4>工厂奖惩记录:</h4>
                <p>奖励: <span class="reward">{{ history.factoryRewards }}</span>
                   处罚: <span class="punishment">{{ history.factoryPunishments }}</span></p>
              </div>
              <div class="attendance-record">
                考勤记录: <span class="attendance-status">{{ history.attendanceRecords }}</span>
              </div>
            </div>
          </div>
          <div v-if="!userInfo?.workHistory || userInfo.workHistory.length === 0" class="empty-history">
            暂无工作履历信息
          </div>
        </div> -->
      </div>
  </div>
</template>

<style scoped>
.worker-resume {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部个人信息卡片样式 */
.home-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #fff;
  padding: 30px 20px;
  margin-bottom: 20px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  height: 220px;
}

.home-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-20px, -20px) rotate(5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.avatar {
  width: 100px;
  height: 130px;
  margin-right: 24px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;
}

.avatar:hover {
  transform: scale(1.03);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease;
  border-radius: 6px;
}

.avatar-uploader {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader .el-button {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transition: all 0.3s ease;
}

.avatar-uploader .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.5);
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
}

.life-photos-upload {
  margin-bottom: 20px;
}

.upload-tip {
  margin: 10px 0 20px 0;
  font-size: 12px;
  color: #ff4d4f;
  line-height: 1.4;
}

.life-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.life-photo-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.life-photo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.life-photo-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.life-photo-item .el-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0;
  border-radius: 0;
  font-size: 10px;
  padding: 4px;
}

.empty-life-photos {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  color: #4f46e5;
  background-color: white;
  border: 1px solid #eaeaea;
}

.user-details {
  flex: 1;
  padding-top: 8px;
}

.name-section {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.name-section h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.dispatch-tag {
  background-color: #ff4d4f;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
}

.factory-info {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: bold;
  opacity: 1;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.factory-location-info {
  font-size: 14px;
  font-weight: normal;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
  letter-spacing: 0.3px;
}

.position-info {
  margin: 0 0 6px 0;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
}

.life-photos-section {
  background-color: #fff;
  margin: 15px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.life-photos-section .section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.life-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.life-photo-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.life-photo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.life-photo-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.empty-life-photos {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.page-header .header-left {
  flex: 1;
  min-width: 0;
}

.page-header .header-right {
  flex-shrink: 0;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.edit-mode-buttons {
  display: flex;
  flex-direction: row !important;
  gap: 10px;
  align-items: center;
  margin: 0;
  padding: 0;
  width: auto;
  flex-wrap: nowrap;
}

.personal-info-content {
  background-color: #fff;
  margin: 15px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 教育背景样式 */
.education-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #4f46e5;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.education-degree {
  font-size: 16px;
  font-weight: bold;
  color: #4f46e5;
}

.education-date {
  font-size: 14px;
  color: #666;
}

.education-details {
  margin-top: 10px;
}

.education-school {
  font-size: 15px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #333;
}

.education-major {
  font-size: 14px;
  margin: 0 0 10px 0;
  color: #666;
}

.education-attachments-view {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eaeaea;
}

.attachment-title {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #333;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.attachment-item {
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 13px;
}

.attachment-link {
  color: #4f46e5;
  text-decoration: none;
}

.attachment-link:hover {
  text-decoration: underline;
}

.empty-education {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

/* 工作履历样式 */
.work-history-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #7c3aed;
}

.work-period {
  font-size: 16px;
  font-weight: bold;
  color: #7c3aed;
  margin-bottom: 10px;
}

.work-details {
  margin-top: 10px;
}

.work-details p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.reward-punishment {
  margin: 10px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 6px;
}

.reward-punishment h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.reward-punishment p {
  margin: 0;
  font-size: 13px;
}

.reward {
  color: #52c41a;
  font-weight: 500;
}

.punishment {
  color: #ff4d4f;
  font-weight: 500;
}

.attendance-record {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.attendance-status {
  font-weight: 500;
  color: #1890ff;
}

.attendance-detail-link {
  color: #4f46e5;
  text-decoration: none;
  margin-left: 10px;
  font-size: 13px;
}

.attendance-detail-link:hover {
  text-decoration: underline;
}

.empty-history {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

/* 个人经历样式 */
.experience-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.work-experience-info {
  margin: 15px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 6px;
}

.factory-name-info {
  margin: 15px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 6px;
}

.factory-name-list {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.factory-note-info {
  margin: 15px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 6px;
}

.factory-note-info .info-value {
  line-height: 1.5;
}

.input-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.special-note {
  margin-top: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  line-height: 1.5;
}

.special-note-attachments {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eaeaea;
}

.certificate-attachments {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eaeaea;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-header {
    padding: 20px 15px;
    height: auto;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .avatar {
    width: 80px;
    height: 100px;
    margin-right: 0;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .life-photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .life-photo-item img {
    height: 100px;
  }
  
  .personal-info-content {
    margin: 10px;
    padding: 15px;
  }
  
  .life-photos-section {
    margin: 10px;
    padding: 15px;
  }
}
</style>