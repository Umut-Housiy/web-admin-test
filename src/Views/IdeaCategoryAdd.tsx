import React, { FunctionComponent, useContext, useEffect, useState } from "react"
import { Label } from "../Components/Label"
import { ToggleButton } from "../Components/ToggleButton"
import { FileUploader } from "../Components/FileUploader"
import { Button } from "../Components/Button"
import { useHistory } from "react-router"
import { IdeaCategoryElementInnerModel } from "../Models"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import ApiService from "../Services/ApiService"
import { Loading } from "../Components/Loading"
import { AlertIcon } from "../Components/Icons"
import { Link } from "react-router-dom"

export const IdeaCategoryAdd: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [featureList, setFeatureList] = useState<IdeaCategoryElementInnerModel[]>([]);

  const [orderBy, setOrderBy] = useState<number>(0);

  const [categoryName, setCategoryName] = useState<string>("");

  const [categoryDescription, setCategoryDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const [categoryFeatures, setCategoryFeatures] = useState<number[]>([]);

  var file = new File([""], "empty.txt", {
    type: "text/plain",
  });

  const [selectedFile, setSelectedFile] = useState<File>(file);

  useEffect(() => {
    getFeatureList();
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

  const createIdeaCategory = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createIdeaCategory(categoryName, orderBy, categoryDescription, isEnabled, categoryFeatures, selectedFile);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kategori oluşturuldu.",
        onClose: () => { context.hideModal(); setProcessLoading(false); history.push("/fikir-kategori-listesi"); }
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


  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Yeni Kategori Oluştur
        </h2>
        <div className="border-t border-gray-200">
          <Label className="mt-6" title="Kategori Adı" withoutDots isRequired />
          <input className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm" type="text" placeholder="Kategori Adı" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} />
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
              <>
                {featureList.length === 0 ?
                  <div className="flex items-center mb-3">
                    <AlertIcon className="icon-sm text-red-400 mr-2" />
                    <p className="text-sm">Ekli olan kategori özelliği bulunmamaktadır. Yeni kategori oluşturmak için lütfen <Link to="/fikir-kategori-ozellikleri" className="underline font-medium text-sm text-blue-400" >kategori özelliği ekle</Link> sayfasına giderek kategori özelliği ekleyiniz.</p>
                  </div>
                  :
                  featureList.map((item) => (
                    <div className="flex mt-4 w-1/2 align-items-center">
                      <div className="text-gray-600 text-sm">{item.NameWithAlias}</div>
                      <div className="ml-auto">
                        <ToggleButton onClick={() => { handleCategoryFeatureToggle(item.Id); }} defaultValue={categoryFeatures.includes(item.Id)} />
                      </div>
                    </div>
                  ))
                }
              </>
          }
          <Label className="mt-6" title="Kategori Sıralaması" withoutDots isRequired />
          <input className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm " type="number" placeholder="Kategori Sıralaması" value={orderBy} onChange={(e) => { setOrderBy(parseInt(e.target.value)) }} />
          <Label className="mt-6" title="Kategori Görseli" withoutDots isRequired />
          <div className="w-1/2 ">
            <FileUploader onFileSelected={item => { setSelectedFile(item) }} sizeDescription={"242x194 px"} />
          </div>
          <Label className="mt-6" title="Kategori Açıklaması" withoutDots isRequired />
          <textarea className="text-sm w-1/2 p-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none resize-none leading-5"
            placeholder="Kategori detayında görünecek ve kullanıcıları bilgilendirecek bir açıklama yazısı ekleyin."
            rows={3} value={categoryDescription} onChange={(e) => { setCategoryDescription(e.target.value) }} />
          <div className="flex mt-4 w-1/2 align-items-center">
            <div className="text-gray-600 text-sm">Kategoriyi aktif olarak göster</div>
            <div className="ml-auto">
              <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
            </div>
          </div>
          <div className="flex">
            <Button textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/fikir-kategori-listesi") }} />
            <Button isLoading={processloading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createIdeaCategory() }} />
          </div>
        </div>
      </div>
    </div>
  )
}
