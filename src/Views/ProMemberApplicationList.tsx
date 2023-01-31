import { FunctionComponent, useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CategorySelectPro } from "../Components/CategorySelectPro";
import { DatePicker } from "../Components/DatePicker";
import { Dropdown } from "../Components/Dropdown";
import { ChevronRightIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { readPageQueryString, saveAsExcel } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Button } from "../Components/Button";
import { useStateEffect } from "../Components/UseStateEffect";
import { DateView } from "../Components/DateView";

export const ProMemberApplicationList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getApplicationList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProApplicationList(page, take, Number(selectedSortOption.key), searchText, Number(selectedStatus.key), Number(selectedCompanyType.key), selectedMinDate?.getTime() ?? 0, selectedMaxDate?.getTime() ?? 0, categoryId);

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

  //#region filters
  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedCompanyType, setSelectedCompanyType] = useState({ key: "0", value: "Seçiniz..." });

  const companyOptions = [
    { key: "1", value: "Anonim Şirket" },
    { key: "2", value: "Şahıs Şirketi" },
    { key: "3", value: "Limited Şirket" },
    { key: "4", value: "Kolektif Şirket" },
    { key: "5", value: "Kooperatif Şirket" },
    { key: "6", value: "Adi Ortaklık" }
  ];

  const [selectedStatus, setSelectedStatus] = useState({ key: "0", value: "Seçiniz..." });

  const statusList = [
    { key: "1", value: "Kayıt Aşamasında" },
    { key: "2", value: "Onay Bekliyor" },
    { key: "5", value: "Hoşgeldiniz Aşamasında" }
  ];

  const [selectedMinDate, setSelectedMinDate] = useState<Date>();

  const [selectedMaxDate, setSelectedMaxDate] = useState<Date>();

  const sortOptions = [
    { key: "1", value: "Yeniden Eskiye" },
    { key: "2", value: "Eskiden Yeniye" },
  ];

  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);

  const [categoryId, setCategoryId] = useState<number>(0);

  const [displayText, setDisplayText] = useState<string>("");

  const [categoryClear, setCategoryClear] = useState<boolean>(false);

  //#endregion

  // #region excel

  const [downloadExcel, setDownloadExcel] = useState<boolean>(false);

  const [listExcelData, setListExcelData] = useState<any[]>([]);

  useStateEffect(() => {
    let _dataExcel: { companyName: string, tel: string, email: string, applicationDate: string, type: string, status: string }[] = [];
    let header = ["Şirket Adı", "Telefon No.", "Email", "Başvuru Tarihi", "Üyelik Tipi", "Başvuru Durumu"];
    if (downloadExcel === true && listExcelData.length > 0) {
      listExcelData.map((e) => (
        _dataExcel.push(
          {
            companyName: `${e.StoreName}`,
            tel: `${e.Phone}`,
            email: `${e.Email}`,
            applicationDate: `${e.RecourseDate}`,
            type: `${e.UserType}`,
            status: `${e.Status === 1 ? "Kayıt Aşamasında" : e.Status === 2 ? "Onay Bekliyor" : e.Status === 5 ? "Hoşgeldiniz Aşamasında" : ""}`
          },
        )
      ));
      saveAsExcel(_dataExcel, header, "Profesyonel Üyelik Başvuru Listesi");
    }

  }, [listExcelData, downloadExcel]);

  // #endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <div className="flex items-center justify-between mb-5">
          <h2 >Üyelik Başvuru Listesi</h2>
          <Button text="Excel İle İndir" design="button bg-green-400 text-white w-60" buttonMd onClick={() => setDownloadExcel(true)} />
        </div>
        <Table
          key={`${downloadExcel}`}
          ref={tableEl}
          emptyListText={"Başvuru Bulunamadı"}
          getDataFunction={getApplicationList}
          downloadExcel={downloadExcel}
          setDownloadExcel={setDownloadExcel}
          getExcelDataFunction={getApplicationList}
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
                Başvuru Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Üyelik Tipi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Başvuru Durumu
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
                <div className="tooltip-wrapper relative">
                  <div className="pointer-events-none">
                    <p className="p-sm line-clamp-1">
                      {e.Email}
                    </p>
                    {e.Email.length >= 27 &&
                      <div className="tooltip w-full  -bottom-6 left-0  justify-center shadow-md border-gray-300 z-10">
                        {e.Email}
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <DateView className="p-sm" dateNumber={e.CreatedDateJSTime} pattern="dd MMM yyyy HH:mm" />
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.UserType}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between">
                {e.Status === 1 ?
                  <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm">Kayıt Aşamasında</div>
                  :
                  e.Status === 2 ?
                    <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm">Onay Bekliyor</div>
                    :
                    e.Status === 5 ?
                      <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm">Hoşgeldiniz Aşamasında</div>
                      :
                      <></>
                }
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"/pro-profesyonel-detay/" + e.Id}`, state: { prevTitle: "Profesyonel Başvuru Listesi", queryPage: Number(readPageQueryString(window.location) ?? "1"), prevPath: window.location.pathname, tabId: 1 } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400  cursor-pointer transition-all border-l pl-1" />
                  </Link>
                </div>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
          isCustomFilter
          showFilterOpen={true}
          customFilter={
            <div className="grid lg:grid-cols-12 gap-x-3">
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center">
                  <Label withoutDots title="Şirket Tipine Göre Filtrele" />
                  {selectedCompanyType.key !== "0" &&
                    <TrashIcon onClick={() => setSelectedCompanyType({ key: "0", value: "Seçiniz..." })} className="icon-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-all duration-300" />
                  }
                </div>
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "companyType"}
                  onClick={() => { setCurrentOpenedFilterButton("companyType"); }}
                  className="w-full text-black-700 text-sm"
                  label={selectedCompanyType.value}
                  items={companyOptions}
                  onItemSelected={item => { setSelectedCompanyType(item); }} />
              </div>
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center">
                  <Label withoutDots title="Durumuna Göre Filtrele" />
                  {selectedStatus.key !== "0" &&
                    <TrashIcon onClick={() => setSelectedStatus({ key: "0", value: "Seçiniz..." })} className="icon-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-all duration-300" />
                  }
                </div>
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "status"}
                  onClick={() => { setCurrentOpenedFilterButton("status"); }}
                  className="w-full text-black-700 text-sm"
                  label={selectedStatus.value}
                  items={statusList}
                  onItemSelected={item => { setSelectedStatus(item); }} />
              </div>

              <div className="lg:col-span-4">
                <div className="flex justify-between items-center">
                  <Label withoutDots title="Başvuru Tarihine Göre Filtrele" />
                  {(selectedMinDate !== undefined || selectedMaxDate !== undefined) &&
                    <TrashIcon onClick={() => { setSelectedMinDate(undefined); setSelectedMaxDate(undefined) }} className="icon-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-all duration-300" />
                  }
                </div>
                <div className="flex items-center justift-between">
                  <DatePicker
                    isFull
                    maxDate={selectedMaxDate}
                    value={selectedMinDate}
                    setSelectedDate={(e) => { setSelectedMinDate(e); }}
                  />
                  <span className="mx-4 inline-block">-</span>
                  <DatePicker
                    isFull
                    minDate={selectedMinDate}
                    value={selectedMaxDate}
                    setSelectedDate={(e) => { setSelectedMaxDate(e) }}
                  />
                </div>
              </div>
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
              <div className="lg:col-span-12 mt-3">
                <div className="grid lg:grid-cols-12">
                  <div className="lg:col-span-6">
                    <div className="flex justify-between items-center">
                      <Label withoutDots title="Kategoriye Göre Filtrele" />
                      {categoryId !== 0 &&
                        <TrashIcon onClick={() => { setCategoryId(0); setCategoryClear(true) }} className="icon-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-all duration-300" />
                      }
                    </div>
                    <CategorySelectPro key="1" value={categoryId} clear={categoryClear} onChange={setCategoryId} setCategoryDisplayText={setDisplayText} />
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
