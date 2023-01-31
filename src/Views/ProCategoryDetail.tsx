import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"

import { Button } from "../Components/Button"
import { Dropdown } from "../Components/Dropdown"
import { FileUploader } from "../Components/FileUploader"
import { ChevronRightIcon, EditIcon, EyeIcon, EyeOffIcon, FilterIcon, PlusIcon, RefreshIcon, TrashIcon } from "../Components/Icons"
import { Label } from "../Components/Label"
import { Loading } from "../Components/Loading"
import { Modal } from "../Components/Modal"
import { TabsTitle } from "../Components/TabsTitle"
import { ProCategoryDetailModel, ProQuestionListInnerModel, TopCategories } from "../Models"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import { Table } from "../Components/Table"
import { useStateEffect } from "../Components/UseStateEffect"

interface RouteParams {
  id: string
}

interface LocationModel {
  prevPath: string,
  isEditActive?: boolean,
  queryPage: number
}

export const ProCategoryDetail: FunctionComponent = (props) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [Id, setId] = useState<number>(Number(params.id));

  // <<--- Tabs --->>
  const tabsLink = [
    {
      id: 1,
      name: "Kategori Bilgisi",
    },
    {
      id: 2,
      name: "Kategoriye Ait Talep Soruları",
    },
  ]


  const [selectedTabsId, setSelectedTabsId] = useState<number>(
    location.state !== undefined && location.state.prevPath === "/pro-hizmet-talepleri" ? 2 : 1);

  // <<--- Common states --->>

  const categoryTypes = [
    { key: "1", value: "Üst Kategori" },
    { key: "2", value: "Alt Kategori" },
  ];

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" },
  ]

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  // <<--- Tabs 1 Category Detail --->>

  const [categoryDetail, setCategoryDetail] = useState<ProCategoryDetailModel>({
    Id: Number(params.id),
    CategoryName: "",
    CategoryOrder: 0,
    CategoryPhoto: "",
    CategoryDescription: "",
    CategoryStatus: false,
    TopCategory: "",
    ParentId: 0
  });

  const [selectedCategoryType, setSelectedCategoryType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const [topCategories, setTopCategories] = useState<TopCategories[]>([])

  const [selectedTopCategory, setSelectedTopCategory] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const [categoryName, setCategoryName] = useState<string>("");

  const [categoryOrder, setCategoryOrder] = useState<number>(0);

  const [categoryDescription, setCategoryDescription] = useState<string>("");

  const [categoryStatus, setCategoryStatus] = useState<boolean>(false);

  var file = new File([""], "empty.txt", {
    type: "text/plain",
  });

  const [selectedFile, setSelectedFile] = useState<File>(file)

  const [categoryPhoto, setCategoryPhoto] = useState<string>(selectedFile.size > 0 ? URL.createObjectURL(selectedFile) : "");

  const [editable, setEditable] = useState<boolean>(location?.state?.isEditActive ?? false);

  const handleClearInput = () => {
    setSelectedCategoryType(categoryDetail.ParentId > 0 ? categoryTypes[1] : categoryTypes[0]);
    setSelectedTopCategory(topCategories.find(i => i.key === String(categoryDetail.ParentId)) ?? { key: "0", value: "Seçiniz" });
    setCategoryName(categoryDetail.CategoryName);
    setCategoryOrder(categoryDetail.CategoryOrder);
    setCategoryPhoto(categoryDetail.CategoryPhoto);
    setCategoryDescription(categoryDetail.CategoryDescription);
    setCategoryStatus(categoryDetail.CategoryStatus);
    setEditable(false);
    setSelectedFile(file);
  }

  useEffect(() => {
    getParentCategories();
  }, [])

  useStateEffect(() => {
    getCategoryDetailInfo();
    if (tableEl.current) {
      tableEl.current?.reload();
    }
  }, [topCategories]);

  const getParentCategories = async () => {
    setLoading(true);
    const _result = await ApiService.getProCategoryList(1, 9999, "", 0, true);
    setLoading(false);
    if (_result.succeeded) {
      let _curryArray: TopCategories[] = []
      _result.data.Data.map((item) => (
        _curryArray.push({
          key: String(item.Id),
          value: item.CategoryName
        })
      ));
      setTopCategories([..._curryArray])
    }

    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const getCategoryDetailInfo = async () => {
    setLoading(true);

    const _result = await ApiService.getProCategoryDetail(Id);

    if (_result.succeeded === true) {
      setCategoryDetail(_result.data.categoryData)
      setSelectedCategoryType(_result.data.categoryData.ParentId > 0 ? categoryTypes[1] : categoryTypes[0])
      setSelectedTopCategory(topCategories.find(i => i.key === String(_result.data.categoryData.ParentId)) ?? { key: "0", value: "Seçiniz" });
      setCategoryName(_result.data.categoryData.CategoryName);
      setCategoryOrder(_result.data.categoryData.CategoryOrder);
      setCategoryPhoto(_result.data.categoryData.CategoryPhoto);
      setCategoryDescription(_result.data.categoryData.CategoryDescription);
      setCategoryStatus(_result.data.categoryData.CategoryStatus);

      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/pro-kategori-listesi'); }
      });

    }
  }

  const updateCategoryDetailInfo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProCategoryDetail(Id, categoryName, categoryOrder, categoryDescription, categoryStatus, selectedCategoryType.key === "1" ? true : false, selectedFile, Number(selectedTopCategory.key),)

    setProcessLoading(false);

    if (_result.succeeded === true) {

      const _curryObj: ProCategoryDetailModel = categoryDetail;
      _curryObj.Id = Id;
      _curryObj.CategoryName = categoryName;
      _curryObj.CategoryOrder = categoryOrder;
      _curryObj.CategoryPhoto = selectedFile.size > 0 ? URL.createObjectURL(selectedFile) : categoryPhoto;
      _curryObj.CategoryDescription = categoryDescription;
      _curryObj.CategoryStatus = categoryStatus;
      _curryObj.TopCategory = topCategories.find(i => i.key === String(selectedTopCategory.key))?.value ?? "Seçiniz";
      _curryObj.ParentId = Number(selectedTopCategory.key);

      { selectedFile.size > 0 && setCategoryPhoto(URL.createObjectURL(selectedFile)) }

      context.showModal({
        type: "Success",
        title: "Bilgiler başarıyla güncellendi",
        onClose: () => {
          setEditable(false);
          context.hideModal();
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

  const showDeleteProCategory = () => {
    context.showModal({
      type: "Question",
      title: "Kategoriyi Sil",
      message: `${categoryName} isimli kategoriyi silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.removeProCategory(Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Kategori başarıyla silindi",
            onClose: () => {
              context.hideModal();
              history.push('/pro-kategori-listesi')
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

  const showChangeProCategoryStatus = () => {
    context.showModal({
      type: "Question",
      title: "Kategori durumunu değiştir",
      message: `Kategoriyi ${categoryStatus ? "pasif" : "aktif"} duruma geçirmek istediğinize emin misiniz?`,
      onClick: async () => {
        setCategoryStatus(!categoryStatus);
        const _result = await ApiService.changeProCategoryStatus(Id, !categoryStatus);
        if (_result.succeeded === true) {
          setCategoryStatus(!categoryStatus);
          context.showModal({
            type: "Success",
            title: `Kategori başarıyla ${!categoryStatus ? "aktif" : "pasif"} duruma geçirildi`,
            onClose: () => {
              context.hideModal();
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

  // <<--- Tabs 2 Category Question List Values --->>

  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);

  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);

  const [questionText, setQuestionText] = useState<string>("");

  const [questionOrder, setQuestionOrder] = useState<number>(0);

  const [questionDescription, setQuestionDescription] = useState<string>("");

  const answerTypes = [
    { key: "1", value: "Çoktan Seçmeli" },
    { key: "2", value: "Çoklu Seçim" },
    { key: "3", value: "Metin" },
    { key: "4", value: "Dosya Yükleme" },
  ]

  const [selectedAnswerType, setSelectedAnswerType] = useState<{ key: string, value: string }>(answerTypes[0]);

  const [questionAnswer, setQuestionAnswer] = useState<string>("");

  const [questionAnswerList, setQuestionAnswerList] = useState<string[]>([]);

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");


  const handleShowAddQuestionModal = () => {
    setSelectedQuestionId(0);
    setQuestionText("");
    setQuestionOrder(0);
    setQuestionDescription("");
    setSelectedAnswerType(answerTypes[0]);
    setQuestionAnswerList([]);
    setShowAddQuestionModal(true);
  }

  const handleAddNewQuestionAnswer = () => {
    if (!questionAnswerList.includes(questionAnswer)) {
      let _questionAnswerList = questionAnswerList;
      _questionAnswerList.push(questionAnswer);
      setQuestionAnswerList([..._questionAnswerList]);
    }
    setQuestionAnswer("");
  }

  const handleRemoveQuestionAnswer = (item) => {
    const _curryArray = questionAnswerList.filter(i => i !== item);
    setQuestionAnswerList([..._curryArray]);
    context.hideModal();
  }

  const addProCategoryQuestion = async () => {
    setProcessLoading(true);

    const _result = await ApiService.addProCategoryQuestion(Id, questionText, questionOrder ? questionOrder : 0, questionDescription, questionAnswerList, Number(selectedAnswerType.key));

    setProcessLoading(false);
    setShowAddQuestionModal(false);

    if (_result.succeeded === true) {
      setCurrentOpenedFilterButton("")
      context.showModal({
        type: "Success",
        title: "Kategoriye ait talep sorusu başarıyla oluşturuldu",
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
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const getProCategoryQuestionList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProCategoryQuestionList(Id, page, take, searchText, order,);

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




  const handleShowQuestionDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Kategori Sorusunu Sil",
      message: `${item.QuestionText} isimli sorusuyu silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.removeProCategoryQuestion(item.Id);

        context.hideModal();

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Kategoriye ait soru başarıyla silindi",
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
            onClose: () => { context.hideModal(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const getProCategoryQuestionDetail = async (questionId) => {
    setLoading(true);

    const _result = await ApiService.getProCategoryQuestionDetail(questionId);

    setLoading(false);
    setCurrentOpenedFilterButton("");

    if (_result.succeeded === true) {
      handleEditQuestion(_result.data.questionData);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }

  }
  const handleEditQuestion = (question) => {
    setQuestionText(question.QuestionText);
    setQuestionOrder(question.QuestionOrder);
    setQuestionDescription(question.QuestionDescription);
    setSelectedAnswerType(answerTypes.find(i => i.key === String(question.AnswerType)) ?? answerTypes[0]);
    {
      question.Answers !== undefined && question.Answers?.length > 0 &&
        setQuestionAnswerList(question.Answers)
    }

    setShowAddQuestionModal(true);
  }

  const updateProCategoryQuestion = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProCategoryQuestion(selectedQuestionId, Id, questionText, questionOrder, questionDescription, questionAnswerList, Number(selectedAnswerType.key));
    setProcessLoading(false);
    setShowAddQuestionModal(false);

    if (_result.succeeded === true) {

      context.showModal({
        type: "Success",
        title: "Kategori sorusu başarıyla güncellendi",
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

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddNewQuestionAnswer();
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/pro-kategori-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/pro-kategori-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Kategori Listesi
          </div>
        </Link>
        <div className="flex justify-between mb-4">
          <h2>Kategori Detayı</h2>
          {selectedTabsId === 1 &&
            <div className="flex gap-2">
              {editable === false &&
                (loading ?
                  <>
                    <Loading width="w-56" height="h-10" />
                    <Loading width="w-32" height="h-10" />
                    <Loading width="w-32" height="h-10" />
                  </>
                  :
                  <>
                    <Button buttonSm design="button-blue-400" className="px-4" text="Kategori Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setEditable(true) }} />
                    <Button buttonSm design="button-gray-100" className="px-4" text={`Kategoriyi ${categoryStatus ? "Pasife" : "Aktife"} Al`} hasIcon icon={
                      categoryStatus ?
                        <EyeOffIcon className="icon-sm mr-2" />
                        :
                        <EyeIcon className="icon-sm mr-2" />

                    } onClick={() => showChangeProCategoryStatus()} />
                    <Button buttonSm design="button-gray-100" className="px-4" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => showDeleteProCategory()} />
                  </>
                )
              }
            </div>
          }
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
        {selectedTabsId === 1 ?
          <div className="flex flex-col">
            <div className="w-1/2">
              <Label withoutDots title="Kategori Tipi" className="mt-4" />
              {loading ?
                <Loading inputSm />
                :
                <Dropdown
                  isDisabled={((selectedCategoryType.key === "1" && selectedTopCategory.key === "0") || !editable) ? true : false}
                  isDropDownOpen={currentOpenedFilterButton === "categoryType"}
                  onClick={() => { setCurrentOpenedFilterButton("categoryType"); }}
                  className="w-full text-black-700"
                  label={selectedCategoryType.value}
                  items={categoryTypes}
                  onItemSelected={item => { setSelectedCategoryType(item) }} />
              }
              {selectedCategoryType.key === "2" &&
                <>
                  <Label withoutDots title="Üst Kategori" className="mt-4" />
                  {loading ?
                    <Loading inputSm />
                    :
                    <Dropdown
                      isDisabled={!editable}
                      isDropDownOpen={currentOpenedFilterButton === "topCategory"}
                      onClick={() => { setCurrentOpenedFilterButton("topCategory"); }}
                      className="w-full text-black-700 text-sm"
                      label={selectedTopCategory.value}
                      items={topCategories}
                      onItemSelected={item => { setSelectedTopCategory(item) }} />
                  }
                </>
              }
              <Label withoutDots title="Kategori Adı" className="mt-4" />
              {loading ?
                <Loading inputSm />
                :
                <input className={`${editable === true ? "" : "bg-gray-100"} form-input`} value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} disabled={!editable} />
              }
              <Label withoutDots title="Kategori Sıralaması" className="mt-4" />
              {loading ?
                <Loading inputSm />
                :
                <input className={`${editable === true ? "" : "bg-gray-100"} form-input`} value={categoryOrder} onChange={(e) => { setCategoryOrder(parseInt(e.target.value)) }} disabled={!editable} />
              }
              <Label withoutDots isRequired title="Kategori Görseli" className="mt-4" />
              {editable &&
                <div className="mb-2">
                  <FileUploader onFileSelected={item => { setSelectedFile(item) }} oldPreview={categoryPhoto} isLoading={loading} sizeDescription={"242x194 px"} warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."} />
                </div>
              }
              {loading ?
                <Loading height="h-20" width="w-20" />
                :
                editable === false &&
                <img src={categoryPhoto} alt={categoryName} className="w-20 h-20 rounded-lg object-contain" />
              }
              <Label withoutDots title="Kategori Açıklaması" className="mt-4" />
              {loading ?
                <Loading inputMd />
                :
                <textarea
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  className={`${editable === true ? "" : "bg-gray-100"} text-sm w-full px-3 py-2 text-black-700 border rounded-lg focus:outline-none resize-none leading-5 mb-1`}
                  value={categoryDescription}
                  rows={3}
                  disabled={!editable}
                />
              }

            </div>
            {editable &&
              <div className="ml-auto">
                <Button text="Vazgeç" className={`${processLoading ? "pointer-events-none" : ""} w-24`} textTiny color="text-gray-700" onClick={() => { handleClearInput(); }} />
                <Button isLoading={processLoading} text="Değişiklikleri Kaydet" textTiny design="button-blue-400 w-80" onClick={() => { updateCategoryDetailInfo(); }} />
              </div>
            }
          </div>
          :
          <Table
            ref={tableEl}
            emptyListText={"Soru Bulunamadı"}
            getDataFunction={getProCategoryQuestionList}
            addNewButton={
              <Button buttonMd textTiny color="text-blue-400" className="mr-3 px-2 w-72 " design="button-blue-100" text="Yeni Soru Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleShowAddQuestionModal(); }} />
            }
            header={
              <div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-1 flex items-center">
                  <span className="p-sm-gray-400">
                    Soru Sıralaması
                  </span>
                </div>
                <div className="lg:col-span-4">
                  <span className="p-sm-gray-400">
                    Talep Sorusu
                  </span>
                </div>
                <div className="lg:col-span-4">
                  <span className="p-sm-gray-400">
                    Soru Açıklaması
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="p-sm-gray-400">
                    Cevap Tipi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Cevap Sayısı
                  </span>
                </div>
              </div>
            }
            renderItem={(e, i) => {
              return <div key={i}>
                <div className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"  >
                  <div className="lg:col-span-1 flex items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Soru Sıralaması: </span>
                    <p className="p-sm">
                      {e.QuestionOrder}
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Talep Sorusu: </span>
                    <p className="p-sm">
                      {e.QuestionText}
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Soru Açıklaması: </span>
                    <p className="p-sm">
                      {e.QuestionDescription}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Cevap Tipi: </span>
                    <p className="p-sm">
                      {answerTypes.find(i => i.key === String(e.AnswerType))?.value ?? ""}
                    </p>
                  </div>
                  <div className="lg:col-span-1  flex items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Cevap Sayısı: </span>
                    <p className="p-sm">
                      {e.AnswerCount ? e.AnswerCount : "-"}
                    </p>
                    <div className="text-gray-700 flex gap-2 items-center ml-auto">
                      <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                        onClick={() => { getProCategoryQuestionDetail(e.Id); setSelectedQuestionId(e.Id) }} />
                      <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleShowQuestionDeleteModal(e) }} />
                    </div>
                  </div>
                </div>
              </div>
            }}
            sortOptions={sortOptions}
          />
        }
      </div>

      <Modal
        modalType="fixedSm"
        showModal={showAddQuestionModal}
        onClose={() => { setShowAddQuestionModal(false) }}
        title={selectedQuestionId === 0 ? "Yeni Talep Sorusu Oluştur" : "Talep Sorusunu Düzenle"}
        body={
          <>
            <div className="">
              <Label isRequired withoutDots title="Talep Sorusu" className="mt-4" />
              <input className="form-input" value={questionText} onChange={(e) => { setQuestionText(e.target.value) }} />
              <Label isRequired withoutDots title="Cevap Tipi" className="mt-4" />
              <Dropdown
                isDropDownOpen={currentOpenedFilterButton === "answerType"}
                onClick={() => { setCurrentOpenedFilterButton("answerType"); }}
                className="w-full text-black-700 text-sm"
                label={selectedAnswerType.value}
                items={answerTypes}
                onItemSelected={item => { setSelectedAnswerType(item); setQuestionAnswerList([]); setQuestionAnswer(""); setSelectedAnswer("") }} />
              <Label isRequired withoutDots title="Soru Sıralaması" className="mt-4" />
              <input className="form-input" value={questionOrder} type="number" onChange={(e) => { setQuestionOrder(parseInt(e.target.value)) }} required />
              <Label withoutDots title="Soru Açıklaması" className="mt-4" />
              <textarea
                onChange={(e) => setQuestionDescription(e.target.value)}
                className="text-sm w-full px-3 py-2 text-black-700 border rounded-lg focus:outline-none resize-none leading-5"
                value={questionDescription}
                rows={3}
              />

              {(selectedAnswerType.key === "1" || selectedAnswerType.key === "2") &&
                <>
                  <Label isRequired withoutDots title="Kategori Cevapları" className="mt-4" />
                  <div className="flex">
                    <input className="form-input" value={questionAnswer} onChange={(e) => { setQuestionAnswer(e.target.value) }} onKeyDown={(e) => { _handleKeyDown(e); }} />
                    <Button buttonMd design="button-blue-400" text="Ekle" className="px-5 text-sm ml-3" onClick={() => handleAddNewQuestionAnswer()} />
                  </div>
                  {questionAnswerList.length > 0 &&
                    <div className="border-t-2 border-gray-200 mt-4">
                      <p className="p-sm-gray-700 mt-4 flex justify-between">
                        <span className="w-4/5">Belirlenen Cevaplar</span>
                        <span className=" w-1/5 text-center">İşlem</span>
                      </p>
                      {questionAnswerList.map((item, index) => (
                        <div className="flex justify-between my-4 items-center w-full p-sm " key={index}>
                          <span className="w-4/5">{item}</span>
                          <div className="w-1/5">
                            <TrashIcon className="icon-sm cursor-pointer mx-auto" onClick={() => { handleRemoveQuestionAnswer(item); }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                </>
              }

            </div>
          </>
        }
        footer={
          <>
            {selectedQuestionId === 0 ?
              <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Oluştur" onClick={() => { addProCategoryQuestion() }} />
              :
              <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Kaydet" onClick={() => { updateProCategoryQuestion() }} />
            }
          </>
        }
      />
    </div >
  )
}
