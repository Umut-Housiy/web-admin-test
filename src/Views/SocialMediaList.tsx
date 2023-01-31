import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Button } from "../Components/Button";
import { EditIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { Modal } from "../Components/Modal";
import { SocialMediaAccountModel, GeneralContentDataType } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const SocialMediaList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [laoding, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [socialList, setSocialList] = useState<SocialMediaAccountModel[]>([]);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [modalType, setModalType] = useState<number>(0);

  const [modalLink, setModalLink] = useState<string>("");

  useEffect(() => {
    getSocialMediaAccountList();
  }, []);

  const getSocialMediaAccountList = async () => {
    setLoading(true);

    const _result = await ApiService.getSocialMediaAccountList();

    if (_result.succeeded === true) {
      setSocialList(_result.data);
      setLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); }
      });
    }
  }

  const updateSocialMediaAccount = async () => {
    setShowEditModal(false);
    setProcessLoading(true);

    const _result = await ApiService.updateSocialMediaAccount(modalType, modalLink);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler Kaydedildi.",
        onClose: () => { context.hideModal(); getSocialMediaAccountList(); }
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

  const handleOpenEditModal = (item) => {
    setModalType(item.Type);
    setModalLink(item.Title);
    setShowEditModal(true);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4">Sosyal Medya Hesapları</h2>
        <div className=" lg:grid-cols-2 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Hesap
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Link
            </span>
          </div>
        </div>
        {
          laoding ?
            <>
              <Loading width="w-full" height="h-16" />
              <Loading width="w-full" height="h-16" />
              <Loading width="w-full" height="h-16" />
              <Loading width="w-full" height="h-16" />
              <Loading width="w-full" height="h-16" />
            </>
            :
            socialList.map((e, i) => (
              <div key={"list" + i} className=" lg:grid-cols-2 px-2 border-b py-6 border-gray-200 hidden lg:grid flex gap-4 items-center">
                <div className="lg:col-span-1">
                  <p className="p-sm">
                    {e.Type === GeneralContentDataType.FACEBOOK ? "Facebook" : e.Type === GeneralContentDataType.INSTAGRAM ? "İnstagram" : e.Type === GeneralContentDataType.TWITTER ? "Twitter" : e.Type === GeneralContentDataType.YOUTUBE ? "Youtube" : e.Type === GeneralContentDataType.LINKEDIN ? "Linkedin" : "-"}
                  </p>
                </div>
                <div className="lg:col-span-1 flex justify-between">
                  <p className="p-sm">
                    {e.Title}
                  </p>
                  <div className="text-gray-700 flex gap-2 items-center">
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenEditModal(e); }} />
                  </div>
                </div>
              </div>
            ))
        }
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showEditModal}
        onClose={() => { setShowEditModal(false); }}
        title="Hesap Düzenle"
        body={
          <>
            <div>
              <Label withoutDots title="Hesap" className="mt-4" />
              <input className="form-input pointer-events-none bg-gray-100" value={modalType === GeneralContentDataType.FACEBOOK ? "Facebook" : modalType === GeneralContentDataType.INSTAGRAM ? "İnstagram" : modalType === GeneralContentDataType.TWITTER ? "Twitter" : modalType === GeneralContentDataType.YOUTUBE ? "Youtube" : modalType === GeneralContentDataType.LINKEDIN ? "Linkedin" : "-"} />
              <Label withoutDots title="Link" className="mt-4" />
              <input className="form-input" value={modalLink} onChange={(e) => { setModalLink(e.target.value); }} />
            </div>
          </>
        }
        footer={
          <Button isLoading={processLoading} textTiny design="button-blue-400" className="w-full my-4" text="Kaydet" color="text-white" onClick={() => { updateSocialMediaAccount(); }} />
        }
      />
    </div>
  )
}
