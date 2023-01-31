import { FunctionComponent, useContext, useRef } from "react"
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Link, useHistory } from "react-router-dom";
import ApiService from "../../Services/ApiService";
import { Table } from "../../Components/Table";
import { UserOrderListInnerModel } from "../../Models";
import { ChevronRightIcon } from "../../Components/Icons";
import { formatter, fraction } from "../../Services/Functions";

interface OrdersProps {
  UserId: number,
}

export const Orders: FunctionComponent<OrdersProps> = (props: OrdersProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const getUserOrdersForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getUserOrdersForAdmin(props.UserId, page, take, searchText, order);

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
      emptyListText={"Sipariş Bulunamadı"}
      getDataFunction={getUserOrdersForAdmin}
      header={
        <div className=" lg:grid-cols-4 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Sipariş Bilgileri
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Satış Tutarı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Oluşturulan Gönderi Adedi
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Sipariş Durumu
            </span>
          </div>
        </div>
      }
      renderItem={(e: UserOrderListInnerModel, i) => {
        return <div className="lg:grid-cols-4 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
          <div className="lg:col-span-1 gap-2 flex flex-col items-center">
            <p className="text-sm text-gray-900 font-medium">
              #{e.OrderId}
            </p>
            <p className="p-sm mt-2">
              {handleJsDate(e.CreatedDateJSTime)}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="text-sm text-gray-900 font-medium">
              {e.TotalPrice % 1 === 0 ?
                <>{fraction.format(e.TotalPrice)} TL </>
                :
                <>{formatter.format(e.TotalPrice)} TL</>
              }
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="p-sm">
              {(e.DeliveryCount > 0 ? e.DeliveryCount + " gönderi, " : "") + "Toplam " + e.ProductCount + " ürün"}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center justify-between">
            <p className="p-sm">
              {e.Status}
            </p>
            <div className="flex gap-2 items-center">
              <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all cursor-pointer" onClick={() => { history.push("/siparis-detay/" + e.OrderId) }} />
            </div>
          </div>
        </div>
      }}
    />
  )
}
