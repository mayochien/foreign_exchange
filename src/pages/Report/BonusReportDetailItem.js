import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import store from '../../store'
import  Format  from '../../services/Format';


class BonusReportDetailItem extends Component {
  state = {
  }

 
  render() {
    const { t } = this.props;
    // console.log(store.getState());
    
    return (
      <tr className="tr-vertical-line">
          <td>{this.props.id}</td>

          {this.props.show_serialNumber?
            <td>{this.props.serial_number}</td>
            :<td></td>
          }

          {/* 掛單方 */}
          {store.getState().UserReducer.user.username === this.props.seller_username?
            <td className="text-yellow">
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
          <td>{Format.thousandsMathRound3(this.props.seller_amount)}</td>

          {/* 匯率 */}
          <td>{this.props.currency_rate}</td>

          {/* 手續費 */}
          <td>
            {this.props.stage<5? ' - ':
              this.props.deal_fee<0.05?Format.thousandsToFix6(this.props.deal_fee):Format.thousandsToFix3(this.props.deal_fee)
            }
          </td>

          {/* 出價方 */}
          {store.getState().UserReducer.user.username === this.props.buyer_username?
            <td className="text-yellow">
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
          <td>{Format.thousandsMathRound3(this.props.buyer_amount)}</td>

          <td>{Format.thousandsMathRound3(this.props.trading_amount)}</td>

          <td>{Format.thousandsMathRound3(this.props.promote_bonus_amount)}</td>
          
          <td>{this.props.update_datetime}</td>

      </tr>
    );
  }
}

export default withTranslation()(BonusReportDetailItem);
