import { FunctionComponent, useContext, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"
import { Button } from "../../Components/Button";
import { ChevronRightIcon, EditIcon, ProhibitIcon, TrashIcon } from "../../Components/Icons";
import { TabsTitle } from "../../Components/TabsTitle";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { CartProducts } from "./CartProducts";
import { DiscountCoupons } from "./DiscountCoupons";
import { Orders } from "./Orders";
import { PersonalInfo } from "./PersonelInfo";
import { ProductEvaluations } from "./ProductEvaluations";
import { ProductQuestions } from "./ProductQuestions";
import { ProfessionalEvaluations } from "./ProfessionalEvaluations";
import { RegisteredAdresses } from "./RegisteredAdresses";
import { Services } from "./Services";

interface RouteParams {
  id: string
}

interface LocationParams {
  prevTitle: string,
  prevPath: string,
  tabId: number,
  queryPage: number,
}

export const SiteUserDetailMain: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const location = useLocation<LocationParams>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [tabsLink, setTabsLink] = useState<{ id: number, name: string }[]>([
    { id: 1, name: "Kişisel Bilgileri" },
    { id: 2, name: "Kayıtlı Adresler" },
    { id: 3, name: "Sepetindeki Ürünler" },
    { id: 4, name: "Siparişler" },
    { id: 5, name: "Hizmetler" },
    { id: 6, name: "Ürün Değerlendirmeleri" },
    { id: 7, name: "Profesyonel Değerlendirmeleri" },
    { id: 8, name: "Ürün Soruları" },
    { id: 9, name: "İndirim Kuponları" },
  ]);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(location.state?.tabId ?? 1);

  const [isEditActive, setIsEditActive] = useState<boolean>(false);

  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const blockUser = () => {
    context.showModal({
      type: "Question",
      title: "Engelle",
      message: "Üye engellenecek. Emin misiniz?",
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.blockUser(Number(params.id ?? "0"));

        setProcessLoading(false);
        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Üye engellendi",
            onClose: () => {
              context.hideModal();
              setIsBlocked(true);
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


  const unBlockUser = () => {
    context.showModal({
      type: "Question",
      title: "Engeli Kaldır",
      message: "Üyenin engeli kaldırılacak. Emin misiniz?",
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.unBlockUser(Number(params.id ?? "0"));

        setProcessLoading(false);
        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Üye engeli kaldırıldı",
            onClose: () => {
              context.hideModal();
              setIsBlocked(false);
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

  const deleteUser = () => {
    context.showModal({
      type: "Question",
      title: "Sil",
      message: "Üyenin silinecek. Emin misiniz?",
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.deleteUser(Number(params.id ?? "0"));

        setProcessLoading(false);
        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Üye silindi",
            onClose: () => {
              context.hideModal();
              history.push("/uye-listesi");
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={location.state?.prevPath !== undefined ? (location.state?.queryPage !== 1 ? (location.state?.prevPath + "?sayfa=" + location.state?.queryPage) : location.state?.prevPath) : ("/uye-listesi")} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            {location.state?.prevTitle ?? "Üye Listesi"}
          </div>
        </Link>
        <div className="flex mb-5">
          <h2>Üye Detayı</h2>
          {
            !isEditActive &&
            <>
              <Button isLoading={processLoading} textTiny className="w-60 ml-auto" buttonSm design="button-blue-400" text="Üye Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setSelectedTabsId(1); setIsEditActive(true); }} />
              {
                isBlocked ?
                  <Button isLoading={processLoading} textTiny className="ml-2 w-48" buttonSm design="button-gray-100" text={"Engeli Kaldır"} hasIcon icon={<ProhibitIcon className="icon-sm mr-2" />} onClick={() => { unBlockUser(); }} />
                  :
                  <Button isLoading={processLoading} textTiny className="ml-2 w-48" buttonSm design="button-gray-100" text={"Üyeyi Engelle"} hasIcon icon={<ProhibitIcon className="icon-sm mr-2" />} onClick={() => { blockUser(); }} />
              }
              <Button isLoading={processLoading} textTiny className="w-32 ml-2" buttonSm design="button-gray-100" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => { deleteUser(); }} />
            </>
          }
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {
          selectedTabsId === 1 ?
            <>
              <PersonalInfo UserId={Number(params.id ?? "0")} IsEditActive={isEditActive} setIsEditActive={setIsEditActive} isBlocked={isBlocked} setIsBlocked={setIsBlocked} />
            </>
            :
            selectedTabsId === 2 ?
              <>
                <RegisteredAdresses UserId={Number(params.id ?? "0")} />
              </>
              :
              selectedTabsId === 3 ?
                <>
                  <CartProducts UserId={Number(params.id ?? "0")} />
                </>
                :
                selectedTabsId === 4 ?
                  <>
                    <Orders UserId={Number(params.id ?? "0")} />
                  </>
                  :
                  selectedTabsId === 5 ?
                    <>
                      <Services UserId={Number(params.id ?? "0")} />
                    </>
                    :
                    selectedTabsId === 6 ?
                      <>
                        <ProductEvaluations UserId={Number(params.id ?? "0")} />
                      </>
                      :
                      selectedTabsId === 7 ?
                        <>
                          <ProfessionalEvaluations UserId={Number(params.id ?? "0")} />
                        </>
                        :
                        selectedTabsId === 8 ?
                          <>
                            <ProductQuestions UserId={Number(params.id ?? "0")} />
                          </>
                          :
                          selectedTabsId === 9 ?
                            <>
                              <DiscountCoupons UserId={Number(params.id ?? "0")} />
                            </>
                            :
                            <></>
        }
      </div>
    </div>
  )
}
