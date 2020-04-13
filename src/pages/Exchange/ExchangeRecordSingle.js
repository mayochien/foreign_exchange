import React from 'react';
import { apiGetDealNoteSingle } from '../../services/apiService'
import ExchangeRecordItem from './ExchangeRecordItem'
import {withTranslation} from 'react-i18next';
import { FaEye, FaAngleLeft } from "react-icons/fa";


class ExchangeRecordSingle extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      orderList:[],
      show_serialNumber:false,
    }
  }

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
    });
  }

  getInitialData = async() => { // 初始載入
    // console.log('this.props:',this.props)
    // console.log('props.params:',this.props.match.params.id)
    let data_id = this.props.match.params.id
    try {
      let resultList = await apiGetDealNoteSingle(data_id)
      // console.log(resultList.data)
      this.setState({
        orderList:resultList.data.data.deal_note, // 顯示的清單
      })
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getInitialData()
  }

  componentDidUpdate(prevProps, prevState) { // 通知id不同時，刷新頁面
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getInitialData()
    }
  }


  render(){
    let {t} = this.props
    let {orderList} = this.state;


    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="header text-center">
                <h4 className="title">{t('app.exchange_record')}</h4>
              </div>


              <div className="content table-responsive table-full-width">
                
                <table className="table table-exchange">
                  <thead>
                    <tr>
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
                      
                      <th>{t('app.seller')}</th>
                      <th>{t('app.seller_currency')}</th>
                      <th>{t('app.seller_amount')}</th>

                      <th>{t('app.currency_rate')}</th>
                      <th>{t('app.deal_fee')} (HKD)</th>

                      <th>{t('app.buyer')}</th>
                      <th>{t('app.buyer_currency')}</th>
                      <th>{t('app.buyer_amount')}</th> 

                      <th>{t('app.stage')}</th>
                      <th>{t('app.update_datetime')}</th>
                    </tr>
                  </thead>
                  {orderList instanceof Array
                    && orderList.length !== 0 ? 
                    <tbody>
                      {orderList.map((item,index) => 
                        <ExchangeRecordItem
                        key={index}
                        index={index}
                        {...item}
                        refreshData={this.getInitialData.bind(this,1)}
                        show_serialNumber = {this.state.show_serialNumber}
                        >
                        </ExchangeRecordItem>)
                      }
                    </tbody>
                    :<tbody >
                      <td className="table-no-data" colSpan="20">
                        {t('app.no_data')}
                      </td>
                    </tbody>
                  }
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(ExchangeRecordSingle);
