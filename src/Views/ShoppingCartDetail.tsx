import { FunctionComponent, useContext, useRef } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { Button } from "../Components/Button"
import { ChevronRightIcon, TrashIcon } from "../Components/Icons"
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService"
import { Image } from "../Components/Image"
import { formatter, fraction } from "../Services/Functions"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"

interface RouteParams {
  id: string
}

export const ShoppingCartDetail: FunctionComponent = () => {
  const tableEl = useRef<any>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const history = useHistory();


  const getAdvertListForShoppingCart = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAdvertListForShoppingCart(Number(params.id ?? "0"), page, take, searchText, order);

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

  const showDeleteModalForAll = () => {
    context.showModal({
      type: "Question",
      title: "Tüm Ürünleri Sil",
      message: "Sepetteki tüm ürünler silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.clearAllDataofShoppingCart(Number(params.id), "");

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Sepet boşaltıldı.",
            onClose: () => { context.hideModal(); history.push("/sepet-listesi") }
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
  const showDeleteModalForSingle = (item) => {
    context.showModal({
      type: "Question",
      title: "Ürünü Sil",
      message: `${item.ProductName} sepetten çıkartılacak. Emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.removeFromShoppingCart(item.ShoppingCartItemId, Number(params.id), "");

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: `${item.ProductName} sepetten çıkartıldı`,
            onClose: () => {
              context.hideModal();
              tableEl.current?.reload();
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to="/sepet-listesi" className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Sepet Listesi
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="mb-5">Sepet Detayı</h2>
          <Button buttonMd design="button-gray-100 w-60" text="Sepetteki Ürünleri Sil" onClick={() => showDeleteModalForAll()} hasIcon icon={<TrashIcon className="icon-sm text-gray-900 mr-2 " />} />
        </div>
        <Table
          ref={tableEl}
          emptyListText={"Ürün Bulunamadı"}
          getDataFunction={getAdvertListForShoppingCart}
          header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Ürün Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Barkod No
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Stok Kodu
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Stok Miktarı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Satış Fiyatı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
                <div className="flex items-center">
                  <Image src={e.ProductMainPhoto} alt={e.ProductName} className="max-w-12 max-h-12 min-w-12 min-h-12 object-contain" />
                  <span className="font-medium text-sm text-gray-900 line-clamp-2">
                    {e.ProductName}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Barkod No:</span>
                <p className="p-sm">
                  {e.BarcodeNo}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori:</span>
                <p className="p-sm">
                  {e.Category}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Stok Kodu:</span>
                <p className="p-sm">
                  {e.StockCode}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Stok Miktarı:</span>
                <p className="p-sm">
                  {e.StockCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Satış Fiyatı:</span>
                <p className="text-sm text-black-400 font-medium">
                  {
                    e.SalePrice % 1 === 0 ?
                      <>{fraction.format(e.SalePrice)} TL </>
                      :
                      <>{formatter.format(e.SalePrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
                <p className={`${e.ProductIsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                  {e.ProductIsEnabled === true ? "Aktif" : "Pasif"}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler:</span>
                <div className="flex items-center divide-x gap-x-2 text-gray-700">
                  <TrashIcon className="icon-sm " onClick={() => showDeleteModalForSingle(e)} />
                  <ChevronRightIcon className="w-6 h-6 pl-1 " onClick={() => history.push(`/urun-detay/${e.ProductId}`)} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
    </div>

  )
}
