<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElIcon, ElImage } from 'element-plus'
import BackButton from '../../components/BackButton.vue'
import { Timer, SwitchButton, Grid, Warning, ChatLineSquare, Money, Share, Flag, Promotion, Document, Present, User, ZoomIn } from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref(null)
const loading = ref(true)
const showPersonalInfo = ref(false)
const isEditMode = ref(false)
const editUserInfo = ref({})
const originalUserInfo = ref({})
const factoryNameInput = ref('')

// 计算属性：判断当前用户是否是工人
const isWorker = computed(() => {
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    const user = JSON.parse(storedUserInfo)
    return user.role === 'worker'
  }
  return true // 默认视为工人
})

// 计算属性：判断是否显示工作履历
const showWorkHistory = computed(() => {
  return !isWorker.value
})

// 功能菜单
const menuItems = [
  {
    id: 2,
    title: '考勤请假',
    icon: Timer,
    path: '/worker/attendance'
  },
  {
    id: 4,
    title: '离职申请',
    icon: SwitchButton,
    path: '/worker/resignation'
  },
  {
    id: 5,
    title: '调岗申请',
    icon: Grid,
    path: '/worker/transfer'
  },
  {
    id: 15,
    title: '我的奖惩',
    icon: Document,
    path: '/worker/reward-punishment'
  },
  {
    id: 16,
    title: '生活费申请',
    icon: Money,
    path: '/worker/living-expense'
  },
  {
    id: 6,
    title: '特殊情况',
    icon: Warning,
    path: '/worker/special-cases'
  },
  {
    id: 7,
    title: '投诉/建议',
    icon: ChatLineSquare,
    path: '/worker/complaint-suggestion'
  },
  {
    id: 8,
    title: '工资条',
    icon: Money,
    path: '/worker/salary'
  },
  {
    id: 9,
    title: '文娱活动',
    icon: Share,
    path: '/worker/entertainment'
  },
  {
    id: 10,
    title: '我的社团',
    icon: Flag,
    path: '/worker/community'
  },
  {
    id: 11,
    title: '工作转介绍',
    icon: Promotion,
    path: '/worker/referral'
  },
  {
    id: 12,
    title: '个人简历',
    icon: Document,
    path: '/worker/resume'
  },
  {
    id: 13,
    title: '版本信息',
    icon: Present,
    path: '/worker/about'
  }
]

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

// 跳转到功能页面
const goToFunction = (menuItem: any) => {
  if (menuItem.id === 1) {
    // 个人信息菜单项，显示个人信息详情
    showPersonalInfo.value = true
  } else if (menuItem.path !== '/worker/profile') {
    router.push(menuItem.path)
  } else {
    ElMessage.info('该功能暂未开放，敬请期待')
  }
}

// 返回个人中心
const goBack = () => {
  showPersonalInfo.value = false
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 查看考勤明细
const viewAttendanceDetail = (index: number) => {
  // 跳转到考勤页面
  router.push('/worker/attendance')
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

// 添加教育背景
const addEducation = () => {
  if (!editUserInfo.value.education) {
    editUserInfo.value.education = []
  }
  editUserInfo.value.education.push({
    degree: '',
    school: '',
    major: '',
    graduationDate: '',
    attachments: []
  })
}

// 删除教育背景
const deleteEducation = (index: number) => {
  if (editUserInfo.value.education && editUserInfo.value.education.length > 0) {
    editUserInfo.value.education.splice(index, 1)
  }
}

// 添加证书附件
const addCertificateAttachment = () => {
  if (!editUserInfo.value.certificateAttachments) {
    editUserInfo.value.certificateAttachments = []
  }
  editUserInfo.value.certificateAttachments.push({
    name: '',
    fileName: ''
  })
  updateCertificatesField()
}

// 删除证书附件
const deleteCertificateAttachment = (index: number) => {
  if (editUserInfo.value.certificateAttachments && editUserInfo.value.certificateAttachments.length > 0) {
    editUserInfo.value.certificateAttachments.splice(index, 1)
    updateCertificatesField()
  }
}

// 更新持有证书字段
const updateCertificatesField = () => {
  if (editUserInfo.value.certificateAttachments && editUserInfo.value.certificateAttachments.length > 0) {
    const certificateNames = editUserInfo.value.certificateAttachments
      .filter(attachment => attachment.name && attachment.name.trim())
      .map(attachment => attachment.name.trim())
    editUserInfo.value.certificates = certificateNames.join('、')
  } else {
    editUserInfo.value.certificates = ''
  }
}

// 添加特殊情况附件
const addSpecialNoteAttachment = () => {
  if (!editUserInfo.value.specialNoteAttachments) {
    editUserInfo.value.specialNoteAttachments = []
  }
  editUserInfo.value.specialNoteAttachments.push({
    name: '',
    fileName: ''
  })
}

// 删除特殊情况附件
const deleteSpecialNoteAttachment = (index: number) => {
  if (editUserInfo.value.specialNoteAttachments && editUserInfo.value.specialNoteAttachments.length > 0) {
    editUserInfo.value.specialNoteAttachments.splice(index, 1)
  }
}

// 处理文件上传
const handleFileUpload = (file: any, type: string, index: number, eduIndex?: number) => {
  if (type === 'certificate') {
    if (editUserInfo.value.certificateAttachments && editUserInfo.value.certificateAttachments[index]) {
      editUserInfo.value.certificateAttachments[index].fileName = file.name
    }
  } else if (type === 'specialNote') {
    if (editUserInfo.value.specialNoteAttachments && editUserInfo.value.specialNoteAttachments[index]) {
      editUserInfo.value.specialNoteAttachments[index].fileName = file.name
    }
  } else if (type === 'education' && eduIndex !== undefined) {
    if (editUserInfo.value.education && editUserInfo.value.education[eduIndex]) {
      if (!editUserInfo.value.education[eduIndex].attachments) {
        editUserInfo.value.education[eduIndex].attachments = []
      }
      editUserInfo.value.education[eduIndex].attachments.push({
        name: file.name,
        fileName: file.name
      })
    }
  }
}

// 添加教育背景附件
const addEducationAttachment = (eduIndex: number) => {
  if (editUserInfo.value.education && editUserInfo.value.education[eduIndex]) {
    if (!editUserInfo.value.education[eduIndex].attachments) {
      editUserInfo.value.education[eduIndex].attachments = []
    }
    editUserInfo.value.education[eduIndex].attachments.push({
      name: '',
      fileName: ''
    })
  }
}

// 删除教育背景附件
const deleteEducationAttachment = (eduIndex: number, attachmentIndex: number) => {
  if (editUserInfo.value.education && editUserInfo.value.education[eduIndex] && editUserInfo.value.education[eduIndex].attachments) {
    editUserInfo.value.education[eduIndex].attachments.splice(attachmentIndex, 1)
  }
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

// 模拟工厂名称数据
const factoryList = [
  '富士康科技集团',
  '华为技术有限公司',
  '比亚迪股份有限公司',
  '长城科技股份有限公司',
  '联想集团',
  '华硕电脑股份有限公司',
  '宏碁股份有限公司',
  '广达电脑股份有限公司',
  '仁宝电脑工业股份有限公司',
  '纬创资通股份有限公司',
  '英业达股份有限公司',
  '和硕联合科技股份有限公司',
  '台积电',
  '三星电子',
  '英特尔公司',
  '苹果公司',
  '微软公司',
  '谷歌公司',
  '亚马逊公司',
  '特斯拉公司'
]

// 工厂名称模糊查询
const queryFactory = (queryString: string, callback: any) => {
  const results = queryString
    ? factoryList.filter(factory => factory.toLowerCase().includes(queryString.toLowerCase()))
    : []
  
  // 转换为autocomplete组件需要的格式
  const suggestions = results.map(factory => ({
    value: factory
  }))
  
  callback(suggestions)
}

// 处理工厂工作经历选择变化
const handleFactoryExperienceChange = (value: string) => {
  console.log('工厂工作经历选择变化:', value)
  if (value === '否') {
    // 选择"否"时清空工厂名称和备注信息
    editUserInfo.value.factoryName = ''
    editUserInfo.value.factoryNote = ''
    console.log('清空工厂名称和备注信息')
  }
  console.log('editUserInfo:', editUserInfo.value)
}

// 添加工厂名称
const addFactoryName = (value) => {
  if (!value || !value.trim()) return
  
  const currentFactories = editUserInfo.value.factoryName ? editUserInfo.value.factoryName.split(',').map(f => f.trim()).filter(f => f) : []
  if (!currentFactories.includes(value.trim())) {
    currentFactories.push(value.trim())
    editUserInfo.value.factoryName = currentFactories.join(', ')
  }
  factoryNameInput.value = ''
}

// 删除工厂名称
const removeFactoryName = (index) => {
  const currentFactories = editUserInfo.value.factoryName.split(',').map(f => f.trim()).filter(f => f)
  currentFactories.splice(index, 1)
  editUserInfo.value.factoryName = currentFactories.join(', ')
}

// 跳转到劳务公司介绍页面
const goToLaborCompanyIntro = () => {
  router.push('/worker/labor-company-intro')
}

// 跳转到扫一扫页面
const goToScanner = () => {
  router.push('/scanner')
}

// 页面加载时获取数据
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="worker-profile">
    <!-- 个人信息详情页面 -->
    <div v-if="showPersonalInfo" class="personal-info-page">
      <!-- 返回按钮 -->
      <BackButton />
      
      <!-- 顶部个人信息 -->
      <div class="home-header">
        <div class="header-content">
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
              <p class="labor-company" @click="goToLaborCompanyIntro">
                {{ userInfo?.currentLaborCompany || '暂无劳务公司信息' }}
                <i class="el-icon-arrow-right"></i>
              </p>
            </div>
          </div>
          <div class="header-actions">
            <div class="scan-button" @click="goToScanner">
              <el-icon class="scan-icon"><ZoomIn /></el-icon>
              <span>扫一扫</span>
            </div>
          </div>
        </div>
      </div>
    
    <!-- 生活照片区域 -->
    <div class="life-photos-section">
      <h3 class="section-title">生活照片</h3>
      <template v-if="isEditMode">
        <div class="life-photos-upload">
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleLifePhotoUpload"
            :auto-upload="false"
            :show-file-list="false"
            multiple
          >
            <el-button size="small" type="primary">上传生活照片</el-button>
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
              <el-button type="danger" size="mini" @click="removeLifePhoto(index)">删除</el-button>
            </div>
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
        <i class="el-icon-arrow-left"></i>
        <h2>个人信息</h2>
      </div>
      <!-- 编辑按钮 -->
      <div class="header-right">
        <template v-if="!isEditMode">
          <el-button type="primary" @click="enterEditMode">编辑</el-button>
        </template>
        <template v-else>
          <div class="edit-mode-buttons">
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="saveEdit">保存</el-button>
          </div>
        </template>
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
                <el-input v-model="editUserInfo.name" placeholder="请输入姓名" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.name || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">证件号</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.idCard" placeholder="请输入证件号" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.idCard || '暂无信息' }}</span>
              </template>
            </div>

            <div class="info-item">
              <span class="info-label">性别</span>
              <template v-if="isEditMode">
                <el-select v-model="editUserInfo.gender" placeholder="请选择性别">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.gender || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">年龄</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.age" type="number" placeholder="请输入年龄" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.age || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">出生日期</span>
              <template v-if="isEditMode">
                <el-date-picker v-model="editUserInfo.birthDate" type="date" placeholder="请选择出生日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.birthDate || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">民族</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.ethnicity" placeholder="请输入民族" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.ethnicity || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">婚姻状况</span>
              <template v-if="isEditMode">
                <el-select v-model="editUserInfo.maritalStatus" placeholder="请选择婚姻状况">
                  <el-option label="未婚" value="未婚" />
                  <el-option label="已婚" value="已婚" />
                  <el-option label="离异" value="离异" />
                  <el-option label="丧偶" value="丧偶" />
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
                  <el-option label="群众" value="群众" />
                  <el-option label="共青团员" value="共青团员" />
                  <el-option label="中共党员" value="中共党员" />
                  <el-option label="其他" value="其他" />
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
                  <el-option label="本科及以上" value="本科及以上" />
                  <el-option label="本科" value="本科" />
                  <el-option label="大专" value="大专" />
                  <el-option label="高中" value="高中" />
                  <el-option label="高中及以下" value="高中及以下" />
                  <el-option label="无" value="无" />
                </el-select>
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.highestEducation || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">籍贯</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.nativePlace" placeholder="请输入籍贯" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.nativePlace || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">现居地址</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.currentAddress" placeholder="请输入现居地址" />
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
          <template v-if="isEditMode">
            <div v-for="(edu, index) in editUserInfo.education" :key="index" class="education-item">
              <div class="education-edit-header">
                <el-button type="danger" size="small" @click="deleteEducation(index)">删除</el-button>
              </div>
              <div class="education-edit-content">
                <el-form :model="edu" label-width="80px">
                  <el-form-item label="学历">
                    <el-select v-model="edu.degree" placeholder="请选择学历">
                      <el-option label="本科及以上" value="本科及以上" />
                      <el-option label="本科" value="本科" />
                      <el-option label="大专" value="大专" />
                      <el-option label="高中" value="高中" />
                      <el-option label="高中及以下" value="高中及以下" />
                      <el-option label="无" value="无" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="学校">
                    <el-input v-model="edu.school" placeholder="请输入学校" />
                  </el-form-item>
                  <el-form-item label="专业">
                    <el-input v-model="edu.major" placeholder="请输入专业" />
                  </el-form-item>
                  <el-form-item label="毕业日期">
                    <el-date-picker v-model="edu.graduationDate" type="month" placeholder="请选择毕业日期" format="YYYY-MM" value-format="YYYY-MM" />
                  </el-form-item>
                </el-form>
                
                <!-- 附件上传 (大专、本科、本科以上时显示) -->
                <div v-if="['大专', '本科', '本科及以上'].includes(edu.degree)" class="education-attachments">
                  <div class="attachment-header">
                    <h4 class="attachment-title">附件</h4>
                    <el-button type="primary" size="small" @click="addEducationAttachment(index)">添加附件</el-button>
                  </div>
                  <div class="attachment-list">
                    <div v-for="(attachment, attIndex) in edu.attachments" :key="attIndex" class="attachment-item">
                      <el-form :model="attachment" label-width="60px">
                        <el-form-item label="名称">
                          <el-input v-model="attachment.name" placeholder="请输入附件名称" />
                        </el-form-item>
                        <el-form-item label="文件">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :on-change="(file) => handleFileUpload(file, 'education', attIndex, index)"
                            :auto-upload="false"
                            :show-file-list="false"
                          >
                            <el-button size="small" type="primary">选择文件</el-button>
                            <span v-if="attachment.fileName">{{ attachment.fileName }}</span>
                          </el-upload>
                        </el-form-item>
                        <el-button type="danger" size="small" @click="deleteEducationAttachment(index, attIndex)">删除</el-button>
                      </el-form>
                    </div>
                    <div v-if="!edu.attachments || edu.attachments.length === 0" class="empty-attachments">
                      暂无附件
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-button type="primary" plain @click="addEducation">添加教育背景</el-button>
            <div v-if="!editUserInfo.education || editUserInfo.education.length === 0" class="empty-education">
              暂无教育背景信息
            </div>
          </template>
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
        
        <!-- 当前工作情况 -->
        <div class="info-section">
          <h3 class="section-title">当前工作情况</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">工厂分区</span>
              <span class="info-value">{{ userInfo?.workInfo?.factorySection || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">工厂区/线</span>
              <span class="info-value">{{ userInfo?.factoryLine || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">组别</span>
              <span class="info-value">{{ userInfo?.workInfo?.group || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">工作类型</span>
              <span class="info-value">{{ userInfo?.workType || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">岗位类型</span>
              <span class="info-value">{{ userInfo?.positionType || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">岗位名称</span>
              <span class="info-value">{{ userInfo?.workInfo?.position || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">岗位领导</span>
              <span class="info-value">{{ userInfo?.workInfo?.supervisor || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">入职日期</span>
              <span class="info-value">{{ userInfo?.workInfo?.entryDate || '暂无信息' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">结算方式</span>
              <span class="info-value">{{ userInfo?.workInfo?.paymentMethod || '暂无信息' }}</span>
            </div>
          </div>
          <!-- 合同附件 -->
          <div v-if="userInfo?.workInfo?.contractAttachment" class="contract-attachment">
            <span class="info-label">合同附件</span>
            <a :href="userInfo.workInfo.contractAttachment" target="_blank" class="attachment-link">查看合同</a>
          </div>
        </div>
        
        <!-- 求职意向 -->
        <div class="info-section">
          <h3 class="section-title">求职意向</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">岗位类别</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.jobIntent.positionCategory" placeholder="请输入岗位类别" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.jobIntent?.positionCategory || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">岗位意向</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.jobIntent.positionPreference" placeholder="请输入岗位意向" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.jobIntent?.positionPreference || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">薪资期望</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.jobIntent.salaryExpectation" placeholder="请输入薪资期望" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.jobIntent?.salaryExpectation || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">工作地点</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.jobIntent.workLocation" placeholder="请输入工作地点" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.jobIntent?.workLocation || '暂无信息' }}</span>
              </template>
            </div>
          </div>
        </div>
        
        <!-- 紧急联系方式 -->
        <div class="info-section">
          <h3 class="section-title">紧急联系方式</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">紧急联系人</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.emergencyContact" placeholder="请输入紧急联系人" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.emergencyContact || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">紧急联系电话</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.emergencyPhone" placeholder="请输入紧急联系电话" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.emergencyPhone || '暂无信息' }}</span>
              </template>
            </div>
          </div>
        </div>
        
        <!-- 工资发放银行卡信息 -->
        <div class="info-section">
          <h3 class="section-title">工资发放银行卡信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">账户名</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.accountName" placeholder="请输入账户名" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.accountName || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">银行卡号</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.bankCard" placeholder="请输入银行卡号" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.bankCard || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">银行名称</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.bankType" placeholder="请输入银行名称" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.bankType || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">银行网点名称</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.bankName" placeholder="请输入银行网点名称" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.bankName || '暂无信息' }}</span>
              </template>
            </div>
          </div>
        </div>
        
        <!-- 技能与证书 -->
        <div class="info-section">
          <h3 class="section-title">技能与证书</h3>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="info-label">技能特长</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.skills" placeholder="请输入技能特长" type="textarea" rows="3" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.skills || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item full-width">
              <span class="info-label">持有证书</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.certificates" placeholder="请输入持有证书" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.certificates || '暂无信息' }}</span>
              </template>
            </div>
          </div>
          <!-- 证书附件 -->
          <template v-if="isEditMode">
            <div class="certificate-attachments">
              <div class="attachment-header">
                <h4 class="attachment-title">证书附件</h4>
                <el-button type="primary" size="small" @click="addCertificateAttachment">添加附件</el-button>
              </div>
              <div class="attachment-list">
                <div v-for="(attachment, index) in editUserInfo.certificateAttachments" :key="index" class="attachment-item">
                  <el-form :model="attachment" label-width="60px">
                    <el-form-item label="名称">
                      <el-input v-model="attachment.name" placeholder="请输入证书名称" @input="updateCertificatesField" />
                    </el-form-item>
                    <el-form-item label="文件">
                      <el-upload
                        class="upload-demo"
                        action="#"
                        :on-change="(file) => handleFileUpload(file, 'certificate', index)"
                        :auto-upload="false"
                        :show-file-list="false"
                      >
                        <el-button size="small" type="primary">选择文件</el-button>
                        <span v-if="attachment.fileName">{{ attachment.fileName }}</span>
                      </el-upload>
                    </el-form-item>
                    <el-button type="danger" size="small" @click="deleteCertificateAttachment(index)">删除</el-button>
                  </el-form>
                </div>
                <div v-if="!editUserInfo.certificateAttachments || editUserInfo.certificateAttachments.length === 0" class="empty-attachments">
                  暂无证书附件
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div v-if="userInfo?.certificateAttachments" class="certificate-attachments">
              <h4 class="attachment-title">证书附件</h4>
              <div class="attachment-list">
                <div v-for="(attachment, index) in userInfo.certificateAttachments" :key="index" class="attachment-item">
                  <a href="#" class="attachment-link">{{ attachment.name }}</a>
                </div>
              </div>
            </div>
          </template>
        </div>
        
        <!-- 特殊情况与健康状况 -->
        <div class="info-section">
          <h3 class="section-title">特殊情况与健康状况</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">健康状况</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.healthStatus" placeholder="请输入健康状况" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.healthStatus || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">身高</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.height" placeholder="请输入身高" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.height || '暂无信息' }}</span>
              </template>
            </div>
            <div class="info-item">
              <span class="info-label">体重</span>
              <template v-if="isEditMode">
                <el-input v-model="editUserInfo.weight" placeholder="请输入体重" />
              </template>
              <template v-else>
                <span class="info-value">{{ userInfo?.weight || '暂无信息' }}</span>
              </template>
            </div>
          </div>
          <div class="special-note">
            <template v-if="isEditMode">
              <el-input v-model="editUserInfo.specialNotes" placeholder="请输入特殊情况说明" type="textarea" rows="3" />
              <div class="special-note-attachments">
                <div class="attachment-header">
                  <h4 class="attachment-title">特殊情况附件</h4>
                  <el-button type="primary" size="small" @click="addSpecialNoteAttachment">添加附件</el-button>
                </div>
                <div class="attachment-list">
                  <div v-for="(attachment, index) in editUserInfo.specialNoteAttachments" :key="index" class="attachment-item">
                    <el-form :model="attachment" label-width="60px">
                      <el-form-item label="名称">
                        <el-input v-model="attachment.name" placeholder="请输入附件名称" />
                      </el-form-item>
                      <el-form-item label="文件">
                        <el-upload
                          class="upload-demo"
                          action="#"
                          :on-change="(file) => handleFileUpload(file, 'specialNote', index)"
                          :auto-upload="false"
                          :show-file-list="false"
                        >
                          <el-button size="small" type="primary">选择文件</el-button>
                          <span v-if="attachment.fileName">{{ attachment.fileName }}</span>
                        </el-upload>
                      </el-form-item>
                      <el-button type="danger" size="small" @click="deleteSpecialNoteAttachment(index)">删除</el-button>
                    </el-form>
                  </div>
                  <div v-if="!editUserInfo.specialNoteAttachments || editUserInfo.specialNoteAttachments.length === 0" class="empty-attachments">
                    暂无特殊情况附件
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              {{ userInfo?.specialNotes || '暂无特殊情况说明' }}
              <div v-if="userInfo?.specialNoteAttachments && userInfo.specialNoteAttachments.length > 0" class="special-note-attachments">
                <h4 class="attachment-title">特殊情况附件</h4>
                <div class="attachment-list">
                  <div v-for="(attachment, index) in userInfo.specialNoteAttachments" :key="index" class="attachment-item">
                    <a href="#" class="attachment-link">{{ attachment.name }}</a>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <!-- 个人经历 -->
        <div class="info-section">
          <h3 class="section-title">个人经历</h3>
          <template v-if="isEditMode">
            <div class="experience-edit">
              <el-input v-model="editUserInfo.personalExperience" placeholder="请输入个人经历" type="textarea" rows="4" />
            </div>
            <div class="work-experience-info">
              <span class="info-label">是否在工厂工作过：</span>
              <el-select v-model="editUserInfo.hasFactoryExperience" placeholder="请选择" @change="handleFactoryExperienceChange">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </div>
            
            <!-- 工厂名称选择 -->
            <div v-if="editUserInfo.hasFactoryExperience === '是'" class="factory-name-info">
              <span class="info-label">工厂名称：</span>
              <div class="factory-name-input">
                <el-autocomplete
                  v-model="factoryNameInput"
                  :fetch-suggestions="queryFactory"
                  placeholder="请输入或选择工厂名称"
                  :trigger-on-focus="false"
                  clearable
                  @select="addFactoryName"
                />
                <el-button type="primary" size="small" @click="addFactoryName(factoryNameInput)">添加</el-button>
              </div>
              <div class="factory-name-list" v-if="editUserInfo.factoryName">
                <el-tag 
                  v-for="(factory, index) in editUserInfo.factoryName.split(',')" 
                  :key="index"
                  type="info"
                  size="small"
                  closable
                  @close="removeFactoryName(index)"
                >
                  {{ factory.trim() }}
                </el-tag>
              </div>
              <p class="input-hint">提示：可以输入多个工厂名称，每个工厂名称后点击添加按钮</p>
            </div>
            
            <!-- 备注信息 -->
            <div v-if="editUserInfo.hasFactoryExperience === '是'" class="factory-note-info">
              <span class="info-label">备注：</span>
              <el-input
                v-model="editUserInfo.factoryNote"
                placeholder="请输入备注信息"
                type="textarea"
                rows="2"
              />
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
        <div v-if="showWorkHistory" class="info-section">
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
                <a href="#" class="attendance-detail-link" @click.prevent="viewAttendanceDetail(index)">查看明细</a>
              </div>
            </div>
          </div>
          <div v-if="!userInfo?.workHistory || userInfo.workHistory.length === 0" class="empty-history">
            暂无工作履历信息
          </div>
        </div>
      </div>
    </div>
    
    <!-- 个人中心页面 -->
    <div v-else class="personal-center-page">
      <!-- 顶部个人信息 -->
      <div class="home-header">
        <div class="header-content">
          <div class="user-info">
            <div class="avatar">
              <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="头像">
              <div v-else class="default-avatar">
                {{ userInfo?.name ? userInfo.name.charAt(0) : '用' }}
              </div>
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
          <div class="header-actions">
            <div class="scan-button" @click="goToScanner">
              <el-icon class="scan-icon"><ZoomIn /></el-icon>
              <span>扫一扫</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 个人信息入口 -->
      <div class="function-menu">
        <div class="menu-section">
          <div class="menu-item" @click="goToFunction({ id: 1, title: '个人信息', icon: User, path: '/worker/profile' })">
            <div class="menu-icon">
              <el-icon :size="18">
                <User />
              </el-icon>
            </div>
            <span class="menu-title">个人信息</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      
      <!-- 功能菜单 -->
      <div class="function-menu">
        <div class="menu-section">
          <div v-for="menuItem in menuItems" :key="menuItem.id" class="menu-item" @click="goToFunction(menuItem)">
            <div class="menu-icon">
              <el-icon :size="18">
                <component :is="menuItem.icon" />
              </el-icon>
            </div>
            <span class="menu-title">{{ menuItem.title }}</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      
      <!-- 退出登录按钮 -->
      <div class="logout-section">
        <el-button type="danger" @click="handleLogout">退出登录</el-button>
      </div>
      
      <!-- 版本信息 -->
      <div class="version-info">
        <p>蓝领智汇 v1.0.0</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-profile {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部个人信息卡片样式 - 与首页保持一致 */
.home-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #fff;
  padding: 16px;
  border-radius: 0 0 24px 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  height: auto;
  min-height: 140px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.scan-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.scan-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.scan-icon {
  font-size: 20px;
  margin-bottom: 4px;
  color: #fff;
}

.scan-button span {
  font-size: 11px;
  font-weight: 500;
  color: #fff;
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
  gap: 16px;
  flex: 1;
}

.avatar {
  width: 70px;
  height: 90px;
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
  flex-shrink: 0;
}

.avatar:hover {
  transform: scale(1.03);
}

/* 编辑模式下的照片上传覆盖层 */
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

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #4f46e5;
  background-color: white;
  border: 1px solid #eaeaea;
}

.user-details {
  flex: 1;
  min-width: 0;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.name-section h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.dispatch-tag {
  background-color: #ff4d4f;
  color: white;
  padding: 2px 8px;
  border-radius: 14px;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
}

.factory-info {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  opacity: 1;
  line-height: 1.3;
}

.factory-location-info {
  font-size: 12px;
  font-weight: normal;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 6px;
  letter-spacing: 0.3px;
  margin-top: 2px;
  display: inline-block;
}

.position-info {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.3;
}

.labor-company {
  margin: 0;
  font-size: 12px;
  opacity: 0.85;
  line-height: 1.4;
  font-style: italic;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.labor-company:hover {
  opacity: 1;
}

.labor-company i {
  font-size: 10px;
  margin-left: 5px;
  opacity: 0.8;
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

.edit-mode-buttons button {
  margin: 0;
  padding: 0 15px;
  height: 32px;
  display: inline-block;
}

.edit-mode-buttons .el-button {
  margin-right: 10px;
}

.edit-mode-buttons .el-button:last-child {
  margin-right: 0;
}

.header-left i {
  margin-right: 10px;
  font-size: 18px;
  color: #333;
}

/* 个人中心页面头部样式 - 与首页保持一致 */
.personal-center-page .home-header {
  padding: 16px;
  min-height: 140px;
  margin-bottom: 16px;
}

.personal-center-page .home-header .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 100%;
}

.personal-center-page .home-header .user-info {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: 16px;
  flex: 1;
}

.personal-center-page .home-header .user-info .avatar {
  width: 70px;
  height: 90px;
  margin-right: 0;
}

.personal-center-page .home-header .user-info .default-avatar {
  font-size: 28px;
}

.personal-center-page .home-header .user-info .user-details .name-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 0;
}

.personal-center-page .home-header .user-info .user-details .name-section h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.personal-center-page .home-header .user-info .user-details .name-section .dispatch-tag {
  background-color: #ff4d4f;
  color: white;
  padding: 2px 8px;
  border-radius: 14px;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
  flex-shrink: 0;
}

.personal-center-page .home-header .user-info .user-details .factory-info {
  font-size: 14px;
}

.personal-center-page .home-header .user-info .user-details .factory-location-info {
  font-size: 12px;
  padding: 2px 6px;
  margin-top: 2px;
}

.personal-center-page .home-header .user-info .user-details .position-info {
  font-size: 12px;
}

/* 移动端适配 - 与首页保持一致 */
@media (max-width: 1024px) {
  .home-header {
    padding: 20px;
  }
  
  .user-info {
    gap: 16px;
  }
  
  .avatar {
    width: 70px;
    height: 90px;
  }
  
  .default-avatar {
    font-size: 28px;
  }
  
  .name-section h3 {
    font-size: 18px;
  }
  
  .factory-info {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .home-header {
    padding: 15px;
    min-height: 160px;
  }
  
  .user-info {
    gap: 12px;
  }
  
  .avatar {
    width: 60px;
    height: 80px;
  }
  
  .default-avatar {
    font-size: 24px;
  }
  
  .name-section {
    margin-bottom: 6px;
    gap: 8px;
  }
  
  .name-section h3 {
    font-size: 16px;
  }
  
  .dispatch-tag {
    padding: 3px 8px;
    font-size: 10px;
  }
  
  .factory-info {
    font-size: 13px;
    gap: 6px;
  }
  
  .factory-location-info {
    font-size: 11px;
    padding: 2px 4px;
  }
  
  .position-info {
    font-size: 12px;
  }
  
  .header-actions {
    margin-left: 12px;
    gap: 8px;
  }
  
  .scan-button {
    min-width: 60px;
    padding: 8px;
  }
  
  .scan-icon {
    font-size: 20px;
  }
  
  .scan-button span {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .home-header {
    padding: 20px;
    min-height: 180px;
  }
  
  .user-info {
    gap: 16px;
  }
  
  .avatar {
    width: 70px;
    height: 90px;
  }
  
  .default-avatar {
    font-size: 28px;
  }
  
  .name-section h3 {
    font-size: 18px;
  }
  
  .factory-info {
    font-size: 16px;
  }
  
  .factory-location-info {
    font-size: 14px;
    margin-top: 4px;
  }
  
  .position-info {
    font-size: 15px;
  }
  
  .header-actions {
    margin-left: 12px;
  }
  
  .scan-button {
    min-width: 65px;
    padding: 10px;
  }
  
  .scan-icon {
    font-size: 22px;
  }
  
  .scan-button span {
    font-size: 12px;
  }
  
  .dispatch-tag {
    padding: 3px 10px;
    font-size: 12px;
  }
}

@media (max-width: 320px) {
  .home-header {
    padding: 10px;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .avatar {
    width: 80px;
    height: 100px;
  }
  
  .header-actions {
    margin-left: 0;
    margin-top: 12px;
    align-self: flex-end;
  }
}

/* 其他样式保持不变 */
.edit-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}



/* 移除通用p标签样式，避免覆盖特定类的样式 */

.function-menu {
  background-color: #fff;
  margin: 0 15px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.menu-section {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #667eea;
  font-size: 18px;
}

.menu-title {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.menu-item i.el-icon-arrow-right {
  color: #999;
  font-size: 14px;
}

.logout-section {
  padding: 0 15px 15px;
}

.logout-section .el-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.version-info {
  text-align: center;
  padding: 20px 0;
  font-size: 12px;
  color: #999;
}

/* 个人信息详情页面样式 */
.personal-info-content {
  background-color: #fff;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}





.user-info {
  display: flex;
  align-items: flex-start;
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
}

.avatar:hover {
  transform: scale(1.03);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  padding-top: 10px;
}

.user-details h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
}

/* 移除通用p标签样式，避免覆盖特定类的样式 */

/* 信息部分 */
.info-section {
  padding: 20px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-section:last-child {
  border-bottom: none;
}

/* 章节标题 */
.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6f7ff;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #1890ff;
  border-radius: 2px;
  margin-right: 8px;
}

/* 网格布局 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #333;
  word-break: break-all;
  line-height: 1.4;
}

/* 特殊情况说明 */
.special-note {
  padding: 12px;
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  font-size: 14px;
  color: #d48806;
  line-height: 1.4;
}

/* 个人经历 */
.experience-item {
  padding: 12px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  font-size: 14px;
  color: #389e0d;
  line-height: 1.4;
}

/* 工作履历 */
.work-history-item {
  padding: 12px;
  background-color: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 4px;
}

.work-period {
  font-weight: bold;
  font-size: 15px;
  color: #1890ff;
  margin-bottom: 10px;
}

.work-details p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.reward-punishment {
  margin: 10px 0;
}

.reward-punishment h4 {
  margin: 0 0 5px 0;
  font-size: 13px;
  font-weight: bold;
  color: #666;
}

.reward {
  color: #52c41a;
}

.punishment {
  color: #ff4d4f;
}

.attendance-record {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.attendance-status {
  color: #ff4d4f;
  font-weight: bold;
}

.empty-history {
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 14px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* 教育背景项目样式 */
.education-item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #e6f7ff;
  border-radius: 8px;
}

.education-item:last-child {
  margin-bottom: 0;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(26, 148, 255, 0.2);
}

.education-degree {
  font-weight: bold;
  font-size: 15px;
  color: #1890ff;
}

.education-date {
  font-size: 13px;
  color: #666;
}

.education-details {
  padding-top: 8px;
}

.education-school {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.education-major {
  margin: 0;
  font-size: 13px;
  color: #666;
}

/* 教育背景附件样式 */
.education-attachments {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eaeaea;
}

.education-attachments .attachment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.education-attachments .attachment-title {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.education-attachments .attachment-list {
  margin-top: 10px;
}

.education-attachments .attachment-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
}

.education-attachments .el-form {
  margin: 0;
}

.education-attachments .el-form-item {
  margin-bottom: 12px;
}

/* 查看模式下的教育背景附件 */
.education-attachments-view {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(26, 148, 255, 0.2);
}

.education-attachments-view .attachment-title {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: bold;
  color: #1890ff;
}

.education-attachments-view .attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.education-attachments-view .attachment-item {
  margin: 0;
}

.education-attachments-view .attachment-link {
  font-size: 12px;
  color: #1890ff;
  text-decoration: none;
  padding: 4px 10px;
  background-color: #e6f7ff;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.education-attachments-view .attachment-link:hover {
  background-color: #bae7ff;
  text-decoration: underline;
}

.empty-education {
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 14px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.empty-attachments {
  text-align: center;
  padding: 10px 0;
  color: #999;
  font-size: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

/* 教育背景编辑样式 */
.education-edit-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.education-edit-content {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
}

.education-edit-content .el-form {
  margin: 0;
}

.education-edit-content .el-form-item {
  margin-bottom: 12px;
}

/* 合同附件样式 */
.contract-attachment {
  margin-top: 15px;
  padding: 12px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contract-attachment .info-label {
  font-size: 14px;
  font-weight: 500;
  color: #389e0d;
  margin-bottom: 0;
}

.attachment-link {
  font-size: 14px;
  color: #1890ff;
  text-decoration: none;
  padding: 6px 12px;
  background-color: rgba(26, 148, 255, 0.1);
  border-radius: 4px;
  transition: all 0.3s;
}

.attachment-link:hover {
  background-color: rgba(26, 148, 255, 0.2);
  text-decoration: underline;
}

/* 工作经历信息样式 */
.work-experience-info {
  margin-top: 15px;
  padding: 12px;
  background-color: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

.factory-name-info,
.factory-note-info {
  margin-top: 10px;
  padding: 12px;
  background-color: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
}

.factory-name-info .info-label {
  margin-bottom: 10px;
}

.factory-note-info {
  flex-direction: column;
  align-items: flex-start;
}

.factory-note-info .info-label {
  margin-bottom: 8px;
}

.work-experience-info .info-label,
.factory-name-info .info-label,
.factory-note-info .info-label {
  font-size: 14px;
  font-weight: 500;
  color: #1890ff;
  margin-right: 10px;
  flex-shrink: 0;
}

.work-experience-info .info-value,
.factory-name-info .info-value,
.factory-note-info .info-value {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  flex: 1;
}

.factory-note-info .info-value {
  font-weight: normal;
  line-height: 1.4;
  white-space: pre-wrap;
}

.factory-name-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.factory-name-list .el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.factory-name-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex: 1;
}

.factory-name-input .el-autocomplete {
  flex: 1;
}

.input-hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
}

/* 编辑模式下的样式 */
.factory-name-info .el-autocomplete,
.factory-note-info .el-input {
  flex: 1;
  min-width: 200px;
}

.factory-note-info .el-input__textarea {
  min-height: 80px;
}

.avatar-value {
  display: flex;
  align-items: center;
}

.avatar-value img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

/* 工作履历项样式调整 */
.work-history-item {
  margin-bottom: 15px;
  padding: 15px;
}

/* 悬浮编辑按钮样式 */
.edit-button-container {
  position: fixed;
  top: 70%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-mode-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.floating-edit-button,
.floating-save-button,
.floating-cancel-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 2px 12px 0 rgba(24, 144, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.floating-edit-button:hover,
.floating-save-button:hover,
.floating-cancel-button:hover {
  transform: scale(1.1);
}

.floating-edit-button {
  background-color: #1890ff;
  color: white;
  border: none;
}

.floating-edit-button:hover {
  background-color: #40a9ff;
}

.floating-save-button {
  background-color: #52c41a;
  color: white;
  border: none;
}

.floating-save-button:hover {
  background-color: #73d13d;
}

.floating-cancel-button {
  background-color: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
}

.floating-cancel-button:hover {
  color: #1890ff;
  border-color: #1890ff;
}

/* 移动端适配 */
@media (max-width: 768px) {
  /* 个人信息头部移动端适配 */
  .home-header,
  .personal-center-page .home-header {
    padding: 20px !important;
    min-height: 180px !important;
    height: auto !important;
  }
  
  .user-info,
  .personal-center-page .user-info {
    gap: 16px !important;
  }
  
  .avatar,
  .personal-center-page .home-header .user-info .avatar {
    width: 70px !important;
    height: 90px !important;
    margin-right: 16px !important;
  }
  
  .default-avatar,
  .personal-center-page .home-header .user-info .default-avatar {
    font-size: 28px !important;
  }
  
  .name-section h3,
  .personal-center-page .home-header .user-info .user-details .name-section h3 {
    font-size: 18px !important;
  }
  
  .factory-info,
  .personal-center-page .home-header .user-info .user-details .factory-info {
    font-size: 16px !important;
  }
  
  .factory-location-info,
  .personal-center-page .home-header .user-info .user-details .factory-location-info {
    font-size: 14px !important;
    margin-top: 4px !important;
  }
  
  .position-info,
  .personal-center-page .home-header .user-info .user-details .position-info {
    font-size: 15px !important;
  }
  
  .dispatch-tag,
  .personal-center-page .home-header .user-info .user-details .dispatch-tag {
    padding: 3px 10px !important;
    font-size: 12px !important;
  }
  
  /* 悬浮按钮移动端适配 */
  .edit-button-container {
    right: 15px;
  }
  
  .floating-edit-button,
  .floating-save-button,
  .floating-cancel-button {
    width: 50px;
    height: 50px;
    font-size: 14px;
  }
  
  /* 信息网格移动端适配 */
  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .info-item {
    padding: 14px;
  }
  
  .info-label {
    font-size: 14px;
  }
  
  .info-value {
    font-size: 16px;
  }
  
  /* 章节标题移动端适配 */
  .section-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  /* 个人信息头部小屏幕适配 */
  .home-header,
  .personal-center-page .home-header {
    padding: 24px !important;
    min-height: 200px !important;
    height: auto !important;
  }
  
  .user-info,
  .personal-center-page .user-info {
    gap: 20px !important;
  }
  
  .avatar,
  .personal-center-page .home-header .user-info .avatar {
    width: 80px !important;
    height: 100px !important;
    margin-right: 20px !important;
  }
  
  .default-avatar,
  .personal-center-page .home-header .user-info .default-avatar {
    font-size: 32px !important;
  }
  
  .name-section h3,
  .personal-center-page .home-header .user-info .user-details .name-section h3 {
    font-size: 20px !important;
  }
  
  .factory-info,
  .personal-center-page .home-header .user-info .user-details .factory-info {
    font-size: 17px !important;
  }
  
  .factory-location-info,
  .personal-center-page .home-header .user-info .user-details .factory-location-info {
    font-size: 15px !important;
  }
  
  .position-info,
  .personal-center-page .home-header .user-info .user-details .position-info {
    font-size: 16px !important;
  }
  
  .dispatch-tag,
  .personal-center-page .home-header .user-info .user-details .dispatch-tag {
    padding: 4px 12px !important;
    font-size: 14px !important;
  }
  
  /* 悬浮按钮小屏幕适配 */
  .floating-edit-button,
  .floating-save-button,
  .floating-cancel-button {
    width: 55px;
    height: 55px;
    font-size: 16px;
  }
  
  /* 信息网格小屏幕适配 */
  .info-item {
    padding: 16px;
  }
  
  .info-label {
    font-size: 15px;
  }
  
  .info-value {
    font-size: 17px;
  }
  
  /* 章节标题小屏幕适配 */
  .section-title {
    font-size: 20px;
  }
}

.work-history-item:last-child {
  margin-bottom: 0;
}

.work-period {
  font-weight: bold;
  font-size: 15px;
  color: #1890ff;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(26, 148, 255, 0.2);
}

.work-details p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.reward-punishment {
  margin: 12px 0;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
}

.reward-punishment h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: bold;
  color: #666;
}

.attendance-record {
  margin-top: 12px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.attendance-detail-link {
  font-size: 12px;
  color: #1890ff;
  text-decoration: none;
  padding: 4px 8px;
  background-color: rgba(26, 148, 255, 0.1);
  border-radius: 4px;
  transition: all 0.3s;
}

.attendance-detail-link:hover {
  background-color: rgba(26, 148, 255, 0.2);
  text-decoration: underline;
}

/* 证书附件样式 */
.certificate-attachments {
  margin-top: 15px;
  padding: 12px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
}

.attachment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.attachment-title {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #389e0d;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.attachment-item {
  display: flex;
  align-items: center;
}

.attachment-item .el-form {
  width: 100%;
  margin: 0;
}

.attachment-item .el-form-item {
  margin-bottom: 10px;
}

.attachment-link {
  font-size: 13px;
  color: #1890ff;
  text-decoration: none;
  padding: 6px 12px;
  background-color: rgba(26, 148, 255, 0.1);
  border-radius: 4px;
  transition: all 0.3s;
}

.attachment-link:hover {
  background-color: rgba(26, 148, 255, 0.2);
  text-decoration: underline;
}

.empty-attachments {
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .home-header {
    padding: 20px;
  }
  
  .user-info {
    gap: 16px;
  }
  
  .avatar {
    width: 70px;
    height: 90px;
  }
  
  .default-avatar {
    font-size: 28px;
  }
  
  .name-section h3 {
    font-size: 18px;
  }
  
  .factory-info {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  /* 移动端个人中心头部适配 */
  .home-header {
    padding: 15px;
    min-height: 160px;
  }
  
  .user-info {
    gap: 12px;
  }
  
  .avatar {
    width: 60px;
    height: 80px;
  }
  
  .default-avatar {
    font-size: 24px;
  }
  
  .name-section {
    margin-bottom: 6px;
    gap: 8px;
  }
  
  .name-section h3 {
    font-size: 16px;
  }
  
  .dispatch-tag {
    padding: 3px 8px;
    font-size: 10px;
  }
  
  .factory-info {
    font-size: 13px;
    gap: 6px;
  }
  
  .factory-location-info {
    font-size: 11px;
    padding: 2px 4px;
  }
  
  .position-info {
    font-size: 12px;
  }
  
  .labor-company {
    font-size: 11px;
  }
  
  .header-actions {
    margin-left: 12px;
    gap: 8px;
  }
  
  .scan-button {
    min-width: 60px;
    padding: 8px;
  }
  
  .scan-icon {
    font-size: 20px;
  }
  
  .scan-button span {
    font-size: 10px;
  }
  
  .function-menu {
    margin: 0 10px 10px;
  }
  
  .menu-item {
    padding: 12px 15px;
  }
  
  .logout-section {
    padding: 0 10px 10px;
  }
  
  .logout-section .el-button {
    height: 44px;
    font-size: 15px;
  }
  
  .avatar-section {
    padding: 15px;
  }
  
  .personal-info-content {
    margin: 0;
  }
  
  .info-section {
    padding: 15px;
  }
  
  .info-section h3 {
    font-size: 15px;
  }
  
  /* 移动端网格布局改为单列 */
  .info-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .info-item {
    padding: 12px;
  }
  
  .info-label {
    font-size: 13px;
  }
  
  .info-value {
    font-size: 13px;
  }
  
  .avatar-value img {
    width: 50px;
    height: 50px;
  }
  
  /* 移动端工作履历样式调整 */
  .work-history-item {
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .work-period {
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .work-details p {
    margin: 0 0 8px 0;
    font-size: 13px;
  }
  
  .reward-punishment {
    margin: 10px 0;
    padding: 8px;
  }
  
  .reward-punishment h4 {
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  .attendance-record {
    margin-top: 10px;
    padding: 6px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .home-header {
    padding: 12px;
    min-height: 140px;
  }
  
  .user-info {
    gap: 10px;
  }
  
  .avatar {
    width: 50px;
    height: 70px;
  }
  
  .default-avatar {
    font-size: 20px;
  }
  
  .name-section h3 {
    font-size: 14px;
  }
  
  .factory-info {
    font-size: 12px;
  }
  
  .factory-location-info {
    font-size: 10px;
  }
  
  .position-info {
    font-size: 11px;
  }
  
  .labor-company {
    font-size: 10px;
  }
  
  .header-actions {
    margin-left: 8px;
  }
  
  .scan-button {
    min-width: 50px;
    padding: 6px;
  }
  
  .scan-icon {
    font-size: 18px;
  }
}

@media (max-width: 320px) {
  .home-header {
    padding: 10px;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .avatar {
    width: 80px;
    height: 100px;
  }
  
  .header-actions {
    margin-left: 0;
    margin-top: 12px;
    align-self: flex-end;
  }
}
</style>