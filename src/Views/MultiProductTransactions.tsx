import { FunctionComponent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DateView } from "../Components/DateView";
import { DownloadIcon } from "../Components/Icons";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";

export const MultiProductTransactions: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const [showMessageDetailModal, setShowMessageDetailModal] = useState<boolean>(false);

  const [selectedMessage, setSelectedMessage] = useState<string>("");

  const getExcelUploadSummary = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getExcelUploadSummary(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const showMoreResultMessage = (message: string) => {
    setSelectedMessage(message);
    setShowMessageDetailModal(true);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Toplu Ürün İşlemleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"İşlem Bulunamadı"}
          getDataFunction={getExcelUploadSummary}
          header={<div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                İşlem Tarih
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Mağaza Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Yüklenen Dosya
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Sonuç
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2"> İşlem Tarih:</span>
                <DateView className="text-sm text-gray-700 mb-1 font-medium" dateNumber={e.UploadedDateJSTime} pattern="dd/MM/yyyy HH:mm" />
              </div>
              <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Mağaza Adı:</span>
                <Link to={`/satici-detay/${e.SellerId}`} className="text-sm font-medium text-blue-400 underline">
                  {e.SellerStoreName}
                </Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori:</span>
                <p className="text-sm text-gray-700">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Yüklenen Dosya:</span>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-black-400">{e.ExcelPath.replace('https://housiydev90strg.blob.core.windows.net/user-uploaded-excels/', '')}</p>
                  <a href={e.ExcelPath} download={e.ExcelPath} className="ml-5">
                    <DownloadIcon className="icon-md text-black-900" />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-1 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
                  <p className={`${e.IsCompleted === true ? "text-green-600" : "text-yellow-600"} text-sm font-medium`} >
                    {e.IsCompleted === true ? "Tamamlandı" : "İşlem Sürüyor"}
                  </p>

                </div>
              </div>
              <div className="lg:col-span-2 flex justify-between items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Sonuç:</span>
                <p className="text-sm text-gray-700">
                  {e.ResultMessage ?
                    <>
                      {e.ResultMessage?.slice(0, 80)}{e.ResultMessage?.length > 80 ? "..." : ""}
                      {e.ResultMessage?.length > 80 && <span className="font-medium text-blue-400 inline-block ml-1 text-xs cursor-pointer" onClick={() => { showMoreResultMessage(e.ResultMessage ?? "") }}>Daha Fazla Göster</span>}
                    </>
                    :
                    "-"
                  }
                </p>
              </div>
            </div>
          }}
        />

        <Modal
          modalType="fixedSm"
          showModal={showMessageDetailModal}
          onClose={() => {
            setShowMessageDetailModal(false);
          }}
          title="İşlem Mesaj Detayı"
          body=
          {
            <p className="p-sm">{selectedMessage}</p>
          }
        />
      </div>
    </div>
  )
}
