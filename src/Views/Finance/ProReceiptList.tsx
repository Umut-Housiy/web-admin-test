import { FunctionComponent, useRef } from "react"
import { Link } from "react-router-dom";
import { Table } from "../../Components/Table"
import ApiService from "../../Services/ApiService";
import { formatter, fraction } from "../../Services/Functions";

export const ProReceiptList: FunctionComponent = () => {
  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const tableEl = useRef<any>();

  const getCreateReceiptProList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getCreateReceiptProList(page, take, searchText, order);

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
          Ekstre Oluştur
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"Ekstre Bulunamadı"}
          getDataFunction={getCreateReceiptProList}
          header={<div className="lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Profesyonel ID
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Toplam İşlem Sayısı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">

              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel ID:</span>
                <p className="p-sm">
                  {e.ProId}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Bilgisi:</span>
                <Link to={`/pro-profesyonel-detay/${e.ProId}`} className="underline text-blue-400 font-medium text-sm">{e.ProStoreName}</Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam İşlem Sayısı:</span>
                <p className="p-sm">
                  {e.TotalActionCount}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <p className="p-sm">
                  {e.TotalPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler:</span>
                <Link to={`/pro-ekstre-odeme-kayitlari/${e.ProId}`} className="underline text-blue-400 font-medium text-sm">Detay Görüntüle</Link>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />

      </div>
    </div>
  )
}
