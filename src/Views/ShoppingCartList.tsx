import { FunctionComponent, useRef } from "react"
import { DateView } from "../Components/DateView";
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image"
import { Link, useHistory } from "react-router-dom";
import { formatter, fraction } from "../Services/Functions";
import { ChevronRightIcon } from "../Components/Icons";

export const ShoppingCartList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const history = useHistory();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "En yüksek toplam tutar" },
    { key: "4", value: "En düşük toplam tutar" },
    { key: "5", value: "Ürün sayısı en çok" },
    { key: "6", value: "Ürün sayısı en az" },
  ];

  const getShoppingCartList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getShoppingCartList(page, take, searchText, order);

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
        <h2 className="mb-5">Sepet Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Liste Bulunamadı"}
          getDataFunction={getShoppingCartList}
          header={<div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Üye Bilgileri
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Sepetteki Ürün Sayısı
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Sepetteki Ürün Toplam Tutar
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-3 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Üye Bilgileri:</span>
                <div className="flex items-center">
                  <Image src={e.UserPhoto} alt={e.UserName} className="w-10 h-10 object-cover rounded-full mr-1" />
                  <Link to={`/uye-detay/${e.UserId}`} className="text-sm underline text-black-400">
                    {e.UserName}
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Sepetteki Ürün Sayısı:</span>
                <p className="p-sm">
                  {e.ProductCount}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Sepetteki Ürün Toplam Tutar:</span>
                <div className="flex justify-between items-center">
                  <p className="p-sm">
                    {
                      e.TotalPrice % 1 === 0 ?
                        <>{fraction.format(e.TotalPrice)} TL </>
                        :
                        <>{formatter.format(e.TotalPrice)} TL</>
                    }
                  </p>
                  <ChevronRightIcon className="icon-md cursor-pointer text-gray-700" onClick={() => history.push(`/sepet-detay/${e.UserId}`)} />
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
