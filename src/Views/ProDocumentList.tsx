import React, { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { CategorySelectPro } from "../Components/CategorySelectPro";
import { DateView } from "../Components/DateView";
import { Dropdown } from "../Components/Dropdown";
import { ChevronRightIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { readPageQueryString } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";



export const ProDocumentList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const getDocumentList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getProDocumentList(page, take, order, searchText, categoryId);

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

  const sortOptions = [
    { key: "1", value: "Yeniden Eskiye" },
    { key: "2", value: "Eskiden Yeniye" },
  ];

  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);

  const [categoryId, setCategoryId] = useState<number>(0);

  const [displayText, setDisplayText] = useState<string>("");

  const [categoryClear, setCategoryClear] = useState<boolean>(false);

  //#endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Profesyonel Belgeleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Profesyonel Bulunamadı"}
          getDataFunction={getDocumentList}
          header={<div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Şirket Adı
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
            return <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
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
                <div className="ml-auto text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"/pro-profesyonel-detay/" + e.Id}`, state: { prevTitle: "Profesyonel Listesi", prevPath: window.location.pathname, tabId: 5, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                  </Link>
                </div>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
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
    </div>
  )
}
