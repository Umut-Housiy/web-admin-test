import { FunctionComponent, useContext, useRef } from "react"
import { Table } from "../Components/Table";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { ChevronRightIcon } from "../Components/Icons";
import { formatter, fraction, readPageQueryString } from "../Services/Functions";
import { Link, useHistory } from "react-router-dom";
import ApiService from "../Services/ApiService";

export const ProWorkInstallmentList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getWorkInstallmentList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getWorkInstallmentList(page, take, searchText, order);

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
        <h2 className="mb-5">Taksitli Ödemeler</h2>
        <Table
          ref={tableEl}
          emptyListText={"Ödeme Bulunamadı"}
          getDataFunction={getWorkInstallmentList}
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
                Toplam Tutar
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ödeme Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Taksit Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kalan Tutar
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
                <p className="text-sm underline text-blue-400 font-medium curosr-pointer" onClick={() => { history.push(`/pro-profesyonel-detay/${e.ProId}`); }}>
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
                  {e.TotalPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {handleJsTime(e.PaymentDateJSTime)}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.InstallmentOrder}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center  justify-between">
                <p className="p-sm">
                  {e.RemainingPrice % 1 === 0 ?
                    <>{fraction.format(e.RemainingPrice)} TL </>
                    :
                    <>{formatter.format(e.RemainingPrice)} TL</>
                  }
                </p>
                <div>
                  <Link to={{ pathname: `/is-odeme-detay/${e.WorkId}`, state: { prevTitle: "Taksitli Ödemeler", prevPath: window.location.pathname, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 text-gray-700 cursor-pointer transition-all" />
                  </Link>
                </div>
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
