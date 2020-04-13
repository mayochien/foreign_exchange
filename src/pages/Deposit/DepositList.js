import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
// import moment from "moment";
import { Link } from 'react-router-dom';
import { apiGetDepositList } from '../../services/apiService';
import DepositListItem  from './DepositListItem';
import { MdLibraryAdd } from "react-icons/md";
import Pagination from "react-js-pagination";
import { FaEye, FaAngleLeft } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';


class DepositList extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
    dataList: [],
    activePage:1,
    show_serialNumber:false,
    showLoading:true,
  };

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
  
  handlePageChange (pageNumber) { // 切換頁面
    this.setState({
      activePage: pageNumber
    },()=>{this.getInitialData()})
  }

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
    });
  }

  getInitialData = async() => { // 初始載入
    // console.log('目前資料頁數page:',page)
    // this.showLoading()
    try {
      let res = await apiGetDepositList(this.state.activePage);
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.deposits,
          total_page:res.data.data.total_pages, // 總頁數
        })
      }
    } catch(err) {
      console.log(err);
    }
  }
  
  componentDidMount() {
    this.showLoading()
    this.getInitialData();
  }

  getSnapshotBeforeUpdate(prevState) {  //取代 componentWillUpdate
    if (prevState.dataList !== this.state.dataList){
        setTimeout(()=>{
          this.getInitialData(this.state.activePage)
          // console.log('儲值清單頁刷新',new Date().getMinutes(),':',new Date().getSeconds())
        },5000)
    }
  }

  render() {
    // console.log('資料頁面總數:',this.state.total_page)
    const { t } = this.props;
    const { dataList } = this.state;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="text-right">
                <Link to="/deposit/deposit-apply" 
                  className="text-page-link">
                  <MdLibraryAdd/>
                  <span className="ml-5">{t('app.add')}</span>
                </Link>
              </div>
              
              <div className="header text-center">
                <h4 className="title">{t('app.deposit_list')}</h4>
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

                          <th>{t('app.apply_deposit_currency')}</th>
                          <th>{t('app.apply_deposit_amount')}</th>
                          <th>{t('app.pass_deposit_amount')}</th>
                          <th>{t('app.convert_wallet_amount')}</th>
                          <th>{t('app.status')}</th>
                          <th>{t('app.detail')}</th>
                          <th>{t('app.create_datetime')}</th>
                          <th>{t('app.remark')}</th>
                        </tr>
                      </thead>
                      {!dataList instanceof Array 
                        || dataList.length === 0? 
                        <td className="table-no-data" colSpan="20">
                          {t('app.no_data')}
                        </td>
                        :
                        <tbody>
                          {dataList.map((item, index) => (
                            <DepositListItem 
                              key={index}
                              // data={...item}
                              {...item}
                              refreshData={this.getInitialData.bind(this,1)}
                              show_serialNumber={this.state.show_serialNumber}
                              />
                          ))}
                        </tbody>
                      }
                    </table>
                  }
                </div>
                
                {this.state.total_page > 0 ?
                  <div className="page-section">
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={20}
                      totalItemsCount={this.state.total_page*20}
                      pageRangeDisplayed={3}
                      onChange={e=>this.handlePageChange(e)}
                      show_serialNumber = {this.state.show_serialNumber}
                    />
                  </div>
                :''}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(DepositList);