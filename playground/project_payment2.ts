import { BaseClient } from '@lark-base-open/node-sdk'

const APP_TOKEN = 'HFBKbSAqwa9NHWscfttcZ4FhnUe'
const PERSONAL_BASE_TOKEN = 'pt-D3eHlTlIiYvoWI3MVclqddbbUZ1fiz9UZzn2mmiYAQAAAgCD9hNAj5WjYty7'
const TABLEID = 'tbldv449NvZoNXI5'

// 分片工具函数
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

// 比较两个记录是否有变化
function isDifferent(oldFields: any, newFields: any) {
  const keys = Object.keys(newFields)
  for (const key of keys) {
    if (oldFields[key] != newFields[key]) { // 忽略类型差异
      return true
    }
  }
  return false
}

export async function updateDbtRecords(comingRecords: any[]) {
  const client = new BaseClient({
    appToken: APP_TOKEN,
    personalBaseToken: PERSONAL_BASE_TOKEN,
  })

  // 获取现有表格数据
  const dbtRecordsResp = await client.base.appTableRecord.list({
    path: { table_id: TABLEID },
    params: { page_size: 500 },
  })
  const dbtRecords = dbtRecordsResp.data?.items ?? []

  const dbtRecordMap = new Map<string, any>()
  const comingRecordSet = new Set<string>()

  // 构建 Map，key 转为字符串
  for (let rec of dbtRecords) {
    const key = String(rec.fields?.['计划款项编号'] ?? '')
    if (key) dbtRecordMap.set(key, rec)
  }

  const addingRecords: any[] = []
  const updateRecords: any[] = []
  const deletingRecords: any[] = []

  // 判断新增或更新
  for (let rec of comingRecords) {
    const key = String(rec.fields?.['计划款项编号'] ?? '')
    comingRecordSet.add(key)

    if (dbtRecordMap.has(key)) {
      // 更新
      updateRecords.push({
        record_id: dbtRecordMap.get(key).record_id,
        fields: rec.fields,  // 注意这里要用 rec.fields
      })
    } else {
      // 新增
      addingRecords.push({ fields: rec.fields })
    }
  }

  // 删除逻辑
  for (let rec of dbtRecords) {
    const key = String(rec.fields?.['计划款项编号'] ?? '')
    if (key && !comingRecordSet.has(key)) {
      deletingRecords.push(rec.record_id)
    }
  }

  console.log(`待更新 ${updateRecords.length} 行数据`)
  console.log(`待插入 ${addingRecords.length} 行数据`)
  console.log(`待删除 ${deletingRecords.length} 行数据`)
console.log(comingRecords)
  // 批量更新
  for (const chunk of chunkArray(updateRecords, 500)) {
    await client.base.appTableRecord.batchUpdate({
      path: { table_id: TABLEID },
      data: { records: chunk },
    })
  }

  // 批量插入
  for (const chunk of chunkArray(addingRecords, 500)) {
    await client.base.appTableRecord.batchCreate({
      path: { table_id: TABLEID },
      data: { records: chunk },
    })
  }

  // 批量删除
  for (const chunk of chunkArray(deletingRecords, 500)) {
    await client.base.appTableRecord.batchDelete({
      path: { table_id: TABLEID },
      data: { record_ids: chunk },
    })
  }

  console.log('同步完成 ✅')
}

