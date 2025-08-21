import { BaseClient } from '@lark-base-open/node-sdk'


import axios from 'axios'

const APP_TOKEN = 'HFBKbSAqwa9NHWscfttcZ4FhnUe'
const PERSONAL_BASE_TOKEN = 'pt-D3eHlTlIiYvoWI3MVclqddbbUZ1fiz9UZzn2mmiYAQAAAgCD9hNAj5WjYty7'
const TABLEID = 'tblhDcK9SwhMgGGy'

/**
 * 格式化日期
 * @param date 需要格式化的日期对象，若不传默认当前时间
 * @param format 格式化模板，例如 'yyyy-MM-dd HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
// AES 加密函数，返回 Base64


function AESUtil() {
    // S-box
    var sBox = [
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
        0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
        0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
        0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
        0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
        0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
        0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
        0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
        0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
        0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
        0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
    ];

    // 逆S-box
    var invSBox = [
        0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
        0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
        0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
        0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
        0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
        0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
        0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
        0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
        0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
        0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
        0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
        0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
        0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
        0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
        0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
        0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
    ];

    // Rcon常量
    var rCon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

    // 字符串转UTF-8字节数组
    function stringToUtf8Bytes(str) {
        var utf8 = unescape(encodeURIComponent(str));
        var bytes = [];
        for (var i = 0; i < utf8.length; i++) {
            bytes.push(utf8.charCodeAt(i));
        }
        return bytes;
    }

    // UTF-8字节数组转字符串
    function utf8BytesToString(bytes) {
        var str = '';
        for (var i = 0; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return decodeURIComponent(escape(str));
    }

    // Base64编码
    function base64Encode(bytes) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var result = '';
        var i = 0;

        while (i < bytes.length) {
            var a = bytes[i++] || 0;
            var b = bytes[i++] || 0;
            var c = bytes[i++] || 0;

            var bitmap = (a << 16) | (b << 8) | c;

            result += chars.charAt((bitmap >> 18) & 63);
            result += chars.charAt((bitmap >> 12) & 63);
            result += (i - 2) < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
            result += (i - 1) < bytes.length ? chars.charAt(bitmap & 63) : '=';
        }

        return result;
    }

    // Base64解码
    function base64Decode(str) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var result = [];
        var i = 0;

        str = str.replace(/[^A-Za-z0-9+/]/g, '');

        while (i < str.length) {
            var encoded1 = chars.indexOf(str.charAt(i++));
            var encoded2 = chars.indexOf(str.charAt(i++));
            var encoded3 = chars.indexOf(str.charAt(i++));
            var encoded4 = chars.indexOf(str.charAt(i++));

            var bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

            result.push((bitmap >> 16) & 255);
            if (encoded3 !== 64) result.push((bitmap >> 8) & 255);
            if (encoded4 !== 64) result.push(bitmap & 255);
        }

        return result;
    }

    // PKCS7填充
    function pkcs7Pad(data) {
        var padLength = 16 - (data.length % 16);
        var padded = data.slice();
        for (var i = 0; i < padLength; i++) {
            padded.push(padLength);
        }
        return padded;
    }

    // PKCS7去填充
    function pkcs7Unpad(data) {
        if (data.length === 0) return data;
        var padLength = data[data.length - 1];
        if (padLength > 16 || padLength > data.length) return data;
        return data.slice(0, data.length - padLength);
    }

    // 有限域乘法
    function gmul(a, b) {
        var p = 0;
        for (var i = 0; i < 8; i++) {
            if ((b & 1) !== 0) {
                p ^= a;
            }
            var hiBitSet = (a & 0x80) !== 0;
            a <<= 1;
            if (hiBitSet) {
                a ^= 0x1b;
            }
            b >>= 1;
        }
        return p & 0xff;
    }

    // 密钥扩展
    function keyExpansion(key) {
        var w = [];
        var i = 0;

        // 复制原始密钥
        while (i < 16) {
            w[i] = key[i];
            i++;
        }

        // 扩展密钥
        while (i < 176) { // 11轮 * 16字节 = 176字节
            var temp = [w[i-4], w[i-3], w[i-2], w[i-1]];

            if (i % 16 === 0) {
                // RotWord
                var t = temp[0];
                temp[0] = temp[1];
                temp[1] = temp[2];
                temp[2] = temp[3];
                temp[3] = t;

                // SubBytes
                temp[0] = sBox[temp[0]];
                temp[1] = sBox[temp[1]];
                temp[2] = sBox[temp[2]];
                temp[3] = sBox[temp[3]];

                // XOR with Rcon
                temp[0] ^= rCon[(i / 16) - 1];
            }

            w[i] = w[i - 16] ^ temp[0];
            w[i + 1] = w[i + 1 - 16] ^ temp[1];
            w[i + 2] = w[i + 2 - 16] ^ temp[2];
            w[i + 3] = w[i + 3 - 16] ^ temp[3];

            i += 4;
        }

        return w;
    }

    // AES加密一个块
    function encryptBlock(block, expandedKey) {
        var state = block.slice();

        // 初始轮密钥加
        for (var i = 0; i < 16; i++) {
            state[i] ^= expandedKey[i];
        }

        // 9轮主轮
        for (var round = 1; round <= 9; round++) {
            // SubBytes
            for (var i = 0; i < 16; i++) {
                state[i] = sBox[state[i]];
            }

            // ShiftRows
            var temp = state[1]; state[1] = state[5]; state[5] = state[9]; state[9] = state[13]; state[13] = temp;
            temp = state[2]; state[2] = state[10]; state[10] = temp;
            temp = state[6]; state[6] = state[14]; state[14] = temp;
            temp = state[3]; state[3] = state[15]; state[15] = state[11]; state[11] = state[7]; state[7] = temp;

            // MixColumns
            for (var c = 0; c < 4; c++) {
                var s0 = state[c * 4];
                var s1 = state[c * 4 + 1];
                var s2 = state[c * 4 + 2];
                var s3 = state[c * 4 + 3];

                state[c * 4] = gmul(s0, 2) ^ gmul(s1, 3) ^ s2 ^ s3;
                state[c * 4 + 1] = s0 ^ gmul(s1, 2) ^ gmul(s2, 3) ^ s3;
                state[c * 4 + 2] = s0 ^ s1 ^ gmul(s2, 2) ^ gmul(s3, 3);
                state[c * 4 + 3] = gmul(s0, 3) ^ s1 ^ s2 ^ gmul(s3, 2);
            }

            // AddRoundKey
            for (var i = 0; i < 16; i++) {
                state[i] ^= expandedKey[round * 16 + i];
            }
        }

        // 最后一轮（无MixColumns）
        // SubBytes
        for (var i = 0; i < 16; i++) {
            state[i] = sBox[state[i]];
        }

        // ShiftRows
        var temp = state[1]; state[1] = state[5]; state[5] = state[9]; state[9] = state[13]; state[13] = temp;
        temp = state[2]; state[2] = state[10]; state[10] = temp;
        temp = state[6]; state[6] = state[14]; state[14] = temp;
        temp = state[3]; state[3] = state[15]; state[15] = state[11]; state[11] = state[7]; state[7] = temp;

        // AddRoundKey
        for (var i = 0; i < 16; i++) {
            state[i] ^= expandedKey[160 + i]; // 第10轮密钥
        }

        return state;
    }

    // AES解密一个块
    function decryptBlock(block, expandedKey) {
        var state = block.slice();

        // 初始轮密钥加
        for (var i = 0; i < 16; i++) {
            state[i] ^= expandedKey[160 + i]; // 第10轮密钥
        }

        // 9轮主轮
        for (var round = 9; round >= 1; round--) {
            // InvShiftRows
            var temp = state[13]; state[13] = state[9]; state[9] = state[5]; state[5] = state[1]; state[1] = temp;
            temp = state[2]; state[2] = state[10]; state[10] = temp;
            temp = state[6]; state[6] = state[14]; state[14] = temp;
            temp = state[7]; state[7] = state[11]; state[11] = state[15]; state[15] = state[3]; state[3] = temp;

            // InvSubBytes
            for (var i = 0; i < 16; i++) {
                state[i] = invSBox[state[i]];
            }

            // AddRoundKey
            for (var i = 0; i < 16; i++) {
                state[i] ^= expandedKey[round * 16 + i];
            }

            // InvMixColumns
            for (var c = 0; c < 4; c++) {
                var s0 = state[c * 4];
                var s1 = state[c * 4 + 1];
                var s2 = state[c * 4 + 2];
                var s3 = state[c * 4 + 3];

                state[c * 4] = gmul(s0, 14) ^ gmul(s1, 11) ^ gmul(s2, 13) ^ gmul(s3, 9);
                state[c * 4 + 1] = gmul(s0, 9) ^ gmul(s1, 14) ^ gmul(s2, 11) ^ gmul(s3, 13);
                state[c * 4 + 2] = gmul(s0, 13) ^ gmul(s1, 9) ^ gmul(s2, 14) ^ gmul(s3, 11);
                state[c * 4 + 3] = gmul(s0, 11) ^ gmul(s1, 13) ^ gmul(s2, 9) ^ gmul(s3, 14);
            }
        }

        // 最后一轮（无InvMixColumns）
        // InvShiftRows
        var temp = state[13]; state[13] = state[9]; state[9] = state[5]; state[5] = state[1]; state[1] = temp;
        temp = state[2]; state[2] = state[10]; state[10] = temp;
        temp = state[6]; state[6] = state[14]; state[14] = temp;
        temp = state[7]; state[7] = state[11]; state[11] = state[15]; state[15] = state[3]; state[3] = temp;

        // InvSubBytes
        for (var i = 0; i < 16; i++) {
            state[i] = invSBox[state[i]];
        }

        // AddRoundKey
        for (var i = 0; i < 16; i++) {
            state[i] ^= expandedKey[i]; // 第0轮密钥
        }

        return state;
    }

    // 公共接口
    return {
        encrypt: function(plaintext, key) {
            // 转换为字节数组
            var plaintextBytes = stringToUtf8Bytes(plaintext);
            var keyBytes = stringToUtf8Bytes(key);

            // 确保密钥为16字节
            if (keyBytes.length < 16) {
                while (keyBytes.length < 16) {
                    keyBytes.push(0);
                }
            } else if (keyBytes.length > 16) {
                keyBytes = keyBytes.slice(0, 16);
            }

            // PKCS7填充
            var paddedData = pkcs7Pad(plaintextBytes);

            // 密钥扩展
            var expandedKey = keyExpansion(keyBytes);

            // ECB模式加密
            var encrypted = [];
            for (var i = 0; i < paddedData.length; i += 16) {
                var block = paddedData.slice(i, i + 16);
                var encryptedBlock = encryptBlock(block, expandedKey);
                encrypted = encrypted.concat(encryptedBlock);
            }

            return base64Encode(encrypted);
        },

        decrypt: function(ciphertext, key) {
            // 转换为字节数组
            var ciphertextBytes = base64Decode(ciphertext);
            var keyBytes = stringToUtf8Bytes(key);

            // 确保密钥为16字节
            if (keyBytes.length < 16) {
                while (keyBytes.length < 16) {
                    keyBytes.push(0);
                }
            } else if (keyBytes.length > 16) {
                keyBytes = keyBytes.slice(0, 16);
            }

            // 密钥扩展
            var expandedKey = keyExpansion(keyBytes);

            // ECB模式解密
            var decrypted = [];
            for (var i = 0; i < ciphertextBytes.length; i += 16) {
                var block = ciphertextBytes.slice(i, i + 16);
                var decryptedBlock = decryptBlock(block, expandedKey);
                decrypted = decrypted.concat(decryptedBlock);
            }

            // 去除PKCS7填充
            var unpaddedData = pkcs7Unpad(decrypted);

            return utf8BytesToString(unpaddedData);
        }
    };
}




function formatDate(date?: Date, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
  // 如果没传 date 或传了非法对象，就用当前时间
  if (!(date instanceof Date)) {
    date = new Date();
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace(/yyyy/g, year.toString())
    .replace(/MM/g, month)
    .replace(/dd/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
}


export async function in3login() {
  const client = new BaseClient({
    appToken: APP_TOKEN,
    personalBaseToken: PERSONAL_BASE_TOKEN,
  })
  const client1 = new BaseClient({
    
  })
  // 1. 从「系统设置」表里找到系统编码=IN3 的那条记录
  const queryResp = await client.base.appTableRecord.list({
    path: { table_id: TABLEID }, // TODO: 替换成实际表 ID
    params: {
      filter: 'CurrentValue.[系统编码] = "IN3"',
    },
  });
  // console.log(JSON.stringify(queryResp))
  const records = queryResp.data?.items || [];
  // console.log(JSON.stringify(records))
  if (records.length !== 1) {
    throw new Error("系统编码为IN3的记录数量有误");
  }

  const record = records[0];
  const fields = record.fields;
  console.log(fields)
  const lastLoginDate = fields["AK日期"] as string | undefined;
  const needRelogin =
    !lastLoginDate ||
    !fields["AK"] ||
    !fields["USER_ID"] ||
    new Date(lastLoginDate).getTime() < Date.now() - 2 * 60 * 60 * 1000;

  if (needRelogin) {
    console.log("需要重新登录");
    let aes = AESUtil();
    const encryptedPassword = aes.encrypt(fields['密码'], 'HGY12345HGY12345');
    // 2. 生成登录参数
    const loginParams = {
      server: fields["接口地址"] as string,
      username: encodeURIComponent(`corp:${fields["用户名"]}@${fields["租户CODE"]}`),
      password: encodeURIComponent(encryptedPassword),
      client_id: fields["CLIENT_ID"] as string,
      client_secret: fields["CLIENT_SECRET"] as string,
    };

    const loginUrl = `${loginParams.server}/service/uaas/oauth/token`
      + `?username=${loginParams.username}`
      + `&password=${loginParams.password}`
      + `&grant_type=password`
      + `&client_id=${loginParams.client_id}`
      + `&client_secret=${loginParams.client_secret}`;

    console.log("登录地址：", loginUrl);

//    3. 调用登录接口
    const resp = await axios.get(loginUrl, {
      headers: { Accept: "application/json" },
      timeout: 20000,
    });
    console.log(resp.data)
    console.log(record)
    const jsonResp = resp.data
    if (resp.status === 200) {
      const fieldsMap = new Map([
        ['AK', String(jsonResp.access_token)],
          ['AK日期', Date.now()],
        ['USER_ID', String(jsonResp.user_id)],
      ]);
        console.log(fieldsMap)
     const res12 =  await client.base.appTableRecord.update({
        path: { table_id: TABLEID, record_id: record.record_id },
        data: {
          fields: Object.fromEntries(fieldsMap),
        },
      });
      console.log(TABLEID)
      console.log(res12)

      console.log("登录成功，已更新表格记录");
    } else {
      throw new Error("fetch err! status is " + resp.status);
    }
  } else {
    console.log("已登录，使用已有 token 访问");
  }
}
