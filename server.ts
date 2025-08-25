import express from 'express'
import { getProjectRecords } from "./playground/project_payment"
import { updateDbtRecords } from "./playground/project_payment2"
import { in3login } from "./playground/in3Login"
import {getPsAccessToken} from "./playground/project_management_data"
import {getProjectRecords2,getProjectProgressRecords,updateDbtRecords2,fulfillmentProgressRecords} from "./playground/sync_i_program"
const app = express()
const port = 3000

// parse json body
app.use(express.json())
// project progress via GET (for quick testing)
// app.get('/wps_to_feishu', async (req, res) => {
//   try {
//     const q: any = req.query || {}
//     const ak = {
//       fields: {
//         '接口地址': q['接口地址'] ?? q.server,
//         '租户ID': q['租户ID'] ?? q.tenant_id,
//         '租户CODE': q['租户CODE'] ?? q.tenant_code,
//         'USER_ID': q['USER_ID'] ?? q.user_id,
//         'AK': q['AK'] ?? q.ak,
//       }
//     }
//     const data = await getProjectProgressRecords(ak)
//     res.json({ data })
//   } catch (err: any) {
//     res.status(500).json({ message: err?.message || 'internal error' })
//   }
// });
app.get('/project_payment',async (req, res) => {
    const ak = await getPsAccessToken()
    
    const records = await getProjectRecords(ak.fields['AK']);
  console.log(records)
  await updateDbtRecords(records)
        // await syncProjectPaymentToTable(records);
         res.send('success!!!')
       });
// http trigger



app.get('/', async (req, res) => {
  res.send('hello world')
});
app.get('/in3login', async (req, res) =>{
  await in3login()
})
app.get('/project_management',async(req,res)=>{
  const r = await getPsAccessToken()
  console.log(r)
})
app.get('/sync_i_program', async (req, res) => {
  try {
    const ak = await getPsAccessToken()

    // 一定要 await，获取实际数组
    let records = await getProjectRecords2(ak)
    console.log('获取项目记录成功 ✅')

    const projectProgressRecords = await getProjectProgressRecords(ak)
    console.log('获取项目进度记录成功 ✅')

    // ⚠️ 必须加 await
    records = await fulfillmentProgressRecords(records, projectProgressRecords)

    // 同步飞书表
    await updateDbtRecords2(records)

    // console.log(records)
    res.send('同步完成 ✅')
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})



app.listen(port, () => {
  // Code.....
  console.log('Listening on port: ' + port)
})