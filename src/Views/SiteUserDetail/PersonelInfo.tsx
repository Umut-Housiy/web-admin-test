import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router";
import { Button } from "../../Components/Button";
import { DatePicker } from "../../Components/DatePicker";
import { Dropdown } from "../../Components/Dropdown";
import { ImgUploader } from "../../Components/ImgUploader";
import { Label } from "../../Components/Label";
import { Loading } from "../../Components/Loading";
import { PhoneInput, PhoneResultModel } from "../../Components/PhoneInput";
import { useStateEffect } from "../../Components/UseStateEffect";
import { SiteUserModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

interface PersonalInfoProps {
  UserId: number,
  IsEditActive: boolean,
  setIsEditActive: (e: boolean) => void,
  isBlocked: boolean,
  setIsBlocked: (e: boolean) => void
}

export const PersonalInfo: FunctionComponent<PersonalInfoProps> = (props: PersonalInfoProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [userDetail, setUserDetail] = useState<SiteUserModel>();

  const [oldPhoto, setOldPhoto] = useState<string>("");

  const [newPhoto, setNewPhoto] = useState<File | undefined>();

  const [nameSurname, setNameSurname] = useState<string>("");

  const [email, setEmail] = useState<string>("");

  const phoneInputRef = useRef<any>();

  const [phone, setPhone] = useState<PhoneResultModel>();

  const [birthDate, setBirthDate] = useState<Date>();

  const [genderOptions, setGenderOptions] = useState<{ key: string, value: string }[]>([
    { key: "1", value: "Kadın" },
    { key: "2", value: "Erkek" },
    { key: "3", value: "Belirtmek İstemiyorum" }
  ]);

  const [selectedGenderOption, setSelectedGenderOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  useEffect(() => {
    getUserDetailForAdmin();
  }, []);

  useStateEffect(() => {
    setCurrentOpenedFilterButton("");
  }, [props.IsEditActive]);

  const getUserDetailForAdmin = async () => {
    setLoading(true);

    const _result = await ApiService.getUserDetailForAdmin(props.UserId);

    if (_result.succeeded === true) {
      props.setIsBlocked(_result.data.IsBlocked);
      setUserDetail(_result.data);
      setOldPhoto(_result.data.UserPhoto ?? "");
      setNameSurname(_result.data.NameSurname);
      setEmail(_result.data.Email);
      setPhone({ purePhone: "", maskedPhone: "", phone: _result.data.Phone, phonePreview: "", pureCountryCode: "", previewCountryCode: "" });
      setBirthDate(new Date(_result.data.BirthDateJS));
      setSelectedGenderOption(genderOptions.find(x => x.key === String(_result.data.Gender)) ?? { key: "0", value: "Seçiniz" });
      setLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); history.push("/uye-listesi"); }
      });
    }
  }

  const updateUserForAdmin = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateUserForAdmin(props.UserId, newPhoto, (birthDate?.getTime() ?? 0), nameSurname, (phone?.phone ?? ""), email, Number(selectedGenderOption.key));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi",
        onClose: () => { context.hideModal(); handleCancelEdit(); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); history.push("/uye-listesi"); }
      });
    }
  }

  const handleCancelEdit = () => {
    getUserDetailForAdmin();
    props.setIsEditActive(false);
  }

  const handleJsDate = (JsTime) => {
    try {
      if (JsTime < 0) {
        return "-";
      }
      else {
        var time = new Date(JsTime);
        return time.toLocaleDateString() ?? "";
      }
    }
    catch {
      return ""
    }
  }


  return (
    <div>
      {
        loading ?
          <Loading width="w-full" height="h-12" />
          :
          <div className="py-4 border-b border-gray-200 flex items-center gap-2">
            <div className="w-1/6 flex items-center justify-between text-sm text-gray-700">
              <div>Üyelik Tarihi</div><div>:</div>
            </div>
            <div className="text-sm text-gray-900 font-medium">{handleJsDate(userDetail?.CreatedDateJS)}</div>
          </div>
      }
      <div className="w-1/2">
        <h2 className="my-4">Profil Bİlgileri</h2>
        <ImgUploader disabled={!props.IsEditActive} isLoading={loading} className="my-4" oldPreview={oldPhoto} onFileSelected={item => { setNewPhoto(item) }} oldPreviewUpdate={setOldPhoto} />
        <Label className="mt-4" title="İsim Soyisim" withoutDots />
        {
          loading ?
            <Loading inputSm />
            :
            <input disabled={!props.IsEditActive} className={`${!props.IsEditActive ? "bg-gray-100" : ""} form-input`} type="text" placeholder="İsim Soyisim" value={nameSurname} onChange={(e) => { setNameSurname(e.target.value); }} />
        }
        <Label className="mt-4" title="E-posta" withoutDots />
        {
          loading ?
            <Loading inputSm />
            :
            <input disabled={!props.IsEditActive} className={`${!props.IsEditActive ? "bg-gray-100" : ""} form-input`} type="text" placeholder="İsim Soyisim" value={email} onChange={(e) => { setEmail(e.target.value); }} />
        }
        <Label className="mt-4" title="Telefon Numarası" withoutDots />
        {
          loading ?
            <Loading inputSm />
            :
            <PhoneInput disabled={!props.IsEditActive} ref={phoneInputRef} onChange={setPhone} initValue={phone?.phone} />
        }
        <Label className="mt-4" title="Doğum Tarihi" withoutDots />
        {
          loading ?
            <Loading inputSm />
            :
            <DatePicker
              isBirthDate
              maxDate={new Date()}
              disabled={!props.IsEditActive}
              isFull
              value={birthDate}
              setSelectedDate={(e) => { setBirthDate(e) }}
            />
        }
        <Label className="mt-4" title="Cinsiyet" withoutDots />
        {
          loading ?
            <Loading inputSm />
            :
            <Dropdown
              isDropDownOpen={currentOpenedFilterButton === "gender"}
              onClick={() => { setCurrentOpenedFilterButton("gender"); }}
              label={selectedGenderOption.value}
              items={genderOptions}
              isDisabled={!props.IsEditActive}
              onItemSelected={item => { setSelectedGenderOption(item) }}
            />
        }
      </div>
      {
        props.IsEditActive &&
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { handleCancelEdit(); }} />
          <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateUserForAdmin(); }} />
        </div>
      }
    </div>
  )
}
