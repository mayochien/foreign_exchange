import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { EVENT_TYPE, EVENT_TYPE_GROUP } from '../../const';
import { FaSearch } from "react-icons/fa";
// import { Link } from 'react-router-dom'
import Format from '../../services/Format';
class NotificationtListItem extends Component {

  state = {
    modifiable: false,
    // checked: this.props.initialChecked
  }

  // ---------- api:put 點擊單筆通知 ----------
  onClickNotifyItem = () => {
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
    case 296: //此掛單已有其他排定的交易，無法滿足您的出價數量
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
  }

    // ========== submit成功訊息 ==========
    showSubmitSuccess = () => {
    let {t} = this.props
    this.setState({
      state_success_message:
      <span className="text-green">
        {t('app.success')}
      </span>
    })
    setTimeout(() => {
      this.setState({
        state_success_message:'',
        state_error_message:''
      });
      this.onCloseAllModal()
    }, 1500)
  }

  // ========== 功能:關閉所有Modal ==========
  onCloseAllModal = () => {
    this.setState({ 
      isOpenUploadPhoto: false,
      isOpenBankAccountVerify:false
    });
  };

  showNullLine = (value) => {
    // console.log(value)
    if(value==='' || value===undefined || value===0 || value==="0.000"){
      return '-'
    }
    else{
      return value
    }
  }

  //  ========== submit失敗訊息 ==========
  showSubmitError = () => {
    let {t} = this.props
    this.setState({
      state_error_message:<span className="text-red">
      {t('app.fail')}
      </span>
    })
    setTimeout(() => {
      this.setState({
        state_error_message:'',
        state_success_message:''
      })
    }, 1500)
  }

  // ========== 通知顏色分類 ==========
  showEventTypeColor = () => {
    switch (this.props.event_group) {
      case 2:
        return 'notify-color-deposit'
      case 3:
        return 'notify-color-transaction'
      case 4:
        return 'notify-color-service'
      case 5:
        return 'notify-color-account'
      case 6:
        return 'notify-color-withdraw'
      default:
        break;
    }
  }

  // ========== 判別顯示哪種id ==========
  showEventId = () => {
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
    // console.log(this.props.related_info.seller_currency===undefined);
    // console.log(this.props.related_info.currency_rate===undefined);
    let {t} = this.props
    //有新的出價通知，要顯示幣別、匯率
    if(this.props.event_type===201  //有人對您的掛單出價 【掛單方】
       || this.props.event_type===2610  // 交易完成 【掛單方】
       || this.props.event_type===2950 // 交易逾時 【掛單方】
       || this.props.event_type===401 // 您有新匹配的掛單(來自爾德命) 【掛單方】

       || this.props.event_type===2010 // 掛單方已接受您的出價 (出價方)
       || this.props.event_type===261 // 交易完成 (出價方)
       || this.props.event_type===292 // 掛單方拒絕交易 (出價方)
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

  onChangeCheck = () => {
    let newState = !this.state.checked;
    let checkId = this.props.id
    this.setState({
      checked: !this.state.checked,
    })
    this.props.callbackParent(newState,checkId);
  }



  render() {
    const { t } = this.props;
    // console.log(this.state.checked);
    // console.log(this.props.fatherIsCheckAll);

    
    return (
        <tr className={this.showEventTypeColor()}>

          <td className="td-notify-checkbox">
            <input className="notify-checkbox-input mr-25" 
              type="checkbox" 
              checked={this.props.fatherIsCheckAll?true:this.state.checked}
              onChange={this.onChangeCheck}
            />
            <span className="blank-box"></span>
          </td>
          
          <td>{this.props.id}</td>
          <td>{t(EVENT_TYPE_GROUP[this.props.event_group])}</td>
          <td>{this.showEventText()}</td>
          <td>{this.showEventId()}</td>
          <td> 
            <button onClick={()=>this.onClickNotifyItem()}
              className="btn-table-link">
              <FaSearch/>
            </button> 
            {/* 無法使用Link，連結的判斷式還沒跑完，to=空值，頁面會爆掉 ↓↓↓  */}
            {/* <Link to={this.onClickNotifyItem()}
              className="btn-page-link">
              <FaSearch/>
            </Link> */}
          </td>
          <td>{this.props.create_datetime}</td>
        </tr>
    );
  }
}

export default withTranslation()(NotificationtListItem);
