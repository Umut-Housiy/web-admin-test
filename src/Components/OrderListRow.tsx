import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { OrderListInnerModel } from "../Models";
import { formatter, fraction, readPageQueryString } from "../Services/Functions";
import { DateView } from "./DateView";
import { ChevronRightIcon } from "./Icons";
import { Image } from "./Image";

interface OrderListRowProps {
  item: OrderListInnerModel,
  onCanceledListBySeller?: boolean,
  onCanceledListByUser?: boolean,
  onDelayedList?: boolean,
  isSellerInfoHidden?: boolean,
  onSellerDetail?: boolean,
  shouldChangeOrderId?: boolean
}

export const OrderListRow: FunctionComponent<OrderListRowProps> = (props: OrderListRowProps) => {
  return (
    <div key={"list" + props.item.OrderId} className={`${(props.onCanceledListBySeller === true || props.isSellerInfoHidden === true) ? "lg:grid-cols-7" : "lg:grid-cols-8"} px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center`}>
      {(props.onCanceledListBySeller === true || props.onCanceledListByUser === true) &&
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">İptal Tarihi:</span>
          <p className="p-sm">
            <DateView className="text-sm text-gray-700 mb-1" dateNumber={props.item.CancelDateJSTime} pattern="dd/MM/yyyy" />
          </p>
        </div>
      }
      <div className={`lg:col-span-1 flex lg:block items-center`}>
        <span className="p-sm-gray-700 lg:hidden mr-2">Sipariş Bilgileri:</span>
        <p className="text-black-700 text-sm font-medium mb-1">#{(props.shouldChangeOrderId) ? props.item.UserOrderId : props.item.OrderId}</p>
        <DateView className="text-sm text-gray-700 mb-1" dateNumber={props.item.CreatedDateJSTime} pattern="dd/MM/yyyy" />
        {(props.onCanceledListBySeller === true || props.onCanceledListByUser === true) ?
          <span className="text-sm text-gray-900">Toplam {props.item.ProductCount} ürün, {props.item.CanceledProductCount} iptal</span>
          :
          ""
        }
      </div>
      {
        !props.isSellerInfoHidden &&
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Satıcı Bilgileri:</span>
          <div className="whitespace-nowrap overflow-x-auto custom-scrollbar">
            {props.item.Sellers.map((item) => (
              <Link to={`/satici-detay/${item.SellerId}`} className="underline text-blue-400 text-sm font-medium mr-2">
                {item.SellerStoreName}
              </Link>
            ))}
          </div>
        </div>
      }
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Bilgileri:</span>
        <p className="flex flex-col">
          <span className="text-sm text-gray-900 mb-1">Toplam {props.item.ProductCount} ürün</span>
          <div className="flex items-center gap-x-1">
            {props.item.ImageList.slice(0, 2).map((item) => (
              <Image src={item} alt="Ürün Resimleri" className="w-12 h-12 object-contain" />
            ))}
            {props.item.ImageList.length > 2 &&
              <span className="text-xs">+ {(props.item.ImageList.length - 2)}</span>
            }
          </div>
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Alıcı Bilgileri:</span>
        <div className="flex items-center">
          <Image src={props.item.BuyerPhotoUrl} alt={props.item.BuyerNameSurname} className="w-10 h-10 object-cover rounded-full mr-2" />
          <div>
            <p className="font-medium text-sm text-gray-900">{props.item.BuyerNameSurname}</p>
            <span className="text-sm text-gray-700">{props.item.DeliveryAddressDistrict} , {props.item.DeliveryAddressCity}</span>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">
          {props.onCanceledListBySeller === true ? "İptal Edilen Satış Tutarı:" : "Satış Tutarı:"}
        </span>
        {(props.item.StatusByte === 4 && (props.item.ProductCount !== props.item.CanceledProductCount)) ?
          <p className="text-sm text-black-400 font-medium">
            {props.item.ProductTotalPrice % 1 === 0 ?
              <>{fraction.format(props.item.ProductTotalPrice)} TL </>
              :
              <>{formatter.format(props.item.ProductTotalPrice)} TL</>
            }
          </p>
          :
          <p className="text-sm text-black-400 font-medium">
            {props.item.TotalPrice % 1 === 0 ?
              <>{fraction.format(props.item.TotalPrice)} TL </>
              :
              <>{formatter.format(props.item.TotalPrice)} TL</>
            }
          </p>
        }
      </div>
      {(props.onCanceledListBySeller !== true && props.onCanceledListByUser !== true) &&
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Son Gönderim Tarihi:</span>
          <DateView className="text-sm text-gray-700 mb-1" dateNumber={props.onSellerDetail === true ? props.item.ShortestDeliveryDateJSTime ?? 0 : props.item.LastShippingDateJSTime} pattern="dd/MM/yyyy" />
        </div>
      }
      {(props.onCanceledListBySeller !== true && props.onCanceledListByUser !== true && props.onDelayedList !== true) &&
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Oluşturulan Gönderi Adedi:</span>
          <div className="flex flex-col">
            <span className="text-sm text-gray-900 mb-1">{props.item.DeliveryCount} gönderi, Toplam {props.item.ProductCount} ürün</span>
            {(props.item.CargoTrackNo !== null && props.item.CargoTrackNo !== "") &&
              <>
                <span className="text-xs text-gray-700 mb-1">Kargo Takip Numarası:</span>
                <span className="text-sm text-black-400 font-medium">{props.item.CargoTrackNo}</span>
              </>
            }
          </div>
        </div>
      }
      {props.onDelayedList === true &&
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Kargo Bilgileri:</span>
          {props.item.StatusByte === 1 ?
            <>
              {/* #TODO: KARGO RESMİ GEREKİYOR */}
              "KARGO RESMİ GELECEK"
              <span className="text-xs text-gray-700 inline-block mb-1">Kargo Kodu:</span>
              <div className="text-sm text-black-400 font-medium">{props.item.CargoTrackNo}</div>
            </>
            : props.item.StatusByte === 0 &&
            <span className="text-xs text-gray-700 inline-block mb-1">Kargo Firması Seçilmedi</span>
          }
        </div>
      }
      {props.onCanceledListByUser === true &&
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">İptal Nedeni:</span>
          <div>
            <p className="text-sm font medium text-black-400">{props.item.CancelTitle}</p>
            <span className="text-sm text-gray-700">{props.item.CancelReason}</span>
          </div>
        </div>
      }
      <div className="lg:col-span-1 flex justify-between items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Durum: </span>
        <span className={`${(props.item.StatusByte === 0 || props.item.StatusByte === 1) ? "text-yellow-600 bg-yellow-100" : props.item.StatusByte === 2 ? "text-blue-400 bg-blue-100" : props.item.StatusByte === 3 ? "text-green-400 bg-green-100" : props.item.StatusByte === 4 && "text-gray-900 bg-gray-100"} font-medium text-center text-sm w-52 rounded-full py-2`}>
          {props.item.StatusByte === 4 ?
            <>
              {props.item.ProductCount === props.item.CanceledProductCount ? "Sipariş İptal Edildi" : "Ürün İptal Edildi"}
            </>
            :
            props.item.Status
          }
        </span>
        <Link to={{ pathname: `/siparis-detay/${(props.shouldChangeOrderId) ? props.item.UserOrderId : props.item.OrderId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
          <ChevronRightIcon className="icon-md text-gray-700 cursor-pointer" />
        </Link>
      </div>
    </div>
  )
}
