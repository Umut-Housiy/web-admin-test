import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { AlertIcon, ChevronRightIcon, EditIcon, ErrorIcon, EyeIcon, EyeOffIcon, HappyFaceIcon, MagnifyGlassIcon, NormalFaceIcon, SadFaceIcon, SearchIconLg, SeoIcon, StarIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import { Image } from "../Components/Image";
import { TabsTitle } from "../Components/TabsTitle";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { BadgeModel, ProDetailModel, ProEvaluationSummaryModel, ProRequestInnerModelForAdmin, WorkEvaluateListInnerModel, ProRequestStatues, ProOfferInnerModelForAdmin, OfferStatusType, ProWorkModelInnerForAdmin, WorkStatus, WorkReportModel, ProStoreRateModel, GetProSubscriptionDetailResponseModel } from "../Models";
import { RateStars } from "../Components/RateStars";
import { Loading } from "../Components/Loading";
import { useStateEffect } from "../Components/UseStateEffect";
import { TextArea } from "../Components/TextArea";
import { PhoneInput, PhoneResultModel } from "../Components/PhoneInput";
import { formatter, fraction } from "../Services/Functions"
import { SRLWrapper } from "simple-react-lightbox";
import { DateView } from "../Components/DateView";

interface RouteParams {
  id: string
}

interface LocationModel {
  prevTitle: string,
  prevPath: string,
  tabId: number,
  queryPage: number,
}

export const ProProfessionalDetail: FunctionComponent = () => {

  const history = useHistory();

  const location = useLocation<LocationModel>();

  const params = useParams<RouteParams>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [badgeLoading, setBadgeLoading] = useState<boolean>(false);

  const [tabsLink, setTabLinks] = useState([
    { id: 1, name: "Genel Bilgiler", disabled: false },
    { id: 2, name: "Profesyonel Bilgileri", disabled: false },
    { id: 3, name: "Profil Detayı", disabled: false },
    // { id: 4, name: "İletişim Bilgileri", disabled: false },
    { id: 5, name: "Profesyonel Belgeleri", disabled: false },
    { id: 6, name: "Rozetler", disabled: true },
    { id: 7, name: "Gelen Talepler", disabled: true },
    { id: 8, name: "Teklifler", disabled: true },
    { id: 9, name: "İşler", disabled: true },
    { id: 10, name: "Fikirler", disabled: true },
    { id: 11, name: "Projeler", disabled: true },
    { id: 12, name: "Müşteri Değerlendirmeleri", disabled: true },
    { id: 13, name: "Profesyonel Sorun Bildirimleri", disabled: true },
    { id: 14, name: "Profesyonel İstatistikleri", disabled: true }
  ]);

  const subscriptionTableEl = useRef<any>();

  const evaluationTableEl = useRef<any>();

  const requestTableEl = useRef<any>();

  const offerTableEl = useRef<any>();

  const workTableEl = useRef<any>();

  const projectTableEl = useRef<any>();

  const ideaTableEl = useRef<any>();

  const tableContactList = useRef<any>();

  const [selectedTabsId, setSelectedTabsId] = useState<number>(location.state?.tabId ?? 1);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const [showRejectProModal, setShowRejectProModal] = useState<boolean>(false);

  const [rejectType, setRejectType] = useState<string>("");

  const [rejectReason, setRejectReason] = useState<string>("");

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

  const [selectedBankOption, setSelectedBankOption] = useState<{ key: string, value: string }>();

  const [proDetail, setProDetail] = useState<ProDetailModel>();

  const [proSubscriptionDetail, setProSubscriptionDetail] = useState<GetProSubscriptionDetailResponseModel>();

  const [loadingSubscriptionDetail, setLoadingSubscriptionDetail] = useState<boolean>(true);

  const [logo, setLogo] = useState<string>("");
  //#endregion

  //#region TAB 2
  const [showUpdateContactModal, setShowUpdateContactModal] = useState<boolean>(false);

  const [contactId, setContactId] = useState<number>(0);

  const [contactTitle, setContactTitle] = useState<string>("");

  const [contactName, setContactName] = useState<string>("");

  const [contactEmail, setContactEmail] = useState<string>("");

  const [contactPhone, setContactPhone] = useState<PhoneResultModel>();

  const [contactDescription, setContactDescription] = useState<string>("");
  //#endregion

  //#region TAB 4
  const [taxPlateStat, setTaxPlateStat] = useState<number>(0);

  const [signatureCircStat, setSignatureCircStat] = useState<number>(0);

  const [registryStat, setRegistryStat] = useState<number>(0);

  const [birthStat, setBirthStat] = useState<number>(0);

  const [rejectDocumentModalType, setRejectDocumentModalType] = useState<number>(0);

  const [rejectDocumentModalReason, setRejectDocumentModalReason] = useState<string>("");

  const [showRejectDocumentModal, setShowRejectDocumentModal] = useState<boolean>(false);

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

  const [isApproveClicked, setIsApprovedClicked] = useState<boolean>(false);
  //#endregion

  //#region TAB 5
  const [badgeList, setBadgeList] = useState<BadgeModel[]>();
  //#endregion

  //#region TAB 12
  const [showEvaluationModal, setShowEvaluationModal] = useState<boolean>(false);

  const [modalEvaluationData, setModalEvaluationData] = useState<WorkEvaluateListInnerModel>();

  const [evaluationSummaryLoading, setEvaluationSummaryLoading] = useState<boolean>(false);

  const [evaluationSummary, setEvaluationSummary] = useState<ProEvaluationSummaryModel>();
  //#endregion

  useEffect(() => {
    getBankList();
  }, []);

  useStateEffect(() => {
    getProDetail();
    getProSubscriptionDetail();
  }, [bankOptions]);

  useEffect(() => {
    if (selectedTabsId === 6) {
      getBadgeListForProDetail();
    }
    else if (selectedTabsId === 12) {
      getProEvaluateSummary();
    }
  }, [selectedTabsId]);

  const getBankList = async () => {
    setLoading(true);
    const _result = await ApiService.getBankList();
    let _tempBankList: { key: string, value: string }[] = [];
    _result.map((item) => {
      _tempBankList.push({ key: item.Id, value: item.Name })
    });
    setBankOptions(JSON.parse(JSON.stringify(_tempBankList)));
  }

  const getProDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getProDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {

      setProDetail(_result.data);
      setLogo(_result.data.Logo);
      setIsEnabled(_result.data.IsEnabled);
      setSelectedBankOption(bankOptions.find(x => x.key === _result.data.BankInfo.BankId.toString()) ?? { key: "0", value: "-" });
      setSelectedFirmTypeOption(firmTypeOptions.find(x => x.key === _result.data.CompanyType.toString()) ?? { key: "0", value: "Firma Tipi" });

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
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push(location.state?.prevPath ?? "/pro-profesyonel-listesi"); }
      });
    }
  }

  const getProSubscriptionDetail = async () => {
    setLoadingSubscriptionDetail(true);

    const _result = await ApiService.getProSubscriptionDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setProSubscriptionDetail(_result.data);
      setLoadingSubscriptionDetail(false);
    }
    else {
      setProSubscriptionDetail({
        Bill: "",
        ExpirationDateJSTime: 0,
        IsInFreeTrial: false,
        PackageName: "",
        PaymentType: 2,
        StartDateJSTime: 0,
        Status: false
      });
      setLoadingSubscriptionDetail(false);
    }
  }

  const getSubscriptionHistory = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSubscriptionHistory(Number(params.id ?? "0"), page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const changeProStatus = () => {
    context.showModal({
      type: "Question",
      message: isEnabled ? "Profesyonel pasif duruma getirilecek. Emin misiniz?" : "Profesyonel aktif duruma getirilecek",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.changeProStatus(Number(params.id ?? "0"), !isEnabled);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          setIsEnabled(!isEnabled);
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

  const showDeleteModal = (isApplication?: boolean) => {
    context.showModal({
      type: "Question",
      title: `${isApplication ? "Başvuruyu Sil" : "Hesabı Kapat"}`,
      message: `${proDetail?.StoreName ?? ""} isimli profesyonelin ${isApplication ? "başvurusunu silmek" : "hesabını kapatmak"} istediğinize emin misiniz?`,
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.deletePro(Number(params.id ?? "0"));

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: `${isApplication ? "Başvuru" : "Profesyonel"} başarıyla silindi`,
            onClose: () => {
              context.hideModal();
              isApplication ?
                history.push("/pro-uye-basvuru-listesi")
                :
                history.push("/pro-profesyonel-listesi")
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

  const getContactList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProContactList(Number(params.id ?? "0"), page, take, order, searchText);

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

  const handleShowUpdateContactModal = (item) => {
    setContactId(item.Id);
    setContactName(item.NameSurname);
    setContactEmail(item.Email);
    setContactDescription(item.Description);
    setContactTitle(item.Title);
    setContactPhone({ purePhone: "", maskedPhone: "", phone: item.Phone, phonePreview: "", pureCountryCode: "", previewCountryCode: "" });

    setShowUpdateContactModal(true);
  }

  const updateProContact = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProContact(contactId, contactName, contactEmail, contactPhone?.phone ?? "", contactDescription, contactTitle);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İletişim bilgisi güncellendi",
        onClose: () => {
          context.hideModal();
          if (tableContactList.current) {
            tableContactList.current?.reload();
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

  const handleDeleteContact = (item) => {
    context.showModal({
      type: "Question",
      title: "İletişim bilgisi silinecek. Emin misiniz?",
      onClick: async () => {

        const _result = await ApiService.deleteProContact(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İletişim bilgisi başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableContactList.current) {
                tableContactList.current?.reload();
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
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  useEffect(() => {
    if (isApproveClicked) {
      changeProDocumentStatus();
      setIsApprovedClicked(false);
    }
  }, [taxPlateStat]);

  useEffect(() => {
    if (isApproveClicked) {
      changeProDocumentStatus();
      setIsApprovedClicked(false);
    }
  }, [signatureCircStat]);

  useEffect(() => {
    if (isApproveClicked) {
      changeProDocumentStatus();
      setIsApprovedClicked(false);
    }
  }, [registryStat]);

  useEffect(() => {
    if (isApproveClicked) {
      changeProDocumentStatus();
      setIsApprovedClicked(false);
    }
  }, [birthStat]);

  const handleApproveDocumentStatus = (Type) => {
    setDocumentChangeStatusMessage("Belge onaylandı");

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

  const handleOpenRejectDocumentModal = (Type) => {
    setRejectDocumentModalType(Type);
    setRejectDocumentModalReason("");
    setShowRejectDocumentModal(true);
  }

  const handleCloseRejectDocumentModal = () => {
    setIsApprovedClicked(true);
    setDocumentChangeStatusMessage("Belge reddedildi");

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

  const changeProDocumentStatus = async () => {
    setProcessLoading(true);

    const _result = await ApiService.changeProDocumentStatus(Number(params.id ?? 0), taxPlateStat, rejectDocumentModalReason, signatureCircStat, rejectDocumentModalReason, registryStat, rejectDocumentModalReason, birthStat, rejectDocumentModalReason);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: documentChangeStatusMessage,
        onClose: () => {
          context.hideModal();
          setIsApprovedClicked(false);
          setTaxPlateStat(1);
          setSignatureCircStat(1);
          setBirthStat(1);
          setRegistryStat(1);
          getProDetail();
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setIsApprovedClicked(false);
          setTaxPlateStat(1);
          setSignatureCircStat(1);
          setBirthStat(1);
          setRegistryStat(1);
        }
      });
    }
  }

  const getBadgeListForProDetail = async () => {
    setBadgeLoading(true);

    const _result = await ApiService.getBadgeListForProDetail(Number(params.id ?? "0"), "", -1);

    if (_result.succeeded === true) {
      setBadgeList(_result.data.Data);
      setBadgeLoading(false);

    }
    else {
      setBadgeLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const handleDeleteBadge = (item) => {
    context.showModal({
      type: "Question",
      title: "Rozet profesyonelden silinecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.removeAssignmentFromBadge(Number(params.id), item.Id);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Rozet silindi",
            onClose: () => { context.hideModal(); getBadgeListForProDetail(); }
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

  const getProRequestListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProRequestListForAdmin(Number(params.id ?? "0"), page, take, searchText, order);

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

  const getProOfferListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProOfferListForAdmin(Number(params.id ?? "0"), page, take, searchText, order);

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

  const getProWorkListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProWorkListForAdmin(Number(params.id ?? "0"), page, take, searchText, order);

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

  const getProIdeaListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProIdeaListForAdmin(Number(params.id ?? "0"), page, take, searchText, order);

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

  const getProProjectListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProProjectListForAdmin(Number(params.id ?? "0"), page, take, searchText, order);

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

  const handleOpenRejectModal = () => {
    setRejectType("");
    setRejectReason("");
    setShowRejectProModal(true);
  }

  const handleRejectPro = async () => {
    setShowRejectProModal(false);
    setProcessLoading(true);

    const _result = await ApiService.rejectPro(Number(params.id ?? 0), rejectType, rejectReason);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Profesyonel reddedildi.",
        onClose: () => { context.hideModal(); history.push("/pro-uye-basvuru-listesi"); }
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

  const handleApprovePro = () => {
    context.showModal({
      type: "Question",
      title: "ONAYLA",
      message: "Profesyonel onaylanacak emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.approvePro(Number(params.id ?? 0));

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Profesyonel onaylandı",
            onClose: () => { context.hideModal(); history.push("/pro-profesyonel-listesi"); }
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

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleDateString() ?? "-";
  }

  const showDeleteIdeaModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Fikri Sil",
      message: `${item.Name} isimli fikri silmek istediğinize emin misiniz?`,
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.deleteIdea(item.Id);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Fikir başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (ideaTableEl.current) {
                ideaTableEl.current?.reload();
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
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const showDeleteProjectModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Proje Sil",
      message: "Proje silinecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.deleteProject(item.Id);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Proje silindi",
            onClose: () => {
              context.hideModal();
              if (projectTableEl.current) {
                projectTableEl.current?.reload();
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
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const checkWhiteOrEmpty = (value) => {
    if (value && value !== "" && value !== "0") {
      return value;
    }
    else {
      return "-";
    }
  }

  const getProEvaluateSummary = async () => {
    setEvaluationSummaryLoading(true);

    const _result = await ApiService.getProEvaluateSummary(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setEvaluationSummary(_result.data);
      setEvaluationSummaryLoading(false);
    }
    else {
      setEvaluationSummaryLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const handleRateValueText = (rateValue: number) => {
    if (rateValue === 0) {
      return "-";
    }
    else if (rateValue <= 1) {
      return "Çok Kötü";
    }
    else if (rateValue <= 2) {
      return "Kötü";
    }
    else if (rateValue <= 3) {
      return "Orta";
    }
    else if (rateValue <= 4) {
      return "İyi";
    }
    else if (rateValue <= 5) {
      return "Çok İyi";
    }
    else {
      return "";
    }
  }

  const getProEvaluateList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProEvaluateList(Number(params.id ?? "0"), page, take, searchText, order);

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

  const handleOpenEvaluationModal = (item: WorkEvaluateListInnerModel) => {
    setModalEvaluationData(JSON.parse(JSON.stringify(item)));
    setShowEvaluationModal(true);
  }

  //#region TAB-13
  const reportTableEl = useRef<any>();

  const getProReportsForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProReportsForAdmin(Number(params.id ?? "0"), page, take, searchText, order);

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

  const showDeleteReportModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Sorun Bildirimi Sil",
      message: "Sorun Bildirimi silinecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.deleteProReportForAdmin(item.WorkReportId);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Sorun bildirimi silindi",
            onClose: () => {
              context.hideModal();
              if (reportTableEl.current) {
                reportTableEl.current?.reload();
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
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }
  //#endregion


  //#region Seo
  const [showSeoModal, setShowSeoModal] = useState<boolean>(false);

  const [seoTitle, setSeoTitle] = useState<string>("");

  const [seoDescription, setSeoDescription] = useState<string>("");

  const handleOpenSeoModal = () => {
    setSeoTitle(proDetail?.SeoTitle ?? "");
    setSeoDescription(proDetail?.SeoDescription ?? "");
    setShowSeoModal(true);
  }

  const updateSingleProSeo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSingleProSeo(Number(params.id ?? "0"), seoTitle, seoDescription);

    setProcessLoading(false);
    setShowSeoModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seo bilgileri güncellenmiştir",
        onClose: () => { context.hideModal(); getProDetail(); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setShowSeoModal(true); }
      });
    }
  }
  //#endregion

  //#region ProStoreStates
  useEffect(() => {
    getProStoreRates();
  }, [params.id]);

  const [storeRatesLoading, setStoreRatesLoading] = useState<boolean>(false);

  const [storeRates, setStoreRates] = useState<ProStoreRateModel>();

  const getProStoreRates = async () => {
    setStoreRatesLoading(true);

    const _result = await ApiService.getProStoreRates(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setStoreRates(_result.data);
      setStoreRatesLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setStoreRatesLoading(false); }
      });
    }
  }
  //#endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={location.state?.prevPath !== undefined ? (location.state?.queryPage !== 1 ? (location.state?.prevPath + "?sayfa=" + location.state?.queryPage) : location.state?.prevPath) : ("/pro-profesyonel-listesi")} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            {location.state?.prevTitle ?? "Profesyonel Listesi"}
          </div>
        </Link>
        {
          loading ?
            <Loading width="w-full" height="h-12" />
            :
            <>
              {
                proDetail?.Status === 1 ?
                  <>
                    <h2>Başvuru Detayı</h2>
                    <div className="w-full my-2 bg-gray-100 p-4 flex">
                      <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Profesyonelin diğer bilgileri doldurması bekleniyor</span></div>
                      <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                        <Button isLoading={processLoading} textTiny className="w-72 ml-auto" buttonSm design="button-blue-400" text="Profesyonel Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { history.push(`/pro-profesyonel-duzenle/${params.id ?? "0"}`) }} />
                        <Button isLoading={processLoading} textTiny onClick={() => showDeleteModal(true)} buttonSm hasIcon icon={<TrashIcon className="icon-sm mr-2" />} text="Başvuruyu Sil" design="bg-red-100 border hover:bg-red-200 transition-all duration-300 border-red-300 text-red-400 w-36" />
                      </div>
                    </div>
                  </>
                  :
                  proDetail?.Status === 2 ?
                    <>
                      <h2>Başvuru Detayı</h2>
                      <div className="w-full bg-gray-100 my-2 p-4 flex">
                        <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Bu başvuru onayınızı bekliyor</span></div>
                        <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                          <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-blue-400" text="Onayla" onClick={() => { handleApprovePro(); }} />
                          <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-gray-100" text="Reddet" onClick={() => { handleOpenRejectModal(); }} />
                          <Button isLoading={processLoading} textTiny className="w-24" buttonSm design="button-blue-100 border-blue-300 border text-blue-400 hover:bg-blue-200" text="Düzenle" onClick={() => { history.push(`/pro-profesyonel-duzenle/${params.id ?? "0"}`) }} />
                          <Button isLoading={processLoading} textTiny onClick={() => showDeleteModal(true)} buttonSm text="Başvuruyu Sil" design="bg-red-100 border hover:bg-red-200 transition-all duration-300 border-red-300 text-red-400 w-32" />

                        </div>
                      </div>
                    </>
                    :
                    proDetail?.Status === 3 ?
                      <>
                        <div className="flex mb-5 items-center">
                          <h2>Profesyonel Detayı</h2>
                          <Button isLoading={processLoading} textTiny className="w-72 ml-auto" buttonSm design="button-blue-400" text="Profesyonel Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { history.push(`/pro-profesyonel-duzenle/${params.id ?? "0"}`) }} />
                          <Button isLoading={processLoading} textTiny className="ml-2 w-36" buttonSm design="button-gray-100" text={"SEO"} hasIcon icon={<SeoIcon className="icon-sm mr-2" />} onClick={() => { handleOpenSeoModal(); }} />
                          <Button isLoading={processLoading} textTiny className="ml-2 w-40" buttonSm design="button-gray-100" text={isEnabled ? "Pasife Al" : "Aktifleştir"} hasIcon icon={isEnabled ? <EyeIcon className="icon-sm mr-2" /> : <EyeOffIcon className="icon-sm mr-2" />} onClick={() => { changeProStatus(); }} />
                          <Button isLoading={processLoading} textTiny className="w-48 ml-2" buttonSm design="button-gray-100" text="Hesabı Kapat" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => { showDeleteModal(); }} />
                        </div>

                      </>
                      :
                      proDetail?.Status === 4 ?
                        <>
                          <h2>Profesyonel Detayı</h2>
                          <div className="w-full my-2 bg-gray-100 p-5 flex">
                            <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Bu başvuru reddedildi.</span></div>
                            <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                              <Button isLoading={processLoading} buttonSm textTiny className="w-48" design="button-gray-100" text="Red Detayını Gör" onClick={() => { }} />
                            </div>
                          </div>
                        </>
                        :
                        <></>
              }
            </>
        }
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
        {
          selectedTabsId === 1 ?
            <>
              <div className="w-full flex mt-4 border-b border-grey-400 py-4 gap-8">
                <div className="w-1/2">
                  <h4 className="mb-4">Profil Bilgileri</h4>
                  {
                    loading ?
                      <Loading circle className="mb-4 h-24 w-24" />
                      :
                      <img src={(logo === "" || logo === null || logo === undefined) ? "https://housiystrg.blob.core.windows.net/sellermedia/avatar.png" : logo} className="object-cover mb-4 rounded-full h-24 w-24" />
                  }
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>İsim Soyisim</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.NameSurname)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>E-posta Adresi</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.Email)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Telefon Numarası</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.PhonePreview)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Doğrulanma Durumu</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className={`w-2/3 p-sm ml-2 font-medium ${proDetail?.IsVerified ? "text-green-400" : "text-red-400"}`}>{proDetail?.IsVerified ? "Doğrulanmış" : "Doğrulanmamış"}</div>
                    }
                  </div>
                </div>
                <div className="w-1/2">
                  <h4 className="mb-4">Firma Bilgileri</h4>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Profesyonel / Şirket Adı</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.StoreName)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Şirket Türü</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(selectedFirmTypeOption.value)}</div>
                    }
                  </div>
                  {(selectedFirmTypeOption.key === "2" || selectedFirmTypeOption.key === "7") &&
                    <div className="flex mb-2">
                      <div className="w-1/3 flex p-sm-gray-700"><span>TC No</span><span className="ml-auto">:</span></div>
                      {
                        loading ?
                          <div className="w-2/3 ml-2">
                            <Loading textMd />
                          </div>
                          :
                          <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.CitizenshipNumber)}</div>
                      }
                    </div>
                  }
                  {(selectedFirmTypeOption.key !== "2" && selectedFirmTypeOption.key !== "7") &&
                    <>
                      <div className="flex mb-2">
                        <div className="w-1/3 flex p-sm-gray-700"><span>Vergi Numarası</span><span className="ml-auto">:</span></div>
                        {
                          loading ?
                            <div className="w-2/3 ml-2">
                              <Loading textMd />
                            </div>
                            :
                            <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.TaxNumber)}</div>
                        }
                      </div>
                      <div className="flex mb-2">
                        <div className="w-1/3 flex p-sm-gray-700"><span>Vergi Dairesi</span><span className="ml-auto">:</span></div>
                        {
                          loading ?
                            <div className="w-2/3 ml-2">
                              <Loading textMd />
                            </div>
                            :
                            <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.TaxDepartment)}</div>
                        }
                      </div>
                    </>
                  }
                  {/* <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Cari Ünvan</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.CompanyTitle)}</div>
                    }
                  </div> */}
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Profesyonel ID</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.Id)}</div>
                    }
                  </div>

                  {/* <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>KEP Adresi</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.KepAddress)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Mersis Numarası</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.MersisNumber)}</div>
                    }
                  </div> */}
                </div>
              </div>
              <div className="w-full flex border-b border-grey-400 py-4 gap-8">
                {/* <div className="w-1/2">
                  <div>
                    <h4 className="mb-4">Müşteri İletişim Bilgileri</h4>
                    <div className="flex mb-2">
                      <div className="w-1/3 flex p-sm-gray-700"><span>E-posta Adresi</span><span className="ml-auto">:</span></div>
                      {
                        loading ?
                          <div className="w-2/3 ml-2">
                            <Loading textMd />
                          </div>
                          :
                          <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.ContactEmail)}</div>
                      }
                    </div>
                    <div className="flex mb-2">
                      <div className="w-1/3 flex p-sm-gray-700"><span>Web Sitesi</span><span className="ml-auto">:</span></div>
                      {
                        loading ?
                          <div className="w-2/3 ml-2">
                            <Loading textMd />
                          </div>
                          :
                          <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.WebsiteUrl)}</div>
                      }
                    </div>
                    <div className="flex mb-2">
                      <div className="w-1/3 flex p-sm-gray-700"><span>Merkez Konum</span><span className="ml-auto">:</span></div>
                      {
                        loading ?
                          <div className="w-2/3 ml-2">
                            <Loading textMd />
                          </div>
                          :
                          <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.ContactAddress)}</div>
                      }
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="mb-4">Yönetici İletişim Bilgileri</h4>
                    {
                      loading ?
                        <Loading inputMd />
                        :
                        <>
                          {
                            (proDetail?.ContactList && proDetail.ContactList.length > 0 && proDetail.ContactList.find(x => x.IsDefault === true)) ?
                              <>
                                <h5 className="mb-4">Birincil İletişim Bilgisi</h5>
                                <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                                  <div className="mb-2 flex">
                                    <h5>İletişim Bilgisi #1</h5>
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
                              </>
                              :
                              <div className="text-sm text-gray-900">(Birincil İletişim Bilgisi Bulunamadı)</div>
                          }
                        </>
                    }
                  </div>
                </div> */}
                <div className="w-1/2">
                  <h4 className="mb-4">Banka Hesap Bilgileri</h4>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Hesap Sahibi / Ünvanı</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.BankInfo?.NameSurname)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>IBAN</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.BankInfo?.IBAN)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Banka</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(selectedBankOption?.value)}</div>
                    }
                  </div>
                  {/* <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Şube Adı</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.BankInfo.BranchName)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Şube Kodu</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.BankInfo.BranchCode)}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Hesap No</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{checkWhiteOrEmpty(proDetail?.BankInfo.AccountNumber)}</div>
                    }
                  </div> */}
                </div>
              </div>
              <div className="w-full flex border-b border-grey-400 py-4 gap-8">
                <div className="w-1/2">
                  <h4 className="mb-4">Adres Bilgileri</h4>
                  {
                    loading ?
                      <Loading inputMd />
                      :
                      <>
                        {
                          (proDetail?.AddressList && proDetail?.AddressList.length > 0 && proDetail?.AddressList.find(x => x.Id === (proDetail?.BillAddressId ?? 0))) ?
                            <>
                              <div className="mt-4">
                                <h5>Fatura Adresi</h5>
                              </div>
                              <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                                <div className="mb-2 flex">
                                  <h5>{proDetail?.AddressList.find(x => x.Id === (proDetail?.BillAddressId ?? 0))?.AddressName}</h5>
                                </div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{proDetail?.AddressList.find(x => x.Id === (proDetail?.BillAddressId ?? 0))?.PhonePreview}</div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{proDetail?.AddressList.find(x => x.Id === (proDetail?.BillAddressId ?? 0))?.AddressDescription}</div>
                                <div className="mb-2 my-auto text-sm text-gray-900 ">{proDetail?.AddressList.find(x => x.Id === (proDetail?.BillAddressId ?? 0))?.District + " / " + proDetail?.AddressList.find(x => x.Id === (proDetail?.BillAddressId ?? 0))?.City + " / " + proDetail?.AddressList.find(x => x.Id === (proDetail?.BillAddressId ?? 0))?.Country}</div>
                                <div className="my-auto text-sm text-gray-900 ">{proDetail?.AddressList.find(x => x.Id === (proDetail?.BillAddressId ?? 0))?.ZipCode}</div>
                              </div>
                            </>
                            :
                            <div className="text-sm text-gray-900">(Adres Bilgisi Bulunamadı)</div>
                        }
                      </>
                  }
                </div>
                <div className="w-1/2">
                  <h4 className="mb-4">Kayıtlı Adresler</h4>
                  {
                    loading ?
                      <Loading inputMd />
                      :
                      <>
                        {
                          proDetail?.AddressList && proDetail?.AddressList.length > 0 ?
                            <>
                              {
                                proDetail?.AddressList.map((item) => (
                                  <div className="w-full bg-gray-100 rounded-md mt-4 p-4">
                                    <div className="mb-2 flex">
                                      <h5>{item.AddressName}</h5>
                                    </div>
                                    <div className="mb-2 my-auto text-sm text-gray-900 ">{item.PhonePreview}</div>
                                    <div className="mb-2 my-auto text-sm text-gray-900 ">{item.AddressDescription}</div>
                                    <div className="mb-2 my-auto text-sm text-gray-900 ">{item.District + " / " + item.City + " / " + item.Country}</div>
                                    <div className="my-auto text-sm text-gray-900 ">{item.ZipCode}</div>
                                  </div>
                                ))
                              }
                            </>
                            :
                            <div className="text-sm text-gray-900">(Adres Bilgisi Bulunamadı)</div>
                        }
                      </>
                  }
                </div>
              </div>
              <div className="w-full flex border-b border-grey-400 py-4 gap-8">
                <div className="w-1/2">
                  <h4 className="mb-4">Üyelik Paketi Bilgileri</h4>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Üyelik Durumu</span><span className="ml-auto">:</span></div>
                    {
                      loadingSubscriptionDetail ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{proSubscriptionDetail?.Status === false ? "Pasif" : "Aktif"}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Üyelik Paketi</span><span className="ml-auto">:</span></div>
                    {
                      loadingSubscriptionDetail ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{proSubscriptionDetail?.PackageName === null || proSubscriptionDetail?.PackageName === "" ? "-" : proSubscriptionDetail?.PackageName}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Başlangıç Tarihi</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3  ml-2">
                          {proSubscriptionDetail?.StartDateJSTime === 0 ?
                            "-"
                            :
                            <DateView className="p-sm" dateNumber={proSubscriptionDetail?.StartDateJSTime ?? 0} pattern="dd.MM.yyyy HH:mm" />
                          }
                        </div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Ödeme Tipi</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 p-sm ml-2">{proSubscriptionDetail?.PaymentType === 0 ? "Kredi Kartı" : proSubscriptionDetail?.PaymentType === 1 ? "EFT" : "-"}</div>
                    }
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/3 flex p-sm-gray-700"><span>Bitiş Tarihi</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-2/3 ml-2">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-2/3 ml-2">
                          {proSubscriptionDetail?.ExpirationDateJSTime === 0 ?
                            "-"
                            :
                            <DateView className="p-sm" dateNumber={proSubscriptionDetail?.ExpirationDateJSTime ?? 0} pattern="dd.MM.yyyy HH:mm" />
                          }
                        </div>
                    }
                  </div>
                  {(proSubscriptionDetail?.Bill === null || proSubscriptionDetail?.Bill === "") ?
                    <></>
                    :
                    <div className="flex mb-2">
                      <a className="text-blue-400 text-sm font-medium cursor-pointer" href={proSubscriptionDetail?.Bill} target="_blank">
                        Faturayı görüntüle
                      </a>
                    </div>
                  }
                </div>
              </div>
              <Table
                key={"subscriptionTableEl"}
                ref={subscriptionTableEl}
                emptyListText={"Veri Bulunamadı"}
                getDataFunction={getSubscriptionHistory}
                header={
                  <div className="lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-1 flex items-center">
                      <span className="p-sm-gray-400">
                        Üyelik Paketi
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Başlangıç Tarihi
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Ödeme Tarihi
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Ödeme Bilgisi
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Ödeme Tutarı
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        İşlemler
                      </span>
                    </div>
                  </div>}
                renderItem={(e, i) => {
                  return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center">
                    <div className="lg:col-span-2">
                      <span className="table-mobile-label">Üyelik Paketi:</span>
                      <p className="p-sm">
                        {e.PackageName}
                      </p>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="table-mobile-label">Başlangıç Tarihi:</span>
                      <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.StartDateJSTime} pattern="dd/MM/yyyy HH:mm" />
                    </div>
                    <div className="lg:col-span-2">
                      <span className="table-mobile-label">Ödeme Tarihi:</span>
                      <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.PayedDateJSTime} pattern="dd/MM/yyyy HH:mm" />
                    </div>
                    <div className="lg:col-span-2">
                      <span className="table-mobile-label">Ödeme Bilgisi:</span>
                      <p className="p-sm">
                        {e.PayInfo}
                      </p>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="table-mobile-label">Ödeme Tutarı:</span>
                      <p className="p-sm">
                        {e.PayedAmount === 0 ?
                          <>{fraction.format(e.PayedAmount)} TL </>
                          :
                          <>{formatter.format(e.PayedAmount)} TL</>
                        }
                      </p>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="table-mobile-label">İşlemler:</span>
                      {(e.Bill !== "" && e.Bill !== null) ?
                        <a className="text-sm text-blue-400 font-medium text-center mt-2 block" href={e.Bill} target="_blank">
                          Faturayı görüntüle
                        </a>
                        :
                        "-"
                      }
                    </div>
                  </div>
                }}
              />
            </>
            :
            selectedTabsId === 2 ?
              <>
                <div>
                  <div className="py-4 border-b border-gray-200">
                    <h2>Hizmetler</h2>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Profesyonel Kategorisi</span>
                      <span className="text-gray-900 font-medium text-sm">: {proDetail?.ParentCategoryName}</span>
                    </div>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Hizmet Alanları</span>
                      <span className="text-gray-900 font-medium text-sm">: {proDetail?.ServiceCategoryList.map((item, index) => (index < proDetail?.ServiceCategoryList.length - 1 ? item.Name + ", " : item.Name))}</span>
                    </div>
                  </div>
                  <div className="py-4 border-b border-gray-200">
                    <h2>Çalışma Saatleri</h2>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Mesai Başlangıç Saati:</span>
                      <span className="text-gray-900 font-medium text-sm">: {proDetail?.ShiftData.find(x => x.Type == 1)?.Name}</span>
                    </div>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Mesai Bitiş Saati</span>
                      <span className="text-gray-900 font-medium text-sm">: {proDetail?.ShiftData.find(x => x.Type == 2)?.Name}</span>
                    </div>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Ek Hizmetler</span>
                      <span className="text-gray-900 font-medium text-sm">: {
                        proDetail?.ShiftData.filter(x => x.Type == 3 && x.Name !== "").map((item, index) => (
                          <>
                            {(index < proDetail?.ShiftData.filter(x => x.Type == 3 && x.Name !== "").length - 1) ? item.Name + ", " : item.Name}
                          </>
                        ))
                      }</span>
                    </div>
                  </div>
                  <div className="py-4 border-b border-gray-200">
                    <h2>Ücret Standartları</h2>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Min. Ücret</span>
                      <span className="text-gray-900 font-medium text-sm">
                        {(proDetail?.MinPrice ?? 0) % 1 === 0 ?
                          <>: {fraction.format((proDetail?.MinPrice ?? 0))} TL </>
                          :
                          <>: {formatter.format((proDetail?.MinPrice ?? 0))} TL</>
                        }
                      </span>
                    </div>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Max. Ücret</span>
                      <span className="text-gray-900 font-medium text-sm">
                        {(proDetail?.MaxPrice ?? 0) % 1 === 0 ?
                          <>: {fraction.format((proDetail?.MaxPrice ?? 0))} TL </>
                          :
                          <>: {formatter.format((proDetail?.MaxPrice ?? 0))} TL</>
                        }
                      </span>
                    </div>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Ek Hizmetler</span>
                      <span className="text-gray-900 font-medium text-sm">: {proDetail?.PriceData.map((item, index) => (index < proDetail?.PriceData.length - 1 ? item + ", " : item))}</span>
                    </div>
                  </div>
                  <div className="py-4 border-b border-gray-200">
                    <h2>Hizmet Bölgeleri</h2>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Seçili İl</span>
                      <span className="text-gray-900 font-medium text-sm">: {proDetail?.ServiceCityName}</span>
                    </div>
                    <div className="mt-4 flex">
                      <span className="w-1/5 text-gray-700 text-sm">Seçili Bölgeler</span>
                      <span className="text-gray-900 font-medium text-sm">: {proDetail?.DistrictList.map((item, index) => (index < proDetail?.DistrictList.length - 1 ? item.name + ", " : item.name))}</span>
                    </div>
                  </div>
                </div>
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <div className="py-4 ">
                    <div className="w-full">
                      <h2>Profesyonel Galerisi</h2>
                      {
                        loading ?
                          <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-1">
                              <Loading height="h-60" width="w-full" />
                            </div>
                            <div className="col-span-1">
                              <Loading height="h-60" width="w-full" />
                            </div>
                            <div className="col-span-1">
                              <Loading height="h-60" width="w-full" />
                            </div>
                            <div className="col-span-1">
                              <Loading height="h-60" width="w-full" />
                            </div>
                            <div className="col-span-1">
                              <Loading height="h-60" width="w-full" />
                            </div>
                          </div>
                          :
                          <>
                            {
                              proDetail?.MediaList && proDetail?.MediaList.length > 0 ?
                                <>
                                  <SRLWrapper>
                                    <div className="mt-3 grid grid-cols-5 ">
                                      {
                                        proDetail?.MediaList.map((item) => (
                                          <div className="col-span-1 h-60 inline-block mr-2">
                                            <Image className="w-full h-60 object-cover cursor-pointer" src={item.FileUrl} alt={item.FileName}></Image>
                                          </div>
                                        ))
                                      }
                                    </div>
                                  </SRLWrapper>
                                </>
                                :
                                <div className="text-sm text-black-400">(Yüklü görsel bulunamadı)</div>
                            }
                          </>

                      }
                    </div>
                  </div>
                  <div className="py-4 border-t border-gray-200">
                    <div className="w-2/3">
                      <h2>Profesyonel Üyelikleri</h2>
                      {
                        loading ?
                          <Loading height="h-6" width="w-100" className="rounded-sm mt-3" />
                          :
                          <div className="flex gap-1 mt-3">
                            <div className="w-1/4 flex p-sm-gray-700">
                              <div>Seçili Üyelikler</div>
                              <div className="ml-auto">:</div>
                            </div>
                            <div className="text-tiny text-gray-900 my-auto flex gap-1">
                              {
                                proDetail?.SocietyData && proDetail?.SocietyData.length > 0 ?
                                  proDetail?.SocietyData.map((item, index) => (
                                    index < proDetail.SocietyData.length - 1 ?
                                      <span>{item.Title + ","}</span>
                                      :
                                      <span>{item.Title}</span>
                                  ))
                                  :
                                  <span>-</span>
                              }
                            </div>
                          </div>
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
                            <Label className="mt-3" title="Tanıtım Yazısı" withoutDots />
                            <div className="w-100 h-60 border border-gray-300 text-gray-900 overflow-y-auto custom-scrollbar rounded-lg p-2 text-sm">
                              <p className="ck-editor-links" dangerouslySetInnerHTML={{ __html: proDetail?.IntroText ?? "" }} >
                              </p>
                            </div>

                            {
                              proDetail?.SectionData.map((item) => (
                                <>
                                  <Label className="mt-3" title={item.Title} withoutDots />
                                  <div className="w-100 h-60 border text-gray-900 border-gray-300 overflow-y-auto custom-scrollbar rounded-lg p-2 text-sm">
                                    <p className="ck-editor-links" dangerouslySetInnerHTML={{ __html: item.Description }} >
                                    </p>
                                  </div>
                                </>
                              ))
                            }
                          </>
                      }
                    </div>
                  </div>
                </>
                :
                selectedTabsId === 4 ?
                  <>
                    <Table
                      ref={tableContactList}
                      key={"tableContact"}
                      emptyListText={"İletişim Bilgisi Bulunamadı"}
                      getDataFunction={getContactList}
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
                        return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center">
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
                              {e.PhonePreview}
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
                            {
                              proDetail?.Status === 3 &&
                              <div className="text-gray-700 flex gap-2 items-center">
                                <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                                  onClick={() => { handleShowUpdateContactModal(e); }} />
                                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteContact(e); }} />
                              </div>
                            }
                          </div>
                        </div>
                      }}
                    />
                  </>
                  :
                  selectedTabsId === 5 ?
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
                          <div className=" lg:grid-cols-6 px-2 border-b  py-5 border-gray-200 hidden lg:grid gap-4">
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
                                  <Button isLoading={processLoading} buttonSm textTiny className="w-24 my-auto" design="button-blue-400" text="Onayla" onClick={() => { setIsApprovedClicked(true); handleApproveDocumentStatus(item.Id); }} />
                                  <Button isLoading={processLoading} buttonSm textTiny className="w-24 my-auto" design="button-gray-100" text="Reddet" onClick={() => { setIsApprovedClicked(true); handleOpenRejectDocumentModal(item.Id); }} />
                                </>
                              }
                            </div>
                          </div>
                        ))
                      }
                    </>
                    :
                    selectedTabsId === 6 ?
                      <>
                        <div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                          <div className="lg:col-span-1 flex items-center">
                            <span className="p-sm-gray-400">
                              Rozet Görseli
                            </span>
                          </div>
                          <div className="lg:col-span-1">
                            <span className="p-sm-gray-400">
                              Rozet Adı
                            </span>
                          </div>
                          <div className="lg:col-span-3">
                            <span className="p-sm-gray-400">
                              Rozet Açıklaması
                            </span>
                          </div>
                          <div className="lg:col-span-1">
                            <span className="p-sm-gray-400">
                              Atanma Tarihi
                            </span>
                          </div>
                          <div className="lg:col-span-1">
                            <span className="p-sm-gray-400">
                              Durum
                            </span>
                          </div>
                        </div>
                        {
                          loading || badgeLoading ?
                            <>
                              <Loading width="w-full" height="h-20" className="my-2" />
                              <Loading width="w-full" height="h-20" className="my-2" />
                              <Loading width="w-full" height="h-20" className="my-2" />
                              <Loading width="w-full" height="h-20" className="my-2" />
                              <Loading width="w-full" height="h-20" className="my-2" />
                              <Loading width="w-full" height="h-20" className="my-2" />
                            </>
                            :
                            badgeList && badgeList.length > 0 ?
                              <>
                                {
                                  badgeList.map((e, i) => (
                                    <>
                                      <div key={"list" + i} className=" lg:grid-cols-7 px-2 border-b  py-5 border-gray-200 hidden lg:grid gap-4">
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            <Image src={e.PhotoUrl} alt={e.Name} className="w-16 h-16 object-contain"></Image>
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            {e.Name}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-3 flex items-center">
                                          <span className="p-sm">
                                            {e.Description}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <DateView className="p-sm" dateNumber={e.AssignmentDateJSTime} pattern="dd/MM/yyyy HH:mm" />
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className={e.IsEnabled ? "text-sm text-green-400 font-medium" : "text-sm text-red-400 font-medium"}>
                                            {e.IsEnabled ? "Aktif" : "Pasif"}
                                          </span>
                                          <div className="text-gray-700 flex gap-2 items-center ml-auto">
                                            <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteBadge(e); }} />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  ))
                                }
                              </>
                              :
                              <>
                                <div className="text-center my-4">
                                  <SearchIconLg className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                                  <p className="text-tiny text-gray-900 font-medium">{"Kayıtlı Rozet Bulunamadı"}</p>
                                </div>
                              </>

                        }
                      </>
                      :
                      selectedTabsId === 7 ?
                        <>
                          <Table
                            ref={requestTableEl}
                            key={"requestTableEl"}
                            emptyListText={"Talep Bulunamadı"}
                            getDataFunction={getProRequestListForAdmin}
                            header={
                              <div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                                <div className="lg:col-span-1 flex items-center">
                                  <span className="p-sm-gray-400">
                                    Müşteri Bilgisi
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm-gray-400">
                                    Talep Tarihi
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm-gray-400">
                                    İş Tanımı
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm-gray-400">
                                    Teklif Oluşturulma Tarihi
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm-gray-400">
                                    Red Tarihi
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm-gray-400">
                                    Red Nedeni
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm-gray-400">
                                    Durum
                                  </span>
                                </div>
                              </div>
                            }
                            renderItem={(e: ProRequestInnerModelForAdmin, i) => {
                              return <div key={"list" + i} className=" lg:grid-cols-7 px-2 border-b  py-5 border-gray-200 hidden lg:grid gap-4">
                                <div className="lg:col-span-1 flex items-center">
                                  <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-cover my-auto" />
                                  <span className="p-sm ml-2">
                                    {e.UserName}
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm">
                                    {handleJsTime(e.CreatedDateJSTime)}
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm">
                                    {e.CategoryName}
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm">
                                    {e.CreatedOfferDateJSTime > 0 ? handleJsTime(e.CreatedOfferDateJSTime) : "-"}
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm">
                                    {e.RejectDate > 0 ? handleJsTime(e.RejectDate) : "-"}
                                  </span>
                                </div>
                                <div className="lg:col-span-1">
                                  <span className="p-sm">
                                    {e.RejectDate > 0 ? e.RejectTitle : ""}
                                  </span>
                                </div>
                                <div className="lg:col-span-1 flex">
                                  {
                                    e.Status === ProRequestStatues.WAITING_APPROVAL ?
                                      <>
                                        {
                                          Date.now() > e.OfferExpireDateJSTime ?
                                            <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto text-sm flex items-center justify-center rounded-full">Teklif Süresi Doldu</div>
                                            :
                                            <div className="w-40 bg-red-100 text-yellow-600 font-medium py-1 my-auto text-sm flex items-center justify-center rounded-full">Teklif Bekliyor</div>
                                        }
                                      </>
                                      :
                                      e.Status === ProRequestStatues.OFFER_CREATED ?
                                        <div className="w-40 bg-green-100 text-green-400 font-medium py-1 my-auto text-sm flex items-center justify-center rounded-full">Teklif Oluşturuldu</div>
                                        :
                                        e.Status === ProRequestStatues.REJECTED ?
                                          <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto text-sm flex items-center justify-center rounded-full">Talep Reddedildi</div>
                                          :
                                          e.Status === ProRequestStatues.CANCELED ?
                                            <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 text-sm flex items-center justify-center rounded-full">Talep İptal Edildi</div>
                                            :
                                            <></>
                                  }
                                  <span className="ml-auto my-auto text-gray-900">
                                    <div className="text-gray-700 flex gap-2 items-center">
                                      <Link to={{ pathname: `/hizmet-detay/${e.WorkId}`, state: { prevTitle: proDetail?.StoreName ?? "", prevPath: window.location.pathname, tabId: 3 } }}>
                                        <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all " />
                                      </Link>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            }}
                          />
                        </>
                        :
                        selectedTabsId === 8 ?
                          <>
                            <Table
                              ref={offerTableEl}
                              key={"offerTableEl"}
                              emptyListText={"Teklif Bulunamadı"}
                              getDataFunction={getProOfferListForAdmin}
                              header={
                                <div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                                  <div className="lg:col-span-1 flex items-center">
                                    <span className="p-sm-gray-400">
                                      Müşteri Bilgisi
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1">
                                    <span className="p-sm-gray-400">
                                      Teklif Tarihi
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1">
                                    <span className="p-sm-gray-400">
                                      İş Tanımı
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1">
                                    <span className="p-sm-gray-400">
                                      Proje Süresi
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1">
                                    <span className="p-sm-gray-400">
                                      Toplam Tutar
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1">
                                    <span className="p-sm-gray-400">
                                      Teklif Onay Tarihi
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1">
                                    <span className="p-sm-gray-400">
                                      Teklif Red Tarihi
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1">
                                    <span className="p-sm-gray-400">
                                      Red Nedeni
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1">
                                    <span className="p-sm-gray-400">
                                      Durum
                                    </span>
                                  </div>
                                </div>
                              }
                              renderItem={(e: ProOfferInnerModelForAdmin, i) => {
                                return <div key={"list" + i} className=" lg:grid-cols-9 px-2 border-b py-5 border-gray-200 hidden lg:grid gap-4">
                                  <div className="lg:col-span-1 flex items-center">
                                    <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-contain my-auto" />
                                    <span className="p-sm ml-2">
                                      {e.UserName}
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1 flex items-center">
                                    <span className="p-sm">
                                      {handleJsTime(e.CreatedDateJSTime)}
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1 flex items-center">
                                    <span className="p-sm">
                                      {e.CategoryName}
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1 flex items-center">
                                    <span className="p-sm">
                                      {e.ProjectDayCount + " gün"}
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1 flex items-center">
                                    <span className="p-sm">
                                      {(e.TotalPrice ?? 0) % 1 === 0 ?
                                        <>{fraction.format((e.TotalPrice ?? 0))} TL </>
                                        :
                                        <>{formatter.format((e.TotalPrice ?? 0))} TL</>
                                      }
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1 flex items-center">
                                    <span className="p-sm">
                                      {e.ApprovedOfferDateJSTime > 0 ? handleJsTime(e.ApprovedOfferDateJSTime) : "-"}
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1 flex items-center">
                                    <span className="p-sm">
                                      {e.RejectDate > 0 ? handleJsTime(e.RejectDate) : "-"}
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1 flex items-center">
                                    <span className="p-sm">
                                      {e.RejectDate > 0 ? e.RejectTitle : "-"}
                                    </span>
                                  </div>
                                  <div className="lg:col-span-1 flex">
                                    {
                                      e.Status === OfferStatusType.WAITING_APPROVAL ?
                                        <>
                                          {
                                            Date.now() > e.OfferExpireDateJSTime ?
                                              <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Süre Doldu</div>
                                              :
                                              <div className="w-40 bg-yellow-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Onay Bekliyor</div>
                                          }
                                        </>
                                        :
                                        e.Status === OfferStatusType.APPROVED ?
                                          <div className="w-40 bg-green-100 text-green-400 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Kabul Edildi</div>
                                          :
                                          e.Status === OfferStatusType.REJECTED ?
                                            <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto text-sm flex items-center justify-center rounded-full">Reddedildi</div>
                                            :
                                            <></>
                                    }
                                    <span className="ml-auto my-auto text-gray-900">
                                      <div className="text-gray-700 flex gap-2 items-center">
                                        <Link to={{ pathname: `/hizmet-detay/${e.WorkId}`, state: { prevTitle: proDetail?.StoreName ?? "", prevPath: window.location.pathname, tabId: 2 } }}>
                                          <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all " />
                                        </Link>
                                      </div>
                                    </span>
                                  </div>
                                </div>
                              }}
                            />
                          </>
                          :
                          selectedTabsId === 9 ?
                            <>
                              <Table
                                ref={workTableEl}
                                key={"workTableEl"}
                                emptyListText={"İş Bulunamadı"}
                                getDataFunction={getProWorkListForAdmin}
                                header={
                                  <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                                    <div className="lg:col-span-1 flex items-center">
                                      <span className="p-sm-gray-400">
                                        Müşteri Bilgisi
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1">
                                      <span className="p-sm-gray-400">
                                        İş Tanımı
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1">
                                      <span className="p-sm-gray-400">
                                        İş Başlangıç Tarihi
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1">
                                      <span className="p-sm-gray-400">
                                        İş Teslim Tarihi
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1">
                                      <span className="p-sm-gray-400">
                                        Toplam Tutar
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1">
                                      <span className="p-sm-gray-400">
                                        Hizmet Onay Tarihi
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1">
                                      <span className="p-sm-gray-400">
                                        Hizmet İptal Tarihi
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1">
                                      <span className="p-sm-gray-400">
                                        Durum
                                      </span>
                                    </div>
                                  </div>
                                }
                                renderItem={(e: ProWorkModelInnerForAdmin, i) => {
                                  return <div key={"list" + i} className=" lg:grid-cols-8 px-2 border-b py-5 border-gray-200 hidden lg:grid gap-4">
                                    <div className="lg:col-span-1 flex items-center">
                                      <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-contain my-auto" />
                                      <span className="p-sm ml-2">
                                        {e.UserName}
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1 flex items-center">
                                      <span className="p-sm">
                                        {e.WorkName}
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1 flex items-center">
                                      <span className="p-sm">
                                        {e.WorkStartDateJSTime > 0 ? handleJsTime(e.WorkStartDateJSTime) : "-"}
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1 flex items-center">
                                      <span className="p-sm">
                                        {e.WorkCompleteDateJSTime > 0 ? handleJsTime(e.WorkCompleteDateJSTime) : "-"}
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1 flex items-center">
                                      <span className="p-sm">
                                        {
                                          (e.Status === WorkStatus.REQUEST_CANCELED || e.Status === WorkStatus.REQUEST_REJECTED || e.Status === WorkStatus.WAITING_OFFER) ?
                                            <>-</>
                                            :
                                            <>
                                              {(e.TotalPrice ?? 0) % 1 === 0 ?
                                                <>{fraction.format((e.TotalPrice ?? 0))} TL </>
                                                :
                                                <>{formatter.format((e.TotalPrice ?? 0))} TL</>
                                              }
                                            </>
                                        }
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1 flex items-center">
                                      <span className="p-sm">
                                        {e.ApprovedWorkDateJSTime > 0 ? handleJsTime(e.ApprovedWorkDateJSTime) : "-"}
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1 flex items-center">
                                      <span className="p-sm">
                                        {
                                          (e.Status === WorkStatus.REQUEST_REJECTED || e.Status === WorkStatus.REQUEST_CANCELED || e.Status === WorkStatus.OFFER_REJECTED || e.Status === WorkStatus.WORK_CANCELED_BY_PRO || e.Status === WorkStatus.WORK_CANCELED_BY_USER) ?
                                            <>
                                              {e.RejectDate > 0 ? handleJsTime(e.RejectDate) : "-"}
                                            </>
                                            :
                                            <>-</>
                                        }
                                      </span>
                                    </div>
                                    <div className="lg:col-span-1 flex ">
                                      {
                                        e.Status === WorkStatus.WORK_COMPLETED ?
                                          <div className="w-40 bg-green-100 text-green-400 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">İş Tamamlandı</div>
                                          :
                                          e.Status === WorkStatus.REQUEST_CANCELED ?
                                            <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Talep İptal Edildi</div>
                                            :
                                            e.Status === WorkStatus.REQUEST_REJECTED ?
                                              <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Talep Reddedildi</div>
                                              :
                                              e.Status === WorkStatus.OFFER_REJECTED ?
                                                <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Reddedildi</div>
                                                :
                                                e.Status === WorkStatus.WAITING_OFFER ?
                                                  <>
                                                    {
                                                      Date.now() > e.OfferExpireDateJSTime ?
                                                        <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Süresi Doldu</div>
                                                        :
                                                        <div className="w-40 bg-red-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Bekliyor</div>
                                                    }
                                                  </>
                                                  :
                                                  e.Status === WorkStatus.WAITING_OFFER_RESULT ?
                                                    <>
                                                      {
                                                        Date.now() > e.OfferExpireDateJSTime ?
                                                          <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Süresi Doldu</div>
                                                          :
                                                          <div className="w-40 bg-yellow-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Teklif Onay Bekliyor</div>
                                                      }
                                                    </>
                                                    :
                                                    (e.Status === WorkStatus.WATING_WORK_START || e.Status === WorkStatus.WAITING_TO_WORK_COMPLETE) ?
                                                      <div className="w-40 bg-blue-100 text-blue-400 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">İş Devam Ediyor</div>
                                                      :
                                                      (e.Status === WorkStatus.WORK_CANCELED_BY_PRO || WorkStatus.WORK_CANCELED_BY_USER) ?
                                                        <div className="w-40 bg-gray-100 text-gray-900 font-medium py-1 my-auto text-sm flex items-center justify-center rounded-full">İş İptal Edildi</div>
                                                        :
                                                        e.Status === WorkStatus.WAITING_TO_WORK_COMPLETE ?
                                                          <div className="w-40 bg-red-100 text-yellow-600 font-medium py-1 my-auto  text-sm flex items-center justify-center rounded-full">Devam Ediyor</div>
                                                          :
                                                          <></>
                                      }
                                      <span className="ml-auto my-auto text-gray-900">
                                        <div className="text-gray-700 flex gap-2 items-center">
                                          <Link to={{ pathname: `/hizmet-detay/${e.WorkId}`, state: { prevTitle: proDetail?.StoreName ?? "", prevPath: window.location.pathname, tabId: 1 } }}>
                                            <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all " />
                                          </Link>
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                }}
                              />
                            </>
                            :
                            selectedTabsId === 10 ?
                              <>
                                <Table
                                  ref={ideaTableEl}
                                  key={"ideaTableEl"}
                                  emptyListText={"Fikir Bulunamadı"}
                                  getDataFunction={getProIdeaListForAdmin}
                                  header={
                                    <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className="p-sm-gray-400">
                                          Fikir Adı
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1">
                                        <span className="p-sm-gray-400">
                                          Kategori
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1">
                                        <span className="p-sm-gray-400">
                                          Oluşturulma Tarihi
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1">
                                        <span className="p-sm-gray-400">
                                          Kulllanılan Ürün Sayısı
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1">
                                        <span className="p-sm-gray-400">
                                          Gelen Soru Sayısı
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1">
                                        <span className="p-sm-gray-400">
                                          Görüntülenme Sayısı
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1">
                                        <span className="p-sm-gray-400">
                                          Favoriye Eklenme Sayısı
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1">
                                        <span className="p-sm-gray-400">
                                          Durum
                                        </span>
                                      </div>
                                    </div>
                                  }
                                  renderItem={(e, i) => {
                                    return <div key={"list" + i} className=" lg:grid-cols-8 px-2 border-b py-5 border-gray-200 hidden lg:grid gap-4">
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className="p-sm">
                                          {e.Name}
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className="p-sm">
                                          {e.CategoryName}
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className="p-sm">
                                          {handleJsTime(e.CreatedDateJSTime)}
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className="p-sm">
                                          {e.ProductCount}
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className="p-sm">
                                          {e.QuestionCount}
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className="p-sm">
                                          {e.ViewCount}
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className="p-sm">
                                          {e.FavoriteCount}
                                        </span>
                                      </div>
                                      <div className="lg:col-span-1 flex items-center">
                                        <span className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                                          {e.IsEnabled === true ? "Aktif" : "Pasif"}
                                        </span>
                                        <div className="text-gray-700 flex gap-2 items-center ml-auto">
                                          <Link className="hover:text-blue-400 cursor-pointer transition-all" to={{ pathname: `${"/proje-duzenle/" + e.Id}`, state: { IsIdeaApproved: true } }} >
                                            <EditIcon className="icon-sm " />
                                          </Link>
                                          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDeleteIdeaModal(e) }} />
                                          <Link className="hover:text-blue-400 cursor-pointer transition-all" to={{ pathname: `${"/proje-detay/" + e.Id}`, state: { IsIdeaApproved: true } }} >
                                            <ChevronRightIcon className="icon-sm " />
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  }}
                                />
                              </>
                              :
                              selectedTabsId === 11 ?
                                <>
                                  <Table
                                    ref={projectTableEl}
                                    key={"projectTableEl"}
                                    emptyListText={"Proje Bulunamadı"}
                                    getDataFunction={getProProjectListForAdmin}
                                    header={
                                      <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm-gray-400">
                                            Proje Adı
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1">
                                          <span className="p-sm-gray-400">
                                            Kategori
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1">
                                          <span className="p-sm-gray-400">
                                            Oluşturulma Tarihi
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1">
                                          <span className="p-sm-gray-400">
                                            Kulllanılan Ürün Sayısı
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1">
                                          <span className="p-sm-gray-400">
                                            Gelen Soru Sayısı
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1">
                                          <span className="p-sm-gray-400">
                                            Görüntülenme Sayısı
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1">
                                          <span className="p-sm-gray-400">
                                            Favoriye Eklenme Sayısı
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1">
                                          <span className="p-sm-gray-400">
                                            Durum
                                          </span>
                                        </div>
                                      </div>
                                    }
                                    renderItem={(e, i) => {
                                      return <div key={"list" + i} className=" lg:grid-cols-8 px-2 border-b py-5 border-gray-200 hidden lg:grid gap-4">
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            {e.Name}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            {e.CategoryName}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            {handleJsTime(e.CreatedDateJSTime)}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            {e.ProductCount}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            {e.QuestionCount}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            {e.ViewCount}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className="p-sm">
                                            {e.FavoriteCount}
                                          </span>
                                        </div>
                                        <div className="lg:col-span-1 flex items-center">
                                          <span className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                                            {e.IsEnabled === true ? "Aktif" : "Pasif"}
                                          </span>
                                          <div className="text-gray-700 flex gap-2 items-center ml-auto">
                                            <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDeleteProjectModal(e); }} />
                                            <Link to={{ pathname: `${"/proje-detay/" + e.Id}`, state: { prevTitle: "Profesyonel Detay", prevPath: window.location.pathname, tabId: 1, IsIdeaApproved: false } }} >
                                              <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    }}
                                  />
                                </>
                                :
                                selectedTabsId === 12 ?
                                  <>
                                    <div className="py-5 grid lg:grid-cols-5 items-center gap-3">
                                      {
                                        evaluationSummaryLoading ?
                                          <>
                                            <div className="lg:col-span-1 ">
                                              <Loading width="w-full" height="h-32" />
                                            </div>
                                            <div className="lg:col-span-1 ">
                                              <Loading width="w-full" height="h-32" />
                                            </div>
                                            <div className="lg:col-span-1 ">
                                              <Loading width="w-full" height="h-32" />
                                            </div>
                                            <div className="lg:col-span-1 ">
                                              <Loading width="w-full" height="h-32" />
                                            </div>
                                            <div className="lg:col-span-1 ">
                                              <Loading width="w-full" height="h-32" />
                                            </div>
                                          </>
                                          :
                                          <>
                                            <div className="lg:col-span-1 h-full">
                                              <div className="flex flex-col items-center bg-blue-100 h-full justify-center text-tiny font-medium border rounded-lg p-5">
                                                <div className="flex items-center">
                                                  <StarIcon className="w-4 h-4 text-yellow-600" />
                                                  <span className="text-yellow-600 ml-2">
                                                    {
                                                      (((evaluationSummary?.AverageTimingRate ?? 0) + (evaluationSummary?.AveragePerfectionRate ?? 0) + (evaluationSummary?.AverageSkillRate ?? 0) + (evaluationSummary?.AverageBehaviorRate ?? 0)) / 4) % 1 === 0 ?
                                                        (((evaluationSummary?.AverageTimingRate ?? 0) + (evaluationSummary?.AveragePerfectionRate ?? 0) + (evaluationSummary?.AverageSkillRate ?? 0) + (evaluationSummary?.AverageBehaviorRate ?? 0)) / 4)
                                                        :
                                                        (((evaluationSummary?.AverageTimingRate ?? 0) + (evaluationSummary?.AveragePerfectionRate ?? 0) + (evaluationSummary?.AverageSkillRate ?? 0) + (evaluationSummary?.AverageBehaviorRate ?? 0)) / 4).toFixed(1)
                                                    }</span>
                                                  <span className="text-gray-400 ml-2">/ 5</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="lg:col-span-1 p-5   items-center rounded-md border border-gray-200">
                                              <div className="flex justify-center flex items-center">
                                                <span className=" text-tiny font-small">Zamanlama:</span>
                                                <span className=" text-tiny font-medium ml-2">{handleRateValueText((evaluationSummary?.AverageTimingRate ?? 0))}</span>
                                                <ErrorIcon className="h-4 w-4 transform -rotate-180 ml-2 text-blue-400" />
                                              </div>
                                              <div className="text-yellow-600 mt-2 justify-center flex items-center">
                                                <RateStars rateValue={evaluationSummary?.AverageTimingRate ?? 0} onProfessional={true} className="h-4 text-yellow-600" />
                                              </div>
                                              <div className="flex mt-2 items-center justify-center">
                                                <span className=" text-tiny text-yellow-600 font-medium ml-2">{evaluationSummary?.AverageTimingRate ?? 0}</span>
                                                <span className=" text-tiny text-gray-400 font-medium ml-2">/</span>
                                                <span className=" text-tiny text-gray-400 font-medium ml-2">5</span>
                                              </div>
                                            </div>
                                            <div className="lg:col-span-1 p-5   items-center rounded-md border border-gray-200">
                                              <div className="flex justify-center flex items-center">
                                                <span className=" text-tiny font-small">Titiz Çalışma:</span>
                                                <span className=" text-tiny font-medium ml-2">{handleRateValueText(evaluationSummary?.AveragePerfectionRate ?? 0)}</span>
                                                <ErrorIcon className="h-4 w-4 transform -rotate-180 ml-2 text-blue-400" />
                                              </div>
                                              <div className="text-yellow-600 mt-2 justify-center flex items-center">
                                                <RateStars rateValue={evaluationSummary?.AveragePerfectionRate ?? 0} onProfessional={true} className="h-4 text-yellow-600" />
                                              </div>
                                              <div className="flex mt-2 items-center justify-center">
                                                <span className=" text-tiny text-yellow-600 font-medium ml-2">{evaluationSummary?.AveragePerfectionRate ?? 0}</span>
                                                <span className=" text-tiny text-gray-400 font-medium ml-2">/</span>
                                                <span className=" text-tiny text-gray-400 font-medium ml-2">5</span>
                                              </div>
                                            </div>
                                            <div className="lg:col-span-1 p-5   items-center rounded-md border border-gray-200">
                                              <div className="flex justify-center flex items-center">
                                                <span className=" text-tiny font-small">Yetenek:</span>
                                                <span className=" text-tiny font-medium ml-2">{handleRateValueText(evaluationSummary?.AverageSkillRate ?? 0)}</span>
                                                <ErrorIcon className="h-4 w-4 transform -rotate-180 ml-2 text-blue-400" />
                                              </div>
                                              <div className="text-yellow-600 mt-2 justify-center flex items-center">
                                                <RateStars rateValue={evaluationSummary?.AverageSkillRate ?? 0} onProfessional={true} className="h-4 text-yellow-600" />
                                              </div>
                                              <div className="flex mt-2 items-center justify-center">
                                                <span className=" text-tiny text-yellow-600 font-medium ml-2">{evaluationSummary?.AverageSkillRate ?? 0}</span>
                                                <span className=" text-tiny text-gray-400 font-medium ml-2">/</span>
                                                <span className=" text-tiny text-gray-400 font-medium ml-2">5</span>
                                              </div>
                                            </div>
                                            <div className="lg:col-span-1 p-5   items-center rounded-md border border-gray-200">
                                              <div className="flex justify-center flex items-center">
                                                <span className=" text-tiny font-small">Davranış:</span>
                                                <span className=" text-tiny font-medium ml-2">{handleRateValueText(evaluationSummary?.AverageBehaviorRate ?? 0)}</span>
                                                <ErrorIcon className="h-4 w-4 transform -rotate-180 ml-2 text-blue-400" />
                                              </div>
                                              <div className="text-yellow-600 mt-2 justify-center flex items-center">
                                                <RateStars rateValue={evaluationSummary?.AverageBehaviorRate ?? 0} onProfessional={true} className="h-4 text-yellow-600" />
                                              </div>
                                              <div className="flex mt-2 items-center justify-center">
                                                <span className=" text-tiny text-yellow-600 font-medium ml-2">{evaluationSummary?.AverageBehaviorRate ?? 0}</span>
                                                <span className=" text-tiny text-gray-400 font-medium ml-2">/</span>
                                                <span className=" text-tiny text-gray-400 font-medium ml-2">5</span>
                                              </div>
                                            </div>
                                          </>
                                      }
                                    </div>
                                    <Table
                                      ref={evaluationTableEl}
                                      key={"evaluationTableEl"}
                                      emptyListText={"Değerlendirme Bulunamadı"}
                                      getDataFunction={getProEvaluateList}
                                      header={
                                        <div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                                          <div className="lg:col-span-1 flex items-center">
                                            <span className="p-sm-gray-400">
                                              Tarih
                                            </span>
                                          </div>
                                          <div className="lg:col-span-1">
                                            <span className="p-sm-gray-400">
                                              Müşteri Adı
                                            </span>
                                          </div>
                                          <div className="lg:col-span-1">
                                            <span className="p-sm-gray-400">
                                              İş Tanımı
                                            </span>
                                          </div>
                                          <div className="lg:col-span-3">
                                            <span className="p-sm-gray-400">
                                              Değerlendirme
                                            </span>
                                          </div>
                                        </div>
                                      }
                                      renderItem={(e, i) => {
                                        return <div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                                          <div className="lg:col-span-1 flex items-center">
                                            <span className="p-sm">
                                              {handleJsTime(e.CreatedDateJSTime)}
                                            </span>
                                          </div>
                                          <div className="lg:col-span-1 flex items-center">
                                            <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-contain my-auto" />
                                            <span className="p-sm ml-2">
                                              {e.UserName}
                                            </span>
                                          </div>
                                          <div className="lg:col-span-1 flex items-center">
                                            <span className="p-sm">
                                              {e.WorkName}
                                            </span>
                                          </div>

                                          <div className="lg:col-span-3 flex items-center">
                                            <div className="flex-columns">
                                              <RateStars className="h-4" rateValue={e.AverageRate} />
                                              <span className="p-sm">
                                                {e.UserComment}
                                              </span>
                                            </div>
                                            <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 ml-auto text-gray-400 cursor-pointer transition-all border-l pl-1"
                                              onClick={() => { handleOpenEvaluationModal(e); }} />
                                          </div>
                                        </div>
                                      }}
                                    />
                                  </>
                                  :
                                  selectedTabsId === 13 ?
                                    <>
                                      <Table
                                        ref={reportTableEl}
                                        key={"reportTableEl"}
                                        emptyListText={"Sorun Bildirimi Bulunamadı"}
                                        getDataFunction={getProReportsForAdmin}
                                        header={< div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                                          <div className="lg:col-span-1 flex items-center">
                                            <span className="p-sm-gray-400">
                                              Tarih
                                            </span>
                                          </div>
                                          <div className="lg:col-span-3">
                                            <span className="p-sm-gray-400">
                                              Müşteri Adı
                                            </span>
                                          </div>
                                          <div className="lg:col-span-3">
                                            <span className="p-sm-gray-400">
                                              Şikayet Nedeni
                                            </span>
                                          </div>
                                        </div>}
                                        renderItem={(e: WorkReportModel, i) => {
                                          return <div className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
                                            <div className="lg:col-span-1 flex items-center">
                                              <p className="p-sm" >
                                                {handleJsTime(e.CreatedDateJS)}
                                              </p>
                                            </div>
                                            <div className="lg:col-span-3 flex lg:block items-center">
                                              <Image src={e.UserPhoto ?? ""} alt={e.UserName} className="w-10 h-10 object-cover rounded-full" />
                                              <p className="p-sm" >
                                                {e.UserName}
                                              </p>
                                            </div>
                                            <div className="lg:col-span-2 flex items-center">
                                              <p className="p-sm">{e.ReportTitle}</p>
                                              <TrashIcon className="ml-auto icon-sm text-gray-700 cusrsor-pointer" onClick={() => { showDeleteReportModal(e); }} />
                                            </div>
                                          </div>
                                        }}
                                      />
                                    </>
                                    :
                                    selectedTabsId === 14 ?
                                      <>
                                        <div className="flex py-5 gap-4 border-b border-gray-200">
                                          <div className="w-1/2">
                                            <h4 className="mb-4">Ortalama Talep Yanıtlama Süresi</h4>
                                            {
                                              storeRatesLoading ?
                                                <Loading width="w-full" height="h-28" />
                                                :
                                                <div className="flex">
                                                  <div className="w-1/2 p-5 flex shadow-md">
                                                    {
                                                      ((storeRates?.AverageMessageTime ?? 0) === 0) ?
                                                        <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                        :
                                                        ((storeRates?.AverageMessageTime ?? 0) > 0 && (storeRates?.AverageMessageTime ?? 0) < 6) ?
                                                          <HappyFaceIcon className="w-16 h-16 text-green-400" />
                                                          :
                                                          ((storeRates?.AverageMessageTime ?? 0) >= 6 && (storeRates?.AverageMessageTime ?? 0) < 12) ?
                                                            <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                            :
                                                            ((storeRates?.AverageMessageTime ?? 0) >= 12) ?
                                                              <SadFaceIcon className="w-16 h-16 text-red-400" />
                                                              :
                                                              <></>
                                                    }
                                                    <div className="flex-columns ml-3 my-auto">
                                                      <div className="text-tiny text-gray-900">{(storeRates?.AverageMessageTime ?? 0) > 0 ? <>{(storeRates?.AverageMessageTime ?? 0)} saat</> : <>-</>}</div>
                                                    </div>
                                                  </div>
                                                  <div className="w-1/2 ml-5 my-auto">
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Toplam Talep Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.TotalRequestCount ?? 0) > 0 ? <>{(storeRates?.TotalRequestCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Teklif Bekleyen Talep Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(((storeRates?.TotalRequestCount ?? 0) - ((storeRates?.ApprovedRequestCount ?? 0) + (storeRates?.RejectedRequestCount ?? 0) + (storeRates?.ExpiredRequestCount ?? 0))) ?? 0) > 0 ? <>{(((storeRates?.TotalRequestCount ?? 0) - ((storeRates?.ApprovedRequestCount ?? 0) + (storeRates?.RejectedRequestCount ?? 0) + (storeRates?.ExpiredRequestCount ?? 0))) ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Teklif Oluşturulan Talep Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.TotalOfferCount ?? 0) > 0 ? <>{(storeRates?.TotalOfferCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Süresi Dolmuş Talep Sayısı</div>
                                                      <div className="text-sm text-red-400">: {(storeRates?.ExpiredRequestCount ?? 0) > 0 ? <>{(storeRates?.ExpiredRequestCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                  </div>
                                                </div>
                                            }
                                          </div>
                                          <div className="w-1/2">
                                            <h4 className="mb-4">Teklif Kabul / Red Oranı</h4>
                                            {
                                              storeRatesLoading ?
                                                <Loading width="w-full" height="h-28" />
                                                :
                                                <div className="flex mt-4">
                                                  <div className="w-1/2 p-5 flex shadow-md">
                                                    {
                                                      ((storeRates?.ApprovedOfferRate ?? 0) === 0) ?
                                                        <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                        :
                                                        ((storeRates?.ApprovedOfferRate ?? 0) > 0 && (storeRates?.ApprovedOfferRate ?? 0) < 40) ?
                                                          <SadFaceIcon className="w-16 h-16 text-red-400" />
                                                          :
                                                          ((storeRates?.ApprovedOfferRate ?? 0) >= 40 && (storeRates?.ApprovedOfferRate ?? 0) < 70) ?
                                                            <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                            :
                                                            ((storeRates?.ApprovedOfferRate ?? 0) >= 70) ?
                                                              <HappyFaceIcon className="w-16 h-16 text-green-400" />
                                                              :
                                                              <></>
                                                    }
                                                    <div className="flex-columns ml-3 my-auto">
                                                      <div className="text-tiny text-gray-900">{(storeRates?.ApprovedOfferRate ?? 0) > 0 ? <>%{(storeRates?.ApprovedOfferRate ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                  </div>
                                                  <div className="w-1/2 ml-5 my-auto">
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Toplam Teklif Sayısı </div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.TotalOfferCount ?? 0) > 0 ? <>{(storeRates?.TotalOfferCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Kabul Edilen Teklif Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.ApprovedOfferCount ?? 0) > 0 ? <>{(storeRates?.ApprovedOfferCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Reddedilen Teklif Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.RejectedOfferCount ?? 0) > 0 ? <>{(storeRates?.RejectedOfferCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                  </div>
                                                </div>
                                            }
                                          </div>
                                        </div>
                                        <div className="flex gap-4 py-5 border-b border-gray-200">
                                          <div className="w-1/2">
                                            <h4 className="mb-4">İş Teslim Gecikme Oranı</h4>
                                            {
                                              storeRatesLoading ?
                                                <Loading width="w-full" height="h-28" />
                                                :
                                                <div className="flex">
                                                  <div className="w-1/2 p-5 flex shadow-md">
                                                    {
                                                      ((storeRates?.WorkDelayRate ?? 0) === 0) ?
                                                        <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                        :
                                                        ((storeRates?.WorkDelayRate ?? 0) > 0 && (storeRates?.WorkDelayRate ?? 0) < 40) ?
                                                          <HappyFaceIcon className="w-16 h-16 text-green-400" />
                                                          :
                                                          ((storeRates?.WorkDelayRate ?? 0) >= 40 && (storeRates?.WorkDelayRate ?? 0) < 70) ?
                                                            <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                            :
                                                            ((storeRates?.WorkDelayRate ?? 0) >= 70) ?
                                                              <SadFaceIcon className="w-16 h-16 text-red-400" />
                                                              :
                                                              <></>
                                                    }
                                                    <div className="flex-columns ml-3 my-auto">
                                                      <div className="text-tiny text-gray-900">{(storeRates?.WorkDelayRate ?? 0) > 0 ? <>%{storeRates?.WorkDelayRate}</> : <>-</>} </div>
                                                    </div>
                                                  </div>
                                                  <div className="w-1/2 ml-5 my-auto">
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Toplam Tamamlanan İş Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.CompletedWorkCount ?? 0) > 0 ? <>{(storeRates?.CompletedWorkCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Zamanında Tamamlanmış İş</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.CompletedInTimeWorkCount ?? 0) > 0 ? <>{(storeRates?.CompletedInTimeWorkCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Gecikmiş İş</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.DelayedWorkCount ?? 0) > 0 ? <>{(storeRates?.DelayedWorkCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                  </div>
                                                </div>
                                            }
                                          </div>
                                          <div className="w-1/2">
                                            <h4 className="mb-4">Hizmet İptal Oranı</h4>
                                            {
                                              storeRatesLoading ?
                                                <Loading width="w-full" height="h-28" />
                                                :
                                                <div className="flex">
                                                  <div className="w-1/2 p-5 flex shadow-md">
                                                    {
                                                      ((storeRates?.CanceledWorkRate ?? 0) === 0) ?
                                                        <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                        :
                                                        ((storeRates?.CanceledWorkRate ?? 0) > 0 && (storeRates?.CanceledWorkRate ?? 0) < 40) ?
                                                          <HappyFaceIcon className="w-16 h-16 text-green-400" />
                                                          :
                                                          ((storeRates?.CanceledWorkRate ?? 0) >= 40 && (storeRates?.CanceledWorkRate ?? 0) < 70) ?
                                                            <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                            :
                                                            ((storeRates?.CanceledWorkRate ?? 0) >= 70) ?
                                                              <SadFaceIcon className="w-16 h-16 text-red-400" />
                                                              :
                                                              <></>
                                                    }
                                                    <div className="flex-columns ml-3 my-auto">
                                                      <div className="text-tiny text-gray-900">{(storeRates?.CanceledWorkRate ?? 0) > 0 ? <>%{storeRates?.CanceledWorkRate}</> : <>-</>} </div>
                                                    </div>
                                                  </div>
                                                  <div className="w-1/2 ml-5 my-auto">
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Toplam Hizmet İptal Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(((storeRates?.CanceledByUserWorkCount ?? 0) + (storeRates?.CanceledByProWorkCount ?? 0)) ?? 0) > 0 ? <>{(((storeRates?.CanceledByUserWorkCount ?? 0) + (storeRates?.CanceledByProWorkCount ?? 0)) ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Kullanıcı İptal Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.CanceledByUserWorkCount ?? 0) > 0 ? <>{(storeRates?.CanceledByUserWorkCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Profesyonel İptal Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.CanceledByProWorkCount ?? 0) > 0 ? <>{(storeRates?.CanceledByProWorkCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                  </div>
                                                </div>
                                            }
                                          </div>
                                        </div>
                                        <div className="flex py-5 gap-4">
                                          <div className="w-1/2">
                                            <h4 className="mb-4">Ortalama Mesaj Yanıtlama Süresi</h4>
                                            {
                                              storeRatesLoading ?
                                                <Loading width="w-full" height="h-28" />
                                                :
                                                <div className="flex">
                                                  <div className="w-1/2 p-5 flex shadow-md">
                                                    {
                                                      ((storeRates?.AverageMessageTime ?? 0) === 0) ?
                                                        <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                        :
                                                        ((storeRates?.AverageMessageTime ?? 0) > 0 && (storeRates?.AverageMessageTime ?? 0) < 6) ?
                                                          <HappyFaceIcon className="w-16 h-16 text-green-400" />
                                                          :
                                                          ((storeRates?.AverageMessageTime ?? 0) >= 6 && (storeRates?.AverageMessageTime ?? 0) < 12) ?
                                                            <NormalFaceIcon className="w-16 h-16 text-yellow-400" />
                                                            :
                                                            ((storeRates?.AverageMessageTime ?? 0) >= 12) ?
                                                              <SadFaceIcon className="w-16 h-16 text-red-400" />
                                                              :
                                                              <></>
                                                    }
                                                    <div className="flex-columns ml-3 my-auto">
                                                      <div className="text-tiny text-gray-900">{(storeRates?.AverageMessageTime ?? 0) > 0 ? <>{(storeRates?.AverageMessageTime ?? 0)} saat</> : <>-</>}</div>
                                                    </div>
                                                  </div>
                                                  <div className="w-1/2 ml-5 my-auto">
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">Toplam Mesaj Sayısı</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.TotalMessageCount ?? 0) > 0 ? <>{(storeRates?.TotalMessageCount ?? 0)}</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">En kısa yanıt süresi</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.ShortestMessageTime ?? 0) > 0 ? <>{(storeRates?.ShortestMessageTime ?? 0)} saat</> : <>-</>}</div>
                                                    </div>
                                                    <div className="flex my-2 items-center">
                                                      <div className="w-2/3 text-sm text-gray-700">En uzun yanıt süresi</div>
                                                      <div className="text-sm text-gray-700">: {(storeRates?.LongestMessageTime ?? 0) > 0 ? <>{(storeRates?.LongestMessageTime ?? 0)} saat</> : <>-</>}</div>
                                                    </div>
                                                  </div>
                                                </div>
                                            }
                                          </div>
                                        </div>
                                      </>
                                      :
                                      <></>
        }
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showRejectProModal}
        onClose={() => { setShowRejectProModal(false); }}
        title="Başvuru Reddet"
        body={
          <div>
            <Label isRequired withoutDots title="Red Nedeni" className="mt-4" />
            <input className="form-input" type="text" value={rejectType} onChange={(e) => { setRejectType(e.target.value); }} />
            <Label isRequired withoutDots title="Red Açıklaması" className="mt-4" />
            <TextArea
              setText={setRejectReason}
              text={rejectReason}
              maxCount={2000}
            />
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { handleRejectPro(); }}></Button>
        }
      />
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
              <Label isRequired withoutDots title="Açıklama" className="mt-4" />
              <input className="form-input" type="text" value={contactDescription} onChange={(e) => { setContactDescription(e.target.value); }} />
            </div>
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { setShowUpdateContactModal(false); updateProContact(); }}></Button>
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showRejectDocumentModal}
        onClose={() => { setShowRejectDocumentModal(false); }}
        title="Belge Reddet"
        body={
          <div>
            <Label isRequired withoutDots title="Red Açıklaması" className="mt-4" />
            <TextArea
              setText={setRejectDocumentModalReason}
              text={rejectDocumentModalReason}
              maxCount={2000}
            />
            {/* <textarea className="form-input" rows={3} value={rejectDocumentModalReason} onChange={(e) => { setRejectDocumentModalReason(e.target.value) }} ></textarea> */}
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { setShowRejectDocumentModal(false); handleCloseRejectDocumentModal(); }}></Button>
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showEvaluationModal}
        onClose={() => { setShowEvaluationModal(false); }}
        title="Hizmet Değerlendirmesi"
        body={<>
          <div className="flex-col gap-4">
            <div className="border border-gray-100 rounded-md p-3">
              <div className="flex align-items-center">
                <img className="h-8 w-8 rounded-full" src={modalEvaluationData?.UserPhoto} alt="" />
                <span className="ml-2 my-auto text-tiny">{modalEvaluationData?.UserName}</span>
              </div>
              <div className="text-sm">
                <div className="mt-2">İş Tanımı: <span className="font-medium">{modalEvaluationData?.WorkName}</span></div>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="w-1/2 border border-gray-100 rounded-md p-3 flex flex-col justify-center items-center">
                <div className="text-tiny flex justify-center items-center"><span>Zamanlama:</span> <ErrorIcon className="ml-2 text-blue-400 w-4 h-4" /></div>
                <div className="mt-4">
                  <RateStars className="h-6 text-yellow-600" rateValue={modalEvaluationData?.TimingRate ?? 0} onProfessional={true} />
                </div>
              </div>
              <div className="w-1/2 border border-gray-100 rounded-md p-3 flex flex-col justify-center items-center">
                <div className="text-tiny flex justify-center items-center"><span>Titiz Çalışma:</span> <ErrorIcon className="ml-2 text-blue-400 w-4 h-4" /></div>
                <div className="mt-4">
                  <RateStars className="h-6 text-yellow-600" rateValue={modalEvaluationData?.PerfectionRate ?? 0} onProfessional={true} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="w-1/2 border border-gray-100 rounded-md p-3 flex flex-col justify-center items-center">
                <div className="text-tiny flex justify-center items-center"><span>Yetenek:</span> <ErrorIcon className="ml-2 text-blue-400 w-4 h-4" /></div>
                <div className="mt-4">
                  <RateStars className="h-6 text-yellow-600" rateValue={modalEvaluationData?.SkillRate ?? 0} onProfessional={true} />
                </div>
              </div>
              <div className="w-1/2 border border-gray-100 rounded-md p-3 flex flex-col justify-center items-center">
                <div className="text-tiny flex justify-center items-center"><span>Davranış:</span> <ErrorIcon className="ml-2 text-blue-400 w-4 h-4" /></div>
                <div className="mt-4">
                  <RateStars className="h-6 text-yellow-600" rateValue={modalEvaluationData?.BehaviorRate ?? 0} onProfessional={true} />
                </div>
              </div>
            </div>
            <div className="mt-4 border border-gray-100 rounded-md p-3 bg-gray-100">
              <div className="flex">
                <span className="text-sm font-medium">{modalEvaluationData?.UserName} :</span>
                <span className="ml-auto text-sm">{handleJsTime(modalEvaluationData?.CreatedDateJSTime ?? 0)}</span>
              </div>
              <div className="text-tiny mt-2 text-gray-700">
                {modalEvaluationData?.UserComment}
              </div>
            </div>
          </div>
        </>} />

      <Modal
        modalType="fixedSm"
        showModal={showSeoModal}
        onClose={() => { setShowSeoModal(false); }}
        title="SEO Bilgileri"
        body={
          <div>
            <Label withoutDots title="Profesyonel Adı" className="mt-4" />
            <div className="text-sm text-gray-900">{proDetail?.StoreName}</div>
            <Label isRequired withoutDots title="Title" className="mt-4" />
            <input className="form-input" type="text" value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); }} />
            <Label isRequired withoutDots title="Description" className="mt-4" />
            <input className="form-input" type="text" value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); }} />
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { updateSingleProSeo(); }}></Button>
        }
      />
    </div>
  )
}
