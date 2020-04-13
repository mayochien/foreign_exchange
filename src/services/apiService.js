import {DOMAIN} from '../config'
import axios from 'axios'
import store from '../store'
// import { exists } from 'i18next'
import ls from "local-storage"
import i18n from '../i18n'
import { TRANSLATE, ERRORCODE } from '../const'
import { popupErrorMsg, setupErrorMsg } from '../actions/errMsgAction';
import { logout } from '../actions/userActions';
import { saveErrorCode } from '../pages/BankerProfile/actions';
// import Modal from "react-responsive-modal";


const service = axios.create({
    timeout: 30000 // 请求超时时间
})

// 創建refresh專用的axios
const refreshapi = axios.create({
    baseURL: DOMAIN + '/refresh',
    // method: 'post',
    headers: {
        'Authorization': ls.get('user')?ls.get('user').refresh_session:''
    },
})

// 多個request時
let authTokenRequest;
function getAuthToken() {
    if (!authTokenRequest) {
        authTokenRequest = refreshapi({
            method: 'post'
        });
        authTokenRequest.then(resetAuthTokenRequest, resetAuthTokenRequest);
    }
    return authTokenRequest;
}

function resetAuthTokenRequest() {
    authTokenRequest = null;
}

// request攔截器
service.interceptors.request.use(request => {
    let user = store.getState().UserReducer
    let session = user.user.session
    if (session) {
        request.headers['Authorization'] = session
    }
    // console.log(request);
    return request
}, error => {
    return Promise.reject(error)
})

// response攔截器
service.interceptors.response.use(response => {
    // console.log("response:", response.data.code)
    if(response.data.code===0){
        // const errMsg = '要先驗證捏'
        const errMsg = i18n.t('app.please_verify_account_first')
        store.dispatch(popupErrorMsg(true)); //是否跳錯誤通知
        store.dispatch(setupErrorMsg(errMsg)); //傳遞錯誤訊息內容
    }
    return response
}, error => {
    const originalRequest = error.config
    let err = error.response
    // console.log(err)
    // let msg = t('app.WEB_NO_RESPONSE')
    if (err && err.status === 401 && originalRequest && !err.config.__isRetryRequest) {
        console.log('【err.data.code】',err.data.code);
        console.log('【err.status】',err.status);
        const errCode = err.data.code
        store.dispatch(saveErrorCode(errCode));
        if(errCode===207){
            console.log('帳號重複登入');
            setTimeout(() => {
                store.dispatch(logout(errCode));  
            }, 2000);
        }
        else if(errCode===205){ // 權限不足 => 強制登出
            console.log('權限不足,強制登出');
            setTimeout(() => {
                store.dispatch(logout(errCode));  
            }, 2000);
        }
        // console.log('token expire')
        return getAuthToken().then(success => {
            // console.log('getAuthToken success:',success)
            // if (!success) {
                // console.log('Session invalid, the system will force you to log out.');
                // ls.remove()
                // alert('Session invalid, the system will force you to log out.')
                // window.location.assign('/#/login')
                // window.location.reload()
                // return false
            //   }
            if (success && success.code === 1) {
                let user = ls.get('user')
                ls.set('user', {
                    ...user,
                    session: success.data.session,
                    time: new Date().getTime()
                })
                err.config.__isRetryRequest = true
                err.config.headers.Authorization = success.data.session
                return service(err.config).then(res => {
                    console.log(res) }
                ).catch(err => { console.log(err) })
            }
        }, error => {
            throw error
        })
    } else {
        if (err) {
        //   let data = err.data
          if(err.toString() ==='TypeError: Failed to fetch'){
            switch(i18n.language) {
              case 'zh-TW':
                console.log('錯誤訊息: ' + i18n.t(TRANSLATE.DISCONNECTED));
                break;
              case 'en':
                console.log('Error: ' + i18n.t(TRANSLATE.DISCONNECTED));
                break;
              default:
            }
          }else{
            const errMsg = i18n.t(ERRORCODE[err.data.code])
            store.dispatch(popupErrorMsg(true)); //是否跳錯誤通知
            store.dispatch(setupErrorMsg(errMsg)); //傳遞錯誤訊息內容
            console.log('【Api Service 錯誤】',errMsg);

            // ls.remove()
            // window.location.assign('/#/login')
            // return false

            // console.log('【Api Service 錯誤】' + i18n.t(ERRORCODE[err.data.code]));
            // console.log('【Api Service 錯誤】' + err.data.msg);

            // const errCode = err.data.code
            // store.dispatch(saveErrorCode(errCode));
            // setTimeout(() => {
            //   store.dispatch(logout(errCode));  
            // }, 2000);

            // if(err.data.code===205){ // 權限不足 => 強制登出
            //     ls.clear()
            //     alert('Permission denied, the system will force you to log out.')
            //     window.location.assign('/#/login')
            //     return false
            //     // window.location.reload()
            // }
            // else if(err.data.code===207){ // 帳號被重複登入 => 強制登出
            //     ls.clear()
            //     // alert('Your account has already logged in elsewhere, the system will force you to log out.')
            //     window.location.assign('/#/login')
            //     return false
            // }
          }
        }
        return err
    }
})

refreshapi.interceptors.response.use(response => {
    console.log(response)
    let token = response.data.data.session
    if (token) {
		response.headers['Authorization'] = token
	}
    return response
}, error => {
    console.log(error)
})

function get(endpoint) {
    // params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
    let url = (endpoint.indexOf(DOMAIN) === -1) ? DOMAIN + endpoint : endpoint
    return service({
        url: url,
        method: 'get',
        headers: {},
        // params
    })
}


//封装post请求
function post(endpoint, data = {}) {
    //默认配置
    let url = (endpoint.indexOf(DOMAIN) === -1) ? DOMAIN + endpoint : endpoint
    let sendObject={
        url: url,
        method: 'post',
        headers: {
            'Content-Type':'application/json;charset=UTF-8'
        },
        data: JSON.stringify(data)
    }
    return service(sendObject)
}

//封装put方法 (resfulAPI常用)
function put(endpoint,data = {}){
    let url = (endpoint.indexOf(DOMAIN) === -1) ? DOMAIN + endpoint : endpoint
    return service({
        url: url,
        method: 'put',
        headers: {
            'Content-Type':'application/json;charset=UTF-8'
        },
        data:JSON.stringify(data)
    })
}

function deleteData(endpoint,data = {}){
    let url = (endpoint.indexOf(DOMAIN) === -1) ? DOMAIN + endpoint : endpoint
    return service({
        url: url,
        method: 'delete',
        headers: {
            'Content-Type':'application/json;charset=UTF-8'
        },
        data:JSON.stringify(data)
    })
}

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 1.1~1.2 代理管理 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    export const apiGetAgentList = (page, username) => get(`/agents?page=${page}&username=${username}`) //清單
    export const apiGetAgentMemberList = (id, page, username) => get(`/agents/downline/${id}?page=${page}&username=${username}`) //清單
    export const apiGetDownLineOrderList = (page,down_line_id,origin,target) => get(`/down_line_order/${down_line_id}?page=${page}&origin=${origin}&target=${target}`) //會員的掛單清單
    export const apiGetDownLineOrderDetail = (page,order_id,stage) => get(`/deal_cache?page=${page}&order_id=${order_id}&stage=${stage}`) //掛單清單的交易明細
    export const apiPostAgentAdd = (payload) => post(`/agents`,payload) //新增
    export const apiPutAgentEdit = (id,payload) => put(`/agents/${id}`,payload) //修改nickname


// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 1.3~1.4用戶管理 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    export const apiGetUserList = (page, username) => get(`/member?page=${page}&username=${username}`) //清單
    export const apiPostMemberAdd = (payload) => post(`/member/create`,payload) //新增
    export const apiPutUserEdit = (id,payload) => put(`/member/${id}`,payload) //修改


// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 1.5 客戶返水設 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    export const apiGetBankAgentProportion = () => get(`/profit_proportion`)
    export const apiPutBankAgentProportion = (payload) => put(`/profit_proportion`,payload)


// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 2. 銀行帳戶管理 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    // ----銀行帳戶：
    // export const apiGetBankList = (page) => get(`/bank?type=1&page=${page}`)
    export const apiGetBankList = (page,account_number) => get(`/bank?page=${page}&type=1&account_number=${account_number}`)
    export const apiPostBankAdd = (payload) => post(`/bank`,payload)
    export const apiPutBankEdit = (id,payload) => put(`/bank/${id}`,payload) //修改帳戶名稱
    export const apiDeleteBank = (id,payload) => deleteData(`/bank/${id}`,payload) //刪除
    //  ----銀行卡： (只有搜尋不一樣)
    // export const apiGetCardList = (page) => get(`/bank?type=2&page=${page}`)
    export const apiGetCardList = (page,account_number) => get(`/bank?page=${page}&type=2&account_number=${account_number}`)
    export const apiPostCardAdd = (payload) => post(`/bank`,payload)
    export const apiPutCardEdit = (id,payload) => put(`/bank/${id}`,payload)
    export const apiDeleteCard = (id,payload) => deleteData(`/bank/${id}`,payload)


// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 3.換匯交易(市場上所有單) ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    /* 3.1 交易市場 */
    export const apiGetOrderList = (page) => get(`/orders?page=${page}`)
    export const apiGetMyTradeBankList = (currency_type) => get(`/bank?currency_type=${currency_type}`)
    export const apiPostOrderBuy = (payload) => post(`/deal_cache `,payload) //買單
    export const apiGetOrdersFilterCurrency = (page,origin_currency,target_currency) => get(`/orders?page=${page}&origin=${origin_currency}&target=${target_currency}`)

    /* 3.2 新增掛單 */
    export const apiPostBankerOrderAdd = (payload) => post(`/banker_order`,payload)
    export const apiGetRate = (origin_currency,target_currency) => get(`/rates/${origin_currency}/${target_currency}`)

    /* 3.3 我的外匯單 */
    export const apiGetBankerOrderList = (page) => get(`/banker_order?page=${page}`)
    export const apiGetBankerOrderFilterCurrency = (page,origin_currency,target_currency) => get(`/banker_order?page=${page}&origin=${origin_currency}&target=${target_currency}`)
    export const apiPutBankerOrder = (id,payload) => put(`/banker_order/${id}`,payload) //修改成交單
    export const apiDeleteBankerOrder = (id,payload) => deleteData(`/banker_order/${id}`,payload) //刪除

    /* 3.4~3.5 交易中外匯單 */
    export const apiGetBuyerPendingList = (page) => get(`/deal_cache?type=buyer&page=${page}`) //取得交易中外匯單-出價清單
    export const apiGetBuyerPendingSingle = (id) => get(`/deal_cache/${id}`) //取得交易中外匯單-出價清單(單筆)
    export const apiGetSellerPendingList = (page) => get(`/deal_cache?type=seller&page=${page}`) //取得交易中外匯單-掛單清單
    export const apiGetSellerPendingSingle = (id) => get(`/deal_cache/${id}`) //取得交易中外匯單-掛單清單(單筆)
    export const apiPostCheckImage = (payload) => post(`/deal_image/verify`,payload) // 確認對方單據 & 最終確認對方單據
    export const apiPostConfirmTrade = (payload) => post(`/deal_cache/verify`,payload) // 確認開始進行交易
    export const apiGetBankVerify = (deal_cache_id) => get(`/bank_account/verify/${deal_cache_id}`) //查看對方銀行帳戶
    export const apiPostUploadImage = (payload) => post(`/deal_image`,payload) // 上傳我的單據
    export const apiGetSellerImage = (deal_cache_id,seller_id) => get(`/deal_cache/image/${deal_cache_id}?user_id=${seller_id}`) // 查看(賣方)單據
    export const apiGetBuyerImage = (deal_cache_id,buyer_id) => get(`/deal_cache/image/${deal_cache_id}?user_id=${buyer_id}`) // 查看(買方)單據

    /* 3.6 外匯單交易紀錄 */
    export const apiGetDealNoteList = (page,startDate,endDate) => get(`/deal_note?page=${page}&start=${startDate}&end=${endDate}&origin=ALL&target=ALL`) //歷史成交
    export const apiGetDealNoteFilter = (page,startDate,endDate,origin,target,stage) => get(`/deal_note?page=${page}&start=${startDate}&end=${endDate}&origin=${origin}&target=${target}&stage=${stage}`) //歷史成交篩選
    export const apiGetDealNoteSingle = (id) => get(`/deal_note/${id}`) //歷史成交(單筆)

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 4.存/提款 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    //  4-1~ 4.2.存款
    export const apiGetDepositCurrency = () => get(`/deposit/open_currency`) //取得可存款的貨幣
    export const apiGetDepositRate = () => get(`/exchange_rate`) //取得參考匯率
    export const apiPostDeposit = (payload) => post(`/deposit`, payload) //申請存款
    export const apiPostVerify = (id, payload) => post(`/deposit/verify/${id}`, payload) //送出驗證結果
    export const apiGetDepositList = (page) => get(`/deposit?page=${page}`) //取得存款清單
    export const apiGetDepositSingle = (top_up_id) => get(`/deposit/${top_up_id}`) //取得存款清單(單筆)
    export const apiGetDepositBank = (deposit_id) => get(`/deposit/remitter/bank_account/${deposit_id}`) //查看要匯款的帳戶
    export const apiPostUploadDepositReceipt = (deposit_id,payload) => post(`/deposit/image/${deposit_id}`,payload) // 上傳我的單據
    export const apiGetUploadReceipt = (deposit_id) => get(`/deposit/image/${deposit_id}`) //查看已經匯款的單據
    //  4-3~ 4.4.提款
    export const apiGetWithdrawAccount = (currency) => get(`/withdraw/bank_account?currency=${currency}`) //查看已經匯款的單據
    export const apiGetWithdrawCurrency = () => get(`/withdraw/currency`) //查看幣別、匯率、剩餘數量
    export const apiPostWithdrawApply = (payload) => post(`/withdraw`,payload) //申請提款
    export const apiGetWithdrawList = (page,startDate,endDate,currency) => get(`/withdraw?page=${page}&start_date=${startDate}&end_date=${endDate}&currency=${currency}`) //取得提款清單
    export const apiGetWithdrawBank = (bank_id) => get(`/withdraw/bank_account/${bank_id}`) //查看銀行帳戶
    export const apiGetWithdrawReceipt = (withdraw_id) => get(`/withdraw/image/${withdraw_id}`) //查看已經匯款的單據
    export const apiPostWithdrawConfirm = (withdraw_id,payload) => post(`/withdraw/${withdraw_id}`,payload) //確認單據

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 5.報表 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
   /* 5.1 換匯報表 */
    export const apiGetExchangeReport = (startDate,endDate) => get(`/report/currency?page=1&start_date=${startDate}&end_date=${endDate}`)
    export const apiDownloadExchangeReport = (startDate,endDate,language) => get(`/report/exchange/download?start_date=${startDate}&end_date=${endDate}&language=${language}`)
    export const apiGetExchangeReportItem = (currency_id,startDate,endDate) => get(`/report/exchange/${currency_id}?start_date=${startDate}&end_date=${endDate}`) 

   /* 5.2 錢包紀錄 */
    export const apiGetWalletRecord = (page,startDate,endDate) => get(`/report/wallet_log?page=${page}&start_date=${startDate}&end_date=${endDate}`)
    export const apiDownloadWalletReport = (startDate,endDate,language) => get(`/report/wallet_log/download?start_date=${startDate}&end_date=${endDate}&language=${language}`)
    export const apiGetWalletRecordFilter = (page,startDate,endDate,expense_item) => get(`/report/wallet_log?page=${page}&start_date=${startDate}&end_date=${endDate}&expense_item=${expense_item}`) 
   
    /* 5.3 推廣獎金 */
    export const apiGetBouns = (page,startDate,endDate,username) => get(`/report/bonus_outline?page=${page}&start_date=${startDate}&end_date=${endDate}&username=${username}`)
    export const apiGetBounsDetail = (id,page,startDate,endDate) => get(`/report/bonus_outline/${id}?page=${page}&start_date=${startDate}&end_date=${endDate}`)
    export const apiDownloadBouns = (startDate,endDate,language) => get(`/report/bonus_outline/download?&start_date=${startDate}&end_date=${endDate}&language=${language}`)
    export const apiDownloadBounsDetail = (id,startDate,endDate,language) => get(`/report/bonus_outline/download/${id}?&start_date=${startDate}&end_date=${endDate}&language=${language}`)

    /* 5.4 獎池 */
    export const apiGetPrize = (page,startDate,endDate,username) => get(`/report/banker_prize_outline?page=${page}&start_date=${startDate}&end_date=${endDate}&username=${username}`)
    export const apiGetPrizeDetail = (id,page,startDate,endDate) => get(`/report/banker_prize_outline/detail/${id}?page=${page}&start_date=${startDate}&end_date=${endDate}`)
    export const apiDownloadPrize = (startDate,endDate,language) => get(`/report/banker_prize_outline/download?start_date=${startDate}&end_date=${endDate}&language=${language}`)
    export const apiDownloadPrizeDetail = (id,startDate,endDate,language) => get(`/report/banker_prize_outline/detail/download/${id}?start_date=${startDate}&end_date=${endDate}&language=${language}`)

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 6.客服 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    export const apiPostCustomerMsg = (payload) => post(`/customer_service`, payload) //向管理員發送客服信件
    export const apiPostReplyCustomerMsg = (id, payload) => post(`/customer_service/${id}`, payload) //回覆管理員的信件
    export const apiGetImage = (id, payload) => get(`/images/${id}`, payload) //看照片
    export const apiGetQuestionAnswerCenter = (page,service_type) => get(`/customer_service?service_status=10&page=${page}&service_type=${service_type}`) //取得客訴處理階段
    export const apiGetCustomerServiceHistory = (page,start,end) => get(`/customer_service?service_status=90&page=${page}&start=${start}T00:00:00&end=${end}T23:59:59`) //取得客訴歷史紀錄
    export const apiSearchCustomerEventsParameter = (page, startDate, endDate, service_type) => 
        get(`/customer_service?page=${page}&service_status=90&start=${startDate}T00:00:00&end=${endDate}T23:59:59&service_type=${service_type}`)

//        _    _           _____________________
//       (_`,_' )         /                      \
//      /    ', |        /                        \
//      |       `,      /                          \
//       \,_  `-/      /                            \
//       ,&&&&&V      /______________________________\
//     ,&&&&&&&&&:    |                              |
//     &&&&&&&&&&&;   |                              |
//    / &&&&&&&&& |   |          下面是 ↓ ↓ ↓         |
//   |       :\   \   |         非目錄選單的API       |
//    \  \       ; \  |                              |
//     '--'   `, /`-' |                              |
//       /`.    \     |______________________________|
//      /   /\  _\     \                            /
//      \   \ \/  \     \                          /
//       \__'  \__/      \________________________/


// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 登入 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
export const apiUserLogin = (username, password) => post(`/login`,{username, password})

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 忘記密碼 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
export const apiPostSendForgetEmail = (payload) => post(`/password/forget`,payload) //發送'忘記密碼'的驗證信
export const apiPostVerifyForgetToken = (payload) => post(`/password/forget/verify`,payload) //驗證'忘記密碼'信的token
export const apiPostRestPassword = (payload) => post(`/password/forget/reset`,payload) //重設密碼

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 驗證信箱 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
export const apiPostSendVerifyEmail = (payload) => post(`/verify/email`,payload) //發送'信箱驗證'的驗證信
export const apiPostVerifyEmailToken = (payload) => post(`/verify/token`,payload) //驗證'信箱驗證'信的token

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 個人資料 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
export const apiGetBankerProfile = () => get(`/my-info`)
export const apiPutBankerProfile = (payload) => put(`/my-info`, payload)
export const apiResetPassword = (payload) => put(`/reset_password`, payload)
export const apiPostSendVerifyPhone = (payload) => post(`/verify/phone`,payload) //發送'手機驗證'的簡訊
export const apiPostVerifyPhoneCode = (payload) => post(`/verify/code`,payload) //驗證'手機驗證'的數字

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 通知 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
export const apiGetEvent = (page) => get(`/event?page=${page}`) //取得通知
export const apiDeleteEvent = (payload) => post(`/event`,payload) //刪除通知
export const apiGetEventFilter = (page,group) => get(`/event?page=${page}&group=${group}`) //取得通知
export const apiGetNotReadEventTotal = () => get(`/event/unread/count`) //取得"未讀"通知總數
export const apiPutEventRead = (event_id,payload) => put(`/event/read/${event_id}`,payload) //將通知變已讀
export const apiPutAllEventRead = (payload) => put(`/event/read/all`,payload) //將所有通知變已讀

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 通知 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
export const apiGetOnlineCounts = () => get(`/online_counts`) //取得在線人數

// ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 可交易幣別 ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
export const apiGetTransactionCurrency = () => get(`/deal_currency/open_currency`) // 帳戶、交易專用幣別
export const apiGetOrderTransactionCurrency = () => get(`/orders/open_currency`) //市場專用幣別