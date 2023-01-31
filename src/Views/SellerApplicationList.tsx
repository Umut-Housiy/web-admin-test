import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { ChevronRightIcon, TrashIcon } from "../Components/Icons";
import { Table } from "../Components/Table"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import ApiService from "../Services/ApiService";
import { readPageQueryString, saveAsExcel } from "../Services/Functions";
import { Label } from "../Components/Label";
import { Dropdown } from "../Components/Dropdown";
import { DatePicker } from "../Components/DatePicker";
import { useStateEffect } from "../Components/UseStateEffect";
import { Button } from "../Components/Button";
import { SellerType } from "../Models";
import { DateView } from "../Components/DateView";


export const SellerApplicationList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getSellerApplicationList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerApplicationList(page, take, searchText, Number(selectedSortOption.key), Number(selectedStatus.key), Number(selectedCompanyType.key), selectedMinDate?.getTime() ?? 0, selectedMaxDate?.getTime() ?? 0);

    if (_result.succeeded === true) {
      setCurrentOpenedFilterButton("")
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
    { key: "6", value: "Adi Ortaklık" },
  ];


  const [selectedStatus, setSelectedStatus] = useState({ key: "0", value: "Seçiniz..." });

  const statusList = [
    { key: "1", value: "Kayıt Aşamasında" },
    { key: "2", value: "Onay Bekliyor" },
  ];

  const [selectedMinDate, setSelectedMinDate] = useState<Date>();

  const [selectedMaxDate, setSelectedMaxDate] = useState<Date>();


  const sortOptions = [
    { key: "1", value: "Yeniden Eskiye" },
    { key: "2", value: "Eskiden Yeniye" },
  ];

  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);
  //#endregion

  // #region download excel

  const [downloadExcel, setDownloadExcel] = useState<boolean>(false);

  const [listExcelData, setListExcelData] = useState<any[]>([]);

  useStateEffect(() => {
    let _dataExcel: { companyName: string, tel: string, email: string, applicationDate: string, type: string, status: string }[] = [];
    let header = ["Mağaza Adı", "Telefon No.", "Email", "Başvuru Tarihi", "Firma Tipi", "Başvuru Durumu"];
    if (downloadExcel === true && listExcelData.length > 0) {
      listExcelData.map((e) => (
        _dataExcel.push(
          {
            companyName: `${e.StoreName}`,
            tel: `${e.Phone}`,
            email: `${e.Email}`,
            applicationDate: `${e.RecourseDate}`,
            type: `${SellerType[e.CompanyType]}`,
            status: `${e.Status === 1 ? "Kayıt Aşamasında" : e.Status === 2 ? "Onay Bekliyor" : ""}`,
          },
        )
      ));
      saveAsExcel(_dataExcel, header, "Satıcı Başvuruları");
    }

  }, [listExcelData, downloadExcel]);

  // #endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <div className="flex items-center justify-between mb-5">
          <h2 >Satıcı Başvuruları</h2>
          <Button text="Excel İle İndir" design="button bg-green-400 text-white w-60" buttonMd onClick={() => setDownloadExcel(true)} />
        </div>
        <Table
          ref={tableEl}
          key={`${downloadExcel}`}
          emptyListText={"Satıcı Bulunamadı"}
          getDataFunction={getSellerApplicationList}
          downloadExcel={downloadExcel}
          setDownloadExcel={setDownloadExcel}
          getExcelDataFunction={getSellerApplicationList}
          setListExcelData={setListExcelData}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Mağaza Adı
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
                Firma Tipi
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
                <p className="p-sm">
                  {e.Email}
                </p>
              </div>
              <div className="lg:col-span-2">
                <DateView className="p-sm" dateNumber={e.CreatedDateJSTime} pattern="dd MMM yyyy HH:mm" />
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {SellerType[e.CompanyType]}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between">
                {
                  e.Status === 1 ?
                    <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm">Kayıt Aşamasında</div>
                    :
                    e.Status === 2 ?
                      <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm">Onay Bekliyor</div>
                      :
                      <></>
                }
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `/satici-detay/${e.Id}`, state: { prevTitle: "Satıcı Başvuruları", prevPath: window.location.pathname, tabId: 1, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
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
            <div className="grid lg:grid-cols-10 gap-x-3">
              <div className="lg:col-span-2">
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
              <div className="lg:col-span-2">
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

              <div className="lg:col-span-3">
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
              <div className="lg:col-span-1"></div>
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
    </div >
  )
}
