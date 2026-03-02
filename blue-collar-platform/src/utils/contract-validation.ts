import type { FormRules } from 'element-plus'

export const contractFormRules: FormRules = {
  partyA: [
    { required: true, message: '请输入甲方', trigger: 'blur' },
    { max: 100, message: '甲方名称不能超过100个字符', trigger: 'blur' }
  ],
  partyB: [
    { required: true, message: '请选择乙方', trigger: 'change' }
  ],
  settlementMethod: [
    { required: true, message: '请选择结算方式', trigger: 'change' }
  ],
  contractSignDate: [
    { required: true, message: '请选择合同签订日期', trigger: 'change' }
  ],
  contractEffectiveDate: [
    { required: true, message: '请选择合同生效日期', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        const formData = rule.field ? (rule as any).form : null
        const signDate = formData?.contractSignDate
        if (signDate && value && new Date(value) < new Date(signDate)) {
          callback(new Error('合同生效日期不能早于签订日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  contractExpiryDate: [
    { required: true, message: '请选择合同过期日期', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        const formData = rule.field ? (rule as any).form : null
        const effectiveDate = formData?.contractEffectiveDate
        if (effectiveDate && value && new Date(value) <= new Date(effectiveDate)) {
          callback(new Error('合同过期日期必须晚于生效日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  contractAmount: [
    { required: true, message: '请输入合同金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '合同金额必须大于0', trigger: 'blur' }
  ],
  contractContent: [
    { required: true, message: '请输入合同内容', trigger: 'blur' },
    { max: 10000, message: '合同内容不能超过10000个字符', trigger: 'blur' }
  ]
}