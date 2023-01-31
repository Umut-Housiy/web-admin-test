import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"
import { Button } from "../Components/Button"
import { AnswerIcon, ChevronRightIcon, EditIcon, EyeOffIcon, TrashIcon } from "../Components/Icons"
import { TabsTitle } from "../Components/TabsTitle"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import { Image } from "../Components/Image"
import PdfIcon from '../Assets/pdfIcon.svg'
import { Table } from "../Components/Table"
import { RateStars } from "../Components/RateStars"
import { Modal } from "../Components/Modal"
import { Label } from "../Components/Label"
import { Loading } from "../Components/Loading"
import { useStateEffect } from "../Components/UseStateEffect"

interface RouteParams {
  id: string
}

interface LocationModel {
  tabId?: number,
  queryPage: number,
}

export const AcademyDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const location = useLocation<LocationModel>();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const tabsLink = [
    { id: 1, name: "Eğitim İçeriği" },
    { id: 2, name: "Soru & Cevaplar" },
    { id: 3, name: "Değerlendirmeler" }
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const questionTableEl = useRef<any>();

  const evaluationTableEl = useRef<any>();

  //#region TAB 1
  const [title, setTitle] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [orderBy, setOrderBy] = useState<number>(0);

  const [videoUrl, setVideoUrl] = useState<string>("");

  const [videoDuration, setVideoDuration] = useState<string>("");

  const [shortDesc, setShortDesc] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const [isFeatured, setIsFeatured] = useState<boolean>(true);

  const [categoryTypeStr, setCategoryTypeStr] = useState<string>("");

  const [categoryStr, setCategoryStr] = useState<string>("");

  const [oldPhoto, setOldPhoto] = useState<string>("");

  const [oldPdf, setOldPdf] = useState<string>("");

  const [academyTypeStr, setAcademyTypeStr] = useState<string>("");

  const [academyType, setAcademyType] = useState<number>(0);

  //#endregion

  //#region TAB 2
  const [showAnswerQuestionModal, setShowAnswerQuestionModal] = useState<boolean>(false);

  const [showAnswerModal, setShowAnswerModal] = useState<boolean>(false);

  const [answerModalId, setAnswerModalId] = useState<number>(0);

  const [answerModalPhoto, setAnswerModalPhoto] = useState<string>("");

  const [answerModalName, setAnswerModalName] = useState<string>("");

  const [answerModalDate, setAnswerModalDate] = useState<string>("");

  const [answerModalUpdateDate, setAnswerModalUpdateDate] = useState<string>("");

  const [answerModalQuestion, setAnswerModalQuestion] = useState<string>("");

  const [answerModalAnswer, setAnswerModalAnswer] = useState<string>("");

  const [answerModalAdminName, setAnswerModalAdminName] = useState<string>("");
  //#endregion

  //#region TAB 3
  const [showEvaluationModal, setShowEvaluationModal] = useState<boolean>(false);

  const [evaluationModalPhoto, setEvaluationModalPhoto] = useState<string>("");

  const [evaluationModalName, setEvaluationModalName] = useState<string>("");

  const [evaluationModalDate, setEvaluationModalDate] = useState<string>("");

  const [evaluationModalRate, setEvaluationModalRate] = useState<number>(0);

  const [evaluationModalDescription, setEvaluationModalDescription] = useState<string>("");
  //#endregion

  useEffect(() => {
    getAcademyDetail();
  }, []);

  const getAcademyDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getAcademyDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setTitle(_result.data.Title);
      setShortDesc(_result.data.ShortDescription);
      setDescription(_result.data.Description);
      setVideoUrl(_result.data.VideoUrl);
      setVideoDuration(_result.data.VideoDuration);
      setOrderBy(_result.data.OrderBy);
      setIsEnabled(_result.data.IsEnabled);
      setIsFeatured(_result.data.IsFeatured);
      setCategoryTypeStr(_result.data.CategoryTypeStr);
      setCategoryStr(_result.data.CategoryName);
      setOldPhoto(_result.data.PhotoUrl);
      setOldPdf(_result.data.DocumentUrl);
      setAcademyTypeStr(_result.data.AcademyTypeStr);
      setAcademyType(_result.data.AcademyType)
      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/akademi-listesi"); }
      });
    }
  }

  const showDeleteModal = () => {
    context.showModal({
      type: "Question",
      title: "Eğitim silinecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.deleteAcademy(Number(params.id ?? "0"));

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Eğitim silindi.",
            onClose: () => { context.hideModal(); history.push("/akademi-listesi"); }
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

  const changeAcademyStatus = async () => {
    context.showModal({
      type: "Question",
      title: "Durum Değiştir",
      message: isEnabled ? "Eğitim pasif duruma getirilecek. Emin misiniz?" : "Eğitim aktif duruma getirilecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();

        setProcessLoading(true);

        const _result = await ApiService.changeAcademyStatus(Number(params.id ?? "0"), !isEnabled);

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

  const getAcademyQuestionList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getAcademyQuestionList(page, take, searchText, order, Number(params.id ?? "0"));

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

  const getAcademyEvaluationList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getAcademyEvaluationList(page, take, searchText, order, Number(params.id ?? "0"));

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

  const handleShowDeleteQuestionModal = (Id) => {
    context.showModal({
      type: "Question",
      title: "İçerik silinecek. Emin misiniz?",
      onClick: async () => {
        await deleteAcademyQuestion(Id);
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const deleteAcademyQuestion = async (Id) => {
    context.hideModal();

    setProcessLoading(true);

    const _result = await ApiService.deleteAcademyQuestion(Id);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Soru silindi.",
        onClose: () => {
          context.hideModal();
          if (questionTableEl.current) {
            questionTableEl.current?.reload();
          }
          if (evaluationTableEl.current) {
            evaluationTableEl.current?.reload();
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

  const handleShowDeleteEvaluationModal = (Id) => {
    context.showModal({
      type: "Question",
      title: "İçerik silinecek. Emin misiniz?",
      onClick: async () => {
        await deleteAcademyEvaluation(Id);
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const deleteAcademyEvaluation = async (Id) => {
    context.hideModal();

    setProcessLoading(true);
    const _result = await ApiService.deleteAcademyEvaluation(Id);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değerlendirme silindi.",
        onClose: () => {
          context.hideModal();
          if (questionTableEl.current) {
            questionTableEl.current?.reload();
          }
          if (evaluationTableEl.current) {
            evaluationTableEl.current?.reload();
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

  const handleOpenAnswerQuestionModal = (item) => {
    setAnswerModalId(item.Id);
    setAnswerModalPhoto(item.Photo);
    setAnswerModalName(item.StoreName);
    setAnswerModalDate(item.CreatedDate);
    setAnswerModalQuestion(item.Question);
    setAnswerModalAnswer("");
    setAnswerModalAdminName("");
    setShowAnswerQuestionModal(true);
  }

  const handleOpenAnswerModal = (item) => {
    setAnswerModalId(item.Id);
    setAnswerModalPhoto(item.Photo);
    setAnswerModalName(item.StoreName);
    setAnswerModalAdminName(item.AdminUsername);
    setAnswerModalDate(item.CreatedDate);
    setAnswerModalUpdateDate(item.UpdatedDate);
    setAnswerModalQuestion(item.Question);
    setAnswerModalAnswer(item.Answer);
    setShowAnswerModal(true);
  }

  const answerAcademyQuestion = async () => {
    setProcessLoading(true);

    const _result = await ApiService.answerAcademyQuestion(answerModalId, answerModalAnswer);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Soru yanıtlandı.",
        onClose: () => {
          context.hideModal();
          if (questionTableEl.current) {
            questionTableEl.current?.reload();
          }
          if (evaluationTableEl.current) {
            evaluationTableEl.current?.reload();
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

  const handleOpenEvaluationModal = (item) => {
    setEvaluationModalPhoto(item.Photo);
    setEvaluationModalName(item.StoreName);
    setEvaluationModalDate(item.CreatedDate);
    setEvaluationModalRate(item.Rating);
    setEvaluationModalDescription(item.Description);
    setShowEvaluationModal(true);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/akademi-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/akademi-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Eğitim Listesi
          </div>
        </Link>
        <div className="flex align-items-center mb-6">
          <h2>Eğitim Detayı</h2>
          <Link className="ml-auto" to={{ pathname: `/akademi-duzenle/${params.id}` }}>
            <Button isLoading={processLoading} textTiny className="w-72 " buttonSm design="button-blue-400" text="Eğitim İçeriğini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} />
          </Link>
          <Button isLoading={processLoading} textTiny className="ml-2 w-60" buttonSm design="button-gray-100" text={isEnabled ? "Eğitimi Pasife Al" : "Eğitimi Aktifleştir"} hasIcon icon={<EyeOffIcon className="icon-sm mr-2" />} onClick={() => { changeAcademyStatus(); }} />
          <Button isLoading={processLoading} textTiny className="w-32 ml-2" buttonSm design="button-gray-100" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => { showDeleteModal(); }} />
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {
          selectedTabsId === 1 ?
            <>
              <div className="mt-4">
                <h4>Eğitim Bilgileri</h4>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Eğitim Adı</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading textMd />
                      </div>
                      :
                      <div className="w-5/6 text-gray-900 text-tiny"><span>{title}</span></div>
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Eğitim Kapak Görseli</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <Loading width="w-32" height="h-32" className="rounded-lg" />
                      :
                      <img src={(oldPhoto === "" || oldPhoto === null) ? "https://housiystrg.blob.core.windows.net/sellermedia/avatar.png" : oldPhoto} className="w-32 h-32 object-cover rounded-lg" />
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Gösterim Alanı</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading textMd />
                      </div>
                      :
                      <div className="w-5/6 text-gray-900 text-tiny"><span>{categoryTypeStr}</span></div>
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Kategori</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading textMd />
                      </div>
                      :
                      <div className="w-5/6 text-gray-900 text-tiny"><span>{categoryStr}</span></div>
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Görüntülenme Sırası</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading textMd />
                      </div>
                      :
                      <div className="w-5/6 text-gray-900 text-tiny"><span>{orderBy}</span></div>
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Eğitim İçeriği</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading textMd />
                      </div>
                      :
                      <div className="w-5/6 text-gray-900 text-tiny"><span>{academyTypeStr}</span></div>
                  }
                </div>
                {academyType === 1 && <>
                  <div className="mt-4 flex gap-2">
                    <div className="w-1/6 text-gray-700 text-tiny flex"><span>İçerik Video URL</span><span className="ml-auto">:</span></div>
                    {
                      loading ?
                        <div className="w-5/6 -mb-5">
                          <Loading textMd />
                        </div>
                        :
                        <div className="w-5/6 text-gray-900 text-tiny"><span>{videoUrl}</span></div>
                    }
                  </div>
                </>
                }
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Eğitim Süresi</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading textMd />
                      </div>
                      :
                      <div className="w-5/6 text-gray-900 text-tiny"><span>{videoDuration}</span></div>
                  }
                </div>

                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Eğitim Belgeleri (PDF)</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 h-8">
                        <Loading inputSm />
                      </div>
                      :
                      oldPdf && oldPdf !== "" && oldPdf !== "-" &&
                      <a target="_blank" href={oldPdf} className="flex gap-4">
                        <img src={PdfIcon} className="w-8 h-8 rounded-lg object-contain " />
                        <div className="text-tiny text-blue-400 font-medium my-auto">Belgeyi Görüntüle</div>
                      </a>
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Kısa Açıklama</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading inputSm />
                      </div>
                      :
                      <div className="w-5/6 text-gray-900 text-tiny"><span>{shortDesc}</span></div>
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Eğitim Açıklaması</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading inputMd />
                      </div>
                      :
                      <div className="w-5/6 text-gray-900 text-tiny"><span>{description}</span></div>
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Eğitimi Öne Çıkar</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading textMd />
                      </div>
                      :
                      <div className={`${isFeatured ? "text-green-400" : "text-red-400"} text-tiny font-medium`}><span>{isFeatured ? "Aktif" : "Pasif"}</span></div>
                  }
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-1/6 text-gray-700 text-tiny flex"><span>Eğitim Durumu</span><span className="ml-auto">:</span></div>
                  {
                    loading ?
                      <div className="w-5/6 -mb-5">
                        <Loading textMd />
                      </div>
                      :
                      <div className={`${isEnabled ? "text-green-400" : "text-red-400"} text-tiny font-medium`}><span>{isEnabled ? "Aktif" : "Pasif"}</span></div>
                  }
                </div>
              </div>
            </>
            :
            selectedTabsId === 2 ?
              <>
                <Table
                  ref={questionTableEl}
                  key={"1"}
                  emptyListText={"İçerik Bulunamadı"}
                  getDataFunction={getAcademyQuestionList}
                  header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-1 flex items-center">
                      <span className="p-sm-gray-400">
                        Tarih
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Kullanıcı Adı
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Eğitim Kategorisi
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Eğitim Başlığı
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Soru Detayı
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Yanıt Durumu
                      </span>
                    </div>
                  </div>}
                  renderItem={(e, i) => {
                    return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center">
                      <div className="lg:col-span-1">
                        <p className="p-sm">
                          {e.CreatedDate}
                        </p>
                      </div>
                      <div className="lg:col-span-1 flex gap-2 items-center">
                        <Image src={e.Photo} alt={e.StoreName} className="w-8 h-8 object-cover rounded-full" />
                        <p className="p-sm">
                          {e.StoreName}
                        </p>
                      </div>
                      <div className="lg:col-span-1">
                        <p className="p-sm">
                          {e.CategoryName}
                        </p>
                      </div>
                      <div className="lg:col-span-1">
                        <p className="p-sm">
                          {e.AcademyName}
                        </p>
                      </div>
                      <div className="lg:col-span-2">
                        <p className="p-sm pr-2 max-h-20 overflow-y-hidden">
                          {e.Question}
                        </p>
                      </div>
                      <div className="lg:col-span-1 flex justify-between">
                        <p className={`${e.Statue === 1 ? "text-red-400" : e.Statue === 2 ? "text-gray-700" : e.Statue === 3 ? "text-red-400" : ""} font-medium text-sm`}>
                          {e.Statue === 1 ? "Yanıt Bekliyor" : e.Statue === 2 ? "Yanıtlandı" : e.Statue === 3 ? "Silindi" : ""}
                        </p>
                        <div className="text-gray-700 flex gap-2 items-center">
                          {
                            e.Statue === 1 ?
                              <>
                                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleShowDeleteQuestionModal(e.Id); }} />
                                <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" onClick={() => { handleOpenAnswerQuestionModal(e); }} />
                              </>
                              :
                              e.Statue === 2 ?
                                <>
                                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleShowDeleteQuestionModal(e.Id); }} />
                                  <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" onClick={() => { handleOpenAnswerModal(e); }} />
                                </>
                                :
                                <></>
                          }
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
                    ref={evaluationTableEl}
                    key={"2"}
                    emptyListText={"İçerik Bulunamadı"}
                    getDataFunction={getAcademyEvaluationList}
                    header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                      <div className="lg:col-span-1 flex items-center">
                        <span className="p-sm-gray-400">
                          Tarih
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Kullanıcı Adı
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Eğitim Kategorisi
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Eğitim Başlığı
                        </span>
                      </div>
                      <div className="lg:col-span-2">
                        <span className="p-sm-gray-400">
                          Değerlendirme
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm-gray-400">
                          Yanıt Durumu
                        </span>
                      </div>
                    </div>}
                    renderItem={(e, i) => {
                      return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center">
                        <div className="lg:col-span-1">
                          <p className="p-sm">
                            {e.CreatedDate}
                          </p>
                        </div>
                        <div className="lg:col-span-1 flex gap-2 items-center">
                          <Image src={e.Photo} alt={e.StoreName} className="w-8 h-8 object-cover rounded-full" />
                          <p className="p-sm">
                            {e.StoreName}
                          </p>
                        </div>
                        <div className="lg:col-span-1">
                          <p className="p-sm">
                            {e.CategoryName}
                          </p>
                        </div>
                        <div className="lg:col-span-1">
                          <p className="p-sm">
                            {e.AcademyName}
                          </p>
                        </div>
                        <div className="lg:col-span-2">
                          <p className="p-sm pr-2">
                            <RateStars rateValue={e.Rating} className="h-4 mb-1 justify-center" />
                            <span>
                              {e.Description}
                            </span>
                          </p>
                        </div>
                        <div className="lg:col-span-1 flex justify-between">
                          <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                            {e.IsEnabled === true ? "Aktif" : "Silindi"}
                          </p>
                          <div className="text-gray-700 flex gap-2 items-center">
                            {
                              e.IsEnabled &&
                              <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleShowDeleteEvaluationModal(e.Id); }} />
                            }
                            <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" onClick={() => { handleOpenEvaluationModal(e); }} />
                          </div>
                        </div>
                      </div>
                    }}
                  />
                </>
                :
                <></>
        }
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showAnswerQuestionModal}
        onClose={() => { setShowAnswerQuestionModal(false); }}
        title="Soru Detayı"
        body={
          <>
            <div className="flex gap-2">
              <Image src={answerModalPhoto} className="w-12 h-12 object-cover rounded-full" />
              <div className="my-auto">
                <div className="text-sm text-gray-900 font-medium">{answerModalName}:</div>
                <div className="text-xs text-gray-900 mt-1">{answerModalDate}</div>
              </div>
            </div>
            <div className="py-4 border-b border-gray-200">
              <div className="bg-gray-100 rounded-lg text-sm text-gray-900 p-4">
                {answerModalQuestion}
              </div>
            </div>
            <div className="py-4 ">
              <Label title="Yanıtla:" withoutDots />
              <textarea className="text-sm w-full p-3 text-gray-900 border   border-gray-300 rounded-lg focus:outline-none resize-none leading-5"
                placeholder="Yanıt giriniz"
                value={answerModalAnswer}
                onChange={(e) => { setAnswerModalAnswer(e.target.value); }}
                rows={4} />
            </div>
          </>
        }
        footer={
          <Button isLoading={processLoading} textTiny className="w-full" design="button-blue-400" text="Yanıtla" onClick={() => { setShowAnswerQuestionModal(false); answerAcademyQuestion(); }} />
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showAnswerModal}
        onClose={() => { setShowAnswerModal(false); }}
        title="Soru Detayı"
        body={
          <>
            <div className="flex gap-2">
              <Image src={answerModalPhoto} className="w-12 h-12 object-cover rounded-full" />
              <div className="my-auto">
                <div className="text-sm text-gray-900 font-medium">{answerModalName}:</div>
                <div className="text-xs text-gray-900 mt-1">{answerModalDate}</div>
              </div>
            </div>
            <div className="py-4 border-b border-gray-200">
              <div className="bg-gray-100 rounded-lg text-sm text-gray-900 p-4">
                {answerModalQuestion}
              </div>
            </div>
            <div className="py-4 ">
              <div className="flex gap-2">
                <AnswerIcon className="w-12 h-12 object-cover rounded-full" />
                <div className="my-auto">
                  <div className="text-sm text-gray-900 font-medium">{answerModalAdminName + " Yanıtı:"}</div>
                  <div className="text-xs text-gray-900 mt-1">{answerModalUpdateDate}</div>
                </div>
              </div>
              <div className="py-4">
                <div className="bg-gray-100 rounded-lg text-sm text-gray-900 p-4">
                  {answerModalAnswer}
                </div>
              </div>
            </div>
          </>
        }
      />
      <Modal
        modalType="fixedSm"
        showModal={showEvaluationModal}
        onClose={() => { setShowEvaluationModal(false); }}
        title="Eğitim Değerlendirmesi"
        body={
          <>
            <div className="flex gap-2">
              <Image src={evaluationModalPhoto} className="w-12 h-12 object-cover rounded-full" />
              <div className="my-auto">
                <div className="text-sm text-gray-900 font-medium">{evaluationModalName}:</div>
                <div className="text-xs text-gray-900 mt-1">{evaluationModalDate}</div>
              </div>
            </div>
            <div className="py-2 flex items-center justify-center gap-1">
              <RateStars rateValue={evaluationModalRate} className="text-yellow-600 h-5" onProfessional={true} />
              <div className="text-yellow-600 text-base mt-1 ml-1">{evaluationModalRate}</div>
              <div className="text-gray-400 text-base mt-1">{" / 5"}</div>
            </div>
            <div className="py-4">
              <div className="bg-gray-100 rounded-lg text-sm text-gray-900 p-4">
                {evaluationModalDescription}
              </div>
            </div>
          </>
        }
      />
    </div >
  )
}
