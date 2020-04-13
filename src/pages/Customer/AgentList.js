import React from 'react';
import { apiGetAgentList } from '../../services/apiService'
import AgentListItem from './AgentListItem'
// import { spawn } from 'child_process';
import { MdClear, MdLibraryAdd } from "react-icons/md";
import {withTranslation} from 'react-i18next';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import { ClipLoader } from 'react-spinners';


class AgentList extends React.Component{
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
      let res = await apiGetAgentList(this.state.activePage,this.state.search_value)
      if(res.data.code===1){
        this.setState({
          state_dataList:res.data.data.agent,
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
    // console.log('資料頁面總數:',this.state.total_page)
    let {t} = this.props
    let {state_dataList} = this.state

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="text-right">
                <Link to="/customer/agent-add" 
                  className="text-page-link">
                  <MdLibraryAdd/>
                  <span className="ml-5">{t('app.add')}</span>
                </Link>
              </div>

              <div className="header text-center">
                <h4 className="title">{t('app.agent_list')}</h4>
              </div>

              <div className="filter-section">
                <div className="table-filter-section">
                  <span className="table-filter-label">{t('app.search')} {t('app.username')} :</span>
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
                        {/* <th>{t('app.up_line')}</th> */}
                        <th>{t('app.username')}</th>
                        <th>{t('app.nickname')}</th>
                        <th>{t('app.role')}</th>
                        <th>{t('app.registration_time')}</th>
                        <th>{t('app.remark')}</th>
                        <th>{t('app.edit')}</th>
                        <th>{t('app.permission')}</th>
                        <th>{t('app.down_line')}</th>
                      </tr>
                    </thead>
                    {state_dataList instanceof Array
                      && state_dataList.length !== 0 ?
                      <tbody>
                        {state_dataList.map((item,index) => 
                          <AgentListItem
                          key={index}
                          index={index}
                          {...item}
                          refreshData={()=>this.getInitialData()}
                          >
                          </AgentListItem>)}
                      </tbody>
                      :
                      <td className="table-no-data" colSpan="20">
                        {t('app.no_data')}
                      </td>
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

export default withTranslation()(AgentList);