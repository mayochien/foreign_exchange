import React from 'react';
import { apiGetSellerPendingSingle } from '../../services/apiService'
import OrderPendingSellItem from './OrderPendingSellItem'
import {withTranslation} from 'react-i18next';
import { FaEye, FaAngleLeft } from "react-icons/fa";


class OrderPendingSell_single extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      pendingList:[],
      show_serialNumber:false,
    }
  }

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
    });
  }

  getInitialData = async() => {
    // console.log(this.props.match.params.id)
    let data_id = this.props.match.params.id
    try {
      let res = await apiGetSellerPendingSingle(data_id)
      if(res.data.code===1){
        this.setState({
          pendingList:res.data.data.deal_cache.filter(item=>item.stage>3),
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getInitialData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pendingList !== this.state.pendingList) {
      setTimeout(()=>{
        this.getInitialData()
        console.log('掛單頁(單筆)刷新',new Date().getMinutes(),':',new Date().getSeconds())
      },5000)
    }
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getInitialData()
    }
  }

  render(){
    let {t} = this.props
    let {pendingList} = this.state

    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="header text-center">
                <h4 className="title">{t('app.my_selling_list')} ({t('app.in_transaction')})</h4>
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

                      <th>{t('app.order_id')}</th>
                      <th>{t('app.buyer')}{t('app.name')}</th>
                      <th>{t('app.buyer')}{t('app.rate')}</th>
                      <th>{t('app.buyer')}{t('app.currency_type')}</th>

                      <th>{t('app.deal')}{t('app.amount')}</th>
                      <th>{t('app.seller')}{t('app.currency_type')}</th>
                      <th>{t('app.deal')}{t('app.price')}</th>
                      <th>{t('app.confirm_this_trade')}</th>
                      <th>{t('app.check_account')}</th>
                      <th>{t('app.upload_image')}</th>

                      <th>
                        {t('app.confirm_image')}
                        {t('app.confirm_completed')}
                      </th>
                      <th>{t('app.stage')}</th>
                      <th>{t('app.update_datetime')}</th>
                    </tr>
                  </thead>
                  {!pendingList instanceof Array
                    || pendingList.length === 0 ?
                    <td className="table-no-data" colSpan="20">
                      {t('app.no_data')}
                    </td>
                    :
                    <tbody>
                      {pendingList.map((item,index) => 
                        <OrderPendingSellItem
                        key={index}
                        index={index}
                        {...item}
                        refreshData={this.getInitialData.bind(this,1)}
                        show_serialNumber = {this.state.show_serialNumber}
                        >
                        </OrderPendingSellItem>)}
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
export default withTranslation()(OrderPendingSell_single);