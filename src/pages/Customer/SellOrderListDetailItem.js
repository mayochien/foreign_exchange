import React from 'react';
import {withTranslation} from 'react-i18next';
// import { MdEdit, MdDone, MdClear, MdShoppingCart } from "react-icons/md";
// import { apiPostOrderBuy } from '../../services/apiService'
// import SweetAlert from 'sweetalert-react';
import Format from '../../services/Format';


class SellOrderListDetailItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
    }
  }

   // ========== 功能:顯示目前進行的階段 (買家)==========
   showNowStage = (key_stage) => {
    let {t} = this.props
    switch(key_stage) {
      case 0:
        return <span>
                {t('app.buyer_seller_refuse_trade')}
              </span>; //掛單方拒絕交易
      case 1:
        return <span>
                {t('app.buyer_you_cancel_trade')}
               </span>; //您已取消交易
      case 2:
        return <span>
                {t('app.transaction_fail')}
               </span>; //交易失敗
      case 3:
      return <span className="text-failed">
              {t('EVENT_TYPE.OFFER_RECEIVE_DEAL_EXPIRE')}
              </span>; //交易逾時
      case 10:
        return <span>
                (1) {t('app.buyer_waiting_seller_accept')}
               </span>; //等待掛單方接受交易
      case 20:
        return <span>
                (2) {t('app.buyer_waiting_seller_payment')}
              </span>; //等待掛單方付款
      case 30:
        return <span>
                (3) {t('app.buyer_confirm_seller_receipt')}
              </span>; //確認掛單方帳戶
      case 40:
        return <span>
                (4) {t('app.buyer_send_money_and_upload_receipt')}
              </span>; //請匯款並上傳單據
      case 50:
        return <span>
                (5) {t('app.buyer_waiting_seller_final_confirm')}
              </span>; //等待掛單方確認收款
      case 60:
        return <span>
                {t('app.transaction_completed')}
              </span>; //交易已完成
      default:
        return '';
    }
  }

  showConfirmMethod = (key_stage) => {
    let {t} = this.props
    if(key_stage===60){
      return t('app.user')
    }
  }


  render(){
    let {t} = this.props
    let deal_fee = (this.props.buyer_amount * this.props.exchange_fee_rate * this.props.deal_fee_rate)


    return (
        <tr className={this.props.stage<5?"text-failed":''}>
          <td>{this.props.id}</td>

          {this.props.show_serialNumber?
            <td>{this.props.serial_number}</td>
            :<td></td>
          }
          
          {/* 掛單方貨幣 */}
          {this.props.current_user_id===this.props.seller_id?
            <td className="text-primary-l-5">
              {t('app.myself')}
            </td>
            :
            <td>
              {this.props.seller_username}
            </td>
          }

          {/* 掛單方貨幣 */}
          <td>{this.props.seller_currency}</td>

          {/* 掛單方成交量 */}
          <td>{Format.thousandsMathRound3(this.props.buyer_amount)}</td>

          {/* 匯率 */}
          <td>{this.props.currency_rate}</td>

          {/* 手續費 */}
          <td>
            {this.props.stage<5? ' - ':
              deal_fee<0.05? Format.thousandsToFix6(deal_fee) : Format.thousandsToFix3(deal_fee)
            }
          </td>

          {/* 出價方 */}
          {this.props.current_user_id===this.props.buyer_id?
            <td className="text-primary-l-5">
              {t('app.myself')}
            </td>
            :
            <td>
              {this.props.buyer_username}
            </td>
          }

          {/* 出價方貨幣 */}
          <td>{this.props.buyer_currency}</td>

          {/* 出價方成交量 */}
          <td>{Format.thousandsMathRound3(this.props.buyer_amount*this.props.currency_rate)}</td>

          {/* 目前階段 */}
          <td>{this.showNowStage(this.props.stage)}</td>

          <td>{this.props.update_datetime}</td>
        </tr>
      )
    }
}

export default withTranslation()(SellOrderListDetailItem);