import { FunctionComponent } from "react"
import { AlertIcon, CloseIcon } from "../../Components/Icons"
import { WorkDetailModel, WorkPaymentStatus, WorkStatus } from "../../Models"
import { formatter, fraction } from "../../Services/Functions";

interface ProWorkCancelInfo {
  item?: WorkDetailModel
}

export const ProWorkCancelInfo: FunctionComponent<ProWorkCancelInfo> = (props: ProWorkCancelInfo) => {

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleDateString() ?? "-";
  }

  return (
    <div className="pt-4">
      {
        (props.item?.Status === WorkStatus.WORK_CANCELED_BY_PRO || props.item?.Status === WorkStatus.WORK_CANCELED_BY_USER) &&
        <div className="flex items-center gap-1 text-red-400 text-sm mb-4">
          <CloseIcon className="icon-sm text-red-400" />
          <div className="text-red-400 font-medium">{`İş ${props.item?.Status === WorkStatus.WORK_CANCELED_BY_PRO ? "profesyonel tarafından" : props.item?.Status === WorkStatus.WORK_CANCELED_BY_USER ? "kullanıcı tarafından" : ""} iptal edilmiştir`}</div>
        </div>
      }
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
                  <div className="bg-red-100 text-yellow-600 py-1 w-40 text-center font-medium rounded-full">Teklif Bekliyor</div>
                  :
                  (props.item?.Status === WorkStatus.OFFER_REJECTED) ?
                    <div className="bg-gray-100 text-gray-900 py-1 w-40 text-center font-medium rounded-full">Teklif Reddedildi</div>
                    :
                    (props.item?.Status === WorkStatus.WAITING_OFFER_RESULT) ?
                      <div className="bg-red-100 text-yellow-600 py-1 w-40 text-center font-medium rounded-full">Teklif Onay Bekliyor</div>
                      :
                      (props.item?.Status === WorkStatus.WORK_COMPLETED) ?
                        <div className="bg-green-100 text-green-400 py-1 w-40 text-center font-medium rounded-full">Teslim Edildi</div>
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
      {/* TODO:Ödeme işlemleri yapıldıktan sonra tamamlanmalı/kontrol edilmeli */}
      {/* <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Ödeme Durumu</span><span>:</span></div>
        {
          props.item?.PaymentStatus === WorkPaymentStatus.WAITING_FOR_REFUND ?
            <div className="bg-red-100 text-red-400 py-1 w-32 text-center font-medium rounded-full">İade Bekliyor</div>
            :
            props.item?.PaymentStatus === WorkPaymentStatus.REFUNDED ?
              <div className="bg-green-100 text-green-400 py-1 w-32 text-center font-medium rounded-full">İade Edildi</div>
              :
              <></>

        }
      </div> */}
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İptal/Red Tarihi</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{handleJsTime(props.item?.RejectDate ?? 0)}</div>
      </div>
      {/* TODO:Ödeme işlemleri yapıldıktan sonra tamamlanmalı/kontrol edilmeli */}
      {/* <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Kesinti Bedeli</span><span>:</span></div>
        <div className="text-gray-900 font-medium">
          {
            props.item?.Status === WorkStatus.WORK_CANCELED_BY_PRO ?
              <>
                {Number(props.item?.CancelPenaltyFeeForPro ?? 0) % 1 === 0 ?
                  <>{- fraction.format(Number(props.item?.CancelPenaltyFeeForPro ?? 0))} TL </>
                  :
                  <>{- formatter.format(Number(props.item?.CancelPenaltyFeeForPro ?? 0))} TL</>
                }
              </>
              :
              props.item?.Status === WorkStatus.WORK_CANCELED_BY_USER ?
                <>
                  {Number(props.item?.CancelPenaltyFeeForUser ?? 0) % 1 === 0 ?
                    <>{- fraction.format(Number(props.item?.CancelPenaltyFeeForUser ?? 0))} TL </>
                    :
                    <>{- formatter.format(Number(props.item?.CancelPenaltyFeeForUser ?? 0))} TL</>
                  }
                </>
                :
                <>-</>
          }
        </div>
      </div> */}
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İptal Nedeni</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{props.item?.RejectTitle ?? "-"}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İptal Açıklaması</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{props.item?.RejectReason ?? "-"}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4 text-red-400 font-medium">
        {
          props.item?.RequestCancelFromPro ?
            <>
              <AlertIcon className="icon-sm" />
              <div>Bu hizmet iptali sonucunda profesyonele {" " + props.item?.CancelPenaltyFeeForProDesc + " "} uygulanmıştır.</div>
            </>
            :
            props.item?.RequestCancelFromPro ?
              <>
                <AlertIcon className="icon-sm" />
                <div>Bu hizmet iptali sonucunda kullanıcıya {" " + props.item?.CancelPenaltyFeeForUserDesc + " "} uygulanmıştır.</div>
              </>
              :
              <></>
        }
      </div>
    </div>
  )
}
