import { FunctionComponent, useContext, useRef, useState } from "react"
import { Table } from "../Components/Table";
import { TabsTitle } from "../Components/TabsTitle";
import { Image } from "../Components/Image";
import { ChevronRightIcon, TrashIcon } from "../Components/Icons";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Modal } from "../Components/Modal";
import { Label } from "../Components/Label";
import { Button } from "../Components/Button";
import ApiService from "../Services/ApiService";

export const AcademyQuestionList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const tabsLink = [
    { id: 1, name: "Satıcı Eğitim Soruları" },
    { id: 2, name: "Profesyonel Eğitim Soruları" }
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const sellerQuestionTableEl = useRef<any>();

  const proQuestionTableEl = useRef<any>();

  const [showAnswerQuestionModal, setShowAnswerQuestionModal] = useState<boolean>(false);

  const [answerModalId, setAnswerModalId] = useState<number>(0);

  const [answerModalPhoto, setAnswerModalPhoto] = useState<string>("");

  const [answerModalName, setAnswerModalName] = useState<string>("");

  const [answerModalDate, setAnswerModalDate] = useState<string>("");

  const [answerModalQuestion, setAnswerModalQuestion] = useState<string>("");

  const [answerModalAnswer, setAnswerModalAnswer] = useState<string>("");

  const getSellerQuestionList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getAcademyUnasweredQuestionList(page, take, searchText, order, 1);

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

  const getProQuestionList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getAcademyUnasweredQuestionList(page, take, searchText, order, 2);

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
    const _result = await ApiService.deleteAcademyQuestion(Id);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Soru silindi.",
        onClose: () => {
          context.hideModal();
          sellerQuestionTableEl.current?.reload();
          proQuestionTableEl.current?.reload();
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
    setShowAnswerQuestionModal(true);
  }

  const answerAcademyQuestion = async () => {
    setProcessLoading(true);

    const _result = await ApiService.answerAcademyQuestion(answerModalId, answerModalAnswer);

    setShowAnswerQuestionModal(false);
    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Soru yanıtlandı.",
        onClose: () => {
          context.hideModal();
          sellerQuestionTableEl.current?.reload();
          proQuestionTableEl.current?.reload();
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2>Yanıt Bekleyen Eğitim Soru Listesi</h2>
        <div className="mt-5">
          <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        </div>
        {
          selectedTabsId === 1 ?
            <>
              <Table
                ref={sellerQuestionTableEl}
                key={"1"}
                emptyListText={"İçerik Bulunamadı"}
                getDataFunction={getSellerQuestionList}
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
                  return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
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
                        <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleShowDeleteQuestionModal(e.Id); }} />
                        {
                          e.Statue === 1 ?
                            <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" onClick={() => { handleOpenAnswerQuestionModal(e); }} />
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
            selectedTabsId === 2 ?
              <>
                <Table
                  ref={proQuestionTableEl}
                  key={"2"}
                  emptyListText={"İçerik Bulunamadı"}
                  getDataFunction={getProQuestionList}
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
                          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleShowDeleteQuestionModal(e.Id); }} />
                          {
                            e.Statue === 1 ?
                              <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" onClick={() => { handleOpenAnswerQuestionModal(e); }} />
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
          <Button isLoading={processLoading} textTiny className="w-full" design="button-blue-400" text="Yanıtla" onClick={() => { answerAcademyQuestion(); }} />
        }
      />
    </div>
  )
}
