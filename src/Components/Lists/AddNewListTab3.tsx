import { FunctionComponent, useEffect, useRef, useState } from "react";
import { PlacementModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { Button } from "../Button";
import { CategorySelectPro } from "../CategorySelectPro";
import { CategorySelectSeller } from "../CategorySelectSeller";
import { Dropdown } from "../Dropdown";
import { TrashIcon } from "../Icons";
import { Label } from "../Label"
import { Loading } from "../Loading";
import { Table } from "../Table";
import { ToggleButton } from "../ToggleButton";
import { useStateEffect } from "../UseStateEffect";

export interface AddNewListTab3Props {
  setPlacementListToApi: (e: PlacementModel[]) => void,
  placementList: PlacementModel[],
}

export const AddNewListTab3: FunctionComponent<AddNewListTab3Props> = (props: AddNewListTab3Props) => {

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const listPlacementTypes = [
    { key: "1", value: "Statik Sayfa" },
    { key: "2", value: "Dinamik Sayfa" }
  ];

  const [selectedListPlacement, setSelectedListPlacement] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const listPlacementPagesForStatic = [
    { key: "102", value: "Anasayfa" },
    { key: "103", value: "Profesyonel Anasayfa" },
    { key: "104", value: "Fikir Anasayfa" }
  ];

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
  ];

  const [selectedListPlacementPage, setSelectedListPlacementPage] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const [sortOrder, setSortOrder] = useState<number>(0);

  const [isShownOnWeb, setIsShownOnWeb] = useState<boolean>(true);

  const [isShownOnMobileApp, setIsShownOnMobileApp] = useState<boolean>(true);

  const tableEl = useRef<any>();

  const [placementList, setPlacementList] = useState<PlacementModel[]>(props.placementList ?? []);

  const [warningText, setWarningText] = useState<boolean>(false);

  const [displayText, setDisplayText] = useState<string>("");

  const [displayTextTemp, setDisplayTextTemp] = useState<string>("");

  const [categoryId, setCategoryId] = useState<number>(0);

  const [categoryList, setCategoryList] = useState<{ key: string, value: string }[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [dropdownLoading, setDropdownLoading] = useState<boolean>(false);

  const getPlacementList = async (order: number, searchText: string, page: number, take: number) => {
    return {
      Data: placementList.slice((page - 1) * take, page * take),
      TotalCount: placementList.length
    }
  }

  const handleAddPlacement = () => {
    let _placement: PlacementModel = { PageLocation: Number(selectedListPlacementPage.key), CategoryId: categoryId, SortOrder: sortOrder ?? 0, IsShownOnWeb: isShownOnWeb, IsShownOnMobileApp: isShownOnMobileApp }
    if (
      selectedListPlacement.key === "0"
      || selectedListPlacementPage.key === "0"
      || sortOrder === 0
      || ((selectedListPlacement.key === "2" && selectedListPlacementPage.key !== "9") && categoryId === 0)
      || ((selectedListPlacement.key === "2" && selectedListPlacementPage.key === "9") && Number(selectedCategory.key) === 0)
    ) {
      setWarningText(true);
    }

    else {
      placementList.push(_placement)
      setPlacementList([...placementList])
      setWarningText(false);
      tableEl.current?.reload();
      setSelectedListPlacement({ key: "0", value: "Seçiniz" });
      setSelectedListPlacementPage({ key: "0", value: "Seçiniz" });
      setSortOrder(0);
      setWarningText(false);
      setIsShownOnWeb(true);
      setIsShownOnMobileApp(true);
      setCategoryId(0);
      setDisplayTextTemp(displayText)
      setDisplayText("");
    }
  }

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [placementList]);

  const categorySelect = () => {
    if (selectedListPlacementPage.key === "1" || selectedListPlacementPage.key === "2") {
      return <CategorySelectPro key="1" value={categoryId} onChange={setCategoryId} setCategoryDisplayText={setDisplayText} />
    }
    else if (selectedListPlacementPage.key === "3" || selectedListPlacementPage.key === "4" || selectedListPlacementPage.key === "8")
      return <CategorySelectSeller key="2" value={categoryId} onChange={setCategoryId} setCategoryDisplayText={setDisplayText} />
  }

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
        setCategoryList(_tempArray);
        setDropdownLoading(false);
      }
      else {
        setCategoryList([]);
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
        setCategoryList(_tempArray);
        setDropdownLoading(false);
      }
      else {
        setCategoryList([]);
        setDropdownLoading(false);
      }
    }
  }

  useStateEffect(() => {
    setCategoryId(Number(selectedCategory.key))
  }, [selectedCategory]);

  useStateEffect(() => {
    props.setPlacementListToApi(placementList);
  }, [placementList]);

  useEffect(() => {
    getSellerCategoryGroupList();
  }, []);

  const [sellerCategoryGroupList, setSellerCategoryGroupList] = useState<{ key: string, value: string }[]>([]);

  const [productGroupLoading, setProductGroupLoading] = useState<boolean>(false);

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

  return (
    <div>
      <div className="w-2/3">
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
        <div className="text-right mt-6 pb-6">
          <Button text="Ekle" design="button-blue-100 text-blue-400 w-60" onClick={() => handleAddPlacement()} />
        </div>
      </div>
      <hr />
      <Table
        ref={tableEl}
        emptyListText={"Yerleşim Alanı Bulunamadı"}
        getDataFunction={getPlacementList}
        header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-3">
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
        </div>}
        renderItem={(e, i) => {
          return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
            <div className="lg:col-span-3 flex lg:block items-center flex items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2"> Yerleşim Alanı:</span>
              <p className="text-black-700 text-sm">
                {e.PageLocation > 100 ?
                  "Statik Sayfa > " + listPlacementPagesForStatic.find(i => i.key === String(e.PageLocation))?.value
                  :

                  "Dinamik Sayfa > " + listPlacementPagesForDynamic.find(i => i.key === String(e.PageLocation))?.value + ` ${(displayTextTemp !== "" ? ` > ${displayTextTemp}` : ``)}`
                }
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center flex items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2"> Gösterim Sırası:</span>
              <p className="text-black-700 text-sm">
                {e.SortOrder}
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2"> Webte Göster:</span>
              <p className="text-black-700 text-sm">
                {e.IsShownOnWeb === true ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2"> Mobilde Göster:</span>
              <p className="text-black-700 text-sm">
                {e.IsShownOnMobileApp === true ? "Aktif" : "Pasif"}
              </p>
            </div>
            <div className="lg:col-span-1">
              <TrashIcon className="icon-sm mr-2" onClick={() => { setPlacementList(placementList.filter(i => i !== e)) }} />
            </div>
          </div>
        }}
        noSearchBar
        noSortOptions
        noRefreshButton
      />
    </div>
  )
}
