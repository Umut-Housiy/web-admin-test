import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { FileUploader } from "../Components/FileUploader";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import { useStateEffect } from "../Components/UseStateEffect";
import { AcademyCategoryModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

interface RouteParams {
  id: string,
}

export const AcademyEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [reset, setReset] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [orderBy, setOrderBy] = useState<number>(0);

  const [videoUrl, setVideoUrl] = useState<string>("");

  const [videoDuration, setVideoDuration] = useState<string>("");

  const [shortDesc, setShortDesc] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const [isFeatured, setIsFeatured] = useState<boolean>(true);

  const categoryTypeOptions = [
    { key: "1", value: "Satıcı Paneli" },
    { key: "2", value: "Profesyonel Paneli" }
  ];

  const [selectedCategoryTypeOption, setSelectedCategoryTypeOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const [oldPhoto, setOldPhoto] = useState<string>("");

  const [selectedDocument, setSelectedDocument] = useState<File | undefined>();

  const [oldPdf, setOldPdf] = useState<string>("");

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [categoryOptionsFromApi, setCategoryOptionsFromApi] = useState<AcademyCategoryModel[]>([]);

  const [categoryOptions, setCategoryOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedCategoryOption, setSelectedCategoryOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const contentTypeOptions = [
    { key: "1", value: "Video" },
    { key: "2", value: "Döküman" }
  ];

  const [selectedContentTypeOption, setSelectedContentTypeOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });



  useEffect(() => {
    getAcademyCategoryList();
  }, []);

  useStateEffect(() => {
    getAcademyDetail();
  }, [categoryOptionsFromApi]);

  useStateEffect(() => {
    handleFilterCategoryOptions(selectedCategoryTypeOption.key);
  }, [selectedCategoryTypeOption]);

  const handleFilterCategoryOptions = (type) => {
    if (reset) {
      setSelectedCategoryOption({ key: "0", value: "Seçiniz..." });
    }
    let _tempCategoryOptionsList = categoryOptionsFromApi.filter(x => x.CategoryType === Number(type));
    let _tempList: { key: string, value: string }[] = [];
    _tempCategoryOptionsList.forEach((item) => {
      let _tempItem = { key: String(item.Id), value: item.Name };
      _tempList.push(_tempItem);
    });

    setCategoryOptions(JSON.parse(JSON.stringify(_tempList)));
  };

  const getAcademyCategoryList = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getAcademyCategoryListForDdl();

    if (_result.succeeded === true) {
      setCategoryOptionsFromApi(_result.data.Data);
      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setCategoryOptionsFromApi([]);
      setLoading(false);
      setProcessLoading(false);
    }
  }

  const getAcademyDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getAcademyDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setTitle(_result.data.Title);
      setShortDesc(_result.data.ShortDescription);
      setDescription(_result.data.Description);
      setVideoUrl(_result.data.VideoUrl);
      setVideoDuration(_result.data.VideoDuration);
      setOrderBy(_result.data.OrderBy);
      setIsEnabled(_result.data.IsEnabled);
      setIsFeatured(_result.data.IsFeatured);
      setSelectedCategoryTypeOption(categoryTypeOptions.find(x => x.key === String(_result.data.CategoryType)) ?? { key: "0", value: "Seçiniz" });
      setSelectedCategoryOption({ key: String(_result.data.CategoryId), value: _result.data.CategoryName });
      setReset(true);
      setOldPhoto(_result.data.PhotoUrl);
      setOldPdf(_result.data.DocumentUrl);


      setSelectedContentTypeOption(contentTypeOptions.filter(i => i.key === String(_result.data.AcademyType))[0]);
      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/akademi-listesi"); }
      });
    }
  }

  const updateAcademy = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateAcademy(Number(params.id ?? "0"), title, selectedFile, Number(selectedCategoryTypeOption.key ?? "0"), Number(selectedCategoryOption.key ?? "0"), orderBy, Number(selectedContentTypeOption.key), videoUrl, videoDuration, selectedDocument, shortDesc, description, isFeatured, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); setProcessLoading(false); history.push("/akademi-listesi"); }
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

  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Eğitim İçeriğini Düzenle
        </h2>
        <div className="border-t border-gray-200">
          <div className="w-1/2">
            <Label className="mt-6" title="Eğitim Adı" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="text" placeholder="Eğitim Adı" value={title} onChange={(e) => { setTitle(e.target.value); }} />
            }
            <Label className="mt-6" title="Eğitim Kapak Görseli" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <FileUploader oldPreview={oldPhoto} onFileSelected={item => { setSelectedFile(item) }} sizeDescription={"315x204 px"} />
            }
            <Label className="mt-6" title="Gösterim Alanı" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "typeSelect"}
                  onClick={() => { setCurrentOpenedFilterButton("typeSelect"); }}
                  className="w-full text-black-700 text-sm border-gray-300"
                  label={selectedCategoryTypeOption.value}
                  items={categoryTypeOptions}
                  onItemSelected={item => { setSelectedCategoryTypeOption(item); }} />
            }
            <Label className="mt-6" title="Kategori" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "categorySelect"}
                  onClick={() => { setCurrentOpenedFilterButton("categorySelect"); }}
                  className="w-full text-black-700 text-sm border-gray-300"
                  label={selectedCategoryOption.value}
                  items={categoryOptions}
                  onItemSelected={item => { setSelectedCategoryOption(item); }} />
            }
            <Label className="mt-6" title="Görüntülenme Sırası" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <input className=" form-input" type="number" placeholder="Görüntülenme Sırası" value={orderBy} onChange={(e) => { setOrderBy(Number(e.target.value ?? "0")); }} />
            }
            <Label className="mt-6" title="Eğitim İçeriği" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "contentTypeSelect"}
                  onClick={() => { setCurrentOpenedFilterButton("contentTypeSelect"); }}
                  className="w-full text-black-700 text-sm border-gray-300"
                  label={selectedContentTypeOption.value}
                  items={contentTypeOptions}
                  onItemSelected={item => { setSelectedContentTypeOption(item); }} />
            }
            {selectedContentTypeOption.key === "1" &&
              <>
                <Label className="mt-6" title="İçerik Video URL" withoutDots isRequired />
                {
                  loading ?
                    <Loading inputSm />
                    :
                    <input className="form-input" type="text" placeholder="İçerik Video URL" value={videoUrl} onChange={(e) => { setVideoUrl(e.target.value); }} />
                }
              </>
            }
            <Label className="mt-6" title="Eğitim Süresi" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="text" placeholder="Eğitim Süresi" value={videoDuration} onChange={(e) => { setVideoDuration(e.target.value); }} />
            }

            <Label className="mt-6" title="Eğitim Belgeleri (PDF)" withoutDots />
            {
              loading ?
                <Loading inputSm />
                :
                <FileUploader oldPreview={(oldPdf && oldPdf !== "" && oldPdf !== "-") ? oldPdf : undefined} isPdf={true} onFileSelected={item => { setSelectedDocument(item) }} />
            }
            <Label className="mt-6" title="Kısa Açıklama" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="text" placeholder="Eğitim hakkında kısa bilgilendirme yazısı" value={shortDesc} onChange={(e) => { setShortDesc(e.target.value); }} />
            }
            <Label className="mt-6" title="İçerik Açıklaması" withoutDots isRequired />
            {
              loading ?
                <Loading inputMd />
                :
                <textarea className="text-sm w-full p-3 text-gray-900 border   border-gray-300 rounded-lg focus:outline-none resize-none leading-5"
                  placeholder="İçerik Açıklaması"
                  rows={3} value={description} onChange={(e) => { setDescription(e.target.value); }} />
            }
            <div className="flex mt-4  align-items-center">
              {
                loading ?
                  <Loading textLg />
                  :
                  <>
                    <div className="text-gray-600 text-sm">Eğitimi Öne çıkar</div>
                    <div className="ml-auto">
                      <ToggleButton onClick={() => { setIsFeatured(!isFeatured) }} defaultValue={isFeatured} />
                    </div>
                  </>
              }
            </div>
            <div className="flex mt-4  align-items-center">
              {
                loading ?
                  <Loading textLg />
                  :
                  <>
                    <div className="text-gray-600 text-sm">Aktif olarak göster</div>
                    <div className="ml-auto">
                      <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
                    </div>
                  </>
              }
            </div>
          </div>
          <div className="flex">
            <Button isLoading={processloading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/akademi-listesi") }} />
            <Button isLoading={processloading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateAcademy(); }} />
          </div>
        </div>
      </div>
    </div>
  )
}
