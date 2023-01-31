import React, { FunctionComponent, useContext, useRef } from "react"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import { Table } from "../Components/Table"
import { useHistory } from "react-router-dom"
import { TrashIcon } from "../Components/Icons"


export const SellerCategoryRequestList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const getSellerCategoryRequestList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryRequestList(page, take, searchText, order);

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

  const deleteCategoryRequest = (item) => {
    context.showModal({
      type: "Question",
      title: "Talep Sil",
      message: "Kategori talebi silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteCategoryRequest(item.RequestId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Talep başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleDateString() ?? "-";
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Kategori Talepleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Talep Bulunamadı"}
          getDataFunction={getSellerCategoryRequestList}
          header={
            <div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  Talep Tarihi
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Talep Oluşturan Satıcı
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Talep Edilen Kategori Adı
                </span>
              </div>
              <div className="lg:col-span-4">
                <span className="p-sm-gray-400">
                  Açıklama
                </span>
              </div>
            </div>
          }
          renderItem={(e, i) => {
            return <div className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center" key={i}>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {handleJsTime(e.CreatedDateJSTime)}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="text-sm text-blue-400 underline cursor-pointer font-medium" onClick={() => { history.push(`/satici-detay/${e.SellerId}`); }}>
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-between items-center">
                <p className="p-sm">
                  {e.Description}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { deleteCategoryRequest(e); }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
    </div>
  )
}
