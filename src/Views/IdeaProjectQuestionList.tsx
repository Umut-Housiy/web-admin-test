import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { AnswerArrow, CheckIcon, ChevronRightIcon, ClockIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { TabsTitle } from "../Components/TabsTitle";
import { DateView } from "../Components/DateView";
import { Image } from "../Components/Image";
import { Button } from "../Components/Button";
import { Modal } from "../Components/Modal";

export const IdeaProjectQuestionList: FunctionComponent = () => {
  const allQuestionTableEl = useRef<any>();

  const history = useHistory();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tabsLink = [
    { id: 1, name: "Tüm Soru Cevaplar" },
    { id: 2, name: "Onay Bekleyen Cevaplar" }
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const getAllIdeaProjectQuestionList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getAllIdeaProjectQuestionList(page, take, order, searchText);

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

  //TABS2 WAITING APPROVAL QUESTION LIST
  const waitingApprovalQuestionsTable = useRef<any>();

  const [showAnsweredQuestionModal, setShowAnsweredQuestionModal] = useState<boolean>(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);

  const [selectedUserPhoto, setSelectedUserPhoto] = useState<string>("");

  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const [selectedQuestionDate, setSelectedQuestionDate] = useState<number>(0);

  const [selectedQuestion, setSelectedQuestion] = useState<string>("");

  const [selectedAnswerDate, setSelectedAnswerDate] = useState<number>(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const [processRejectAnswerLoading, setProcessRejectAnswerLoading] = useState<boolean>(false);

  const [processApproveAnswerLoading, setProcessApproveAnswerLoading] = useState<boolean>(false);


  const getWaitingApprovalQuestionsList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getWaitingApprovalQuestionsList(page, take, order, searchText);

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
  const showAnswerModal = (item) => {
    setSelectedQuestionId(item.ProjectQuestionId);
    setSelectedUserPhoto(item.UserPhotoPath);
    setSelectedUserName(item.UserNameSurname);
    setSelectedQuestionDate(item.QuestionCreatedDateJSTime);
    setSelectedQuestion(item.QuestionDescription);
    setSelectedAnswerDate(item.AnswerDateJSTime);
    setSelectedAnswer(item.Answer)
    setShowAnsweredQuestionModal(true);
  }
  const clearSelectedItems = () => {
    setSelectedUserPhoto("");
    setSelectedUserName("");
    setSelectedQuestionDate(0);
    setSelectedQuestion("");
    setSelectedAnswerDate(0);
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
        setProcessRejectAnswerLoading(true);

        const _result = await ApiService.rejectProjectQuestion(questionId);

        setProcessRejectAnswerLoading(false);
        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Yanıt reddedildi.",
            onClose: () => {
              context.hideModal();
              if (waitingApprovalQuestionsTable.current) {
                waitingApprovalQuestionsTable.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => {
              context.hideModal(); setProcessRejectAnswerLoading(false);
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
        setProcessApproveAnswerLoading(true);

        const _result = await ApiService.approveProjectQuestion(questionId);

        setProcessApproveAnswerLoading(false);
        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Yanıt onaylandı",
            onClose: () => {
              context.hideModal();
              if (waitingApprovalQuestionsTable.current) {
                waitingApprovalQuestionsTable.current?.reload();
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
  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Fikir ve Proje Soru Listesi</h2>
        <div className="mt-5">
          <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        </div>
        {selectedTabsId === 1 ?
          <Table
            ref={allQuestionTableEl}
            key="1"
            emptyListText={"Soru Bulunamadı"}
            getDataFunction={getAllIdeaProjectQuestionList}
            header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-2">
                <span className="text-type-12-medium text-gray-700">
                  Fikir Adı
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="text-type-12-medium text-gray-700">
                  Kategori
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="text-type-12-medium text-gray-700">
                  Ekleyen Profesyonel
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="text-type-12-medium text-gray-700">
                  Gelen Soru Sayısı
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="text-type-12-medium text-gray-700">
                  Yanıt Bekleyen Soru Sayısı
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="text-type-12-medium text-gray-700">
                  Onay Bekleyen Cevap Sayısı
                </span>
              </div>

            </div>}
            renderItem={(e, i) => {
              return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Fikir Adı:</span>
                  <p className="p-sm">
                    {e.Name}
                  </p>
                </div>
                <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Kategori:</span>
                  <p className="p-sm">
                    {e.CategoryName}
                  </p>
                </div>
                <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Ekleyen Profesyonel: </span>
                  <Link className="text-sm text-blue-400 font-medium underline" to={`/pro-profesyonel-detay/${e.ProId}`}>
                    {e.StoreName}
                  </Link>
                </div>
                <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Gelen Soru Sayısı:</span>
                  <p className="p-sm">
                    {e.QuestionCount}
                  </p>
                </div>
                <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Yanıt Bekleyen Soru Sayısı:</span>
                  <p className="p-sm">
                    {e.UnansweredQuestionCount}
                  </p>
                </div>
                <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Onay Bekleyen Cevap Sayısı:</span>
                  <div className="flex items-center justify-between p-sm">
                    {e.WaitingApprovalQuestionCount}
                    <Link to={{ pathname: `/proje-detay/${e.Id}`, state: { tabId: 3, IsIdeaApproved: e.IsIdeaApproved } }}>
                      <ChevronRightIcon className="icon-md text-gray-900 cursor-pointer" />
                    </Link>
                  </div>
                </div>
              </div>
            }}
          />
          :
          selectedTabsId === 2 &&
          <>
            <Table
              ref={waitingApprovalQuestionsTable}
              key="2"
              emptyListText={"Soru Bulunamadı"}
              getDataFunction={getWaitingApprovalQuestionsList}
              header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-2">
                <div className="lg:col-span-2">
                  <span className="text-type-12-medium text-gray-700">
                    Fikir/Proje İsmi
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="text-type-12-medium text-gray-700">
                    Kategori
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="text-type-12-medium text-gray-700">
                    Ekleyen Profesyonel
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="text-type-12-medium text-gray-700">
                    Müşteri Bilgisi
                  </span>
                </div>
                <div className="lg:col-span-1 flex items-center">
                  <span className="text-type-12-medium text-gray-700">
                    Soru Tarihi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="text-type-12-medium text-gray-700">
                    Yanıt Durumu
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="text-type-12-medium text-gray-700">
                    Onay Durumu
                  </span>
                </div>
              </div>}
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-2 items-center py-3 lg:py-0">
                  <div className="lg:col-span-2 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Fikir/Proje Adı:</span>
                    <p className="p-sm whitespace-nowrap overflow-x-auto custom-scrollbar">
                      {e.ProjectName}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori:</span>
                    <p className="p-sm ">
                      {e.ProjectCategory}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Ekleyen Profesyonel: </span>
                    <Link className="text-sm text-blue-400 font-medium underline  whitespace-nowrap overflow-x-auto custom-scrollbar" to={`/pro-profesyonel-detay/${e.ProId}`}>
                      {e.ProStoreName}
                    </Link>
                  </div>
                  <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Müşteri Bilgisi:</span>
                    <div className="flex items-center gap-2">
                      <Image src={e.UserPhotoPath} alt={e.UserNameSurname} className="w-10 h-10 rounded-full object-contain" />
                      <p className="p-sm  whitespace-nowrap overflow-x-auto custom-scrollbar">
                        {e.UserNameSurname}
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Soru Tarihi:</span>
                    <DateView className="text-sm ml-2 font-medium" dateNumber={e.QuestionCreatedDateJSTime} pattern="dd.MM.yyyy" />
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
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
                    <span className="p-sm-gray-700 lg:hidden mr-2">Onay Durumu
                    </span>
                    {e.IsAnswered === true ?

                      <div className="flex items-center justify-between">
                        <div className="bg-yellow-100 text-yellow-600 text-sm font-medium w-2/3 py-2 rounded-full text-center">
                          Onay Bekliyor
                        </div>
                        {e.IsAnswered === true &&
                          <ChevronRightIcon className="icon-md text-gray-900 cursor-pointer" onClick={() => { showAnswerModal(e) }} />
                        }
                      </div>
                      :
                      <span className="text-center w-2/3 block">-</span>
                    }
                  </div>
                </div>
              }}
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
                          <DateView className="text-sm mt-1 text-gray-700" dateNumber={selectedAnswerDate} pattern="dd.MM.yyyy" />
                        </p>
                      </div>

                    </span>
                  </div>
                  <p className="text-gray-700 py-4 px-3 bg-gray-100 my-4 rounded-lg max-h-40 overflow-auto custom-scrollbar ">
                    {selectedAnswer}
                  </p>

                </div>
              }
              footer={
                <>
                  <div className="flex items-center gap-x-3">
                    <Button isLoading={processRejectAnswerLoading} text="Yanıtı Reddet" design="button-gray-100 w-full" onClick={() => showRejectAnswerModal(selectedQuestionId)} />
                    <Button isLoading={processApproveAnswerLoading} text="Yanıtı Onayla" design="button-blue-400 w-full" onClick={() => showApproveAnswerModal(selectedQuestionId)} />
                  </div>
                </>
              }

            />
          </>
        }
      </div>
    </div>

  )
}
