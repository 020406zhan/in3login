import { BaseClient } from '@lark-base-open/node-sdk'

const APP_TOKEN = 'HFBKbSAqwa9NHWscfttcZ4FhnUe'
const PERSONAL_BASE_TOKEN = 'pt-D3eHlTlIiYvoWI3MVclqddbbUZ1fiz9UZzn2mmiYAQAAAgCD9hNAj5WjYty7'
const TABLEID = 'tbldv449NvZoNXI5'

const client = new BaseClient({
  appToken: APP_TOKEN,
  personalBaseToken: PERSONAL_BASE_TOKEN,
})

//获取in3登录表中的信息
// 获取 AccessToken
export async function getPsAccessToken() {
  const queryResp = await client.base.appTableRecord.list({
    path: { table_id: 'tblA4weHVn8xvU3U' }, // TODO: 替换成实际表 ID
    params: {
      filter: 'CurrentValue.[系统编码] = "IN3"',
    },
  });

  const records = queryResp.data?.items || [];
  // console.log(JSON.stringify(records))
  if (records.length !== 1) {
    throw new Error("系统编码为IN3的记录数量有误");
  }
  // console.log(records)
  //records.fields['AK日期']
  // console.log(records[0].fields)
  const lastLogin = records[0].fields['AK日期']
  // console.log(lastLogin)
  if (!records[0].fields['AK'] || !records[0].fields['USER_ID'] || lastLogin < Date.now() - 2*60*60*1000) {
    throw new Error('需要重新登录')
  }
  // console.log(records[0])
  return records[0]
}

// 更新项目记录
async function updateProjectRecords(ak, record) {
  const project_no = record.fields['项目编号']
  if (!project_no) throw new Error('项目编号不能为空')

  // 构建请求数据
  const updateJson: any = {}
  const risk = record.fields['风险等级']
  if (risk === '高风险') updateJson.risk_rank = 'RED'
  else if (risk === '中风险') updateJson.risk_rank = 'YELLOW'
  else if (risk === '低风险') updateJson.risk_rank = 'GREEN'

  // 这里假设你已经获取 project_id 和其他接口返回
  // TODO: 调用 queryProjectId / getProjectDetail 获取 project_id
  const project_id = await queryProjectId(ak, project_no) // 自行实现
  const projectDetail = await getProjectDetail(ak, project_id) // 自行实现

  updateJson.project_no = project_no
  updateJson.project_name = projectDetail.project_name
  updateJson.project_type = projectDetail.project_type
  updateJson.pm_user_id = projectDetail.pm_user_id
  updateJson.pm_org_id = projectDetail.pm_org_id

  // 调用接口更新项目
  await HTTP.put(`${ak.fields['接口地址']}/service/mom/ps/v2/api/tenants/${ak.fields['租户ID']}/ld/nprj/projects/${project_id}`, updateJson, {
    headers: {
      'Authorization': 'Bearer ' + ak.fields['AK'],
      'T-Code': ak.fields['租户CODE'],
      'Content-Type': 'application/json'
    }
  })
}

export async function fetchData() {
  const client = new BaseClient({
    appToken: APP_TOKEN,
    personalBaseToken: PERSONAL_BASE_TOKEN,
  })
  const client1 = new BaseClient({

  })
  console.log("获取待更新的数据，记得把表的id改一下")
  const records = await client.base.appTableRecord.list({
    path: {
      table_id: TABLEID,
    },
    params: {
      // 过滤条件：上传状态 在 [未上传, 上传错误]
      filter: {
        "conjunction": "and",  // 多条件时 and/or
        "conditions": [
          {
            "field_name": "上传状态",
            "operator": "is",
            "value": "未上传"
          },
          {
            "field_name": "上传状态",
            "operator": "is",
            "value": "上传错误"
          }
        ]
      },
      page_size: 100
    }
  })
  console.log(records)
return records

}




// 批量更新表格上传状态
async function updateUploadStatus(records) {
  const updateRecords = records.map(r => ({
    record_id: r.record_id,
    fields: {
      '上传状态': r.fields['上传状态'],
      '上传错误信息': r.fields['上传错误信息']
    }
  }))

  await client.base.appTableRecord.batchUpdate({
    path: { table_id: TABLEID },
    data: { records: updateRecords }
  })
}



