import { FunctionComponent, useContext, useRef } from "react"
import { Link } from "react-router-dom";
import { DateView } from "../../Components/DateView";
import { Table } from "../../Components/Table"
import ApiService from "../../Services/ApiService";
import { formatter, fraction, readPageQueryString } from "../../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

export const ProSubscriptionPaymentsList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getProSubscriptionPaymentsForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProSubscriptionPaymentsForAdmin(page, take, searchText, order);

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


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Profesyonel Abonelik Ödeme Listesi
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"Veri Bulunamadı"}
          getDataFunction={getProSubscriptionPaymentsForAdmin}
          header={<div className="lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Paket Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Ödeme Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-2 gap-2 flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Bilgisi:</span>
                <Link to={`/pro-profesyonel-detay/${e.ProId}`} className="underline text-blue-400 font-medium text-sm">{e.ProStoreName}</Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Paket Bilgisi:</span>
                <p className="p-sm">
                  {e.PackageName}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ödeme Tarihi:</span>
                {e.PayedDateJSTime > 0 ?
                  <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.PayedDateJSTime} pattern="dd/MM/yyyy" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="text-black-400 font-medium text-sm lg:hidden mr-2">Toplam Tutar:</span>
                <p className="p-sm">
                  {e.TotalPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalPrice)} TL</>
                  }
                </p>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>

  )
}
