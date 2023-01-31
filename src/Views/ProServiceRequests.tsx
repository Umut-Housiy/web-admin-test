import React, { FunctionComponent, useContext, useRef } from "react"
import { Link } from "react-router-dom";

import { ChevronRightIcon } from "../Components/Icons";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

import { Table } from "../Components/Table"
import { readPageQueryString } from "../Services/Functions";

export const ProServiceRequests: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getProServiceRequestList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProCategoryList(page, take, searchText, order);

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
    <div className="content-wrapper mt-20">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Hizmet Talepleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Talep Bulunamadı"}
          getDataFunction={getProServiceRequestList}
          header={< div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Kategori Kodu
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Kategori Adı
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Üst Kategori
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Soru Sayısı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Kodu: </span>
                <p className="p-sm">
                  {e.CategoryCode}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori İsmi: </span>
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Üst Kategori: </span>
                <p className="p-sm">
                  {e.ParentName ? e.ParentName : "-"}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Soru Sayısı </span>
                <p className="p-sm">
                  {e.QuestionCount}
                </p>
              </div>
              <div className="lg:col-span-2  flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Durum </span>
                <p className={`${e.CategoryStatus === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                  {e.CategoryStatus === true ? "Aktif" : "Pasif"}
                </p>
                <Link className="ml-auto" to={{ pathname: `/pro-kategori-detay/${e.Id}`, state: { prevPath: window.location.pathname, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                  <ChevronRightIcon className="icon-md text-gray-700" />
                </Link>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div >
  )
}
