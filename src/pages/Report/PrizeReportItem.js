import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MdMenu } from "react-icons/md";
import  Format  from '../../services/Format';


class PrizeReportItem extends Component {
  state = {
  }
 
  render() {
    // const { t } = this.props;
    let { user_id, startDate ,endDate , selectedTime } = this.props
    
    return (
      <tr className="tr-vertical-line">
        <td>{this.props.upline_username}</td>
        <td>{this.props.username}</td>
        <td>{Format.thousandsMathRound3(this.props.trading_amount)}</td>
        <td>
          <button className="detail-btn">
            <Link to={`/report/prize-detail/${user_id}/${startDate}/${endDate}/${selectedTime}`}>
              <MdMenu/>
            </Link>
          </button>
        </td>
      </tr>
    );
  }
}

export default withTranslation()(PrizeReportItem);
