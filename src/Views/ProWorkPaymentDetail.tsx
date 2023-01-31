import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { ChevronRightIcon } from "../Components/Icons";
import { WorkPaymentModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { formatter, fraction } from "../Services/Functions";
import { Loading } from "../Components/Loading";


interface RouteParams {
  id: string
}

interface LocationParams {
  prevTitle: string,
  prevPath: string,
  queryPage: number,
}

export const ProWorkPaymentDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const location = useLocation<LocationParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [paymentList, setPaymentList] = useState<WorkPaymentModel[]>([]);

  useEffect(() => {
    getWorkPaymentDetail();
  }, []);

  const getWorkPaymentDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getWorkPaymentDetail(Number(params?.id ?? "0"));

    if (_result.succeeded === true) {
      setPaymentList(_result.data);
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push(location.state?.prevPath ?? "/tamamlanan-odemeler"); }
      });
    }
  }

  const handleJsTime = (JsTime) => {
    if (JsTime > 0) {
      try {
        var time = new Date(JsTime);
        return time.toLocaleDateString() ?? "";
      }
      catch {
        return ""
      }
    }
    else {
      return ""
    }
  }
  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={location.state?.prevPath !== undefined ? (location.state?.queryPage !== 1 ? (location.state?.prevPath + "?sayfa=" + location.state?.queryPage) : location.state?.prevPath) : ("/tamamlanan-odemeler")} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            {location.state?.prevTitle ?? "Tamamlanan Ödemeler"}
          </div>
        </Link>
        <h2 className="mb-5">Ödeme Detayı</h2>
        <div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Ödeme Adı
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Planlanan Ödeme Tarihi
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Ödeme Tarihi
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Tutar
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Ödeme Tipi
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Durum
            </span>
          </div>
        </div>
        {
          loading ?
            <>
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
              <Loading width="w-full" height="h-20" />
            </>
            :
            paymentList &&
            paymentList.map((item, index) => (
              <div key={"key_" + index} className="lg:grid-cols-6 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                <div className="lg:col-span-1 flex items-center">
                  <span className="p-sm">
                    {item.InstallmentOrder + ". taksit"}
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm">
                    {handleJsTime(item.MustPayDateJS)}
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm">
                    {handleJsTime(item.PayedDateJS ?? "-")}
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm">
                    {item.Price % 1 === 0 ?
                      <>{fraction.format(item.Price)} TL </>
                      :
                      <>{formatter.format(item.Price)} TL</>
                    }
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm">
                    {item.IsPayed ? (item.TotalInstallmentCount === 1 ? "Peşin" : "Taksitli") : "-"}
                  </span>
                </div>
                <div className="lg:col-span-1 text-sm">
                  {item.IsPayed ?
                    <div className="w-40 text-center py-1 rounded-full bg-green-100 text-green-400">Tahsil Edildi</div>
                    :
                    <div className="w-40 text-center py-1 rounded-full bg-red-100 text-red-400">Ödeme Bekliyor</div>
                  }
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}
