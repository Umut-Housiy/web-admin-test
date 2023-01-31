import { FunctionComponent, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { DateView } from "../../Components/DateView";

import { Table } from "../../Components/Table"
import { fraction } from "../../Models";
import ApiService from "../../Services/ApiService";
import { formatter, readPageQueryString, returnPaymentType } from "../../Services/Functions";

export const CompletedSellerPaymentList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const expiryDate = 12096e5;

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const getCompletedSellerPaymentList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getCompletedSellerPaymentList(page, take, searchText, order);

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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Tamamlanan Satıcı Tahsilatları
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"Tahsilat Bulunamadı"}
          getDataFunction={getCompletedSellerPaymentList}
          header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Sipariş No
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Satıcı Bilgisi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Dekont Tipi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Sipariş Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Vade Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Vade Günü
              </span>
            </div>  <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>  <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Sipariş No:</span>
                <p className="p-sm">
                  {e.SellerOrderId}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Satıcı Bilgisi:</span>
                <Link to={`/satici-detay/${e.SellerId}`} className="underline text-blue-400 font-medium text-sm">{e.SellerStoreName}</Link>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Dekont Tipi:</span>
                <p className="p-sm">
                  {returnPaymentType(e.PaymentType)}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Sipariş Tarihi:</span>
                <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.OrderDateJSTime} pattern="dd/MM/yyyy" />
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Vade Tarihi:</span>
                <DateView className="text-sm text-gray-700 mb-1" dateNumber={new Date(+new Date(e.OrderDateJSTime) + expiryDate).getTime()} pattern="dd/MM/yyyy" />
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Vade Günü:</span>
                <p className="p-sm">
                  14 Gün
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <p className="p-sm">
                  {e.TotalPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler:</span>
                <Link to={{ pathname: `/siparis-detay/${e.UserOrderId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} className="underline text-blue-400 font-medium text-sm">Detay Görüntüle</Link>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>

  )
}
