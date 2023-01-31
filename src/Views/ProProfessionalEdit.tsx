import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { CheckIcon, ChevronRightIcon, ClockIcon, EditIcon, EnvelopeIcon, MapPinIcon, TrashIcon, WebIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Image } from "../Components/Image";
import { TabsTitle } from "../Components/TabsTitle";
import { AssociationListInnerModel, GeneralLocationModel, ProAddressModel, ProDetailModel, ProMediaModel, ProSectionDataModel, ProServiceGeneralModel, ProServiceShiftModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Loading } from "../Components/Loading";
import { useStateEffect } from "../Components/UseStateEffect";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { InputWithMask } from "../Components/InputWithMask";
import { PhoneInput, PhoneResultModel } from "../Components/PhoneInput";
import ReactNumeric from 'react-numeric';
import { autonNumericOptions } from "../Services/Functions";
import { ToggleButton } from "../Components/ToggleButton";
import { SERVICES } from "../Services/Constants";
import { SRLWrapper } from "simple-react-lightbox";
import { ImageCropper } from "../Components/ImageCropper/ImageCropper";

interface RouteParams {
  id: string
}

export const ProProfessionalEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const tabsLink = [
    { id: 1, name: "Genel Bilgiler" },
    { id: 2, name: "Profesyonel Bilgileri" },
    { id: 3, name: "Profil Detay" }
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const phoneInputRef = useRef<any>();

  //#region TAB 1
  const firmTypeOptions = [
    { key: "1", value: "Anonim Şirket" },
    { key: "2", value: "Şahıs Şirketi" },
    { key: "3", value: "Limited Şirket" },
    { key: "4", value: "Kolektif Şirket" },
    { key: "5", value: "Kooperatif Şirket" },
    { key: "6", value: "Adi Ortaklık" },
    { key: "7", value: "Şirketim Yok" },
  ];

  const [selectedFirmTypeOption, setSelectedFirmTypeOption] = useState<{ key: string, value: string }>({ key: "0", value: "Firma Tipi" });

  const [bankOptions, setBankOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedBankOption, setSelectedBankOption] = useState<{ key: string, value: string }>({ key: "0", value: "Banka" });

  const [proDetail, setProDetail] = useState<ProDetailModel>();

  const [showUpdateContactModal, setShowUpdateContactModal] = useState<boolean>(false);

  const [contactModalId, setContactModalId] = useState<number>(0);

  const [contactModalTitle, setContactModalTitle] = useState<string>("");

  const [contactModalName, setContactModalName] = useState<string>("");

  const [contactModalEmail, setContactModalEmail] = useState<string>("");

  const [contactModalPhone, setContactModalPhone] = useState<PhoneResultModel>();

  const [contactModalDescription, setContactModalDescription] = useState<string>("");

  const [showAddressUpdateModal, setShowAddressUpdateModal] = useState<boolean>(false);

  const [countryOptions, setCountryOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedCountryOption, setCountryOption] = useState<{ key: string, value: string }>({ key: "0", value: "Ülke" });

  const [cityOptions, setCityOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedCityOption, setCityOption] = useState<{ key: string, value: string }>({ key: "0", value: "Şehir" });

  const [districtOptions, setDistrictOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "İlçe" }]);

  const [selectedDistrictOption, setDistrictOption] = useState<{ key: string, value: string }>({ key: "0", value: "İlçe" });

  const [showSetAddressModal, setShowSetUpdateModal] = useState<boolean>(false);

  const [proAddresses, setProAdresses] = useState<ProAddressModel[]>([]);

  const [modalAddressId, setModalAddressId] = useState<number>(0);

  const [modalAddressTitle, setModalAddressTitle] = useState<string>("");

  const [modalAddressPhone, setModalAddressPhone] = useState<PhoneResultModel>();

  const [modalAddressZipCode, setModalAddressZipCode] = useState<string>("");

  const [modalAddressDescription, setModalAddressDescription] = useState<string>("");

  const [modalAddressCountryId, setModalAddressCountryId] = useState<number>(0);

  const [modalAddressCityId, setModalAddressCityId] = useState<number>(0);

  const [modalAddressDistrictId, setModalAddressDistrictId] = useState<number>(0);

  const [addressSetModalId, setAddressSetModalId] = useState<number>(0);

  const [addressSetModalType, setAddressSetModalType] = useState<number>(0);

  const [billAddressId, setBillAddressId] = useState<number>(0);

  const [proId, setProId] = useState<number>(0);

  const [logo, setLogo] = useState<string>("");

  const [newLogo, setNewLogo] = useState<File | undefined>();

  const [nameSurname, setNameSurname] = useState<string>("");

  const [phone, setPhone] = useState<PhoneResultModel>();

  const [email, setEmail] = useState<string>("");

  const [storeName, setStoreName] = useState<string>("");

  const [companyTitle, setCompanyTitle] = useState<string>("");

  const [taxNumber, setTaxNumber] = useState<string>("");

  const [taxDepartment, setTaxDepartment] = useState<string>("");

  const [citizenshipNumber, setCitizenshipNumber] = useState<string>("");

  const [kepAddress, setKepAddress] = useState<string>("");

  const [mersisNumber, setMersisNumber] = useState<string>("");

  const [contactEmail, setContactEmail] = useState<string>("");

  const [websiteUrl, setWebsiteUrl] = useState<string>("");

  const [contactAddress, setContactAddress] = useState<string>("");

  const [bankNameSurname, setBankNameSurname] = useState<string>("");

  const [iban, setIban] = useState<string>("");

  const [branchName, setBranchName] = useState<string>("");

  const [branchCode, setBranchCode] = useState<string>("");

  const [accountNumber, setAccountNumber] = useState<string>("");
  //#endregion

  //#region TAB 2
  const [proCategoryOptions, setProCategoryOption] = useState<{ key: string, value: string }[]>([]);

  const [selectedProCategoryOption, setSelectedProCategoryOption] = useState<{ key: string, value: string }>({ key: "0", value: "Profesyonel Kategori" });

  const [proCategoryId, setProCategoryId] = useState<number>(0);

  const [serviceAreaList, setServiceAreaList] = useState<ProServiceGeneralModel[]>([]);

  const [serviceAreaOptions, setServiceAreaOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedServiceAreaOption, setSelectedServiceAreaOption] = useState<{ key: string, value: string }>({ key: "0", value: "Hizmet Alanı" });

  const [selectedServiceAreaList, setSelectedServiceAreaList] = useState<{ key: string, value: string }[]>([]);

  const [selectedServiceAreaListToApi, setSelectedServiceAreaListToApi] = useState<number[]>([]);

  const [selectedDistrictListToApi, setSelectedDistictListToApi] = useState<number[]>([]);

  const [selectedServiceAreaDistrictList, setSelectedServiceAreaDistrictList] = useState<{ key: string, value: string }[]>([]);

  const [districtListFromApi, setDistrictListFromApi] = useState<GeneralLocationModel[]>([]);

  const [shiftStart, setShiftStart] = useState<string>("");

  const [shiftEnd, setShiftEnd] = useState<string>("");

  const [shiftDataToApi, setShiftDataToApi] = useState<ProServiceShiftModel[]>([]);

  const [minPrice, setMinPrice] = useState<string>("0");

  const [maxPrice, setMaxPrice] = useState<string>("0");

  const [priceData, setPriceData] = useState<string[]>([]);

  const [cityOptionsForServiceInfo, setCityOptionsForServiceInfo] = useState<{ key: string, value: string }[]>([]);

  const [selectedCityOptionForServiceInfo, setCityOptionForServiceInfo] = useState<{ key: string, value: string }>({ key: "0", value: "İl" });


  const [tempDistrictOptionsForServiceInfo, setTempDistrictOptionsForServiceInfo] = useState<{ key: string, value: string }[]>([]);

  const [districtOptionsForServiceInfo, setDistrictOptionsForServiceInfo] = useState<{ key: string, value: string }[]>([]);

  const [selectedDistrictOptionForServiceInfo, setDistrictOptionForServiceInfo] = useState<{ key: string, value: string }>({ key: "0", value: "İlçe" });


  const [introText, setIntroText] = useState<string>("");

  const [sectionData, setSectionData] = useState<ProSectionDataModel[]>([]);


  const [languageList, setLanguageList] = useState<{ key: string, value: string }[]>([
    { key: "1", value: "İngilizce" },
    { key: "2", value: "Almanca" },
    { key: "3", value: "Fransızca" },
    { key: "4", value: "İtalyanca" },
    { key: "5", value: "Arapça" },
    { key: "6", value: "Rusça" },
    { key: "7", value: "Çince" },
    { key: "8", value: "İspanyolca" }
  ]);

  const [tempLanguageOptionsForServiceInfo, setTempLanguageOptionsForServiceInfo] = useState<{ key: string, value: string }[]>([]);

  const [selectedForeignLanguageDataToApi, setSelectedForeignLanguageDataToApi] = useState<string[]>([]);

  const [selectedForeignLanguageData, setSelectedForeignLanguageData] = useState<{ key: string, value: string }[]>([]);

  const [selectedForeignLanguageDataOption, setSelectedForeignLanguageDataOption] = useState<{ key: string, value: string }>({ key: "0", value: "Dil" });

  //#endregion

  //#region TAB 3
  const [mediaList, setMediaList] = useState<ProMediaModel[]>();

  const [showDeleteMediaId, setShowDeleteMediaId] = useState<number>(0);

  const [societyList, setSocietyList] = useState<number[]>([]);

  const [societyListToAPi, setSocietyListToApi] = useState<number[]>([]);

  const [societyListFromApi, setSocietyListFromApi] = useState<AssociationListInnerModel[]>([]);

  const [societyData, setSocietyData] = useState<AssociationListInnerModel[]>([]);

  const [societyListOptions, setSocietyListOptions] = useState<{ key: string, value: string }[]>([]);

  const [selectedSocietyOption, setSelectedSocietyOption] = useState<{ key: string, value: string }>({ key: "0", value: "Üyelik" });

  const [selectedSocietyList, setSelectedSocietyList] = useState<{ key: string, value: string }[]>([]);

  const [isVerified, setIsVerified] = useState<boolean>(false);

  ClassicEditor.defaultConfig = {
    ...ClassicEditor.defaultConfig,
    mediaEmbed: {
      previewsInData: true
    },
    ckfinder: {
      uploadUrl: `${SERVICES.API_ADMIN_GENERAL_URL}/ck-inner-media`
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    }
  };

  //#endregion

  useStateEffect(() => {
    setCurrentOpenedFilterButton("");
  }, [selectedTabsId]);

  useEffect(() => {
    getProCategoryList();
    getCountryList();
  }, []);

  useStateEffect(() => {
    setCurrentOpenedFilterButton("");
    setSelectedServiceAreaList(JSON.parse(JSON.stringify([])));
    getProServiceCategoryList();
  }, [selectedProCategoryOption]);

  useStateEffect(() => {
    setSelectedProCategoryOption(proCategoryOptions.find(x => x.key === proCategoryId.toString()) ?? { key: "0", value: "Profesyonel Kategori" });
  }, [proCategoryId]);

  useStateEffect(() => {
    getBankList();
  }, [proCategoryOptions]);

  useStateEffect(() => {
    getCityListForServiceInfo();
  }, [bankOptions]);

  useStateEffect(() => {
    setSelectedServiceAreaDistrictList(JSON.parse(JSON.stringify([])));
    getDistrictListForServiceInfo();
  }, [selectedCityOptionForServiceInfo]);

  useStateEffect(() => {
    getProDetail();
  }, [cityOptionsForServiceInfo]);

  useEffect(() => {
    setCurrentOpenedFilterButton("");
  }, [showAddressUpdateModal]);

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

  useStateEffect(() => {
    setSelectedServiceAreaDistrictList(JSON.parse(JSON.stringify([])));
    getDistrictListForServiceInfo();
    prepareDistrictListFromApi(districtListFromApi);
  }, [districtListFromApi]);

  useStateEffect(() => {
    getSocietyLists();
  }, [societyList]);

  useStateEffect(() => {
    prepateSocietyListFromApi(societyListFromApi);
  }, [societyListFromApi]);

  useStateEffect(() => {
    societyData.forEach((item) => {
      handleAddSelectedSocietyList({ key: String(item.Id), value: item.Title });
    });
  }, [societyData]);

  const prepateSocietyListFromApi = (societyListFromApi) => {
    let _tempList: { key: string, value: string }[] = [];
    societyListFromApi.forEach(item => {
      if (!societyList.includes(item.Id)) {
        _tempList.push({ key: String(item.Id), value: String(item.Title) });
      }
    });
    setSocietyListOptions(_tempList);
  }

  const getBankList = async () => {
    setLoading(true);
    const _result = await ApiService.getBankList();
    let _tempBankList: { key: string, value: string }[] = [];
    _result.map((item) => {
      _tempBankList.push({ key: item.Id, value: item.Name })
    });
    setBankOptions(JSON.parse(JSON.stringify(_tempBankList)));
  }

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

  const getCityListForServiceInfo = async () => {
    const _result = await ApiService.getCityList(String(223));
    let _tempCityList: { key: string, value: string }[] = [];
    _result.map((item) => {
      _tempCityList.push({ key: item.id.toString(), value: item.name })
    });
    setCityOptionsForServiceInfo(JSON.parse(JSON.stringify(_tempCityList)));
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

  useStateEffect(() => {
    let _tempDistrictList: { key: string, value: string }[] = [];
    tempDistrictOptionsForServiceInfo.map((item) => {
      if ((selectedServiceAreaDistrictList.find(x => x.key === item.key) === null || selectedServiceAreaDistrictList.find(x => x.key === item.key) === undefined) && _tempDistrictList.find(x => x.key === item.key) === undefined) {
        _tempDistrictList.push({ key: item.key, value: item.value })
      }
    });
    setDistrictOptionsForServiceInfo(JSON.parse(JSON.stringify(_tempDistrictList)));
  }, [tempDistrictOptionsForServiceInfo]);


  const getDistrictListForServiceInfo = async () => {
    if (selectedCityOptionForServiceInfo.key === "0") {
      return;
    }
    const _result = await ApiService.getDistrictList(selectedCityOptionForServiceInfo.key);
    let _tempDistrictList: { key: string, value: string }[] = [];
    _result.map((item) => {
      if (selectedServiceAreaDistrictList.find(x => x.key === item.id.toString()) === null || selectedServiceAreaDistrictList.find(x => x.key === item.id.toString()) === undefined) {
        _tempDistrictList.push({ key: item.id.toString(), value: item.name })
      }
    });
    setTempDistrictOptionsForServiceInfo(JSON.parse(JSON.stringify(_tempDistrictList)));
  }

  const getProCategoryList = async () => {
    setLoading(true);

    const _result = await ApiService.getProCategoryList(1, 9999, "", 0, true);

    if (_result.succeeded === true) {
      let _tempList: { key: string, value: string }[] = [];
      _result.data.Data.forEach((item) => {
        if (item.CategoryStatus) {
          let _temp = { key: String(item.Id), value: item.CategoryName };
          _tempList.push(_temp);
        }
      });
      setProCategoryOption(JSON.parse(JSON.stringify(_tempList)));
      setLoading(false);

    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const getProServiceCategoryList = async () => {
    if (selectedProCategoryOption.key == "0") {
      return;
    }

    setLoading(true);

    const _result = await ApiService.getProServiceCategoryList(Number(selectedProCategoryOption.key ?? "0"));

    if (_result.succeeded === true) {
      let _tempList: { key: string, value: string }[] = [];
      _result.data.Data.forEach((item) => {
        let _temp = { key: String(item.Id), value: item.Name };
        if (selectedServiceAreaList.find(x => x.key === _temp.key) === null || selectedServiceAreaList.find(x => x.key === _temp.key) === undefined) {
          _tempList.push(_temp);
        }
      });
      setServiceAreaOptions(JSON.parse(JSON.stringify(_tempList)));
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  useStateEffect(() => {
    serviceAreaList.forEach((item) => {
      let _tempOption = { key: String(item.Id ?? "0"), value: String(item.Name ?? "-") };
      handleAddSelectedServiceAreaList(_tempOption);
    });

  }, [serviceAreaList]);

  const getProDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getProDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {

      setProDetail(_result.data);
      setIsVerified(_result.data.IsVerified);
      setProId(_result.data.Id);
      setLogo(_result.data.Logo);
      setSelectedBankOption(bankOptions.find(x => x.key === _result.data.BankInfo.BankId.toString()) ?? { key: "0", value: "Banka" });
      setSelectedFirmTypeOption(firmTypeOptions.find(x => x.key === _result.data.CompanyType.toString()) ?? { key: "0", value: "Firma Tipi" });
      setNameSurname(_result.data.NameSurname);
      setPhone({ purePhone: "", maskedPhone: "", phone: _result.data.Phone, phonePreview: "", pureCountryCode: "", previewCountryCode: "" });
      setEmail(_result.data.Email);
      setStoreName(_result.data.StoreName);
      setCompanyTitle(_result.data.CompanyTitle);
      setTaxNumber(_result.data.TaxNumber);
      setTaxDepartment(_result.data.TaxDepartment);
      setCitizenshipNumber(_result.data.CitizenshipNumber);
      setKepAddress(_result.data.KepAddress);
      setMersisNumber(_result.data.MersisNumber);
      setContactEmail(_result.data.ContactEmail);
      setWebsiteUrl(_result.data.WebsiteUrl);
      setContactAddress(_result.data.ContactAddress);
      setBankNameSurname(_result.data.BankInfo.NameSurname);
      setIban(_result.data.BankInfo.IBAN);
      setBranchName(_result.data.BankInfo.BranchName);
      setBranchCode(_result.data.BankInfo.BranchCode);
      setAccountNumber(_result.data.BankInfo.AccountNumber);
      setBillAddressId(_result.data.BillAddressId);
      setProAdresses(_result.data.AddressList);
      setProCategoryId(_result.data.ParentCategory);
      setServiceAreaList(_result.data.ServiceCategoryList);
      setShiftStart(_result.data.ShiftData.find(x => x.Type == 1)?.Name ?? "");
      setShiftEnd(_result.data.ShiftData.find(x => x.Type === 2)?.Name ?? "");
      let _tempShiptDataArray = [""];
      _result.data.ShiftData.filter(x => x.Type === 3).forEach((item) => {
        _tempShiptDataArray.push(item.Name ?? "");
      });
      setSelectedAdditionalInfoForWorkList(JSON.parse(JSON.stringify(_tempShiptDataArray)));
      setMinPrice(String(_result.data.MinPrice ?? "0"));
      setMaxPrice(String(_result.data.MaxPrice ?? "0"));
      setPriceData(_result.data.PriceData);
      setCityOptionForServiceInfo(cityOptionsForServiceInfo.find(x => x.key === _result.data.ServiceCityId.toString()) ?? { key: "0", value: "İl" });
      setDistrictListFromApi(_result.data.DistrictList);
      let tempSelectedLanguateList: { key: string, value: string }[] = [];
      languageList.map((item) => (
        _result.data.ForeignLanguageData.map((item2) => {
          if (item.value === item2) {
            tempSelectedLanguateList.push({ key: item.key, value: item2 });
          }
        })
      ));

      setSelectedForeignLanguageData(tempSelectedLanguateList);

      let _tempLanguageOptionsForServiceInfo: { key: string, value: string }[] = [];
      languageList.map((item) => {
        if ((tempSelectedLanguateList.find(x => x.key === item.key) === null || tempSelectedLanguateList.find(x => x.key === item.key) === undefined) && _tempLanguageOptionsForServiceInfo.find(x => x.key === item.key) === undefined) {
          _tempLanguageOptionsForServiceInfo.push({ key: item.key, value: item.value })
        }
      });
      setTempLanguageOptionsForServiceInfo(JSON.parse(JSON.stringify(_tempLanguageOptionsForServiceInfo)));

      //
      setMediaList(_result.data.MediaList);
      setIntroText(_result.data.IntroText);
      setSectionData(_result.data.SectionData);
      setSocietyList(_result.data.SocietyIds);
      setSocietyData(_result.data.SocietyData);
      //
      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/pro-profesyonel-listesi"); }
      });
    }
  }

  const getSocietyLists = async () => {
    setLoading(true);

    const _result = await ApiService.getSocietyLists(1, 9999, "", 1);

    if (_result.succeeded === true) {
      setSocietyListFromApi(_result.data.Data);
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const updateProAddress = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProAddress(modalAddressId, Number(selectedCountryOption.key ?? 0), Number(selectedDistrictOption.key ?? 0), Number(selectedCityOption.key ?? 0), modalAddressZipCode, modalAddressDescription, modalAddressTitle, modalAddressPhone?.phone ?? "");

    setProcessLoading(false);
    setShowAddressUpdateModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Adres başarıyla düzenlendi.",
        onClose: () => { context.hideModal(); getProDetail(); }
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

  const handleDeleteProAddress = (item) => {
    context.showModal({
      type: "Question",
      title: `${item.AddressName} başlıklı adres silinecek emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteProAddress(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Adres silindi.",
            onClose: () => { context.hideModal(); getProDetail(); }
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

    const _result = await ApiService.changeProAddressType(addressSetModalId, addressSetModalType);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Adres düzenlendi.",
        onClose: () => { context.hideModal(); getProDetail(); }
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

  const handleOpenUpdateContactModal = (item) => {
    setContactModalId(item.Id);
    setContactModalTitle(item.Title);
    setContactModalName(item.NameSurname);
    setContactModalEmail(item.Email);
    setContactModalPhone({ purePhone: "", maskedPhone: "", phone: item.Phone, phonePreview: "", pureCountryCode: "", previewCountryCode: "" });
    setContactModalDescription(item.Description);

    setShowUpdateContactModal(true);
  }

  const updateProContact = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProContact(contactModalId, contactModalName, contactModalEmail, contactModalPhone?.phone ?? "", contactModalDescription, contactModalTitle);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İletişim bilgisi başarıyla güncellendi.",
        onClose: () => { context.hideModal(); }
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

  const handleShowAddressSetModal = (addressType) => {
    setAddressSetModalType(addressType);
    if (addressType === 1) {
      setAddressSetModalId(proAddresses.find(x => x.Id === billAddressId)?.Id ?? 0)
    }
    else {
      setAddressSetModalId(0);
    }
    setShowSetUpdateModal(true);
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

    getCountryList();

    setShowAddressUpdateModal(true);
  }

  const handleAddSelectedServiceAreaList = (item) => {
    if (selectedServiceAreaList.find(x => x.key == item.key) === undefined && item.key !== "0") {
      let _tempServiceAreaList = selectedServiceAreaList;
      _tempServiceAreaList.push(item);
      setSelectedServiceAreaList(JSON.parse(JSON.stringify(_tempServiceAreaList)));
      //
      let _tempServiceAreaListApi = [0];
      _tempServiceAreaList.forEach((item) => {
        _tempServiceAreaListApi.push(Number(item.key ?? "0"));
      });
      setSelectedServiceAreaListToApi(JSON.parse(JSON.stringify(_tempServiceAreaListApi)));
      //
      let _tempServiceAreaList2 = serviceAreaOptions.filter(x => x != item);
      setServiceAreaOptions(JSON.parse(JSON.stringify(_tempServiceAreaList2)));
    }
  }

  const handleRemoveSelectedServiceAreaList = (item) => {
    let _tempServiceAreaList = selectedServiceAreaList.filter(x => x != item);
    setSelectedServiceAreaList(JSON.parse(JSON.stringify(_tempServiceAreaList)));
    //
    let _tempServiceAreaListApi = [0];
    _tempServiceAreaList.forEach((item) => {
      _tempServiceAreaListApi.push(Number(item.key ?? "0"));
    });
    setSelectedServiceAreaListToApi(JSON.parse(JSON.stringify(_tempServiceAreaListApi)));
    //
    let _tempServiceAreaList2 = serviceAreaOptions;
    _tempServiceAreaList2.push(item);
    setServiceAreaOptions(JSON.parse(JSON.stringify(_tempServiceAreaList2)));
  }

  const handleAddSelectedServiceAreaDistrictList = (item) => {
    if (item.key !== "0") {
      let _tempServiceAreaList = selectedServiceAreaDistrictList;
      _tempServiceAreaList.push(item);
      setSelectedServiceAreaDistrictList(JSON.parse(JSON.stringify(_tempServiceAreaList)));
      //
      let _tempServiceAreaList2 = districtOptionsForServiceInfo.filter(x => x.key !== item.key);
      setDistrictOptionsForServiceInfo(JSON.parse(JSON.stringify(_tempServiceAreaList2)));
    }
  }

  const handleAddSelectedLanguageList = (item) => {
    if (item.key !== "0") {
      let _tempLanguageList = selectedForeignLanguageData;
      _tempLanguageList.push(item);
      setSelectedForeignLanguageData(JSON.parse(JSON.stringify(_tempLanguageList)));
      //
      let _tempLanguageList2 = tempLanguageOptionsForServiceInfo.filter(x => x.key !== item.key);
      setTempLanguageOptionsForServiceInfo(JSON.parse(JSON.stringify(_tempLanguageList2)));
    }
  }

  const handleRemoveSelectedLanguageList = (item) => {
    let _tempLanguageList = selectedForeignLanguageData.filter(x => x != item);
    setSelectedForeignLanguageData(JSON.parse(JSON.stringify(_tempLanguageList)));
    //
    let _tempLanguageList2 = tempLanguageOptionsForServiceInfo;
    _tempLanguageList2.push(item);
    setTempLanguageOptionsForServiceInfo(JSON.parse(JSON.stringify(_tempLanguageList2)));
  }


  const handleRemoveSelectedServiceAreaDistrictList = (item) => {
    let _tempServiceAreaList = selectedServiceAreaDistrictList.filter(x => x != item);
    setSelectedServiceAreaDistrictList(JSON.parse(JSON.stringify(_tempServiceAreaList)));
    //
    let _tempServiceAreaList2 = districtOptionsForServiceInfo;
    _tempServiceAreaList2.push(item);
    setDistrictOptionsForServiceInfo(JSON.parse(JSON.stringify(_tempServiceAreaList2)));
  }

  const handlePriceDataCheckedChange = (name, checked) => {
    if (checked) {
      let _tempPriceDataArray = priceData;
      _tempPriceDataArray.push(name);
      setPriceData(JSON.parse(JSON.stringify(_tempPriceDataArray)))
    }
    else {
      let _tempPriceDataArray = priceData.filter(x => x !== name);
      setPriceData(JSON.parse(JSON.stringify(_tempPriceDataArray)))
    }
  }

  useStateEffect(() => {
    prepareDistrictList();
  }, [shiftDataToApi]);

  useStateEffect(() => {
    updateProServiceInfo();
  }, [selectedDistrictListToApi]);

  const prepareShiftData = () => {

    let tempArray: string[] = [];
    selectedForeignLanguageData.map((item) => tempArray.push(item.value));
    setSelectedForeignLanguageDataToApi(tempArray);

    let _tempData = [{ Name: "", Type: 0 }];
    _tempData.push({ Name: shiftStart, Type: 1 });
    _tempData.push({ Name: shiftEnd, Type: 2 });
    selectedAdditionalInfoForWorkList.map((item) => {
      _tempData.push({ Name: item, Type: 3 });
    });
    setShiftDataToApi(JSON.parse(JSON.stringify(_tempData)));

  }

  const prepareDistrictList = () => {
    const _tempList = [0];
    selectedServiceAreaDistrictList.forEach((item) => {
      _tempList.push(Number(item.key ?? "0"));
    })
    setSelectedDistictListToApi(JSON.parse(JSON.stringify(_tempList)));
  }

  const prepareDistrictListFromApi = (districtList) => {
    districtList.forEach(item => {
      let _temp = { key: String(item.id), value: item.name };
      handleAddSelectedServiceAreaDistrictList(_temp);
    });
  }

  const updateProData = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProData(Number(params.id ?? "0"), nameSurname, storeName, email, phone?.phone ?? "", Number(selectedFirmTypeOption.key ?? "0"), taxDepartment, taxNumber, citizenshipNumber, companyTitle, kepAddress, mersisNumber, bankNameSurname, iban, Number(selectedBankOption.key ?? "0"), branchName, branchCode, accountNumber, contactEmail, websiteUrl, contactAddress, isVerified);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Question",
        title: "Genel bilgiler kaydedildi. Düzenlemeye devam etmek istiyor musunuz?",
        onClose: () => {
          context.hideModal();
          history.push(`${"/pro-profesyonel-detay/" + (params.id ?? "0")}`);
        },
        onClick: async () => {
          context.hideModal();
          return true;
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

  const updateProServiceInfo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProServiceInfo(Number(params.id ?? "0"), Number(selectedProCategoryOption.key ?? "0"), selectedServiceAreaListToApi, shiftDataToApi, Number(minPrice ?? 0), Number(maxPrice ?? "0"), priceData, selectedForeignLanguageDataToApi, Number(selectedCityOptionForServiceInfo.key ?? "0"), selectedDistrictListToApi);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Question",
        title: "Profosyonel bilgiler kaydedildi. Düzenlemeye devam etmek istiyor musunuz?",
        onClose: () => {
          context.hideModal();
          history.push(`${"/pro-profesyonel-detay/" + (params.id ?? "0")}`);
        },
        onClick: async () => {
          context.hideModal();
          return true;
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

  const handleShowCancelModal = () => {
    context.showModal({
      type: "Question",
      title: "Değişiklikler Kaydedilmedi",
      message: "Devam ederseniz yaptığınız değişiklikler kaybolacaktır. Devam etmek istiyor musunuz?",
      onClick: async () => {
        context.hideModal();
        history.push(`${"/pro-profesyonel-detay/" + (params.id ?? "0")}`);
        return true;
      },
      onClose: () => { context.hideModal(); }
    });
  }

  const handleChangeShowDeleteMediaId = (Id) => {
    if (showDeleteMediaId === Id) {
      setShowDeleteMediaId(0);
    }
    else {
      setShowDeleteMediaId(Id);
    }
  }

  const handleShowDeleteMediaModal = (Id) => {
    context.showModal({
      type: "Question",
      title: "Medya Sil",
      message: "Seçili medya silinecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();
        await deleteProMedia(Id);
        return true;
      },
      onClose: () => { context.hideModal(); }
    });
  }

  const deleteProMedia = async (Id) => {

    const _result = await ApiService.deleteProMedia(Id);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Medya silindi.",
        onClose: () => { context.hideModal(); handleRemoveFromMediaList(Id); }
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

  const changeSectionTitle = async (e, j) => {
    sectionData[j].Title = e;
    setSectionData([...sectionData])
  }

  const changeSectionDescription = async (e, j) => {
    sectionData[j].Description = e;
    setSectionData([...sectionData])
  }

  const handleRemoveSectionArray = (item) => {
    context.showModal({
      type: "Question",
      title: "Sekme Silinecek",
      message: `${item.Title} başlıklı sekme silinecek. Emin misiniz?`,
      onClick: async () => {
        let _tempItem = { Title: item.Title, Description: item.Description };
        let _tempArray = sectionData.filter(i => i.Title !== _tempItem.Title && i.Description !== _tempItem.Description);
        setSectionData([..._tempArray]);
        context.hideModal();
        return true;
      },
      onClose: () => { context.hideModal(); }
    })
  }

  const updateProProfile = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProProfile(Number(params.id ?? "0"), sectionData, societyListToAPi, introText);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Question",
        title: "Profil detayı kaydedildi. Düzenlemeye devam etmek istiyor musunuz?",
        onClose: () => {
          context.hideModal();
          history.push(`${"/pro-profesyonel-detay/" + (params.id ?? "0")}`);
        },
        onClick: async () => {
          context.hideModal();
          return true;
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

  const handleAddSelectedSocietyList = (item) => {
    if (!selectedSocietyList.includes(item) && item.key !== "0") {
      let _tempList = selectedSocietyList;
      _tempList.push(item);
      setSelectedSocietyList(JSON.parse(JSON.stringify(_tempList)));
      //
      let _tempListApi = [0];
      _tempList?.forEach((item) => {
        _tempListApi.push(Number(item.key ?? "0"));
      });
      setSocietyListToApi(JSON.parse(JSON.stringify(_tempListApi)));
      //
      let _tempList2 = societyListOptions.filter(x => x != item);
      setSocietyListOptions(JSON.parse(JSON.stringify(_tempList2)));
    }
  }

  const handleRemoveSelectedSocietyList = (item) => {
    let _tempList = selectedSocietyList.filter(x => x != item);
    setSelectedSocietyList(JSON.parse(JSON.stringify(_tempList)));
    //
    let _tempListApi = [0];
    _tempList.forEach((item) => {
      _tempListApi.push(Number(item.key ?? "0"));
    });
    setSocietyListToApi(JSON.parse(JSON.stringify(_tempListApi)));
    //
    let _tempList2 = societyListOptions;
    _tempList2.push(item);
    setSocietyListOptions(JSON.parse(JSON.stringify(_tempList2)));
  }

  const handleRemoveFromMediaList = (MediaId) => {
    let tempMediaList = mediaList?.filter(x => x.MediaId !== MediaId);
    setMediaList(JSON.parse(JSON.stringify(tempMediaList)));
  }

  const handleDeleteContact = (Id) => {
    context.showModal({
      type: "Question",
      title: "İletişim bilgisi silinecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.deleteProContact(Id);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İletişim bilgisi başarıyla silindi",
            onClose: () => { context.hideModal(); }
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

  const handleStartHourChange = (startHour: string) => {
    let hour = startHour.split(':')[0];
    let min = startHour.split(':')[1];

    if (hour) {
      hour = hour.replace(' ', '');
      if (Number(hour) >= 24) {
        hour = "00";
      }
    }
    else {
      hour = "";
    }
    if (min) {
      min = min.replace(' ', '');
      if (Number(min) > 59) {
        min = "00";
      }
    }
    else {
      min = ""
    }

    var retHour = hour + " : " + min;
    setShiftStart(retHour)
  }

  const handleEndHourChange = (endHour: string) => {
    let hour = endHour.split(':')[0];
    let min = endHour.split(':')[1];

    if (hour) {
      hour = hour.replace(' ', '');
      if (Number(hour) >= 24) {
        hour = "00";
      }
    }
    else {
      hour = "";
    }
    if (min) {
      min = min.replace(' ', '');
      if (Number(min) > 59) {
        min = "00";
      }
    }
    else {
      min = ""
    }

    var retHour = hour + " : " + min;
    setShiftEnd(retHour)
  }

  const additionalInfoForWorkList = [
    { Id: 1, Name: "Akşamları Müsait", Info: "" },
    { Id: 2, Name: "Haftasonları Çalışıyor", Info: "" },
    { Id: 3, Name: "7/24 Çalışıyor", Info: "" },
    { Id: 4, Name: "Ekibe Sahip", Info: "" },
    { Id: 5, Name: "0-1 Çalışan", Info: "" },
    { Id: 6, Name: "2-10 Çalışan", Info: "" },
    { Id: 7, Name: "11-50 Çalışan", Info: "" },
    { Id: 8, Name: "50+ Çalışan", Info: "" },
    { Id: 9, Name: "1 yıllık deneyim", Info: "" },
    { Id: 10, Name: "3 yıllık deneyim", Info: "" },
    { Id: 11, Name: "5 yıllık deneyim", Info: "" },
    { Id: 12, Name: "7 yıllık deneyim", Info: "" },
    { Id: 13, Name: "10 yıllık deneyim", Info: "" },
    { Id: 14, Name: "10+ yıllık deneyim", Info: "" }
  ];

  const [selectedAdditionalInfoForWorkList, setSelectedAdditionalInfoForWorkList] = useState<string[]>([]);

  const handlePushRemoveWorkInfo = (item: { Id: number, Name: string, Info: string }) => {
    if (item.Id <= 4) {
      if (selectedAdditionalInfoForWorkList.includes(item.Name)) {
        const _selectedAdditionalInfoForWorkList = selectedAdditionalInfoForWorkList.filter(i => i !== item.Name);
        setSelectedAdditionalInfoForWorkList([..._selectedAdditionalInfoForWorkList]);
      }
      else {
        setSelectedAdditionalInfoForWorkList([...selectedAdditionalInfoForWorkList, item.Name]);
      }
    }
    else if (item.Id > 4 && item.Id < 9) {
      let tempList: { Id: number, Name: string, Info: string }[] = additionalInfoForWorkList.filter(x => x.Id > 4 && x.Id < 9);
      let _selectedAdditionalInfoForWorkList = selectedAdditionalInfoForWorkList;
      tempList.forEach((tempItem) => {
        _selectedAdditionalInfoForWorkList = _selectedAdditionalInfoForWorkList.filter(x => x !== tempItem.Name)
      })
      _selectedAdditionalInfoForWorkList.push(item.Name);
      setSelectedAdditionalInfoForWorkList(JSON.parse(JSON.stringify(_selectedAdditionalInfoForWorkList)));
    }
    else {
      let tempList: { Id: number, Name: string, Info: string }[] = additionalInfoForWorkList.filter(x => x.Id >= 9);
      let _selectedAdditionalInfoForWorkList = selectedAdditionalInfoForWorkList;
      tempList.forEach((tempItem) => {
        _selectedAdditionalInfoForWorkList = _selectedAdditionalInfoForWorkList.filter(x => x !== tempItem.Name)
      })
      _selectedAdditionalInfoForWorkList.push(item.Name);
      setSelectedAdditionalInfoForWorkList(JSON.parse(JSON.stringify(_selectedAdditionalInfoForWorkList)));
    }

  }

  const updateProPhoto = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProPhoto(newLogo, Number(params.id));

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Logo başarıyla güncellendi",
        onClose: async () => {
          setNewLogo(undefined);
          context.hideModal();
          setProcessLoading(false);
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
        }
      });
    }
  }

  const showDeletePhoto = () => {
    context.showModal({
      type: "Question",
      title: "Profesyonel Fotoğrafını Sil",
      message: `Profesyonel fotoğrafını silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteProPhoto(Number(params.id));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Fotoğraf başarıyla silindi",
            onClose: () => {
              context.hideModal();
              setLogo("");
              setNewLogo(undefined);
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
    <div className="content-wrapper" >
      <div className="portlet-wrapper">
        <div className="flex items-center text-sm text-gray-400 mb-4 cursor-pointer" onClick={() => { handleShowCancelModal(); }}>
          <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
          <div>Profesyonel Detayı</div>
        </div>
        <h2 className="mb-4">Profesyonel Bilgilerini Düzenle</h2>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
        {
          selectedTabsId === 1 ?
            <>
              <div className="w-full flex mt-4 border-b border-grey-400 py-4 gap-8">
                <div className="w-1/2">
                  <h4 className="mb-4">Profil Bilgileri</h4>
                  <div className="flex lg:flex-row flex-col gap-4 items-center  mb-4">
                    <ImageCropper key={logo} isLoading={loading} className="w-24 h-24" oldPreview={logo} onFileSelected={item => { setNewLogo(item) }} oldPreviewUpdate={setLogo} />
                    <div className="w-full flex gap-4">
                      <Button isDisabled={newLogo === undefined ? true : false} isLoading={processLoading} buttonMd text="Logoyu Kaydet" block design="button button-blue-400 w-32" onClick={() => updateProPhoto()} />
                      <Button buttonMd text="Sil" block design="button lg:w-16" onClick={() => showDeletePhoto()} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="İsim Soyisim" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={nameSurname} onChange={(e) => { setNameSurname(e.target.value); }} />
                    }
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="E-posta Adresi" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={email} onChange={(e) => { setEmail(e.target.value); }} />
                    }
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="Telefon Numarası" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <PhoneInput ref={phoneInputRef} onChange={setPhone} initValue={phone?.phone} />
                    }
                  </div>
                  {
                    loading ?
                      <Loading inputSm />
                      :
                      <div className="mb-2 mt-4 flex items-center justify-between">
                        <Label title="Doğrulanma Durumu" withoutDots />
                        <ToggleButton defaultValue={isVerified} onClick={() => { setIsVerified(!isVerified); }} />
                      </div>
                  }
                </div>
                <div className="w-1/2">
                  <h4 className="mb-4">Firma Bilgileri</h4>
                  <div className="mb-2">
                    <Label className="mt-4" title="Profesyonel / Şirket Adı" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={storeName} onChange={(e) => { setStoreName(e.target.value); }} />
                    }
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="Şirket Türü" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <Dropdown
                          isDropDownOpen={currentOpenedFilterButton === "selectFirmType"}
                          onClick={() => { setCurrentOpenedFilterButton("selectFirmType"); }}
                          className="w-full font-medium mb-2 lg:mb-0"
                          classNameDropdown=""
                          label={selectedFirmTypeOption.value}
                          icon
                          items={firmTypeOptions}
                          onItemSelected={item => { setCurrentOpenedFilterButton(""); setSelectedFirmTypeOption(item); }} />
                    }
                  </div>
                  {(selectedFirmTypeOption.key === "2" || selectedFirmTypeOption.value === "7") &&
                    <div className="mb-2">
                      <Label className="mt-4" title="TC No" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <input className="form-input" type="text" value={citizenshipNumber} onChange={(e) => { setCitizenshipNumber(e.target.value); }} />
                      }
                    </div>
                  }
                  {(selectedFirmTypeOption.key !== "2" && selectedFirmTypeOption.value !== "7") &&
                    <>
                      <div className="mb-2">
                        <Label className="mt-4" title="Vergi Numarası" withoutDots />
                        {
                          loading ?
                            <Loading inputSm />
                            :
                            <input className="form-input" type="text" value={taxNumber} onChange={(e) => { setTaxNumber(e.target.value); }} />
                        }
                      </div>
                      <div className="mb-2">
                        <Label className="mt-4" title="Vergi Dairesi" withoutDots />
                        {
                          loading ?
                            <Loading inputSm />
                            :
                            <input className="form-input" type="text" value={taxDepartment} onChange={(e) => { setTaxDepartment(e.target.value); }} />
                        }
                      </div>
                    </>
                  }
                  {/* <div className="mb-2">
                    <Label className="mt-4" title="Cari Ünvan" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={companyTitle} onChange={(e) => { setCompanyTitle(e.target.value); }} />
                    }
                  </div> */}
                  <div className="mb-2">
                    <Label className="mt-4" title="Profesyonel ID" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="py-3 px-3 w-full border border-gray-300 rounded-lg text-sm outline-none focus:outline-none focus:border-blue-400 transition-all duration-300 disabled-50" type="number" value={proId} disabled onChange={(e) => { }} />
                    }
                  </div>

                  {/* <div className="mb-2">
                    <Label className="mt-4" title="KEP Adresi" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={kepAddress} onChange={(e) => { setKepAddress(e.target.value); }} />
                    }
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="Mersis Numarası" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={mersisNumber} onChange={(e) => { setMersisNumber(e.target.value); }} />
                    }
                  </div> */}
                </div>
              </div>
              <div className="w-full flex border-b border-grey-400 py-4 gap-8">
                {/* <div className="w-1/2">
                  <div>
                    <h4 className="mb-4">Müşteri İletişim Bilgileri</h4>
                    <div className="flex mb-2 gap-2">
                      <EnvelopeIcon className="w-4 h-4 my-auto" />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <input className="form-input" type="text" value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); }} />
                      }
                    </div>
                    <div className="flex mb-2 gap-2">
                      <WebIcon className="w-4 h-4 my-auto" />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <input className="form-input" type="text" value={websiteUrl} onChange={(e) => { setWebsiteUrl(e.target.value); }} />
                      }
                    </div>
                    <div className="flex mb-2 gap-2">
                      <MapPinIcon className="w-4 h-4 my-auto" />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <input className="form-input" type="text" value={contactAddress} onChange={(e) => { setContactAddress(e.target.value); }} />
                      }
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="mb-4">Yönetici İletişim Bilgileri</h4>
                    <h5 className="mb-4">Birincil İletişim Bilgisi</h5>
                    {
                      loading ?
                        <Loading inputMd />
                        :
                        (proDetail?.ContactList && proDetail.ContactList.length > 0 && proDetail.ContactList.find(x => x.IsDefault === true)) ?
                          <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                            <div className="mb-2 flex">
                              <h5>İletişim Bilgisi #1</h5>
                              <div className="flex ml-auto text-gray-900 gap-2">
                                <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenUpdateContactModal(proDetail.ContactList.find(x => x.IsDefault === true)); }} />
                                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteContact(proDetail.ContactList.find(x => x.IsDefault === true)?.Id ?? 0); }} />
                              </div>
                            </div>
                            <div className="flex mb-2">
                              <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Görev / Ünvan:</span></div>
                              <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList.find(x => x.IsDefault === true)?.Title}</span> </div>
                            </div>
                            <div className="flex mb-2">
                              <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>İsim Soyisim:</span></div>
                              <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList.find(x => x.IsDefault === true)?.NameSurname}</span> </div>
                            </div>
                            <div className="flex mb-2">
                              <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>E-posta:</span></div>
                              <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList.find(x => x.IsDefault === true)?.Email}</span> </div>
                            </div>
                            <div className="flex mb-2">
                              <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Telefon:</span></div>
                              <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList.find(x => x.IsDefault === true)?.PhonePreview}</span> </div>
                            </div>
                            <div className="flex mb-2">
                              <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Oluşturulma Tarihi:</span></div>
                              <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList.find(x => x.IsDefault === true)?.CreatedDate}</span> </div>
                            </div>
                            <div className="flex">
                              <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Açıklama:</span></div>
                              <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList.find(x => x.IsDefault === true)?.Description}</span> </div>
                            </div>
                          </div>
                          :
                          (proDetail?.ContactList && proDetail.ContactList.length > 0) ?
                            <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                              <div className="mb-2 flex">
                                <h5>İletişim Bilgisi #1</h5>
                                <div className="flex ml-auto text-gray-900 gap-2">
                                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenUpdateContactModal(proDetail.ContactList.find(x => x.IsDefault === true)); }} />
                                </div>
                              </div>
                              <div className="flex mb-2">
                                <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Görev / Ünvan:</span></div>
                                <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList[0]?.Title}</span> </div>
                              </div>
                              <div className="flex mb-2">
                                <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>İsim Soyisim:</span></div>
                                <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList[0]?.NameSurname}</span> </div>
                              </div>
                              <div className="flex mb-2">
                                <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>E-posta:</span></div>
                                <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList[0]?.Email}</span> </div>
                              </div>
                              <div className="flex mb-2">
                                <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Telefon:</span></div>
                                <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList[0]?.PhonePreview}</span> </div>
                              </div>
                              <div className="flex mb-2">
                                <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Oluşturulma Tarihi:</span></div>
                                <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList[0]?.CreatedDate}</span> </div>
                              </div>
                              <div className="flex">
                                <div className="my-auto flex text-gray-700 text-sm font-medium w-1/5"><span>Açıklama:</span></div>
                                <div className="flex my-auto text-sm text-gray-900"><span className="ml-2">{proDetail.ContactList[0]?.Description}</span> </div>
                              </div>
                            </div>
                            :
                            <></>
                    }
                  </div>
                </div> */}
                <div className="w-1/2">
                  <h4 className="mb-4">Banka Hesap Bilgileri</h4>
                  <div className="mb-2">
                    <Label className="mt-4" title="Hesap Sahibi / Ünvanı" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={bankNameSurname} onChange={(e) => { setBankNameSurname(e.target.value); }} />
                    }
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="IBAN" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <InputWithMask IBAN value={iban} onChange={(e) => { setIban(e.target.value) }} />
                    }
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="Banka" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <Dropdown
                          isDropDownOpen={currentOpenedFilterButton === "selectBank"}
                          onClick={() => { setCurrentOpenedFilterButton("selectBank"); }}
                          className="w-full text-gray-900 font-medium mb-2 lg:mb-0"
                          classNameDropdown="h-48 overflow-y-auto custom-scrollbar"
                          label={selectedBankOption.value}
                          icon
                          items={bankOptions}
                          onItemSelected={item => { setSelectedBankOption(item); setCurrentOpenedFilterButton(""); }} />
                    }
                  </div>
                  {/* <div className="mb-2">
                    <Label className="mt-4" title="Şube Adı" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={branchName} onChange={(e) => { setBranchName(e.target.value); }} />
                    }
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="Şube Kodu" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={branchCode} onChange={(e) => { setBranchCode(e.target.value); }} />
                    }
                  </div>
                  <div className="mb-2">
                    <Label className="mt-4" title="Hesap No" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <input className="form-input" type="text" value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value); }} />
                    }
                  </div> */}
                </div>
              </div>
              <div className="w-full flex border-b border-grey-400 py-4 gap-8">
                <div className="w-1/2">
                  <h4 className="mb-4">Adres Bilgileri</h4>
                  <div className="mt-4 flex">
                    <h5>Fatura Adresi</h5>
                    <div className="flex ml-auto text-blue-400 gap-2 text-sm font-medium cursor-pointer" onClick={() => { handleShowAddressSetModal(1); }}>
                      Değiştir
                    </div>
                  </div>
                  {
                    proAddresses.find(x => x.Id === billAddressId) &&
                    <>
                      <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                        <div className="mb-2 flex">
                          <h5>{proAddresses.find(x => x.Id === billAddressId)?.AddressName ?? "-"}</h5>
                          <div className="flex ml-auto text-gray-900 gap-2">
                            <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenAddressUpdateModal(proAddresses.find(x => x.Id === billAddressId)); }} />
                          </div>
                        </div>
                        <div className="mb-2 my-auto text-sm text-gray-900 ">{proAddresses.find(x => x.Id === billAddressId)?.PhonePreview ?? "-"}</div>
                        <div className="mb-2 my-auto text-sm text-gray-900 ">{proAddresses.find(x => x.Id === billAddressId)?.AddressDescription ?? "-"}</div>
                        <div className="mb-2 my-auto text-sm text-gray-900 ">{(proAddresses.find(x => x.Id === billAddressId)?.District ?? "-") + " / " + (proAddresses.find(x => x.Id === billAddressId)?.City ?? "-") + " / " + (proAddresses.find(x => x.Id === billAddressId)?.Country ?? "-")}</div>
                        <div className="my-auto text-sm text-gray-900 ">{proAddresses.find(x => x.Id === billAddressId)?.ZipCode ?? "-"}</div>
                      </div>
                    </>
                  }
                </div>
                <div className="w-1/2">
                  <h4 className="mb-4">Kayıtlı Adresler</h4>
                  {
                    proAddresses.map((item) => (
                      <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                        <div className="mb-2 flex">
                          <h5>{item.AddressName}</h5>
                          <div className="flex ml-auto text-gray-900 gap-2">
                            <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenAddressUpdateModal(item); }} />
                            {
                              item.Id !== billAddressId &&
                              <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteProAddress(item); }} />
                            }
                          </div>
                        </div>
                        <div className="mb-2 my-auto text-sm text-gray-900 ">{item.PhonePreview ?? "-"}</div>
                        <div className="mb-2 my-auto text-sm text-gray-900 ">{item.AddressDescription ?? "-"}</div>
                        <div className="mb-2 my-auto text-sm text-gray-900 ">{(item.District ?? "-") + " / " + (item.City ?? "-") + " / " + (item.Country ?? "-")}</div>
                        <div className="my-auto text-sm text-gray-900 ">{item.ZipCode}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="flex mt-40">
                <Button isLoading={processLoading} textTiny className="ml-auto w-24" text="Vazgeç" color="text-gray-400" onClick={() => { handleShowCancelModal(); }} />
                <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateProData(); }} />
              </div>
            </>
            :
            selectedTabsId === 2 ?
              <>
                <div className="border-b border-gray-200">
                  <div className="py-4 w-1/3 ">
                    <h4 className="mb-4">Hizmetler</h4>
                    <div className="mb-2">
                      <Label className="mt-4" title="Profesyonel Kategoriniz" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <Dropdown
                            isDropDownOpen={currentOpenedFilterButton === "selectProCategory"}
                            onClick={() => { setCurrentOpenedFilterButton("selectProCategory"); }}
                            className="w-full text-gray-900 font-medium mb-2 lg:mb-0"
                            classNameDropdown="max-h-40 overflow-y-auto custom-scrollbar"
                            label={selectedProCategoryOption.value}
                            icon
                            items={proCategoryOptions}
                            onItemSelected={item => { setCurrentOpenedFilterButton(""); setSelectedProCategoryOption(item); }} />
                      }
                    </div>
                    <div className="mb-2">
                      <Label className="mt-4" title="Hizmet verdiğiniz alanlar" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <Dropdown
                            isDropDownOpen={currentOpenedFilterButton === "selectServiceArea"}
                            onClick={() => { setCurrentOpenedFilterButton("selectServiceArea"); }}
                            className="w-full text-gray-900 font-medium mb-2 lg:mb-0"
                            classNameDropdown="max-h-40 overflow-y-auto custom-scrollbar"
                            label={selectedServiceAreaOption.value}
                            icon
                            items={serviceAreaOptions}
                            isMultiSelect={true}
                            onItemSelected={item => { handleAddSelectedServiceAreaList(item); setSelectedServiceAreaOption({ key: "0", value: "Hizmet Alanı" }); setCurrentOpenedFilterButton(""); }} />
                      }
                      <Label className="mt-4" title="Seçili Hizmetler:" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          selectedServiceAreaList.map((item) => (
                            <div className="flex gap-2 mb-4">
                              <input type="checkbox" className="my-auto border-0" checked={true} onClick={() => { handleRemoveSelectedServiceAreaList(item); }} />
                              <span className="p-sm my-auto font-medium text-gray-900">{item.value}</span>
                            </div>
                          ))
                      }
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-200">
                  <div className="py-4 w-1/3 ">
                    <h4 className="mb-4">Çalışma Saatleri</h4>
                    <div className="flex gap-2 items-center">
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <div className="w-full">
                            <Label className="mt-4" title="Mesai Başlangıç" withoutDots />
                            <div className="relative">
                              <InputWithMask clock value={shiftStart} onChange={(e) => { handleStartHourChange(e.target.value); }} />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <ClockIcon className="icon-md text-gray-900" />
                              </div>
                            </div>
                          </div>
                      }
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <div className="w-full">
                            <Label className="mt-4" title="Mesai Bitiş" withoutDots />
                            <div className="relative">
                              <InputWithMask clock value={shiftEnd} onChange={(e) => { handleEndHourChange(e.target.value); }} />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <ClockIcon className="icon-md text-gray-900" />
                              </div>
                            </div>
                          </div>
                      }
                    </div>
                    <Label className="mt-4" title="Ek Bilgiler" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <>
                          {
                            additionalInfoForWorkList.map((item) => (
                              <div className={`${(item.Id === 4 || item.Id === 8) ? "border-b border-gray-200 pb-4" : ""} flex gap-2 mb-4`}>
                                {
                                  item.Id <= 4 ?
                                    <input type="checkbox"
                                      className="form-checkbox icon-sm text-blue-400 border border-gray-400 cursor-pointer mr-2"
                                      onChange={(e) => { }}
                                      onClick={() => { handlePushRemoveWorkInfo(item) }}
                                      checked={selectedAdditionalInfoForWorkList.includes(item.Name) ? true : false}
                                    />
                                    :
                                    <input type="checkbox"
                                      className="form-checkbox rounded-full icon-sm text-blue-400 border border-gray-400 cursor-pointer mr-2"
                                      onChange={(e) => { }}
                                      onClick={() => { if (!selectedAdditionalInfoForWorkList.includes(item.Name)) { handlePushRemoveWorkInfo(item) } }}
                                      checked={selectedAdditionalInfoForWorkList.includes(item.Name) ? true : false}
                                    />
                                }
                                <span className="p-sm my-auto font-medium text-gray-900">{item.Name}</span>
                              </div>
                            ))
                          }
                        </>
                    }
                  </div>
                </div>
                <div className="border-b border-gray-200">
                  <div className="py-4 w-1/3 ">
                    <h4 className="mb-4">Ücret Standartları</h4>
                    <Label className="mt-4" title="Ücret Aralığı" withoutDots />
                    <div className="flex gap-2 items-center">
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <div className="w-full">
                            <ReactNumeric
                              value={Number(minPrice)}
                              preDefined={autonNumericOptions.TL}
                              onChange={(e, value: number) => { setMinPrice(String(value)) }}
                              className={"form-input"}
                            />
                          </div>
                      }
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <div className="w-full">
                            <ReactNumeric
                              value={Number(maxPrice)}
                              preDefined={autonNumericOptions.TL}
                              onChange={(e, value: number) => { setMaxPrice(String(value)) }}
                              className={"form-input"}
                            />
                          </div>
                      }

                    </div>
                    <Label className="mt-4" title="Ek Bilgiler" withoutDots />
                    {
                      loading ?
                        <Loading inputSm />
                        :
                        <>
                          <div className="flex gap-2 mb-4">
                            <input type="checkbox" className="my-auto border-0" checked={priceData.includes("Bütçe Dostu")} onChange={(e) => { handlePriceDataCheckedChange("Bütçe Dostu", e.target.checked); }} />
                            <span className="p-sm my-auto font-medium text-gray-900">Bütçe Dostu</span>
                          </div>
                          <div className="flex gap-2 mb-4">
                            <input type="checkbox" className="my-auto border-0" checked={priceData.includes("Parçalı Ödemeyi Kabul Ediyor")} onChange={(e) => { handlePriceDataCheckedChange("Parçalı Ödemeyi Kabul Ediyor", e.target.checked); }} />
                            <span className="p-sm my-auto font-medium text-gray-900">Parçalı Ödemeyi Kabul Ediyor</span>
                          </div>
                        </>
                    }
                  </div>
                </div>
                <div className="border-b border-gray-200">
                  <div className="py-4 w-1/3 ">
                    <h4 className="mb-4">Hizmet Bölgeleri</h4>
                    <div className="mb-2">
                      <Label className="mt-4" title="Hizmet Verilen İl" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <Dropdown
                            isDropDownOpen={currentOpenedFilterButton === "selectServiceAreaCity"}
                            onClick={() => { setCurrentOpenedFilterButton("selectServiceAreaCity"); }}
                            className="w-full text-gray-900 font-medium mb-2 lg:mb-0"
                            classNameDropdown="max-h-52 overflow-y-auto custom-scrollbar"
                            label={selectedCityOptionForServiceInfo.value}
                            icon
                            items={cityOptionsForServiceInfo}
                            isSearchable={true}
                            onItemSelected={item => { setCityOptionForServiceInfo(item); setCurrentOpenedFilterButton(""); }} />
                      }
                    </div>
                    <div className="mb-2">
                      <Label className="mt-4" title="Hizmet Verilen Bölge" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <Dropdown
                            isDropDownOpen={currentOpenedFilterButton === "selectServiceAreaDistrict"}
                            onClick={() => { setCurrentOpenedFilterButton("selectServiceAreaDistrict"); }}
                            className="w-full text-gray-900 font-medium mb-2 lg:mb-0"
                            classNameDropdown="max-h-52 overflow-y-auto custom-scrollbar"
                            label={selectedDistrictOptionForServiceInfo.value}
                            icon
                            isMultiSelect={true}
                            isSearchable={true}
                            items={districtOptionsForServiceInfo}
                            onItemSelected={item => { setDistrictOptionForServiceInfo({ key: "0", value: "İlçe" }); setCurrentOpenedFilterButton(""); handleAddSelectedServiceAreaDistrictList(item); }} />

                      }
                      <Label className="mt-4" title="Seçili Bölgeler:" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          selectedServiceAreaDistrictList.map((item) => (
                            <div className="flex gap-2 mb-4">
                              <input type="checkbox" className="my-auto border-0" checked={true} onClick={() => { handleRemoveSelectedServiceAreaDistrictList(item); }} />
                              <span className="p-sm my-auto font-medium text-gray-900">{item.value}</span>
                            </div>
                          ))
                      }
                    </div>
                    <div className="mb-2">
                      <Label className="mt-4" title="Hizmet Verilen Diller" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          <Dropdown
                            isDropDownOpen={currentOpenedFilterButton === "selectedForeignLanguage"}
                            onClick={() => { setCurrentOpenedFilterButton("selectedForeignLanguage"); }}
                            className="w-full text-gray-900 font-medium mb-2 lg:mb-0"
                            classNameDropdown="max-h-52 overflow-y-auto custom-scrollbar"
                            label={selectedForeignLanguageDataOption.value}
                            icon
                            isMultiSelect={true}
                            isSearchable={true}
                            items={tempLanguageOptionsForServiceInfo}
                            onItemSelected={item => { setSelectedForeignLanguageDataOption({ key: "0", value: "Seçiniz" }); setCurrentOpenedFilterButton(""); handleAddSelectedLanguageList(item); }} />

                      }
                      <Label className="mt-4" title="Seçili Diller:" withoutDots />
                      {
                        loading ?
                          <Loading inputSm />
                          :
                          selectedForeignLanguageData.map((item) => (
                            <div className="flex gap-2 mb-4">
                              <input type="checkbox" className="my-auto border-0" checked={true} onClick={() => { handleRemoveSelectedLanguageList(item); }} />
                              <span className="p-sm my-auto font-medium text-gray-900">{item.value}</span>
                            </div>
                          ))
                      }
                    </div>
                  </div>
                </div>
                <div className="flex mt-40">
                  <Button isLoading={processLoading} textTiny className="ml-auto w-24" text="Vazgeç" color="text-gray-400" onClick={() => { handleShowCancelModal(); }} />
                  <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { prepareShiftData(); }} />
                </div>
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <div className="py-4 ">
                    <div className="w-2/3">
                      <h2>Profesyonel Galerisi</h2>
                      {
                        loading ?
                          <div className="flex gap-2">
                            <Loading height="h-60" width="w-72" />
                            <Loading height="h-60" width="w-72" />
                            <Loading height="h-60" width="w-72" />
                          </div>
                          :
                          <div className="mt-3 overflow-x-auto  whitespace-nowrap  custom-scrollbar">
                            <SRLWrapper>
                              {
                                mediaList?.map((item) => (
                                  <div className="w-72 h-60 inline-block mr-2 relative z-0">
                                    <div className="absolute right-5 top-5 bg-white w-8 h-8 rounded-sm z-10 flex font-medium justify-center cursor-pointer select-none" onClick={() => { handleChangeShowDeleteMediaId(item.MediaId); }}><span className="mb-2">...</span></div>
                                    {
                                      item.MediaId === showDeleteMediaId &&
                                      <div className="absolute right-5 top-16 bg-white w-20 h-8 pl-2 rounded-sm z-10 flex gap-1 font-medium  cursor-pointer select-none" onClick={() => { handleShowDeleteMediaModal(item.MediaId); }}>
                                        <TrashIcon className="w-4 h-4 text-gray-700 my-auto" />
                                        <div className="text-sm text-gray-700 my-auto">Sil</div>
                                      </div>
                                    }
                                    <Image className="w-72 h-60 object-cover cursor-pointer" src={item.FileUrl} alt={item.FileName}></Image>
                                  </div>
                                ))
                              }
                            </SRLWrapper>
                          </div>
                      }
                    </div>
                  </div>
                  <div className="py-4 border-t border-gray-200">
                    <div className="w-2/3">
                      <h2>Profesyonel Üyelikleri</h2>
                      <div className="mb-2">
                        <Label className="mt-4" title="Üyelik Ekle" withoutDots />
                        {
                          loading ?
                            <div className="w-1/3">
                              <Loading inputSm />
                            </div>
                            :
                            <Dropdown
                              isDropDownOpen={currentOpenedFilterButton === "selectSociety"}
                              onClick={() => { setCurrentOpenedFilterButton("selectSociety"); }}
                              className="w-2/3 text-gray-900 font-medium mb-2 lg:mb-0"
                              classNameDropdown="w-2/3"
                              label={selectedSocietyOption.value}
                              icon
                              items={societyListOptions}
                              onItemSelected={item => { handleAddSelectedSocietyList(item); setSelectedSocietyOption({ key: "0", value: "Üyelik" }); setCurrentOpenedFilterButton(""); }} />
                        }
                      </div>
                      <Label className="mt-4" title="Seçili Üyelikler:" withoutDots />
                      {
                        loading ?
                          <div className="w-1/3">
                            <Loading inputSm />
                          </div>
                          :
                          selectedSocietyList.map((item) => (
                            <div className="flex gap-2 mb-4">
                              <input type="checkbox" className="my-auto border-0" checked={true} onClick={() => { handleRemoveSelectedSocietyList(item); }} />
                              <span className="p-sm my-auto font-medium text-gray-900">{item.value}</span>
                            </div>
                          ))
                      }
                    </div>
                  </div>
                  <div className="py-4 border-t border-gray-200">
                    <div className="w-2/3">
                      <h2>Profesyonel İçerikleri</h2>
                      {
                        loading ?
                          <>
                            <Loading className="mt-3" height="h-60" width="w-100" />
                          </>
                          :
                          <>
                            <input className="form-input bg-gray-100 my-3" value="Tanıtım Yazısı" disabled />
                            <CKEditor
                              editor={ClassicEditor}
                              data={introText}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setIntroText(data);
                              }}
                            />
                            {
                              sectionData.map((item, index) => (
                                <>
                                  <div className="flex p-sm-gray-700 mt-3" key={"sectionData" + index}>
                                    <div>Sekme Başlığı</div>
                                    <div className="flex ml-auto gap-2 justify-center cursor-pointer" onClick={() => handleRemoveSectionArray(item)}>
                                      <TrashIcon className="h-4 w-4 ml-auto my-auto" />
                                      <div className="my-auto">Sekmeyi Sil</div>
                                    </div>
                                  </div>
                                  <input className="form-input mt-2 mb-3" value={item.Title} onChange={(e) => changeSectionTitle(e.target.value, index)} />
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={item.Description}
                                    onChange={(event, editor) => {
                                      const data = editor.getData();
                                      changeSectionDescription(data, index)
                                    }}
                                  />
                                </>
                              ))
                            }
                          </>
                      }
                    </div>
                  </div>
                  <div className="flex mt-40">
                    <Button isLoading={processLoading} textTiny className="ml-auto w-24" text="Vazgeç" color="text-gray-400" onClick={() => { handleShowCancelModal(); }} />
                    <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateProProfile(); }} />
                  </div>
                </>
                :
                <></>
        }
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showUpdateContactModal}
        onClose={() => { setShowUpdateContactModal(false); }}
        title="İletişim Bilgisi Düzenle"
        body={
          <div>
            <div className="flex gap-2 ">
              <div className="w-1/2">
                <Label isRequired withoutDots title="Görev / Ünvan" className="mt-4" />
                <input className="form-input" type="text" value={contactModalTitle} onChange={(e) => { setContactModalTitle(e.target.value); }} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Yetkili İsim Soyisim" className="mt-4" />
                <input className="form-input" type="text" value={contactModalName} onChange={(e) => { setContactModalName(e.target.value); }} />
              </div>
            </div>
            <div className="flex gap-2 ">
              <div className="w-1/2">
                <Label isRequired withoutDots title="E-posta" className="mt-4" />
                <input className="form-input" type="text" value={contactModalEmail} onChange={(e) => { setContactModalEmail(e.target.value); }} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Telefon Numarası" className="mt-4" />
                <PhoneInput ref={phoneInputRef} onChange={setContactModalPhone} initValue={contactModalPhone?.phone} />
              </div>
            </div>
            <div>
              <Label isRequired withoutDots title="Açıklama" className="mt-4" />
              <input className="form-input" type="text" value={contactModalDescription} onChange={(e) => { setContactModalDescription(e.target.value); }} />
            </div>
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { setShowUpdateContactModal(false); updateProContact(); }}></Button>
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
              Lütfen fatura adresi olarak tanımlanacak adres seçimi yapınız.
            </div>
            {
              proAddresses.map((item) => (
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
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Onayla" onClick={() => { setShowSetUpdateModal(false); changeAddressType(); }}></Button>
        }
      />
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
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { updateProAddress(); }}></Button>
        }
      />
    </div >
  )
}
