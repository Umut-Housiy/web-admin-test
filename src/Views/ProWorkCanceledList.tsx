import { FunctionComponent, useContext, useRef } from "react"
import { Table } from "../Components/Table";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { ChevronRightIcon } from "../Components/Icons";
import { formatter, fraction, readPageQueryString } from "../Services/Functions";
import { WorkPaymentStatus } from "../Models";
import { Link, useHistory } from "react-router-dom";
import ApiService from "../Services/ApiService";

export const ProWorkCanceledList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "Tarihe göre artan" },
    { key: "2", value: "Tarihe göre azalan" },
    { key: "3", value: "Fiyata göre azalan" },
    { key: "4", value: "Fiyata göre artan" }
  ];

  const getWorkCanceledList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getWorkCanceledList(page, take, searchText, order);

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

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleDateString() ?? "-";
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">İptal Edilen İşler</h2>
        <Table
          ref={tableEl}
          emptyListText={"İş Bulunamadı"}
          getDataFunction={getWorkCanceledList}
          header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Müşteri Bilgisi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İş Tanımı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İş Başlangıç Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Hizmet İptal Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ödeme Durumu
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1 gap-2 flex items-center">
                <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-cover" />
                <p className="p-sm">
                  {e.UserName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="text-sm underline text-blue-400 font-medium" onClick={() => { history.push(`/pro-profesyonel-detay/${e.ProId}`); }}>
                  {e.ProStoreName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.WorkName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {
                    e.WorkStartDateJS && e.WorkStartDateJS > 0 ?
                      <>
                        {handleJsTime(e.WorkStartDateJS)}
                      </>
                      :
                      e.PlannedWorkStartDate && e.PlannedWorkStartDate > 0 ?
                        <>
                          {handleJsTime(e.PlannedWorkStartDate)}
                        </>
                        :
                        <></>
                  }
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {handleJsTime(e.RejectDate)}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.TotalPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center gap-1 justify-between">
                <p className="font-medium text-sm">
                  {e.PaymentStatus === WorkPaymentStatus.COMPLETED ?
                    <div className="w-40 text-center py-1 rounded-full bg-green-100 text-green-400">Tamamlandı</div>
                    :
                    e.PaymentStatus === WorkPaymentStatus.WAITING_FOR_INSTALLMENT_PAY ?
                      <div className="w-40 text-center py-1 rounded-full bg-red-100 text-yellow-600">Ödeme Bekliyor</div>
                      :
                      e.PaymentStatus === WorkPaymentStatus.PAYMENT_DELAY ?
                        <div className="w-40 text-center py-1 rounded-full bg-red-100 text-red-400">Geciken Ödeme</div>
                        :
                        e.PaymentStatus === WorkPaymentStatus.REFUNDED ?
                          <div className="w-40 text-center py-1 rounded-full bg-green-100 text-green-400">İade Edildi</div>
                          :
                          e.PaymentStatus === WorkPaymentStatus.WAITING_FOR_REFUND ?
                            <div className="w-40 text-center py-1 rounded-full bg-red-100 text-red-400">İade Bekliyor</div>
                            :
                            <></>
                  }
                </p>
                <div>
                  <Link to={{ pathname: `/hizmet-detay/${e.WorkId}`, state: { prevTitle: "İptal Edilen İşler", prevPath: window.location.pathname, tabId: 1, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 text-gray-700 cursor-pointer transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  )
}
