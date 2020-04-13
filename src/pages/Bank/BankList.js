import React from 'react';
import { apiGetBankList } from '../../services/apiService'
import BankListItem from './BankListItem'
import { MdClear, MdLibraryAdd } from "react-icons/md";
import {withTranslation} from 'react-i18next';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import { ClipLoader } from 'react-spinners';
 

class BankList extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      state_dataList:[],
      activePage:1,
      total_page:0,
      search_value:'',
      showLoading:true,
    }
  }

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
      shineBackgrounf:true
    });
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

  handlePageChange (pageNumber) { // 切換頁面
    this.setState({
      activePage: pageNumber
    },()=>this.getInitialData())
  }

  onchangeInput = (e) => {
    this.setState({
      search_value:e.target.value,
    })
  }

  clearSearch = () => { // 清除搜尋
    this.setState({
      search_value:'',
      activePage:1
    },()=>{this.getInitialData()})
  }
  
  getFirstTimeSearchData = () => { // 第一次搜尋，強制切回第一頁
    this.setState({
      activePage:1
    },()=>{this.getInitialData()}
    )
  }

  getInitialData = async() => { // 初始載入 & 翻頁
    this.showLoading()
    try {
      let res = await apiGetBankList(this.state.activePage,this.state.search_value)
      if(res.data.code===1){
        this.setState({
          state_dataList:res.data.data.banks,
          total_page:res.data.data.total_pages,
        })
      }
    }catch (err) {
      console.log(err)
    }
  }

  componentDidMount() {
    this.getInitialData()
  }

  render(){
    let {t} = this.props
    let {state_dataList} = this.state

    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="text-right">
                <Link to="/bank/bank-add" 
                  className="text-page-link">
                  <MdLibraryAdd/>
                  <span className="ml-5">{t('app.add')}</span>
                </Link>
              </div>

              <div className="header text-center">
                <h4 className="title">{t('app.bank_list')}</h4>
              </div>

              <div className="filter-section">
                <div className="table-filter-section">
                  <span className="table-filter-label">{t('app.search')} {t('app.account_number')} :</span>
                  <span className="search-form-fieldset">
                    <input type="search" className="input-search" 
                      onChange={this.onchangeInput}
                      value={this.state.search_value}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          this.getFirstTimeSearchData()
                        }
                        if (e.key === 'Esc') {
                          this.clearSearch()
                        }
                      }} 
                      />
                    <button className="btn-search-clear"
                      onClick={this.clearSearch}> 
                      {this.state.search_value!==''?<MdClear/>:<span></span> }
                    </button>
                  </span>
                  <button className="button-search"
                    onClick={this.getFirstTimeSearchData}>
                      <i className="fa fa-search"></i>
                  </button>
                </div>
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
                        <th>{t('app.bank_name')}</th>
                        <th>{t('app.bank_code')}</th>
                        <th>{t('app.bank_account_name')}</th>
                        <th>{t('app.account_number')}</th>
                        <th>{t('app.bank_branch')}</th>
                        <th>{t('app.country')}</th>
                        <th>{t('app.swift_code')}</th>
                        <th>{t('app.currency_type')}</th>
                        <th>{t('app.payee_address')}</th>
                        <th>{t('app.bank_address')}</th>
                        <th>{t('app.beneficiary_address')}</th>
                        <th>{t('app.bank_state_code')}</th>
                        <th>{t('app.payee_phone_number')}</th>
                        <th>{t('app.delete')}</th>
                      </tr>
                    </thead>
                    {!state_dataList instanceof Array
                      || state_dataList.length === 0 ?
                      <td className="table-no-data" colSpan="20">
                        {t('app.no_data')}
                      </td>
                      :
                      <tbody>
                        {state_dataList.map((item,index) => 
                          <BankListItem
                          key={index}
                          index={index}
                          {...item}
                          refreshData={()=>this.getInitialData()}
                          activePage={this.state.activePage}
                          >
                          </BankListItem>)}
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
                  />
                </div>
              :''}

            </div>
          </div>
        </div>
        
      </div>
    )
  }
}
export default withTranslation()(BankList);