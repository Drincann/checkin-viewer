import axios from 'axios';
import { AxiosResponse } from 'axios'
import querystring from 'querystring';
import { config } from './config';
const JSEncrypt = require('nodejs-jsencrypt').default;
import cookie from 'cookie';
import moment from 'moment';


interface UserInfo {
  uname: string;// 姓名
  sno: string;// 学号
}

interface UserInfoResponse {
  success: boolean;
  message?: string;
  data: {
    resultList: UserInfo[],
    totalPage: number;
    totalRow: number;
  }
}

export class Manager {
  cookies = config.cookie;
  encrypt = new JSEncrypt();
  constructor() {
    this.encrypt.setPublicKey(config.loginConfig.pubKey);
  }
  _encrypt(raw: string): string {
    return this.encrypt.encrypt(raw);
  }
  async _login(): Promise<Manager> {
    const res = await axios.post(`https://189770qvw.mh.chaoxing.com/login/phoneAndCxhLogin?${querystring.stringify({
      'uname': this._encrypt(config.loginConfig.uname), 'password': this._encrypt(config.loginConfig.password)
    })}`, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://189770qvw.mh.chaoxing.com',
        'referer': 'https://189770qvw.mh.chaoxing.com/page/251970/show?loginOut=1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
      },
    });
    if (res.data?.code === 1) {
      const cookieJson: any = {};
      const cookiesStep1 = res.headers?.['set-cookie'];

      const resStep2 = await axios.get('http://yzesn.v.chaoxing.com/manage', {
        headers: {
          cookie: cookiesStep1?.map(cookie => cookie.split(';')[0]).join(';') ?? ''
        }
      });
      const cookiesStep2 = resStep2.headers?.['set-cookie'];
      if (Array.isArray(cookiesStep1)) {
        const cookieStep1Json = cookie.parse(cookiesStep1.map(cookie => cookie.split(';')[0]).join(';'));
        for (const key in cookieStep1Json) {
          cookieJson[key] = cookieStep1Json[key];
        }
      }
      if (Array.isArray(cookiesStep2)) {
        const cookieStep2Json = cookie.parse(cookiesStep2.map(cookie => cookie.split(';')[0]).join(';'));
        for (const key in cookieStep2Json) {
          cookieJson[key] = cookieStep2Json[key];
        }
      }
      this.cookies = '';
      for (const key in cookieJson) {
        this.cookies += `${key}=${cookieJson[key]}; `
      }
    } else {
      throw new Error(JSON.stringify(res.data));
    }
    return this;
  }

  async getList(id: number): Promise<UserInfo[]> {
    // req params:
    // cpage: 1
    // selUsers: [{"id":30571660,"name":"软件工程","t":2,"usercount":100000,"orgName":"软件工程"},{"id":30585296,"name":"1905计算机(理工)","t":2,"usercount":100000,"orgName":"1905计算机(理工)"},{"id":30585070,"name":"1904计算机(理工)","t":2,"usercount":100000,"orgName":"1904计算机(理工)"},{"id":30585060,"name":"1902计算机(理工)","t":2,"usercount":100000,"orgName":"1902计算机(理工)"},{"id":30585434,"name":"1901计算机(理工)","t":2,"usercount":100000,"orgName":"1901计算机(理工)"},{"id":30585166,"name":"1903计算机(理工)","t":2,"usercount":100000,"orgName":"1903计算机(理工)"}]
    // formId: 204160
    // formAppId: 
    // startTime: 2022-06-04 00:00
    // endTime: 2022-06-04 23:59
    // pageSize: 10
    // enc: a9b79f8b76307cd50a458b843d219ff2
    const selUsers = config.querys.find(v => v.id === id)?.selUsersParam;
    if (selUsers === undefined) throw new Error('查询方案不存在');
    let res: AxiosResponse<UserInfoResponse>; try {
      res = await axios.post(`http://m.oa.chaoxing.com/manage/apps/forms/user/data/user/uncommit/list?${querystring.stringify({
        cpage: 1,
        selUsers,
        formId: 204160,
        // formAppId: '',
        startTime: moment().format('YYYY-MM-DD 00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59'),
        pageSize: 400,
        enc: 'a9b79f8b76307cd50a458b843d219ff2',
      })}`, {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': this.cookies,
        }
      });
    } catch (err) {
      const error = err as any;
      throw new Error(error?.message ?? error);
    }

    if (res?.data?.success) {
      return res.data?.data?.resultList;
    } else {
      await this._login();
      return this.getList(id);
      // throw new Error(res?.data?.message ?? '未知错误');
    }
  }
}


(async () => {
  // var url = "";
  // if (data.tochaoxing && isChaoxingReader()) {
  //   var path = window.location.protocol + '//' + window.location.host;
  //   url = path + "/towriteother?name=" + encodeURIComponent(data.name) + "&pwd=" + encodeURIComponent(data.pwd) + "&refer=" + data.url;
  // } else {
  //   url = decodeURIComponent(data.url);
  // }

  // if (top.location != self.location && $("#_blank").val() == "1") {
  //   top.location = url;
  // } else {
  //   window.location = url;
  // }
  // application/x-www-form-urlencoded

  // const manager = new Manager();
  // // manager.getList()

  // const res = await (await manager.login()).getList(0);
  // console.log(res);

  // await 

})();

// jully