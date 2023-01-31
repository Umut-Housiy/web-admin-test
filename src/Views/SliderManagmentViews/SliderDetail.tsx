import { useCallback, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../Components/Button";
import { FileUploader } from "../../Components/FileUploader";
import { Label } from "../../Components/Label"
import { ToggleButton } from "../../Components/ToggleButton";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

interface RouteParams {
  id: string,
}

export function SliderDetail() {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const params = useParams<RouteParams>();
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [sliderId] = useState<number>(Number(params.id ?? "0"));
  const [sliderType, setSliderType] = useState<number>();
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [selectedSliderPhoto, setSelectedSliderPhoto] = useState<File | undefined>();
  const [oldSliderPhoto, setOldSliderPhoto] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [titleColor, setTitleColor] = useState<string>("#000000");
  const [buttonText, setButtonText] = useState<string>("");
  const [buttonColor, setButtonColor] = useState<string>("#000000");
  const [redirectLink, setRedirectLink] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionColor, setDescriptionColor] = useState<string>("#000000");
  const [isBlank, setIsBlank] = useState<boolean>(false);
  const [showOnWebSite, setShowOnWebSite] = useState<boolean>(false);
  const [showOnMobileWeb, setShowOnMobileWeb] = useState<boolean>(false);
  const [showOnApp, setShowOnApp] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const directToCorrectPage = useCallback(() => {
    switch (sliderType) {
      case 1:
        return history.push('/anasayfa-slider-listesi-eski')
      case 2:
        return history.push('/profesyonel-slider-listesi');
      case 3:
        return history.push('/anasayfa-slider-listesi');
      case 4:
        return history.push('/pro-panel-slider-listesi');
      case 5:
        return history.push('/seller-panel-slider-listesi');
      default:
        return;
    }
  }, [sliderType, history]);

  const getSliderDetail = useCallback(async () => {
    setLoading(true);
    const response = await ApiService.getSliderDetail(sliderId);
    setLoading(false);

    if (response.succeeded) {
      setDisplayOrder(response.data.OrderBy);
      setOldSliderPhoto(response.data.PhotoUrl);
      setTitle(response.data.Title);
      setTitleColor(response.data.TitleColor);
      setButtonText(response.data.ButtonText);
      setButtonColor(response.data.ButtonTextColor);
      setRedirectLink(response.data.RedirectLink);
      setDescription(response.data.Description);
      setDescriptionColor(response.data.DescriptionColor);
      setIsBlank(response.data.IsBlank);
      setShowOnWebSite(response.data.ShowOnWebsite);
      setShowOnMobileWeb(response.data.ShowOnMobilWeb);
      setShowOnApp(response.data.ShowOnApp);
      setIsEnabled(response.data.IsEnabled);
      setSliderType(response.data.SliderType)
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          directToCorrectPage();
        }
      });
    }
  }, [context, sliderId, directToCorrectPage]);

  useEffect(() => {
    getSliderDetail();
  }, [])

  const updateSlider = useCallback(async () => {
    setProcessLoading(true);
    const response = await ApiService.updateSlider(
        sliderId, displayOrder, selectedSliderPhoto, title,
        titleColor, buttonText, buttonColor, redirectLink,
        description, descriptionColor, isBlank, showOnWebSite,
        showOnMobileWeb, showOnApp, isEnabled
    );
    setProcessLoading(false);

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: "Slider başarıyla güncellendi",
        onClose: () => {
          context.hideModal();
          directToCorrectPage();
        }
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal(),
      });
    }
  }, [
    context, directToCorrectPage, sliderId,
    displayOrder, selectedSliderPhoto, title, titleColor, buttonText,
    buttonColor, redirectLink, description, descriptionColor, isBlank,
    showOnWebSite, showOnMobileWeb, showOnApp, isEnabled
  ]);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-5 border-b">Slider Düzenle</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <Label className="mt-6" title="Gösterim Sırası" withoutDots isRequired />
            <input className={loading ? "loading-input-sm" : "form-input"} type="number" value={displayOrder} onChange={(e) => { setDisplayOrder(parseInt(e.target.value)); }} />
            <Label className="mt-6" title="Slider Görseli" withoutDots isRequired />
            <div className="mb-2">
              <FileUploader oldPreview={oldSliderPhoto} isTriangle onFileSelected={item => { setSelectedSliderPhoto(item) }} isLoading={loading} warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."} sizeDescription={sliderType === 5 ? "1920x314 px" : sliderType == 4 ? "1920x314 px" : sliderType === 3 ? "950x302 px" : sliderType === 2 ? "1270x248 px" : sliderType === 1 ? "1270x352 px" : ""} />
            </div>
            <Label className="mt-6" title="Başlık" withoutDots />
            <div className="flex items-center">
              <input className={loading ? "loading-input-sm" : "form-input"} type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
              <input type="color" className="border bg-white w-10 h-10 p-2 rounded-lg ml-3" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} />
            </div>
            <Label className="mt-6" title="Buton Başlığı" withoutDots />
            <div className="flex items-center">
              <input className={loading ? "loading-input-sm" : "form-input"} type="text" value={buttonText} onChange={(e) => { setButtonText(e.target.value); }} />
              <input type="color" className="border bg-white w-10 h-10 p-2 rounded-lg ml-3" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} />
            </div>
            <Label className="mt-6" title="Yönlendirme Linki" withoutDots />
            <input className={loading ? "loading-input-sm" : "form-input"} type="text" value={redirectLink} onChange={(e) => { setRedirectLink(e.target.value); }} />
            <Label className="mt-6" title="Açıklama Metni" withoutDots />
            <div className="flex items-center">
              <input className={loading ? "loading-input-sm" : "form-input"} type="text" value={description} onChange={(e) => { setDescription(e.target.value); }} />
              <input type="color" className="border bg-white w-10 h-10 p-2 rounded-lg ml-3" value={descriptionColor} onChange={(e) => setDescriptionColor(e.target.value)} />
            </div>
            <div className="text-black-400 text-sm py-1.5 font-medium flex justify-between my-4 lg:flex-row flex-col">
              Yeni Sekmede Aç
              <ToggleButton loading={loading} defaultValue={isBlank} onClick={() => { setIsBlank(!isBlank) }} />
            </div>
            <div className="text-black-400 text-sm py-1.5 font-medium flex justify-between my-4 lg:flex-row flex-col">
              Web sitesinde göster
              <ToggleButton loading={loading} defaultValue={showOnWebSite} onClick={() => { setShowOnWebSite(!showOnWebSite) }} />
            </div>
            <div className="text-black-400 text-sm py-1.5 font-medium flex justify-between my-4 lg:flex-row flex-col">
              Mobil Web sitesinde göster
              <ToggleButton loading={loading} defaultValue={showOnMobileWeb} onClick={() => { setShowOnMobileWeb(!showOnMobileWeb) }} />
            </div>
            {sliderType !== 3 &&
              <div className="text-black-400 text-sm py-1.5 font-medium flex justify-between my-4 lg:flex-row flex-col">
                Mobil uygulamada göster
                <ToggleButton loading={loading} defaultValue={showOnApp} onClick={() => { setShowOnApp(!showOnApp) }} />
              </div>
            }
            <div className="text-black-400 text-sm py-1.5 font-medium flex justify-between my-4 lg:flex-row flex-col">
              Aktif olarak göster
              <ToggleButton loading={loading} defaultValue={isEnabled} onClick={() => { setIsEnabled(!isEnabled) }} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex">
              <Button textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400"
                      onClick={directToCorrectPage}/>
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400"
                      text="Kaydet ve Tamamla" onClick={updateSlider}/>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
