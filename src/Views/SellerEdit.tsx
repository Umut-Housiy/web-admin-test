import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { AlertIcon, CheckIcon, EditIcon, TrashIcon } from "../Components/Icons"
import { TabsTitle } from "../Components/TabsTitle";
import { Image } from "../Components/Image";
import { SellerAddressModel, SellerContactModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Loading } from "../Components/Loading";
import { Modal } from "../Components/Modal";
import { Label } from "../Components/Label";
import { PhoneInput, PhoneResultModel } from "../Components/PhoneInput";
import { useStateEffect } from "../Components/UseStateEffect";
import { InputWithMask } from "../Components/InputWithMask";
import { ToggleButton } from "../Components/ToggleButton";

interface RouteParams {
  id: string
}

export const SellerEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const tabsLink = [
    { id: 1, name: "Mağaza Bilgisi" },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showAddressUpdateModal, setShowAddressUpdateModal] = useState<boolean>(false);

  const [showSetAddressModal, setShowSetUpdateModal] = useState<boolean>(false);

  const [showUpdateContactModal, setShowUpdateContactModal] = useState<boolean>(false);

  const [modalAddressId, setModalAddressId] = useState<number>(0);

  const [modalAddressTitle, setModalAddressTitle] = useState<string>("");

  const [modalAddressPhone, setModalAddressPhone] = useState<PhoneResultModel>();

  const phoneInputModalRef = useRef<any>();

  const [modalAddressZipCode, setModalAddressZipCode] = useState<string>("");

  const [modalAddressDescription, setModalAddressDescription] = useState<string>("");

  const [modalAddressCountryId, setModalAddressCountryId] = useState<number>(0);

  const [modalAddressCityId, setModalAddressCityId] = useState<number>(0);

  const [modalAddressDistrictId, setModalAddressDistrictId] = useState<number>(0);

  const [addressSetModalId, setAddressSetModalId] = useState<number>(0);

  const [addressSetModalType, setAddressSetModalType] = useState<number>(0);


  //#region TAB 1
  const [logo, setLogo] = useState<string>("");

  const [ownerName, setOwnerName] = useState<string>("");

  const [emailAddress, setEmailAddress] = useState<string>("");

  const [contactNumber, setContactNumber] = useState<PhoneResultModel>();

  const [storeName, setStoreName] = useState<string>("");

  const firmTypeOptions = [
    { key: "1", value: "Anonim Şirket" },
    { key: "2", value: "Şahıs Şirketi" },
    { key: "3", value: "Limited Şirket" },
    { key: "4", value: "Kolektif Şirket" },
    { key: "5", value: "Kooperatif Şirket" },
    { key: "6", value: "Adi Ortaklık" },
  ];

  const [selectedFirmTypeOption, setSelectedFirmTypeOption] = useState<{ key: string, value: string }>({ key: "0", value: "Firma Tipi" });

  const [taxNumber, setTaxNumber] = useState<string>("");

  const [companyTitle, setCompanyTitle] = useState<string>("");

  const [sellerId, setSellerId] = useState<string>("");

  const [taxDepartment, setTaxDepartment] = useState<string>("");

  const [kepAddress, setKepAddress] = useState<string>("");

  const [mersisNumber, setMersisNumber] = useState<string>("");

  const [citizenshipNumber, setCitizenshipNumber] = useState<string>("");

  const [defaultContact, setDefaultContact] = useState<SellerContactModel>();

  const [defaultContactTitle, setDefaultContactTitle] = useState<string>("");

  const [defaultContactName, setDefaultContactName] = useState<string>("");

  const [defaultContactEmail, setDefaultContactEmail] = useState<string>("");

  const [defaultContactPhone, setDefaultContactPhone] = useState<PhoneResultModel>();

  const phoneInputRef = useRef<any>();

  const [defaultContactDescription, setDefaultContactDescription] = useState<string>("");

  const [accountOwnerName, setAccountOwnerName] = useState<string>("");

  const [bankOptions, setBankOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "Banka" }]);

  const [selectedBankOption, setSelectedBankOption] = useState<{ key: string, value: string }>({ key: "0", value: "Banka" });

  const [iban, setIban] = useState<string>("");

  const [bankBranchName, setBankBranchName] = useState<string>("");

  const [bankBranchCode, setBankBranchCode] = useState<string>("");

  const [accountNumber, setAccountNumber] = useState<string>("");

  const [sellerAddresses, setSellerAdresses] = useState<SellerAddressModel[]>([]);

  const [countryOptions, setCountryOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "Ülke" }]);

  const [selectedCountryOption, setCountryOption] = useState<{ key: string, value: string }>({ key: "0", value: "Ülke" });

  const [cityOptions, setCityOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "Şehir" }]);

  const [selectedCityOption, setCityOption] = useState<{ key: string, value: string }>({ key: "0", value: "Şehir" });

  const [districtOptions, setDistrictOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "İlçe" }]);

  const [selectedDistrictOption, setDistrictOption] = useState<{ key: string, value: string }>({ key: "0", value: "İlçe" });

  const [billAddressId, setBillAddressId] = useState<number>(0);

  const [refundAddressId, setRefundAddressId] = useState<number>(0);

  const [shippingAddressId, setShippingAddressId] = useState<number>(0);

  const [canSendPrivateCargo, setCanSendPrivateCargo] = useState<boolean>(false);

  //#endregion

  useEffect(() => {
    getBankList();
    getCountryList();
  }, []);

  useStateEffect(() => {
    getSellerDetail();
  }, [bankOptions]);

  useEffect(() => {
    setCountryOption(countryOptions.find(x => x.key === (modalAddressCountryId ?? 0).toString()) ?? { key: "0", value: "Ülke" });
  }, [countryOptions]);

  useStateEffect(() => {
    getCityList();
  }, [selectedCountryOption]);

  useEffect(() => {
    setCityOption(cityOptions.find(x => x.key === (modalAddressCityId ?? 0).toString()) ?? { key: "0", value: "İl" });
  }, [cityOptions]);

  useStateEffect(() => {
    getDistrictList();
  }, [selectedCityOption]);

  useEffect(() => {
    setDistrictOption(districtOptions.find(x => x.key === (modalAddressDistrictId ?? 0).toString()) ?? { key: "0", value: "İlçe" });
  }, [districtOptions]);

  useEffect(() => {
    setCurrentOpenedFilterButton("");
  }, [showSetAddressModal, showUpdateContactModal, showAddressUpdateModal]);

  const getBankList = async () => {
    const _result = await ApiService.getBankList();
    let _tempBankList = [{ key: "0", value: "Banka" }];
    _result.map((item) => {
      _tempBankList.push({ key: item.Id, value: item.Name })
    });
    setBankOptions(JSON.parse(JSON.stringify(_tempBankList)));
  }

  const getCountryList = async () => {
    const _result = await ApiService.getCountryList();
    let _tempCountryList = [{ key: "0", value: "Ülke" }];
    _result.map((item) => {
      _tempCountryList.push({ key: item.id.toString(), value: item.name })
    });
    setCountryOptions(JSON.parse(JSON.stringify(_tempCountryList)));
  }

  const getCityList = async () => {
    const _result = await ApiService.getCityList(selectedCountryOption.key);
    let _tempCityList = [{ key: "0", value: "İl" }];
    _result.map((item) => {
      _tempCityList.push({ key: item.id.toString(), value: item.name })
    });
    setCityOptions(JSON.parse(JSON.stringify(_tempCityList)));
  }

  const getDistrictList = async () => {
    const _result = await ApiService.getDistrictList(selectedCityOption.key);
    let _tempDistrictList = [{ key: "0", value: "İlçe" }];
    _result.map((item) => {
      _tempDistrictList.push({ key: item.id.toString(), value: item.name })
    });
    setDistrictOptions(JSON.parse(JSON.stringify(_tempDistrictList)));
  }

  const getSellerDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getSellerDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {

      setLogo(_result.data.Logo ?? "");
      setOwnerName(_result.data.NameSurname ?? "-");
      setEmailAddress(_result.data.Email ?? "-");
      setContactNumber({ purePhone: "", maskedPhone: "", phone: _result.data.Phone ?? "", phonePreview: "", pureCountryCode: "", previewCountryCode: "" });
      setStoreName(_result.data.StoreName ?? "-");
      setSelectedFirmTypeOption(firmTypeOptions.find(x => x.key === _result.data.CompanyType.toString()) ?? { key: "0", value: "Firma Tipi" });
      setTaxNumber(_result.data.TaxNumber ?? "-");
      setCompanyTitle(_result.data.CompanyTitle ?? "-");
      setSellerId(_result.data.Id.toString());
      setCitizenshipNumber(_result.data.CitizenshipNumber);
      setTaxDepartment(_result.data.TaxDepartment ?? "-");
      setKepAddress(_result.data.KepAddress ?? "-");
      setMersisNumber(_result.data.MersisNumber ?? "-");
      setCanSendPrivateCargo(_result.data.CanCreateIndividualCargo);

      setDefaultContact(_result.data.ContactList[0]);
      setDefaultContactTitle(_result.data.ContactList[0]?.Title ?? "-");
      setDefaultContactName(_result.data.ContactList[0]?.NameSurname ?? "-");
      setDefaultContactEmail(_result.data.ContactList[0]?.Email ?? "-");
      setDefaultContactPhone({ purePhone: "", maskedPhone: "", phone: _result.data.ContactList[0]?.Phone ?? "", phonePreview: "", pureCountryCode: "", previewCountryCode: "" });

      setDefaultContactDescription(_result.data.ContactList[0]?.Description ?? "-");

      setAccountOwnerName(_result.data.BankInfo.NameSurname);
      setIban(_result.data.BankInfo.IBAN ?? "-");
      setSelectedBankOption(bankOptions.find(x => x.key === _result.data.BankInfo.BankId.toString()) ?? { key: "0", value: "Banka" });
      setBankBranchName(_result.data.BankInfo.BranchName ?? "-");
      setBankBranchCode(_result.data.BankInfo.BranchCode ?? "-");
      setAccountNumber(_result.data.BankInfo.AccountNumber ?? "-");

      setBillAddressId(_result.data.BillAddressId);
      setRefundAddressId(_result.data.RefundsAddressId);
      setShippingAddressId(_result.data.ShippingAddressId);

      setSellerAdresses(_result.data.AddressList);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/onayli-satici-listesi"); }
      });
    }
  }

  const updateSellerDetail = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSeller(Number(params.id ?? "0"), ownerName, storeName, emailAddress, contactNumber?.phone ?? "", Number(selectedFirmTypeOption.key ?? "0"), taxDepartment, taxNumber, citizenshipNumber, companyTitle, kepAddress, mersisNumber, accountOwnerName, iban, Number(selectedBankOption.key ?? "0"), bankBranchName, bankBranchCode, accountNumber, canSendPrivateCargo);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Satıcı başarıyla kaydedildi.",
        onClose: () => { context.hideModal(); history.push(`/satici-detay/${params.id ?? "0"}`); }
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

  const handleOpenAddressUpdateModal = (item) => {

    setModalAddressId(item.Id);
    setModalAddressTitle(item.AddressName);
    setModalAddressPhone({ purePhone: "", maskedPhone: "", phone: item.Phone, phonePreview: "", pureCountryCode: "", previewCountryCode: "" });
    setModalAddressZipCode(item.ZipCode);
    setModalAddressDescription(item.AddressDescription);
    setModalAddressCountryId(item.CountryId);
    setModalAddressCityId(item.CityId);
    setModalAddressDistrictId(item.DistrictId);

    setCountryOptions(JSON.parse(JSON.stringify(countryOptions)));

    setShowAddressUpdateModal(true);
  }

  const updateSellerAddress = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSellerAddress(modalAddressId, Number(selectedCountryOption.key ?? 0), Number(selectedDistrictOption.key ?? 0), Number(selectedCityOption.key ?? 0), modalAddressZipCode, modalAddressDescription, modalAddressTitle, modalAddressPhone?.phone ?? "");

    setProcessLoading(false);
    setShowAddressUpdateModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Adres başarıyla düzenlendi.",
        onClose: () => { context.hideModal(); getSellerDetail(); }
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

  const handleDeleteSellerAddress = (item) => {
    context.showModal({
      type: "Question",
      title: "Adres silinecek emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteSellerAddress(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Adres silindi.",
            onClose: () => { context.hideModal(); getSellerDetail(); }
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
      onClose: () => { context.hideModal(); }
    });
  }

  const changeAddressType = async () => {
    setProcessLoading(true);

    const _result = await ApiService.changeSellerAddressType(addressSetModalId, addressSetModalType);

    setProcessLoading(false);
    setShowSetUpdateModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Adres düzenlendi.",
        onClose: () => { context.hideModal(); getSellerDetail(); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setShowSetUpdateModal(true); }
      });
    }
  }

  const handleShowAddressSetModal = (addressType) => {
    setAddressSetModalType(addressType);
    if (addressType === 1) {
      setAddressSetModalId(sellerAddresses.find(x => x.Id === billAddressId)?.Id ?? 0)
    }
    else if (addressType === 2) {
      setAddressSetModalId(sellerAddresses.find(x => x.Id === shippingAddressId)?.Id ?? 0)
    }
    else if (addressType === 3) {
      setAddressSetModalId(sellerAddresses.find(x => x.Id === refundAddressId)?.Id ?? 0)
    }
    else {
      setAddressSetModalId(0);
    }
    setShowSetUpdateModal(true);
  }

  const handleCloseUpdateContactModal = () => {
    setDefaultContactTitle(defaultContact?.Title ?? "-");
    setDefaultContactName(defaultContact?.NameSurname ?? "-");
    setDefaultContactEmail(defaultContact?.Email ?? "-");
    setDefaultContactPhone({ purePhone: "", maskedPhone: "", phone: defaultContact?.Phone ?? "", phonePreview: "", pureCountryCode: "", previewCountryCode: "" });
    setDefaultContactDescription(defaultContact?.Description ?? "-");

    setShowUpdateContactModal(false);
  }

  const updateContact = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSellerContact((defaultContact?.Id ?? 0), defaultContactName, defaultContactEmail, defaultContactPhone?.phone ?? "", defaultContactDescription, defaultContactTitle);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İletişim bilgisi düzenlendi.",
        onClose: () => { context.hideModal(); getSellerDetail(); }
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

  const handleDeleteContact = () => {
    context.showModal({
      type: "Question",
      title: "İletişim bilgisi silinecek emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteSellerContact((defaultContact?.Id ?? 0));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İletişim bilgisi silindi.",
            onClose: () => { context.hideModal(); getSellerDetail(); }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); getSellerDetail(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); }
    });
  }

  const handleShowCancelModal = () => {
    context.showModal({
      type: "Question",
      title: "Değişiklikler Kaydedilmedi",
      message: "Devam ederseniz yaptığınız değişiklikler kaybolacaktır. Devam etmek istiyor musunuz?",
      onClick: async () => {
        context.hideModal();
        history.push(`/satici-detay/${params.id}`);
        return true;
      },
      onClose: () => { context.hideModal(); }
    });
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <div className="flex align-items-center ">
          <h2>Mağaza Bilgilerini Düzenle</h2>
        </div>
        <div className="w-full bg-gray-100 p-5 flex my-4">
          <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Değişikliklerinizi kaydediniz.</span></div>
          <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
            <Button isLoading={processLoading || loading} buttonSm textTiny className="w-24" design="button-blue-400" text="Kaydet" onClick={() => { updateSellerDetail(); }} />
            <Button isLoading={processLoading || loading} buttonSm textTiny className="w-24" design="button-gray-100" text="Vazgeç" onClick={() => { handleShowCancelModal(); }} />
          </div>
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} />
        {
          selectedTabsId === 1 ?
            <>
              <div className="border-b border-grey-400 py-4 flex gap-8">
                <div className="w-1/2">
                  <h4>Kullanıcı Bilgileri</h4>
                  {
                    loading ?
                      <Loading circle className="mt-4 h-24 w-24" />
                      :
                      <img src={logo === "" ? "https://housiystrg.blob.core.windows.net/sellermedia/avatar.png" : logo} className="mt-4 rounded-full h-24 w-24 object-cover" />
                  }
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>İsim Soyisim</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={ownerName} onChange={(e) => { setOwnerName(e.target.value) }} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>E-posta Adresi</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={emailAddress} onChange={(e) => { setEmailAddress(e.target.value) }} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>İletişim Numarası</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <PhoneInput onChange={setContactNumber} initValue={contactNumber?.phone} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Bireysel Anlaşma Yapabilir</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <ToggleButton onClick={() => { setCanSendPrivateCargo(!canSendPrivateCargo) }} defaultValue={canSendPrivateCargo} />
                        </div>
                    }
                  </div>

                </div>
                <div className="w-1/2">
                  <h4>Firma Bilgileri</h4>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Mağaza Adı</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={storeName} onChange={(e) => { setStoreName(e.target.value) }} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Şirket Türü</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <Dropdown
                            isDropDownOpen={currentOpenedFilterButton === "selectFirmType"}
                            onClick={() => { setCurrentOpenedFilterButton("selectFirmType"); }}
                            className="w-full text-gray-900 border-gray-400 mb-2 lg:mb-0"
                            classNameDropdown=""
                            label={selectedFirmTypeOption.value}
                            icon
                            items={firmTypeOptions}
                            onItemSelected={item => { setSelectedFirmTypeOption(item); }} />
                        </div>
                    }
                  </div>
                  {selectedFirmTypeOption.key === "2" &&
                    <div className="flex mt-4">
                      <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>TC No</span><span className="ml-auto text-gray-700">:</span></div>
                      {
                        loading ?
                          <Loading className="w-full ml-2" inputSm />
                          :
                          <div className="w-full ml-2">
                            <input className="form-input" type="text" value={citizenshipNumber} onChange={(e) => { setCitizenshipNumber(e.target.value) }} />
                          </div>
                      }
                    </div>
                  }
                  {selectedFirmTypeOption.key !== "2" &&

                    <>
                      <div className="flex mt-4">
                        <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Vergi Numarası</span><span className="ml-auto text-gray-700">:</span></div>
                        {
                          loading ?
                            <Loading className="w-full ml-2" inputSm />
                            :
                            <div className="w-full ml-2">
                              <input className="form-input" type="text" value={taxNumber} onChange={(e) => { setTaxNumber(e.target.value) }} />
                            </div>
                        }
                      </div>
                      <div className="flex mt-4">
                        <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Vergi Dairesi</span><span className="ml-auto text-gray-700">:</span></div>
                        {
                          loading ?
                            <Loading className="w-full ml-2" inputSm />
                            :
                            <div className="w-full ml-2">
                              <input className="form-input" type="text" value={taxDepartment} onChange={(e) => { setTaxDepartment(e.target.value) }} />
                            </div>
                        }
                      </div>
                    </>
                  }
                  {/* <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Cari Ünvan</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={companyTitle} onChange={(e) => { setCompanyTitle(e.target.value) }} />
                        </div>
                    }
                  </div> */}
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Satıcı ID</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="w-full rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm disabled-50 " type="text" value={sellerId} onChange={(e) => { setSellerId(e.target.value) }} disabled />
                        </div>
                    }
                  </div>

                  {/* <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>KEP Adresi</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={kepAddress} onChange={(e) => { setKepAddress(e.target.value) }} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Mersis Numarası</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={mersisNumber} onChange={(e) => { setMersisNumber(e.target.value) }} />
                        </div>
                    }
                  </div> */}
                </div>
              </div>
              <div className="border-b border-grey-400 py-4 flex gap-8">
                {/* <div className="w-1/2">
                  <h4>Yönetici İletişim Bilgileri</h4>
                  <h5 className="mt-4">Birincil İletişim Bilgisi</h5>
                  {
                    loading ?
                      <Loading className="mt-4" inputMd />
                      :
                      defaultContact &&
                      <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                        <div className="mb-2 flex">
                          <h5>İletişim Bilgisi #1</h5>
                          <div className="flex ml-auto text-gray-900 gap-2">
                            <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { setShowUpdateContactModal(true); }} />
                            <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteContact(); }} />
                          </div>
                        </div>
                        <div className="flex mb-2">
                          <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Görev / Ünvan:</span></div>
                          <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{defaultContact.Title}</span> </div>
                        </div>
                        <div className="flex mb-2">
                          <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>İsim Soyisim:</span></div>
                          <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{defaultContact.NameSurname}</span> </div>
                        </div>
                        <div className="flex mb-2">
                          <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>E-posta:</span></div>
                          <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{defaultContact.Email}</span> </div>
                        </div>
                        <div className="flex mb-2">
                          <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Telefon:</span></div>
                          <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{defaultContact.PhonePrewiew}</span> </div>
                        </div>
                        <div className="flex mb-2">
                          <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Oluşturulma Tarihi:</span></div>
                          <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{defaultContact.CreatedDate}</span> </div>
                        </div>
                        <div className="flex">
                          <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Açıklama:</span></div>
                          <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{defaultContact.Description}</span> </div>
                        </div>
                      </div>
                  }

                </div> */}
                <div className="w-1/2">
                  <h4>Banka Hesap Bilgileri</h4>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Hesap Sahibi / Ünvanı</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={accountOwnerName} onChange={(e) => { setAccountOwnerName(e.target.value) }} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Banka</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <Dropdown
                            isDropDownOpen={currentOpenedFilterButton === "selectBank"}
                            onClick={() => { setCurrentOpenedFilterButton("selectBank"); }}
                            className="w-full text-gray-900 border-gray-400 mb-2 lg:mb-0"
                            classNameDropdown="h-48 overflow-y-auto"
                            label={selectedBankOption.value}
                            icon
                            items={bankOptions}
                            onItemSelected={item => { setSelectedBankOption(item); }} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>IBAN</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <InputWithMask IBAN value={iban} onChange={(e) => { setIban(e.target.value) }} />
                        </div>
                    }
                  </div>
                  {/* <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Şube Adı</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={bankBranchName} onChange={(e) => { setBankBranchName(e.target.value) }} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Şube Kodu</span><span className="ml-auto text-gray-700">:</span></div>
                    {
                      loading ?
                        <Loading className="w-full ml-2" inputSm />
                        :
                        <div className="w-full ml-2">
                          <input className="form-input" type="text" value={bankBranchCode} onChange={(e) => { setBankBranchCode(e.target.value) }} />
                        </div>
                    }
                  </div>
                  <div className="flex mt-4">
                    <div className="my-auto flex text-gray-700 text-sm w-1/2"><span>Hesap No</span><span className="ml-auto text-gray-700">:</span></div>
                    <div className="w-full ml-2">
                      <input className="form-input" type="text" value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value) }} />
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="py-4 flex gap-8">
                <div className="w-1/2">
                  <h4>Adres Bilgileri</h4>
                  {
                    loading ?
                      <Loading className="mb-4" inputMd />
                      :
                      (sellerAddresses && sellerAddresses.length > 0) &&
                      <>

                        <div className="mb-4">
                          <div className="mt-4 flex">
                            <h5>Fatura Adresi</h5>
                            <div className="flex ml-auto text-blue-400 gap-2 text-sm font-medium cursor-pointer" onClick={() => { handleShowAddressSetModal(1); }}>
                              Değiştir
                            </div>
                          </div>
                          {
                            sellerAddresses.find(x => x.Id === billAddressId) &&
                            <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                              <div className="mb-2 flex">
                                <h5>{sellerAddresses.find(x => x.Id === billAddressId)?.AddressName ?? "-"}</h5>
                                <div className="flex ml-auto text-gray-900 gap-2">
                                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenAddressUpdateModal(sellerAddresses.find(x => x.Id === billAddressId)); }} />
                                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteSellerAddress(sellerAddresses.find(x => x.Id === billAddressId)); }} />
                                </div>
                              </div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === billAddressId)?.PhonePreview ?? "-"}</div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === billAddressId)?.AddressDescription ?? "-"}</div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{(sellerAddresses.find(x => x.Id === billAddressId)?.District ?? "-") + " / " + (sellerAddresses.find(x => x.Id === billAddressId)?.City ?? "-") + " / " + (sellerAddresses.find(x => x.Id === billAddressId)?.Country ?? "-")}</div>
                              <div className="my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === billAddressId)?.ZipCode ?? "-"}</div>
                            </div>
                          }
                        </div>
                        <div className="mb-4">
                          <div className="mt-4 flex">
                            <h5>Sevkiyat Adresi</h5>
                            <div className="flex ml-auto text-blue-400 gap-2 text-sm font-medium cursor-pointer" onClick={() => { handleShowAddressSetModal(2); }}>
                              Değiştir
                            </div>
                          </div>
                          {
                            sellerAddresses.find(x => x.Id === shippingAddressId) &&
                            <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                              <div className="mb-2 flex">
                                <h5>{sellerAddresses.find(x => x.Id === shippingAddressId)?.AddressName ?? "-"}</h5>
                                <div className="flex ml-auto text-gray-900 gap-2">
                                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenAddressUpdateModal(sellerAddresses.find(x => x.Id === shippingAddressId)); }} />
                                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteSellerAddress(sellerAddresses.find(x => x.Id === shippingAddressId)); }} />
                                </div>
                              </div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === shippingAddressId)?.PhonePreview ?? "-"}</div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === shippingAddressId)?.AddressDescription ?? "-"}</div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{(sellerAddresses.find(x => x.Id === shippingAddressId)?.District ?? "-") + " / " + (sellerAddresses.find(x => x.Id === shippingAddressId)?.City ?? "-") + " / " + (sellerAddresses.find(x => x.Id === shippingAddressId)?.Country ?? "-")}</div>
                              <div className="my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === shippingAddressId)?.ZipCode ?? "-"}</div>
                            </div>
                          }
                        </div>
                        <div className="mb-4">
                          <div className="mt-4 flex">
                            <h5>İade Adresi</h5>
                            <div className="flex ml-auto text-blue-400 gap-2 text-sm font-medium cursor-pointer" onClick={() => { handleShowAddressSetModal(3); }}>
                              Değiştir
                            </div>
                          </div>
                          {
                            sellerAddresses.find(x => x.Id === refundAddressId) &&
                            <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                              <div className="mb-2 flex">
                                <h5>{sellerAddresses.find(x => x.Id === refundAddressId)?.AddressName ?? "-"}</h5>
                                <div className="flex ml-auto text-gray-900 gap-2">
                                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenAddressUpdateModal(sellerAddresses.find(x => x.Id === refundAddressId)); }} />
                                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteSellerAddress(sellerAddresses.find(x => x.Id === refundAddressId)); }} />
                                </div>
                              </div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === refundAddressId)?.PhonePreview ?? "-"}</div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === refundAddressId)?.AddressDescription ?? "-"}</div>
                              <div className="mb-2 my-auto text-sm text-gray-900 ">{(sellerAddresses.find(x => x.Id === refundAddressId)?.District ?? "-") + " / " + (sellerAddresses.find(x => x.Id === refundAddressId)?.City ?? "-") + " / " + (sellerAddresses.find(x => x.Id === shippingAddressId)?.Country ?? "-")}</div>
                              <div className="my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === refundAddressId)?.ZipCode ?? "-"}</div>
                            </div>
                          }
                        </div>

                      </>
                  }
                </div>
                <div className="w-1/2">
                  <h4>Kayıtlı Adresler</h4>
                  {
                    loading ?
                      <Loading className="mb-4" inputMd />
                      :
                      sellerAddresses.map((item) => (
                        <div className="mb-4">
                          <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                            <div className="mb-2 flex">
                              <h5>{item.AddressName}</h5>
                              <div className="flex ml-auto text-gray-900 gap-2">
                                <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenAddressUpdateModal(item); }} />
                                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteSellerAddress(item); }} />
                              </div>
                            </div>
                            <div className="mb-2 my-auto text-sm text-gray-900 ">{item.PhonePreview}</div>
                            <div className="mb-2 my-auto text-sm text-gray-900 ">{item.AddressDescription}</div>
                            <div className="mb-2 my-auto text-sm text-gray-900 ">{item.District + " / " + item.City + " / " + item.Country}</div>
                            <div className="my-auto text-sm text-gray-900 ">{item.ZipCode}</div>
                          </div>
                        </div>
                      ))
                  }
                </div>
              </div>
              <div className="flex mt-4">
                <Button isLoading={processLoading} textTiny className="ml-auto w-24" text="Vazgeç" color="text-gray-400" onClick={() => { handleShowCancelModal(); }} />
                <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateSellerDetail(); }} />
              </div>
            </>
            :

            <></>
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
                <PhoneInput ref={phoneInputModalRef} onChange={setModalAddressPhone} initValue={modalAddressPhone?.phone} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Posta Kodu" className="mt-4" />
                <input className="form-input" type="text" value={modalAddressZipCode} onChange={(e) => { setModalAddressZipCode(e.target.value) }} />
              </div>
            </div>
            <div className="w-full">
              <Label withoutDots title="Açık Adres" className="mt-4" />
              <input className="form-input" type="text" value={modalAddressDescription} onChange={(e) => { setModalAddressDescription(e.target.value) }} />
            </div>
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { updateSellerAddress(); }}></Button>
        }
      />
      <Modal
        modalType="fixedMd"
        showModal={showSetAddressModal}
        onClose={() => { setShowSetUpdateModal(false); }}
        title="Adres Seç"
        body={
          <div>
            <div className="text-sm ml-2 text-gray-900">
              Lütfen {addressSetModalType === 1 ? "'Fatura Adresi'" : addressSetModalType === 2 ? "'Sevkiyat Adresi'" : addressSetModalType === 3 ? "'İade Adresi'" : ""} olarak tanımlanacak adres seçimi yapınız.
            </div>
            {
              sellerAddresses.map((item) => (
                <div className="w-1/2 inline-block p-2">
                  <div className="bg-gray-100 rounded-md p-4">
                    <div className="mb-2 flex">
                      <h5>{item.AddressName}</h5>
                      <div className="flex ml-auto">
                        {
                          addressSetModalId === item.Id ?
                            <Button className="w-16 " text="" buttonSm design="button-blue-400" hasIcon icon={<CheckIcon className="icon-sm " />}></Button>
                            :
                            <Button className="w-16 text-blue-400" text="Seç" buttonSm design="button-blue-100" onClick={() => { setAddressSetModalId(item.Id); }}></Button>
                        }
                      </div>
                    </div>
                    <div className="mb-2 my-auto text-sm text-gray-900 ">{item.Phone}</div>
                    <div className="mb-2 my-auto text-sm text-gray-900 ">{item.AddressDescription}</div>
                    <div className="mb-2 my-auto text-sm text-gray-900 ">{item.District + " / " + item.City + " / " + item.Country}</div>
                    <div className="my-auto text-sm text-gray-900 ">{item.ZipCode}</div>
                  </div>
                </div>
              ))
            }
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Onayla" onClick={() => { changeAddressType(); }}></Button>
        }
      />
      <Modal
        modalType="fixedMd"
        showModal={showUpdateContactModal}
        onClose={() => { handleCloseUpdateContactModal(); }}
        title="İletişim Bilgisi Düzenle"
        body={
          <div>
            <div className="flex gap-2 ">
              <div className="w-1/2">
                <Label isRequired withoutDots title="Görev / Ünvan" className="mt-4" />
                <input className="form-input" type="text" value={defaultContactTitle} onChange={(e) => { setDefaultContactTitle(e.target.value); }} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Yetkili İsim Soyisim" className="mt-4" />
                <input className="form-input" type="text" value={defaultContactName} onChange={(e) => { setDefaultContactName(e.target.value); }} />
              </div>
            </div>
            <div className="flex gap-2 ">
              <div className="w-1/2">
                <Label isRequired withoutDots title="E-posta" className="mt-4" />
                <input className="form-input" type="text" value={defaultContactEmail} onChange={(e) => { setDefaultContactEmail(e.target.value); }} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Telefon Numarası" className="mt-4" />
                <PhoneInput ref={phoneInputRef} onChange={setDefaultContactPhone} initValue={defaultContactPhone?.phone} />

              </div>
            </div>
            <div>
              <Label isRequired withoutDots title="Açıklama" className="mt-4" />
              <input className="form-input" type="text" value={defaultContactDescription} onChange={(e) => { setDefaultContactDescription(e.target.value); }} />
            </div>
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { setShowUpdateContactModal(false); updateContact(); }}></Button>
        }
      />
    </div>
  )
}
