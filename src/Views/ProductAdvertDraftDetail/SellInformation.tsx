import { FunctionComponent } from "react";
import { useHistory } from "react-router";
import { Loading } from "../../Components/Loading";
import { ProductAdvertAdminDraftDetailModel } from "../../Models";
import { fraction } from "../../Services/Functions";

export interface SellInformationPropModel {
  loading: boolean,
  advertDetail?: ProductAdvertAdminDraftDetailModel,
}

export const SellInformation: FunctionComponent<SellInformationPropModel> = (props: SellInformationPropModel) => {

  const history = useHistory();

  return (
    <>
      <div className="py-4 w-full">
        <div className="flex w-full gap-8">
          <div className="w-1/2 ">
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>Satıcı Bilgisi</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-blue-400 underline font-medium ml-2 cursor-pointer" onClick={() => { history.push("/satici-detay/" + props.advertDetail?.SellerId); }}>{props.advertDetail?.StoreName}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>Barkod No</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.advertDetail?.BarcodeNo}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>Stok Kodu</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.advertDetail?.StockCode}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>Stok Adedi</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.advertDetail?.Stock ?? 0}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>Desi</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{props.advertDetail?.Desi ?? 0}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>Kargoya Hazırlık Süresi</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{(props.advertDetail?.ShippingPrepareDay ?? 0) + " gün"}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>İlan Durumu</span><span className="ml-auto">:</span></div>
                  <div className={`${props.advertDetail?.ShowProduct ? "text-blue-400" : "text-red-400"} font-medium text-sm  ml-2`}>{props.advertDetail?.ShowProduct ? "Aktif" : "Pasif"}</div>
                </div>
            }
          </div>
          <div className=" w-1/2">
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>Piyasa Fiyatı</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{fraction.format(props.advertDetail?.MarketPrice ?? 0) + " TL"}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>Housiy Satış Fiyatı</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">{fraction.format(props.advertDetail?.SalePrice ?? 0) + " TL"}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>BUYBOX Fiyatı (KDV Dahil)</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-green-400 ml-2">{fraction.format(props.advertDetail?.BuyboxPrice ?? 0) + " TL"}</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>KDV</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">Dahil</div>
                </div>
            }
            {
              props.loading ?
                <Loading textMd />
                :
                <div className="flex mb-2">
                  <div className="w-1/3 flex p-sm-gray-700"><span>KDV Oranı</span><span className="ml-auto">:</span></div>
                  <div className="text-sm text-gray-900 ml-2">%{props.advertDetail?.TaxRate}</div>
                </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}
