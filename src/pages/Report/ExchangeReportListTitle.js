import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Collapse } from 'reactstrap';
import { apiGetExchangeReportItem } from '../../services/apiService';
import { CURRENCIES_ID } from '../../const';
import moment from "moment";
import { MdMenu } from "react-icons/md";
import { FaEye, FaAngleLeft } from "react-icons/fa";
import  Format  from '../../services/Format';


// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// ▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍子層項目 (父層在下面) ▍▍▍▍▍▍▍▍▍▍▍▍▍▍
// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
class ExchangeReportListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList:[]
    }
  }
  render() {
    let {t} = this.props
    return(
      <tr className="er-item-tbody-tr tr-vertical-line">
        <td>{this.props.id}</td> {/* 編號 */}
        {this.props.show_serialNumber?
            <td>{this.props.serial_number}</td>
            :<td></td>
          }
        <td>{this.props.update_datetime}</td> {/* 時間 */}
        <td>{/* 3.換匯種類 */}
          {this.props.deal_type==="buyer"?
           t('app.buy'):t('app.sell')}
        </td>
        <td>{/* 4.換匯內容 */}
          {this.props.seller_currency} -> {this.props.buyer_currency}
        </td> 
        <td>{Format.thousandsMathRound3(this.props.buyer_amount)}</td>   {/* 5.成交量 */}

        <td>{this.props.currency_rate}</td>  {/* 6.匯率 */}

        {/* 7.出款幣別 */}
        <td>
          {this.props.deal_type==="buyer"?
           this.props.buyer_currency:this.props.seller_currency}
        </td>

        {/* 8.出款金額 */}
        <td>
          {this.props.deal_type==="buyer"?
            Format.thousandsMathRound3(this.props.buyer_amount*this.props.currency_rate)
            :
            Format.thousandsMathRound3(this.props.buyer_amount)
          }
        </td> 

        {/* 9.收款幣別 */}
        <td>
          {this.props.deal_type==="buyer"? this.props.seller_currency: this.props.buyer_currency}
        </td>

        <td> {/* 收款金額 */}
          {this.props.deal_type==="buyer"?
            Format.thousandsMathRound3(this.props.buyer_amount)
            :
            Format.thousandsMathRound3(this.props.buyer_amount*this.props.currency_rate)
          }
        </td> 

        <td> {/* 收入 */}
          {this.props.amount_type==="income"?
           Format.thousandsMathRound3(this.props.amount)
           :'-'}
        </td> 
        <td> {/* 支出 */}
          {this.props.amount_type==="outcome"?
            Format.thousandsMathRound3(this.props.amount)
          :'-'}
        </td>
      </tr>
    )
  }
}




// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
// ▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍ 父層標題)  ▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍▍
// ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇

class ExchangeReportListTitle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList:[],
      isOpen:false,
      setIsOpen:false,
      startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
      show_serialNumber:false,
    }
  }

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
      shineBackgrounf:true
    });
  }

  toggle = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  }

  // ========== 1. api-get:查看匯款的帳戶==========
  getReportItem = async () => {
    let currency_id = CURRENCIES_ID[this.props.currency]
    let startDate = this.props.prop_startDate
    let endDate = this.props.prop_endDate
    // console.log(currency_id, startDate, endDate)
    try {
      let res = await apiGetExchangeReportItem(currency_id, startDate, endDate)
      if(res.data.code===1){
        let resultData = res.data.data.exchange_report
        this.setState({
          dataList:resultData
        })
      }
    }catch(err) {
      console.log(err);
    }
  };

  componentDidMount(){
    this.getReportItem()
  }


  render() {
    const { t, amount } = this.props;
    let {dataList} = this.state
    let total_income = 0
    let total_expenses = 0
    // console.log(this.props);

    let incomeDataArr = dataList.filter(item => item.amount_type==="income")
    incomeDataArr.map( item=> (total_income += item.amount) )

    let expensesDataArr = dataList.filter(item => item.amount_type==="outcome")
    expensesDataArr.map( item=> (total_expenses += item.amount) )
    
    return (
      <tr className="table-tr-exchange-report">
        <td className="table-td-exchange-report" colSpan="12">
          
          <div onClick={this.toggle} 
           className={this.state.isOpen?"title-info title-active":"title-info"} >
            <span className="title-currency">{this.props.currency}</span>
            <span className="title-spacing">/</span> 
            <span 
             className={amount<1?"title-amount text-red":"title-amount text-green"}>
               {Format.thousandsMathRound3(this.props.amount)}
            </span>
            <span className="title-menu-icon"><MdMenu/></span>
          </div>

          <Collapse isOpen={this.state.isOpen} 
           className="exchange-report-item-collapse">
            {!dataList instanceof Array
              || dataList.length === 0 ?
              <table className="table table-exchange mb-0">
                <tr className="er-item-tr">
                  <td className="table-no-data-er-item" colSpan="20">
                    {t('app.no_data')}
                  </td>
                </tr>
              </table>
              :
              <table className="table table-exchange mb-0">
                <thead className="er-item-thead">
                  <tr className="er-item-thead-tr">
                    <th>{t('app.id')}</th>

                    {this.state.show_serialNumber?
                      <th className="th-no-data">
                        {t('app.serial_number')} 
                        <button className="btn-open-serial-number ml-5"
                          onClick={this.openSerialNumber}>
                          <FaAngleLeft/>
                        </button>
                      </th> 
                      :
                      <th className="th-no-data">
                        {t('app.serial_number')} 
                        <button className="btn-open-serial-number  ml-5"
                          onClick={this.openSerialNumber}>
                          <FaEye/>                          
                        </button>
                      </th>
                    }

                    <th>{t('app.update_datetime')}</th>
                    <th>{t('app.exchange_type')}</th> {/* 換匯種類 */}
                    <th>{t('app.exchange_content')}</th> {/* 換匯內容 */}
                    <th>{t('app.amount')}</th> 
      
                    <th>{t('app.rate')}</th>
                    <th>{t('app.expenses_currency')}</th>  {/* 出款幣別 */}
                    <th>{t('app.expenses_amount')}</th> {/* 出款金額 */}
                    <th>{t('app.income_currency')}</th> {/* 收款幣別 */}
                    <th>{t('app.income_amount')}</th> {/* 收款金額 */}
      
                    <th>{t('app.income')}</th>
                    <th>{t('app.expenses')}</th>
                  </tr>
                </thead>
                <tbody className="er-item-tbody">
                  {dataList.map((item,index) => (
                    <ExchangeReportListItem
                      key={index}
                      index={index}
                      {...item}
                      t={this.props.t}
                      show_serialNumber = {this.state.show_serialNumber}
                    >
                    </ExchangeReportListItem>))}
                    <tr className="tr-total-text">
                        <td>{t('app.total')}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>         
                          {total_income?
                            Format.thousandsMathRound3(total_income)
                          :'0'}
                        </td>
                        <td>
                          {total_expenses?
                            Format.thousandsMathRound3(total_expenses)
                          :'0'}
                        </td>
                    </tr>
                </tbody>
              </table>
            }
          </Collapse>
        </td>
      </tr>
    );
  }
}

export default withTranslation()(ExchangeReportListTitle);



