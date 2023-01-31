import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { AnswerArrow, MinusIcon, PlusIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import { useStateEffect } from "../Components/UseStateEffect";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

interface RouteParams {
  id: string
}

export const AdminUserDetail: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const currentUser = context.currentUser;

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [staticpermissionList, setStaticpermissionList] = useState([
    {
      id: 1,
      DisplayName: "Housiy Pro Yönetimi",
      Name: "ProManagement",
      Display: false,
      Childs: [
        {
          id: 101,
          DisplayName: "Kategori Yönetimi",
          Name: "ProCategoryManagement",
        },
        {
          id: 102,
          DisplayName: "Profesyonel Rozetleri",
          Name: "ProBadges",
        },
        {
          id: 103,
          DisplayName: "Hizmetler",
          Name: "ProServices",
        },
        {
          id: 104,
          DisplayName: "İptal-Red Yönetimi",
          Name: "ProCancelRejectManagement",
        },
        {
          id: 105,
          DisplayName: "Üye Yönetimi",
          Name: "ProMembershipMembership",
        },
        {
          id: 106,
          DisplayName: "Reklam",
          Name: "ProAd",
        },
      ]
    },
    {
      id: 2,
      DisplayName: "Housiy Satıcı Yönetimi",
      Name: "SellerManagement",
      Display: false,
      Childs: [
        {
          id: 201,
          DisplayName: "Kategori Yönetimi",
          Name: "SellerCategoryManagement",
        },
        {
          id: 202,
          DisplayName: "Ürün Yönetimi",
          Name: "ProductManagement",
        },
        {
          id: 203,
          DisplayName: "Kampanyalar",
          Name: "SellerCampaigns",
        },
        {
          id: 204,
          DisplayName: "Satıcı Yönetimi",
          Name: "SellerListManagement",
        },
        {
          id: 205,
          DisplayName: "Sipariş Yönetimi",
          Name: "OrderManagement",
        },
        {
          id: 206,
          DisplayName: "İptal ve İade Yönetimi",
          Name: "SellerCancelRefundManagement",
        },
        {
          id: 207,
          DisplayName: "Reklam",
          Name: "SellerAd",
        },
      ]
    },
    {
      id: 3,
      DisplayName: "Fikirler Yönetimi",
      Name: "IdeaManagement",
      Display: false,
      Childs: [
        {
          id: 301,
          DisplayName: "Kategori Yönetimi",
          Name: "IdeaCategoryManagement",
        },
        {
          id: 302,
          DisplayName: "Projeler",
          Name: "ProjectsManagement",
        },
        {
          id: 303,
          DisplayName: "Fikir Listesi",
          Name: "IdeaList",
        },
        {
          id: 304,
          DisplayName: "Fikir Öne Çıkart",
          Name: "HighlightIdea",
        },
        {
          id: 305,
          DisplayName: "Fikir Soru & Cevapları",
          Name: "IdeaQuestions",
        },
      ]
    },
    {
      id: 4,
      DisplayName: "Site Genel Yönetimi",
      Name: "SiteManagement",
      Display: false,
      Childs: [
        {
          id: 401,
          DisplayName: "Slider Yönetimi",
          Name: "SliderManagement",
        },
        {
          id: 402,
          DisplayName: "Öne Çıkan Yönetimi",
          Name: "HighlightManagement",
        },
        {
          id: 403,
          DisplayName: "Reklam",
          Name: "AdManagement",
        },
        {
          id: 404,
          DisplayName: "İptal-İade Yönetimi",
          Name: "CancelRefundManagement",
        },
        {
          id: 405,
          DisplayName: "Ceza-Hizmet Kesintileri",
          Name: "PenaltyServiveDeduction",
        },
        {
          id: 406,
          DisplayName: "Blog Yönetimi",
          Name: "BlogManagement",
        },
        {
          id: 407,
          DisplayName: "Akademi Yönetimi",
          Name: "AcademyManagement",
        },
        {
          id: 408,
          DisplayName: "XML Yönetimi",
          Name: "XMLManagement",
        },
        {
          id: 409,
          DisplayName: "SEO Yönetimi",
          Name: "SEOManagement",
        },
        {
          id: 410,
          DisplayName: "Yardım Yönetimi",
          Name: "HelpManagement",
        },
        {
          id: 411,
          DisplayName: "Pro-Seller Login Yönetimi",
          Name: "ProSellerLoginManagement",
        },
        {
          id: 412,
          DisplayName: "Sözleşme Yönetimi",
          Name: "AgreementManagement",
        },
        {
          id: 413,
          DisplayName: "S.S.S. Yönetimi",
          Name: "FAQManagement",
        },
        {
          id: 414,
          DisplayName: "Destek Talepleri",
          Name: "HelpRequest",
        },
        {
          id: 415,
          DisplayName: "İndirim Kuponları",
          Name: "DiscountCoupons",
        },
        {
          id: 416,
          DisplayName: "Bildirim Yönetimi",
          Name: "NotificationManagement",
        },
        {
          id: 417,
          DisplayName: "Duyuru Yönetimi",
          Name: "AnnouncementManagement",
        },
        {
          id: 418,
          DisplayName: "Sosyal Medya Yönetimi",
          Name: "SocialMediaManagement",
        },
        {
          id: 419,
          DisplayName: "Kargo İşlemleri",
          Name: "CargoManagement",
        },
      ]
    },
    {
      id: 5,
      DisplayName: "Üye Yönetimi",
      Name: "UserManagement",
      Display: false,
      Childs: [
        {
          id: 501,
          DisplayName: "Üye Listesi",
          Name: "UserMembershipList",
        }
      ]
    },
    {
      id: 6,
      DisplayName: "Finans Yönetimi",
      Name: "FinanceManagement",
      Display: false,
      Childs: [
        {
          id: 601,
          DisplayName: "Satıcı Tahsilatları",
          Name: "SellerCollections",
        },
        {
          id: 602,
          DisplayName: "Satıcı Ödemeleri",
          Name: "SellerPayments",
        },
        {
          id: 603,
          DisplayName: "Profesyonel Tahsilatları",
          Name: "ProCollections",
        },
        {
          id: 604,
          DisplayName: "Profesyonel Ödemeleri",
          Name: "ProPayments",
        },
        {
          id: 605,
          DisplayName: "Reklam Ödemeleri",
          Name: "AdPayments",
        },
      ]
    },
    {
      id: 7,
      DisplayName: "Ayarlar",
      Name: "SettingsManagement",
      Display: false,
      Childs: [
        {
          id: 701,
          DisplayName: "Admin Kullanıcıları",
          Name: "AdminUsers",
          Display: false,
        },
        {
          id: 702,
          DisplayName: "Kargo İşlemleri",
          Name: "CargoOperations",
          Display: false,
        },
      ]
    },
  ]);

  const [Id, setId] = useState<number>(Number(params.id));

  const [isSuper, setIsSuper] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  const [email, setEmail] = useState<string>("");

  const [permissionList, setPermissionList] = useState<string[]>([""]);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedModuleId, setSelectedModuleId] = useState<number>(0);

  const userTypeOptions = [
    { key: "1", value: "Admin" },
  ]

  const [selectedUserType, setSelectedUserType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz" });

  const setUserPermissionFunc = (permissionName, isParent) => {
    if (isParent === true) {
      const selectedModule = staticpermissionList.filter(i => i.Name === permissionName)[0];
      let _selectedModuleChildNames: string[] = []

      selectedModule?.Childs.map((item) => (
        _selectedModuleChildNames.push(item.Name)
      ))

      if (selectedModule.Display === false) {
        let _tempArray: string[] = []
        _selectedModuleChildNames.forEach((item) => {
          if (!permissionList.includes(item)) {
            _tempArray.push(item);
          }
        })
        setPermissionList([...permissionList, ..._tempArray]);
      }
      else {
        const filteredArray = permissionList?.filter(o1 => !_selectedModuleChildNames?.some(o2 => o1 === o2));
        setPermissionList(filteredArray);
      }
    }
    else {
      if (permissionList.includes(permissionName)) {
        setPermissionList(permissionList.filter(item => item !== permissionName));
      }
      else {
        setPermissionList([...permissionList, permissionName]);
      }
    }
  }

  useEffect(() => {
    getAdminInfo();
  }, []);

  const getAdminInfo = async () => {
    setProcessLoading(true);
    setLoading(true);

    const _result = await ApiService.adminDetail(Id);

    if (_result.succeeded === true) {
      setUserName(_result.data.UserName);
      setEmail(_result.data.Email);
      setIsSuper(_result.data.IsSuperAdmin);
      setPermissionList(_result.data.PermissionList);
      setSelectedUserType(userTypeOptions.find(i => i.key === String(_result.data.UserType)) ?? { key: "0", value: "Seçiniz" });
      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push(`/admin-kullanicilari`) }
      });
    }
  }

  const handleUpdateAdminInfo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateAdmin(Id, userName, email, password, permissionList, isSuper, Number(selectedUserType.key));

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Başarılı",
        message: `Bilgiler başarıyla güncellendi`,
        onClose: async () => {
          if (Number(params.id) === currentUser?.Id) {
            const _me = await ApiService.Me();
            context.setCurrentUser(_me.data);
            history.push('/admin-kullanicilari');
          }
          context.hideModal();
        },
      })
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  useStateEffect(() => {
    let _count = 0;
    let _checkCount = 0;
    staticpermissionList.map((item) => {

      item.Childs.map(m => {
        _count += 1;
        if (permissionList.includes(m.Name)) {
          _checkCount += 1;
        }
      })
      if (_count === _checkCount) {
        item.Display = true;
      }
      else {
        item.Display = false;
      }
      _count = 0;
      _checkCount = 0;
    });

    setStaticpermissionList([...staticpermissionList])

  }, [permissionList])

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          <>Kullanıcı Düzenle</>
        </h2>
        <div className="mt-6 border-b border-gray-200"></div>
        <div className="grid grid-cols-2">
          <div className="lg:col-span-1">
            <Label className="mt-6" title="Kullanıcı Adı" withoutDots isRequired />
            {loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" placeholder="Kullanıcı Adı" value={userName} onChange={(e) => (setUserName(e.target.value))} />
            }
            <Label className="mt-6" title="E-posta Adresi" withoutDots isRequired />
            {loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" placeholder="E-posta Adresi" value={email} onChange={(e) => (setEmail(e.target.value))} />
            }
            <Label className="mt-6" title="Şifre" withoutDots isRequired />
            {loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="password" placeholder="Şifre" value={password} onChange={(e) => (setPassword(e.target.value))} />
            }
            <Label className="mt-6" title="Kullanıcı Rolü" withoutDots />
            {loading ?
              <Loading inputSm />
              :
              <Dropdown
                isDropDownOpen={currentOpenedFilterButton === "sort"}
                onClick={() => { setCurrentOpenedFilterButton("sort"); }}
                className="w-full border-gray-300 text-gray-700 mb-2 lg:mb-0"
                label={selectedUserType.value}
                icon
                items={userTypeOptions}
                onItemSelected={item => { setSelectedUserType(item) }} />
            }
            <Label className="mt-6" title="Süper Kullanıcı" withoutDots isRequired />
            {
              loading ?
                <Loading textMd />
                :
                <div className="flex">
                  <h5 className="text-gray-900 text-md">Süper Kullanıcı</h5>
                  <div className="ml-auto">
                    <ToggleButton onClick={() => { setIsSuper(!isSuper) }} defaultValue={isSuper} />
                  </div>
                </div>
            }
            {isSuper === false &&
              <>
                <Label className="mt-6" title="Kullanıcı İzinleri" withoutDots isRequired />
                {loading ?
                  <>
                    <Loading textMd />
                    <Loading textMd />
                  </>
                  :
                  staticpermissionList.map((item, index) => (
                    <div key={"keyForGeneralDiv" + index.toString()}>
                      <div className="flex mt-4 items-center cursor-pointer">
                        {(item.Childs.length > 0 && selectedModuleId !== item.id) ?
                          <PlusIcon className="icon-sm text-gray-900 mr-2" onClick={() => { setSelectedModuleId(item.id) }} />
                          : selectedModuleId === item.id &&
                          <MinusIcon className="icon-sm text-gray-900 mr-2" onClick={() => { setSelectedModuleId(0) }} />
                        }
                        <div className="w-full">
                          <div className="flex items-center w-full">
                            <div className="text-gray-900 text-md text-tiny">{item.DisplayName}</div>
                            <div className="ml-auto">
                              <ToggleButton key={"key_" + index} onClick={() => { setUserPermissionFunc(item.Name, true); }} defaultValue={item.Display} />
                            </div>
                          </div>
                        </div>
                      </div>
                      {selectedModuleId === item.id &&
                        <div className="flex items-start mt-4 ml-12">
                          <AnswerArrow className="w-6 h-6 text-gray-700 mr-4 " />
                          <div className="w-full">
                            {item.Childs.map((item2) => (
                              <div className="flex items-center mb-2">
                                <div className="text-gray-900 text-md text-tiny">{item2.DisplayName}</div>
                                <div className="ml-auto">
                                  <ToggleButton key={"key_1" + index} onClick={() => { setUserPermissionFunc(item2.Name, false); }} defaultValue={permissionList.includes(item2.Name)} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      }
                    </div>
                  ))
                }
              </>
            }
          </div>
        </div>
        <div className="w-full flex">
          <Button isLoading={processLoading} textTiny className="w-72 ml-auto" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { handleUpdateAdminInfo(); }} />
        </div>
      </div>
    </div>
  )
}
