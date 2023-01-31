import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Label } from "../Components/Label";
import { Dropzone } from "../Components/Dropzone";
import { ToggleButton } from "../Components/ToggleButton";
import { AlertIcon, CheckIcon } from "../Components/Icons";
import { Button } from "../Components/Button";
import { useHistory, useParams } from "react-router-dom";
import { SERVICES } from "../Services/Constants";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Loading } from "../Components/Loading";
import { Image } from "../Components/Image";


interface RouteParams {
  id: string,
}

export const GeneralSliderEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(true);

  const [contentId, setContentId] = useState<number>(Number(params?.id ?? "0"));

  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [subTitle, setSubTitle] = useState<string>("");

  const [subTitleColor, setSubTitleColor] = useState<string>("#000000");

  const [title, setTitle] = useState<string>("");

  const [titleColor, setTitleColor] = useState<string>("#000000");

  const [buttonTitle, setButtonTitle] = useState<string>("");

  const [buttonTitleColor, setButtonTitleColor] = useState<string>("#000000");

  const [link, setLink] = useState<string>("");

  const [order, setOrder] = useState<number>(0);

  const [isNewTab, setIsNewTab] = useState<boolean>(false);

  const [isWeb, setIsWeb] = useState<boolean>(false);

  const [isMobileWeb, setIsMobileWeb] = useState<boolean>(false);

  const [isApp, setIsApp] = useState<boolean>(false);

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (contentId > 0) {
      getSlider();
    }
    else {
      setLoading(false);
      setProcessLoading(false);
    }
  }, [contentId]);

  const getSlider = async () => {

    const _result = await ApiService.getLoginSliderDetail(contentId);

    if (_result.succeeded === true) {

      setPhotoUrl(_result.data.PhotoUrl);
      setTitle(_result.data.Title);
      setTitleColor(_result.data.TitleColor);
      setSubTitle(_result.data.SubTitle);
      setSubTitleColor(_result.data.SubTitleColor);
      setButtonTitle(_result.data.ButtonTitle);
      setButtonTitleColor(_result.data.ButtonTitleColor);
      setLink(_result.data.RedirectLink);
      setOrder(_result.data.OrderBy);
      setIsNewTab(_result.data.IsBlank);
      setIsWeb(_result.data.ShowOnWebsite);
      setIsMobileWeb(_result.data.ShowOnMobilWeb);
      setIsApp(_result.data.ShowOnApp);
      setIsEnabled(_result.data.IsEnabled);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/1"); }
      });
    }
  }

  const createLoginSlider = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createLoginSlider(photoUrl, title, titleColor, subTitle, subTitleColor, buttonTitle, buttonTitleColor, link, order, isNewTab, isWeb, isMobileWeb, isApp, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/1"); }
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

  const updateLoginSlider = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateLoginSlider(contentId, photoUrl, title, titleColor, subTitle, subTitleColor, buttonTitle, buttonTitleColor, link, order, isNewTab, isWeb, isMobileWeb, isApp, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/1"); }
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

  const addFile = (e) => {
    setPhotoUrl(e[0].FileUrl);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4 border-b border-gray-200">{contentId > 0 ? "Slider Düzenle" : "Yeni Slider Oluştur"}</h2>
        <div className="w-full flex gap-8">
          <div className="w-1/2">
            <Label className="mt-6" title="Slider Görseli" withoutDots isRequired />
            {
              loading ?
                <Loading inputSm />
                :
                <>
                  <Dropzone
                    fileUploaderCss
                    accept={["image"]}
                    addFiles={addFile}
                    maxFileSizeAsMB={5}
                    uploadUrl={SERVICES.API_ADMIN_GENERAL_URL + "/upload-general-content-media"}
                    maxFileCount={1}
                    sizeDescription={"1920x636 px"}
                    warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."}
                  ></Dropzone>
                  {
                    (photoUrl !== "" && photoUrl !== undefined && photoUrl !== null) &&
                    <img src={photoUrl} className="w-72 h-48 object-contain" />
                  }
                </>

            }
            <Label className="mt-6" title="Üst Başlık" withoutDots />
            {
              loading ?
                <Loading inputSm />
                :
                <div className="flex items-center">
                  <input className="form-input" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
                  <input type="color" className="border border-gray-300 bg-white w-11 h-11 p-2 rounded-lg ml-3" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} />
                </div>
            }
            <Label className="mt-6" title="Başlık" withoutDots />
            {
              loading ?
                <Loading inputSm />
                :
                <div className="flex items-center">
                  <input className="form-input" type="text" value={subTitle} onChange={(e) => { setSubTitle(e.target.value); }} />
                  <input type="color" className="border border-gray-300 bg-white w-11 h-11 p-2 rounded-lg ml-3" value={subTitleColor} onChange={(e) => setSubTitleColor(e.target.value)} />
                </div>
            }
            <Label className="mt-6" title="Buton Başlığı" withoutDots />
            {
              loading ?
                <Loading inputSm />
                :
                <div className="flex items-center gap-3">
                  <input className="form-input" type="text" value={buttonTitle} onChange={(e) => { setButtonTitle(e.target.value); }} />
                  <input type="color" className="border border-gray-300 bg-white w-11 h-11 p-2 rounded-lg " value={buttonTitleColor} onChange={(e) => setButtonTitleColor(e.target.value)} />
                </div>
            }
            <Label className="mt-6" title="Yönlendirme Linki" withoutDots />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="text" value={link} onChange={(e) => { setLink(e.target.value); }} />
            }
            <Label className="mt-6" title="Gösterim Sırası" withoutDots />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)); }} />
            }
            {
              loading ?
                <>
                  <Loading textMd />
                  <Loading textMd />
                  <Loading textMd />
                  <Loading textMd />
                </>
                :
                <>
                  <div className="flex mt-4  align-items-center">
                    <div className="text-gray-900 text-sm font-medium">Yeni sekmede aç</div>
                    <div className="ml-auto">
                      <ToggleButton onClick={() => { setIsNewTab(!isNewTab) }} defaultValue={isNewTab} />
                    </div>
                  </div>
                  <div className="flex mt-4  align-items-center">
                    <div className="text-gray-900 text-sm font-medium">Web sitesinde göster</div>
                    <div className="ml-auto">
                      <ToggleButton onClick={() => { setIsWeb(!isWeb) }} defaultValue={isWeb} />
                    </div>
                  </div>
                  <div className="flex mt-4  align-items-center">
                    <div className="text-gray-900 text-sm font-medium">Mobil Web sitesinde göster</div>
                    <div className="ml-auto">
                      <ToggleButton onClick={() => { setIsMobileWeb(!isMobileWeb) }} defaultValue={isMobileWeb} />
                    </div>
                  </div>
                  <div className="flex mt-4  align-items-center">
                    <div className="text-gray-900 text-sm font-medium">Mobil Uygulamada göster</div>
                    <div className="ml-auto">
                      <ToggleButton onClick={() => { setIsApp(!isApp) }} defaultValue={isApp} />
                    </div>
                  </div>
                  <div className="flex mt-4  align-items-center">
                    <div className="text-gray-900 text-sm font-medium">Aktif olarak göster</div>
                    <div className="ml-auto">
                      <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
                    </div>
                  </div>
                </>
            }
          </div>
        </div>
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/genel-anasayfa-icerikleri/1"); }} />
          {
            contentId > 0 ?
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateLoginSlider(); }} />
              :
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createLoginSlider(); }} />
          }
        </div>
      </div>
    </div>
  )
}
