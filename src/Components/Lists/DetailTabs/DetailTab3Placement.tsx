import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import ApiService from "../../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { CategorySelectPro } from "../../CategorySelectPro";
import { CategorySelectSeller } from "../../CategorySelectSeller";
import { Dropdown } from "../../Dropdown";
import { PlusIcon, TrashIcon } from "../../Icons";
import { Label } from "../../Label";
import { Loading } from "../../Loading";
import { Modal } from "../../Modal";
import { Table } from "../../Table";
import { ToggleButton } from "../../ToggleButton";
import { useStateEffect } from "../../UseStateEffect";

export interface DetailTabForIdeaCategoryProps {
  DynamicListId: number
}

export const DetailTab3Placement: FunctionComponent<DetailTabForIdeaCategoryProps> = (props: DetailTabForIdeaCategoryProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [showAddPlacementModal, setShowAddPlacementModal] = useState<boolean>(false);

  const listPlacementTypes = [
    { key: "1", value: "Statik Sayfa" },
    { key: "2", value: "Dinamik Sayfa" }
  ]

  const [selectedListPlacement, setSelectedListPlacement] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const [warningText, setWarningText] = useState<boolean>(false);

  const listPlacementPagesForStatic = [
    { key: "101", value: "Anasayfa" },
    { key: "102", value: "E-ticaret Anasayfa" },
    { key: "103", value: "Profesyonel Anasayfa" },
    { key: "104", value: "Fikir Anasayfa" }
  ]

  const listPlacementPagesForDynamic = [
    { key: "1", value: "Profesyonel Kategori" },
    { key: "2", value: "Profesyonel Detay" },
    { key: "3", value: "Ürün Kategori" },
    { key: "4", value: "Ürün Detay 1" },
    { key: "8", value: "Ürün Detay 2" },
    { key: "5", value: "Fikir Kategori" },
    { key: "6", value: "Fikir Detay" },
    { key: "7", value: "Blog Detay" },
    { key: "9", value: "Ürün Grubu" }
  ]

  const [selectedListPlacementPage, setSelectedListPlacementPage] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const [sortOrder, setSortOrder] = useState<number>(0);

  const [isShownOnWeb, setIsShownOnWeb] = useState<boolean>(true);

  const [isShownOnMobileApp, setIsShownOnMobileApp] = useState<boolean>(true);

  const [categoryId, setCategoryId] = useState<number>(0);

  const [displayText, setDisplayText] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [dropdownLoading, setDropdownLoading] = useState<boolean>(false);

  const [categoryList, setCategoryList] = useState<{ key: string, value: string }[]>([]);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [sellerCategoryGroupList, setSellerCategoryGroupList] = useState<{ key: string, value: string }[]>([]);

  const [productGroupLoading, setProductGroupLoading] = useState<boolean>(false);

  const getPlacementList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getPlacementList(props.DynamicListId, page, take, searchText, order);

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

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Yerleşim Alanını Sil",
      message: `${item.Location}'dan listeyi silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deletePlacementList(item.PlacementId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Yerleşim alanı başarıyla silindi",
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

  useEffect(() => {
    getSellerCategoryGroupList();
  }, []);

  useStateEffect(() => {
    categorySelect();
    setCategoryId(0);
  }, [selectedListPlacementPage]);

  useStateEffect(() => {
    if (selectedListPlacementPage.key === "5" || selectedListPlacementPage.key === "6" || selectedListPlacementPage.key === "7") {
      getCategories();
      setSelectedCategory({ key: "0", value: "Seçiniz..." })
    }

  }, [selectedListPlacementPage]);

  const getSellerCategoryGroupList = async () => {

    const _result = await ApiService.getSellerCategoryGroupList(1, 9999, "", 1);

    setProductGroupLoading(true);

    if (_result.succeeded === true) {
      let tempSellerCategoryGroupList: { key: string, value: string }[] = [];
      _result.data.Data.filter(i => i.IsActive === true).map((item) => (
        tempSellerCategoryGroupList.push({
          key: String(item.Id),
          value: item.GroupName
        })
      ))
      setSellerCategoryGroupList(tempSellerCategoryGroupList);
      setProductGroupLoading(false);
    }
    else {
      setSellerCategoryGroupList([]);
      setProductGroupLoading(false);
    }
  }

  const categorySelect = () => {
    if (selectedListPlacementPage.key === "1" || selectedListPlacementPage.key === "2") {
      return <CategorySelectPro key="1" value={categoryId} onChange={setCategoryId} setCategoryDisplayText={setDisplayText} />
    }
    else if (selectedListPlacementPage.key === "3" || selectedListPlacementPage.key === "4" || selectedListPlacementPage.key === "8")
      return <CategorySelectSeller key="2" value={categoryId} onChange={setCategoryId} setCategoryDisplayText={setDisplayText} />
  }

  const getCategories = async () => {
    setDropdownLoading(true);
    if (selectedListPlacementPage.key === "5" || selectedListPlacementPage.key === "6") {
      const _result = await ApiService.getIdeaCategoryList(1, 999999, "", 1, 1);

      if (_result.succeeded === true) {

        let _tempArray: { key: string, value: string }[] = []
        _result.data.Data.map((item) => (
          _tempArray.push({
            key: String(item.Id),
            value: item.Name
          })
        ))
        setCategoryList(_tempArray)
        setDropdownLoading(false);
      }
      else {
        setCategoryList([])
        setDropdownLoading(false);
      }
    }
    else {
      const _result = await ApiService.getBlogCategoryList(1, 999999, "", 1);
      if (_result.succeeded === true) {

        let _tempArray: { key: string, value: string }[] = []
        _result.data.Data.map((item) => (
          _tempArray.push({
            key: String(item.Id),
            value: item.Name
          })
        ))
        setCategoryList(_tempArray)
        setDropdownLoading(false);
      }
      else {
        setCategoryList([])
        setDropdownLoading(false);
      }
    }
  }

  const handleAddPlacement = () => {
    if (selectedListPlacement.key === "0" || selectedListPlacementPage.key === "0" || sortOrder === 0 || (selectedListPlacement.key === "2" && categoryId === 0)) {
      setWarningText(true);
    }
    else {
      addDynamicListPlacement()
    }
  }

  const addDynamicListPlacement = async () => {
    setProcessLoading(true);

    const _result = await ApiService.addDynamicListPlacement(props.DynamicListId, Number(selectedListPlacementPage.key), categoryId, sortOrder, isShownOnWeb, isShownOnMobileApp);

    setShowAddPlacementModal(false);

    if (_result.succeeded == true) {
      context.showModal({
        type: "Success",
        title: "Yerleşim alanı başarıyla eklendi",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();
          clearInput();
          setCategoryId(0);
          setDisplayText("");
          setProcessLoading(false);

        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setProcessLoading(false); clearInput();
        }
      });
    }
  }

  useStateEffect(() => {
    setCategoryId(Number(selectedCategory.key))
  }, [selectedCategory]);

  const clearInput = () => {
    setSelectedListPlacement({ key: "0", value: "Seçiniz" });
    setSelectedListPlacementPage({ key: "0", value: "Seçiniz" });
    setSelectedCategory({ key: "0", value: "Seçiniz" });
    setSortOrder(0);
    setWarningText(false);
    setIsShownOnWeb(true);
    setIsShownOnMobileApp(true);
  }

  return (
    <div>
      <Table
        ref={tableEl}
        emptyListText={"Liste Bulunamadı"}
        getDataFunction={getPlacementList}
        addNewButton={
          <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setShowAddPlacementModal(true); setCurrentOpenedFilterButton(""); clearInput(); }} />}
        header={<div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-6 flex items-center">
            <span className="p-sm-gray-400">
              Yerleşim Alanı
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Gösterim Sırası
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Webte Göster
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Mobilde Göster
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Durum
            </span>
          </div>
        </div>}
        renderItem={(e, i) => {
          return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
            <div className="lg:col-span-6 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Yerleşim Alanı:</span>
              <p className="p-sm">
                {e.Location}
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Gösterim Sırası:</span>
              <p className="p-sm">
                {e.SortOrder}
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Webte Göster:</span>
              <p className="p-sm">
                {e.ShowOnWeb === true ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Mobilde Göster:</span>
              <p className="p-sm">
                {e.ShowOnMobile === true ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
              <p className={`${e.Statue === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                {e.Statue === true ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="lg:col-span-1 flex justify-between items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler: </span>
              <div className="text-gray-700 flex gap-2 items-center">
                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => showDeleteModal(e)} />
              </div>
            </div>
          </div>
        }}
      />

      <Modal
        modalType="fixedMd"
        showModal={showAddPlacementModal}
        onClose={() => { setShowAddPlacementModal(false); clearInput(); }}
        title="Yeni Yerleşim Alanı Ekle"
        body=
        {
          <div className="">
            <Label title="Liste Yerleşim Alanı" isRequired withoutDots />
            <Dropdown
              key={"selectedListPlacement"}
              isDropDownOpen={currentOpenedFilterButton === "selectedListPlacement"}
              onClick={() => { setCurrentOpenedFilterButton("selectedListPlacement"); }}
              className="w-full text-black-700 text-sm"
              label={selectedListPlacement.value}
              items={listPlacementTypes}
              onItemSelected={item => { setSelectedListPlacement(item); setWarningText(false) }} />
            <Label className="mt-4" title="Yerleşim Sayfası" isRequired withoutDots />
            <Dropdown
              isDisabled={selectedListPlacement.key === "0" ? true : false}
              key={"placementPages"}
              isDropDownOpen={currentOpenedFilterButton === "placementPages"}
              onClick={() => { setCurrentOpenedFilterButton("placementPages"); }}
              className="w-full text-black-700 text-sm"
              label={selectedListPlacementPage.value}
              items={selectedListPlacement.key === "1" ? listPlacementPagesForStatic : listPlacementPagesForDynamic}
              onItemSelected={item => { setSelectedListPlacementPage(item); setWarningText(false) }} />
            {(selectedListPlacement.key === "2" && selectedListPlacementPage.key !== "0") &&
              <>
                {selectedListPlacementPage.key !== "9" ?
                  <>
                    <Label className="mt-4" title="Kategori Seçimi" isRequired withoutDots />
                    {(selectedListPlacementPage.key === "5" || selectedListPlacementPage.key === "6" || selectedListPlacementPage.key === "7") ?
                      dropdownLoading ? <Loading inputSm /> :
                        <Dropdown
                          key={"category"}
                          isDropDownOpen={currentOpenedFilterButton === "category"}
                          onClick={() => { setCurrentOpenedFilterButton("category"); }}
                          className="w-full text-black-700 text-sm"
                          label={selectedCategory.value}
                          items={categoryList}
                          onItemSelected={item => { setSelectedCategory(item); setWarningText(false); }} />
                      :
                      categorySelect()
                    }
                  </>
                  :
                  <>
                    <Label className="mt-4" title="Ürün Grubu" isRequired withoutDots />
                    {productGroupLoading ? <Loading inputSm /> :
                      <Dropdown
                        key={"group"}
                        isDropDownOpen={currentOpenedFilterButton === "group"}
                        onClick={() => { setCurrentOpenedFilterButton("group"); }}
                        className="w-full text-black-700 text-sm"
                        label={selectedCategory.value}
                        items={sellerCategoryGroupList}
                        onItemSelected={item => { setSelectedCategory(item); setWarningText(false); }} />
                    }
                  </>
                }
              </>
            }
            <Label className="mt-4" title="Seçili Alan İçinde Gösterim Sırası" isRequired withoutDots />
            <input className="form-input" placeholder="-" type="number" value={sortOrder} onChange={(e) => { setSortOrder(parseInt(e.target.value)); setWarningText(false) }} />
            <div className="flex text-sm mt-4 font-medium justify-between">
              Websitesinde göster
              <ToggleButton onClick={() => { setIsShownOnWeb(!isShownOnWeb) }} defaultValue={isShownOnWeb} />
            </div>
            <div className="flex text-sm mt-4 font-medium justify-between">
              Mobil uygulamada göster
              <ToggleButton onClick={() => { setIsShownOnMobileApp(!isShownOnMobileApp) }} defaultValue={isShownOnMobileApp} />
            </div>
            {warningText === true &&
              <span className="text-sm block  bg-red-100 p-2 rounded my-4 font-medium text-red-400">
                *Lütfen zorunlu alanları doldurunuz
              </span>
            }
          </div>
        }
        footer={
          <Button isLoading={processLoading} text="Kaydet" design="button-blue-400 text-white w-full mt-4" onClick={() => handleAddPlacement()} />
        }
      />
    </div>
  )
}
