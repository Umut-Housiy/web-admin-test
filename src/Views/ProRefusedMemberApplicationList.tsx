import { FunctionComponent, useContext, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { CategorySelectPro } from "../Components/CategorySelectPro";
import { DateView } from "../Components/DateView";
import { Dropdown } from "../Components/Dropdown";
import { AlertIcon, ChevronRightIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import { useStateEffect } from "../Components/UseStateEffect";
import ApiService from "../Services/ApiService";
import { saveAsExcel } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const ProRefusedMemberApplicationList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const [showModal, setShowModal] = useState<boolean>(false)

  const [modalRefuseDate, setModalRefuseDate] = useState<string>("");

  const [modalRefuseReason, setModalRefuseReason] = useState<string>("");

  const [modalRefuseDescription, setModalRefuseDescription] = useState<string>("");

  const getRefusedList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getProRejectedList(page, take, order, searchText, categoryId);

    if (_result.succeeded === true) {
      setCategoryClear(false);
      setCurrentOpenedFilterButton("");
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

  //#region filters
  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const sortOptions = [
    { key: "1", value: "Yeniden Eskiye" },
    { key: "2", value: "Eskiden Yeniye" },
  ];

  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);

  const [categoryId, setCategoryId] = useState<number>(0);

  const [displayText, setDisplayText] = useState<string>("");

  const [categoryClear, setCategoryClear] = useState<boolean>(false);

  //#endregion

  // #region download excel

  const [downloadExcel, setDownloadExcel] = useState<boolean>(false);

  const [listExcelData, setListExcelData] = useState<any[]>([]);

  useStateEffect(() => {
    let _dataExcel: { companyName: string, tel: string, email: string, rejectedDate: string, applicationDate: string, type: string }[] = [];
    let header = ["Şirket Adı", "Telefon No.", "Email", "Red Tarihi", "Başvuru Tarihi", "Üyelik Tipi"];
    if (downloadExcel === true && listExcelData.length > 0) {
      listExcelData.map((e) => (
        _dataExcel.push(
          {
            companyName: `${e.StoreName}`,
            tel: `${e.Phone}`,
            email: `${e.Email}`,
            rejectedDate: `${e.RejectDate}`,
            applicationDate: `${e.RecourseDate}`,
            type: `${e.UserType}`,
          },
        )
      ));
      saveAsExcel(_dataExcel, header, "Profesyonel Reddedilen Üyelik Başvuruları");
    }

  }, [listExcelData, downloadExcel]);

  // #endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <div className="flex items-center justify-between mb-5">
          <h2 >Reddedilen Üyelik Başvuruları</h2>
          <Button text="Excel İle İndir" design="button bg-green-400 text-white w-60" buttonMd onClick={() => setDownloadExcel(true)} />
        </div>
        <Table
          key={`${downloadExcel}`}
          ref={tableEl}
          emptyListText={"Başvuru Bulunamadı"}
          getDataFunction={getRefusedList}
          downloadExcel={downloadExcel}
          setDownloadExcel={setDownloadExcel}
          getExcelDataFunction={getRefusedList}
          setListExcelData={setListExcelData}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Şirket Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Telefon No.
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Email
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Red Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Başvuru Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Üyelik Tipi
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.Phone}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.Email}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.RejectDate}
                </p>
              </div>
              <div className="lg:col-span-2">
                <DateView className="p-sm" dateNumber={e.CreatedDateJSTime} pattern="dd MMM yyyy HH:mm" />
              </div>
              <div className="lg:col-span-2 flex justify-between">
                <p className="p-sm">
                  {e.UserType}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400  cursor-pointer transition-all border-l pl-1"
                    onClick={() => { handleShowModal(e); }} />
                </div>
              </div>
            </div>
          }}
          isCustomFilter
          showFilterOpen={false}
          customFilter={
            <div className="grid lg:grid-cols-11 flex justify-end gap-x-3">
              <div className="lg:col-span-5">
                <div className="flex justify-between items-center">
                  <Label withoutDots title="Kategoriye Göre Filtrele" />
                  {categoryId !== 0 &&
                    <TrashIcon onClick={() => { setCategoryId(0); setCategoryClear(true) }} className="icon-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-all duration-300" />
                  }
                </div>
                <CategorySelectPro key="1" value={categoryId} clear={categoryClear} onChange={setCategoryId} setCategoryDisplayText={setDisplayText} />
              </div>
              <div className="lg:col-span-4  "></div>

              <div className="lg:col-span-2 ">
                <Label withoutDots title="Sırala" />
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "sortOptions"}
                  onClick={() => { setCurrentOpenedFilterButton("sortOptions"); }}
                  className="w-full text-black-700 text-sm"
                  label={selectedSortOption.value}
                  items={sortOptions}
                  onItemSelected={item => { setSelectedSortOption(item); }} />
              </div>
            </div>
          }
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showModal}
        onClose={() => { setShowModal(false); }}
        headerClassName=""
        bodyClassName="pt-4 pb-6 rounded-b-lg"
        title="Başvuru Red Detayı"
        body={<>
          <div>
            <div className="flex">
              <AlertIcon className="w-4 h-4 text-red-400 my-auto" />
              <div className="text-sm font-medium text-red-400 my-auto ml-2">Bu başvuru admin tarafından reddedildi.</div>
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
        </>} />
    </div>
  )
}
