import { FunctionComponent, useContext, useRef, useState } from "react"
import { Table } from "../../Components/Table";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { formatter, fraction } from "../../Services/Functions";
import { Image } from "../../Components/Image"
import { Link } from "react-router-dom";
import { ChevronRightIcon, TrashIcon } from "../../Components/Icons";
import { ProductAdvertListInnerModelForShoppingCart } from "../../Models";

interface CartProductsProps {
  UserId: number,
}

export const CartProducts: FunctionComponent<CartProductsProps> = (props: CartProductsProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getUsersShoppingCartListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getUsersShoppingCartListForAdmin(props.UserId, page, take, searchText, order);

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

  const removeFromShoppingCartHandler = (item: ProductAdvertListInnerModelForShoppingCart) => {
    context.showModal({
      type: "Question",
      title: "Sil",
      message: "Ürün sepetten kaldırılacak. Emin misiniz?",
      onClick: async () => {

        const _result = await ApiService.removeFromShoppingCartHandler(item.ShoppingCartItemId, props.UserId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Ürün sepetten kaldırıldı",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current.reload();
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

  return (
    <Table
      ref={tableEl}
      emptyListText={"Ürün Bulunamadı"}
      getDataFunction={getUsersShoppingCartListForAdmin}
      header={
        <div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Ürün Adı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Barkod No
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Kategori
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
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Satış Fiyatı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Durum
            </span>
          </div>
        </div>
      }
      renderItem={(e: ProductAdvertListInnerModelForShoppingCart, i) => {
        return <div className="lg:grid-cols-10 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
          <div className="lg:col-span-2 gap-2 flex items-center">
            <Image src={e.ProductMainPhoto ?? ""} alt={e.ProductName} className="w-12 h-12  object-contain" />
            <p className="p-sm">
              {e.ProductName}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="p-sm">
              {e.BarcodeNo ?? ""}
            </p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <p className="p-sm">
              {e.Category ?? ""}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="p-sm">
              {e.StockCode}
            </p>
          </div>
          <div className="lg:col-span-1  flex items-center">
            <p className="p-sm">
              {e.StockCount}
            </p>
          </div>
          <div className="lg:col-span-1  flex items-center">
            <p className="text-sm font-medium text-black-400">
              {e.SalePrice % 1 === 0 ?
                <>{fraction.format(e.SalePrice)} TL </>
                :
                <>{formatter.format(e.SalePrice)} TL</>
              }
            </p>
          </div>
          <div className="lg:col-span-1 flex justify-between">
            <div className="text-gray-700 flex gap-2 justify-between items-center">
              {
                e.ShowProduct ?
                  <p className="text-sm font-medium text-green-400">Aktif</p>
                  :
                  <p className="text-sm font-medium text-red-400">Pasif</p>
              }
              <div className="flex gap-2 items-center">
                <TrashIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeFromShoppingCartHandler(e); }} />
                <Link to={{ pathname: `${"/urun-ilan-detay/" + e.AdvertId}`, state: { isEditActive: false } }} >
                  <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all " />
                </Link>
              </div>
            </div>
          </div>
        </div>
      }}
    />
  )
}
