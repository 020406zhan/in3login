import { BaseClient } from '@lark-base-open/node-sdk'
import axios from "axios";
export interface ProjectProgressRecord {
  [key: string]: any
}

const APP_TOKEN = 'HFBKbSAqwa9NHWscfttcZ4FhnUe'
const PERSONAL_BASE_TOKEN = 'pt-D3eHlTlIiYvoWI3MVclqddbbUZ1fiz9UZzn2mmiYAQAAAgCD9hNAj5WjYty7'
const TABLEID = 'tblUDvmdN0qd33do'
function replacePlaceholder(template: string, params: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] || "");
}
export async function getProjectRecords2(ak: any): Promise<ProjectProgressRecord[]> {
  // 1. 配置参数
  const apiParams = {
    server: ak.fields["接口地址"],
    tenant_id: ak.fields["租户ID"],
    user_id: ak.fields["USER_ID"],
  };

  // 2. 生成请求 URL
  const url = replacePlaceholder(
    "{server}/service/mom/dm/v2/api/tenants/{tenant_id}/tenant-reports/codes/PS991_01?user_id={user_id}&dashboard_id=645739872442867712",
    apiParams
  );

  console.log("接口地址：", url);

  try {
    // 3. axios 请求
    const resp = await axios.post(
      url,
      {
        filter: [],
        linkage_filters: [],
        drill: [],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'T-Code': ak.fields["租户CODE"],
          'Authorization': 'Bearer ' + ak.fields['AK'],
        },
        timeout: 50000,
      }
    );
    // console.log(resp)
    // axios 成功返回 resp.data
    // console.log(resp.data)
    return resp.data?.data?.tableRow ?? [];
    
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `fetch err! status=${error.response.status}, data=${JSON.stringify(error.response.data)}`
      );
    } else {
      throw new Error("fetch err! " + error.message);
    }
  }
}

/**
 * 获取项目进度记录
 */
export async function getProjectProgressRecords(
  ak: any
): Promise<ProjectProgressRecord[]> {
  const apiParams = {
    server: ak.fields["接口地址"],
    tenant_id: ak.fields["租户ID"],
    user_id: ak.fields["USER_ID"],
  };

  const url = replacePlaceholder(
    "{server}/service/mom/dm/v2/api/tenants/{tenant_id}/tenant-reports/codes/PS991_2?user_id={user_id}&dashboard_id=645739872442867712",
    apiParams
  );

  console.log("接口地址：", url);

  try {
    const resp = await axios.post(
      url,
      {
        filter: [],
        linkage_filters: [],
        drill: [],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "T-Code": ak.fields["租户CODE"],
          "Authorization": "Bearer " + ak.fields["AK"],
        },
        timeout: 50000,
      }
    );
    
    console.log(resp.status); // 200
    console.log(resp.statusText); // OK

    if (resp.status === 200) {
      console.log(resp.data)
      return resp.data?.data?.tableRow ?? [];
    } else {
      throw new Error("fetch err! status is " + resp.status);
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `fetch err! status=${error.response.status}, data=${JSON.stringify(
          error.response.data
        )}`
      );
    } else {
      throw new Error("fetch err! " + error.message);
    }
  }
}

function extractMNum(str) {
    const regex = /^M\d+/;
    const match = str.match(regex);
    // console.log(str,match)
    if (match) {
        return match[0];
    } else {
        return null; // 或者返回其他表示未匹配的值
    }
}

export async function fulfillmentProgressRecords(prj, prjProgress) {
  const prjProgressMap = new Map();
  // console.log(prj)
  // console.log(prjProgress)
  const milestones = ['M1','M2','M3','M4','M5']
  // 按项目编号分组
  prjProgress.forEach(item => {
    const key = item["项目编号"];
    if (!key) return;
    if (!prjProgressMap.has(key)) {
      prjProgressMap.set(key, []);
    }
    prjProgressMap.get(key).push(item);
  });

  prj.forEach(item => {
    const prjProgressList = prjProgressMap.get(item["项目编号"]);
    if (prjProgressList && prjProgressList.length > 0) {
      let currentState = "M0";
      let hasState = false;

      for (const progress of prjProgressList) {
        // console.log(progress)
        const milestone = extractMNum(progress["里程碑编号"]); 
        // console.log(milestone)
        if (milestone && milestones.includes(milestone)) {
          if (progress["里程碑状态"] === "已完成") {
            item[`${milestone}计划日期`] = "已完成";
            hasState = true;
          } else {
            item[`${milestone}计划日期`] = progress["计划完成日期"];
            if (milestone > parseInt(currentState.slice(1))) {
              currentState = milestone;
            }
            hasState = true;
          }
        }
      }

      if (hasState) {
        item["进度完成情况"] = currentState === "M0" ? "已完成" : currentState;
      } else {
        item["进度完成情况"] = "未知";
      }
    }
  });

  return prj;
}

// 用于批量操作时分片，避免超限
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export async function updateDbtRecords2(comingRecords: any[]) {
  const client = new BaseClient({
    appToken: APP_TOKEN,
    personalBaseToken: PERSONAL_BASE_TOKEN,
  });

  if (!Array.isArray(comingRecords)) {
    console.error("comingRecords 不是数组:", comingRecords);
    return;
  }
console.log(comingRecords)
  console.log("准备同步的记录数量:", comingRecords.length);

  // 1. 取出当前表格已有数据
  const dbtRecordsResp = await client.base.appTableRecord.list({
    path: { table_id: TABLEID },
    params: { page_size: 500 },
  });

  const dbtRecords = dbtRecordsResp.data?.items ?? [];

  const dbtRecordMap = new Map<string, any>();
  const comingRecordSet = new Set<string>();

  // 构建已有记录 Map
  for (const rec of dbtRecords) {
    const key = rec.fields?.['项目编号'];
    if (key) dbtRecordMap.set(key, rec);
  }
  console.log(comingRecords)
  const addingRecords: any[] = [];
  const updateRecords: any[] = [];
  const deletingRecords: any[] = [];

  // 2. 判断是新增还是更新
  for (const rec of comingRecords) {
    const key = rec['项目编号'];
    if (!key) continue; // 没有项目编号的跳过
    comingRecordSet.add(key);

    if (dbtRecordMap.has(key)) {
      updateRecords.push({
        id: dbtRecordMap.get(key).record_id,
        fields: rec, // 更新时也必须包裹 fields
      });
    } else {
      addingRecords.push({ fields: rec }); // 新增必须包裹 fields
    }
  }

  // 3. 找出需要删除的
  for (const rec of dbtRecords) {
    const key = rec.fields?.['项目编号'];
    if (key && !comingRecordSet.has(key)) {
      deletingRecords.push(rec.record_id);
    }
  }

  console.log(`待更新 ${updateRecords.length} 行数据`);
  console.log(`待插入 ${addingRecords.length} 行数据`);
  console.log(`待删除 ${deletingRecords.length} 行数据`);

  // 4. 批量更新
  for (const chunk of chunkArray(updateRecords, 500)) {
    const resp = await client.base.appTableRecord.batchUpdate({
      path: { table_id: TABLEID },
      data: { records: chunk },
    });
    console.log("batchUpdate 返回:", resp);
  }

  // 5. 批量插入
  for (const chunk of chunkArray(addingRecords, 500)) {
    const resp = await client.base.appTableRecord.batchCreate({
      path: { table_id: TABLEID },
      data: { records: chunk },
    });
    console.log("batchCreate 返回:", resp);
  }

  // 6. 批量删除
  for (const chunk of chunkArray(deletingRecords, 500)) {
    const resp = await client.base.appTableRecord.batchDelete({
      path: { table_id: TABLEID },
      data: { record_ids: chunk },
    });
    console.log("batchDelete 返回:", resp);
  }

  console.log('同步完成 ✅');
}

// 用于批量操作时分片


export async function fulfillProjectWorkdaySummary(
  prj: any[],
  summaryTABLEID: string,
  workdayTABLEID: string,
  client: BaseClient
) {
  console.log("获取慧人天汇总数据")
  const summaryRecordsResp = await client.base.appTableRecord.list({
    path: { table_id: summaryTABLEID },
    params: { page_size: 500 }
  })
  const summaryRecords = summaryRecordsResp.data?.items ?? []

  console.log("获取慧人天报工详细数据（最近三周）")
  const workdayRecordsResp = await client.base.appTableRecord.list({
    path: { table_id: workdayTABLEID },
    params: {
      page_size: 500,
      filter: [
        {
          field: "报工日期",
          operator: "betweenDynamic",
          values: ["last21Days", "today"]
        }
      ]
    }
  })
  const workdayRecords = workdayRecordsResp.data?.items ?? []

  const prjSummaryMap = new Map<string, any>()
  const prjWorkdayMap = new Map<string, any[]>()

  // 构建项目编号到汇总信息的映射
  summaryRecords.forEach(item => {
    const key = item.fields?.["项目编号"]
    if (key) prjSummaryMap.set(key, item)
  })

  // 构建项目编号到报工数组的映射
  workdayRecords.forEach(item => {
    const key = item.fields?.["项目编号"]
    if (!key) return
    if (!prjWorkdayMap.has(key)) {
      prjWorkdayMap.set(key, [])
    }
    prjWorkdayMap.get(key)!.push(item)
  })

  const currentTime = new Date()

  prj.forEach(item => {
    const prjNo = item["项目编号"]

    // 处理summary
    const sr = prjSummaryMap.get(prjNo)
    if (sr) {
      item['backlog金额'] =
        getFloatOrDefault(sr.fields['计划差旅金额'], 0) -
        getFloatOrDefault(sr.fields['实际差旅金额'], 0)
      item['计划总人天'] =
        getFloatOrDefault(sr.fields['计划A当量'], 0) +
        getFloatOrDefault(sr.fields['计划B当量'], 0)
      item['历史消耗总人天'] =
        getFloatOrDefault(sr.fields['实际消耗A当量'], 0) +
        getFloatOrDefault(sr.fields['实际消耗B当量'], 0)
      if (item['计划总人天'] > 0 && item['历史消耗总人天']) {
        item['人天消耗进度'] = (
          (item['历史消耗总人天'] / item['计划总人天']) *
          100
        ).toFixed(2) + '%'
      } else {
        item['人天消耗进度'] = ''
      }
    }

    // 处理workday
    const workdays = prjWorkdayMap.get(prjNo)
    if (workdays && workdays.length > 0) {
      let wk1 = 0
      let wk2 = 0
      let wk3 = 0

      workdays.forEach(wk => {
        let dayRequire = getFloatOrDefault(wk.fields['消耗当量'], 0)
        if (wk.fields['批准当量']) {
          dayRequire = getFloatOrDefault(wk.fields['批准当量'], 0)
        }
        const differ = differInDay(new Date(wk.fields['报工日期']), currentTime)
        if (differ <= 7) wk1 += dayRequire
        else if (differ <= 14) wk2 += dayRequire
        else if (differ <= 21) wk3 += dayRequire
      })

      item['WK消耗(-3)'] = wk3
      item['WK消耗(-2)'] = wk2
      item['WK消耗(-1)'] = wk1
    }
  })

  return prj
}

function differInDay(date1: Date, date2: Date) {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime())
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  return diffInDays
}

function getFloatOrDefault(strValue: any, defaultValue: number) {
  if (strValue != null && !isNaN(parseFloat(strValue))) {
    return parseFloat(strValue)
  }
  return defaultValue
}




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
