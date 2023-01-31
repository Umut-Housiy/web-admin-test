import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { DateView } from "../Components/DateView";
import { ChevronRightIcon, FilterIcon, RefreshIcon, StarIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import { useStateEffect } from "../Components/UseStateEffect";
import { SellerType } from "../Models";
import ApiService from "../Services/ApiService";
import { readPageQueryString, saveAsExcel } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";


export const SellerApprovedList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getSellerApprovedList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerApprovedList(page, take, searchText, order);

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

  // #region download excel

  const [downloadExcel, setDownloadExcel] = useState<boolean>(false);

  const [listExcelData, setListExcelData] = useState<any[]>([]);

  useStateEffect(() => {
    let _dataExcel: { companyName: string, tel: string, email: string, applicationDate: string, type: string, rate: string, status: string }[] = [];
    let header = ["Mağaza Adı", "Telefon No.", "Email", "Başvuru Tarihi", "Firma Tipi", "Mağaza Puanı", "Durum"];
    if (downloadExcel === true && listExcelData.length > 0) {
      listExcelData.map((e) => (
        _dataExcel.push(
          {
            companyName: `${e.StoreName}`,
            tel: `${e.Phone}`,
            email: `${e.Email}`,
            applicationDate: `${e.RecourseDate}`,
            type: `${SellerType[e.CompanyType]}`,
            rate: `${e.StoreRate}`,
            status: `${e.IsEnabled === true ? "Aktif" : "Pasif"}`
          },
        )
      ));
      saveAsExcel(_dataExcel, header, "Onaylı Satıcı Listesi");
    }

  }, [listExcelData, downloadExcel]);

  // #endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <div className="flex items-center justify-between mb-5">
          <h2 >Onaylı Satıcı Listesi</h2>
          <Button text="Excel İle İndir" design="button bg-green-400 text-white w-60" buttonMd onClick={() => setDownloadExcel(true)} />
        </div>
        <Table
          ref={tableEl}
          key={`${downloadExcel}`}
          emptyListText={"Satıcı Bulunamadı"}
          getDataFunction={getSellerApprovedList}
          downloadExcel={downloadExcel}
          setDownloadExcel={setDownloadExcel}
          getExcelDataFunction={getSellerApprovedList}
          setListExcelData={setListExcelData}
          header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Mağaza Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Telefon No.
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Email
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Başvuru Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Firma Tipi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Mağaza Puanı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.Phone}
                </p>
              </div>
              <div className="lg:col-span-1">
                <div className="tooltip-wrapper relative">
                  <div className="pointer-events-none">
                    <p className="p-sm line-clamp-1">
                      {e.Email}
                    </p>
                    {e.Email.length >= 27 &&
                      <div className="tooltip  -bottom-6 left-0  justify-center shadow-md border-gray-300 z-10">
                        {e.Email}
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <DateView className="p-sm" dateNumber={e.CreatedDateJSTime} pattern="dd MMM yyyy HH:mm" />
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CompanyType === 1 ?
                    <>Anonim Şirket</>
                    :
                    e.CompanyType === 2 ?
                      <>Şahıs Şirketi</>
                      :
                      e.CompanyType === 3 ?
                        <>Limited Şirket</>
                        :
                        e.CompanyType === 4 ?
                          <>Kolektif Şirket</>
                          :
                          e.CompanyType === 5 ?
                            <>Kooperatif Şirket</>
                            :
                            e.CompanyType === 6 ?
                              <>Adi Ortaklık</>
                              :
                              <></>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex">
                <StarIcon className="w-4 h-4 text-yellow-600" />
                <span className="ml-2 text-sm text-yellow-600 font-medium">
                  {e.StoreRate}
                </span>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                {
                  e.IsEnabled === true ?
                    <span className="text-sm text-green-400 font-medium">
                      Aktif
                    </span>
                    :
                    <span className="text-sm text-red-400 font-medium">
                      Pasif
                    </span>

                }
                <span className="text-gray-900">
                  <Link to={{ pathname: `/satici-detay/${e.Id}`, state: { prevTitle: "Onaylı Satıcı Listesi", prevPath: window.location.pathname, tabId: 1, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400  cursor-pointer transition-all border-l pl-1" />
                  </Link>
                </span>
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
