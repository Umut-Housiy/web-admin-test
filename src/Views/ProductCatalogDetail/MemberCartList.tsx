import { FunctionComponent, useContext, useRef } from "react";
import { Table } from "../../Components/Table";
import { Image } from "../../Components/Image";
import { TrashIcon } from "../../Components/Icons";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import ApiService from "../../Services/ApiService";
import { ShoppingCartListInnerModelForAdmin } from "../../Models";
import { useHistory } from "react-router";


export interface MemberCartListPropModel {
  productId: number
}

export const MemberCartList: FunctionComponent<MemberCartListPropModel> = (props: MemberCartListPropModel) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getShoppingCartUsersForProduct = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getShoppingCartUsersForProduct(props.productId, page, take, searchText, order);

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

  const removeFromShoppingCart = (item: ShoppingCartListInnerModelForAdmin) => {
    context.showModal({
      type: "Question",
      title: "Ürünü Sil",
      message: `Ürün kullanıcının sepetinden çıkartılacak. Emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.removeFromShoppingCart(item.ShoppingCartItemId, item.UserId, "");

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: `Ürün sepetten çıkartıldı`,
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
    <>
      <Table
        ref={tableEl}
        emptyListText={"Üye Bulunamadı"}
        getDataFunction={getShoppingCartUsersForProduct}
        header={<div className=" lg:grid-cols-10 px-2 border-b border-t lg:h-14 border-gray-200 hidden lg:grid gap-4 flex items-center">
          <div className="lg:col-span-3 flex items-center">
            <span className="p-sm-gray-400">
              Müşteri Adı
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Ekleme Tarih
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Satıcı Adı
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Adet
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center justify-center">
            <span className="p-sm-gray-400">
              İşlemler
            </span>
          </div>
        </div>}
        renderItem={(e: ShoppingCartListInnerModelForAdmin, i) => {
          return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
            <div className="lg:col-span-3 flex items-center flex items-center gap-2">
              <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 object-cover rounded-full" />
              <p className="p-sm">
                {e.UserName}
              </p>
            </div>
            <div className="lg:col-span-2 flex lg:block items-center">
              <p className="p-sm">
                {e.AddedDateJSTime}
              </p>
            </div>
            <div className="lg:col-span-2 flex lg:block items-center">
              <p className="text-sm text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }}>
                {e.SellerName}
              </p>
            </div>
            <div className="lg:col-span-2 flex lg:block items-center">
              <p className="p-sm">
                {e.Amount}
              </p>
            </div>
            <div className="lg:col-span-1 flex justify-center items-center">
              <div className="text-gray-700 flex gap-2 items-center">
                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeFromShoppingCart(e); }} />
              </div>
            </div>
          </div>
        }}
      />
    </>
  )
}
