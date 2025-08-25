import { BaseClient } from '@lark-base-open/node-sdk'

export interface ProjectPaymentRecord {
  [key: string]: any
}
const APP_TOKEN = 'HFBKbSAqwa9NHWscfttcZ4FhnUe'
const PERSONAL_BASE_TOKEN = 'pt-D3eHlTlIiYvoWI3MVclqddbbUZ1fiz9UZzn2mmiYAQAAAgCD9hNAj5WjYty7'
const TABLEID = 'tbldv449NvZoNXI5'

export async function getProjectRecords(ak: string): Promise<ProjectPaymentRecord[]> {
  const client1 = new BaseClient({})
  const client2 = new BaseClient({
    appToken: APP_TOKEN,
    personalBaseToken: PERSONAL_BASE_TOKEN,
  });
  let all: ProjectPaymentRecord[] = []
  let pageNumber = 0
  let totalPages = 100

  while (all.length === 0 || pageNumber < totalPages) {
    const url = `https://apiv3-qa.industics.com/service/mom/ps/v2/api/tenants/10030/ld/nprj/fn2/report/plan-payment?is_sales=true&page=${pageNumber}&size=100&page_size=100`

    const resp: any = await client1.request({
      method: 'GET',
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'T-Code': 'industics',
        'Authorization': 'Bearer ' + ak,
      },
      timeout: 50000,
    })

    const jsonResp = JSON.stringify(resp)
    const jsonObj = JSON.parse(jsonResp);
    const content = jsonObj?.prj_fn2_plan_payment_entrys?.content ?? [];

    const res3 = await client2.base.appTableField.list({
      params: { page_size: 100 },
      path: { table_id: TABLEID }
    });

    console.log(pageNumber)
    console.log(totalPages)

    // 映射成 Base 记录
    let records = content.map((item: any) => {
      let fields: Record<string, any> = {
        '项目名称': item['project_name'] ?? '',
        '项目编号': item['project_no'] ?? '',
        '项目状态': item['project_status_text'] ?? '',
        '项目类型': item['project_type_name'] ?? '',
        '项目风险': item['risk_rank_name'] ?? '',
        '项目区域': item['project_area_name'] ?? '',
        '项目经理': item['pm_user_name'] ?? '',
        '计划款项编号': item['payment_no'] ?? '',
        '计划款项名称': item['payment_name'] ?? '',
        '款项条件': item['payment_condition_text'] ?? '',
        '参考单据类型': item['ref_type_text'] ?? '',
        '参考单据名称': item['ref_text'] ?? '',
        '是否达成收款条件': item['fulfill_payment_term_text'] ?? '',
        '实际回款状态': item['collection_status_text'] ?? '',
        '计划款项总金额': item['planned_payment_amount'] ?? 0,
        '已开票金额': item['verification_amount'] ?? 0,
        '已回款金额': item['collection_total_amount'] ?? 0,
        '开票状态': item['invoice_status_text'] ?? '',
        '回款率': item['collection_ratio'] ?? '',
        '计划收款日期': item['planned_payment_date'] ?? ''
      };

      // 处理附加字段（field_values）
      if (Array.isArray(item['field_values']) && item['field_values'].length > 0) {
        for (let fieldValue of item['field_values']) {
          if (fieldValue['biz_type'] === 'PS_FN_BASE') {
            fields['财务基础信息-Net系数'] = fieldValue['field_value'] ?? '';
            break;
          }
        }
      }

      return { fields };
    });

    if (records) {
      all = all.concat(records)
    } else {
      break
    }

    pageNumber++
    totalPages = jsonObj?.prj_fn2_plan_payment_entrys?.total_pages ?? 100
  }

  // ✅ 去重：保证相同计划款项编号只保留一条
  const uniqueMap = new Map<string, ProjectPaymentRecord>()
  for (const record of all) {
    const key = record.fields['计划款项编号']
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, record)  // 只保留第一条（相当于随机保留一条）
    }
  }
  const uniqueRecords = Array.from(uniqueMap.values())

  console.log(`总共获取 ${all.length} 条，去重后剩余 ${uniqueRecords.length} 条`)

  return uniqueRecords
}
