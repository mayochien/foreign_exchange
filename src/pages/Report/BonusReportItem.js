import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MdMenu } from "react-icons/md";
import Format from '../../services/Format'


class BonusReportItem extends Component {
  state = {
  }

  showNullLine=(value)=>{
    if(value === ''|| value===null){
      return <span>-</span>
    }
    else{
      return Math.floor(value*1000)/1000
    }
  }

 
  render() {
    // const { t } = this.props;
    // console.log(this.props);
    let { user_id, startDate ,endDate , selectedTime } = this.props
    
    return (
      <tr className="tr-vertical-line">
        <td>{this.props.user_id}</td>
        <td>{this.props.username}</td>
        <td>{Format.thousandsMathRound3(this.props.trading_amount)}</td>
        <td>{this.showNullLine(Format.thousandsMathRound3(this.props.promote_bonus))}</td>
        <td>
          <button className="detail-btn">
            <Link to={`/report/bonus-detail/${user_id}/${startDate}/${endDate}/${selectedTime}`}>
              <MdMenu/>
            </Link>
          </button>
        </td>
      </tr>
    );
  }
}

export default withTranslation()(BonusReportItem);
