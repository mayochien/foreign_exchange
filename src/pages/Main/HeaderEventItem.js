import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { DropdownItem } from 'reactstrap';
import { EVENT_TYPE,EVENT_TYPE_GROUP } from '../../const'
import {apiPutEventRead,
 } from '../../services/apiService'
 import Format from '../../services/Format';

class HeaderEventItem extends Component {


  // ---------- api:put 點擊單筆通知 ----------
  onClickNotifyItem = async() => {
    let {dispatch, actions, event_type,related_id,id} = this.props
    let sub_deposit_id
    try {
      sub_deposit_id = this.props.related_info.sub_deposit_id
    }catch(e){
      console.log(e)
    }
    // console.log(sub_deposit_id)
    dispatch(actions.readNotifyevent(event_type,related_id,id,sub_deposit_id));

    switch (this.props.event_type) {
      case 112: //存款單逾時
        window.location.href = `/#/deposit/deposit-detail/${this.props.related_id}`
        break;
      case 201: //有人對您的掛單出價
        window.location.href = `/#/exchange/order-pending-sell-single/${this.props.related_id}`
        break;
      case 2010: //掛單方已接受出價
      window.location.href = `/#/exchange/order-pending-buy-single/${this.props.related_id}`
        break;
      case 211: //掛單方已轉帳，請確認是否入帳
        window.location.href = `/#/exchange/order-pending-buy-single/${this.props.related_id}`
        break;
      case 2120: //出價方已確認入帳
        window.location.href = `/#/exchange/order-pending-sell-single/${this.props.related_id}`
        break;
      case 2110: //出價方已轉帳，請確認是否入帳
        window.location.href = `/#/exchange/order-pending-sell-single/${this.props.related_id}`
        break;
      case 261: //交易完成
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 291: //交易失敗
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 2910: //交易失敗
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 292: //掛單方拒絕交易
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 2920: //掛單方拒絕交易
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 293: //您已取消交易
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 2930: //您已取消交易
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 294: //掛單方看過單據，請等待
        window.location.href = `/#/exchange/order-pending-buy-single/${this.props.related_id}`
        break;
      case 2940: //出價方看過單據，請等待
        window.location.href = `/#/exchange/order-pending-sell-single/${this.props.related_id}`
        break;
      case 295: //交易逾時
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 2950: //交易逾時
        window.location.href = `/#/exchange/exchange-record-single/${this.props.related_id}`
        break;
      case 296: //此掛單已有其他排定的交易，無法滿足您的出價數量
        window.location.href = `/#/exchange/order-pending-buy-single/${this.props.related_id}`
        break
      case 904: //有代理新建會員
        window.location.href = `/#/customer/member-list/${this.props.related_id}`
        break;
      case 1101: //存款申請成功
        window.location.href = `/#/deposit/deposit-detail/${this.props.related_id}`
        break;
      case 1102: //存款申請失敗，請聯絡客服中心
        window.location.href = `/#/deposit/deposit-detail/${this.props.related_id}`
        break;
      case 1191: //存款明細審核成功
        window.location.href = `/#/deposit/deposit-detail/${this.props.related_id}`
        break;
      case 1192: //存款明細審核失敗，請聯絡客服中心
        window.location.href = `/#/deposit/deposit-detail/${this.props.related_id}`
        break;
      case 1193: //管理員分配儲值銀行帳號給存款單
        window.location.href = `/#/deposit/deposit-detail/${this.props.related_id}`
        break;
      case 1200: //來自管理員的回覆
        window.location.href = `/#/service/QA-center/${this.props.related_info.customer_service_id}`
        break;
      case 1201: //管理員結束一則對話
        window.location.href = `/#/service/history/${this.props.related_info.customer_service_id}`
        break;
      case 401: //您有新匹配的掛單
      window.location.href = `/#/exchange/order-pending-sell-single/${this.props.related_id}`
        break;
      case 1301: //管理員已接受提款申請
        window.location.href = `/#/withdraw/withdraw-list/${this.props.related_id}`
        break;
      case 1302: // 管理員已拒絕提款申請
        window.location.href = `/#/withdraw/withdraw-list/${this.props.related_id}`
        break;
      case 1303: //管理員已上傳匯款單據
        window.location.href = `/#/withdraw/withdraw-list/${this.props.related_id}`
        break;
      default:
        break;
    }

    // ---------- api:put 將(未讀)通知 更改為已讀 ----------
    if(this.props.status===0){
      try {
        let res = await apiPutEventRead(this.props.id)
        if(res.data.code===1){
          this.props.refreshData()
          console.log('修改-編號',this.props.id,'通知成功')
        }
      }catch (err) {
        console.log(err)
        console.log('修改已讀失敗')
      }
    }
  }

  // ========== 通知顏色分類 ==========
  showEventTypeBackground = () =>{
    switch (this.props.event_group) {
      case 2:
        return 'notify-bg-deposit' //存款
      case 3:
        return 'notify-bg-transaction' //交易
      case 4:
        return 'notify-bg-service' //客服
      case 5:
        return 'notify-bg-account' //帳號
      case 6:
        return 'notify-bg-withdraw'  //提款
      default:
        break;
    }
  }

  // ========== 判別顯示哪種id ==========
  showEventId = () =>{
    let type = EVENT_TYPE_GROUP[this.props.event_type]
    if( type===1191 || type===1192 ){
      return this.props.related_info.sub_deposit_id
    }
    else if( type===112){
      return this.props.related_info.deposit_id
    }
    else{
      return this.props.related_id
    }
  }

  // ========== 判別顯示哪種文字內容 ==========
  showEventText = () => {
    let {t} = this.props
    //有新的出價通知，要顯示幣別、匯率
    if(this.props.event_type===201  //有人對您的掛單出價 【掛單方】
      || this.props.event_type===2610  // 交易完成 【掛單方】
      || this.props.event_type===2950 // 交易逾時 【掛單方】
      || this.props.event_type===401 // 您有新匹配的掛單(來自爾德命) 【掛單方】

      || this.props.event_type===2010 // 掛單方已接受您的出價 (出價方)
      || this.props.event_type===292 // 掛單方拒絕交易 (出價方)
      || this.props.event_type===261 // 交易完成 (出價方)
      || this.props.event_type===295 // 交易逾時 (出價方)
      || this.props.event_type===296 // 此掛單已有其他排定的交易，無法滿足您的出價數量 (出價方)
     ){ 
        let amount = Format.thousands(this.props.related_info.amount)
        let seller_currency = this.props.related_info.seller_currency
        let currency_rate = this.props.related_info.currency_rate

     if(this.props.related_info.amount===undefined
       || this.props.related_info.currency_rate===undefined){ 
       //如果沒有這兩個值就不顯示
       return t(EVENT_TYPE[this.props.event_type]) 
     }
     else{
       return t(EVENT_TYPE[this.props.event_type]) 
       + ' - ' + t('app.amount') + ' ' + amount + ' ' + seller_currency
       + ' / ' + t('app.rate')  + ' ' + currency_rate 
     }
   }
    else{
      return t(EVENT_TYPE[this.props.event_type])
    }
  }


  render() {
    // console.log('this.props:',this.props)
    // console.log(this.props.id,'-',this.state.state_hasRead)
    const { t } = this.props;

    return (
      <DropdownItem 
       className={this.props.status===0?
       "dropdown-item item-not-read":"dropdown-item item-have-read"}
       onClick={()=>this.onClickNotifyItem()}>
   
        <span className={this.props.status===0?"red-dot":"transparent-dot"}>
          ●
        </span>
        <span>
          <span className={`${this.showEventTypeBackground()} type-group`}>
            {t(EVENT_TYPE_GROUP[this.props.event_group])}
          </span>

          {t('app.id')} 

          {this.showEventId()}

          &nbsp; - &nbsp;{this.showEventText()}

          <br/>

          {this.props.create_datetime}

        </span>
      </DropdownItem>
    );
  }
}

export default withTranslation()(HeaderEventItem);

