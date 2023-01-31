import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropzone } from "../Components/Dropzone";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { TextArea } from "../Components/TextArea";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { SERVICES } from "../Services/Constants";
import { ImageCropperDropZone } from "../Components/ImageCropper/ImageCropperDropZone";

interface RouteParams {
  id: string,
}

export const GeneralCommentEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(true);

  const [contentId, setContentId] = useState<number>(Number(params?.id ?? "0"));

  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [name, setName] = useState<string>("");

  const [position, setPosition] = useState<string>("");

  const [firmName, setFirmName] = useState<string>("");

  const [order, setOrder] = useState<number>(0);

  const [description, setDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (contentId > 0) {
      getTestimonialDetail();
    }
    else {
      setLoading(false);
      setProcessLoading(false);
    }
  }, [contentId]);

  const getTestimonialDetail = async () => {

    const _result = await ApiService.getTestimonialDetail(contentId);

    if (_result.succeeded === true) {

      setPhotoUrl(_result.data.PhotoUrl);
      setName(_result.data.NameSurname);
      setPosition(_result.data.Title);
      setFirmName(_result.data.CompanyName);
      setOrder(_result.data.OrderBy);
      setDescription(_result.data.Description);
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
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/3"); }
      });
    }
  }

  const createTestimonial = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createTestimonial(photoUrl, order, name, firmName, position, description, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/3"); }
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

  const updateTestimonial = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateTestimonial(contentId, photoUrl, order, name, firmName, position, description, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/3"); }
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
        <h2 className="pb-4 border-b border-gray-200">{contentId > 0 ? "Kullanıcı Yorumu Düzenle" : "Yeni Kullanıcı Yorumu Oluştur"}</h2>
        <div className="w-1/2">
          <Label className="mt-6" title="Görsel" withoutDots isRequired />
          <ImageCropperDropZone
            accept={["image"]}
            isLoading={loading}
            addFiles={addFile}
            maxFileSizeAsMB={5}
            uploadUrl={SERVICES.API_ADMIN_GENERAL_URL + "/upload-general-content-media"}
            maxFileCount={1}
            oldPreview={photoUrl}
            oldPreviewUpdate={setPhotoUrl}
          />
          <Label className="mt-6" title="İsim Soyisim" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={name} onChange={(e) => { setName(e.target.value); }} />
          }
          <Label className="mt-6" title="Ünvan / Pozisyon" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={position} onChange={(e) => { setPosition(e.target.value); }} />
          }
          <Label className="mt-6" title="Firma" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={firmName} onChange={(e) => { setFirmName(e.target.value); }} />
          }
          <Label className="mt-6" title="Gösterim Sırası" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)); }} />
          }
          <Label className="mt-6" title="Açıklama" withoutDots isRequired />
          {
            loading ?
              <Loading inputMd />
              :
              <TextArea
                setText={setDescription}
                text={description}
                placeholder="Açıklama giriniz..."
                maxCount={200}
              />
          }
          {
            loading ?
              <Loading textMd />
              :
              <div className="flex mt-6  align-items-center">
                <div className="text-gray-900 text-sm font-medium">Aktif olarak göster</div>
                <div className="ml-auto">
                  <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
                </div>
              </div>
          }
        </div>
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/genel-anasayfa-icerikleri/3"); }} />
          {
            contentId > 0 ?
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateTestimonial(); }} />
              :
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createTestimonial(); }} />
          }
        </div>
      </div>
    </div>
  )
}
