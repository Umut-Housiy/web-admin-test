import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { DateView } from "../Components/DateView";
import { ChevronRightIcon, FilterIcon, RefreshIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { readPageQueryString } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";


export const SellerCertificateList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getSellerCertificateList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCertificateList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Satıcı Belgeleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Satıcı Bulunamadı"}
          getDataFunction={getSellerCertificateList}
          header={<div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Mağaza Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Telefon No.
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Email
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kayıt Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Firma Tipi
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.Phone}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.Email}
                </p>
              </div>
              <div className="lg:col-span-1">
                <DateView className="p-sm" dateNumber={e.CreatedDateJSTime} pattern="dd MMM yyyy HH:mm" />
              </div>
              <div className="lg:col-span-1 flex justify-between">
                <p className="p-sm">
                  {e.CompanyType === 1 ?
                    <>Anonim Şirket</>
                    :
                    e.CompanyType === 2 ?
                      <>Şahıs Şirketi</>
                      :
                      e.CompanyType === 3 ?
                        <>Limited Şirket</>
                        :
                        e.CompanyType === 4 ?
                          <>Kolektif Şirket</>
                          :
                          e.CompanyType === 5 ?
                            <>Kooperatif Şirket</>
                            :
                            e.CompanyType === 6 ?
                              <>Adi Ortaklık</>
                              :
                              <></>
                  }
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `/satici-detay/${e.Id}`, state: { prevTitle: "Satıcı Belgeleri", prevPath: window.location.pathname, tabId: 3, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400  cursor-pointer transition-all border-l pl-1" />
                  </Link>
                </div>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  )
}
