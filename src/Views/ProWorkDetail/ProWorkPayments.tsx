import { FunctionComponent } from "react"
import { EmptyList } from "../../Components/EmptyList";
import { WorkDetailModel } from "../../Models";
import { formatter, fraction } from "../../Services/Functions";

interface ProWorkPaymentsProp {
  item?: WorkDetailModel
}

export const ProWorkPayments: FunctionComponent<ProWorkPaymentsProp> = (props: ProWorkPaymentsProp) => {

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
    <>
      <div className="grid grid-cols-5 py-5 border-b border-gray-200 text-type-12-medium text-gray-700 flex items-center">
        <div className="col-span-1">Ödeme Adı</div>
        <div className="col-span-1">Planlanan Ödeme Tarihi</div>
        <div className="col-span-1">Ödeme Tarihi</div>
        <div className="col-span-1">Ödenecek Tutar</div>
        <div className="col-span-1">Durum</div>
      </div>
      {
        (props.item?.PaymentData && props.item?.PaymentData.length > 0) ?
          <>
            {
              props.item.PaymentData.map((item) => (
                <div className="grid grid-cols-5 py-5 border-b border-gray-200 text-sm text-gray-900 font-medium flex items-center">
                  <div className="col-span-1">{item.InstallmentOrder + ". Taksit"}</div>
                  <div className="col-span-1">{handleJsDate(item.MustPayDateJS)}</div>
                  <div className="col-span-1">{handleJsDate(item.PayedDateJS)}</div>
                  <div className="col-span-1">
                    {Number(item.Price ?? 0) % 1 === 0 ?
                      <>{fraction.format(Number(item.Price ?? 0))} TL </>
                      :
                      <>{formatter.format(Number(item.Price ?? 0))} TL</>
                    }
                  </div>
                  <div className="col-span-1">
                    {
                      item.IsPayed ?
                        <div className="bg-green-100 text-green-400 py-1 w-32 text-center font-medium rounded-full">Tahsil Edildi</div>
                        :
                        <div className="bg-red-100 text-yellow-600 py-1 w-32 text-center font-medium rounded-full">Ödeme Bekliyor</div>
                    }
                  </div>
                </div>
              ))
            }
          </>
          :
          <EmptyList text="Ödeme Bilgisi Bulunamadı" />
      }
    </>
  )
}
