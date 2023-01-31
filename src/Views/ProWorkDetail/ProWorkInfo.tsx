import { FunctionComponent } from "react"
import { WorkDetailModel, WorkStatus } from "../../Models"
import { Image } from "../../Components/Image";
import { useHistory } from "react-router-dom";
import { formatter, fraction } from "../../Services/Functions";

interface ProWorkInfoProp {
  item?: WorkDetailModel
}

export const ProWorkInfo: FunctionComponent<ProWorkInfoProp> = (props: ProWorkInfoProp) => {

  const history = useHistory();

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  return (
    <div className="pt-4">
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İş Durumu</span><span>:</span></div>
        {
          (props.item?.Status === WorkStatus.WORK_CANCELED_BY_PRO || props.item?.Status === WorkStatus.WORK_CANCELED_BY_USER) ?
            <div className="bg-gray-200 text-gray-900 py-1 w-40 text-center font-medium rounded-full">İş İptal Edildi</div>
            :
            (props.item?.Status === WorkStatus.REQUEST_CANCELED) ?
              <div className="bg-gray-100 text-gray-900 py-1 w-40 text-center font-medium rounded-full">Talep İptal Edildi</div>
              :
              (props.item?.Status === WorkStatus.REQUEST_REJECTED) ?
                <div className="bg-gray-100 text-gray-900 py-1 w-40 text-center font-medium rounded-full">Talep Reddedildi</div>
                :
                (props.item?.Status === WorkStatus.WAITING_OFFER) ?
                  <>
                    {
                      Date.now() > props.item?.ProOfferExpirationDate ?
                        <div className="bg-gray-100 text-gray-900 py-1 w-40 text-center font-medium rounded-full">Teklif Süresi Doldu</div>
                        :
                        <div className="bg-red-100 text-yellow-600 py-1 w-40 text-center font-medium rounded-full">Teklif Bekliyor</div>
                    }
                  </>
                  :
                  (props.item?.Status === WorkStatus.OFFER_REJECTED) ?
                    <div className="bg-gray-100 text-gray-900 py-1 w-40 text-center font-medium rounded-full">Teklif Reddedildi</div>
                    :
                    (props.item?.Status === WorkStatus.WAITING_OFFER_RESULT) ?
                      <>
                        {
                          Date.now() > props.item?.ProOfferExpirationDate ?
                            <div className="bg-gray-100 text-gray-900 py-1 w-40 text-center font-medium rounded-full">Teklif Süresi Doldu</div>
                            :
                            <div className="bg-red-100 text-yellow-600 py-1 w-40 text-center font-medium rounded-full">Teklif Onay Bekliyor</div>
                        }
                      </>
                      :
                      (props.item?.Status === WorkStatus.WORK_COMPLETED) ?
                        <div className="bg-green-100 text-green-400 py-1 w-40 text-center font-medium rounded-full">İş Tamamlandı</div>
                        :
                        (props.item?.Status === WorkStatus.WAITING_TO_WORK_COMPLETE || props.item?.Status === WorkStatus.WATING_WORK_START) ?
                          <div className="bg-blue-100 text-blue-400 py-1 w-40 text-center font-medium rounded-full">İş Devam Ediyor</div>
                          :
                          (props.item?.Status === WorkStatus.WAITING_WORK_COMPLETE_APPROVAL) ?
                            <div className="bg-green-100 text-green-400 py-1 w-40 text-center font-medium rounded-full">İş Tamamlandı</div>
                            :
                            <></>
        }
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Müşteri Adı</span><span>:</span></div>
        <div className="flex gap-2 items-center">
          <Image src={props.item?.UserPhoto ?? ""} className="w-8 h-8 rounded-full" />
          <div className="text-gray-900 font-medium">{props.item?.UserName ?? "-"}</div>
        </div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Profesyonel Bilgisi</span><span>:</span></div>
        <div className="text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push(`/pro-profesyonel-detay/${props.item?.ProId ?? "0"}`); }}>{props.item?.ProStoreName ?? "-"}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İş Tanımı</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{props.item?.WorkName ?? "-"}</div>
      </div>
      {
        (props.item?.ProOfferApproveDate ?? 0) > 0 &&
        <div className="flex items-center text-sm gap-2 mb-4">
          <div className="text-gray-700 flex justify-between w-1/6"><span>Teklif Onay Tarihi</span><span>:</span></div>
          <div className="text-gray-900 font-medium">{handleJsDate(props.item?.ProOfferApproveDate ?? 0)}</div>
        </div>
      }

      {
        !(props.item?.Status === WorkStatus.REQUEST_CANCELED || props.item?.Status === WorkStatus.REQUEST_REJECTED) &&
        <>
          <div className="flex items-center text-sm gap-2 mb-4">
            <div className="text-gray-700 flex justify-between w-1/6"><span>Seçili Ödeme Planı</span><span>:</span></div>
            <div className="text-gray-900 font-medium">Toplam {" " + (props.item?.PaymentData?.length ?? 0) + " "} Taksit</div>
          </div>
          <div className="py-4 px-2 bg-gray-100 text-gray-400 text-sm font-medium grid grid-cols-4">
            <div className="col-span-1">Ödeme Planı</div>
            <div className="col-span-1">Ödeme Tarihi</div>
            <div className="col-span-1">Ödeme Oranı</div>
            <div className="col-span-1">Ödenecek Tutar</div>
          </div>
          <div className="py-4 px-2 text-sm grid grid-cols-4 text-gray-900 font-medium">
            {
              props.item?.PaymentData && props.item?.PaymentData?.length > 0 ?
                <div className="col-span-3">Toplam {" " + (props.item?.PaymentData?.length ?? 0) + " "} Taksit</div>
                :
                <div className="col-span-3">Toplam 1 Taksit</div>
            }
            <div className="col-span-1">
              {Number(props.item?.TotalPrice ?? 0) % 1 === 0 ?
                <>{fraction.format(Number(props.item?.TotalPrice ?? 0))} TL </>
                :
                <>{formatter.format(Number(props.item?.TotalPrice ?? 0))} TL</>
              }
            </div>
          </div>
          {
            props.item?.PaymentData &&
            <>
              {
                props.item.PaymentData.map((item, index) => (
                  <div key={"installment_" + index} className="py-4 px-2 text-sm grid grid-cols-4 text-gray-900">
                    <div className="col-span-1">{item.InstallmentOrder}. taksit</div>
                    <div className="col-span-1">{handleJsDate(item.MustPayDateJS)}</div>
                    <div className="col-span-1">{"%" + item.PriceRatio}</div>
                    <div className="col-span-1">
                      {Number(item.Price ?? 0) % 1 === 0 ?
                        <>{fraction.format(Number(item.Price ?? 0))} TL </>
                        :
                        <>{formatter.format(Number(item.Price ?? 0))} TL</>
                      }
                    </div>
                  </div>
                ))
              }
            </>
          }
        </>
      }


    </div>
  )
}
