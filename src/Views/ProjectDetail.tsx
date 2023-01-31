import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { AlertIcon, AnswerArrow, CheckIcon, ChevronRightIcon, ClockIcon, CoverPhotoIcon, EditIcon, EyeOffIcon, PlusIcon, SeoIcon, TrashIcon } from "../Components/Icons";
import { TabsTitle } from "../Components/TabsTitle";
import { ProjectModel, ProjectVariationModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { Table } from "../Components/Table";
import Slider from "react-slick";
import { Loading } from "../Components/Loading";
import { Modal } from "../Components/Modal";
import { useStateEffect } from "../Components/UseStateEffect";
import { formatter, fraction } from "../Services/Functions";
import { DateView } from "../Components/DateView";
import { Label } from "../Components/Label";

interface RouteParams {
  id: string
}

interface LocationModel {
  prevTitle: string,
  prevPath: string,
  tabId: number,
  IsIdeaApproved?: boolean,
  queryPage: number
}

export const ProjectDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const location = useLocation<LocationModel>();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [tabsLink, setTabLinks] = useState([
    { id: 1, name: "Proje Detayı", disabled: false },
    { id: 2, name: "Kullanılan Ürünler", disabled: false },
    { id: 3, name: "Soru & Cevaplar", disabled: true },
  ]);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(location.state?.tabId ?? 1);

  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const [rejectTitle, setRejectTitle] = useState<string>("");

  const [rejectReason, setRejectReason] = useState<string>("");

  const [projectDetail, setProjectDetail] = useState<ProjectModel>();

  const [productCount, setProductCount] = useState<number>(0);

  const [variationList, setVariationList] = useState<ProjectVariationModel[]>([]);

  const [provinceName, setProvinceName] = useState<string>("");

  const [IsIdeaApproved, setIsIdeaApproved] = useState<boolean>(location.state?.IsIdeaApproved ?? false);

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
    getProjectDetail();
  }, []);

  useStateEffect(() => {
    getIdeaCategoryElementForProject();
  }, [projectDetail]);

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
      setProductCount(_result.data.ProductCount);
      setIsEnabled(_result.data.IsEnabled);
      setRejectTitle(_result.data.RejectTitle);
      setRejectReason(_result.data.RejectReason);
      setIsIdeaApproved(_result.data.IsIdeaApproved);
      const _provinceId = Number(_result.data.CategoryElementObj.find(i => i.DataType === 9)?.Value ?? 0);
      if (_provinceId !== 0) {
        const response = await fetch(`https://raw.githubusercontent.com/pryazilim/lib/master/data/location/cities.json`, { method: "GET" });
        const json = await response.json();
        let rawData = json.sort((a, b) => { return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' }) });
        const _provinceName = rawData.find(i => i.id === _provinceId)?.name ?? "";
        setProvinceName(_provinceName);
      }

      if (_result.data.Statue === 2) {
        let _tempTabsLink = tabsLink;
        _tempTabsLink.forEach((item) => {
          item.disabled = false;
        })
        setTabLinks(JSON.parse(JSON.stringify(_tempTabsLink)));
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
        onClose: () => {
          context.hideModal();
          if (location.state?.prevPath === "/fikir-listesi") {
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

    const _result = await ApiService.getIdeaCategoryElementForProject(projectDetail?.CategoryId ?? 0);

    if (_result.succeeded === true) {
      setVariationList(_result.data);
    }
    else {
      setVariationList([]);
    }
  }

  const approveProject = async () => {
    setProcessLoading(true);

    const _result = await ApiService.approveProject(Number(params.id ?? "0"));

    setProcessLoading(false);


    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Başvuru onaylandı.",
        onClose: () => { context.hideModal(); history.push("/onaylanan-projeler"); }
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

  const rejectProject = async () => {
    setProcessLoading(true);

    const _result = await ApiService.rejectProject(Number(params.id ?? "0"), rejectTitle, rejectReason);

    setProcessLoading(false);
    setShowRejectModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Başvuru reddedildi.",
        onClose: () => { context.hideModal(); history.push("/reddedilen-projeler"); }
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

  const deleteProject = () => {
    context.showModal({
      type: "Question",
      title: `${IsIdeaApproved === true ? "Fikir Sil" : "Proje Sil"}`,
      message: `${IsIdeaApproved === true ? "Fikir silinecek. Emin misiniz?" : "Proje silinecek. Emin misiniz?"}`,
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);
        if (IsIdeaApproved === true) {
          var _result = await ApiService.deleteIdea(Number(params.id ?? "0"));
        }
        else {
          var _result = await ApiService.deleteProject(Number(params.id ?? "0"));
        }
        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: `${IsIdeaApproved === true ? "Fikir" : "Proje"} silindi.`,
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

  const changeProjectStatus = () => {
    context.showModal({
      type: "Question",
      title: "DİKKAT",
      message: isEnabled ? `${IsIdeaApproved ? "Fikir" : "Proje"} pasif duruma getirilecek. Emin misiniz?` : `${IsIdeaApproved ? "Fikir" : "Proje"} aktif duruma getirilecek. Emin misiniz?`,
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);
        if (IsIdeaApproved === true) {
          var _result = await ApiService.changeIdeaStatus(Number(params.id ?? "0"), !isEnabled);
        }
        else {
          var _result = await ApiService.changeProjectStatus(Number(params.id ?? "0"), !isEnabled);
        }
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

  const handleOpenRejectModal = () => {
    if (projectDetail?.Statue === 3) {
      setRejectTitle(projectDetail?.RejectTitle ?? "");
      setRejectReason(projectDetail?.RejectReason ?? "");
    }
    else {
      setRejectTitle("");
      setRejectReason("");
    }
    setShowRejectModal(true);
  }

  //#region TAB-2 PROJECT PRODUCT LİST
  const tableProjectProject = useRef<any>();

  const getProjectProductList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProjectProductList(Number(params.id), page, take, order, searchText);

    if (_result.succeeded === true) {
      setProductCount(_result.data.TotalCount);
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

  const deleteProductFromProject = (ProjectProductId) => {
    context.showModal({
      type: "Question",
      title: "Ürün Kaldır",
      message: "Ürün bu projeden silinecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.deleteProductFromProject(ProjectProductId);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Ürün silindi.",
            onClose: () => {
              context.hideModal();
              if (tableProjectProject.current) {
                tableProjectProject.current?.reload();
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

  //#region TABS-3 QUESTION
  const questionTableEl = useRef<any>();

  const getProjectDetailQuestionList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getProjectDetailQuestionList(Number(params.id), page, take, order, searchText);

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
  const [showAnsweredQuestionModal, setShowAnsweredQuestionModal] = useState<boolean>(false);

  const [showQuestionDescriptionModal, setShowQuestionDescriptionModal] = useState<boolean>(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);

  const [selectedUserPhoto, setSelectedUserPhoto] = useState<string>("");

  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const [selectedQuestionDate, setSelectedQuestionDate] = useState<number>(0);

  const [selectedQuestion, setSelectedQuestion] = useState<string>("");

  const [selectedAnswerDate, setSelectedAnswerDate] = useState<number>(0);

  const [isApprovedFromAdmin, setIsApprovedFromAdmin] = useState<boolean>(false);

  const [isRejectedFromAdmin, setIsRejectedFromAdmin] = useState<boolean>(false);

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const showAnswerModal = (item) => {
    setSelectedQuestionId(item.ProjectQuestionId);
    setSelectedUserPhoto(item.UserPhotoPath);
    setSelectedUserName(item.UserNameSurname);
    setSelectedQuestionDate(item.QuestionCreatedDateJSTime);
    setSelectedQuestion(item.QuestionDescription);
    setSelectedAnswerDate(item.AnswerDateJSTime);
    setIsApprovedFromAdmin(item.IsApprovedFromAdmin);
    setIsRejectedFromAdmin(item.IsRejectedFromAdmin);
    setSelectedAnswer(item.Answer)
    setShowAnsweredQuestionModal(true);
  }

  const clearSelectedItems = () => {
    setSelectedUserPhoto("");
    setSelectedUserName("");
    setSelectedQuestionDate(0);
    setSelectedQuestion("");
    setSelectedAnswerDate(0);
    setIsApprovedFromAdmin(false);
    setIsRejectedFromAdmin(false);
    setSelectedAnswer("")
    setShowAnsweredQuestionModal(false);
  }

  const showRejectAnswerModal = (questionId) => {
    setShowAnsweredQuestionModal(false);

    context.showModal({
      type: "Question",
      title: "Yanıtı Reddet",
      message: "Yanıt reddedilecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.rejectProjectQuestion(questionId);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Yanıt reddedildi.",
            onClose: () => {
              context.hideModal();
              if (questionTableEl.current) {
                questionTableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => {
              context.hideModal();
            }
          });
        }

        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const showApproveAnswerModal = (questionId) => {
    setShowAnsweredQuestionModal(false);

    context.showModal({
      type: "Question",
      title: "Yanıtı Onayla",
      message: "Yanıt Onaylanacak. Emin misiniz?",
      onClick: async () => {
        context.hideModal();
        setProcessLoading(true);

        const _result = await ApiService.approveProjectQuestion(questionId);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Yanıt onaylandı.",
            onClose: () => {
              context.hideModal();
              if (questionTableEl.current) {
                questionTableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => {
              context.hideModal();
            }
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
    setSeoTitle(projectDetail?.SeoTitle ?? "");
    setSeoDescription(projectDetail?.SeoDescription ?? "");
    setShowSeoModal(true);
  }

  const updateSingleIdeaSeo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSingleIdeaSeo(Number(params.id ?? "0"), seoTitle, seoDescription);

    setProcessLoading(false);
    setShowSeoModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seo bilgileri güncellenmiştir",
        onClose: () => { context.hideModal(); getProjectDetail(); }
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


  return (

    <div className="content-wrapper">
      <div className="portlet-wrapper">
        {IsIdeaApproved === true ?
          <Link to={`${location.state?.queryPage !== 1 ? `/fikir-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/fikir-listesi"}`} className="inline-block mb-5">
            <div className="flex items-center text-sm text-gray-400 ">
              <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
              Fikir Listesi
            </div>
          </Link>
          :
          <Link to={location.state?.prevPath !== undefined ? (location.state?.queryPage !== 1 ? (location.state?.prevPath + "?sayfa=" + location.state?.queryPage) : location.state?.prevPath) : ("/onay-bekleyen-projeler")} className="inline-block mb-5">
            <div className="flex items-center text-sm text-gray-400 ">
              <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
              {location.state?.prevTitle ?? "Onay Bekleyen Proje Listesi"}
            </div>
          </Link>
        }
        {
          projectDetail?.Statue === 1 ?
            <>
              <h2>{IsIdeaApproved === true ? "Fikir Detayı" : "Proje Detayı"} </h2>
              {IsIdeaApproved !== true &&
                <div className="w-full my-4 bg-gray-100 p-5 flex">
                  <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Bu proje onayınızı bekliyor.</span></div>
                  <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                    <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-blue-400" text="Onayla" onClick={() => { approveProject(); }} />
                    <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-gray-100" text="Reddet" onClick={() => { handleOpenRejectModal(); }} />
                  </div>
                </div>
              }
            </>
            :
            projectDetail?.Statue === 2 ?
              <>
                <div className="w-full my-4  flex">
                  <h2>{IsIdeaApproved === true ? "Fikir Detayı" : "Proje Detayı"} </h2>
                  <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                    <Link className={`${processLoading ? "pointer-events-none" : ""} ml-2  hover:text-blue-400 cursor-pointer transition-all`} to={{ pathname: `${"/proje-duzenle/" + (params.id ?? "0")}`, state: { IsIdeaApproved: IsIdeaApproved } }} >
                      <Button isLoading={processLoading} textTiny className="w-48" buttonSm design="button-blue-400" text="Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} />
                    </Link>
                    {
                      IsIdeaApproved &&
                      <Button isLoading={processLoading} textTiny className="w-36" buttonSm design="button-gray-100" text={"SEO"} hasIcon icon={<SeoIcon className="icon-sm mr-2" />} onClick={() => { handleOpenSeoModal(); }} />
                    }
                    <Button isLoading={processLoading} textTiny className="w-48" buttonSm design="button-gray-100" text={isEnabled ? "Pasife Al" : "Aktifleştir"} hasIcon icon={<EyeOffIcon className="icon-sm mr-2" />}
                      onClick={() => {
                        changeProjectStatus();
                      }}
                    />
                    <Button isLoading={processLoading} textTiny className="w-24" buttonSm design="button-gray-100" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => {
                      deleteProject();
                    }} />
                  </div>
                </div>
              </>
              :
              projectDetail?.Statue === 3 ?
                <>
                  <h2>{IsIdeaApproved === true ? "Fikir Detayı" : "Proje Detayı"} </h2>
                  {IsIdeaApproved !== true &&
                    <div className="w-full my-4 bg-gray-100 p-5 flex">
                      <div className="text-sm my-auto flex"><AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2">Bu proje reddedildi.</span></div>
                      <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
                        <Button isLoading={processLoading} buttonSm textTiny className="w-48" design="button-gray-100" text="Red Detayını Gör" onClick={() => { handleOpenRejectModal(); }} />
                      </div>
                    </div>
                  }
                </>
                :
                <></>
        }
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
        {
          selectedTabsId === 1 ?
            <>
              <div className="py-2 w-full mt-4">
                <h4>{IsIdeaApproved === true ? "Fikir Galerisi" : "Proje Galerisi"} </h4>
                {loading ?
                  <div className="grid lg:grid-cols-5 gap-4 mt-2">
                    <Loading width="w-full" height="h-40" />
                    <Loading width="w-full" height="h-40" />
                    <Loading width="w-full" height="h-40" />
                    <Loading width="w-full" height="h-40" />
                    <Loading width="w-full" height="h-40" />
                  </div>
                  :
                  projectDetail?.MediaList.length && projectDetail?.MediaList.length <= 4 ?
                    <div className="grid lg:grid-cols-5 mt-2">
                      {projectDetail?.MediaList.map((item, j) => (
                        <div className="col-span-1 relative">
                          <img src={item.FileUrl} className="w-full pr-3 object-cover h-48" alt="Slider" />
                          {item.IsMainPhoto ?
                            <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                          }
                        </div>
                      ))}
                    </div>
                    :
                    <Slider {...multipleItems6Half}>
                      {projectDetail?.MediaList.map((item, j) => (
                        <div className="relative">
                          <img src={item.FileUrl} className="w-full pr-3 object-cover h-48" alt="Slider" />
                          {item.IsMainPhoto ?
                            <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1" /> : <></>
                          }
                        </div>
                      ))}
                    </Slider>
                }
              </div>
              <div className="py-2 w-full border-t border-gray-300">
                {
                  loading ?
                    <Loading width="w-full" height="h-72" />
                    :
                    <>
                      <h4 className="mb-4">{IsIdeaApproved === true ? "Fikir Bilgileri" : "Proje Bilgileri"} </h4>
                      <div className="w-full flex gap-8">
                        <div className="lg:w-1/2">
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>
                              {IsIdeaApproved === true ? "Fikir Adı" : "Proje Adı"}
                            </span><span className="ml-auto">:</span></div>
                            <div className="p-sm-gray-700 ml-2">{projectDetail?.Name}</div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>
                              {IsIdeaApproved === true ? "Fikir Kategorisi" : " Proje Kategorisi"}
                            </span><span className="ml-auto">:</span></div>
                            <div className="p-sm-gray-700 ml-2">{projectDetail?.CategoryName}</div>
                          </div>
                          {
                            projectDetail?.CategoryElementObj.map((item, index) => (
                              <>
                                {(variationList.find(x => x.Id === item.ElementId)?.Name !== undefined && variationList.find(x => x.Id === item.ElementId)?.Name !== "") &&
                                  <div className="flex mb-2" key={"variation_" + index}>
                                    <div className="w-1/3 flex p-sm-gray-700"><span>{variationList.find(x => x.Id === item.ElementId)?.Name}</span><span className="ml-auto">:</span></div>
                                    {
                                      item.DataType === 1 ? //Date range
                                        <>
                                          <DateView className="p-sm-gray-700 ml-2" dateNumber={Number(JSON.parse(item.Value).StartDate)} pattern="dd.MM.yyyy" />
                                          <span className="p-sm-gray-700 ml-2">-</span>
                                          <DateView className="p-sm-gray-700 ml-2" dateNumber={Number(JSON.parse(item.Value).EndDate)} pattern="dd.MM.yyyy" />
                                        </>
                                        :
                                        item.DataType === 2 ? //Date
                                          <DateView className="p-sm-gray-700 ml-2" dateNumber={Number(item.Value)} pattern="dd.MM.yyyy" />
                                          :
                                          item.DataType === 3 ? //Multi select option
                                            <div className="p-sm-gray-700 ml-2">{variationList.find(x => x.Id === item.ElementId)?.Options.find(y => y.Id == Number(item.Value))?.Name}</div>
                                            :
                                            item.DataType === 4 ? //Number
                                              <div className="p-sm-gray-700 ml-2">{item.Value}</div>
                                              :
                                              item.DataType === 5 ? //Text
                                                <div className="p-sm-gray-700 ml-2">{item.Value}</div>
                                                :
                                                item.DataType === 6 ? //Image
                                                  <Image src={item.Value} alt={"image"} className="ml-2 w-20 h-20 rounded-lg object-contain" />
                                                  :
                                                  item.DataType === 7 ? //Multiple-Choice
                                                    <div className="p-sm-gray-700 ml-2">{item.Value}</div>
                                                    :
                                                    item.DataType === 8 ? //Price
                                                      <div className="p-sm-gray-700 ml-2">{fraction.format(Number(item.Value ?? 0))} ₺</div>
                                                      :
                                                      item.DataType === 9 ? //City
                                                        <div className="p-sm-gray-700 ml-2">{provinceName !== "" && ` ${provinceName}`}</div>
                                                        :
                                                        <></>
                                    }
                                  </div>
                                }

                              </>
                            ))
                          }
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>
                              {IsIdeaApproved === true ? "Fikir Açıklaması" : "Proje Açıklaması"}
                            </span><span className="ml-auto">:</span></div>
                            <div className="w-2/3 p-sm-gray-700 ml-2">{projectDetail?.Description}</div>
                          </div>
                        </div>
                        <div className="lg:w-1/2">
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>Kullanılan ürün sayısı</span><span className="ml-auto">:</span></div>
                            <div className=" p-sm-gray-700 ml-2">{productCount}</div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>Gelen Soru Sayısı</span><span className="ml-auto">:</span></div>
                            <div className="p-sm-gray-700 ml-2">{projectDetail?.QuestionCount}</div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>Görüntülenme Sayısı</span><span className="ml-auto">:</span></div>
                            <div className="p-sm-gray-700 ml-2">{"0"}</div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>Favoriye Eklenme Sayısı</span><span className="ml-auto">:</span></div>
                            <div className="p-sm-gray-700 ml-2">{projectDetail?.FavoriteCount ?? 0}</div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>Etiketler</span><span className="ml-auto">:</span></div>
                            <div className="block w-2/3">
                              {
                                projectDetail?.KeywordList.map((item, index) => (
                                  <div key={"keyWord_" + index} className="inline-block ml-2 bg-gray-100 text-sm text-gray-900 p-2 rounded-full mb-1">{item}</div>
                                ))
                              }
                            </div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>
                              {IsIdeaApproved === true ? "Fikir Durumu" : "Proje Durumu"}
                            </span><span className="ml-auto">:</span></div>
                            <div className={`${isEnabled ? "text-green-400" : "text-red-400"} font-medium text-sm ml-2`}>{isEnabled ? "Aktif" : "Pasif"}</div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>Fikir ID</span><span className="ml-auto">:</span></div>
                            <div className="p-sm-gray-700 ml-2">{projectDetail?.Id}</div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-1/3 flex p-sm-gray-700"><span>Eklenme Tarihi</span><span className="ml-auto">:</span></div>
                            <div className="p-sm-gray-700 ml-2">{projectDetail?.CreatedDate}</div>
                          </div>
                        </div>
                      </div>
                    </>
                }
              </div>
            </>
            :
            selectedTabsId === 2 ?
              <>
                <Table
                  ref={tableProjectProject}
                  key={"tableProjectProject"}
                  emptyListText={"Ürün Bulunamadı"}
                  getDataFunction={getProjectProductList}
                  addNewButton={
                    <Link to={{ pathname: `${"/proje-urun-ekle/" + (params.id ?? "0")}`, state: { IsIdeaApproved: IsIdeaApproved } }} >
                      <Button buttonMd textTiny color="text-blue-400" className="w-48" design="button-blue-100" text="Ürün Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} />
                    </Link>
                  }
                  header={<div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-3 flex items-center">
                      <span className="text-type-12-medium text-gray-700">
                        Ürün Adı
                      </span>
                    </div>
                    <div className="lg:col-span-1 flex items-center">
                      <span className="text-type-12-medium text-gray-700">
                        BUYBOX Fiyatı
                      </span>
                    </div>
                    <div className="lg:col-span-1 flex items-center">
                      <span className="text-type-12-medium text-gray-700">
                        Ürünü Satan Satıcı Sayısı
                      </span>
                    </div>
                    <div className="lg:col-span-1 flex items-center">
                      <span className="text-type-12-medium text-gray-700">
                        Durum
                      </span>
                    </div>
                  </div>}
                  renderItem={(e, i) => {
                    return <div key={"list" + i} className="lg:grid-cols-6 px-2 border-b py-4  border-gray-200 hidden lg:grid flex gap-4 items-center">
                      <div className="lg:col-span-3 flex gap-4 items-center">
                        <Image src={e.ProductMainPhoto} alt={e.ProductName} className="w-14 h-14 object-contain" />
                        <div>
                          <div className="text-sm text-gray-900 font-medium">{e.ProductName}</div>
                          <div className="text-sm text-gray-900 font-medium mt-1">{"Barkod No: " + e.BarcodeNo}</div>
                          <div className="text-sm text-gray-900 font-medium mt-1">{"Kategori: " + (e.Category ? e.Category : "-")}</div>
                        </div>
                      </div>
                      <div className="lg:col-span-1">
                        <p className="p-sm">
                          {(e.BuyboxPrice ?? 0) % 1 === 0 ?
                            <>{fraction.format((e.BuyboxPrice ?? 0))} TL </>
                            :
                            <>{formatter.format((e.BuyboxPrice ?? 0))} TL</>
                          }
                        </p>
                      </div>
                      <div className="lg:col-span-1">
                        <p className="p-sm">
                          {e.SellerCount}
                        </p>
                      </div>
                      <div className="lg:col-span-1 flex justify-between">
                        <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                          {e.IsEnabled === true ? "Aktif" : "Pasif"}
                        </p>
                        <div className="text-gray-700 flex gap-2 items-center">
                          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { deleteProductFromProject(e.ProjectProductId); }} />
                        </div>
                      </div>
                    </div>
                  }}
                />
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <Table
                    ref={questionTableEl}
                    emptyListText={"Soru Bulunamadı"}
                    getDataFunction={getProjectDetailQuestionList}
                    header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                      <div className="lg:col-span-1 flex items-center">
                        <span className="text-type-12-medium text-gray-700">
                          Tarih
                        </span>
                      </div>
                      <div className="lg:col-span-3">
                        <span className="text-type-12-medium text-gray-700">
                          Müşteri Adı
                        </span>
                      </div>

                      <div className="lg:col-span-4">
                        <span className="text-type-12-medium text-gray-700">
                          Soru Detayı
                        </span>
                      </div>
                      <div className="lg:col-span-2">
                        <span className="text-type-12-medium text-gray-700">
                          Yanıt Durumu
                        </span>
                      </div>
                      <div className="lg:col-span-2">
                        <span className="text-type-12-medium text-gray-700">
                          Yayınlanma Durumu
                        </span>
                      </div>
                    </div>}
                    renderItem={(e, i) => {
                      return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                        <div className="lg:col-span-1 flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Tarih:</span>
                          <DateView className="text-sm ml-2 font-medium" dateNumber={e.QuestionCreatedDateJSTime} pattern="dd.MM.yyyy" />
                        </div>
                        <div className="lg:col-span-3 flex lg:block items-center flex items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Müşteri Adı:</span>
                          <div className="flex items-center gap-2">
                            <Image src={e.UserPhotoPath} alt={e.UserNameSurname} className="w-10 h-10 rounded-full object-contain" />
                            <p className="p-sm">
                              {e.UserNameSurname}
                            </p>
                          </div>
                        </div>
                        <div className="lg:col-span-4 flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Soru Detayı:</span>
                          <p className="p-sm line-clamp-2">
                            {e.QuestionDescription}
                          </p>
                          {e.QuestionDescription && e.QuestionDescription.length > 100 && <span className="font-medium text-xs cursor-pointer" onClick={() => { setSelectedQuestion(e.QuestionDescription); setShowQuestionDescriptionModal(true) }}>Daha Fazla Göster</span>}

                        </div>
                        <div className="lg:col-span-2 flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Yanıt Durumu:</span>
                          {e.IsAnswered === true ?
                            <div className="flex items-center text-gray-700 font-medium text-sm">
                              <CheckIcon className="icon-sm mr-2" />
                              <span>Yanıtlandı</span>
                            </div>
                            :
                            <div className="flex items-center text-yellow-600 font-medium text-sm">
                              <ClockIcon className="icon-sm mr-2" />
                              <span>Yanıt Bekliyor</span>
                            </div>
                          }
                        </div>
                        <div className="lg:col-span-2 flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Yayınlanma Durumu
                          </span>
                          <div className="flex items-center justify-between">
                            <div>
                              {e.IsApprovedFromAdmin === true ?
                                <div className="bg-green-100 text-green-400 text-sm font-medium w-32 py-2 rounded-full text-center">
                                  Onaylandı
                                </div>
                                : e.IsRejectedFromAdmin === true ?
                                  <div className="bg-gray-100 text-gray-900 text-sm font-medium w-32 py-2 rounded-full text-center">
                                    Reddedildi
                                  </div>
                                  : (e.IsAnswered === true && e.IsApprovedFromAdmin === false && e.IsRejectedFromAdmin === false) &&
                                  <div className="bg-yellow-100 text-yellow-600 text-sm font-medium w-32 py-2 rounded-full text-center">
                                    Onay Bekliyor
                                  </div>
                              }
                            </div>
                            {e.IsAnswered === true &&
                              <ChevronRightIcon className="icon-md text-gray-900 cursor-pointer" onClick={() => { showAnswerModal(e) }} />
                            }
                          </div>

                        </div>
                      </div>
                    }}
                  />
                  {/* show question description modal */}
                  <Modal
                    modalType="fixedSm"
                    showModal={showQuestionDescriptionModal}
                    onClose={() => { setShowQuestionDescriptionModal(false); setSelectedQuestion("") }}
                    title="Soru Detayı"
                    body={
                      <div className="border p-3 max-h-88 overflow-auto custom-scrollbar text-sm ">
                        {selectedQuestion}
                      </div>
                    }
                    footer={
                      <>
                        <Button text="Kapat" design="button-blue-400 w-full" onClick={() => { setShowQuestionDescriptionModal(false); setSelectedQuestion("") }} />
                      </>
                    }
                  />
                  {/* Show Answered Question Detail */}
                  <Modal
                    modalType="fixedSm"
                    showModal={showAnsweredQuestionModal}
                    onClose={() => { setShowAnsweredQuestionModal(false); clearSelectedItems() }}
                    title="Soru Detayı"
                    body={
                      <div>
                        <div className="flex items-center gap-2">
                          <Image src={selectedUserPhoto} alt={selectedUserName} className="w-12 h-12 rounded-full object-cover" />
                          <div className="flex-1">
                            <h6 >{selectedUserName}</h6>
                            <DateView className="text-sm mt-2 font-medium" dateNumber={selectedQuestionDate} pattern="dd.MM.yyyy" />
                          </div>
                        </div>
                        <div className="py-4 px-3 rounded-lg bg-gray-100 my-4 max-h-40 overflow-auto custom-scrollbar ">
                          <p className="text-gray-700 ">
                            {selectedQuestion}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pb-4 pt-8 border-t border-gray-200 px-3">
                          <span className="flex items-center">
                            <AnswerArrow className="text-gray-700  w-12 h-12 mr-2 bg-gray-100 rounded-full p-3" />
                            <div>
                              <span className="text-sm text-gray-900 font-medium">
                                Profesyonel Yanıtı:
                              </span>
                              <p className="p-sm-gray-700">
                                <DateView className="text-sm mt-1 text-gray-700" dateNumber={selectedAnswerDate} pattern="dd/MM/yyyy" />
                              </p>
                            </div>

                          </span>
                          {isApprovedFromAdmin === true ?
                            <div className="font-medium text-sm text-green-400">Yanıt Onaylandı</div>
                            : isRejectedFromAdmin === true ?
                              <div className="font-medium text-sm text-gray-900">Yanıt Reddedildi</div>
                              : (isApprovedFromAdmin === false && isRejectedFromAdmin === false) &&
                              <div className="font-medium text-sm text-yellow-600">Yanıt Onay Bekliyor</div>
                          }
                        </div>
                        <p className="text-gray-700 py-4 px-3 bg-gray-100 my-4 rounded-lg max-h-40 overflow-auto custom-scrollbar ">
                          {selectedAnswer}
                        </p>

                      </div>
                    }

                    footer={
                      <>
                        {(isApprovedFromAdmin === true || isRejectedFromAdmin === true) ?
                          <Button text="Kapat" design="button-blue-400 w-full" onClick={() => {
                            clearSelectedItems()
                          }} />
                          :
                          (isApprovedFromAdmin === false && isRejectedFromAdmin === false) &&
                          <>
                            <div className="flex items-center gap-x-3">
                              <Button isLoading={processLoading} text="Yanıtı Reddet" design="button-gray-100 w-full" onClick={() => showRejectAnswerModal(selectedQuestionId)} />
                              <Button isLoading={processLoading} text="Yanıtı Onayla" design="button-blue-400 w-full" onClick={() => showApproveAnswerModal(selectedQuestionId)} />
                            </div>
                          </>}
                      </>
                    }

                  />
                </>
                :
                <></>
        }
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showRejectModal}
        onClose={() => { setShowRejectModal(false); }}
        title={projectDetail?.Statue === 3 ? "Red Nedeni" : "Başvuru Reddet"}
        body={<>
          <div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Nedeni</div>
            <input className={`${projectDetail?.Statue === 3 ? "bg-gray-100" : ""} form-input mt-1`} type="text" placeholder="Red Nedeni" value={rejectTitle} onChange={(e) => { setRejectTitle(e.target.value); }} disabled={projectDetail?.Statue === 3} />
            <div className="text-type-12-medium text-gray-700 mt-4">Red Açıklaması</div>
            <textarea className="text-sm w-full p-3 text-gray-900 border   border-gray-300 rounded-lg focus:outline-none resize-none leading-5 mt-1"
              placeholder="İçerik Açıklaması"
              rows={3} value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); }} disabled={projectDetail?.Statue === 3} />
          </div>
        </>}
        footer={
          projectDetail?.Statue === 1 ?
            <Button isLoading={processLoading} textTiny design="button-blue-400" className="w-full mb-4" text="Kaydet" color="text-gray-400" onClick={() => { rejectProject(); }} />
            :
            <></>
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showSeoModal}
        onClose={() => { setShowSeoModal(false); }}
        title="SEO Bilgileri"
        body={
          <div>
            <Label withoutDots title="Proje Adı" className="mt-4" />
            <div className="text-sm text-gray-900">{projectDetail?.Name}</div>
            <Label isRequired withoutDots title="Title" className="mt-4" />
            <input className="form-input" type="text" value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); }} />
            <Label isRequired withoutDots title="Description" className="mt-4" />
            <input className="form-input" type="text" value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); }} />
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { updateSingleIdeaSeo(); }}></Button>
        }
      />
    </div>
  )
}
