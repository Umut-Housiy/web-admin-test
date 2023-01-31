import { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router-dom";
import { AlertIcon, ChevronRightIcon, StarIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { formatter, fraction } from "../../Services/Functions"
import { GetProductsOtherSellersForAdminResponseInnerModel } from "../../Models";

export interface OtherSellerListPropModel {
  advertId: number
}

export const OtherSellerList: FunctionComponent<OtherSellerListPropModel> = (props: OtherSellerListPropModel) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getAdvertsOtherSellersForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAdvertsOtherSellersForAdmin(props.advertId, page, take, searchText, order);

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
    <>
      <Table
        ref={tableEl}
        emptyListText={"Satıcı Bulunamadı"}
        getDataFunction={getAdvertsOtherSellersForAdmin}
        header={
          <div className=" lg:grid-cols-11 px-2 border-b border-t py-6 border-gray-200 hidden lg:grid gap-4 flex items-center">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Satıcı Adı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Mağaza Puanı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Stok Kodu
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Stok Miktarı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Piyasa Satış Fiyatı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Satış Fiyatı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                BUYBOX
              </span>
              <AlertIcon className="w-3 h-3 text-gray-400 transform rotate-180" />
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Sepete Eklenme Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Favori Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>
        }
        renderItem={(e: GetProductsOtherSellersForAdminResponseInnerModel, i) => {
          return (
            <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b  border-gray-200 grid gap-4 items-center py-6 ">
              <div className="lg:col-span-2 flex items-center gap-2">
                <p className="text-sm text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }}>
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1 flex gap-2 text-sm font-medium text-yellow-600  items-center">
                <StarIcon className="w-3 h-3  inline-block" />
                <span>{e.StoreRate}</span>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.StockCode}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.StockCount}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.MarketPrice % 1 === 0 ?
                    <>{fraction.format(e.MarketPrice)} TL </>
                    :
                    <>{formatter.format(e.MarketPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.SalePrice % 1 === 0 ?
                    <>{fraction.format(e.SalePrice)} TL </>
                    :
                    <>{formatter.format(e.SalePrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="text-sm font-medium text-green-400">
                  {e.BuyboxPrice % 1 === 0 ?
                    <>{fraction.format(e.BuyboxPrice)} TL </>
                    :
                    <>{formatter.format(e.BuyboxPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.ShoppingCartCount}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {e.FavoriteCount}
                </p>
              </div>
              <div className="lg:col-span-1  flex items-center">
                <div className="flex items-center w-full">
                  {
                    e.Status === 0 ?
                      <p className="text-sm font-medium text-green-400">Aktif</p>
                      :
                      <p className="text-sm font-medium text-red-400">Pasif</p>
                  }
                  <ChevronRightIcon className="icon-md text-gray-700 ml-auto cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }} />
                </div>
              </div>
            </div>
          )
        }}
      />
    </>
  )
}
