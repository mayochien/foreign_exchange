import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
// import { MdEdit, MdDone, MdClear } from "react-icons/md";
// import { apiPostVerify, 
//         apiPostUploadDepositReceipt,
//         apiGetDepositBank,
//         apiGetUploadReceipt } from '../../services/apiService';
import { DEPOSIT_MAIN_STATUS, CURRENCIES_STR} from '../../const';
// import { MdZoomIn, MdClear } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom'
import  Format  from '../../services/Format';


class DepositListItem extends Component {

  state = {
    modifiable: false,
    unverifiedDepositList: [],
    state_remark: this.props.remark,
    imagePreviewUrl:'',
    isOpenUploadPhoto:false,
    isOpenBankAccountVerify:false,
  }

  showNullLine = (value) => {
    if(value==='' || value===undefined){
      return '-'
    }
    else{
      return value
    }
  }


  render() {
    const { t } = this.props;

    //計算：有審核通過的子單 > 的數量加總
    let data_sub_deposit_ticket = this.props.sub_deposit_ticket
    let filter_pass_ticket = data_sub_deposit_ticket.filter(item => (item.status === 40 ))
    let pass_ticket_amount_total = 0
    for (var i=0; i < filter_pass_ticket.length; i++) {
      pass_ticket_amount_total += filter_pass_ticket[i].amount;
    }

    
    return (
      <React.Fragment>
        <tr className={this.props.status===2?"text-failed":''}>
          <td>{this.props.id}</td>

          {this.props.show_serialNumber?
            <td>{this.props.serial_number}</td>
            :<td></td>
          }

          <td>{CURRENCIES_STR[this.props.currency]}</td>
          <td>{Format.thousandsMathRound3(this.props.amount)}</td>
          <td>{Format.thousandsMathRound3(pass_ticket_amount_total)}</td>
          <td>{Format.thousandsMathRound3(pass_ticket_amount_total*this.props.exchange_rate)}</td>
          <td className={this.props.status>30?"text-failed":""}>
            {t(DEPOSIT_MAIN_STATUS[this.props.status])}
          </td>
          <td >
            <Link to={`/deposit/deposit-detail/${this.props.id}`}
              className="btn-page-link">
              <FaSearch/>
            </Link>
          </td>
          <td>{this.props.create_datetime}</td>
          <td>{this.showNullLine(this.props.remark)}</td>
        </tr>
      </React.Fragment>
    );
  }
}

export default withTranslation()(DepositListItem);
