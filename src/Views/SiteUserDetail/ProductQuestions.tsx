import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { Table } from "../../Components/Table";
import { ProductQuestionInnerListModelForPanel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Image } from "../../Components/Image"
import { AnswerArrow, CheckIcon, ChevronRightIcon, ClockIcon, ProhibitIcon } from "../../Components/Icons";
import { Modal } from "../../Components/Modal";
import { DateView } from "../../Components/DateView";
import { Button } from "../../Components/Button";

interface ProductQuestionsProps {
  UserId: number,
}

export const ProductQuestions: FunctionComponent<ProductQuestionsProps> = (props: ProductQuestionsProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const [selectedQuestion, setSelectedQuestion] = useState<ProductQuestionInnerListModelForPanel>({} as ProductQuestionInnerListModelForPanel);

  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const getUserProductQuestionsForAdminHandler = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getUserProductQuestionsForAdminHandler(props.UserId, page, take, searchText, order);

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


  const showDetailOnModal = (question) => {
    setSelectedQuestion(question);
    setShowDetailModal(true);
  }


  const showRejectModal = (questionId) => {
    setShowDetailModal(false);

    context.showModal({
      type: "Question",
      title: "Reddet",
      message: "Soru reddedilecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.rejectProductQuestion(questionId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Soru reddedildi.",
            onClose: () => { context.hideModal(); tableEl.current?.reload() }
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

  const approveProductQuestion = async (questionId) => {
    setProcessLoading(true);

    const _result = await ApiService.approveProductQuestion(questionId);

    setShowDetailModal(false);


    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Soru onaylandı.",
        onClose: () => { context.hideModal(); setProcessLoading(false); tableEl.current?.reload() }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
  }



  return (
    <>
      <Table
        ref={tableEl}
        emptyListText={"Soru Bulunamadı"}
        getDataFunction={getUserProductQuestionsForAdminHandler}
        header={
          <div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Tarih
              </span>
            </div>
            <div className="lg:col-span-3 flex items-center">
              <span className="p-sm-gray-400">
                Ürün Adı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Satıcı
              </span>
            </div>
            <div className="lg:col-span-3 flex items-center">
              <span className="p-sm-gray-400">
                Soru Detayı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Yanıt Durumu
              </span>
            </div>
          </div>
        }
        renderItem={(e: ProductQuestionInnerListModelForPanel, i) => {
          return <div className="lg:grid-cols-9 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
            <div className="lg:col-span-1 gap-2 flex items-center">
              <p className="p-sm">
                {handleJsDate(e.QuestionCreatedDateJSTime)}
              </p>
            </div>
            <div className="lg:col-span-3 flex items-center gap-2">
              <Image src={e.ProductPhoto ?? ""} alt={e.ProductName} className="w-12 h-12  object-contain" />
              <p className="p-sm">
                {e.ProductName ?? ""}
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="text-sm font-medium text-blue-400 underline cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }}>
                {e.SellerStoreName}
              </p>
            </div>
            <div className="lg:col-span-3 flex items-center">
              <p className="p-sm ">
                <span className="text-sm inline-block line-clamp-2" ><span className="italic">“</span> {e.Question} <span className="italic">“</span></span>
                {e.Question.length > 100 && <span className="font-medium text-xs cursor-pointer" onClick={() => { showDetailOnModal(e) }}>Daha Fazla Göster</span>}
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center justify-between">
              {
                e.IsAnswered ?
                  <p className="text-sm flex items-center gap-1 text-gray-900 font-medium">
                    <CheckIcon className="icon-sm text-gray-900" />
                    <div>Yanıtlandı</div>
                  </p>
                  :
                  <p className="text-sm flex items-center gap-1 text-yellow-600 font-medium">
                    <ClockIcon className="icon-sm text-yellow-600" />
                    <div>Yanıt Bekliyor</div>
                  </p>
              }

              <div className="flex gap-2 items-center">
                <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDetailOnModal(e) }} />
              </div>
            </div>
          </div>
        }}
      />
      <Modal
        modalType="fixedSm"
        showModal={showDetailModal}
        onClose={() => { setShowDetailModal(false) }}
        title="Soru Detayı"
        body={
          <div className=" ">
            <div className="flex items-center pb-4 border-b gap-2">
              <Image src={selectedQuestion.ProductPhoto} alt={selectedQuestion.ProductName} className="w-16 h-16 object-contain" />
              <div>
                <h5>{selectedQuestion.ProductName}</h5>
                <span className="text-gray-700 text-sm">Barkod No: <span className="font-medium">{selectedQuestion.BarcodeNo}</span></span>
              </div>
            </div>

            <div className="py-4 px-3 rounded-lg bg-gray-100 my-4 ">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-gray-900">{selectedQuestion.UserNameSurname}</h5>
                <DateView className="text-sm inline-block" dateNumber={selectedQuestion.QuestionCreatedDateJSTime} pattern="dd/MM/yyyy" />
              </div>
              <p className="text-gray-700 text-tiny max-h-32 overflow-auto custom-scrollbar">
                {selectedQuestion.Question}
              </p>
            </div>
            {selectedQuestion.IsAnswered === true &&
              <div className="py-4 border-t">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <AnswerArrow className="text-gray-700 icon-md mr-2" />
                      <Link to={`/satici-detay/${selectedQuestion.SellerId}`} target={"_blank"} className="text-tiny text-blue-400 underline cursor-pointer font-medium">
                        {selectedQuestion.SellerStoreName}
                      </Link>
                    </span>
                    <DateView className="text-sm inline-block" dateNumber={selectedQuestion.AnswerDateJSTime} pattern="dd/MM/yyyy" />
                  </div>
                  {selectedQuestion.IsAnswered === true ?
                    <p className="text-gray-700 text-tiny py-3 max-h-32 overflow-auto custom-scrollbar">
                      {selectedQuestion.Answer}
                    </p>
                    :
                    <></>
                  }
                  <div className="flex items-center justify-between mt-4">
                    {(selectedQuestion.ApprovedDateJSTime > 0 && selectedQuestion.IsAnswered === true) ?
                      <DateView className="text-sm inline-block" dateNumber={selectedQuestion.ApprovedDateJSTime} pattern="dd/MM/yyyy" />
                      :
                      "-"
                    }
                    {selectedQuestion.IsAnswered === true ?
                      <span className={`${selectedQuestion.IsApprovedFromAdmin === true ? "text-green-400" : selectedQuestion.IsRejectedFromAdmin === true ? "text-gray-900" : "text-yellow-600"} font-medium text-sm`}>
                        {selectedQuestion.IsApprovedFromAdmin === true ? "Yayında" : selectedQuestion.IsRejectedFromAdmin === true ? "Reddedildi" : "Onay Bekliyor"}
                      </span>
                      :
                      <span className="text-sm text-red-400 font-medium">Yanıt Bekliyor</span>
                    }
                  </div>
                </div>

              </div>
            }
          </div>
        }
        footer={
          <div className="flex items-center gap-2">
            {(selectedQuestion.IsAnswered === true && selectedQuestion.IsApprovedFromAdmin === false && selectedQuestion.IsRejectedFromAdmin === false) &&
              <>
                <Button text="Yanıtı Reddet" design="button-gray-100 w-full" onClick={() => showRejectModal(selectedQuestion.ProductQuestionId)} />
                <Button isLoading={processLoading} text="Yanıtı Onayla" design="button-blue-400 w-full" onClick={() => approveProductQuestion(selectedQuestion.ProductQuestionId)} />
              </>
            }
          </div>
        }
      />
    </>
  )
}
