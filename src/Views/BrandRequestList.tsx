import { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router";
import { TrashIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import { BrandRequestModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const BrandRequestList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getBrandRequestList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getBrandRequestList(page, take, searchText, order);

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

  const deleteBrandRequest = (item) => {
    context.showModal({
      type: "Question",
      title: "Talep Sil",
      message: "Marka talebi silinecek. Emin misiniz?",
      onClick: async () => {

        const _result = await ApiService.deleteBrandRequest(item.RequestId);

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
        <h2 className="mb-5">Marka Talepleri Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Talep Bulunamadı"}
          getDataFunction={getBrandRequestList}
          header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
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
                Talep Edilen Marka Adı
              </span>
            </div>
            <div className="lg:col-span-4">
              <span className="p-sm-gray-400">
                Açıklama
              </span>
            </div>
          </div>}
          renderItem={(e: BrandRequestModel, i) => {
            return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
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
                  {e.BrandName}
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-between items-center">
                <p className="p-sm">
                  {e.Description}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { deleteBrandRequest(e); }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
    </div>
  )
}
