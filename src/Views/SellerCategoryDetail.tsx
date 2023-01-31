import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { FileUploader } from "../Components/FileUploader";
import { AlertIcon, ChevronRightIcon, EditIcon, EyeIcon, EyeOffIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { MultiSelect } from "../Components/MultiSelect";
import { SidebarLinks } from "../Components/SiderbarLinks";
import { ToggleButton } from "../Components/ToggleButton";
import { useStateEffect } from "../Components/UseStateEffect";
import { SellerCategoryDetailModel, SellerCategoryElementList, SellerCategoryGroupsModel, SellerCategorySelectedElementList, SellerCategorySelectedVariationList, SellerCategoryVariationList, SellerTopCategoriesModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

interface RouteParams {
  id: string
}

interface LocationModel {
  isEditActive: boolean
  queryPage: number,
}

export const SellerCategoryDetail: FunctionComponent = () => {
  // <<--- Common States -->>

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [Id, setId] = useState<number>(Number(params.id));

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

  useEffect(() => {
    setCurrentOpenedFilterButton("");
  }, [selectedTabsId]);

  const categoryTypes = [
    { key: "1", value: "Üst Kategori" },
    { key: "2", value: "Alt Kategori" },
  ];

  // <<--- TABS 1 --- Seller Category Informations Detail --- START --->>

  const [categoryDetail, setCategoryDetail] = useState<SellerCategoryDetailModel>({
    Id: Number(params.id ?? 0),
    Name: "",
    CategoryGroup: "",
    Order: 0,
    PhotoPath: "",
    CommissionPercentage: 0,
    Description: "",
    IsEnabled: false,
    ParentCategory: 0,
    Elements: [{ ElementId: 0, IsRequired: false }],
    Variations: [{ ElementId: 0, IsRequired: false, IsImageRequired: false }],
    GroupId: 0,
  });

  const [selectedCategoryType, setSelectedCategoryType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [topCategories, setTopCategories] = useState<SellerTopCategoriesModel[]>([]);

  const [selectedTopCategory, setSelectedTopCategory] = useState<SellerTopCategoriesModel>(topCategories.find(i => i.key === String(categoryDetail.ParentCategory)) ?? { key: "0", value: "Seçiniz", groupId: 0 });

  const [categoryGroups, setCategoryGroups] = useState<SellerCategoryGroupsModel[]>([]);

  const [editableInfo, setEditableInfo] = useState<boolean>(location.state?.isEditActive ?? false);

  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<SellerCategoryGroupsModel>(categoryGroups.find(i => i.value === categoryDetail.CategoryGroup) ?? { key: "0", value: "Seçiniz" });

  const [name, setName] = useState<string>(categoryDetail.Name);

  const [order, setOrder] = useState<number>(categoryDetail.Order);

  const [selectedFile, setSelectedFile] = useState<File | undefined>()

  const [photoPath, setPhotoPath] = useState<string>(selectedFile !== undefined ? URL.createObjectURL(selectedFile) : "");

  const [commissionPercentage, setCommissionPercentage] = useState<number>(categoryDetail.CommissionPercentage);

  const [description, setDescription] = useState<string>(categoryDetail.Description);

  const [isEnabled, setIsEnabled] = useState<boolean>(categoryDetail.IsEnabled);

  const handleFindCategoryGroup = (item) => {
    const _categoryGroup = categoryGroups.find(i => parseInt(i.key) === item.groupId) ?? { key: "0", value: "Seçiniz..." };
    setSelectedCategoryGroup(_categoryGroup);
  }

  const handleClearInfoInput = () => {
    setSelectedCategoryType(categoryDetail.ParentCategory > 0 ? categoryTypes[1] : categoryTypes[0]);
    setSelectedTopCategory(topCategories.find(i => i.key === String(categoryDetail.ParentCategory)) ?? { key: "0", value: "Seçiniz", groupId: 0 });
    setSelectedCategoryGroup(categoryGroups.find(i => i.key === String(categoryDetail.GroupId)) ?? { key: "0", value: "Seçiniz" });
    setName(categoryDetail.Name);
    setOrder(categoryDetail.Order);
    setPhotoPath(categoryDetail.PhotoPath);
    setCommissionPercentage(categoryDetail.CommissionPercentage);
    setDescription(categoryDetail.Description);
    setIsEnabled(categoryDetail.IsEnabled);
    setEditableInfo(false);
    setSelectedFile(undefined);

  }
  // <<--- TABS 1 --- Seller Category Informations Detail --- END --->>

  // <<--- TABS 2 --- Seller  Category Variations Detail --- START --->>

  const [showVariationBox, setShowVariationBox] = useState<boolean>(false);

  const [variationList, setVariationList] = useState<SellerCategoryVariationList[]>([])

  const [selectedVariationList, setSelectedVariationList] = useState<SellerCategorySelectedVariationList[]>(categoryDetail.Variations);

  const [selectedTempVariationList, setSelectedTempVariationList] = useState<SellerCategorySelectedVariationList[]>(selectedVariationList);

  const [editableVariation, setEditableVariation] = useState<boolean>(false);

  const handleAddVariation = (item) => {
    //push item to selected variation list
    let _tempItem = { ElementId: item.ElementId, IsRequired: false, IsImageRequired: false }

    if (selectedTempVariationList.filter(i => i.ElementId === _tempItem.ElementId).length > 0) {
      const _selectedTempVariationList = selectedTempVariationList.filter(i => i.ElementId !== _tempItem.ElementId);
      setSelectedTempVariationList([..._selectedTempVariationList]);
    }
    else {
      setSelectedTempVariationList([...selectedTempVariationList, _tempItem]);
    }
  }

  const handleRemoveVariationSelectedList = (item) => {
    //removing from selected variation list
    const _selectedVariationList = selectedTempVariationList.filter(i => i.ElementId !== item.ElementId);
    setSelectedTempVariationList([..._selectedVariationList]);
  }

  const handleChangeVariationRequired = (itemId) => {
    const _selectedVariationList = selectedTempVariationList;
    const _selectedVariation = _selectedVariationList.filter(i => i.ElementId === itemId)[0];
    _selectedVariation.IsRequired = !_selectedVariation.IsRequired;
    setSelectedTempVariationList([..._selectedVariationList]);
  }
  const handleChangeVariationImageRequired = (itemId) => {
    const _selectedVariationList = selectedTempVariationList;
    const _selectedVariation = _selectedVariationList.filter(i => i.ElementId === itemId)[0];
    _selectedVariation.IsImageRequired = !_selectedVariation.IsImageRequired;
    setSelectedTempVariationList([..._selectedVariationList]);
  }

  const handleClearVariationInput = () => {
    setSelectedTempVariationList(JSON.parse(JSON.stringify(categoryDetail.Variations)));
    setSelectedVariationList(JSON.parse(JSON.stringify(categoryDetail.Variations)));
    setEditableVariation(false);
  }

  // <<--- TABS 2 --- Seller  Category Variations Detail --- END --->>

  // <<--- TABS 3 --- Seller  Feature Variations Detail --- START --->>

  const [showFeatureBox, setShowFeatureBox] = useState<boolean>(false);

  const [featureList, setFeatureList] = useState<SellerCategoryElementList[]>([]);

  const [selectedFeatureList, setSelectedFeatureList] = useState<SellerCategorySelectedElementList[]>(categoryDetail.Elements);

  const [editableFeature, setEditableFeature] = useState<boolean>(false);

  const [selectedTempFeatureList, setSelectedTempFeatureList] = useState<SellerCategorySelectedElementList[]>(selectedFeatureList);

  const isFirstRunForFeatureList = useRef(true);

  const isFirstRunForVariationList = useRef(true);

  const isFirstRunForParentList = useRef(true);


  const handleAddFeature = (item) => {
    //push item to selected variation list
    let _tempItem = { ElementId: item.ElementId, IsRequired: false }
    if (selectedTempFeatureList.filter(i => i.ElementId === _tempItem.ElementId).length > 0) {
      const _selectedTempFeatureList = selectedTempFeatureList.filter(i => i.ElementId !== _tempItem.ElementId);
      setSelectedTempFeatureList([..._selectedTempFeatureList]);
    }
    else {
      setSelectedTempFeatureList([...selectedTempFeatureList, _tempItem]);
    }

  }

  const handleRemoveFeatureSelectedList = (item) => {
    //removing from selected feature list
    const _selectedFeatureList = selectedTempFeatureList.filter(i => i.ElementId !== item.ElementId);
    setSelectedTempFeatureList([..._selectedFeatureList]);

  }

  const handleChangeFeatureRequired = (itemId) => {
    //change selected variation required
    const _selectedFeature = selectedTempFeatureList.filter(i => i.ElementId === itemId)[0];
    _selectedFeature.IsRequired = !_selectedFeature.IsRequired;
    setSelectedTempFeatureList([...selectedTempFeatureList]);
  }

  const handleClearFeatureInput = () => {
    setSelectedFeatureList(JSON.parse(JSON.stringify(categoryDetail.Elements)));
    setSelectedTempFeatureList(JSON.parse(JSON.stringify(categoryDetail.Elements)));
    setEditableFeature(false);
  }


  useEffect(() => {
    getSellerCategoryGroups();
  }, [])

  useEffect(() => {
    if (isFirstRunForFeatureList.current) {
      isFirstRunForFeatureList.current = false;
      return;
    }
    getSellerCategoryFeatureList();
  }, [categoryGroups])

  useEffect(() => {
    if (isFirstRunForVariationList.current) {
      isFirstRunForVariationList.current = false;
      return;
    }
    getSellerCategoryVariationList();
  }, [featureList])

  useEffect(() => {
    if (isFirstRunForParentList.current) {
      isFirstRunForParentList.current = false;
      return;
    }
    getParentCategories();
  }, [variationList])

  useStateEffect(() => {
    getSellerCategoryDetail();
  }, [topCategories])

  const getParentCategories = async () => {

    const _result = await ApiService.getSellerCategoryList(1, 9999, "", 1);

    if (_result.succeeded) {
      let _curryArray: SellerTopCategoriesModel[] = []
      _result.data.Data.filter(i => (i.Id !== Id)).map((item) => (
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

  const getSellerCategoryDetail = async () => {

    const _result = await ApiService.getSellerCategoryDetail(Id);

    if (_result.succeeded === true) {
      setLoading(false);
      setCategoryDetail(_result.data.categoryData);
      setSelectedCategoryType(_result.data.categoryData.ParentCategory > 0 ? categoryTypes[1] : categoryTypes[0])
      setSelectedTopCategory(topCategories.find(i => i.key === String(_result.data.categoryData.ParentCategory)) ?? { key: "0", value: "Seçiniz", groupId: 0 });
      setName(_result.data.categoryData.Name);
      setOrder(_result.data.categoryData.Order);
      setPhotoPath(_result.data.categoryData.PhotoPath);
      setCommissionPercentage(_result.data.categoryData.CommissionPercentage);
      setDescription(_result.data.categoryData.Description);
      setIsEnabled(_result.data.categoryData.IsEnabled);
      setSelectedFeatureList(JSON.parse(JSON.stringify(_result.data.categoryData.Elements)));
      setSelectedVariationList(JSON.parse(JSON.stringify(_result.data.categoryData.Variations)));
      setSelectedTempFeatureList(JSON.parse(JSON.stringify(_result.data.categoryData.Elements)));
      setSelectedTempVariationList(JSON.parse(JSON.stringify(_result.data.categoryData.Variations)));
      setSelectedCategoryGroup(categoryGroups.find(i => i.key === String(_result.data.categoryData.GroupId)) ?? { key: "0", value: "Seçiniz" });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/satici-kategori-listesi') }
      });
    }
  }
  const getSellerCategoryVariationList = async () => {

    const _result = await ApiService.getSellerCategoryVariationList(1, 9999, "", 1);

    if (_result.succeeded === true) {
      let _currentArray: SellerCategoryVariationList[] = []
      _result.data.Data.map((item) => (
        _currentArray.push({
          ElementId: item.Id,
          Name: item.NameWithAlias
        })
      ));
      const _sorted = _currentArray.sort((a, b) => { return a.Name.localeCompare(b.Name) });
      setVariationList([..._sorted]);
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

    const _result = await ApiService.getSellerCategoryElementList(1, 9999, "", 1);

    if (_result.succeeded === true) {
      let _currentArray: SellerCategoryElementList[] = []
      _result.data.Data.map((item) => (
        _currentArray.push({
          ElementId: item.Id,
          Name: item.NameWithAlias
        })
      ));
      const _sorted = _currentArray.sort((a, b) => { return a.Name.localeCompare(b.Name) });
      setFeatureList([..._sorted]);
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

    if (_result.succeeded === true) {
      let _currentArray: SellerCategoryGroupsModel[] = []
      _result.data.Data.map((item) => (
        _currentArray.push({
          key: String(item.Id),
          value: item.GroupName,
        })
      ));
      setCategoryGroups([..._currentArray])

    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const updateSellerCategoryDetail = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSellerCategory(Id, name, order ?? 0, description, isEnabled, selectedFile, Number(selectedTopCategory.key), selectedCategoryType.key === "1" ? true : false, Number(selectedCategoryGroup.key), commissionPercentage ?? 0, selectedTempFeatureList, selectedTempVariationList,);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      setEditableInfo(false);
      setEditableVariation(false);
      setEditableFeature(false);

      const _currentObject: SellerCategoryDetailModel = categoryDetail;
      _currentObject.Id = Id;
      _currentObject.Name = name;
      _currentObject.Order = order;
      _currentObject.PhotoPath = selectedFile !== undefined ? URL.createObjectURL(selectedFile) : photoPath;
      _currentObject.Description = description;
      _currentObject.IsEnabled = isEnabled;
      _currentObject.ParentCategory = Number(topCategories.find(i => i.key === selectedTopCategory.key)?.key) ?? 0;
      _currentObject.CategoryGroup = selectedCategoryGroup.value;
      _currentObject.Elements = JSON.parse(JSON.stringify(selectedTempFeatureList));
      _currentObject.Variations = JSON.parse(JSON.stringify(selectedTempVariationList));
      _currentObject.GroupId = Number(selectedCategoryGroup.key);
      _currentObject.CommissionPercentage = commissionPercentage;

      { selectedFile !== undefined && setPhotoPath(URL.createObjectURL(selectedFile)) };

      setCategoryDetail(_currentObject);

      context.showModal({
        type: "Success",
        title: "Satıcı kategorisi başarıyla güncellendi.",
        onClose: () => { context.hideModal(); }
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

  const showDeleteSellerCategory = () => {
    context.showModal({
      type: "Question",
      title: "Kategoriyi Sil",
      message: `${name} isimli kategoriyi silmek istediğinize emin misiniz?`,
      onClose: () => { context.hideModal(); },
      onClick: async () => { await removeSellerCategoryDetail(); return true; },
    })
  }

  const removeSellerCategoryDetail = async () => {
    setProcessLoading(true);

    const _result = await ApiService.removeSellerCategory(Id);

    context.hideModal();
    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kategori başarıyla silindi",
        onClose: () => {
          context.hideModal();
          history.push('/satici-kategori-listesi')
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
  }

  const showChangeProCategoryStatus = () => {
    context.showModal({
      type: "Question",
      title: "Kategori durumunu değiştir",
      message: `Kategoriyi ${isEnabled ? "pasif" : "aktif"} duruma geçirmek istediğinize emin misiniz?`,
      onClose: () => { context.hideModal(); },
      onClick: async () => { await changeSellerCategoryStatus(); return true; },
    })
  }
  const changeSellerCategoryStatus = async () => {
    setProcessLoading(true);

    const _result = await ApiService.changeSellerCategoryStatus(Id, !isEnabled);

    context.hideModal();
    setProcessLoading(false);

    if (_result.succeeded === true) {
      setIsEnabled(!isEnabled);
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
        <div onClick={() => { window.history.back() }} className="inline-block mb-5 cursor-pointer">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Kategori Listesi
          </div>
        </div>
        <div className="flex justify-between pb-5 border-b border-gray-200  items-center">
          <h2 >Kategori Detayı</h2>
          <div className="flex gap-2">
            {(selectedTabsId === 1 && editableInfo !== true) &&
              <Button pageLoading={loading} buttonSm design="button-blue-400" className="px-4" text="Kategori Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setEditableInfo(true) }} />
            }
            {(selectedTabsId === 2 && editableVariation !== true) &&
              <Button pageLoading={loading} buttonSm design="button-blue-400" className="px-4" text="Kategori Varyasyon Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setEditableVariation(true) }} />
            }
            {(selectedTabsId === 3 && editableFeature !== true) &&
              <Button pageLoading={loading} buttonSm design="button-blue-400" className="px-4" text="Kategori Özellik Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setEditableFeature(true) }} />
            }
            {(!editableInfo && !editableFeature && !editableVariation) &&
              <>
                <Button pageLoading={loading} isLoading={processLoading} buttonSm design="button-gray-100" className="px-4" text={`Kategoriyi ${isEnabled ? "Pasife" : "Aktife"} Al`} hasIcon icon={
                  isEnabled ?
                    <EyeOffIcon className="icon-sm mr-2" />
                    :
                    <EyeIcon className="icon-sm mr-2" />
                } onClick={() => showChangeProCategoryStatus()} />
                <Button pageLoading={loading} isLoading={processLoading} buttonSm design="button-gray-100" className="px-4" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => showDeleteSellerCategory()} />
              </>
            }
          </div>
        </div>
        <div className="grid lg:grid-cols-4">
          <div className="lg:col-span-1 px-3 py-4">
            <SidebarLinks list={sidebarLinks} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
          </div>
          <div className="lg:col-span-2 pl-6 py-4  border-l border-gray-200">
            {selectedTabsId === 1 ?
              <>
                <Label isRequired withoutDots title="Kategori Tipi" className="mt-4" />
                {loading ?
                  <Loading inputSm />
                  :
                  <Dropdown
                    isDisabled={!editableInfo}
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
                      <>
                        <Dropdown
                          isDisabled={!editableInfo}
                          isDropDownOpen={currentOpenedFilterButton === "topCategory"}
                          onClick={() => { setCurrentOpenedFilterButton("topCategory"); }}
                          className="w-full text-black-700"
                          classNameDropdown={"max-h-52 overflow-y-auto custom-scrollbar"}
                          label={selectedTopCategory.value}
                          items={topCategories}
                          isSearchable
                          onItemSelected={item => { setSelectedTopCategory(item); handleFindCategoryGroup(item); }} />
                      </>
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
                  <>
                    <Dropdown
                      isDisabled={(selectedCategoryType.key === "2" || editableInfo === false) ? true : false}
                      isDropDownOpen={currentOpenedFilterButton === "categoryGroup"}
                      onClick={() => { setCurrentOpenedFilterButton("categoryGroup"); }}
                      className="w-full text-black-700"
                      classNameDropdown={"max-h-52 overflow-y-auto custom-scrollbar"}
                      label={selectedCategoryGroup.value}
                      items={categoryGroups}
                      isSearchable
                      onItemSelected={item => { setSelectedCategoryGroup(item) }} />
                  </>

                }
                <Label isRequired withoutDots title="Kategori Adı" className="mt-4" />
                {loading ?
                  <Loading inputSm />
                  :
                  <input className={`${editableInfo === true ? "" : "bg-gray-100"} form-input`} value={name} onChange={(e) => { setName(e.target.value) }} required disabled={!editableInfo} />
                }
                <Label isRequired withoutDots title="Kategori Sıralaması" className="mt-4" />
                {loading ?
                  <Loading inputSm />
                  :
                  <input className={`${editableInfo === true ? "" : "bg-gray-100"} form-input`} type="number" value={order} onChange={(e) => { setOrder(Number(e.target.value)) }} required disabled={!editableInfo} />
                }
                <Label withoutDots isRequired title="Kategori Görseli" className="mt-4" />
                {editableInfo &&
                  <div className="mb-2">
                    <FileUploader onFileSelected={item => { setSelectedFile(item) }} oldPreview={photoPath} isLoading={loading} sizeDescription={"242x194 px"} />
                  </div>
                }
                {loading ?
                  <Loading height="h-20" width="w-20" />
                  :
                  editableInfo === false &&
                  <img src={photoPath} alt={name} className="w-20 h-20 rounded-lg object-contain" />
                }
                <Label isRequired withoutDots title="Kategori Komisyonu (%)" className="mt-4" />
                {loading ?
                  <Loading inputSm />
                  :
                  <input type="number" className={`${editableInfo === true ? "" : "bg-gray-100"} form-input`} value={commissionPercentage} onChange={(e) => { setCommissionPercentage(parseInt(e.target.value)) }} required disabled={!editableInfo} />
                }
                <Label withoutDots title="Kategori Açıklaması" className="mt-4" />
                {loading ?
                  <Loading inputSm />
                  :
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${editableInfo === true ? "" : "bg-gray-100"} text-sm w-full px-3 py-2 text-black-700 border rounded-lg focus:outline-none resize-none leading-5 mb-1`}
                    value={description}
                    rows={3}
                    required
                    disabled={!editableInfo}
                  />
                }
              </>
              : selectedTabsId === 2 ?
                <>
                  {editableVariation &&
                    <>
                      <p className="text-sm mb-4">Seçili ürün kategorisine tanımlanacak ürün varyasyonlarını seçiniz.</p>
                      <p className="p-sm-gray-700 mb-2">Varyasyon Seçimi</p>
                      {loading ?
                        <Loading inputSm />
                        :
                        <MultiSelect
                          placeholder="Varyasyon"
                          showBox={showVariationBox}
                          selectedList={selectedTempVariationList}
                          constVariationList={variationList}
                          variationList={variationList}
                          handleAdd={handleAddVariation}
                          handleRemove={handleRemoveVariationSelectedList}
                          isSearchable
                        />
                      }
                    </>
                  }
                  {selectedTempVariationList.length > 0 &&
                    <div>
                      <div className={`${editableVariation ? "my-4 border-t-2 border-gray-200 pt-4 " : ""} flex p-sm-gray-700 items-center`}>
                        <p className="w-3/6 p-sm-gray-700">Varyasyon Adı</p>
                        <p className="w-1/6 p-sm-gray-700">Zorunlu Bilgi</p>
                        <p className="w-1/6 p-sm-gray-700">Ürün Resmi Gösterilsin</p>
                        <p className="w-1/6 p-sm-gray-700">İşlem</p>
                      </div>
                      {selectedTempVariationList.map((item, index) => (
                        <>
                          {loading ?
                            <Loading textMd />
                            :
                            <div className="flex items-center" key={index}>
                              <p className="w-3/6 py-2.5 mb-2 p-sm">{variationList.find(i => i.ElementId === item.ElementId)?.Name}</p>
                              <div className="w-1/6">
                                <ToggleButton isDisabled={!editableVariation} onClick={() => { handleChangeVariationRequired(item.ElementId) }} defaultValue={item.IsRequired} />
                              </div>
                              <div className="w-1/6">
                                <ToggleButton isDisabled={!editableVariation} onClick={() => { handleChangeVariationImageRequired(item.ElementId) }} defaultValue={item.IsImageRequired} />
                              </div>
                              <p className="w-1/6">
                                <TrashIcon className={`${editableVariation ? "" : "pointer-events-none"} icon-sm cursor-pointer`} onClick={() => { handleRemoveVariationSelectedList(item) }} />
                              </p>
                            </div>
                          }
                        </>
                      ))}
                    </div>
                  }
                </>
                : selectedTabsId === 3 &&
                <>
                  {editableFeature &&
                    <>
                      <p className="text-sm mb-4">Seçili ürün kategorisine tanımlanacak ürün varyasyonlarını seçiniz.</p>
                      <p className="p-sm-gray-700 mb-2">Varyasyon Seçimi</p>
                      {loading ?
                        <Loading inputSm />
                        :
                        <MultiSelect
                          placeholder="Varyasyon"
                          showBox={showFeatureBox}
                          selectedList={selectedTempFeatureList}
                          constVariationList={featureList}
                          variationList={featureList}
                          handleAdd={handleAddFeature}
                          handleRemove={handleRemoveFeatureSelectedList}
                          isSearchable
                        />
                      }
                    </>
                  }
                  {selectedTempFeatureList.length > 0 &&
                    <div>
                      <div className={`${editableFeature ? "my-4 border-t-2 border-gray-200 pt-4 " : ""} flex p-sm-gray-700 items-center`}>
                        <p className="w-4/6 p-sm-gray-700">Özellik Adı</p>
                        <p className="w-1/6 p-sm-gray-700">Zorunlu Bilgi</p>
                        <p className="w-1/6 p-sm-gray-700">İşlem</p>
                      </div>
                      {selectedTempFeatureList.map((item, index) => (
                        <>
                          {loading ?
                            <Loading textMd />
                            :
                            <div className="flex items-center" key={index}>
                              <p className="w-4/6 py-2.5 mb-2 p-sm">{featureList.find(i => i.ElementId === item.ElementId)?.Name}</p>
                              <div className="w-1/6">
                                <ToggleButton isDisabled={!editableFeature} onClick={() => { handleChangeFeatureRequired(item.ElementId) }} defaultValue={item.IsRequired} />
                              </div>
                              <p className="w-1/6">
                                <TrashIcon className={`${editableFeature ? "" : "pointer-events-none"} icon-sm cursor-pointer`} onClick={() => { handleRemoveFeatureSelectedList(item) }} />
                              </p>
                            </div>
                          }
                        </>
                      ))}
                    </div>
                  }
                </>
            }
          </div>
          <div className="lg:col-span-4 ml-auto">

            {selectedTabsId === 1 &&
              <>
                {editableInfo ?
                  <>
                    <Button text="Vazgeç" className={`${processLoading ? "pointer-events-none" : ""} w-24`} textTiny color="text-gray-700" onClick={() => { handleClearInfoInput(); }} />
                    <Button isLoading={processLoading} text="Değişiklikleri Kaydet" textTiny design="button-blue-400 w-80" onClick={() => { updateSellerCategoryDetail(); }} />
                  </>
                  :
                  <Button text="Sonraki" design="button-blue-400" className="w-80" onClick={() => setSelectedTabsId(2)} />
                }
              </>
            }
            {selectedTabsId === 2 &&
              <>
                {editableVariation ?
                  <>
                    <Button text="Vazgeç" className={`${processLoading ? "pointer-events-none" : ""} w-24`} textTiny color="text-gray-700" onClick={() => { handleClearVariationInput(); }} />
                    <Button isLoading={processLoading} text="Değişiklikleri Kaydet" textTiny design="button-blue-400 w-80" onClick={() => { updateSellerCategoryDetail(); }} />
                  </>
                  :
                  <Button text="Sonraki" design="button-blue-400" className="w-80" onClick={() => setSelectedTabsId(3)} />
                }
              </>
            }
            {selectedTabsId === 3 &&
              <>
                {editableFeature ?
                  <>
                    <Button text="Vazgeç" className={`${processLoading ? "pointer-events-none" : ""} w-24`} textTiny color="text-gray-700" onClick={() => { handleClearFeatureInput(); }} />
                    <Button isLoading={processLoading} text="Değişiklikleri Kaydet" textTiny design="button-blue-400 w-80" onClick={() => { updateSellerCategoryDetail(); }} />
                  </>
                  :
                  <Button text="Önceki" design="button-blue-400" className="w-80" onClick={() => setSelectedTabsId(2)} />
                }
              </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
