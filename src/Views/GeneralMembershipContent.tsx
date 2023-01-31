import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Loading } from "../Components/Loading";
import { Table } from "../Components/Table";
import { MembershipPackageModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { formatter, fraction } from "../Services/Functions";

export const GeneralMembershipContent: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [laoding, setLoading] = useState<boolean>(false);

  const [packageList, setPackageList] = useState<MembershipPackageModel[]>([]);

  useEffect(() => {
    getMembershipList();
  }, []);

  const getMembershipList = async () => {
    setLoading(true);

    const _result = await ApiService.getMemberShipPackageList();

    if (_result.succeeded === true) {
      setPackageList(_result.data);
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4 border-b border-gray-200">Üyelik Paketleri</h2>
        <div className=" lg:grid-cols-3 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Paket Adı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Paket Tutarı
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Paket Süresi
            </span>
          </div>
        </div>
        {
          laoding ?
            <>
              <Loading width="w-full" height="h-24" />
              <Loading width="w-full" height="h-24" />
              <Loading width="w-full" height="h-24" />
            </>
            :
            packageList.map((e, i) => (
              <div key={"list" + i} className=" lg:grid-cols-3 px-2 border-b py-6 border-gray-200 hidden lg:grid flex gap-4 items-center">
                <div className="lg:col-span-1">
                  <p className="p-sm">
                    {e.Title}
                  </p>
                </div>
                <div className="lg:col-span-1">
                  <p className="p-sm">
                    {e.Price % 1 === 0 ?
                      <>{fraction.format(e.Price ?? 0)} TL </>
                      :
                      <>{formatter.format(e.Price ?? 0)} TL</>
                    }
                  </p>
                </div>
                <div className="lg:col-span-1 flex justify-between">
                  <p className="p-sm">
                    {e.Duration + " gün"}
                  </p>
                  <div className="text-gray-700 flex gap-2 items-center">
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { history.push(`/genel-uyelik-duzenle/${e.Type}`); }} />
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}
