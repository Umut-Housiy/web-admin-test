import React, { FunctionComponent, useContext, useEffect, useState } from "react"
import { Label } from "../Components/Label"
import { ToggleButton } from "../Components/ToggleButton"
import { FileUploader } from "../Components/FileUploader"
import { Button } from "../Components/Button"
import { TabsTitle } from "../Components/TabsTitle"
import { useHistory } from "react-router"
import { Link, useLocation, useParams } from "react-router-dom"
import { ChevronRightIcon, EditIcon, EyeOffIcon, TrashIcon } from "../Components/Icons"
import { IdeaCategoryElementInnerModel, IdeaCategoryInnerModel } from "../Models"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import { Loading } from "../Components/Loading"

interface RouteParams {
  id: string,
}

interface LocationModel {
  isEditActive: boolean,
  queryPage: number
}

export const IdeaCategoryDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [isEditActive, setIsEditActive] = useState<boolean>(location.state?.isEditActive ?? false)

  const [featureList, setFeatureList] = useState<IdeaCategoryElementInnerModel[]>([]);

  const [categoryDetail, setCategoryDetail] = useState<IdeaCategoryInnerModel>(
    {
      Id: 0,
      Order: 0,
      Code: "",
      PhotoPath: "",
      Name: "",
      Description: "",
      Elements: [],
      IsEnabled: true
    }
  );

  var file = new File([""], "empty.txt", {
    type: "text/plain",
  });

  const [name, setName] = useState<string>("");

  const [categoryFeatures, setCategoryFeatures] = useState<number[]>([]);

  const [order, setOrder] = useState<number>(0);

  const [selectedFile, setSelectedFile] = useState<File>(file);

  const [description, setDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const [photoPath, setPhotoPath] = useState<string>(selectedFile.size > 0 ? URL.createObjectURL(selectedFile) : "");

  useEffect(() => {
    getFeatureList();
    getCategoryDetail();
  }, []);

  const getFeatureList = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getIdeaCategoryFeatureList(1, 9999, -1, "", 1);

    if (_result.succeeded === true) {
      setFeatureList(_result.data.Data);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const getCategoryDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getIdeaCategoryDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {

      setCategoryDetail(_result.data.categoryData);
      setOrder(_result.data.categoryData.Order);
      setName(_result.data.categoryData.Name);
      setDescription(_result.data.categoryData.Description ?? "");
      setIsEnabled(_result.data.categoryData.IsEnabled);
      setPhotoPath(_result.data.categoryData.PhotoPath);
      setCategoryFeatures(JSON.parse(JSON.stringify(_result.data.categoryData.Elements ?? [])));

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/fikir-kategori-listesi"); }
      });
    }
  }

  const updateIdeaCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateIdeaCategory(Number(params.id ?? "0"), name, order, description, isEnabled, categoryFeatures, selectedFile);

    if (_result.succeeded === true) {

      const _curryObj: IdeaCategoryInnerModel = categoryDetail;
      _curryObj.Id = Number(params.id ?? "0");
      _curryObj.Name = name;
      _curryObj.Order = order;
      _curryObj.Description = description;
      _curryObj.IsEnabled = isEnabled;
      _curryObj.Elements = categoryFeatures;
      _curryObj.PhotoPath = selectedFile.size > 0 ? URL.createObjectURL(selectedFile) : photoPath;

      { selectedFile.size > 0 && setPhotoPath(URL.createObjectURL(selectedFile)) }

      context.showModal({
        type: "Success",
        title: "Kategori düzenlendi.",
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
  }

  const handleDeleteCategory = () => {
    context.showModal({
      type: "Question",
      title: "Kategori silinmesi durumunda bu kategoriye bağlı olan fikirler pasife alınacaktır. Onaylıyor musunuz ?",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await deleteCategory(); return true; }
    });
  }

  const deleteCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.deleteIdeaCategory(Number(params.id ?? "0"));

    setProcessLoading(false);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kategori silindi.",
        onClose: () => { context.hideModal(); history.push("/fikir-kategori-listesi"); }
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

  const handleChangeCategoryStatus = () => {
    context.showModal({
      type: "Question",
      title: isEnabled ? "PASİFLEŞTİR" : "AKTİFLEŞTİR",
      message: isEnabled ? "Kategori pasifleştirilmesi durumunda bu kategoriye bağlı olan fikirler pasifleştirilecektir. Onaylıyor musunuz ?" : "Kategori aktifleştirilmesi durumunda bu kategoriye bağlı olan fikirler aktifleştitilecektir. Onaylıyor musunuz ?",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await changeCategoryStatus(); return true; }
    });
  }

  const changeCategoryStatus = async () => {
    setProcessLoading(true);

    const _result = await ApiService.changeIdeaCategoryStatus(Number(params.id ?? "0"), !isEnabled);

    context.hideModal();

    if (_result.succeeded === true) {
      getCategoryDetail();
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
  }

  const handleCategoryFeatureToggle = (Id) => {

    if (categoryFeatures.includes(Id)) {
      let _tempFeatureList = categoryFeatures.filter(item => item !== Id);
      setCategoryFeatures([..._tempFeatureList]);
    }
    else {
      let _tempFeatureList = categoryFeatures;
      _tempFeatureList.push(Id);
      setCategoryFeatures([..._tempFeatureList]);
    }
  }

  const handleClearInput = () => {
    setOrder(categoryDetail.Order);
    setName(categoryDetail.Name);
    setDescription(categoryDetail.Description ?? "");
    setIsEnabled(categoryDetail.IsEnabled);
    setPhotoPath(categoryDetail.PhotoPath);
    setCategoryFeatures(JSON.parse(JSON.stringify(categoryDetail.Elements ?? [])));
    setSelectedFile(file);
    setIsEditActive(false);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/fikir-kategori-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/fikir-kategori-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Kategori Listesi
          </div>
        </Link>
        <div className="flex align-items-center mb-5">
          <h2>Kategori Detayı</h2>
          {
            (!isEditActive) &&
            <>
              <Button isLoading={processloading} textTiny className="w-72 ml-auto" buttonSm design="button-blue-400" text="Kategori Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setIsEditActive(true) }} />
              <Button isLoading={processloading} textTiny className={`${isEditActive ? "ml-auto" : "ml-2"} w-60`} buttonSm design="button-gray-100" text={isEnabled ? "Kategoriyi Pasife Al" : "Kategoriyi Aktifleştir"} hasIcon icon={<EyeOffIcon className="icon-sm mr-2" />} onClick={() => { handleChangeCategoryStatus() }} />
              <Button isLoading={processloading} textTiny className="w-32 ml-2" buttonSm design="button-gray-100" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => { handleDeleteCategory(); }} />
            </>
          }
        </div>
        <TabsTitle selectedTabsId={1} list={[{ id: 1, name: "Kategori Bilgisi" }]} />
        <div className="border-t border-gray-200">
          <Label className="mt-6" title="Kategori Adı" withoutDots isRequired />
          {
            loading ?
              <div className="w-1/2">
                <Loading inputSm />
              </div>
              :
              <input className={`${isEditActive ? "" : "disabled-50"} w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm `} type="text" placeholder="Kategori Adı" disabled={!isEditActive} value={name} onChange={(e) => { setName(e.target.value) }} />
          }
          <Label className="mt-6" title="Kategori Özellikleri" withoutDots isRequired />
          {
            loading ?
              <div className="w-1/2">
                <Loading textLg />
                <Loading textLg />
                <Loading textLg />
                <Loading textLg />
                <Loading textLg />
                <Loading textLg />
                <Loading textLg />
                <Loading textLg />
                <Loading textLg />
              </div>
              :
              featureList.map((item) => (
                <div className="flex mt-4 w-1/2 align-items-center" key={item.Id}>
                  <div className="text-gray-600 text-sm">{item.NameWithAlias}</div>
                  <div className="ml-auto">
                    <ToggleButton isDisabled={!isEditActive} onClick={() => { handleCategoryFeatureToggle(item.Id); }} defaultValue={(categoryFeatures.includes(item.Id))} />
                  </div>
                </div>
              ))
          }
          <Label className="mt-6" title="Kategori Sıralaması" withoutDots isRequired />
          {
            loading ?
              <div className="w-1/2">
                <Loading inputSm />
              </div>
              :
              <input className={`${isEditActive ? "" : "disabled-50"} w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm`} type="number" placeholder="Kategori Sıralaması" disabled={!isEditActive} value={order} onChange={(e) => { setOrder(parseInt(e.target.value)) }} />
          }
          <Label className="mt-6" title="Kategori Görseli" withoutDots isRequired />
          {
            isEditActive &&
            <div className="w-1/2 ">
              <FileUploader onFileSelected={item => { setSelectedFile(item) }} oldPreview={categoryDetail.PhotoPath} isLoading={loading} sizeDescription={"242x194 px"} />
            </div>
          }
          {
            !isEditActive && loading ?
              <div className="w-20 h-20">
                <Loading inputMd />
              </div>
              :
              !isEditActive ?
                <img src={categoryDetail.PhotoPath} alt={categoryDetail.Name} className="w-20 h-20 rounded-lg object-cover mt-5" />
                :
                <></>
          }
          <Label className="mt-6" title="Kategori Açıklaması" withoutDots isRequired />
          {
            loading ?
              <div className="w-1/2">
                <Loading inputMd />
              </div>
              :
              <textarea className={`${isEditActive ? "" : "disabled-50"} text-sm w-1/2 p-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none resize-none leading-5`}
                placeholder="Kategori detayında görünecek ve kullanıcıları bilgilendirecek bir açıklama yazısı ekleyin."
                rows={3} disabled={!isEditActive} value={description} onChange={(e) => { setDescription(e.target.value) }} />
          }
          {
            isEditActive &&
            <div className="flex">
              <Button textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { handleClearInput(); }} />
              <Button isLoading={processloading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateIdeaCategory() }} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}
