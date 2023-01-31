import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { useHistory } from "react-router";
import { SiteUserAddressModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { EditIcon, TrashIcon } from "../../Components/Icons";
import { Loading } from "../../Components/Loading";
import { EmptyList } from "../../Components/EmptyList";
import { Modal } from "../../Components/Modal";
import { Label } from "../../Components/Label";
import { Dropdown } from "../../Components/Dropdown";
import { PhoneInput, PhoneResultModel } from "../../Components/PhoneInput";
import { Button } from "../../Components/Button";
import { useStateEffect } from "../../Components/UseStateEffect";

interface RegisteredAdressesProps {
  UserId: number,
}

export const RegisteredAdresses: FunctionComponent<RegisteredAdressesProps> = (props: RegisteredAdressesProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [adressList, setAdressList] = useState<SiteUserAddressModel[]>([]);

  const [modalAddressId, setModalAddressId] = useState<number>(0);

  const [modalAddressTitle, setModalAddressTitle] = useState<string>("");

  const [modalAddressPhone, setModalAddressPhone] = useState<PhoneResultModel>();

  const [modalAddressZipCode, setModalAddressZipCode] = useState<string>("");

  const [modalAddressDescription, setModalAddressDescription] = useState<string>("");

  const [modalAddressCountryId, setModalAddressCountryId] = useState<number>(0);

  const [modalAddressCityId, setModalAddressCityId] = useState<number>(0);

  const [modalAddressDistrictId, setModalAddressDistrictId] = useState<number>(0);

  const [showAddressUpdateModal, setShowAddressUpdateModal] = useState<boolean>(false);

  const [countryOptions, setCountryOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedCountryOption, setCountryOption] = useState<{ key: string, value: string }>({ key: "0", value: "Ülke" });

  const [cityOptions, setCityOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedCityOption, setCityOption] = useState<{ key: string, value: string }>({ key: "0", value: "Şehir" });

  const [districtOptions, setDistrictOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "İlçe" }]);

  const [selectedDistrictOption, setDistrictOption] = useState<{ key: string, value: string }>({ key: "0", value: "İlçe" });

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const phoneInputRef = useRef<any>();

  useEffect(() => {
    getUserAddressListForAdmin();
  }, []);

  useStateEffect(() => {
    setCountryOption(countryOptions.find(x => x.key === (modalAddressCountryId ?? 0).toString()) ?? { key: "0", value: "Ülke" });
  }, [countryOptions]);

  useEffect(() => {
    getCityList();
  }, [selectedCountryOption]);

  useStateEffect(() => {
    setCityOption(cityOptions.find(x => x.key === (modalAddressCityId ?? 0).toString()) ?? { key: "0", value: "İl" });
  }, [cityOptions]);

  useStateEffect(() => {
    getDistrictList();
  }, [selectedCityOption]);

  useStateEffect(() => {
    setDistrictOption(districtOptions.find(x => x.key === (modalAddressDistrictId ?? 0).toString()) ?? { key: "0", value: "İlçe" });
  }, [districtOptions]);

  const getCountryList = async () => {
    const _result = await ApiService.getCountryList();
    let _tempCountryList: { key: string, value: string }[] = [];
    _result.map((item) => {
      _tempCountryList.push({ key: item.id.toString(), value: item.name })
    });
    setCountryOptions(JSON.parse(JSON.stringify(_tempCountryList)));
  }

  const getCityList = async () => {
    if (selectedCountryOption.key === "0") {
      return;
    }
    const _result = await ApiService.getCityList(selectedCountryOption.key);
    let _tempCityList: { key: string, value: string }[] = [];
    _result.map((item) => {
      _tempCityList.push({ key: item.id.toString(), value: item.name })
    });
    setCityOptions(JSON.parse(JSON.stringify(_tempCityList)));
  }

  const getDistrictList = async () => {
    if (selectedCityOption.key === "0") {
      return;
    }
    const _result = await ApiService.getDistrictList(selectedCityOption.key);
    let _tempDistrictList: { key: string, value: string }[] = [];
    _result.map((item) => {
      _tempDistrictList.push({ key: item.id.toString(), value: item.name })
    });
    setDistrictOptions(JSON.parse(JSON.stringify(_tempDistrictList)));
  }

  const getUserAddressListForAdmin = async () => {
    setLoading(true);

    const _result = await ApiService.getUserAddressListForAdmin(props.UserId);

    if (_result.succeeded === true) {
      setAdressList(_result.data);
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

  const handleOpenAddressUpdateModal = (item: SiteUserAddressModel) => {

    setModalAddressId(item.Id);
    setModalAddressTitle(item.AddressName);
    setModalAddressPhone({ purePhone: "", maskedPhone: "", phone: item.Phone, phonePreview: "", pureCountryCode: "", previewCountryCode: "" });
    setModalAddressZipCode(item.ZipCode);
    setModalAddressDescription(item.AddressDescription);
    setModalAddressCountryId(item.CountryId);
    setModalAddressCityId(item.CityId);
    setModalAddressDistrictId(item.DistrictId);

    getCountryList();

    setShowAddressUpdateModal(true);
  }

  const updateUserAddress = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateUserAddress(props.UserId, modalAddressId, modalAddressCountryId, modalAddressDistrictId, modalAddressCityId, modalAddressZipCode, modalAddressDescription, modalAddressTitle, (modalAddressPhone?.phone ?? ""));

    setProcessLoading(false);
    setShowAddressUpdateModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi",
        onClose: () => { context.hideModal(); getUserAddressListForAdmin(); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setShowAddressUpdateModal(true); }
      });
    }
  }

  const deleteUserAddress = (item) => {
    context.showModal({
      type: "Question",
      title: "Sil",
      message: "Üyenin adresi silinecek. Emin misiniz?",
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.deleteUserAddress(props.UserId, item.Id);

        setProcessLoading(false);
        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Adres silindi",
            onClose: () => {
              context.hideModal();
              getUserAddressListForAdmin();
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
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  return (
    <>
      <div className="py-4 grid grid-cols-2 gap-4">
        {
          loading ?
            <>
              <div className="col-span-1">
                <Loading width="w-full" height="h-36" />
              </div>
              <div className="col-span-1">
                <Loading width="w-full" height="h-36" />
              </div>
              <div className="col-span-1">
                <Loading width="w-full" height="h-36" />
              </div>
              <div className="col-span-1">
                <Loading width="w-full" height="h-36" />
              </div>
              <div className="col-span-1">
                <Loading width="w-full" height="h-36" />
              </div>
              <div className="col-span-1">
                <Loading width="w-full" height="h-36" />
              </div>
            </>
            :
            <>
              {
                adressList.length > 0 ?
                  adressList.map((item, index) => (
                    <div key={"adressCard_" + index} className="bg-gray-100 p-4 rounded-lg col-span-1">
                      <div className="flex items-center gap-2">
                        <div className="text-tiny text-black-400 font-medium">{item.AddressName}</div>
                        <div className="text-xs text-gray-700">/</div>
                        <div className="text-gray-900 text-sm">{item.PhonePreview}</div>
                        <div className="ml-auto flex gap-2 items-center">
                          <EditIcon className="icon-sm text-gray-900 hover:text-blue-400 transform duration-300 cursor-pointer" onClick={() => { handleOpenAddressUpdateModal(item); }} />
                          <TrashIcon className="icon-sm text-gray-900 hover:text-blue-400 transform duration-300 cursor-pointer" onClick={() => { deleteUserAddress(item); }} />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-900">{item.AddressDescription}</div>
                      <div className="mt-2 flex gap-2 items-center text-sm text-gray-900">
                        <div>{item.District}</div>
                        <div className="text-xs text-gray-700">/</div>
                        <div>{item.City}</div>
                        <div className="text-xs text-gray-700">/</div>
                        <div>{item.Country}</div>
                      </div>
                      <div className="mt-2 text-sm text-gray-900">{item.ZipCode}</div>
                    </div>
                  ))
                  :
                  <EmptyList text="Kayıtlı Adres Bulunamadı" />
              }
            </>

        }
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showAddressUpdateModal}
        onClose={() => { setShowAddressUpdateModal(false); }}
        title="Adres Düzenle"
        body={
          <div >
            <div className="flex gap-2 ">
              <div className="w-1/2">
                <Label isRequired withoutDots title="Adres Başlığı" className="mt-4" />
                <input className="form-input" value={modalAddressTitle} onChange={(e) => { setModalAddressTitle(e.target.value); }} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Ülke" className="mt-4" />
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "selectCountryType"}
                  onClick={() => { setCurrentOpenedFilterButton("selectCountryType"); }}
                  className="w-full text-gray-900 border-gray-400 mb-2 lg:mb-0"
                  classNameDropdown="h-40 overflow-y-auto custom-scrollbar"
                  label={selectedCountryOption.value}
                  icon
                  isDisabled={true}
                  items={countryOptions}
                  onItemSelected={item => { setCountryOption(item); }} />
              </div>
            </div>
            <div className="flex gap-2 ">
              <div className="w-1/2">
                <Label isRequired withoutDots title="İl" className="mt-4" />
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "selectCityType"}
                  onClick={() => { setCurrentOpenedFilterButton("selectCityType"); }}
                  className="w-full text-gray-900 border-gray-400 mb-2 lg:mb-0"
                  classNameDropdown="h-40 overflow-y-auto custom-scrollbar"
                  label={selectedCityOption.value}
                  icon
                  items={cityOptions}
                  onItemSelected={item => { setCityOption(item); }} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="İlçe" className="mt-4" />
                <Dropdown
                  isDropDownOpen={currentOpenedFilterButton === "selectDistrictType"}
                  onClick={() => { setCurrentOpenedFilterButton("selectDistrictType"); }}
                  className="w-full text-gray-900 border-gray-400 mb-2 lg:mb-0"
                  classNameDropdown="h-40 overflow-y-auto custom-scrollbar"
                  label={selectedDistrictOption.value}
                  icon
                  items={districtOptions}
                  onItemSelected={item => { setDistrictOption(item); }} />
              </div>
            </div>
            <div className="flex gap-2 ">
              <div className="w-1/2">
                <Label isRequired withoutDots title="Telefon Numarası" className="mt-4" />
                <PhoneInput ref={phoneInputRef} onChange={setModalAddressPhone} initValue={modalAddressPhone?.phone} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Posta Kodu" className="mt-4" />
                <input className="form-input" type="text" value={modalAddressZipCode} onChange={(e) => { setModalAddressZipCode(e.target.value); }} />
              </div>
            </div>
            <div className="w-full">
              <Label withoutDots title="Açık Adres" className="mt-4" />
              <input className="form-input" type="text" value={modalAddressDescription} onChange={(e) => { setModalAddressDescription(e.target.value); }} />
            </div>
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { updateUserAddress(); }}></Button>
        }
      />
    </>
  )
}
