import React, { FunctionComponent, useContext, useRef, useState } from "react"
import { AlertIcon, ChevronRightIcon, EditIcon, FilterIcon, PlusIcon, RefreshIcon, TrashIcon } from "../Components/Icons"
import { Modal } from "../Components/Modal"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import { useHistory } from "react-router-dom"
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService"
import { useStateEffect } from "../Components/UseStateEffect"
import { saveAsExcel } from "../Services/Functions"
import { SellerType } from "../Models"
import { Button } from "../Components/Button"
import { DateView } from "../Components/DateView"

export const SellerRefusedList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const [showModal, setShowModal] = useState<boolean>(false)

  const [modalRefuseDate, setModalRefuseDate] = useState<string>("");

  const [modalRefuseReason, setModalRefuseReason] = useState<string>("");

  const [modalRefuseDescription, setModalRefuseDescription] = useState<string>("");

  const getSellerRejectedList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerRejectedList(page, take, searchText, order);

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

  const handleShowModal = (item) => {
    setModalRefuseDate(item.RejectDate ?? "");
    setModalRefuseReason(item.RejectType ?? "");
    setModalRefuseDescription(item.RejectReason ?? "")
    setShowModal(true);
  }

  // #region download excel

  const [downloadExcel, setDownloadExcel] = useState<boolean>(false);

  const [listExcelData, setListExcelData] = useState<any[]>([]);

  useStateEffect(() => {
    let _dataExcel: { companyName: string, tel: string, email: string, applicationDate: string, type: string }[] = [];
    let header = ["Mağaza Adı", "Telefon No.", "Email", "Başvuru Tarihi", "Firma Tipi"];
    if (downloadExcel === true && listExcelData.length > 0) {
      listExcelData.map((e) => (
        _dataExcel.push(
          {
            companyName: `${e.StoreName}`,
            tel: `${e.Phone}`,
            email: `${e.Email}`,
            applicationDate: `${e.RecourseDate}`,
            type: `${SellerType[e.CompanyType]}`,
          },
        )
      ));
      saveAsExcel(_dataExcel, header, "Reddedilen Satıcı Başvuruları");
    }

  }, [listExcelData, downloadExcel]);

  // #endregion

  return (
    <>
      <div className="content-wrapper">
        <div className="portlet-wrapper">
          <div className="flex items-center justify-between mb-5">
            <h2 >Reddedilen Satıcı Başvuruları</h2>
            <Button text="Excel İle İndir" design="button bg-green-400 text-white w-60" buttonMd onClick={() => setDownloadExcel(true)} />
          </div>
          <Table
            ref={tableEl}
            key={`${downloadExcel}`}
            emptyListText={"Satıcı Bulunamadı"}
            getDataFunction={getSellerRejectedList}
            downloadExcel={downloadExcel}
            setDownloadExcel={setDownloadExcel}
            getExcelDataFunction={getSellerRejectedList}
            setListExcelData={setListExcelData}
            header={<div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
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
            </div>}
            renderItem={(e, i) => {
              return <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b py-7 border-gray-200 hidden lg:grid flex gap-4 items-center">
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
                  <p className="p-sm">
                    {e.Email}
                  </p>
                </div>
                <div className="lg:col-span-1">
                  <DateView className="p-sm" dateNumber={e.CreatedDateJSTime} pattern="dd MMM yyyy HH:mm" />
                </div>
                <div className="lg:col-span-1 flex justify-between">
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
                  <div className="text-gray-700 flex gap-2 items-center">
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400  cursor-pointer transition-all border-l pl-1"
                      onClick={() => { handleShowModal(e); }} />
                  </div>
                </div>
              </div>
            }}
          />
        </div>
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showModal}
        onClose={() => { setShowModal(false); }}
        title="Başvuru Red Detayı"
        body={
          <div>
            <div className="flex">
              <AlertIcon className="w-4 h-4 text-red-400 my-auto" />
              <div className="text-sm font-medium text-red-400 my-auto ml-2">Bu satıcı başvurusu admin tarafından reddedildi.</div>
            </div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Tarihi</div>
            <div className="text-sm  font-medium mt-2">{modalRefuseDate}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Nedeni</div>
            <div className="text-sm  font-medium mt-2">{modalRefuseReason}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Açıklama</div>
            <div className="text-sm  font-medium mt-2">
              {modalRefuseDescription}
            </div>
          </div>
        } />
    </>
  )
}
