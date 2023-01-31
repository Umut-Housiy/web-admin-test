import { FunctionComponent, useContext, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { Table } from "../../Components/Table";
import { OrderStatusTypes, UserProductEvaluateModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Image } from "../../Components/Image"
import { CheckIcon, ChevronRightIcon, CloseIcon, EyeIcon } from "../../Components/Icons";

interface ProductEvaluationsProps {
  UserId: number,
}

export const ProductEvaluations: FunctionComponent<ProductEvaluationsProps> = (props: ProductEvaluationsProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const getUserProductEvaluatesForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getUserProductEvaluatesForAdmin(props.UserId, page, take, searchText, order);

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

  const handleJsDate = (JsTime) => {
    try {
      if (JsTime < 0) {
        return "-";
      }
      else {
        var time = new Date(JsTime);
        return time.toLocaleDateString() ?? "";
      }
    }
    catch {
      return ""
    }
  }

  return (
    <Table
      ref={tableEl}
      emptyListText={"Değerlendirme Bulunamadı"}
      getDataFunction={getUserProductEvaluatesForAdmin}
      header={
        <div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Tarih
            </span>
          </div>
          <div className="lg:col-span-3 flex items-center">
            <span className="p-sm-gray-400">
              Ürün Adı
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Sipariş No
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Satıcı
            </span>
          </div>
          <div className="lg:col-span-3 flex items-center">
            <span className="p-sm-gray-400">
              Sipariş Durumu
            </span>
          </div>
        </div>
      }
      renderItem={(e: UserProductEvaluateModel, i) => {
        return <div className="lg:grid-cols-11 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
          <div className="lg:col-span-1 gap-2 flex items-center">
            <p className="p-sm" >
              {handleJsDate(e.CreatedDateJSTime)}
            </p>
          </div>
          <div className="lg:col-span-3 flex items-center gap-2">
            <Image src={e.ProductPhoto ?? ""} alt={e.ProductName} className="w-12 h-12  object-contain" />
            <p className="p-sm">
              {e.ProductName ?? ""}
            </p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <p className="p-sm">
              #{e.OrderId}
            </p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <p className="text-sm font-medium underline text-blue-400 cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }}>
              {e.SellerName}
            </p>
          </div>
          <div className="lg:col-span-3 flex justify-between">
            <div className="text-gray-700 flex gap-1 justify-between items-center">
              {
                e.OrderStatus === OrderStatusTypes.CANCELED ?
                  <div className="flex items-center text-red-400 font-medium gap-2">
                    <CloseIcon className="icon-sm text-red-400" />
                    <div>Sipariş İptali</div>
                  </div>
                  :
                  e.OrderStatus === OrderStatusTypes.DONE ?
                    <div className="flex items-center text-gray-900 font-medium">
                      <CheckIcon className="icon-sm text-gray-900" />
                      <div>Teslim Edildi</div>
                    </div>
                    :
                    <></>
              }
              <div className="flex gap-2 items-center ml-auto cursor-pointer" onClick={() => { history.push("/siparis-detay/" + e.OrderId); }}>
                <EyeIcon className="icon-sm text-gray-900" />
                <div className="text-sm text-gray-900">Değerlendirmeyi Gör</div>
                <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all " />
              </div>
            </div>
          </div>
        </div>
      }}
    />
  )
}
