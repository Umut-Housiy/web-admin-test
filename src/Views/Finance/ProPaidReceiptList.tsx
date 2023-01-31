import { FunctionComponent, useRef } from "react"
import { Link } from "react-router-dom";
import { DateView } from "../../Components/DateView";
import { ChevronRightIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table"
import ApiService from "../../Services/ApiService";
import { formatter, fraction } from "../../Services/Functions";

export const ProPaidReceiptList: FunctionComponent = () => {
  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const tableEl = useRef<any>();

  const getProPaidReceiptList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProPaidReceiptList(page, take, searchText, order);

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
          Tamamlanan Ödemeler
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"Ödeme Bulunamadı"}
          getDataFunction={getProPaidReceiptList}
          header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Ödeme No
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Profesyonel ID
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Ödeme Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>

          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">

              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ödeme No:</span>
                <p className="p-sm">
                  {e.ReceiptId}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel ID:</span>
                <p className="p-sm">
                  {e.ProId}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Bilgisi:</span>
                <Link to={`/pro-profesyonel-detay/${e.ProId}`} className="underline text-blue-400 font-medium text-sm">{e.ProStoreName}</Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ödeme Tarihi:</span>
                <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.PayedDateJSTime} pattern="dd/MM/yyyy" />
              </div>

              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <div className="flex items-center justify-between">
                  <p className="p-sm">
                    {e.TotalPrice % 1 === 0 ?
                      <>{fraction.format(e.TotalPrice)} TL </>
                      :
                      <>{formatter.format(e.TotalPrice)} TL</>
                    }
                  </p>
                  <Link to={{ pathname: `${"/pro-ekstre-detay/" + e.ReceiptId}`, state: { status: 2 } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400  cursor-pointer transition-all" />
                  </Link>
                </div>

              </div>

            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
    </div>

  )
}
