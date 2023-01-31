import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { AlertIcon, ChevronRightIcon, EditIcon, EyeOffIcon, MagnifyGlassIcon, TrashIcon } from "../Components/Icons";
import { TabsTitle } from "../Components/TabsTitle";
import { Image } from "../Components/Image";
import { SellerOrderModel, ProductAdvertListInnerModel, SellerContactModel, SellerAddressModel, SellerDocumentModel, OrderListInnerModel, StoreRatesModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Loading } from "../Components/Loading";
import { Table } from "../Components/Table";
import { Modal } from "../Components/Modal";
import { Label } from "../Components/Label";
import { PhoneInput, PhoneResultModel } from "../Components/PhoneInput";
import { useStateEffect } from "../Components/UseStateEffect";
import { StoreEvaluation } from "../Components/StoreEvaluation";
import { formatter, fraction } from "../Services/Functions"
import { OrderListRow } from "../Components/OrderListRow";
import { PerformanceCard } from "../Components/PerformanceCard";

interface RouteParams {
  id: string
}
interface LocationParams {
  prevTitle: string,
  prevPath: string,
  tabId: number,
  queryPage: number,
}

export const SellerDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const location = useLocation<LocationParams>();

  const history = useHistory();

  const tableEl = useRef<any>();

  const [loading, setLoading] = useState<boolean>(false);

  const [tabsLink, setTabLinks] = useState([
    { id: 1, name: "Mağaza Bilgisi", disabled: false },
    // { id: 2, name: "İletişim Bilgileri", disabled: false },
    { id: 3, name: "Satıcı Belgeleri", disabled: false },
    { id: 4, name: "Ürünler", disabled: true },
    { id: 5, name: "Siparişler", disabled: true },
    { id: 6, name: "Mağaza Puanı", disabled: true },
    { id: 7, name: "Mağaza Değerlendirmeleri", disabled: true }
  ]);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(location.state?.tabId ?? 1);

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
  ];

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const [sellerStatus, setSellerStatus] = useState<number>(0);

  //#region TAB 1

  const [showRejectSellerModal, setShowRejectSellerModal] = useState<boolean>(false);

  const [showRejectedReasonModal, setShowRejectedReasonModal] = useState<boolean>(false);

  const [rejectType, setRejectType] = useState<string>("");

  const [rejectReason, setRejectReason] = useState<string>("");

  const [logo, setLogo] = useState<any>("");

  const [ownerName, setOwnerName] = useState<string>("");

  const [emailAddress, setEmailAddress] = useState<string>("");

  const [contactNumber, setContactNumber] = useState<string>("");

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

  const [accountOwnerName, setAccountOwnerName] = useState<string>("");

  const [bankOptions, setBankOptions] = useState<{ key: string, value: string }[]>([{ key: "0", value: "Banka" }]);

  const [selectedBankOption, setSelectedBankOption] = useState<{ key: string, value: string }>({ key: "0", value: "Banka" });

  const [iban, setIban] = useState<string>("");

  const [bankBranchName, setBankBranchName] = useState<string>("");

  const [bankBranchCode, setBankBranchCode] = useState<string>("");

  const [accountNumber, setAccountNumber] = useState<string>("");

  const [sellerAddresses, setSellerAdresses] = useState<SellerAddressModel[]>([]);

  const [billAddressId, setBillAddressId] = useState<number>(0);

  const [refundAddressId, setRefundAddressId] = useState<number>(0);

  const [shippingAddressId, setShippingAddressId] = useState<number>(0);

  const [rejectedTitle, setRejectedTitle] = useState<string>("");

  const [rejectedReason, setRejectedReason] = useState<string>("");

  const [rejectedDate, setRejectedDate] = useState<string>("");

  const [canSendPrivateCargo, setCanSendPrivateCargo] = useState<boolean>(false);

  //#endregion

  //#region TAB 2

  const [showUpdateContactModal, setShowUpdateContactModal] = useState<boolean>(false);

  const [contactId, setContactId] = useState<number>(0);

  const [contactTitle, setContactTitle] = useState<string>("");

  const [contactName, setContactName] = useState<string>("");

  const [contactEmail, setContactEmail] = useState<string>("");

  const [contactPhone, setContactPhone] = useState<PhoneResultModel>();

  const [contactDescription, setContactDescription] = useState<string>("");

  const phoneInputRef = useRef<any>();

  //#endregion

  //#region TAB 3

  const [documentList, setDocumentList] = useState([
    // {
    //   Id: 0,
    //   DocumentTitle: "Ortaklık Sözleşmesi",
    //   UploadDate: "",
    //   DocumentStatus: 1,
    //   RejectReason: "",
    //   DocumentPath: ""
    // },
    // {
    //   Id: 1,
    //   DocumentTitle: "Vergi Levhası Fotokopisi",
    //   UploadDate: "",
    //   DocumentStatus: 0,
    //   RejectReason: "",
    //   DocumentPath: ""
    // },
    {
      Id: 2,
      DocumentTitle: "İmza Sirküleri",
      UploadDate: "-",
      DocumentStatus: 0,
      RejectReason: "",
      DocumentPath: ""
    },
    // {
    //   Id: 3,
    //   DocumentTitle: "Ticaret Sicili Güncel Faaliyet Belgesi (Aslı)",
    //   UploadDate: "",
    //   DocumentStatus: 0,
    //   RejectReason: "",
    //   DocumentPath: ""
    // },
    // {
    //   Id: 4,
    //   DocumentTitle: "Nüfus Cüzdanı Fotokopisi",
    //   UploadDate: "",
    //   DocumentStatus: 0,
    //   RejectReason: "",
    //   DocumentPath: ""
    // },
  ]);

  const [documentChangeStatusMessage, setDocumentChangeStatusMessage] = useState<string>("");

  const [sellerDocuments, setSellerDocuments] = useState<SellerDocumentModel>();

  const [taxPlateStat, setTaxPlateStat] = useState<number>(0);

  const [signatureCircStat, setSignatureCircStat] = useState<number>(0);

  const [registryStat, setRegistryStat] = useState<number>(0);

  const [birthStat, setBirthStat] = useState<number>(0);

  const [rejectDocumentModalType, setRejectDocumentModalType] = useState<number>(0);

  const [rejectDocumentModalReason, setRejectDocumentModalReason] = useState<string>("");

  const [showRejectDocumentModal, setShowRejectDocumentModal] = useState<boolean>(false);

  const [isApproveClicked, setIsApprovedClicked] = useState<boolean>(false);

  //#endregion

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  //#region TAB 4

  const sortOptionsAdverts = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Fiyata göre azalan" },
    { key: "4", value: "Fiyata göre artan" }
  ];

  const advertTableEl = useRef<any>();

  const getSellerAdvertsForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerAdvertsForAdmin(Number(params.id ?? "0"), page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  //#endregion

  //#region TAB 5

  const sortOptionsOrders = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sipariş Tutarı Azalan" },
    { key: "4", value: "Sipariş Tutarı Artan" },
  ];

  const tableOrderList = useRef<any>();

  const returnHeader = () => {
    return <div className="lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-2">
      <div className="lg:col-span-1 flex items-center">
        <span className="text-sm text-gray-700 font-medium">
          Sipariş Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Ürün Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Alıcı Bilgileri
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Satış Tutarı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium">
          Son Gönderim Tarihi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium ">
          Oluşturulan Gönderi Adedi
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="text-sm text-gray-700 font-medium ">
          Sipariş Durumu
        </span>
      </div>
    </div>
  }

  const getSellerOrdersForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerOrdersForAdmin(Number(params.id ?? "0"), page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  //#endregion

  useEffect(() => {
    getBankList();
  }, []);

  useStateEffect(() => {
    getSellerDetail();
  }, [bankOptions]);

  const handleChangeTab = (Id: number) => {
    setSelectedTabsId(Id);
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

  const getSellerDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getSellerDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setSellerStatus(_result.data.Status);
      setIsEnabled(_result.data.IsEnabled);
      setLogo(_result.data.Logo);
      setOwnerName(_result.data.NameSurname ?? "-");
      setEmailAddress(_result.data.Email ?? "-");
      setContactNumber(_result.data.PhonePreview ?? "-");
      setStoreName(_result.data.StoreName ?? "-");
      setSelectedFirmTypeOption(firmTypeOptions.find(x => x.key === _result.data.CompanyType.toString()) ?? { key: "0", value: "Firma Tipi" });
      setTaxNumber(_result.data.TaxNumber ?? "-");
      setCompanyTitle(_result.data.CompanyTitle ?? "-");
      setSellerId(_result.data.Id.toString());
      setTaxDepartment(_result.data.TaxDepartment ?? "-");
      setKepAddress(_result.data.KepAddress ?? "-");
      setMersisNumber(_result.data.MersisNumber ?? "-");
      setCitizenshipNumber(_result.data.CitizenshipNumber);

      setDefaultContact(_result.data.ContactList[0]);

      setAccountOwnerName(_result.data.BankInfo.NameSurname);
      setIban(_result.data.BankInfo.IBAN ?? "-");
      setSelectedBankOption(bankOptions.find(x => x.key === _result.data.BankInfo.BankId.toString()) ?? { key: "0", value: "-" });
      setBankBranchName(_result.data.BankInfo.BranchName ?? "-");
      setBankBranchCode(_result.data.BankInfo.BranchCode ?? "-");
      setAccountNumber(_result.data.BankInfo.AccountNumber ?? "-");

      setBillAddressId(_result.data.BillAddressId);
      setRefundAddressId(_result.data.RefundsAddressId);
      setShippingAddressId(_result.data.ShippingAddressId);

      setSellerAdresses(_result.data.AddressList);

      setSellerDocuments(_result.data.DocumentInfo);

      setRejectedTitle(_result.data.RejectTitle);
      setRejectedReason(_result.data.RejectReason);
      setRejectedDate(_result.data.RejectDate);

      setCanSendPrivateCargo(_result.data.CanCreateIndividualCargo)

      if (_result.data.Status === 3) {
        let _tempTabsLink = tabsLink;
        _tempTabsLink.forEach((item) => {
          item.disabled = false;
        })
        setTabLinks(JSON.parse(JSON.stringify(_tempTabsLink)));
      }

      if (_result.data.DocumentInfo != null) {
        let _tempDocumentList = documentList;
        _tempDocumentList.forEach(element => {
          let _tempElement;
          if (element.Id === 0) {
            element.DocumentStatus = _result.data.DocumentInfo.PartnershipAgreementVerified ? 2 : 1;
          }
          else if (element.Id === 1) {
            element.UploadDate = _result.data.DocumentInfo.TaxPlateUploadDate;
            element.DocumentStatus = _result.data.DocumentInfo.TaxPlateStatue;
            element.RejectReason = _result.data.DocumentInfo.TaxPlateRejectReason;
            element.DocumentPath = _result.data.DocumentInfo.TaxPlate;
          }
          else if (element.Id === 2) {
            element.UploadDate = _result.data.DocumentInfo.SignatureCircularsUploadDate;
            element.DocumentStatus = _result.data.DocumentInfo.SignatureCircularsStatue;
            element.RejectReason = _result.data.DocumentInfo.SignatureCircularsRejectReason;
            element.DocumentPath = _result.data.DocumentInfo.SignatureCirculars;
          }
          else if (element.Id === 3) {
            element.UploadDate = _result.data.DocumentInfo.RegistryGazetteUploadDate;
            element.DocumentStatus = _result.data.DocumentInfo.RegistryGazetteStatue;
            element.RejectReason = _result.data.DocumentInfo.RegistryGazetteRejectReason;
            element.DocumentPath = _result.data.DocumentInfo.RegistryGazette;
          }
          else if (element.Id === 4) {
            element.UploadDate = _result.data.DocumentInfo.BirthCertificateUploadDate;
            element.DocumentStatus = _result.data.DocumentInfo.BirthCertificateStatue;
            element.RejectReason = _result.data.DocumentInfo.BirthCertificateRejectReason;
            element.DocumentPath = _result.data.DocumentInfo.BirthCertificate;
          }
        });
        setDocumentList(JSON.parse(JSON.stringify(_tempDocumentList)));

      }
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push(location.state?.prevPath ?? "/onayli-satici-listesi"); }
      });
    }
  }

  const changeSellerStatus = async () => {
    context.showModal({
      type: "Question",
      title: isEnabled ? "Pasifleştir" : "Aktifleştir",
      message: isEnabled ? "Satıcı pasifleştirilecek. Emin misiniz?" : "Satıcı aktifleştirilecek. Emin misiniz?",
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.changeSellerStatus(Number(params.id ?? "0"), !isEnabled);

        setProcessLoading(false);

        context.hideModal();

        if (_result.succeeded === true) {

          context.showModal({
            type: "Success",
            title: isEnabled ? "Satıcı pasifleştirildi" : "Satıcı aktifleştirildi",
            message: "",
            onClose: () => { setIsEnabled(!isEnabled); context.hideModal(); }
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

  const handleDeleteSeller = (isApplication?: boolean) => {
    context.showModal({
      type: "Question",
      title: `Satıcı ${isApplication ? "başvurusu" : ""} silinecek emin misiniz?`,
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.deleteSeller(Number(params.id ?? "0"));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: `Satıcı ${isApplication ? "başvurusu" : ""} başarıyla silindi`,
            onClose: () => {
              context.hideModal(); setProcessLoading(false);
              isApplication ?
                history.push(`/satici-basvuru-listesi`)
                :
                history.push(`/onayli-satici-listesi`)
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); setProcessLoading(false); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); }
    });
  }

  const getSellerContactList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerDetailContactList(Number(params.id ?? "0"), page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const handleDeleteContact = (ContactId: number) => {
    context.showModal({
      type: "Question",
      title: "İletişim bilgisi silinecek emin misiniz?",
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.deleteSellerContact(ContactId ?? 0);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İletişim bilgisi silindi",
            onClose: () => {
              context.hideModal();
              setProcessLoading(false);
              if (tableEl.current) {
                tableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); setProcessLoading(false); getSellerDetail(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); }
    });
  }

  const handleShowUpdateContactModal = (item) => {
    setContactId(item.Id);
    setContactName(item.NameSurname);
    setContactPhone({ purePhone: "", maskedPhone: "", phone: item.Phone, phonePreview: "", pureCountryCode: "", previewCountryCode: "" });
    setContactEmail(item.Email);
    setContactDescription(item.Description);
    setContactTitle(item.Title);

    setShowUpdateContactModal(true);
  }

  const updateContact = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSellerContact(contactId, contactName, contactEmail, contactPhone?.phone ?? "", contactDescription, contactTitle);

    setProcessLoading(false);
    setShowUpdateContactModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İletişim bilgisi düzenlendi",
        onClose: () => {
          context.hideModal();
          if (tableEl.current) {
            tableEl.current?.reload();
          }
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setShowUpdateContactModal(true); }
      });
    }
  }

  const handleApproveSeller = () => {
    context.showModal({
      type: "Question",
      title: "ONAYLA",
      message: "Satıcı onaylanacak emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.approveSeller(Number(params.id ?? 0));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Satıcı onaylandı",
            onClose: () => { context.hideModal(); history.push("/onayli-satici-listesi"); }
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

  const handleOpenRejectModal = () => {
    setRejectType("");
    setRejectReason("");
    setShowRejectSellerModal(true);
  }

  const handleRejectSeller = async () => {
    setShowRejectSellerModal(false);
    setProcessLoading(true);

    const _result = await ApiService.rejectSeller(Number(params.id ?? 0), rejectType, rejectReason);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Satıcı reddedildi",
        onClose: () => { context.hideModal(); history.push("/satici-basvuru-listesi"); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setShowRejectSellerModal(true); }
      });
    }
  }

  useEffect(() => {
    if (isApproveClicked) {
      changeSellerDocumentStatus();
      setIsApprovedClicked(false);
    }
  }, [taxPlateStat]);

  useEffect(() => {
    if (isApproveClicked) {
      changeSellerDocumentStatus();
      setIsApprovedClicked(false);
    }
  }, [signatureCircStat]);

  useEffect(() => {
    if (isApproveClicked) {
      changeSellerDocumentStatus();
      setIsApprovedClicked(false);
    }
  }, [registryStat]);

  useEffect(() => {
    if (isApproveClicked) {
      changeSellerDocumentStatus();
      setIsApprovedClicked(false);
    }
  }, [birthStat]);

  const handleApproveDocumentStatus = (Type) => {
    setDocumentChangeStatusMessage("Belge onaylandı.");

    if (Type === 1) {
      setTaxPlateStat(2);
    }
    else if (Type === 2) {
      setSignatureCircStat(2);
    }
    else if (Type === 3) {
      setRegistryStat(2);
    }
    else if (Type === 4) {
      setBirthStat(2);
    }
  }

  const handleCloseRejectDocumentModal = () => {
    setIsApprovedClicked(true);
    setDocumentChangeStatusMessage("Belge reddedildi.");

    if (rejectDocumentModalType === 1) {
      setTaxPlateStat(3);
    }
    else if (rejectDocumentModalType === 2) {
      setSignatureCircStat(3);
    }
    else if (rejectDocumentModalType === 3) {
      setRegistryStat(3);
    }
    else if (rejectDocumentModalType === 4) {
      setBirthStat(3);
    }
  }

  const handleOpenRejectDocumentModal = (Type) => {
    setRejectDocumentModalType(Type);
    setRejectDocumentModalReason("");
    setShowRejectDocumentModal(true);
  }

  const changeSellerDocumentStatus = async () => {
    setProcessLoading(true);

    const _result = await ApiService.changeDocumentStatus(Number(params.id ?? 0), taxPlateStat, rejectDocumentModalReason, signatureCircStat, rejectDocumentModalReason, registryStat, rejectDocumentModalReason, birthStat, rejectDocumentModalReason);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: documentChangeStatusMessage,
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          setIsApprovedClicked(false);
          setTaxPlateStat(1);
          setSignatureCircStat(1);
          setBirthStat(1);
          setRegistryStat(1);
          getSellerDetail();
          // history.push("/satici-basvuru-listesi");
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          setIsApprovedClicked(false);
          setTaxPlateStat(1);
          setSignatureCircStat(1);
          setBirthStat(1);
          setRegistryStat(1);
        }
      });
    }
  }

  const checkWhiteOrEmpty = (value) => {
    if (value && value !== "" && value !== "0") {
      return value;
    }
    else {
      return "-";
    }
  }

  //#region TAB6 start

  const [loadingForStoreRate, setLoadingForStoreRate] = useState<boolean>(false);

  const [rateModel, setRateModel] = useState<StoreRatesModel>({
    ApprovedProductCount: 0,
    AverageCampaignDay: 0,
    AverageDiscountRate: 0,
    AverageProductRate: 0,
    AverageShippingDay: 0,
    BuyboxProductCount: 0,
    BuyboxProductRate: 0,
    CreatedCampaignCount: 0,
    DelayedOrderCount: 0,
    RefundRate: 0,
    RejectedProductCount: 0,
    TotalApprovedRefundCount: 0,
    TotalCommentCount: 0,
    TotalEvaluateCount: 0,
    TotalOrderCount: 0,
    TotalProductCount: 0,
    TotalRefundRequestCount: 0,
    OrderDelayRate: 0,
    ApprovedProductRate: 0,
  })

  useEffect(() => {
    getSellerStoreRates();
  }, []);

  const getSellerStoreRates = async () => {
    setLoadingForStoreRate(true);

    const _result = await ApiService.getSellerStoreRates(Number(params.id));

    if (_result.succeeded === true) {
      setRateModel(_result.data);
      setLoadingForStoreRate(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoadingForStoreRate(false); }
      });
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={location.state?.prevPath !== undefined ? (location.state?.queryPage !== 1 ? (location.state?.prevPath + "?sayfa=" + location.state?.queryPage) : location.state?.prevPath) : ("/onayli-satici-listesi")} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            {location.state?.prevTitle ?? "Onaylı Satıcı Listesi"}
          </div>
        </Link>
        {
          sellerStatus === 1 ?
            <div className="flex items-center justify-between mb-6 w-full bg-gray-100 p-4">
              <div className=" flex">
                <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Satıcının diğer bilgileri doldurması bekleniyor..</span></div>
              </div>
              <Button isLoading={processLoading} textTiny className="w-72 ml-auto" buttonSm design="button-blue-400 mr-3" text="Satıcı Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { history.push(`/satici-duzenle/${params.id}`) }} />
              <Button isLoading={processLoading} onClick={() => handleDeleteSeller(true)} buttonSm hasIcon icon={<TrashIcon className="icon-sm mr-2" />} text="Başvuruyu Sil" design="bg-red-100 border hover:bg-red-200 transition-all duration-300 border-red-300 text-red-400 w-32" />
            </div>

            :
            sellerStatus === 2 ?
              <>
                <div className="flex align-items-center mb-6">
                  <div className="w-full bg-gray-100 p-4 flex">
                    <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Bu başvuru onayınızı bekliyor.</span></div>
                    <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                      <Button isLoading={processLoading || loading} buttonSm textTiny className="w-24" design="button-blue-400" text="Onayla" onClick={() => { handleApproveSeller(); }} />
                      <Button isLoading={processLoading || loading} buttonSm textTiny className="w-24" design="button-gray-100" text="Reddet" onClick={() => { handleOpenRejectModal(); }} />
                      <Button isLoading={processLoading || loading} textTiny className="w-24" buttonSm design="button-blue-100 border-blue-300 border text-blue-400 hover:bg-blue-200" text="Düzenle" onClick={() => { history.push(`/satici-duzenle/${params.id}`) }} />
                      <Button isLoading={processLoading || loading} buttonSm textTiny onClick={() => handleDeleteSeller(true)} text="Başvuruyu Sil" design="bg-red-100 border hover:bg-red-200 transition-all duration-300 border-red-300 text-red-400 w-28" />
                    </div>
                  </div>
                </div>
                {
                  (rejectedDate && rejectedDate !== "") &&
                  <div className="flex align-items-center mb-6">
                    <div className="w-full bg-gray-100 p-5 flex">
                      <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Bu başvuru daha önce reddedildi.</span></div>
                      <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                        <Button buttonSm textTiny className="w-48" design="button-gray-100" text="Red Detayını Gör" onClick={() => { setShowRejectedReasonModal(true); }} />
                      </div>
                    </div>
                  </div>
                }
              </>
              :
              sellerStatus === 3 ?
                <>
                  <div className="flex align-items-center mb-6">
                    <h2>Mağaza Detayı</h2>
                    <Link className="ml-auto" to={{ pathname: `/satici-duzenle/${params.id}`, state: { prevPath: "/onayli-satici-listesi", tabId: 1 } }}>
                      <Button isLoading={processLoading} textTiny className="w-72 " buttonSm design="button-blue-400" text="Mağaza Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} />
                    </Link>
                    <Button isLoading={processLoading} textTiny className="ml-2 w-60" buttonSm design="button-gray-100" text={isEnabled ? "Mağazayı Pasife Al" : "Mağazayı Aktifleştir"} hasIcon icon={<EyeOffIcon className="icon-sm mr-2" />} onClick={() => { changeSellerStatus(); }} />
                    <Button isLoading={processLoading} textTiny className="w-32 ml-2" buttonSm design="button-gray-100" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => { handleDeleteSeller(); }} />
                  </div>
                </>
                :
                sellerStatus === 4 ?
                  <div className="flex align-items-center mb-6">
                    <div className="w-full bg-gray-100 p-5 flex">
                      <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Bu başvuru reddedildi.</span></div>
                      <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                        <Button buttonSm textTiny className="w-48" design="button-gray-100" text="Red Detayını Gör" onClick={() => { setShowRejectedReasonModal(true); }} />
                      </div>
                    </div>
                  </div>
                  :
                  <></>
        }
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { handleChangeTab(item.id) }} />
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
                      <img src={(logo === "" || logo === null) ? "https://housiystrg.blob.core.windows.net/sellermedia/avatar.png" : logo} className="my-4 rounded-full h-24 w-24 object-cover" alt="" />
                  }

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"İsim Soyisim"} desc={checkWhiteOrEmpty(ownerName)} />

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"E-posta Adresi"} desc={checkWhiteOrEmpty(emailAddress)} />

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"İletişim Numarası"} desc={checkWhiteOrEmpty(contactNumber)} />

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Bireysel Anlaşma Yapabilir"} desc={
                    canSendPrivateCargo ?
                      <div className="text-sm text-green-400 font-medium">Aktif</div>
                      :
                      <div className="text-sm text-red-400 font-medium">Pasif</div>

                  } />

                </div>
                <div className="w-1/2">
                  <h4 className="mb-6">Firma Bilgileri</h4>

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Mağaza Adı"} desc={checkWhiteOrEmpty(storeName)} />

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Şirket Türü"} desc={checkWhiteOrEmpty(selectedFirmTypeOption.value)} />
                  {selectedFirmTypeOption.key === "2" &&
                    <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"TC No"} desc={checkWhiteOrEmpty(citizenshipNumber)} />
                  }
                  {selectedFirmTypeOption.key !== "2" &&
                    <>
                      <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Vergi Numarası"} desc={checkWhiteOrEmpty(taxNumber)} />

                      <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Vergi Dairesi"} desc={checkWhiteOrEmpty(taxDepartment)} />
                    </>
                  }
                  {/* <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Cari Ünvan"} desc={checkWhiteOrEmpty(companyTitle)} /> */}

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Satıcı ID"} desc={checkWhiteOrEmpty(sellerId)} />

                  {/* <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"KEP Adresi"} desc={checkWhiteOrEmpty(kepAddress)} /> */}

                  {/* <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Mersis Numarası"} desc={checkWhiteOrEmpty(mersisNumber)} /> */}


                </div>
              </div>
              <div className="border-b border-grey-400 py-4 flex gap-8">
                <div className="w-1/2">
                  <h4>Yönetici İletişim Bilgileri</h4>
                  {
                    loading ?
                      <Loading className="mt-4" inputMd />
                      :
                      <>
                        {
                          (defaultContact) ?
                            <>
                              <h5 className="mt-4">Birincil İletişim Bilgisi</h5>
                              <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                                <div className="mb-2 flex">
                                  <h5>İletişim Bilgisi #1</h5>
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
                            </>
                            :
                            <div className="text-sm text-gray-900 mt-2">(Birincil İletişim Bilgisi Bulunamadı)</div>
                        }
                      </>

                  }
                </div>
                <div className="w-1/2">
                  <h4 className="mb-6">Banka Hesap Bilgileri</h4>
                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Hesap Sahibi / Ünvanı"} desc={checkWhiteOrEmpty(accountOwnerName)} />

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Banka"} desc={checkWhiteOrEmpty(selectedBankOption.value)} />

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"IBAN"} desc={checkWhiteOrEmpty(iban)} />

                  {/* <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Şube Adı"} desc={checkWhiteOrEmpty(bankBranchName)} />

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Şube Kodu"} desc={checkWhiteOrEmpty(bankBranchCode)} />

                  <Label className="mt-4" titleWidth="w-2/3" descWidth="w-3/5" loading={loading} title={"Hesap No"} desc={checkWhiteOrEmpty(accountNumber)} /> */}

                </div>
              </div>
              <div className="py-4 flex gap-8">
                <div className="w-1/2">
                  <h4>Adres Bilgileri</h4>
                  {
                    loading ?
                      <Loading className="mb-4" inputMd />
                      :
                      <>
                        <div className="mb-4">
                          <div className="mt-4 flex">
                            <h5>Fatura Adresi</h5>
                          </div>
                          {
                            sellerAddresses.find(x => x.Id === billAddressId) ?
                              <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                                <div className="mb-2 flex">
                                  <h5>{sellerAddresses.find(x => x.Id === billAddressId)?.AddressName ?? "-"}</h5>
                                </div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === billAddressId)?.PhonePreview ?? "-"}</div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === billAddressId)?.AddressDescription ?? "-"}</div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{(sellerAddresses.find(x => x.Id === billAddressId)?.District ?? "-") + " / " + (sellerAddresses.find(x => x.Id === billAddressId)?.City ?? "-") + " / " + (sellerAddresses.find(x => x.Id === billAddressId)?.Country ?? "-")}</div>
                                <div className="my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === billAddressId)?.ZipCode ?? "-"}</div>
                              </div>
                              :
                              <div className="text-sm text-gray-900 mt-2">(Fatura Adresi Bilgisi Bulunamadı)</div>
                          }
                        </div>
                        <div className="mb-4">
                          <div className="mt-4 flex">
                            <h5>Sevkiyat Adresi</h5>
                          </div>
                          {
                            sellerAddresses.find(x => x.Id === shippingAddressId) ?
                              <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                                <div className="mb-2 flex">
                                  <h5>{sellerAddresses.find(x => x.Id === shippingAddressId)?.AddressName ?? "-"}</h5>
                                </div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === shippingAddressId)?.PhonePreview ?? "-"}</div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === shippingAddressId)?.AddressDescription ?? "-"}</div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{(sellerAddresses.find(x => x.Id === shippingAddressId)?.District ?? "-") + " / " + (sellerAddresses.find(x => x.Id === shippingAddressId)?.City ?? "-") + " / " + (sellerAddresses.find(x => x.Id === shippingAddressId)?.Country ?? "-")}</div>
                                <div className="my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === shippingAddressId)?.ZipCode ?? "-"}</div>
                              </div>
                              :
                              <div className="text-sm text-gray-900 mt-2">(Sevkiyat Adresi Bilgisi Bulunamadı)</div>
                          }
                        </div>
                        <div className="mb-4">
                          <div className="mt-4 flex">
                            <h5>İade Adresi</h5>
                          </div>
                          {
                            sellerAddresses.find(x => x.Id === refundAddressId) ?
                              <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                                <div className="mb-2 flex">
                                  <h5>{sellerAddresses.find(x => x.Id === refundAddressId)?.AddressName ?? "-"}</h5>
                                </div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === refundAddressId)?.PhonePreview ?? "-"}</div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === refundAddressId)?.AddressDescription ?? "-"}</div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{(sellerAddresses.find(x => x.Id === refundAddressId)?.District ?? "-") + " / " + (sellerAddresses.find(x => x.Id === refundAddressId)?.City ?? "-") + " / " + (sellerAddresses.find(x => x.Id === shippingAddressId)?.Country ?? "-")}</div>
                                <div className="my-auto text-sm text-gray-900 ">{sellerAddresses.find(x => x.Id === refundAddressId)?.ZipCode ?? "-"}</div>
                              </div>
                              :
                              <div className="text-sm text-gray-900 mt-2">(İade Adresi Bilgisi Bulunamadı)</div>
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
                      <>
                        {
                          sellerAddresses.length > 0 ?
                            <>
                              {
                                sellerAddresses.map((item) => (
                                  <div className="mb-4">
                                    <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                                      <div className="mb-2 flex">
                                        <h5>{item.AddressName}</h5>
                                      </div>
                                      <div className="mb-2 my-auto text-sm text-gray-900 ">{item.PhonePreview}</div>
                                      <div className="mb-2 my-auto text-sm text-gray-900 ">{item.AddressDescription}</div>
                                      <div className="mb-2 my-auto text-sm text-gray-900 ">{item.District + " / " + item.City + " / " + item.Country}</div>
                                      <div className="my-auto text-sm text-gray-900 ">{item.ZipCode}</div>
                                    </div>
                                  </div>
                                ))
                              }
                            </>
                            :
                            <div className="text-sm text-gray-900 mt-2">(Adres Bilgisi Bulunamadı)</div>
                        }
                      </>
                  }
                </div>
              </div>
            </>
            :
            selectedTabsId === 2 ?
              <>
                <Table
                  ref={tableEl}
                  emptyListText={"İletişim Bilgisi Bulunamadı"}
                  getDataFunction={getSellerContactList}
                  header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Görev/Ünvan
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        İsim Soyisim
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        E-posta Adresi
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Telefon Numarası
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Oluşturulma Tarihi
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Açıklama
                      </span>
                    </div>
                  </div>}
                  renderItem={(e, i) => {
                    return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b py-8 border-gray-200 hidden lg:grid flex gap-4 items-center">
                      <div className="lg:col-span-2">
                        <p className="p-sm">
                          {e.Title}
                        </p>
                      </div>
                      <div className="lg:col-span-2">
                        <p className="p-sm">
                          {e.NameSurname}
                        </p>
                      </div>
                      <div className="lg:col-span-2">
                        <p className="p-sm">
                          {e.Email}
                        </p>
                      </div>
                      <div className="lg:col-span-2">
                        <p className="p-sm">
                          {e.PhonePrewiew}
                        </p>
                      </div>
                      <div className="lg:col-span-2">
                        <p className="p-sm">
                          {e.CreatedDate}
                        </p>
                      </div>
                      <div className="lg:col-span-2 flex justify-between">
                        <p className="p-sm">
                          {e.Description}
                        </p>
                        <div className="text-gray-700 flex gap-2 items-center">
                          <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                            onClick={() => { handleShowUpdateContactModal(e); }} />
                          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteContact(e.Id); }} />
                        </div>
                      </div>
                    </div>
                  }}
                  sortOptions={sortOptions}
                />
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-1 flex items-center">
                      <span className="p-sm-gray-400">
                        Belge Adı
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Yükleme Tarihi
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Belge Durumu
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Red Açıklama
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Önizleme
                      </span>
                    </div>
                    <div className="lg:col-span-1 text-center">
                      <span className="p-sm-gray-400">
                        İşlemler
                      </span>
                    </div>
                  </div>
                  {
                    documentList.map((item) => (
                      <div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                        <div className="lg:col-span-1 flex items-center">
                          <span className="p-sm my-auto">
                            {item.DocumentTitle}
                          </span>
                        </div>
                        <div className="lg:col-span-1 flex">
                          <span className="p-sm my-auto">
                            {item.UploadDate}
                          </span>
                        </div>
                        <div className="lg:col-span-1 flex">
                          {
                            item.DocumentStatus === 0 ?
                              <div className="rounded-full w-36 py-1 bg-red-100 text-red-400 text-sm text-center my-auto">Yüklenmedi</div>
                              :
                              item.DocumentStatus === 1 ?
                                <div className="rounded-full w-36 py-1 bg-yellow-100 text-yellow-600 text-sm text-center my-auto">Onay Bekliyor</div>
                                :
                                item.DocumentStatus === 2 ?
                                  <div className="rounded-full w-36 py-1 bg-green-100 text-green-400 text-sm text-center my-auto">Onaylandı</div>
                                  :
                                  item.DocumentStatus === 3 ?
                                    <div className="rounded-full w-36 py-1 bg-gray-100 text-gray-600 text-sm text-center my-auto">Reddedildi</div>
                                    :
                                    <></>
                          }
                        </div>
                        <div className="lg:col-span-1">
                          <span className="p-sm my-auto">
                            {item.RejectReason}
                          </span>
                        </div>
                        <div className="lg:col-span-1 flex">
                          {
                            (item.DocumentStatus !== 0 && item.DocumentPath !== "") &&
                            <a target="_blank" href={item.DocumentPath} className="my-auto justify-items text-sm flex text-blue-400 font-medium"><MagnifyGlassIcon className="w-4 h-4 my-auto" /><span className="ml-2 my-auto">Belgeyi İncele</span></a>
                          }
                        </div>
                        <div className="lg:col-span-1 flex justify-center gap-1">
                          {
                            (item.Id > 0 && item.DocumentStatus === 1) &&
                            <>
                              <Button buttonSm textTiny className="w-24 my-auto" design="button-blue-400" text="Onayla" onClick={() => { setIsApprovedClicked(true); handleApproveDocumentStatus(item.Id); }} />
                              <Button buttonSm textTiny className="w-24 my-auto" design="button-gray-100" text="Reddet" onClick={() => { setIsApprovedClicked(true); handleOpenRejectDocumentModal(item.Id); }} />
                            </>
                          }
                        </div>
                      </div>
                    ))
                  }
                </>
                :
                selectedTabsId === 4 ?
                  <>
                    <div className="w-full overflow-x-auto custom-scrollbar">
                      <Table
                        ref={advertTableEl}
                        key={"advertTableEl"}
                        emptyListText={"İlan Bulunamadı"}
                        getDataFunction={getSellerAdvertsForAdmin}
                        header={<div className="w-screen flex px-2 border-b border-t py-5 border-gray-200   gap-4">
                          <div className="w-2col flex items-center">
                            <span className="p-sm-gray-400">
                              Ürün Adı
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Barkod No
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Model No
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Kategori
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Stok Kodu
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Stok Miktarı
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Piyasa Satış Fiyatı
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Satış Fiyatı
                            </span>
                          </div>
                          <div className="w-1col flex items-center gap-1">
                            <span className="p-sm-gray-400">
                              BUYBOX
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Oluşturulma Tarihi
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              Favori Sayısı
                            </span>
                          </div>
                          <div className="w-1col flex items-center">
                            <span className="p-sm-gray-400">
                              İşlemler
                            </span>
                          </div>
                        </div>}
                        renderItem={(e: ProductAdvertListInnerModel, i) => {
                          return <div key={"list" + i} className="w-screen  px-2 border-b h-20 border-gray-200 flex gap-4 items-center">
                            <div className="w-2col flex items-center gap-2">
                              <Image src={e.ProductMainPhoto} alt={e.ProductName} className="w-14 h-14 object-contain" />
                              <p className="p-sm">
                                {e.ProductName}
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {e.BarcodeNo}
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {e.ModelNo}
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {e.Category}
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {e.StockCode}
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {e.StockCount ?? 0}
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {e.MarketPrice % 1 === 0 ?
                                  <>{fraction.format(e.MarketPrice)} TL </>
                                  :
                                  <>{formatter.format(e.MarketPrice)} TL</>
                                }
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {e.SalePrice % 1 === 0 ?
                                  <>{fraction.format(e.SalePrice)} TL </>
                                  :
                                  <>{formatter.format(e.SalePrice)} TL</>
                                }
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="text-sm font-medium text-green-400">
                                {e.BuyboxPrice % 1 === 0 ?
                                  <>{fraction.format(e.BuyboxPrice)} TL </>
                                  :
                                  <>{formatter.format(e.BuyboxPrice)} TL</>
                                }
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {handleJsDate(e.CreatedDateJSTime)}
                              </p>
                            </div>
                            <div className="w-1col flex items-center">
                              <p className="p-sm">
                                {e.FavoriteCount ?? 0}
                              </p>
                            </div>
                            <div className="w-1col flex ">
                              <div className="text-gray-700 flex gap-2 items-center">
                                <Link target={"_blank"} to={`/urun-ilan-duzenle/${e.AdvertId}`}>
                                  <EditIcon className="w-5 h-5 hover:hover:text-blue-400 cursor-pointer transition-all pl-1" />
                                </Link>
                                <ChevronRightIcon className="w-5 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" onClick={() => { history.push(`/urun-ilan-detay/${e.AdvertId}`); }} />
                              </div>
                            </div>
                          </div>
                        }}
                        sortOptions={sortOptionsAdverts}
                      />
                    </div>
                  </>
                  :
                  selectedTabsId === 5 ?
                    <>
                      <Table
                        ref={tableOrderList}
                        key="1"
                        emptyListText={"Sipariş Bulunamadı"}
                        getDataFunction={getSellerOrdersForAdmin}
                        header={returnHeader()}
                        renderItem={(e: OrderListInnerModel, i) => {
                          return <OrderListRow onSellerDetail item={e} key={"orderList" + i} isSellerInfoHidden shouldChangeOrderId />
                        }}
                        sortOptions={sortOptionsOrders}
                      />
                    </>
                    :
                    selectedTabsId === 6 ?
                      <>
                        <div className="flex py-5 border-b border-gray-200 gap-2">
                          <div className="lg:w-1/2">
                            <h4>Kargo Performansım</h4>
                            {loadingForStoreRate ? <Loading height="h-36" /> :
                              <div className="grid lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-1">
                                  <PerformanceCard percentage={rateModel.OrderDelayRate} />
                                </div>
                                <div className="lg:col-span-1">
                                  <Label descBold title="Toplam Sipariş" desc={rateModel.TotalOrderCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Geciken Sipariş" desc={rateModel.DelayedOrderCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Hedeflenen Kargo Başarı Oranı" desc="%80" descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Ortalama Kargolama Süresi" desc={
                                    <span className={rateModel.AverageShippingDay >= 7 ? "text-red-400" : rateModel.AverageShippingDay >= 4 ? "text-yellow-600" : "text-green-400"}>
                                      {rateModel.AverageShippingDay} gün
                                    </span>
                                  } descWidth="w-2/5" titleWidth="w-3/5" />
                                </div>
                              </div>
                            }
                          </div>
                          <div className="lg:w-1/2">
                            <h4>Sipariş İade Oranı</h4>
                            {loadingForStoreRate ? <Loading height="h-36" /> :
                              <div className="grid lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-1">
                                  <PerformanceCard isReverse percentage={rateModel.RefundRate} />
                                </div>
                                <div className="lg:col-span-1">
                                  <Label descBold title="Toplam Sipariş Adedi" desc={rateModel.TotalOrderCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Toplam İade Talebi" desc={rateModel.TotalRefundRequestCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Onaylanan İade" desc={rateModel.TotalApprovedRefundCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="İade Oranı" desc={rateModel.RefundRate} descWidth="w-2/5" titleWidth="w-3/5" />
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                        <div className="flex py-5 border-b border-gray-200 gap-2">
                          <div className="lg:w-1/2">
                            <h4>Müşteri Memnuniyeti</h4>
                            {loadingForStoreRate ? <Loading height="h-36" /> :
                              <div className="grid lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-1">
                                  <PerformanceCard percentage={rateModel.AverageProductRate} />
                                </div>
                                <div className="lg:col-span-1">
                                  <Label descBold title="Toplam Sipariş" desc={rateModel.TotalOrderCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Toplam Değerlendirme" desc={rateModel.TotalEvaluateCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Toplam Yorum" desc={rateModel.TotalCommentCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Ortalama Ürün Puanı" desc={
                                    <span className={rateModel.AverageProductRate >= 80 ? "text-green-400" : rateModel.AverageProductRate >= 60 ? "text-yellow-600" : "text-red-400"}>
                                      %{rateModel.AverageProductRate}
                                    </span>
                                  } descWidth="w-2/5" titleWidth="w-3/5" />
                                </div>
                              </div>
                            }
                          </div>
                          <div className="lg:w-1/2">
                            <h4>Ürün Yeterlilik</h4>
                            {loadingForStoreRate ? <Loading height="h-36" /> :
                              <div className="grid lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-1">
                                  <PerformanceCard percentage={rateModel.ApprovedProductRate} />
                                </div>
                                <div className="lg:col-span-1">
                                  <Label descBold title="Onaylanan Ürün Sayısı" desc={rateModel.ApprovedProductCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Reddedilen Ürün Sayısı" desc={rateModel.RejectedProductCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                        <div className="flex py-5 gap-2">
                          <div className="lg:w-1/2">
                            <h4>Fiyat Politikası</h4>
                            {loadingForStoreRate ? <Loading height="h-36" /> :
                              <div className="grid lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-1">
                                  <PerformanceCard percentage={rateModel.BuyboxProductRate} />
                                </div>
                                <div className="lg:col-span-1">
                                  <Label descBold title="Toplam Ürün Sayısı " desc={rateModel.TotalProductCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="BUYBOX Ürün Sayısı" desc={rateModel.BuyboxProductCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="BUYBOX Kazanım Oranı" desc={

                                    <span className={rateModel.BuyboxProductRate >= 80 ? "text-green-400" : rateModel.BuyboxProductRate >= 50 ? "text-yellow-600" : "text-red-400"}>
                                      %{rateModel.BuyboxProductRate}
                                    </span>
                                  } descWidth="w-2/5" titleWidth="w-3/5" />
                                </div>
                              </div>
                            }
                          </div>
                          <div className="lg:w-1/2">
                            <h4>Kampanya Oluşturma Sıklığı</h4>
                            {loadingForStoreRate ? <Loading height="h-36" /> :
                              <div className="grid lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-1">
                                  <PerformanceCard percentage={rateModel.AverageDiscountRate} />
                                </div>
                                <div className="lg:col-span-1">
                                  <Label descBold title="Oluşturulmuş Kampanya Sayısı" desc={rateModel.CreatedCampaignCount} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Ortalama Kampanya Süresi" desc={rateModel.AverageCampaignDay} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Ortalama İndirim Oranı" desc={`%${rateModel.AverageDiscountRate}`} descWidth="w-2/5" titleWidth="w-3/5" />
                                  <Label descBold title="Hedeflenen Oran" desc="%80" descWidth="w-2/5" titleWidth="w-3/5" />
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                      </>
                      :
                      selectedTabsId === 7 ?
                        <>
                          <StoreEvaluation id={Number(params.id) ?? "0"} />
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
                <input className="form-input" type="text" value={contactTitle} onChange={(e) => { setContactTitle(e.target.value); }} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Yetkili İsim Soyisim" className="mt-4" />
                <input className="form-input" type="text" value={contactName} onChange={(e) => { setContactName(e.target.value); }} />
              </div>
            </div>
            <div className="flex gap-2 ">
              <div className="w-1/2">
                <Label isRequired withoutDots title="E-posta" className="mt-4" />
                <input className="form-input" type="text" value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); }} />
              </div>
              <div className="w-1/2">
                <Label isRequired withoutDots title="Telefon Numarası" className="mt-4" />
                <PhoneInput ref={phoneInputRef} onChange={setContactPhone} initValue={contactPhone?.phone} />
              </div>
            </div>
            <div>
              <Label withoutDots title="Açıklama" className="mt-4" />
              <input className="form-input" type="text" value={contactDescription} onChange={(e) => { setContactDescription(e.target.value); }} />
            </div>
            <div className="w-full mt-4">
              <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { updateContact(); }}></Button>
            </div>
          </div>

        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showRejectSellerModal}
        onClose={() => { setShowRejectSellerModal(false); }}
        title="Satıcı reddet"
        body={
          <div>
            <Label isRequired withoutDots title="Red Tipi" className="mt-4" />
            <input className="form-input" type="text" value={rejectType} onChange={(e) => { setRejectType(e.target.value); }} />
            <Label isRequired withoutDots title="Red Açıklama" className="mt-4" />
            <textarea className="form-input" rows={3} value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); }} ></textarea>
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { handleRejectSeller(); }}></Button>
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showRejectDocumentModal}
        onClose={() => { setShowRejectDocumentModal(false); }}
        title="Belge reddet"
        body={
          <div>
            <Label isRequired withoutDots title="Red Açıklama" className="mt-4" />
            <textarea className="form-input" rows={3} value={rejectDocumentModalReason} onChange={(e) => { setRejectDocumentModalReason(e.target.value) }} ></textarea>
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { setShowRejectDocumentModal(false); handleCloseRejectDocumentModal(); }}></Button>
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showRejectedReasonModal}
        onClose={() => { setShowRejectedReasonModal(false); }}
        title="Başvuru Red Detayı"
        body={
          <div>
            <div className="flex">
              <AlertIcon className="w-4 h-4 text-red-400 my-auto" />
              <div className="text-sm font-medium text-red-400 my-auto ml-2">Bu satıcı başvurusu admin tarafından reddedildi.</div>
            </div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Tarihi</div>
            <div className="text-sm  font-medium mt-2">{rejectedDate}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Nedeni</div>
            <div className="text-sm  font-medium mt-2">{rejectedTitle}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Açıklama</div>
            <div className="text-sm  font-medium mt-2">
              {rejectedReason}
            </div>
          </div>
        } />
    </div>
  )
}
