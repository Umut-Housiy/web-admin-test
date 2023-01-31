import { FunctionComponent, useContext, useRef } from "react"
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { formatter, fraction } from "../../Services/Functions";
import { Table } from "../../Components/Table";
import { UserWorkListInnerForAdminModel, WorkPaymentStatus, WorkStatus } from "../../Models";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../../Components/Icons";

interface ServicesProps {
  UserId: number,
}

export const Services: FunctionComponent<ServicesProps> = (props: ServicesProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const getUserWorksForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getUserWorksForAdmin(props.UserId, page, take, searchText, order);

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
      emptyListText={"Hizmet Bulunamadı"}
      getDataFunction={getUserWorksForAdmin}
      header={
        <div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Profesyonel Bilgisi
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              İş Tanımı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              İş Başlanıç Tarihi
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              İş Teslim Tarihi
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Toplam Tutar
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Ödeme Durumu
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Hizmet Durumu
            </span>
          </div>
        </div>
      }
      renderItem={(e: UserWorkListInnerForAdminModel, i) => {
        return <div className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
          <div className="lg:col-span-1 gap-2 flex items-center">
            <p className="text-sm font-medium text-blue-400 underline cursor-pointer" onClick={() => { history.push("/pro-profesyonel-detay/" + e.ProId); }}>
              {e.StoreName}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="p-sm">
              {e.WorkName ?? ""}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="p-sm">
              {handleJsDate(e.WorkStartDateJSTime)}
            </p>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <p className="p-sm">
              {handleJsDate(e.WorkCompleteDateJSTime)}
            </p>
          </div>
          <div className="lg:col-span-1  flex items-center">
            <p className="text-sm text-black-400 font-medium">
              {e.TotalPrice % 1 === 0 ?
                <>{fraction.format(e.TotalPrice)} TL </>
                :
                <>{formatter.format(e.TotalPrice)} TL</>
              }
            </p>
          </div>
          <div className="lg:col-span-1  flex items-center">
            {
              e.PaymentStatus === WorkPaymentStatus.COMPLETED ?
                <div className="w-40 bg-green-100 text-green-400 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Tamamlandı</div>
                :
                e.PaymentStatus === WorkPaymentStatus.PAYMENT_DELAY ?
                  <div className="w-40 bg-red-100 text-red-400 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Ödeme Gecikti</div>
                  :
                  e.PaymentStatus === WorkPaymentStatus.REFUNDED ?
                    <div className="w-40 bg-green-100 text-green-400 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">İade Edildi</div>
                    :
                    e.PaymentStatus === WorkPaymentStatus.WAITING_FOR_INSTALLMENT_PAY ?
                      <div className="w-40 bg-red-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Reddedildi</div>
                      :
                      e.PaymentStatus === WorkPaymentStatus.WAITING_FOR_REFUND ?
                        <div className="w-40 bg-red-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">İade Bekliyor</div>
                        :
                        <></>
            }
          </div>
          <div className="lg:col-span-1 flex justify-between">
            <div className="text-gray-700 flex gap-1 justify-between items-center">
              {
                e.Status === WorkStatus.WORK_COMPLETED ?
                  <div className="w-40 bg-green-100 text-green-400 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">İş Tamamlandı</div>
                  :
                  e.Status === WorkStatus.REQUEST_CANCELED ?
                    <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Talep İptal Edildi</div>
                    :
                    e.Status === WorkStatus.REQUEST_REJECTED ?
                      <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Talep Reddedildi</div>
                      :
                      e.Status === WorkStatus.OFFER_REJECTED ?
                        <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Reddedildi</div>
                        :
                        e.Status === WorkStatus.WAITING_OFFER ?
                          <div className="w-40 bg-red-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Bekliyor</div>
                          :
                          e.Status === WorkStatus.WAITING_OFFER_RESULT ?
                            <div className="w-40 bg-red-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Onay Bekliyor</div>
                            :
                            (e.Status === WorkStatus.WATING_WORK_START || e.Status === WorkStatus.WAITING_TO_WORK_COMPLETE) ?
                              <div className="w-40 bg-blue-100 text-blue-400 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">İş Devam Ediyor</div>
                              :
                              (e.Status === WorkStatus.WORK_CANCELED_BY_PRO || WorkStatus.WORK_CANCELED_BY_USER) ?
                                <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto text-sm flex items-center justify-center rounded-full">İş İptal Edildi</div>
                                :
                                e.Status === WorkStatus.WAITING_TO_WORK_COMPLETE ?
                                  <div className="w-40 bg-red-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Devam Ediyor</div>
                                  :
                                  <></>
              }
              <div className="flex gap-2 items-center">
                <Link to={{ pathname: `${"/hizmet-detay/" + e.WorkId}` }} >
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
