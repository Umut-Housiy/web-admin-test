import { FunctionComponent, useContext, useRef, useState } from "react"
import { AnswerArrow, CheckIcon, ChevronRightIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import { Image } from "../../Components/Image";
import { DateView } from "../../Components/DateView";
import { Link } from "react-router-dom";
import { ProductQuestionInnerListModelForPanel } from "../../Models";
import { Modal } from "../../Components/Modal";
import { Button } from "../../Components/Button";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import ApiService from "../../Services/ApiService";

export interface QuestionListPropModel {
  productId: number
}

export const QuestionList: FunctionComponent<QuestionListPropModel> = (props: QuestionListPropModel) => {

  const tableEl = useRef<any>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const getQuestionList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getQuestionListOfProduct(props.productId, page, take, order, searchText);

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

  const [selectedQuestion, setSelectedQuestion] = useState<ProductQuestionInnerListModelForPanel>({
    ProductQuestionId: 0,
    QuestionCreatedDateJSTime: 0,
    UserId: 0,
    SellerId: 0,
    SellerStoreName: "",
    ProductId: 0,
    ProductPhoto: "",
    ProductName: "",
    BarcodeNo: "",
    Question: "",
    Answer: "",
    IsAnswered: false,
    IsApprovedFromAdmin: false,
    IsRejectedFromAdmin: false,
    UserNameSurname: "",
    UserPhotoPath: "",
    AnswerDateJSTime: 0,
    ApprovedDateJSTime: 0,
  });

  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

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
        emptyListText={"Soru & Cevap Bulunamadı"}
        getDataFunction={getQuestionList}
        header={
          <div className=" lg:grid-cols-12 px-2 border-b border-t lg:h-14 border-gray-200 hidden lg:grid gap-4 flex items-center">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Tarih
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Müşteri Adı
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Soru Detayı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Satıcı Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Yanıt Durumu
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durumu
              </span>
            </div>
          </div>
        }
        renderItem={(e, i) => {
          return (
            <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-1 flex items-center">
                <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Tarih:</span>
                <DateView className="text-sm inline-block" dateNumber={e.QuestionCreatedDateJSTime} pattern="dd/MM/yyyy" />
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Müşteri Adı:</span>
                <div className="flex items-center text-gray-900">
                  <Image src={e.UserPhotoPath} alt={e.UserNameSurname} className=" mr-2 min-w-12 max-w-12 max-h-12 min-h-12 rounded-full object-contain" />
                  <div className="text-sm font-medium">{e.UserNameSurname}</div>
                </div>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Soru Detayı:</span>
                <span className="text-sm inline-block line-clamp-2" ><span className="italic">“</span> {e.Question} <span className="italic">“</span></span>
                {e.Question.length > 100 && <span className="font-medium text-xs cursor-pointer" onClick={() => { showDetailOnModal(e) }}>Daha Fazla Göster</span>}
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Satıcı:</span>
                <Link to={`/satici-detay/${e.SellerId}`} className="text-blue-400 font-medium text-sm underline">
                  {e.SellerStoreName}
                </Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                {e.IsAnswered ?
                  <p className="flex items-center p-sm">
                    <CheckIcon className="icon-sm mr-1.5" />
                    <span>Yanıtlandı</span>
                  </p>
                  :
                  <p className="flex items-center text-red-400">
                    <span className="text-sm font-medium">Yanıt Bekliyor</span>
                  </p>
                }
              </div>
              <div className="lg:col-span-2  flex items-center">
                <div className="flex items-center w-full">
                  {e.IsApprovedFromAdmin === true ? <span className="text-sm font-medium mr-3 text-center text-green-400 bg-green-100 rounded-full w-full py-2">Onaylandı</span>
                    : e.IsRejectedFromAdmin === true ? <span className="text-sm font-medium mr-3 text-center text-gray-900 bg-gray-100 rounded-full w-full py-2">Reddedildi</span>
                      :
                      <span className="text-sm font-medium mr-3 text-center text-yellow-600 bg-yellow-100 rounded-full w-full py-2">Onay Bekliyor</span>
                  }
                  <ChevronRightIcon className="w-6 h-6 text-gray-700 ml-auto cursor-pointer" onClick={() => { showDetailOnModal(e) }} />
                </div>
              </div>
            </div>
          )
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
