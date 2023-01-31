import { FunctionComponent, useContext, useRef } from "react"
import { Table } from "../../Components/Table"
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Image } from "../../Components/Image"
import { Link } from "react-router-dom";
import { DateView } from "../../Components/DateView";
import { formatter, fraction, readPageQueryString } from "../../Services/Functions";
import { ChevronRightIcon } from "../../Components/Icons";

export const ProWaitingPaymentsList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];

  const getProWaitingPaymentsList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProWaitingPaymentsList(page, take, searchText, order);

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
          Bekleyen Profesyonel Tahsilatları
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"Tahsilat Bulunamadı"}
          getDataFunction={getProWaitingPaymentsList}
          header={<div className="lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Müşteri Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                İş Tanımı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Planlanan Ödeme Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Gelecek Tutar
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kalan Tutar
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-2 gap-2 flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Müşteri Bilgisi:</span>
                <div className="flex items-center">
                  <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-cover mr-2" />
                  <p className="p-sm">
                    {e.UserName}
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Bilgisi:</span>
                <Link to={`/pro-profesyonel-detay/${e.ProId}`} className="underline text-blue-400 font-medium text-sm">{e.ProStoreName}</Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İş Tanımı:</span>
                <p className="p-sm">
                  {e.WorkDescription}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Planlanan Ödeme Tarihi:</span>
                {e.PlannedPayDateJSTime > 0 ?
                  <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.PlannedPayDateJSTime} pattern="dd/MM/yyyy" />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="text-black-400 font-medium text-sm lg:hidden mr-2">Gelecek Tutar:</span>
                <p className="p-sm">
                  {e.IncomingPrice % 1 === 0 ?
                    <>{fraction.format(e.IncomingPrice)} TL </>
                    :
                    <>{formatter.format(e.IncomingPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kalan Tutar:</span>
                <p className="p-sm">
                  {e.RemainingPrice % 1 === 0 ?
                    <>{fraction.format(e.RemainingPrice)} TL </>
                    :
                    <>{formatter.format(e.RemainingPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <div className="flex items-center justify-between">
                  <p className="p-sm">
                    {e.TotalPrice % 1 === 0 ?
                      <>{fraction.format(e.TotalPrice)} TL </>
                      :
                      <>{formatter.format(e.TotalPrice)} TL</>
                    }
                  </p>
                  <Link to={{ pathname: `/hizmet-detay/${e.WorkId}`, state: { prevTitle: "Bekleyen Profesyonel Tahsilatları", prevPath: window.location.pathname, tabId: 6, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" />
                  </Link>                </div>

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
