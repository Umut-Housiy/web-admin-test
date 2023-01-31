import React, { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { FileUploader } from "../Components/FileUploader";
import { AlertIcon, ChevronRightIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { MultiSelect } from "../Components/MultiSelect";
import { SidebarLinks } from "../Components/SiderbarLinks";
import { ToggleButton } from "../Components/ToggleButton";
import { SellerCategoryElementList, SellerCategoryGroupsModel, SellerCategorySelectedElementList, SellerCategorySelectedVariationList, SellerCategoryVariationList, SellerTopCategoriesModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";


export const SellerCategoryAdd: FunctionComponent = () => {

  //<<--- Common States --->>

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const sidebarLinks = [
    {
      id: 1,
      title: "1. Kategori Bilgileri",
    },
    {
      id: 2,
      title: "2. Kategori Varyasyonları",
    },
    {
      id: 3,
      title: "3. Kategori Özellikleri",
    },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const categoryTypes = [
    { key: "1", value: "Üst Kategori" },
    { key: "2", value: "Alt Kategori" },
  ];

  const [selectedCategoryType, setSelectedCategoryType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  useEffect(() => {
    setCurrentOpenedFilterButton("");
  }, [selectedTabsId]);


  // <<--- TABS 1 --- Seller Adding Category Information --- START --->>

  const [topCategories, setTopCategories] = useState<SellerTopCategoriesModel[]>([])

  const [selectedTopCategory, setSelectedTopCategory] = useState<SellerTopCategoriesModel>({ key: "0", value: "Seçiniz...", groupId: 0 });

  const [categoryGroups, setCategoryGroups] = useState<SellerCategoryGroupsModel[]>([])

  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<SellerCategoryGroupsModel>({ key: "0", value: "Seçiniz..." });

  const [categoryName, setCategoryName] = useState<string>("");

  const [categoryOrder, setCategoryOrder] = useState<number>();

  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const [categoryCommission, setCategoryCommission] = useState<number>();

  const [categoryDescription, setCategoryDescription] = useState<string>("");

  const [categoryStatus, setCategoryStatus] = useState<boolean>(true);

  const handleFindCategoryGroup = (item) => {
    const _categoryGroup = categoryGroups.find(i => parseInt(i.key) === item.groupId) ?? { key: "0", value: "Seçiniz..." };
    setSelectedCategoryGroup(_categoryGroup);
  }
  // <<--- TABS 1 --- Seller Adding Category Information --- END --->>

  // <<--- TABS 2 --- Seller Adding Category Variations --- START --->>

  const [showVariationBox, setShowVariationBox] = useState<boolean>(false);


  const [variationList, setVariationList] = useState<SellerCategoryVariationList[]>([]);

  const [variationTempList, setVariationTempList] = useState<SellerCategoryVariationList[]>([])

  const [selectedVariationList, setSelectedVariationList] = useState<SellerCategorySelectedVariationList[]>([]);

  const handleAddVariation = (item) => {
    //push item to selected variation list
    let _tempItem = { ElementId: item.ElementId, IsRequired: false, IsImageRequired: false }

    if (selectedVariationList.filter(i => i.ElementId === _tempItem.ElementId).length > 0) {
      const _selectedVariationList = selectedVariationList.filter(i => i.ElementId !== _tempItem.ElementId);
      setSelectedVariationList([..._selectedVariationList]);
    }
    else {
      setSelectedVariationList([...selectedVariationList, _tempItem]);
    }
  }

  const handleRemoveVariationSelectedList = (item) => {
    //removing from selected variation list
    const _selectedVariationTempList = selectedVariationList.filter(i => i.ElementId !== item.ElementId);
    setSelectedVariationList([..._selectedVariationTempList]);
  }

  const handleChangeVariationRequired = (itemId) => {
    //change selected variation required
    const _selectedVariationTempList = selectedVariationList;
    const _selectedVariation = _selectedVariationTempList.filter(i => i.ElementId === itemId)[0];
    _selectedVariation.IsRequired = !_selectedVariation.IsRequired;
    setSelectedVariationList([..._selectedVariationTempList]);
  }
  const handleChangeVaraitionImageRequired = (itemId) => {
    //change selected image variation required
    const _selectedVariationTempList = selectedVariationList;
    const _selectedVariation = _selectedVariationTempList.filter(i => i.ElementId === itemId)[0];
    _selectedVariation.IsImageRequired = !_selectedVariation.IsImageRequired;
    setSelectedVariationList([..._selectedVariationTempList]);
  }
  // <<--- TABS 2 --- Seller Adding Category Variations --- END --->>

  // <<--- TABS 3 --- Seller Adding Category Feature --- START --->>

  const [showFeatureBox, setShowFeatureBox] = useState<boolean>(false);

  const [featureList, setFeatureList] = useState<SellerCategoryElementList[]>([])

  const [featureTempList, setFeatureTempList] = useState<SellerCategoryElementList[]>([])

  const [selectedFeatureList, setSelectedFeatureList] = useState<SellerCategorySelectedElementList[]>([]);

  const handleAddFeature = (item) => {
    //push item to selected feature list
    let _tempItem = { ElementId: item.ElementId, IsRequired: false }

    if (selectedFeatureList.filter(i => i.ElementId === _tempItem.ElementId).length > 0) {
      const _selectedVariationList = selectedFeatureList.filter(i => i.ElementId !== _tempItem.ElementId);
      setSelectedFeatureList([..._selectedVariationList]);
    }
    else {
      setSelectedFeatureList([...selectedFeatureList, _tempItem]);
    }

  }

  const handleRemoveFeatureSelectedList = (item) => {
    //removing from selected feature list
    const _selectedFeatureTempList = selectedFeatureList.filter(i => i.ElementId !== item.ElementId);
    setSelectedFeatureList([..._selectedFeatureTempList]);

  }

  const handleChangeFeatureRequired = (itemId) => {
    //change selected feature required
    const _selectedFeatureTempList = selectedFeatureList;
    const _selectedFeature = _selectedFeatureTempList.filter(i => i.ElementId === itemId)[0];
    _selectedFeature.IsRequired = !_selectedFeature.IsRequired;
    setSelectedFeatureList([..._selectedFeatureTempList]);
  }

  // <<--- TABS 3 --- Seller Adding Category Feature --- END --->>
  useEffect(() => {
    getSellerCategoryVariationList();
    getSellerCategoryFeatureList();
    getSellerParentCategories();
    getSellerCategoryGroups();
  }, [])

  const createSellerCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createSellerCategory(categoryName, categoryOrder ?? 0, categoryDescription, categoryStatus, selectedFile, Number(selectedTopCategory.key), selectedCategoryType.key === "1" ? true : false, Number(selectedCategoryGroup.key), categoryCommission ?? 0, selectedFeatureList, selectedVariationList,);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yeni satıcı kategorisi başarıyla oluşturuldu",
        onClose: () => { context.hideModal(); history.push('/satici-kategori-listesi') }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }


  const getSellerParentCategories = async () => {
    setLoading(true);

    const _result = await ApiService.getSellerCategoryList(1, 9999, "", 1);

    setLoading(false);

    if (_result.succeeded === true) {
      let _curryArray: SellerTopCategoriesModel[] = []
      _result.data.Data.map((item) => (
        _curryArray.push({
          key: String(item.Id),
          value: item.CategoryName,
          groupId: item.GroupId
        })
      ));
      setTopCategories([..._curryArray])

    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const getSellerCategoryGroups = async () => {
    setLoading(true);

    const _result = await ApiService.getSellerCategoryGroupList(1, 9999, "", 1);

    setLoading(false);

    if (_result.succeeded === true) {
      let _curryArray: SellerCategoryGroupsModel[] = []
      _result.data.Data.map((item) => (
        _curryArray.push({
          key: String(item.Id),
          value: item.GroupName,
        })
      ));
      setCategoryGroups([..._curryArray])

    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }


  const getSellerCategoryVariationList = async () => {
    setLoading(true);

    const _result = await ApiService.getSellerCategoryVariationList(1, 9999, "", 1);

    setLoading(false);

    if (_result.succeeded === true) {
      let _curryArray: SellerCategoryVariationList[] = []
      _result.data.Data.map((item) => (
        _curryArray.push({
          ElementId: item.Id,
          Name: item.NameWithAlias
        })
      ));
      setVariationList([..._curryArray])
      setVariationTempList([..._curryArray])

    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }

  }

  const getSellerCategoryFeatureList = async () => {
    setLoading(true);

    const _result = await ApiService.getSellerCategoryElementList(1, 9999, "", 1);

    setLoading(false);

    if (_result.succeeded === true) {
      let _curryArray: SellerCategoryElementList[] = []
      _result.data.Data.map((item) => (
        _curryArray.push({
          ElementId: item.Id,
          Name: item.NameWithAlias
        })
      ));
      setFeatureList([..._curryArray])
      setFeatureTempList([..._curryArray])
    }
    else {
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
        <h2 className="pb-4 border-b border-gray-200">Yeni Kategori Oluştur</h2>
        <div className="grid lg:grid-cols-4">
          <div className="lg:col-span-1 px-3 py-4">
            <SidebarLinks list={sidebarLinks} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
          </div>
          <div className="lg:col-span-2 pl-6 border-l border-gray-200 py-4">
            {selectedTabsId === 1 ?
              <>
                <Label isRequired withoutDots title="Kategori Tipi" className="mt-4" />
                {loading ?
                  <Loading inputSm />
                  :
                  <Dropdown
                    isDropDownOpen={currentOpenedFilterButton === "categoryType"}
                    onClick={() => { setCurrentOpenedFilterButton("categoryType"); }}
                    className="w-full text-black-700"
                    classNameDropdown={"max-h-52 overflow-y-auto custom-scrollbar"}
                    label={selectedCategoryType.value}
                    items={categoryTypes}
                    isSearchable
                    onItemSelected={item => {
                      setSelectedCategoryType(item);
                      setSelectedTopCategory({ key: "0", value: "Seçiniz...", groupId: 0 });
                      setSelectedCategoryGroup({ key: "0", value: "Seçiniz..." });
                    }} />
                }
                {selectedCategoryType.key === "2" &&
                  <>
                    <Label isRequired withoutDots title="Üst Kategori" className="mt-4" />
                    <div className="flex items-center mb-3">
                      <AlertIcon className="icon-sm text-red-400 mr-2" />
                      <p className="text-sm">Kategorinin bağlı olacağı bir üst kategoriyi belirleyiniz.</p>
                    </div>
                    {loading ?
                      <Loading inputSm />
                      :
                      <Dropdown
                        isDropDownOpen={currentOpenedFilterButton === "topCategory"}
                        onClick={() => { setCurrentOpenedFilterButton("topCategory"); }}
                        className="w-full text-black-700"
                        classNameDropdown={"max-h-52 overflow-y-auto custom-scrollbar"}
                        label={selectedTopCategory.value}
                        items={topCategories}
                        isSearchable
                        onItemSelected={item => { setSelectedTopCategory(item); handleFindCategoryGroup(item); }} />
                    }
                  </>
                }
                <Label isRequired withoutDots title="Kategori Grubu" className="mt-4" />
                {selectedCategoryType.key === "1" &&
                  <div className="flex items-center mb-3">
                    <AlertIcon className="icon-sm text-red-400 mr-2" />
                    <p className="text-sm">Kategorinin bağlı olacağı kategori grubunu belirleyiniz.</p>
                  </div>
                }
                {loading ?
                  <Loading inputSm />
                  :
                  <Dropdown
                    isDisabled={selectedCategoryType.key === "2" ? true : false}
                    isDropDownOpen={currentOpenedFilterButton === "categoryGroup"}
                    onClick={() => { setCurrentOpenedFilterButton("categoryGroup"); }}
                    className="w-full text-black-700"
                    classNameDropdown={"max-h-52 overflow-y-auto custom-scrollbar"}
                    label={selectedCategoryGroup.value}
                    items={categoryGroups}
                    isSearchable
                    onItemSelected={item => { setSelectedCategoryGroup(item) }} />
                }
                <Label isRequired withoutDots title="Kategori Adı" className="mt-4" />
                <input className="form-input" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} required />
                <Label isRequired withoutDots title="Kategori Sıralaması" className="mt-4" />
                <input className="form-input" value={categoryOrder} type="number" onChange={(e) => { setCategoryOrder(Number(e.target.value)) }} required />
                <Label isRequired withoutDots title="Kategori Görseli" className="mt-4" />
                <FileUploader onFileSelected={item => { setSelectedFile(item) }} sizeDescription={"242x194 px"} />
                <Label isRequired withoutDots title="Kategori Komisyonu (%)" className="mt-4" />
                <input className="form-input" value={categoryCommission} type="number" onChange={(e) => { setCategoryCommission(parseInt(e.target.value)) }} required />
                <Label withoutDots title="Kategori Açıklaması" className="mt-4" />
                <textarea
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  className="text-sm w-full px-3 py-2 text-black-700 border rounded-lg focus:outline-none resize-none leading-5 mb-1"
                  value={categoryDescription}
                  rows={3}
                  required
                />
                <div className="flex items-center justify-between mb-4">
                  <span className="p-sm font-medium text-gray-700">Kategoriyi aktif olarak göster</span>
                  <ToggleButton onClick={() => { setCategoryStatus(!categoryStatus) }} defaultValue={categoryStatus} />
                </div>
              </>
              : selectedTabsId === 2 ?
                <>
                  <div className="lg:col-span-2 py-4">
                    <p className="text-sm mb-4">Seçili ürün kategorisine tanımlanacak ürün varyasyonlarını seçiniz.</p>
                    <p className="p-sm-gray-700 mb-2">Varyasyon Seçimi</p>
                    {loading ?
                      <Loading inputSm />
                      :
                      <MultiSelect
                        placeholder="Varyasyon"
                        showBox={showVariationBox}
                        selectedList={selectedVariationList}
                        constVariationList={variationList}
                        variationList={variationTempList}
                        handleAdd={handleAddVariation}
                        handleRemove={handleRemoveVariationSelectedList}
                        isSearchable
                      />
                    }

                    {selectedVariationList.length > 0 &&
                      <div>
                        <div className="flex my-4 border-t-2 border-gray-200 pt-4  p-sm-gray-700 items-center">
                          <p className="w-3/6 p-sm-gray-700">Varyasyon Adı</p>
                          <p className="w-1/6 p-sm-gray-700">Zorunlu Bilgi</p>
                          <p className="w-1/6 p-sm-gray-700">Ürün Resmi Gösterilsin</p>
                          <p className="w-1/6 p-sm-gray-700">İşlem</p>
                        </div>
                        {selectedVariationList.map((item, index) => (
                          <div className="flex items-center" key={index}>
                            <p className="w-3/6 py-2.5 mb-2 p-sm">{variationList.find(i => i.ElementId === item.ElementId)?.Name}</p>
                            <div className="w-1/6">
                              <ToggleButton onClick={() => { handleChangeVariationRequired(item.ElementId) }} defaultValue={item.IsRequired ?? false} />
                            </div>
                            <div className="w-1/6">
                              <ToggleButton onClick={() => { handleChangeVaraitionImageRequired(item.ElementId) }} defaultValue={item.IsImageRequired ?? false} />
                            </div>
                            <p className="w-1/6">
                              <TrashIcon className="icon-sm cursor-pointer" onClick={() => { handleRemoveVariationSelectedList(item) }} />
                            </p>
                          </div>
                        ))}
                      </div>
                    }
                  </div>
                </>
                : selectedTabsId === 3 &&
                <div className="py-4">
                  <p className="text-sm mb-4">Seçili ürün kategorisine tanımlanacak ürün özelliklerini seçiniz.</p>
                  <p className="p-sm-gray-700 mb-2">Özellik Seçimi</p>
                  {loading ?
                    <Loading inputSm />
                    :
                    <MultiSelect
                      placeholder="Özellik"
                      showBox={showFeatureBox}
                      selectedList={selectedFeatureList}
                      constVariationList={featureList}
                      variationList={featureTempList}
                      handleAdd={handleAddFeature}
                      handleRemove={handleRemoveFeatureSelectedList}
                      isSearchable
                    />
                  }

                  {selectedFeatureList.length > 0 &&
                    <div>
                      <div className="flex my-4 border-t-2 border-gray-200 pt-4   items-center">
                        <p className="w-4/6 p-sm-gray-700">Özellik Adı</p>
                        <p className="w-1/6 p-sm-gray-700">Zorunlu Bilgi</p>
                        <p className="w-1/6 p-sm-gray-700">İşlem</p>
                      </div>

                      {selectedFeatureList.map((item, index) => (
                        <div className="flex  items-center" key={index}>
                          <p className="w-4/6 py-2.5 mb-2 p-sm">{featureList.find(i => i.ElementId === item.ElementId)?.Name}</p>
                          <div className="w-1/6">
                            <ToggleButton onClick={() => { handleChangeFeatureRequired(item.ElementId) }} defaultValue={item.IsRequired ?? false} />
                          </div>
                          <p className="w-1/6">
                            <TrashIcon className="icon-sm cursor-pointer" onClick={() => { handleRemoveFeatureSelectedList(item) }} />
                          </p>
                        </div>
                      ))}
                    </div>
                  }
                </div>
            }
          </div>
          <div className="lg:col-span-4 ml-auto">
            <div className="flex items-center w-full">
              {(selectedTabsId === 2 || selectedTabsId === 3) &&
                <div className="p-sm-gray-700 flex justify-end mr-6 cursor-pointer" onClick={() => { selectedTabsId === 2 ? setSelectedTabsId(1) : setSelectedTabsId(2) }}>
                  <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
                  Önceki Adım
                </div>
              }
              {(selectedTabsId === 1 || selectedTabsId === 2) ?
                <Button text="Kaydet ve sonraki" design="button-blue-400" className="w-80" onClick={() => { selectedTabsId === 1 ? setSelectedTabsId(2) : selectedTabsId === 2 && setSelectedTabsId(3) }} />
                :
                <Button isLoading={processLoading} text="Kaydet ve tamamla" design="button-blue-400" className="w-80" onClick={() => { createSellerCategory(); }} />
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
