import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { AlertIcon, CloseIcon, CoverPhotoIcon, MakeCoverPhotoIcon, PlusIcon, ThreeDotIcon, TrashIcon } from "../Components/Icons";
import { ElementDataModel, ProjectMediaModel, ProjectModel, ProjectVariationModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import Slider from "react-slick";
import { Loading } from "../Components/Loading";
import { useStateEffect } from "../Components/UseStateEffect";
import { Label } from "../Components/Label";
import { Dropdown } from "../Components/Dropdown";
import { DynamicInput } from "../Components/DynamicInput";
import { SliderNextArrowOnMiddle } from "../Components/SliderNextArrow";
import { SliderPrevArrowOnMiddle } from "../Components/SliderPrevArrow";
import { Modal } from "../Components/Modal";
import { Dropzone } from "../Components/Dropzone";
import { SERVICES } from "../Services/Constants";
import { TextArea } from "../Components/TextArea";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RouteParams {
  id: string
}

interface LocationModel {
  IsIdeaApproved?: boolean
}

export const ProjectEdit: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const location = useLocation<LocationModel>();

  const [categoryOptions, setCategoryOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedCategoryOption, setSelectedCategoryOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [loadingForCategoryList, setLoadingForCategoryList] = useState<boolean>(false);

  const [ideaCategoryListLoading, setIdeaCategoryListLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [projectDetail, setProjectDetail] = useState<ProjectModel>();

  const [mediaList, setMediaList] = useState<ProjectMediaModel[]>([]);

  const [projectTitle, setProjectTitle] = useState<string>("");

  const [projectDescription, setProjectDescription] = useState<string>("");

  const [keyword, setKeyword] = useState<string>("");

  const [keywordList, setKeywordList] = useState<string[]>([]);

  const [warningText, setWarningText] = useState<boolean>(false);

  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);

  const [showOptionBox, setShowOptionBox] = useState<boolean>(false);

  const [variationList, setVariationList] = useState<ProjectVariationModel[]>([]);

  const [selectedVariation, setSelectedVariation] = useState<ElementDataModel[]>([]);

  const [showDropzoneModal, setShowDropzoneModal] = useState<boolean>(false);

  const [IsIdeaApproved, setIsIdeaApproved] = useState<boolean>(location.state?.IsIdeaApproved === undefined ? false : location.state?.IsIdeaApproved)

  const multipleItems6Half = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplaySpeed: 4000,
    autoplay: true,
    nextArrow: <></>,
    prevArrow: <></>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  }

  useEffect(() => {
    getIdeaCategoryList();
  }, []);

  useStateEffect(() => {
    getProjectDetail();
  }, [categoryOptions]);

  useStateEffect(() => {
    getIdeaCategoryElementForProject();
  }, [projectDetail]);

  const getIdeaCategoryList = async () => {
    setLoadingForCategoryList(true);

    const _result = await ApiService.getIdeaCategoryList(1, 9999, "", 1, 1);

    if (_result.succeeded === true) {
      let _tempList: { key: string, value: string }[] = [];
      _result.data.Data.forEach(item => {
        _tempList.push({ key: String(item.Id ?? "0"), value: String(item.Name ?? "") });
      });
      setCategoryOptions(JSON.parse(JSON.stringify(_tempList)));
      //
      setLoadingForCategoryList(false);
    }
    else {
      setCategoryOptions([]);
      setLoadingForCategoryList(false);
    }
  }

  const getProjectDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    if (IsIdeaApproved === true) {
      var _result = await ApiService.getIdeaDetail(Number(params.id ?? "0"));
    }
    else {
      var _result = await ApiService.getProjectDetail(Number(params.id ?? "0"));
    }

    if (_result.succeeded === true) {
      setProjectDetail(_result.data);
      setMediaList(_result.data.MediaList);
      setProjectTitle(_result.data.Name);
      setSelectedCategoryOption({ key: String(_result.data.CategoryId), value: _result.data.CategoryName } ?? { key: "0", value: "Seçiniz..." });
      setProjectDescription(_result.data.Description);
      setKeywordList(_result.data.KeywordList);
      setSelectedVariation(_result.data.CategoryElementObj);
      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          if (IsIdeaApproved === true) {
            history.push("/fikir-listesi");
          }
          else {
            history.push("/onaylanan-projeler");
          }
        }
      });
    }
  }

  const getIdeaCategoryElementForProject = async () => {
    setIdeaCategoryListLoading(true);

    const _result = await ApiService.getIdeaCategoryElementForProject(projectDetail?.CategoryId ?? 0);

    if (_result.succeeded === true) {
      setVariationList(_result.data);
      setIdeaCategoryListLoading(false);
    }
    else {
      setVariationList([]);
      setIdeaCategoryListLoading(false);
    }
  }

  const updateProject = async () => {
    setProcessLoading(true);

    if (IsIdeaApproved === true) {
      var _result = await ApiService.updateIdea(Number(params.id ?? "0"), projectTitle, Number(selectedCategoryOption.key), selectedVariation, keywordList, projectDescription, mediaList);
    }
    else {
      var _result = await ApiService.updateProject(Number(params.id ?? "0"), projectTitle, Number(selectedCategoryOption.key), selectedVariation, keywordList, projectDescription, mediaList);
    }

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => {
          context.hideModal();
          if (IsIdeaApproved === true) {
            history.push(`/fikir-listesi`);
          }
          else {
            history.push(`/proje-detay/${params.id}`);
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
  }


  const makeDefaultPhoto = (url: string) => {
    let tempData = mediaList;
    for (let i = 0; i < tempData.length; i++) {
      tempData[i].IsMainPhoto = tempData[i].FileUrl === url;
    }
    setMediaList(JSON.parse(JSON.stringify(tempData)));
    setShowOptionBox(false);
  }

  const removePhotoFromArray = (url) => {
    const newFiles = [...mediaList];
    if ((mediaList.filter(i => i.FileUrl === url)[0].IsMainPhoto === true && newFiles.length > 1)) {
      newFiles[1].IsMainPhoto = true;
    }
    setMediaList(([...newFiles] || []).filter(x => x.FileUrl != url));
    setShowOptionBox(false);
  };

  const addFiles = (e) => {
    let tempData: { MediaId: number, FileName: string, FileUrl: string, IsMainPhoto: boolean, PinMap: string }[] = [];
    for (let i = 0; i < e.length; i++) {
      const element = e[i];
      tempData.push({ MediaId: 0, FileName: element.FileName, FileUrl: element.FileUrl, IsMainPhoto: ((mediaList?.length ?? 0) === 0 && i === 0), PinMap: "[]" })
    }
    setMediaList([...mediaList, ...tempData]);
  }

  const removePhotoFromApi = async (Id, url) => {
    context.showModal({
      type: "Question",
      title: "Fotoğraf Silinecek",
      message: `Fotoğrafı silmek istediğinize emin misiniz?`,
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.removeProjectPhoto(Id);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          removePhotoFromArray(url);
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
      onClose: () => { context.hideModal(); }
    })

  }

  const InfoText = (text: string) => {
    return <div className="flex items-center mb-3">
      <AlertIcon className="icon-sm text-red-400 mr-2" />
      <p className="text-sm">{text}</p>
    </div>
  }

  const handleAddKeyWord = () => {
    const _keyWord = keyword.trim();
    if (keywordList.includes(_keyWord)) {
      setWarningText(true);
      return
    }
    else if (keyword === "") {
      setWarningText(false);
      return
    }
    let _keyWordList = keywordList;
    _keyWordList.push(keyword);
    setKeywordList([..._keyWordList]);
    setKeyword("");
  }

  const handleRemoveKeyWord = (item) => {
    const _currentArray = keywordList.filter(i => i !== item);
    setKeywordList([..._currentArray]);
  }

  const setSingleProperty = (elementId: number, dataType: number, value: string) => {

    var element = selectedVariation.find(x => x.ElementId === elementId);
    if (element) {
      let otherElements = selectedVariation.filter(x => x.ElementId !== elementId);
      element.Value = value;

      setSelectedVariation([...otherElements, element]);

    }
    else {
      let nR: any = { DataType: dataType, ElementId: elementId, Value: value };
      setSelectedVariation([...selectedVariation, nR]);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2>{IsIdeaApproved === true ? "Fikir Bilgilerini Düzenle" : "Proje Bilgilerini Düzenle"} </h2>
        <div className="py-2 w-full mt-4">
          <h4 className="mb-4">
            {IsIdeaApproved === true ? "Fikir Galerisi" : "Proje Galerisi"}</h4>
          <Button isLoading={processLoading} buttonMd text="Yeni Dosya Ekle" design="button mb-6 border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-900 w-60 rounded-lg" hasIcon icon={<PlusIcon className="icon-sm mr-3" />}
            onClick={() => setShowDropzoneModal(true)}
          />
          {loading ?
            <div className="grid lg:grid-cols-5 gap-4">
              <Loading width="w-full" height="h-40" />
              <Loading width="w-full" height="h-40" />
              <Loading width="w-full" height="h-40" />
              <Loading width="w-full" height="h-40" />
              <Loading width="w-full" height="h-40" />
            </div>
            :
            mediaList.length <= 4 ?
              <div className="grid lg:grid-cols-5">
                {mediaList.map((item, j) => (
                  <div className="col-span-1 relative">
                    <img src={item.FileUrl} className="w-full pr-3 object-cover h-48" alt="Slider" />
                    <ThreeDotIcon className="w-7 h-7 bg-white shadow-lg absolute right-4 top-2 rounded-sm text-gray-700 cursor-pointer"
                      onClick={() => { setSelectedPhoto(j); { setShowOptionBox(!showOptionBox) } }} />
                    {item.IsMainPhoto ?
                      <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                    }
                    {(showOptionBox && (selectedPhoto === j)) &&
                      <div className="absolute right-2 top-10 bg-white rounded-sm shadow-md p-2 cursor-pointer z-20">
                        <p className="text-sm mt-1" onClick={() => { setShowOptionBox(false); makeDefaultPhoto(item.FileUrl) }} >
                          <MakeCoverPhotoIcon className="icon-sm text-gray-700 mr-1 inline-block" />
                          Kapak Fotoğrafı Yap
                        </p>
                        <p className="text-sm mt-3" onClick={() => {
                          setShowOptionBox(false);
                          if (item.MediaId === 0) {
                            removePhotoFromArray(item.FileUrl);
                          }
                          else {
                            removePhotoFromApi(item.MediaId, item.FileUrl);
                          }
                        }}>
                          <TrashIcon className="icon-sm text-gray-700 mr-1 inline-block" />
                          Resmi Sil
                        </p>
                      </div>
                    }
                  </div>
                ))}
              </div>
              :
              <Slider {...multipleItems6Half}>
                {mediaList.map((item, j) => (
                  <div className="relative">
                    <img src={item.FileUrl} className="w-full pr-3 object-cover h-48" alt="Slider" />
                    <ThreeDotIcon className="w-7 h-7 bg-white shadow-lg absolute right-4 top-2 rounded-sm text-gray-700 cursor-pointer"
                      onClick={() => { setSelectedPhoto(j); { setShowOptionBox(!showOptionBox) } }} />
                    {item.IsMainPhoto ?
                      <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                    }
                    {(showOptionBox && (selectedPhoto === j)) &&
                      <div className="absolute right-2 top-10 bg-white rounded-sm shadow-md p-2 cursor-pointer z-20">
                        <p className="text-sm mt-1" onClick={() => { makeDefaultPhoto(item.FileUrl) }} >
                          <MakeCoverPhotoIcon className="icon-sm text-gray-700 mr-1 inline-block" />
                          Kapak Fotoğrafı Yap
                        </p>
                        <p className="text-sm mt-3" onClick={() => {
                          if (item.MediaId === 0) {
                            removePhotoFromArray(item.FileUrl);
                          }
                          else {
                            removePhotoFromApi(item.MediaId, item.FileUrl);
                          }
                        }}>
                          <TrashIcon className="icon-sm text-gray-700 mr-1 inline-block" />
                          Resmi Sil
                        </p>
                      </div>
                    }
                  </div>
                ))}
              </Slider>
          }
        </div>
        <div className="py-2 w-full border-t border-gray-300">
          <h4 className="mb-4"> {IsIdeaApproved === true ? "Fikir Bilgileri" : "Proje Bilgileri"}</h4>
          <div className="w-full flex gap-8">
            <div className="lg:w-1/2">
              <Label className="mt-6" title={IsIdeaApproved === true ? "Fikir Adı" : "Proje Adı"} withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <input className="form-input" type="text" placeholder="Proje Adı" value={projectTitle} onChange={(e) => { setProjectTitle(e.target.value); }} />
              }
              <Label className="mt-6" title={IsIdeaApproved === true ? "Fikir Kategorisi" : "Proje Kategorisi"} withoutDots />
              {InfoText("Bu proje hangi fikir kategorisine ait? Örneğin; mutfak, banyo, çocuk odası vb.")}
              {
                loadingForCategoryList ?
                  <Loading inputSm />
                  :
                  <Dropdown
                    isDropDownOpen={currentOpenedFilterButton === "selectCategory"}
                    onClick={() => { setCurrentOpenedFilterButton("selectCategory"); }}
                    className="w-full text-black-700 text-sm"
                    label={selectedCategoryOption.value}
                    items={categoryOptions}
                    isSearchable={true}
                    onItemSelected={item => { setSelectedCategoryOption(item) }} />
              }
              {
                ideaCategoryListLoading ?
                  <Loading inputSm className="mt-4" />
                  :
                  <>
                    {
                      (variationList?.length > 0 && selectedCategoryOption.key !== "0") ?
                        variationList.map((item, i) => (
                          <DynamicInput
                            uploadUrl={SERVICES.API_ADMIN_PROJECT_URL + "/upload-project-media"}
                            dataType={item.DataType}
                            elementId={item.Id}
                            name={item.Name}
                            setDynamicData={setSingleProperty}
                            key={"v-" + i}
                            data={item.Options.map(x => {
                              return {
                                key: x.Id.toString(),
                                value: x.Name
                              };
                            })}
                            selectedValue={selectedVariation.find(x => x.ElementId === item.Id)?.Value}
                          />
                        ))
                        :
                        selectedCategoryOption.key !== "0" &&
                        <span className="mt-4 inline-block">
                          {ideaCategoryListLoading ? <Loading inputSm /> :
                            InfoText("Bu kategoride kayıtlı varyasyon bulunmamaktadır.")
                          }
                        </span>
                    }
                  </>
              }
              <Label className="mt-6" title={IsIdeaApproved === true ? "Fikir Açıklaması" : "Proje Açıklaması"} withoutDots />
              {
                loading ?
                  <Loading inputMd />
                  :
                  <TextArea
                    setText={setProjectDescription}
                    text={projectDescription}
                    placeholder="Kullanıcıları bilgilendirmek için kısa bir proje açıklaması yazın. Bu projede hangi işler yapıldı? Nasıl malzeme ve işçilik kullanıldı? Proje alanının büyüklüğü nedir? gibi soruları yanıtlamaya çalışarak iyi bir açıklama yazısı oluşturabilirsiniz."
                    maxCount={1000}
                  />
              }
            </div>
            <div className="lg:w-1/2">
              <Label className="mt-6" title="Etiketler" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <>
                    {InfoText("Fikir olarak öne çıkarmak istediğiniz projelerde anahtar kelimeler size yardımcı olacaktır.")}
                    <div className="flex">
                      <input disabled={keywordList.length === 5 ? true : false} placeholder={keywordList.length === 5 ? "En fazla 5 adet kelime ekleyebilirsiniz" : ""} className="form-input" value={keyword} onChange={(e) => { setKeyword(e.target.value) }} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddKeyWord();
                        }
                      }} />
                      <Button buttonMd design="button-blue-400" text="Ekle" className="px-5 text-sm ml-3" onClick={() => handleAddKeyWord()} />
                    </div>
                    {warningText &&
                      <div className="flex items-center my-3 text-red-400 ">
                        <AlertIcon className="icon-sm mr-2 " />
                        <span className="text-sm font-medium">Aynı isme sahip iki seçenek eklenemez.</span>
                      </div>
                    }
                    {keywordList.length > 0 &&
                      keywordList.map((item, index) => (
                        <span className="text-sm bg-blue-100 rounded-full text-gray-900 inline-flex items-center py-1 px-3  mt-2 mr-1 mb-1">
                          {item}
                          <CloseIcon className="icon-sm ml-3  cursor-pointer" onClick={() => { handleRemoveKeyWord(item); }} />
                        </span>
                      ))
                    }
                  </>
              }
              <Label className="mt-4" title="Fikir ID" withoutDots />
              {
                loading ?
                  <Loading inputMd />
                  :
                  <input className="form-input bg-gray-100" type="text" placeholder={projectDetail?.IsIdeaApproved === true ? "Fikir Adı" : "Proje Adı"} value={projectDetail?.Id} disabled />
              }
            </div>
          </div>
          <div className="flex">
            <div className="ml-auto flex">
              {IsIdeaApproved === true ?
                <Link to="/fikir-listesi" >
                  <Button isLoading={processLoading} textTiny className="w-24" text="Vazgeç" color="text-gray-400" />
                </Link>
                :
                <Link to={{ pathname: `${"/proje-detay/" + params.id}`, state: { prevTitle: "Onaylanan Projeler", prevPath: "/onaylanan-projeler", tabId: 1, IsIdeaApproved: false } }} >
                  <Button isLoading={processLoading} textTiny className="w-24" text="Vazgeç" color="text-gray-400" onClick={() => { }} />
                </Link>
              }
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => {
                updateProject();
              }} />
            </div>
          </div>
        </div>
      </div >
      <Modal
        modalType="fixedMd"
        showModal={showDropzoneModal}
        onClose={() => { setShowDropzoneModal(false); }}
        title="Resim Yükle"
        body={
          <div>
            <Dropzone
              accept={["image"]}
              uploadUrl={SERVICES.API_ADMIN_PROJECT_URL + "/upload-project-media"}
              addFiles={addFiles}
              maxFileSizeAsMB={10}
              maxFileCount={25 - (mediaList?.length ?? 0)}
              info={[
                { message: "Yalnızca JPEG, GIF, PNG veya TIFF uzantılı dosyalar yükleyebilirisiniz.", icon: "check" },
                { message: "Yüksek çözünürlüğe sahip görseller yükleyiniz.", icon: "check" },
                { message: "Reklam veya tanıtım içerek görseller yüklenemez.", icon: "cross" },
                { message: "Yükleyeceğiniz belge boyutu 5MB’dan büyük olmamalıdır.", icon: "cross" },
              ]}
            />
            <div className="flex items-center mb-3 text-yellow-600 p-3 bg-yellow-100 text-sm my-5">
              <AlertIcon className="w-6 h-6 mr-2" />
              <span>Resimlerinizi seçtikten sonra; lütfen "Değişiklikleri Kaydet" butonuna basmayı unutmayınız. Basmadığınız takdirde seçmiş olduğunuz fotoğraflar kaydedilmeyecektir.</span>
            </div>
          </div>
        }
        footer={
          <Button block design="button-blue-400 mt-4" text="Kapat" onClick={() => { setShowDropzoneModal(false) }} />
        }
      />
    </div >
  )
}
