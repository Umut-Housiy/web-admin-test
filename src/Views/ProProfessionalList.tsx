import { FunctionComponent, useContext, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { CategorySelectPro } from "../Components/CategorySelectPro";
import { Dropdown } from "../Components/Dropdown";
import { ChevronRightIcon, EditIcon, SeoIcon, StarIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import { useStateEffect } from "../Components/UseStateEffect";
import ApiService from "../Services/ApiService";
import { readPageQueryString, saveAsExcel } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";


export const ProProfessionalList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const getProList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getProList(page, take, order, searchText, categoryId);

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

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Profesyonel Sil",
      message: `${item.StoreName} isimli profesyoneli silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deletePro(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Profesyonel başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }

        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }


  //#region Seo
  const [showSeoModal, setShowSeoModal] = useState<boolean>(false);

  const [seoId, setSeoId] = useState<number>(0);

  const [seoName, setSeoName] = useState<string>("");

  const [seoTitle, setSeoTitle] = useState<string>("");

  const [seoDescription, setSeoDescription] = useState<string>("");

  const handleOpenSeoModal = (item) => {
    setSeoId(item.Id ?? 0);
    setSeoName(item?.StoreName ?? "");
    setSeoTitle(item?.SeoTitle ?? "");
    setSeoDescription(item?.SeoDescription ?? "");
    setShowSeoModal(true);
  }

  const updateSingleProSeo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSingleProSeo(seoId, seoTitle, seoDescription);

    setProcessLoading(false);
    setShowSeoModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seo bilgileri güncellenmiştir",
        onClose: () => {
          context.hideModal();
          if (tableEl.current) {
            tableEl.current?.reload();
          }
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setShowSeoModal(true); }
      });
    }
  }
  //#endregion

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
    let _dataExcel: { companyName: string, phone: string, email: string, offerCount: string, favoriteCount: string, serviceCount: string, storeRate: string, status: string }[] = [];
    let header = ["Şirket Adı", "Telefon No", "Email", "Teklif Sayısı", "Favori Eklenme Sayısı", "Tamamlanan Hizmet Sayısı", "Profesyonel Puanı", "Durum"];
    if (downloadExcel === true && listExcelData.length > 0) {
      listExcelData.map((e) => (
        _dataExcel.push(
          {
            companyName: `${e.StoreName}`,
            phone: `${e.Phone}`,
            email: `${e.Email}`,
            offerCount: `${e.OfferCount}`,
            favoriteCount: `${e.FavoriteCount}`,
            serviceCount: `${e.ServiceCount}`,
            storeRate: `${e.StoreRate}`,
            status: `${e.IsEnabled ? "Aktif" : "Pasif"}`,
          },
        )
      ));
      saveAsExcel(_dataExcel, header, "Profesyonel Listesi");
    }

  }, [listExcelData, downloadExcel]);

  // #endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <div className="flex items-center justify-between mb-5">
          <h2 >Profesyonel Listesi</h2>
          <Button text="Excel İle İndir" design="button bg-green-400 text-white w-60" buttonMd onClick={() => setDownloadExcel(true)} />
        </div>
        <Table
          key={`${downloadExcel}`}
          ref={tableEl}
          emptyListText={"Profesyonel Bulunamadı"}
          getDataFunction={getProList}
          downloadExcel={downloadExcel}
          setDownloadExcel={setDownloadExcel}
          getExcelDataFunction={getProList}
          setListExcelData={setListExcelData}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Şirket Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Telefon No
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Email
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Teklif Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Favori Eklenme Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Tamamlanan Hizmet Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Profesyonel Puanı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durum
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
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.OfferCount}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.FavoriteCount}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.ServiceCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex">
                <StarIcon className="w-4 h-4 text-yellow-600" />
                <span className="ml-2 text-sm text-yellow-600 font-medium">
                  {e.StoreRate}
                </span>
              </div>
              <div className="lg:col-span-2 flex justify-between">
                {
                  e.IsEnabled ?
                    <span className="text-sm text-green-400 font-medium">
                      Aktif
                    </span>
                    :
                    <span className="text-sm text-red-400 font-medium">
                      Pasif
                    </span>
                }
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { history.push(`/pro-profesyonel-duzenle/${e.Id}`) }} />
                  <SeoIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleOpenSeoModal(e); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDeleteModal(e); }} />
                  <Link to={{ pathname: `${"/pro-profesyonel-detay/" + e.Id}`, state: { prevTitle: "Profesyonel Listesi", queryPage: Number(readPageQueryString(window.location) ?? "1"), prevPath: window.location.pathname, tabId: 1 } }} >
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
      <Modal
        modalType="fixedSm"
        showModal={showSeoModal}
        onClose={() => { setShowSeoModal(false); }}
        title="SEO Bilgileri"
        body={
          <div>
            <Label withoutDots title="Profesyonel Adı" className="mt-4" />
            <div className="text-sm text-gray-900">{seoName}</div>
            <Label isRequired withoutDots title="Title" className="mt-4" />
            <input className="form-input" type="text" value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); }} />
            <Label isRequired withoutDots title="Description" className="mt-4" />
            <input className="form-input" type="text" value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); }} />
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { updateSingleProSeo(); }}></Button>
        }
      />
    </div>
  )
}
