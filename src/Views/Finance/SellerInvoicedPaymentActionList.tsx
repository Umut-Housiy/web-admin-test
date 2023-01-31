import { FunctionComponent, useRef } from "react"
import { Link } from "react-router-dom";
import { DateView } from "../../Components/DateView";
import { DownloadIcon } from "../../Components/Icons";
import { NumberView } from "../../Components/NumberView";
import { Table } from "../../Components/Table"
import { InvoicedSellerPaymentsInnerModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { returnPaymentType } from "../../Services/Functions";

export const SellerInvoicedPaymentActionList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const getInvoicedSellerPaymentActionsForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getInvoicedSellerPaymentActionsForAdmin(page, take, searchText, order);

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

  const getDescription = (e: InvoicedSellerPaymentsInnerModel) => {

    if (e.UserOrderId) {
      return `#${e.UserOrderId} numaralı sipariş için ${returnPaymentType(e.PaymentType)}`
    }

    return `${returnPaymentType(e.PaymentType)} faturası`


  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Faturalandırılmış Satıcı İşlemleri
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"İşlem Bulunamadı"}
          getDataFunction={getInvoicedSellerPaymentActionsForAdmin}
          header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Fatura No
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Fatura Tipi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Satıcı Bilgisi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Fatura Tarihi
              </span>
            </div>
            <div className="lg:col-span-1 ">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Açıklama
              </span>
            </div>
            <div className="lg:col-span-1 ">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Fatura No:</span>
                <p className="p-sm">
                  {e.InvoiceNo}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Fatura Tipi:</span>
                <p className="p-sm">
                  {returnPaymentType(e.PaymentType)}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Satıcı Bilgisi:</span>
                <Link to={`/satici-detay/${e.SellerId}`} className="underline text-blue-400 font-medium text-sm">{e.SellerStoreName}</Link>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Fatura Tarihi:</span>
                {e.InvoiceDateJSTime > 0 ?
                  <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.InvoiceDateJSTime} pattern="dd/MM/yyyy" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <p className="p-sm">
                  <NumberView price={e.TotalPrice} suffix={"TL"} />
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Açıklama:</span>
                <p className="p-sm">
                  {getDescription(e)}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2 text-center">İşlemler:</span>
                <a className="flex items-center text-sm font-medium text-blue-400" href={e.InvoicePath} download="Fatura">
                  <DownloadIcon className="icon-sm mr-2" />
                  Faturayı İndir
                </a>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />

      </div>
    </div>
  )
}
