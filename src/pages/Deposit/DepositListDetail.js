import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { DEPOSIT_MAIN_STATUS, CURRENCIES_STR} from '../../const';
import { apiGetDepositSingle } from '../../services/apiService';
import DepositListDetailItem  from './DepositListDetailItem';
import { TiArrowBack } from "react-icons/ti";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from 'react-spinners';
import  Format  from '../../services/Format';


class DepositListDetail extends Component {

  state = {
    depositDetail:[],
    depositDetailItem: [],
    loading: true
  };

  showNullLine = (value) => {
    if(value==='' || value===undefined){
      return '-'
    }
    else{
      return value
    }
  }

  getInitialData = async() => { // 初始載入
    // console.log('props.params:',this.props.match.params.id)
    let data_id = this.props.match.params.id

    try {
      let resultList = await apiGetDepositSingle(data_id);
      this.setState({
        depositDetail: resultList.data.data.deposits[0],
        depositDetailItem: resultList.data.data.deposits[0].sub_deposit_ticket,
      })
    } catch(err) {
      console.log(err);
    }
  }

  showLoading = () => {
    this.setState({
      showLoading:true,
    },()=>{
      setTimeout(() => {
        this.setState({
          showLoading:false,
        })
      }, 500);
    })
  }

  componentDidMount() {
    this.getInitialData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.depositDetail !== this.state.depositDetail) {
      setTimeout(()=>{
        this.getInitialData()
        // console.log('存款詳細頁(單筆)刷新',new Date().getMinutes(),':',new Date().getSeconds())
      },5000)
    }
  }

  componentWillReceiveProps(nextProps){ //點不同通知時，顯示刷新頁面效果
    if(this.props.match.params.id !== nextProps.match.params.id){
      this.showLoading()
    }
  }


  render() {
    // console.log('this.props::',this.props)


    // let depositDetailItem_id = this.props.user.sub_deposit_id
    // console.log(depositDetailItem_id)
    const { t } = this.props;
    let { depositDetail, depositDetailItem } = this.state

    // console.log(depositDetail)

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange card-deposit-detail">

              <div className="">
                <button className="lastpage-btn"
                 onClick={()=>this.props.history.push('/deposit/deposit-list')}>
                    <TiArrowBack className="lastpage-icon"/>
                    {t('app.go_back_page')}
                </button>
              </div>

             {/* <div className="header text-center">
                <h4 className="title">存款詳細資料</h4>
              </div>  */}

              <div className="detail-title text-center">
                <div className="detail-title-line">
                  <div className="dtl-label">{t('app.id')}</div>
                  <div className="dtl-value">{depositDetail.id}</div>
                </div>
                <div className="detail-title-line">
                  <div className="dtl-label">{t('app.currency_type')}</div>
                  <div className="dtl-value">{CURRENCIES_STR[depositDetail.currency]}</div>
                </div>
                <div className="detail-title-line">
                  <span className="dtl-label">{t('app.amount')}</span>
                  <span className="dtl-value">{Format.thousandsToFix3(depositDetail.amount)}</span>
                </div>
                <div className="detail-title-line">
                  <span className="dtl-label">{t('app.remark')}</span>
                  <span className="dtl-value">{this.showNullLine(depositDetail.image_remark)}</span>
                </div>
                <div className="detail-title-line">
                  <span className="dtl-label">{t('app.create_datetime')}</span>
                  <span className="dtl-value">{depositDetail.create_datetime}</span>
                </div>
                <div className="detail-title-line">
                  <span className="dtl-label">{t('app.validation_results')}</span>
                  <span className="dtl-value">{t(DEPOSIT_MAIN_STATUS[depositDetail.status])}</span>
                </div>
              </div>

              <br/>

              <div className="header text-center">
                <h4 className="title">{t('app.deposit_list_detail_info')}</h4>
              </div>

                <div className="content table-responsive table-full-width">
                  {this.state.showLoading?
                    <table className="table table-exchange text-center m-tb-30">
                      <ClipLoader
                        sizeUnit={"px"}
                        size={40}
                        color={'#999'}
                        loading={this.state.loading}
                      />
                    </table>
                    :
                    <table className="table table-exchange">
                      <thead>
                        <tr>
                          <th>{t('app.id')}</th>
                          <th>{t('app.serial_number')}</th>
                          <th>{t('app.amount')}</th>
                          <th>{t('app.check_deposit_bank')}</th>
                          <th>{t('app.upload_image')}</th>
                          <th>{t('app.validation_results')}</th>
                          <th>{t('app.expire_time')}</th>
                          <th>{t('app.update_datetime')}</th>
                        </tr>
                      </thead>

                        {depositDetailItem === undefined
                        || !depositDetailItem instanceof Array
                        || depositDetailItem.length === 0?
                          <td className="table-no-data" colSpan="20">
                            {t('app.no_data')}
                          </td>
                          :
                          <tbody>
                            {depositDetailItem.map((item, index) => (
                              <DepositListDetailItem
                                key={index}
                                {...item}
                                depositDetailItem_id={this.props.user.sub_deposit_id}
                                mainTicketExpireTime={depositDetail.expire_datetime}
                                refreshData={()=>this.getInitialData()}
                                />
                            ))}
                          </tbody>
                        }
                    </table>
                    }
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(DepositListDetail);
