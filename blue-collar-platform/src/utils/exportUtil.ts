import * as XLSX from 'xlsx';

/**
 * 导出Excel文件并添加水印
 * @param data 导出的数据
 * @param headers 表头配置
 * @param fileName 文件名
 * @param watermark 水印内容
 */
export const exportExcelWithWatermark = (data: any[], headers: Record<string, string>, fileName: string, watermark: string) => {
  try {
    // 准备导出数据
    const exportData = data.map(item => {
      const row: any = {};
      Object.keys(headers).forEach(key => {
        row[headers[key]] = item[key];
      });
      return row;
    });

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // 生成Excel文件
    const excelBuffer = XLSX.write(wb, { 
      bookType: 'xlsx', 
      type: 'array',
      cellDates: true,
      sheetStubs: true
    });
    
    // 创建Blob对象
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // 下载文件
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('导出Excel失败:', error);
    return false;
  }
};

/**
 * 从数据中提取水印信息
 * @param userInfo 用户信息
 * @returns 水印文本
 */
export const getWatermarkText = (userInfo: any): string => {
  if (!userInfo) return '';
  
  const phone = userInfo.phone || '未知手机号';
  const name = userInfo.name || '未知姓名';
  const companyName = userInfo.companyName || '未知企业';
  
  return `${phone} | ${name} | ${companyName}`;
};
