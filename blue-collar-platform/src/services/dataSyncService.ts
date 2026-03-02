import { ElMessage } from 'element-plus'
import { fetchCompanyCulture, saveCompanyCulture } from '@/api/companyCulture'

export interface SyncConfig {
  enabled: boolean
  syncInterval: number
  lastSyncTime?: Date
  autoSync: boolean
}

export interface SyncResult {
  success: boolean
  message: string
  syncTime: Date
  syncedData?: any
}

export class DataSyncService {
  private static SYNC_KEY = 'data_sync_config'
  private static COMPANY_CULTURE_SYNC_KEY = 'company_culture_sync_data'
  private static POSITION_CULTURE_SYNC_KEY = 'position_culture_sync_data'
  private static syncTimer: any = null

  static getSyncConfig(): SyncConfig {
    const configStr = localStorage.getItem(this.SYNC_KEY)
    if (configStr) {
      try {
        return JSON.parse(configStr)
      } catch {
        return {
          enabled: true,
          syncInterval: 5 * 60 * 1000,
          autoSync: true
        }
      }
    }
    return {
      enabled: true,
      syncInterval: 5 * 60 * 1000,
      autoSync: true
    }
  }

  static setSyncConfig(config: SyncConfig): void {
    localStorage.setItem(this.SYNC_KEY, JSON.stringify(config))
  }

  static startAutoSync(): void {
    this.stopAutoSync()
    const config = this.getSyncConfig()
    if (!config.enabled || !config.autoSync) {
      return
    }

    this.syncTimer = setInterval(() => {
      this.syncAllData()
    }, config.syncInterval)
  }

  static stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
  }

  static async syncAllData(): Promise<SyncResult[]> {
    const results: SyncResult[] = []
    
    try {
      const companyCultureResult = await this.syncCompanyCulture()
      results.push(companyCultureResult)
    } catch (error) {
      results.push({
        success: false,
        message: '企业文化同步失败',
        syncTime: new Date()
      })
    }

    const config = this.getSyncConfig()
    config.lastSyncTime = new Date()
    this.setSyncConfig(config)

    return results
  }

  static async syncCompanyCulture(): Promise<SyncResult> {
    try {
      const response = await fetchCompanyCulture()
      if (response.code === 200 && response.data) {
        const syncData = {
          data: response.data,
          syncTime: new Date().toISOString()
        }
        localStorage.setItem(this.COMPANY_CULTURE_SYNC_KEY, JSON.stringify(syncData))
        
        return {
          success: true,
          message: '企业文化同步成功',
          syncTime: new Date(),
          syncedData: syncData
        }
      } else {
        return {
          success: false,
          message: response.message || '企业文化同步失败',
          syncTime: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        message: '企业文化同步失败',
        syncTime: new Date()
      }
    }
  }

  static getSyncedCompanyCulture(): any | null {
    const syncDataStr = localStorage.getItem(this.COMPANY_CULTURE_SYNC_KEY)
    if (syncDataStr) {
      try {
        const syncData = JSON.parse(syncDataStr)
        return syncData.data
      } catch {
        return null
      }
    }
    return null
  }

  static async syncPositionCulture(factoryId: string): Promise<SyncResult> {
    try {
      const response = await fetchPositionCultureList({ factoryId })
      if (response.code === 200 && response.data) {
        const syncData = {
          factoryId,
          data: response.data,
          syncTime: new Date().toISOString()
        }
        
        const allSyncData = this.getAllPositionCultureSyncData()
        allSyncData[factoryId] = syncData
        localStorage.setItem(this.POSITION_CULTURE_SYNC_KEY, JSON.stringify(allSyncData))
        
        return {
          success: true,
          message: '岗位文化同步成功',
          syncTime: new Date(),
          syncedData: syncData
        }
      } else {
        return {
          success: false,
          message: response.message || '岗位文化同步失败',
          syncTime: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        message: '岗位文化同步失败',
        syncTime: new Date()
      }
    }
  }

  static getSyncedPositionCulture(factoryId: string): any | null {
    const allSyncData = this.getAllPositionCultureSyncData()
    const factoryData = allSyncData[factoryId]
    if (factoryData) {
      return factoryData.data
    }
    return null
  }

  static getAllPositionCultureSyncData(): Record<string, any> {
    const syncDataStr = localStorage.getItem(this.POSITION_CULTURE_SYNC_KEY)
    if (syncDataStr) {
      try {
        return JSON.parse(syncDataStr)
      } catch {
        return {}
      }
    }
    return {}
  }

  static clearSyncData(): void {
    localStorage.removeItem(this.COMPANY_CULTURE_SYNC_KEY)
    localStorage.removeItem(this.POSITION_CULTURE_SYNC_KEY)
  }

  static async manualSync(): Promise<SyncResult[]> {
    ElMessage.info('开始同步数据...')
    const results = await this.syncAllData()
    
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    
    if (failCount === 0) {
      ElMessage.success(`数据同步成功，共同步${successCount}项数据`)
    } else {
      ElMessage.warning(`数据同步完成，成功${successCount}项，失败${failCount}项`)
    }
    
    return results
  }

  static getSyncStatus(): {
    isSyncing: boolean
    lastSyncTime: Date | null
    nextSyncTime: Date | null
  } {
    const config = this.getSyncConfig()
    return {
      isSyncing: !!this.syncTimer,
      lastSyncTime: config.lastSyncTime || null,
      nextSyncTime: config.lastSyncTime && config.autoSync
        ? new Date(config.lastSyncTime.getTime() + config.syncInterval)
        : null
    }
  }

  static checkSyncNeeded(): boolean {
    const config = this.getSyncConfig()
    if (!config.enabled || !config.autoSync) {
      return false
    }
    
    if (!config.lastSyncTime) {
      return true
    }
    
    const timeSinceLastSync = Date.now() - new Date(config.lastSyncTime).getTime()
    return timeSinceLastSync >= config.syncInterval
  }

  static async checkAndSync(): Promise<void> {
    if (this.checkSyncNeeded()) {
      await this.syncAllData()
    }
  }
}

export default DataSyncService
