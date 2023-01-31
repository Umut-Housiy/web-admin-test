import * as Constants from "./Constants";
import secureStorage from "./SecureStorage";
import * as Models from "../Models";
import { ResponseModel } from "../Models";
import { NotificationObject } from "./SharedContext";

export class ApiService {
  currentDateStampForPost = (dateMilisec: number) => {
    if (dateMilisec > 0) {
      const currentDate = new Date();

      const minuteMilisec = 60000; // 60 * 1000

      const currentDateStamp =
        dateMilisec - currentDate.getTimezoneOffset() * minuteMilisec;

      return currentDateStamp;
    } else {
      return 0;
    }
  };

  private async baseFetch(url, body): Promise<any> {
    const Token = secureStorage.getItem("AccessToken");
    const headers = new Headers();

    if (Token) {
      headers.append("token", Token);
    }

    try {
      let _body;

      if (body instanceof FormData) {
        _body = body;
      } else {
        _body = JSON.stringify(body);
      }

      const response = await fetch(url, {headers: headers, method: "POST", body: _body}).then(r => r.json());

      if (!response.succeeded && response.message === "Unauthorised Access") {
        secureStorage.removeItem('AccessToken');
        secureStorage.removeItem('IsLogin');
        secureStorage.removeItem('CurrentUser');
        window.location.href = "/giris-yap";
      }
      return response;
    } catch (error) {
      console.info(error);
      return {succeeded: false, message: "Bağlantınızda bir problem oluştu. Lütfen tekrar deneyiniz", data: null}
    }
  }

  // #region Notification
  async getNotifications(): Promise<
    Models.ResponseModel<{ badge: number; notifications: NotificationObject[] }>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-notifications`,
      {}
    );
  }

  async getBadges(): Promise<Models.ResponseModel<Models.BadgeModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-admin-badges`,
      {}
    );
  }

  async markAsReadNotification(
    NotificationId: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/mark-as-read-notification`,
      { NotificationId }
    );
  }

  async markAllAsReadNotification(): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/mark-all-as-read-notification`,
      {}
    );
  }

  async removeAllNotification(): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-all-notification`,
      {}
    );
  }

  // #endregion Notification

  //#region General-Json-Fetch
  async getBankList(): Promise<Models.GeneralBankModel[]> {
    const response = await fetch(
      "https://raw.githubusercontent.com/pryazilim/lib/master/data/banks.json",
      { method: "GET" }
    );
    return response.json();
  }

  async getCountryList(): Promise<Models.GeneralLocationModel[]> {
    const response = await fetch(
      "https://raw.githubusercontent.com/pryazilim/lib/master/data/location/countries.json",
      { method: "GET" }
    );
    const json = await response.json();
    let rawData = json.sort((a, b) => {
      return a.name.localeCompare(b.name, "tr", { sensitivity: "base" });
    });
    return rawData;
  }

  async getCityList(CountryId: string): Promise<Models.GeneralLocationModel[]> {
    const response = await fetch(
      `https://raw.githubusercontent.com/pryazilim/lib/master/data/location/cities-${CountryId}.json`,
      { method: "GET" }
    );
    const json = await response.json();
    let rawData = json.sort((a, b) => {
      return a.name.localeCompare(b.name, "tr", { sensitivity: "base" });
    });
    return rawData;
  }

  async getDistrictList(
    CityId: string
  ): Promise<Models.GeneralLocationModel[]> {
    const response = await fetch(
      `https://raw.githubusercontent.com/pryazilim/lib/master/data/location/districts-${CityId}.json`,
      { method: "GET" }
    );
    const json = await response.json();
    let rawData = json.sort((a, b) => {
      return a.name.localeCompare(b.name, "tr", { sensitivity: "base" });
    });
    return rawData;
  }
  //#endregion

  async loginUser(
    userName: string,
    password: string
  ): Promise<Models.ResponseModel<{ Token: string }>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/login`,
      { userName, password }
    );
  }

  async Me(): Promise<Models.ResponseModel<any>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/me`,
      {}
    );
  }

  //#region <<-- SELLER CATEGORY --- START--- >>

  //seller-category-group
  async createSellerCategoryGroup(
    Name: string,
    Order: number,
    Description: string,
    IsEnabled: boolean,
    Photo: File
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Name", Name);
    formData.append("Order", JSON.stringify(Order));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("Photo", Photo);
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-seller-category-group`,
      formData
    );
  }

  async getSellerCategoryGroupList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCategoryGroupListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-group-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async removeSellerCategoryGroup(
    Id: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-seller-category-group`,
      { Id }
    );
  }

  async getSellerCategoryGroupDetail(
    GroupId: number
  ): Promise<
    Models.ResponseModel<{
      groupData: Models.SellerCategoryGroupListInnerModel;
    }>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-group-detail`,
      { GroupId }
    );
  }

  async updateSellerCategoryGroupDetail(
    Id: number,
    Name: string,
    Order: number,
    Description: string,
    IsEnabled: boolean,
    Photo: File
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Id", JSON.stringify(Id));
    formData.append("Name", Name);
    formData.append("Order", JSON.stringify(Order));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("Photo", Photo);
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-seller-category-group`,
      formData
    );
  }

  async changeSellerCategoryGroupStatus(
    Id: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/change-seller-category-group-status`,
      { Id, IsEnabled }
    );
  }

  //seller-category-element
  async createSellerCategoryElement(
    FeatureName: string,
    DataType: number,
    Alias: string,
    Options?: string[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-seller-category-element`,
      { FeatureName, DataType, Options, Alias }
    );
  }

  async getSellerCategoryElementList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCategoryElementListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-element-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async removeSellerCategoryElement(
    Id: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-seller-category-element`,
      { Id }
    );
  }

  async updateSellerCategoryElement(
    Id: number,
    FeatureName: string,
    Alias: string,
    Options?: string[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-seller-category-element`,
      { Id, FeatureName, Options, Alias }
    );
  }

  //seller-category-variation
  async getSellerCategoryVariationList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCategoryVariationListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-variation-list`,
      { Page, Take, searchText, OrderBy }
    );
  }
  async createSellerCategoryVariation(
    FeatureName: string,
    DataType: number,
    Alias: string,
    Options?: string[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-seller-category-variation`,
      { FeatureName, DataType, Alias, Options }
    );
  }
  async updateSellerCategoryVariation(
    Id: number,
    FeatureName: string,
    Alias: string,
    Options?: string[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-seller-category-variation`,
      { Id, FeatureName, Alias, Options }
    );
  }

  async removeSellerCategoryVariation(
    Id: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-seller-category-variation`,
      { Id }
    );
  }

  //seller-category
  async createSellerCategory(
    Name: string,
    Order: number,
    Description: string,
    IsEnabled: boolean,
    Photo: File | undefined,
    ParentCategory: number,
    IsParent: boolean,
    GroupId: number,
    CommissionPercentage: number,
    Elements: Models.SellerCategorySelectedElementList[],
    Variations: Models.SellerCategorySelectedVariationList[]
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Name", Name);
    formData.append("Order", JSON.stringify(Order));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("Photo", Photo || "");
    formData.append("ParentCategory", JSON.stringify(ParentCategory));
    formData.append("IsParent", JSON.stringify(IsParent));
    formData.append("GroupId", JSON.stringify(GroupId));
    formData.append("CommissionPercentage", JSON.stringify(CommissionPercentage));
    formData.append("Elements", JSON.stringify(Elements));
    formData.append("Variations", JSON.stringify(Variations));

    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-seller-category`,
      formData
    );
  }

  async getSellerCategoryDetail(
    CategoryId: number
  ): Promise<
    Models.ResponseModel<{ categoryData: Models.SellerCategoryDetailModel }>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-detail`,
      { CategoryId }
    );
  }

  async updateSellerCategory(
    Id: number,
    Name: string,
    Order: number,
    Description: string,
    IsEnabled: boolean,
    Photo: File | undefined,
    ParentCategory: number,
    IsParent: boolean,
    GroupId: number,
    CommissionPercentage: number,
    Elements: Models.SellerCategorySelectedElementList[],
    Variations: Models.SellerCategorySelectedVariationList[]
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Id", JSON.stringify(Id));
    formData.append("Name", Name);
    formData.append("Order", JSON.stringify(Order));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("Photo", Photo || "");
    formData.append("ParentCategory", JSON.stringify(ParentCategory));
    formData.append("IsParent", JSON.stringify(IsParent));
    formData.append("GroupId", JSON.stringify(GroupId));
    formData.append("CommissionPercentage", JSON.stringify(CommissionPercentage));
    formData.append("Elements", JSON.stringify(Elements));
    formData.append("Variations", JSON.stringify(Variations));

    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-seller-category`,
      formData
    );
  }

  async getSellerCategoryList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCategoryListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async removeSellerCategory(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-seller-category`,
      { Id }
    );
  }

  async changeSellerCategoryStatus(
    Id: number,
    IsEnabled
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/change-seller-category-status`,
      { Id, IsEnabled }
    );
  }

  //seller-category-request
  async getSellerCategoryRequestList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCategoryRequestListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-request-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async changeSellerCategoryRequestStatus(
    Id: number,
    Status: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/change-seller-category-request-status`,
      {Id, Status}
    );
  }

  //#endregion <<-- SELLER CATEGORY --- END--- >>

  //#region SELLER COMMISSION DISCOUNT

  async createSellerCommissionDiscount(
    SellerId: number,
    CommissionDiscountName: string,
    CommissionDiscountDescription: string,
    StartDate: string, EndDate: string,
    Categories: { SellerCategoryId: number; CommissionDiscount: number; StartDate: string; EndDate: string; FinishPrice: number | null; FinishItemQuantity: number | null; }[],
  ): Promise<ResponseModel<never>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/create-seller-category-commission`,
      {SellerId, CommissionDiscountName, CommissionDiscountDescription, StartDate, EndDate, Categories,}
    );
  }

  async updateSellerCommissionDiscount(
    Id: number,
    SellerId: number,
    CommissionDiscountName: string,
    CommissionDiscountDescription: string,
    StartDate: string, EndDate: string,
    Categories: { Id: number | null; SellerCategoryId: number; CommissionDiscount: number; StartDate: string; EndDate: string; FinishPrice: number | null; FinishItemQuantity: number | null; }[],
  ): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/update-seller-category-commission`,
      {Id, SellerId, CommissionDiscountName, CommissionDiscountDescription, StartDate, EndDate, Categories,}
    );
  }

  async getListSellerCommissionDiscount(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
  ): Promise<Models.ResponseModel<{ Data: Models.SellerCommissionDiscount[]; TotalCount: number }>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-seller-category-commissionlist`,
      {Page, Take, searchText, OrderBy,}
    );
  }

  async getByIdSellerCommissionDiscount(Id: number): Promise<Models.ResponseModel<Models.SellerCommissionDiscount>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-seller-category-commission-byid`,
      {Id,}
    );
  }

  async deleteSellerCommission(Id: number): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/delete-seller-category-commission`,
      {Id,}
    );
  }

  async deleteSellerCommissionDiscount(Id: number): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/delete-seller-category-commission-discount`,
      {Id,}
    );
  }

  //#endregion SELLER CATEGORY

  //<<-- PRO CATEGORY MODULE ---START--- >>

  async getProCategoryList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsOnlyParents?: boolean
  ): Promise<Models.ResponseModel<Models.ProCategoryListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/pro-category-list`,
      { Page, Take, searchText, OrderBy, IsOnlyParents }
    );
  }

  async getProServiceCategoryList(
    ParentCategory: number
  ): Promise<Models.ResponseModel<Models.ProServiceGeneralListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/pro-service-category-list`,
      { ParentCategory }
    );
  }

  async removeProCategory(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-pro-category`,
      { Id }
    );
  }

  async createProCategory(
    IsParent: boolean,
    Name: string,
    Order: number,
    Description: string,
    Photo: File,
    IsEnabled: boolean,
    ParentCategory: number
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("IsParent", JSON.stringify(IsParent));
    formData.append("Name", Name);
    formData.append("Order", JSON.stringify(Order));
    formData.append("Description", Description);
    formData.append("Photo", Photo);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("ParentCategory", JSON.stringify(ParentCategory));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-pro-category`,
      formData
    );
  }

  async getProCategoryDetail(
    CategoryId: number
  ): Promise<
    Models.ResponseModel<{ categoryData: Models.ProCategoryDetailModel }>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/pro-category-detail`,
      { CategoryId }
    );
  }

  async updateProCategoryDetail(
    Id: number,
    Name: string,
    Order: number,
    Description: string,
    IsEnabled: boolean,
    IsParent: boolean,
    Photo: File,
    ParentCategory?: number
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Id", JSON.stringify(Id));
    formData.append("Name", Name);
    formData.append("Order", JSON.stringify(Order));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("IsParent", JSON.stringify(IsParent));
    formData.append("ParentCategory", JSON.stringify(ParentCategory));
    formData.append("Photo", Photo);
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-pro-category`,
      formData
    );
  }

  async changeProCategoryStatus(
    Id: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/change-pro-category-status`,
      { Id, IsEnabled }
    );
  }

  async getProCategoryQuestionList(
    CategoryId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProQuestionListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/pro-category-question-list`,
      { CategoryId, Page, Take, searchText, OrderBy }
    );
  }

  async removeProCategoryQuestion(
    Id: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-pro-category-question`,
      { Id }
    );
  }

  async addProCategoryQuestion(
    CategoryId: number,
    QuestionText: string,
    QuestionOrder: number,
    QuestionDescription: string,
    Answers?: string[],
    AnswerType?: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-pro-category-question`,
      {
        CategoryId,
        QuestionText,
        QuestionOrder,
        QuestionDescription,
        Answers,
        AnswerType,
      }
    );
  }

  async getProCategoryQuestionDetail(
    QuestionId: number
  ): Promise<
    Models.ResponseModel<{ questionData: Models.ProQuestionListInnerModel }>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/pro-category-detail-question`,
      { QuestionId }
    );
  }

  async updateProCategoryQuestion(
    Id: number,
    CategoryId: number,
    QuestionText: string,
    QuestionOrder: number,
    QuestionDescription: string,
    Answers: string[],
    AnswerType: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-pro-category-question`,
      {
        Id,
        CategoryId,
        QuestionText,
        QuestionOrder,
        QuestionDescription,
        Answers,
        AnswerType,
      }
    );
  }

  //<<-- PRO CATEGORY MODULE ---END--- >>

  //<<-- IDEA CATEGORY MODULE ---START--- >>

  async getIdeaCategoryFeatureList(
    Page: number,
    Take: number,
    dataType: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.IdeaCategoryElementListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/idea-category-element-list`,
      { Page, Take, dataType, searchText, OrderBy }
    );
  }

  async getIdeaCategoryFeatureDetail(
    ElementId: number
  ): Promise<Models.ResponseModel<Models.IdeaCategoryElementInnerModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/idea-category-element-detail`,
      { ElementId }
    );
  }

  async getIdeaCategoryElementForProject(
    CategoryId: number
  ): Promise<Models.ResponseModel<Models.ProjectVariationModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/idea-category-elements-for-project`,
      { CategoryId }
    );
  }

  async createIdeaCategoryFeature(
    FeatureName: string,
    DataType: number,
    Options: string[],
    Alias: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-idea-category-element`,
      { FeatureName, DataType, Options, Alias }
    );
  }

  async updateIdeaCategoryFeature(
    Id: number,
    FeatureName: string,
    Options: string[],
    Alias: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-idea-category-element`,
      { Id, FeatureName, Options, Alias }
    );
  }

  async deleteIdeaCategoryFeature(
    Id: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-idea-category-element`,
      { Id }
    );
  }

  async getIdeaCategoryList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsEnabled?: number
  ): Promise<Models.ResponseModel<Models.IdeaCategoryListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/idea-category-list`,
      { Page, Take, searchText, OrderBy, IsEnabled }
    );
  }

  async deleteIdeaCategory(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-idea-category`,
      { Id }
    );
  }

  async createIdeaCategory(
    Name: string,
    Order: number,
    Description: string,
    IsEnabled: boolean,
    Elements: number[],
    Photo: File
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Name", Name);
    formData.append("Order", JSON.stringify(Order));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("Elements", JSON.stringify(Elements));
    formData.append("Photo", Photo);
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-idea-category`,
      formData
    );
  }

  async getIdeaCategoryDetail(
    CategoryId: number
  ): Promise<
    Models.ResponseModel<{ categoryData: Models.IdeaCategoryInnerModel }>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/idea-category-detail`,
      { CategoryId }
    );
  }

  async updateIdeaCategory(
    Id: number,
    Name: string,
    Order: number,
    Description: string,
    IsEnabled: boolean,
    Elements: number[],
    Photo: File
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Id", JSON.stringify(Id));
    formData.append("Name", Name);
    formData.append("Order", JSON.stringify(Order));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("Elements", JSON.stringify(Elements));
    formData.append("Photo", Photo);
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-idea-category`,
      formData
    );
  }

  async changeIdeaCategoryStatus(
    Id: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/change-idea-category-status`,
      { Id, IsEnabled }
    );
  }

  //<<-- IDEA CATEGORY MODULE ---END--- >>

  //<<-- SELLER LISTS MODULE ---START--- >>

  async getSellerApplicationList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    Status: number,
    CompanyType: number,
    RecourseMinDateJSTime: number,
    RecourseMaxDateJSTime: number
  ): Promise<Models.ResponseModel<Models.SellerListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/seller-recourse-list`,
      {
        Page,
        Take,
        searchText,
        OrderBy,
        Status,
        CompanyType,
        RecourseMinDateJSTime: this.currentDateStampForPost(
          RecourseMinDateJSTime
        ),
        RecourseMaxDateJSTime: this.currentDateStampForPost(
          RecourseMaxDateJSTime
        ),
      }
    );
  }

  async getSellerRejectedList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/rejected-seller-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerApprovedList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/approved-seller-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerCertificateList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/seller-list-for-waiting-document`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerDetail(
    TargetSellerId: number
  ): Promise<Models.ResponseModel<Models.SellerDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/get-seller-detail`,
      { TargetSellerId }
    );
  }

  async getSellerDetailContactList(
    TargetSellerId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerContactListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/contact-list`,
      { TargetSellerId, Page, Take, searchText, OrderBy }
    );
  }

  async changeSellerStatus(
    Id: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/change-seller-activity-status`,
      { Id, IsEnabled }
    );
  }

  async deleteSeller(
    TargetSellerId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/delete-seller`,
      { TargetSellerId }
    );
  }

  async updateSeller(
    TargetSellerId: number,
    NameSurname: string,
    StoreName: string,
    Email: string,
    Phone: string,
    CompanyType: number,
    TaxDepartment: string,
    TaxNumber: string,
    CitizenshipNumber: string,
    CompanyTitle: string,
    KepAddress: string,
    MersisNumber: string,
    AccountOwner: string,
    IBAN: string,
    BankId: number,
    BranchName: string,
    BranchCode: string,
    AccountNumber: string,
    CanCreateIndividualCargo: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/update-seller-data`,
      {
        TargetSellerId,
        NameSurname,
        StoreName,
        Email,
        Phone,
        CompanyType,
        TaxDepartment,
        TaxNumber,
        CitizenshipNumber,
        CompanyTitle,
        KepAddress,
        MersisNumber,
        AccountOwner,
        IBAN,
        BankId,
        BranchName,
        BranchCode,
        AccountNumber,
        CanCreateIndividualCargo,
      }
    );
  }

  async updateSellerAddress(
    AddressId: number,
    CountryId: number,
    DistrictId: number,
    CityId: number,
    ZipCode: string,
    AddressDescription: string,
    AddressName: string,
    Phone: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/update-address`,
      {
        AddressId,
        CountryId,
        DistrictId,
        CityId,
        ZipCode,
        AddressDescription,
        AddressName,
        Phone,
      }
    );
  }

  async changeSellerAddressType(
    AddressId: number,
    AddressType: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/set-default-address`,
      { AddressId, AddressType }
    );
  }

  async deleteSellerAddress(
    AddressId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/remove-address`,
      { AddressId }
    );
  }

  async updateSellerContact(
    Id: number,
    NameSurname: string,
    Email: string,
    Phone: string,
    Description: string,
    Title: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/update-contact-information`,
      { Id, NameSurname, Email, Phone, Description, Title }
    );
  }

  async deleteSellerContact(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/delete-contact-information`,
      { Id }
    );
  }

  async approveSeller(SellerId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/approve-seller`,
      { SellerId }
    );
  }

  async rejectSeller(
    SellerId: number,
    RejectType: string,
    RejectReason: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/reject-seller`,
      { SellerId, RejectType, RejectReason }
    );
  }

  async changeDocumentStatus(
    TargetSellerId: number,
    TaxPlateStatue: number,
    TaxPlateRejectReason: string,
    SignatureCircularsStatue: number,
    SignatureCircularsRejectReason: string,
    RegistryGazetteStatue: number,
    RegistryGazetteRejectReason: string,
    BirthCertificateStatue: number,
    BirthCertificateRejectReason: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/process-to-seller-document-from-admin`,
      {
        TargetSellerId,
        TaxPlateStatue,
        TaxPlateRejectReason,
        SignatureCircularsStatue,
        SignatureCircularsRejectReason,
        RegistryGazetteStatue,
        RegistryGazetteRejectReason,
        BirthCertificateStatue,
        BirthCertificateRejectReason,
      }
    );
  }

  async getSellerOrdersForAdmin(
    SellerId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.OrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/get-seller-orders-for-admin`,
      { SellerId, Page, Take, searchText, OrderBy }
    );
  }

  async getSellerAdvertsForAdmin(
    SellerId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductAdvertListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/get-seller-averts-for-admin`,
      { SellerId, Page, Take, searchText, OrderBy }
    );
  }

  //<<-- SELLER LISTS MODULE ---END--- >>

  //<<-- ADMIN USERS MODULE ---START--- >>

  async getAdminUsersList(
    Page: number,
    Take: number
  ): Promise<Models.ResponseModel<Models.AdminUserListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/admin-list`,
      { Page, Take }
    );
  }

  async removeAdmin(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/remove-admin-user`,
      { Id }
    );
  }

  async createAdmin(
    UserName: string,
    Email: String,
    Password: string,
    PermissionList: string[],
    IsSuperAdmin: boolean,
    UserType: number
  ): Promise<Models.ResponseModel<{ UserId: number }>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/add-admin-user`,
      { UserName, Email, Password, PermissionList, IsSuperAdmin, UserType }
    );
  }

  async adminDetail(
    Id: number
  ): Promise<Models.ResponseModel<Models.AdminUserModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/admin-detail`,
      { Id }
    );
  }

  async updateAdmin(
    Id: number,
    UserName: String,
    Email: string,
    Password: string,
    Roles: string[],
    IsSuperAdmin: boolean,
    UserType: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/update-admin-user`,
      { Id, UserName, Email, Password, Roles, IsSuperAdmin, UserType }
    );
  }

  //<<-- ADMIN USERS MODULE ---END--- >>

  //#region Pro-List-Detail-Module
  async getProRejectedList(
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string,
    CategoryId: number
  ): Promise<Models.ResponseModel<Models.ProListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/rejected-pro-list`,
      { Page, Take, searchText, OrderBy, CategoryId }
    );
  }

  async getProApplicationList(
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string,
    Status: number,
    CompanyType: number,
    RecourseMinDateJSTime: number,
    RecourseMaxDateJSTime: number,
    CategoryId: number
  ): Promise<Models.ResponseModel<Models.ProListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/pro-recourse-list`,
      {
        Page,
        Take,
        searchText,
        OrderBy,
        Status,
        CompanyType,
        RecourseMinDateJSTime: this.currentDateStampForPost(
          RecourseMinDateJSTime
        ),
        RecourseMaxDateJSTime: this.currentDateStampForPost(
          RecourseMaxDateJSTime
        ),
        CategoryId,
      }
    );
  }

  async getProList(
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string,
    CategoryId?: number
  ): Promise<Models.ResponseModel<Models.ProListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/approved-pro-list`,
      { Page, Take, searchText, OrderBy, CategoryId }
    );
  }

  async getProMemberList(
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.ProListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/approved-pro-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProDocumentList(
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string,
    CategoryId: number
  ): Promise<Models.ResponseModel<Models.ProListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/pro-list-for-waiting-document`,
      { Page, Take, searchText, OrderBy, CategoryId }
    );
  }

  async getProDetail(
    TargetProId: number
  ): Promise<Models.ResponseModel<Models.ProDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-detail`,
      { TargetProId }
    );
  }

  async getProSubscriptionDetail(
    ProId: number
  ): Promise<
    Models.ResponseModel<Models.GetProSubscriptionDetailResponseModel>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-subscription-detail`,
      { ProId }
    );
  }

  async getSubscriptionHistory(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<
    Models.ResponseModel<Models.GetProSubscriptionHistoryResponseModel>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-subscription-history`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }

  async deletePro(TargetProId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/delete-pro`,
      { TargetProId }
    );
  }

  async changeProStatus(
    Id: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/change-pro-activity-status`,
      { Id, IsEnabled }
    );
  }

  async getProContactList(
    TargetProId: number,
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.ProContactListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/contact-list`,
      { TargetProId, Page, Take, searchText, OrderBy }
    );
  }

  async deleteProContact(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/delete-contact-information`,
      { Id }
    );
  }

  async updateProContact(
    Id: number,
    NameSurname: string,
    Email: string,
    Phone: string,
    Description: string,
    Title: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/update-contact-information`,
      { Id, NameSurname, Email, Phone, Description, Title }
    );
  }

  async changeProDocumentStatus(
    TargetProId: number,
    TaxPlateStatue: number,
    TaxPlateRejectReason: string,
    SignatureCircularsStatue: number,
    SignatureCircularsRejectReason: string,
    RegistryGazetteStatue: number,
    RegistryGazetteRejectReason: string,
    BirthCertificateStatue: number,
    BirthCertificateRejectReason: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/process-to-pro-document-from-admin`,
      {
        TargetProId,
        TaxPlateStatue,
        TaxPlateRejectReason,
        SignatureCircularsStatue,
        SignatureCircularsRejectReason,
        RegistryGazetteStatue,
        RegistryGazetteRejectReason,
        BirthCertificateStatue,
        BirthCertificateRejectReason,
      }
    );
  }

  async approvePro(ProId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/approve-pro`,
      { ProId }
    );
  }

  async rejectPro(
    ProId: number,
    RejectType: string,
    RejectReason: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/reject-pro`,
      { ProId, RejectType, RejectReason }
    );
  }

  async updateProData(
    TargetProId: number,
    NameSurname: string,
    StoreName: string,
    Email: string,
    Phone: string,
    CompanyType: number,
    TaxDepartment: string,
    TaxNumber: string,
    CitizenshipNumber: string,
    CompanyTitle: string,
    KepAddress: string,
    MersisNumber: string,
    AccountOwner: string,
    IBAN: string,
    BankId: number,
    BranchName: string,
    BranchCode: string,
    AccountNumber: string,
    ContactEmail: string,
    WebsiteUrl: string,
    ContactAddress: string,
    IsVerified: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/update-pro-data`,
      {
        TargetProId,
        NameSurname,
        StoreName,
        Email,
        Phone,
        CompanyType,
        TaxDepartment,
        TaxNumber,
        CitizenshipNumber,
        CompanyTitle,
        KepAddress,
        MersisNumber,
        AccountOwner,
        IBAN,
        BankId,
        BranchName,
        BranchCode,
        AccountNumber,
        ContactEmail,
        WebsiteUrl,
        ContactAddress,
        IsVerified,
      }
    );
  }

  async updateProServiceInfo(
    TargetProId: number,
    ParentCategory: number,
    ServiceCategories: number[],
    ShiftData: Models.ProServiceShiftModel[],
    MinPrice: number,
    MaxPrice: number,
    PriceData: string[],
    ForeignLanguageData: string[],
    CityId: number,
    DistrictList: number[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/update-pro-service-information`,
      {
        TargetProId,
        ParentCategory,
        ServiceCategories,
        ShiftData,
        MinPrice,
        MaxPrice,
        PriceData,
        ForeignLanguageData,
        CityId,
        DistrictList,
      }
    );
  }

  async changeProAddressType(
    AddressId: number,
    AddressType: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/set-default-address`,
      { AddressId, AddressType }
    );
  }

  async updateProAddress(
    AddressId: number,
    CountryId: number,
    DistrictId: number,
    CityId: number,
    ZipCode: string,
    AddressDescription: string,
    AddressName: string,
    Phone: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/update-address`,
      {
        AddressId,
        CountryId,
        DistrictId,
        CityId,
        ZipCode,
        AddressDescription,
        AddressName,
        Phone,
      }
    );
  }

  async changeProrAddressType(
    AddressId: number,
    AddressType: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/set-default-address`,
      { AddressId, AddressType }
    );
  }

  async deleteProAddress(
    AddressId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/remove-address`,
      { AddressId }
    );
  }

  async deleteProMedia(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/remove-pro-media`,
      { Id }
    );
  }

  async updateProProfile(
    TargetProId: number,
    SectionData: Models.ProSectionDataModel[],
    SocietyData: number[],
    IntroText: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/update-pro-profile-for-admin`,
      { TargetProId, SectionData, SocietyData, IntroText }
    );
  }

  async updateProPhoto(
    Photo: File | undefined,
    ProId: number
  ): Promise<Models.ResponseModel<null>> {
    let data = new FormData();
    data.append("Photo", Photo || "");
    data.append("ProId", JSON.stringify(ProId));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/update-logo-for-admin`,
      data
    );
  }

  async deleteProPhoto(ProId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/delete-logo-for-admin`,
      { ProId }
    );
  }

  //#endregion

  //#region slider
  async createSlider(
    SliderType: number,
    OrderBy: number,
    Photo: File | undefined,
    Title: string,
    TitleColor: string,
    ButtonText: string,
    ButtonTextColor: string,
    RedirectLink: string,
    Description: string,
    DescriptionColor: string,
    IsBlank: boolean,
    ShowOnWebsite: boolean,
    ShowOnMobilWeb: boolean,
    ShowOnApp: boolean,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("SliderType", JSON.stringify(SliderType));
    formData.append("OrderBy", JSON.stringify(OrderBy));
    formData.append("Photo", Photo || "");
    formData.append("Title", Title);
    formData.append("TitleColor", TitleColor);
    formData.append("ButtonText", ButtonText);
    formData.append("ButtonTextColor", ButtonTextColor);
    formData.append("RedirectLink", RedirectLink);
    formData.append("Description", Description);
    formData.append("DescriptionColor", DescriptionColor);
    formData.append("IsBlank", JSON.stringify(IsBlank));
    formData.append("ShowOnWebsite", JSON.stringify(ShowOnWebsite));
    formData.append("ShowOnMobilWeb", JSON.stringify(ShowOnMobilWeb));
    formData.append("ShowOnApp", JSON.stringify(ShowOnApp));
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-slider`,
      formData
    );
  }

  async getSliderList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    SliderType: number
  ): Promise<Models.ResponseModel<Models.SliderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/slider-list`,
      { Page, Take, searchText, OrderBy, SliderType }
    );
  }

  async getSliderDetail(
    SliderId: number
  ): Promise<Models.ResponseModel<Models.SliderListInnerModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/slider-detail`,
      { SliderId }
    );
  }

  async updateSlider(
    SliderId: number,
    OrderBy: number,
    Photo: File | undefined,
    Title: string,
    TitleColor: string,
    ButtonText: string,
    ButtonTextColor: string,
    RedirectLink: string,
    Description: string,
    DescriptionColor: string,
    IsBlank: boolean,
    ShowOnWebsite: boolean,
    ShowOnMobilWeb: boolean,
    ShowOnApp: boolean,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("SliderId", JSON.stringify(SliderId));
    formData.append("OrderBy", JSON.stringify(OrderBy));
    formData.append("Photo", Photo || "");
    formData.append("Title", Title);
    formData.append("TitleColor", TitleColor);
    formData.append("ButtonText", ButtonText);
    formData.append("ButtonTextColor", ButtonTextColor);
    formData.append("RedirectLink", RedirectLink);
    formData.append("Description", Description);
    formData.append("DescriptionColor", DescriptionColor);
    formData.append("IsBlank", JSON.stringify(IsBlank));
    formData.append("ShowOnWebsite", JSON.stringify(ShowOnWebsite));
    formData.append("ShowOnMobilWeb", JSON.stringify(ShowOnMobilWeb));
    formData.append("ShowOnApp", JSON.stringify(ShowOnApp));
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-slider`,
      formData
    );
  }

  async removeSlider(SliderId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-slider`,
      { SliderId }
    );
  }

  //#endregion

  //#region Site-general-blog
  async getBlogAuthorList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.BlogAuthorListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/blog-author-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async createBlogAuthor(Name: string): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-blog-author`,
      { Name }
    );
  }

  async updateBlogAuthor(
    BlogAuthorId: number,
    Name: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-blog-author`,
      { BlogAuthorId, Name }
    );
  }

  async deleteBlogAuthor(
    BlogAuthorId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-blog-author`,
      { BlogAuthorId }
    );
  }

  async getBlogCategoryList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.BlogCategoryListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/blog-category-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getBlogCategoryListForDdl(): Promise<
    Models.ResponseModel<Models.BlogCategoryListModel>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/blog-category-for-dropdown`,
      {}
    );
  }

  async createBlogCategory(
    OrderBy: number,
    Name: string,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-blog-category`,
      { OrderBy, Name, Description, IsEnabled }
    );
  }

  async getBlogCategory(
    BlogCategoryId: number
  ): Promise<Models.ResponseModel<Models.BlogCategoryModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/blog-category-detail`,
      { BlogCategoryId }
    );
  }

  async updateBlogCategory(
    BlogCategoryId: number,
    OrderBy: number,
    Name: string,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-blog-category`,
      { BlogCategoryId, OrderBy, Name, Description, IsEnabled }
    );
  }

  async deleteBlogCategory(
    BlogCategoryId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-blog-category`,
      { BlogCategoryId }
    );
  }

  async getBlogList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    CategoryId?: number,
    IsEnabled?: number,
    AuthorId?: number
  ): Promise<Models.ResponseModel<Models.BlogListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/blog-list`,
      { Page, Take, searchText, OrderBy, CategoryId, IsEnabled, AuthorId }
    );
  }

  async deleteBlog(BlogId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-blog`,
      { BlogId }
    );
  }

  async getBlog(
    BlogId: number
  ): Promise<Models.ResponseModel<Models.BlogModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/blog-detail`,
      { BlogId }
    );
  }

  async createBlog(
    Title: string,
    AuthorId: number,
    CategoryId: number,
    Description: string,
    IsEnabled: boolean,
    Photo: File | undefined,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Title", Title);
    formData.append("AuthorId", JSON.stringify(AuthorId));
    formData.append("CategoryId", JSON.stringify(CategoryId));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("Photo", Photo || "");
    formData.append("SeoTitle", SeoTitle);
    formData.append("SeoDescription", SeoDescription);

    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-blog`,
      formData
    );
  }

  async updateBlog(
    BlogId: number,
    Title: string,
    AuthorId: number,
    CategoryId: number,
    Description: string,
    IsEnabled: boolean,
    Photo: File | undefined,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("BlogId", JSON.stringify(BlogId));
    formData.append("Title", Title);
    formData.append("AuthorId", JSON.stringify(AuthorId));
    formData.append("CategoryId", JSON.stringify(CategoryId));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    formData.append("Photo", Photo || "");
    formData.append("SeoTitle", SeoTitle);
    formData.append("SeoDescription", SeoDescription);

    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-blog`,
      formData
    );
  }

  //#endregion

  //#region Site-General-Academy
  async getAcademyCategoryList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsEnable?: number,
    CategoryType?: number
  ): Promise<Models.ResponseModel<Models.AcademyCategoryListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/academy-category-list`,
      { Page, Take, searchText, OrderBy, IsEnable, CategoryType }
    );
  }

  async deleteAcademyCategory(
    AcademyCategoryId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-academy-category`,
      { AcademyCategoryId }
    );
  }

  async createAcademyCategory(
    OrderBy: number,
    Name: string,
    Description: string,
    IsEnabled: boolean,
    CategoryType: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-academy-category`,
      { OrderBy, Name, Description, IsEnabled, CategoryType }
    );
  }

  async getAcademyCategory(
    AcademyCategoryId: number
  ): Promise<Models.ResponseModel<Models.AcademyCategoryModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/academy-category-detail`,
      { AcademyCategoryId }
    );
  }

  async updateAcademyCategory(
    AcademyCategoryId: number,
    OrderBy: number,
    Name: string,
    Description: string,
    IsEnabled: boolean,
    CategoryType: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-academy-category`,
      { AcademyCategoryId, OrderBy, Name, Description, IsEnabled, CategoryType }
    );
  }

  async getAcademyList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsEnable?: number,
    CategoryId?: number,
    AcademyType?: number,
    IsFeatured?: number,
    CategoryType?: number
  ): Promise<Models.ResponseModel<Models.AcademyListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/academy-list`,
      {
        Page,
        Take,
        searchText,
        OrderBy,
        IsEnable,
        CategoryId,
        AcademyType,
        IsFeatured,
        CategoryType,
      }
    );
  }

  async deleteAcademy(AcademyId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-academy`,
      { AcademyId }
    );
  }

  async getAcademyCategoryListForDdl(): Promise<
    Models.ResponseModel<Models.AcademyCategoryListModel>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/academy-category-for-dropdown`,
      {}
    );
  }

  async createAcademy(
    Title: string,
    Photo: File | undefined,
    CategoryType: number,
    CategoryId: number,
    OrderBy: number,
    AcademyType: number,
    VideoUrl: string,
    VideoDuration: string,
    Document: File | undefined,
    ShortDescription: string,
    Description: string,
    IsFeatured: boolean,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Title", Title);
    formData.append("Photo", Photo || "");
    formData.append("CategoryType", JSON.stringify(CategoryType));
    formData.append("CategoryId", JSON.stringify(CategoryId));
    formData.append("OrderBy", JSON.stringify(OrderBy));
    formData.append("AcademyType", JSON.stringify(AcademyType));
    formData.append("VideoUrl", VideoUrl);
    formData.append("VideoDuration", VideoDuration);
    formData.append("Document", Document || "");
    formData.append("ShortDescription", ShortDescription);
    formData.append("Description", Description);
    formData.append("IsFeatured", JSON.stringify(IsFeatured));
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-academy`,
      formData
    );
  }

  async updateAcademy(
    AcademyId: number,
    Title: string,
    Photo: File | undefined,
    CategoryType: number,
    CategoryId: number,
    OrderBy: number,
    AcademyType: number,
    VideoUrl: string,
    VideoDuration: string,
    Document: File | undefined,
    ShortDescription: string,
    Description: string,
    IsFeatured: boolean,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("AcademyId", JSON.stringify(AcademyId));
    formData.append("Title", Title);
    formData.append("Photo", Photo || "");
    formData.append("CategoryType", JSON.stringify(CategoryType));
    formData.append("CategoryId", JSON.stringify(CategoryId));
    formData.append("OrderBy", JSON.stringify(OrderBy));
    formData.append("AcademyType", JSON.stringify(AcademyType));
    formData.append("VideoUrl", VideoUrl);
    formData.append("VideoDuration", VideoDuration);
    formData.append("Document", Document || "");
    formData.append("ShortDescription", ShortDescription);
    formData.append("Description", Description);
    formData.append("IsFeatured", JSON.stringify(IsFeatured));
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-academy`,
      formData
    );
  }

  async getAcademyDetail(
    AcademyId: number
  ): Promise<Models.ResponseModel<Models.AcademyModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/academy-detail-for-admin`,
      { AcademyId }
    );
  }

  async changeAcademyStatus(
    Id: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/change-academy-status`,
      { Id, IsEnabled }
    );
  }

  async getAcademyQuestionList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    AcademyId: number
  ): Promise<Models.ResponseModel<Models.AcademyQuestionListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/academy-question-list`,
      { Page, Take, searchText, OrderBy, AcademyId }
    );
  }

  async getAcademyEvaluationList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    AcademyId: number
  ): Promise<Models.ResponseModel<Models.AcademyEvaluationListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/academy-evaluation-list`,
      { Page, Take, searchText, OrderBy, AcademyId }
    );
  }

  async answerAcademyQuestion(
    AcademyQuestionId: number,
    Answer: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/answer-academy-question`,
      { AcademyQuestionId, Answer }
    );
  }

  async deleteAcademyQuestion(
    AcademyQuestionId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-academy-question`,
      { AcademyQuestionId }
    );
  }

  async deleteAcademyEvaluation(
    EvaluationId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-academy-evaluation`,
      { EvaluationId }
    );
  }

  async getAcademyUnasweredQuestionList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    CategoryType: number
  ): Promise<Models.ResponseModel<Models.AcademyQuestionListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/unanswered-academy-question-list`,
      { Page, Take, searchText, OrderBy, CategoryType }
    );
  }
  //#endregion

  //#region help-group
  async createHelpGroup(
    Title: string,
    Photo: File | undefined,
    OrderBy: number,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Title", Title);
    formData.append("Photo", Photo || "");
    formData.append("OrderBy", JSON.stringify(OrderBy));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-help-group`,
      formData
    );
  }

  async getHelpGroupList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.HelpGroupListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/help-group-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async handleUpdateHelpGroup(
    HelpGroupId: number,
    Title: string,
    Photo: File | undefined,
    OrderBy: number,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("HelpGroupId", JSON.stringify(HelpGroupId));
    formData.append("Title", Title);
    formData.append("Photo", Photo || "");
    formData.append("OrderBy", JSON.stringify(OrderBy));
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-help-group`,
      formData
    );
  }

  async getHelpGroupDetail(
    HelpGroupId: number
  ): Promise<Models.ResponseModel<Models.HelpGroupListInnerModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/help-group-detail`,
      { HelpGroupId }
    );
  }

  async deleteHelpGroup(
    HelpGroupId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-help-group`,
      { HelpGroupId }
    );
  }

  //#endregion

  //#region help-category
  async createHelpCategory(
    Title: string,
    GroupId: number,
    OrderBy: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-help-category`,
      { Title, GroupId, OrderBy, IsEnabled }
    );
  }

  async updateHelpCategory(
    HelpCategoryId: number,
    Title: string,
    GroupId: number,
    OrderBy: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-help-category`,
      { HelpCategoryId, Title, GroupId, OrderBy, IsEnabled }
    );
  }

  async getHelpCategoryList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.HelpCategoryListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/help-category-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async deleteHelpCategory(
    HelpCategoryId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-help-category`,
      { HelpCategoryId }
    );
  }

  async getHelpGroupForDropdown(): Promise<
    Models.ResponseModel<Models.GroupCategoryListModelForDropdown>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/help-groups-and-categories-for-dropdown`,
      {}
    );
  }

  async getHelpCategoryDetail(
    HelpCategoryId: number
  ): Promise<Models.ResponseModel<Models.HelpCategoryListInnerModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/help-category-detail`,
      { HelpCategoryId }
    );
  }
  //#endregion

  //#region help-content
  async createHelpContent(
    Title: string,
    CategoryId: number,
    OrderBy: number,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-help`,
      { Title, CategoryId, OrderBy, Description, IsEnabled }
    );
  }

  async getHelpContentList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.HelpContentListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/help-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async deleteHelpContent(HelpId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-help`,
      { HelpId }
    );
  }

  async getHelpContentDetail(
    HelpId: number
  ): Promise<Models.ResponseModel<Models.HelpContentListInnerModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/help-detail`,
      { HelpId }
    );
  }

  async updateHelpContent(
    HelpId: number,
    Title: string,
    CategoryId: number,
    OrderBy: number,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-help`,
      { HelpId, Title, CategoryId, OrderBy, Description, IsEnabled }
    );
  }
  //#endregion

  //#region brand
  async getBrandList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.BrandListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/brand-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async createBrand(Name: string): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-brand`,
      { Name }
    );
  }

  async updateBrand(
    BrandId: number,
    Name: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-brand`,
      { BrandId, Name }
    );
  }
  //#endregion

  //#region pro-associations

  async getSocietyLists(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.AssociationListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/society-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async createSociety(
    Title: string,
    Photo: File | undefined
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Title", Title);
    formData.append("Photo", Photo || "");
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-society`,
      formData
    );
  }

  async updateSociety(
    SocietyId: number,
    Photo: File | undefined,
    Title: string
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("SocietyId", JSON.stringify(SocietyId));
    formData.append("Photo", Photo || "");
    formData.append("Title", Title);
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-society`,
      formData
    );
  }
  //#endregion

  //#region refund-management
  async getRefundCategoryList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.RefundCategoryListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-child-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getRefundOptionList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    CategoryId: number
  ): Promise<Models.ResponseModel<Models.RefundOptionListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/refund-option-list`,
      { Page, Take, searchText, OrderBy, CategoryId }
    );
  }

  async createRefundOption(
    Title: string,
    Description: string,
    CategoryId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-refund-option`,
      { Title, Description, CategoryId }
    );
  }

  async updateRefundOption(
    RefundOptionId: number,
    Title: string,
    Description: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-refund-option`,
      { RefundOptionId, Title, Description }
    );
  }

  async deleteRefundOption(
    RefundOptionId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/remove-refund-option`,
      { RefundOptionId }
    );
  }
  //#endregion

  //#region Product
  async getProductAdvertList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductAdvertListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/avert-list-admin`,
      {Page, Take, searchText, OrderBy}
    );
  }

  async getAdvertDetailForAdmin(
    AdvertId: number
  ): Promise<Models.ResponseModel<Models.ProductAdminDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/avert-detail-admin`,
      { AdvertId }
    );
  }

  async getProductDraftList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductAdvertDraftListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/draft-list-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getRejectedProductDraftList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductAdvertDraftListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/rejected-draft-list-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getAdvertDraftDetailForAdmin(
    DraftId: number
  ): Promise<Models.ResponseModel<Models.ProductAdvertAdminDraftDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/avert-draft-detail-admin`,
      { DraftId }
    );
  }

  async getDraftsOtherVariations(
    DraftId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductDraftAdvertListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-drafts-other-variations`,
      { DraftId, Page, Take, searchText, OrderBy }
    );
  }

  async getProductList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/product-list-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProductDetailForAdmin(
    ProductId: number
  ): Promise<Models.ResponseModel<Models.ProductAdminDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/product-detail-admin`,
      { ProductId }
    );
  }

  async changeProductStatus(
    ProductId: number,
    Status: boolean
  ): Promise<Models.ResponseModel<Models.ProductAdminDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/change-product-status-admin`,
      { ProductId, Status }
    );
  }

  async approveProductAndAdvert(
    ProductDraftId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/approve-product-and-avert`,
      { ProductDraftId }
    );
  }

  async rejectProductAndAdvert(
    ProductDraftId: number,
    RejectTitle: string,
    RejectReason: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/reject-product-and-avert`,
      { ProductDraftId, RejectTitle, RejectReason }
    );
  }

  async getProductUpdateRequestList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductUpdateRequestListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/product-update-request-list-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProductUpdateRequestDetail(
    ProductRequestId: number
  ): Promise<Models.ResponseModel<Models.ProductUpdateRequestModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-product-update-request-detail`,
      { ProductRequestId }
    );
  }

  async approveProductUpdate(
    ProductRequestId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/approve-product-update`,
      { ProductRequestId }
    );
  }

  async rejectProductUpdate(
    ProductRequestId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/reject-product-update`,
      { ProductRequestId }
    );
  }

  async getCategoryVariations(
    categoryId: number
  ): Promise<Models.ResponseModel<Models.CategoryVariationsListModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-variations-for-product`,
      { categoryId: categoryId }
    );
  }

  async getCategoryProperties(
    categoryId: number
  ): Promise<Models.ResponseModel<Models.CategoryPropertiesListModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-elements-for-product`,
      { categoryId: categoryId }
    );
  }

  async updateProductAndAdvert(
    ProductId: number,
    AdvertId: number,
    CategoryId: number,
    Name: string,
    BrandId: number,
    ModelNo: string,
    BarcodeNo: string,
    ShortDescription: string,
    ShippingPrepareDay: number,
    ShowProduct: boolean,
    StockCode: string,
    SalePrice: string,
    MarketPrice: string,
    TaxRate: number,
    Stock: number,
    Desi: string,
    Variations: Models.ProductVariationModel[],
    Properties: Models.ProductVariationModel[],
    GroupData: string,
    Description: string,
    Images: Models.ImagePostModel[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/update-product-and-avert`,
      {
        ProductId,
        AdvertId,
        CategoryId,
        Name,
        BrandId,
        ModelNo,
        BarcodeNo,
        ShortDescription,
        ShippingPrepareDay,
        ShowProduct,
        StockCode,
        SalePrice,
        MarketPrice,
        TaxRate,
        Stock,
        Desi,
        Variations,
        Properties,
        GroupData,
        Description,
        Images,
      }
    );
  }

  async checkBarcodeForProduct(
    Barcode: string
  ): Promise<Models.ResponseModel<Models.ProductProcessModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/check-barcode-exist`,
      { Barcode }
    );
  }

  async changeProductBarcode(
    ProductId: number,
    BarcodeNo: string,
    ModelNo: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/change-product-barcode`,
      { ProductId, BarcodeNo, ModelNo }
    );
  }

  async mergeProduct(
    TargetProductId: number,
    SourceProductId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/marge-products`,
      { TargetProductId, SourceProductId }
    );
  }

  async suspendAdvert(
    AdvertId: number,
    ShowProduct: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/suspend-avert-admin`,
      { AdvertId, ShowProduct }
    );
  }

  async deleteProductUpdateRequest(
    ProductRequestId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/delete-product-update-request`,
      { ProductRequestId }
    );
  }

  async getReportedProductList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ReportedProductListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-reported-product-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async deleteReportForProduct(
    ReportId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/delete-product-report`,
      { ReportId }
    );
  }

  //#endregion

  //#region Badge
  async createBadge(
    Name: string,
    Photo: File | undefined,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("Name", Name);
    formData.append("Photo", Photo || "");
    formData.append("Description", Description);
    formData.append("IsEnabled", JSON.stringify(IsEnabled));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/create-badge`,
      formData
    );
  }

  async updateBadge(
    BadgeId: number,
    Name: string,
    Photo: File | undefined,
    Description: string
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("BadgeId", JSON.stringify(BadgeId));
    formData.append("Name", Name);
    formData.append("Photo", Photo || "");
    formData.append("Description", Description);
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/update-badge`,
      formData
    );
  }

  async getBadgeDetail(
    BadgeId: number
  ): Promise<Models.ResponseModel<Models.BadgeModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/badge-detail`,
      { BadgeId }
    );
  }

  async changeBadgeStatus(
    BadgeId: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/change-badge-status`,
      { BadgeId, IsEnabled }
    );
  }

  async deleteBadge(BadgeId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/remove-badge`,
      { BadgeId }
    );
  }

  async getBadgeList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.BadgeListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/badge-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProListForBadgeDetail(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    BadgeId: number
  ): Promise<Models.ResponseModel<Models.ProForBadgeDetailListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/pro-list-for-badge-detail`,
      { Page, Take, searchText, OrderBy, BadgeId }
    );
  }

  async removeAssignmentFromBadge(
    ProId: number,
    BadgeId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/remove-assignment-from-badge`,
      { ProId, BadgeId }
    );
  }

  async assignBadgeToPro(
    BadgeId: number,
    ProIds: number[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/assign-badge-to-pro`,
      { BadgeId, ProIds }
    );
  }

  async getBadgeListForProDetail(
    ProId: number,
    searchText: string,
    IsEnabled: number
  ): Promise<Models.ResponseModel<Models.BadgeListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/badge-list-for-pro-detail`,
      { ProId, searchText, IsEnabled }
    );
  }
  //#endregion

  // #region seller campaign list start
  async getSellerCampaignList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CampaignListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-seller-campaign-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }
  async getSellerCampaignDetail(
    CampaignId: number
  ): Promise<Models.ResponseModel<Models.CampaignDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-campaign-detail-for-admin`,
      { CampaignId }
    );
  }
  async getSellerCampaignBySellerId(sellerId:number,page:number,take?:number,searchText?:string,orderBy?:number):Promise<Models.ResponseModel<Models.CampaignListModel>>{
    const result=await this.baseFetch(`${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-campaigns-by-seller-id-for-admin`,{
      SellerId:sellerId,
      Page:page,
      Take:take,
      SearchText:searchText,
      OrderBy:orderBy
    });
    return result;
  }
  // #endregion

  //#region management campaign module start
  async getManagementCampaignList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CampaignListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-management-campaign-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async createManagementCampaign(
    TargetAdvertIds: number[],
    StartDateJS: number,
    EndDateJS: number,
    Title: string,
    PhotoUrl: string,
    ShowCountdown: boolean,
    CampaignSortNumber?: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/create-management-campaign`,
      {
        TargetAdvertIds,
        StartDateJS: this.currentDateStampForPost(StartDateJS),
        EndDateJS: this.currentDateStampForPost(EndDateJS),
        Title,
        PhotoUrl,
        ShowCountdown,
        CampaignSortNumber
      }
    );
  }

  async getManagementCampaignDetail(
    CampaignId: number
  ): Promise<Models.ResponseModel<Models.CampaignDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-campaign-detail-for-admin`,
      { CampaignId }
    );
  }

  async terminateCampaignForAdmin(
    CampaignId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/terminate-campaign-for-admin`,
      { CampaignId }
    );
  }

  async getUsedProducts(
    CampaignId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CampaignAdvertListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-campaign-avert-list-for-admin`,
      { CampaignId, Page, Take, searchText, OrderBy }
    );
  }

  async addAdvertToManagementCampaign(
    CampaignId: number,
    AdvertIds: number[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/add-avert-to-management-campaign`,
      { CampaignId, AdvertIds }
    );
  }

  async updateManagemenetCampaign(
    CampaignId: number,
    StartDateJS: number,
    EndDateJS: number,
    Title: string,
    PhotoUrl: string,
    ShowCountdown: boolean,
    CampaignSortNumber?:number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/update-management-campaign`,
      {
        CampaignId,
        StartDateJS: this.currentDateStampForPost(StartDateJS),
        EndDateJS: this.currentDateStampForPost(EndDateJS),
        Title,
        PhotoUrl,
        ShowCountdown,
        CampaignSortNumber
      }
    );
  }

  async getCampaignAdvertIds(
    CampaignId: number
  ): Promise<Models.ResponseModel<number[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-campaign-avert-ids`,
      { CampaignId }
    );
  }

  // #endregion

  //#region pro request start
  async getProRequestList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProRequestListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/request-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }
  async getRequestDetail(
    RequestId: number
  ): Promise<Models.ResponseModel<Models.ProRequestDetailInnerModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/request-detail`,
      { RequestId }
    );
  }
  // #endregion

  //#region pro offer start
  async getOfferDetail(
    OfferId: number
  ): Promise<Models.ResponseModel<Models.ProOfferModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-offer-detail-for-admin`,
      { OfferId }
    );
  }
  // #endregion

  //#region Project
  async getProjectList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    Statue: number,
    isEnabled?: number
  ): Promise<Models.ResponseModel<Models.ProjectListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/project-list-for-admin`,
      { Page, Take, searchText, OrderBy, Statue, isEnabled }
    );
  }

  async deleteProject(
    TargetProjectId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/remove-project`,
      { TargetProjectId }
    );
  }

  async getProjectDetail(
    TargetProjectId: number
  ): Promise<Models.ResponseModel<Models.ProjectModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/get-project-detail`,
      { TargetProjectId }
    );
  }

  async changeProjectStatus(
    Id: number,
    IsEnabled
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/change-project-status`,
      { Id, IsEnabled }
    );
  }

  async approveProject(ProjectId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/approve-project`,
      { ProjectId }
    );
  }

  async rejectProject(
    ProjectId: number,
    RejectTitle: string,
    RejectReason: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/reject-project`,
      { ProjectId, RejectTitle, RejectReason }
    );
  }

  async updateProject(
    ProjectId: number,
    Name: string,
    CategoryId: number,
    ElementData: Models.ElementDataModel[],
    KeywordData: string[],
    Description: string,
    ImageList: Models.ProjectMediaModel[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/update-project`,
      {
        ProjectId,
        Name,
        CategoryId,
        ElementData,
        KeywordData,
        Description,
        ImageList,
      }
    );
  }

  async removeProjectPhoto(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/remove-project-media`,
      { Id }
    );
  }

  async getProProjectListForAdmin(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProjectListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/get-pro-project-list-for-admin`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }

  async getProIdeaListForAdmin(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProjectListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/get-pro-idea-list-for-admin`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }
  //#endregion

  //#region General-Content-Model
  async getLoginSliderList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsEnabled: number,
    WhereToShow: number
  ): Promise<Models.ResponseModel<Models.GeneralContentSliderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-login-slider-list`,
      { Page, Take, searchText, OrderBy, IsEnabled, WhereToShow }
    );
  }

  async getLoginSliderDetail(
    ContentId: number
  ): Promise<Models.ResponseModel<Models.GeneralContentSliderModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-login-slider-detail`,
      { ContentId }
    );
  }

  async createLoginSlider(
    PhotoUrl: string,
    Title: string,
    TitleColor: string,
    SubTitle: string,
    SubTitleColor: string,
    ButtonText: string,
    ButtonTextColor: string,
    RedirectLink: string,
    OrderBy: number,
    IsBlank: boolean,
    ShowOnWebsite: boolean,
    ShowOnMobilWeb: boolean,
    ShowOnApp: boolean,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-login-slider`,
      {
        PhotoUrl,
        Title,
        TitleColor,
        SubTitle,
        SubTitleColor,
        ButtonText,
        ButtonTextColor,
        RedirectLink,
        OrderBy,
        IsBlank,
        ShowOnWebsite,
        ShowOnMobilWeb,
        ShowOnApp,
        IsEnabled,
      }
    );
  }

  async updateLoginSlider(
    ContentId: number,
    PhotoUrl: string,
    Title: string,
    TitleColor: string,
    SubTitle: string,
    SubTitleColor: string,
    ButtonText: string,
    ButtonTextColor: string,
    RedirectLink: string,
    OrderBy: number,
    IsBlank: boolean,
    ShowOnWebsite: boolean,
    ShowOnMobilWeb: boolean,
    ShowOnApp: boolean,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-login-slider`,
      {
        ContentId,
        PhotoUrl,
        Title,
        TitleColor,
        SubTitle,
        SubTitleColor,
        ButtonText,
        ButtonTextColor,
        RedirectLink,
        OrderBy,
        IsBlank,
        ShowOnWebsite,
        ShowOnMobilWeb,
        ShowOnApp,
        IsEnabled,
      }
    );
  }

  async getPromotionInfoList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsEnabled: number,
    WhereToShow: number
  ): Promise<Models.ResponseModel<Models.PromotionInfoListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-promotion-info-list`,
      { Page, Take, searchText, OrderBy, IsEnabled, WhereToShow }
    );
  }

  async getPromotionInfoDetail(
    ContentId: number
  ): Promise<Models.ResponseModel<Models.PromotionInfoModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-promotion-info-detail`,
      { ContentId }
    );
  }

  async createPromotionInfo(
    PhotoUrl: string,
    OrderBy: number,
    Title: string,
    Description: string,
    IsEnabled: boolean,
    WhereToShow: number,
    ButtonText: string,
    ButtonUrl: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-promotion-info`,
      {
        PhotoUrl,
        OrderBy,
        Title,
        Description,
        IsEnabled,
        WhereToShow,
        ButtonText,
        ButtonUrl,
      }
    );
  }

  async updatePromotionInfo(
    ContentId: number,
    PhotoUrl: string,
    OrderBy: number,
    Title: string,
    Description: string,
    IsEnabled: boolean,
    WhereToShow: number,
    ButtonText: string,
    ButtonUrl: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-promotion-info`,
      {
        ContentId,
        PhotoUrl,
        OrderBy,
        Title,
        Description,
        IsEnabled,
        WhereToShow,
        ButtonText,
        ButtonUrl,
      }
    );
  }

  async getTestimonialList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsEnabled: number,
    WhereToShow: number
  ): Promise<Models.ResponseModel<Models.TestimonialListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-testimonial-list`,
      { Page, Take, searchText, OrderBy, IsEnabled, WhereToShow }
    );
  }

  async getTestimonialDetail(
    ContentId: number
  ): Promise<Models.ResponseModel<Models.TestimonialModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-testimonial-detail`,
      { ContentId }
    );
  }

  async createTestimonial(
    PhotoUrl: string,
    OrderBy: number,
    NameSurname: string,
    CompanyName: string,
    Title: string,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-testimonial`,
      {
        PhotoUrl,
        OrderBy,
        NameSurname,
        CompanyName,
        Title,
        Description,
        IsEnabled,
      }
    );
  }

  async updateTestimonial(
    ContentId: number,
    PhotoUrl: string,
    OrderBy: number,
    NameSurname: string,
    CompanyName: string,
    Title: string,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-testimonial`,
      {
        ContentId,
        PhotoUrl,
        OrderBy,
        NameSurname,
        CompanyName,
        Title,
        Description,
        IsEnabled,
      }
    );
  }

  async getAboutContentList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    Type: number
  ): Promise<Models.ResponseModel<Models.GeneralContentAboutListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-about-content-list`,
      { Page, Take, searchText, OrderBy, Type }
    );
  }

  async getAboutContentDetail(
    ContentId: number
  ): Promise<Models.ResponseModel<Models.GeneralContentAboutModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-about-content-detail`,
      { ContentId }
    );
  }

  async createAboutContent(
    Type: number,
    IconUrl: string,
    PhotoUrl: string,
    OrderBy: number,
    Title: string,
    SubTitle: string,
    ButtonText: string,
    Description: string
  ): Promise<Models.ResponseModel<Models.GeneralContentAboutModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-about-content`,
      {
        Type,
        IconUrl,
        PhotoUrl,
        OrderBy,
        Title,
        SubTitle,
        ButtonText,
        Description,
      }
    );
  }

  async updateAboutContent(
    ContentId: number,
    Type: number,
    IconUrl: string,
    PhotoUrl: string,
    OrderBy: number,
    Title: string,
    SubTitle: string,
    ButtonText: string,
    Description: string
  ): Promise<Models.ResponseModel<Models.GeneralContentAboutModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-about-content`,
      {
        ContentId,
        Type,
        IconUrl,
        PhotoUrl,
        OrderBy,
        Title,
        SubTitle,
        ButtonText,
        Description,
      }
    );
  }

  async getMemberShipPackageList(): Promise<
    Models.ResponseModel<Models.MembershipPackageModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-membership-package-list`,
      {}
    );
  }

  async getMemberShipPackageDetail(
    ContentType: number
  ): Promise<Models.ResponseModel<Models.MembershipPackageModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-membership-package-detail`,
      { ContentType }
    );
  }

  async updateMemberShipPackage(
    ContentType: number,
    Title: string,
    Price: string,
    Duration: number,
    Description: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-membership-package`,
      { ContentType, Title, Price, Duration, Description }
    );
  }

  async removeGeneralContent(
    ContentId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-general-content`,
      { ContentId }
    );
  }
  //#endregion

  //#region Reject Reasons

  async getRejectReasonCount(): Promise<
    Models.ResponseModel<Models.RejectReasonCountModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-reject-reasons-count`,
      {}
    );
  }

  async getRejectReasonList(
    Type: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkRejectReasonListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-reject-reasons`,
      { Type, Page, Take, searchText, OrderBy }
    );
  }

  async createRejectReason(
    Type: number,
    Text: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/create-reject-reason`,
      { Type, Text }
    );
  }

  async removeRejectReason(Id: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/delete-reject-reason`,
      { RejectReasonId: Id }
    );
  }

  async updateRejectReason(
    Id: number,
    Text: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/update-reject-reason`,
      { RejectReasonId: Id, Text }
    );
  }

  //#region

  //#region Support
  async getSupportSubjectList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    Type: number
  ): Promise<Models.ResponseModel<Models.SupportSubjectListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-support-subject-list`,
      { Page, Take, searchText, OrderBy, Type }
    );
  }

  async createSupportSubject(
    Type: number,
    Title: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-support-subject`,
      { Type, Title, OrderBy }
    );
  }

  async updateSupportSubject(
    SubjectId: number,
    Title: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-support-subject`,
      { SubjectId, Title, OrderBy }
    );
  }

  async removeSupportSubject(
    SubjectId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-support-subject`,
      { SubjectId }
    );
  }

  async getSupportRequestList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    Type: number
  ): Promise<Models.ResponseModel<Models.SupportRequestListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-support-request-list`,
      { Page, Take, searchText, OrderBy, Type }
    );
  }

  async removeSupportRequest(
    SupportRequestId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/remove-support-request`,
      { SupportRequestId }
    );
  }

  //#endregion

  //#region RefundRequest
  async getWaitingAdminActionRefundListForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.RefundOrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-waiting-admin-action-refund-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getWaitingSellerApproveRefundListForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.RefundOrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-waiting-seller-approve-refund-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerApproveRefundListForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.RefundOrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-seller-approve-refund-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerRejectedRefundListForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.RefundOrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-seller-rejected-refund-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async approveRefundForAdmin(
    SellerOrderProductId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/approve-refund-for-admin`,
      { SellerOrderProductId }
    );
  }

  async rejectRefundForAdmin(
    SellerOrderProductId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/reject-refund-for-admin`,
      { SellerOrderProductId }
    );
  }
  //#endregion

  //#region Pro-Work
  async getWorkOngoingList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-ongoing-works-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getWorkCompletedList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-completed-works-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getWorkCanceledList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-canceled-works-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getWorkWaitingCancelRequestList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-waiting-cancel-request-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getWorkRejectedCancelRequestList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-rejected-cancel-request-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async approveCancelRequest(WorkId): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/approve-cancel-request`,
      { WorkId }
    );
  }

  async rejectCancelRequest(
    WorkId,
    RejectTitleId: number,
    RejectReason: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/reject-cancel-request`,
      { WorkId, RejectTitleId, RejectReason }
    );
  }

  async getWorkInstallmentList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkPaymentListModelForAdmin>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-installment-work-payments-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getWorkCompletedPaymentList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkPaymentListModelForAdmin>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-completed-work-payments-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getWorkPaymentDetail(
    WorkId
  ): Promise<Models.ResponseModel<Models.WorkPaymentModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-installment-work-payment-detail`,
      { WorkId }
    );
  }

  async getWorkReportList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-work-reports-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getWorkDetail(
    WorkId
  ): Promise<Models.ResponseModel<Models.WorkDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-work-detail-for-admin`,
      { WorkId }
    );
  }

  async getRequestDetailNewDetail(
    RequestId
  ): Promise<Models.ResponseModel<Models.ProRequestNewModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/request-detail`,
      { RequestId }
    );
  }
  //#endregion
  //#region Discount-coupon
  async getDiscountCouponList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.DiscountCouponListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-discount-coupon-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getDiscountCouponDetail(
    CouponId: number
  ): Promise<Models.ResponseModel<Models.DiscountCouponModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-discount-coupon-detail`,
      {CouponId}
    );
  }

  async getDiscountCouponUserList(
    Page: number, Take: number, CouponId: number, IsUsed: boolean | null,
  ): Promise<Models.ResponseModel<{ Data: Models.DiscountCouponUser[]; TotalCount: number; }>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-discount-coupon-user-list-for-admin`,
      {CouponId, Page, Take, IsUsed}
    );
  }


  async createDiscountCoupon(
    Title: string,
    Description: string,
    MinimumCartPrice: string,
    StartDateJS: number,
    EndDateJS: number,
    Discount: string,
    Code: string,
    Type: number,
    UserIds: number[],
    SendSms: boolean,
    SendPush: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/create-discount-coupon`,
      {
        Title,
        Description,
        MinimumCartPrice,
        StartDateJS: this.currentDateStampForPost(StartDateJS),
        EndDateJS: this.currentDateStampForPost(EndDateJS),
        Discount,
        Code,
        Type,
        UserIds,
        SendSms,
        SendPush,
      }
    );
  }

  async updateDiscountCoupon(
    CouponId: number,
    Title: string,
    Description: string,
    StartDateJS: number,
    EndDateJS: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/update-discount-coupon`,
      {
        CouponId,
        Title,
        Description,
        StartDateJS: this.currentDateStampForPost(StartDateJS),
        EndDateJS: this.currentDateStampForPost(EndDateJS),
      }
    );
  }

  async removeDiscountCoupon(
    CouponId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/remove-discount-coupon`,
      { CouponId }
    );
  }
  //#endregion

  //#region CargoPrices
  async getCargoCompanyListForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CargoCompanyListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-cargo-companies-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getCustomerCargoPricesList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CustomerCargoPriceListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-customer-cargo-price-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async createCustomerCargoPrice(
    MinPrice: string,
    MaxPrice: string,
    CargoPrice: string,
    IsFreeShipping: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/create-customer-cargo-price`,
      { MinPrice, MaxPrice, CargoPrice, IsFreeShipping }
    );
  }

  async updateCustomerCargoPrice(
    CustomertCargoPriceId: number,
    MinPrice: string,
    MaxPrice: string,
    CargoPrice: string,
    IsFreeShipping: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/update-customer-cargo-price`,
      { CustomertCargoPriceId, MinPrice, MaxPrice, CargoPrice, IsFreeShipping }
    );
  }

  async deleteCustomerCargoPrice(
    CustomerCargoPriceId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/delete-customer-cargo-price`,
      { CustomerCargoPriceId }
    );
  }

  async getSellerCargoPricesList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    CompanyBy: number | null,
  ): Promise<Models.ResponseModel<Models.SellerCargoPriceListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-seller-cargo-price-list`,
      { Page, Take, searchText, OrderBy, CompanyBy }
    );
  }

  async createSellerCargoPrice(
    CargoCompanyId: number,
    CargoDetails: { MinDesi: number; MaxDesi: number; IsFreeShipping: boolean; CargoPrice: number; }[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/create-seller-cargo-price`,
      {CargoCompanyId, CargoDetails}
    );
  }

  async updateSellerCargoPrice(
    CargoCompanyId: number,
    CargoDetails: { Id: number | null; MinDesi: number; MaxDesi: number; IsFreeShipping: boolean; CargoPrice: number; }[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/update-seller-cargo-price`,
      {CargoCompanyId, CargoDetails}
    );
  }

  async deleteSellerCargoPrice(
    SellerCargoPriceId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/delete-seller-cargo-price`,
      { SellerCargoPriceId }
    );
  }
  //#endregion

  //#region Dropzone
  async SendDropzoneFile(
    url: string,
    file: File
  ): Promise<Models.ResponseModel<Models.DropzoneFileUploadModel>> {
    let data = new FormData();
    data.append("File", file);
    return await this.baseFetch(url, data);
  }

  //#endregion

  //#region Shopping Cart -Start-
  async getShoppingCartList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ShoppingCartListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-shopping-cart-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getAdvertListForShoppingCart(
    UserId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.AdvertListForShopingCartListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-users-shopping-cart-list-for-admin`,
      { UserId, Page, Take, searchText, OrderBy }
    );
  }

  async clearAllDataofShoppingCart(
    UserId: number,
    UserGuid: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/clear-all-data`,
      { UserId, UserGuid }
    );
  }

  async removeFromShoppingCart(
    ShoppingCartItemId: number,
    UserId: number,
    UserGuid: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/remove-from-shopping-cart`,
      { ShoppingCartItemId, UserId, UserGuid }
    );
  }
  //region Shopping Cart -End-
  //#region housiy-campaign
  async createHousiyCampaign(
    CampaignType: number,
    CategoryIds: number[],
    CommissionDiscount: string,
    MustApplyDiscount: string,
    SellerAdvertLimit: number,
    RequiredStockAmount: number,
    MustPayStockAmount: number,
    SameBasketReuseCount: number,
    StartDateJS: number,
    EndDateJS: number,
    LastJoinDateJS: number,
    Title: string,
    PhotoUrl: string,
    ShowCountdown: boolean,
    Description: string,
    JoinInfo: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/create-housiy-campaign`,
      {
        CampaignType,
        CategoryIds,
        CommissionDiscount,
        MustApplyDiscount,
        SellerAdvertLimit,
        RequiredStockAmount,
        MustPayStockAmount,
        SameBasketReuseCount,
        StartDateJS: this.currentDateStampForPost(StartDateJS),
        EndDateJS: this.currentDateStampForPost(EndDateJS),
        LastJoinDateJS: this.currentDateStampForPost(LastJoinDateJS),
        Title,
        PhotoUrl,
        ShowCountdown,
        Description,
        JoinInfo,
      }
    );
  }
  async getHousiyCampaignList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CampaignListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-houisy-campaign-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getCampaignDetailForAdmin(
    CampaignId: number
  ): Promise<Models.ResponseModel<Models.CampaignDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-campaign-detail-for-admin`,
      { CampaignId }
    );
  }

  async excludeAdvertFromCampaignForAdmin(
    CampaignAdvertId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/exclude-avert-from-campaign-for-admin`,
      { CampaignAdvertId }
    );
  }

  async getCampaignAdvertListForAdmin(
    CampaignId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CampaignAdvertListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-campaign-avert-list-for-admin`,
      { CampaignId, Page, Take, searchText, OrderBy }
    );
  }

  async getRequestListOfSellersToJoinHousiyCampaign(
    CampaignId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CampaignJoinRequestListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-housiy-campaign-seller-request-list`,
      { CampaignId, Page, Take, searchText, OrderBy }
    );
  }

  async getAdvertListForRequestListOfSellersToJoinHousiyCampaign(
    JoinRequestId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    SellerId: number
  ): Promise<Models.ResponseModel<Models.CampaignJoinRequestAdvertListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-housiy-campaign-seller-request-avert-list`,
      { JoinRequestId, Page, Take, searchText, OrderBy, SellerId }
    );
  }

  async approveAdvertFromSellerRequestList(
    CampaignSellerAdvertRequestIds: number[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/approve-campaign-seller-avert-request`,
      { CampaignSellerAdvertRequestIds }
    );
  }

  async rejectAdvertFromSellerRequestList(
    CampaignSellerAdvertRequestIds: number[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/reject-campaign-seller-avert-request`,
      { CampaignSellerAdvertRequestIds }
    );
  }

  async getJoinedSellerListToHouisyCampaign(
    CampaignId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CampaignJoinRequestListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-housiy-campaign-joined-seller-list`,
      { CampaignId, Page, Take, searchText, OrderBy }
    );
  }

  async getAdvertListOfJoinedSellerToHousiyCampaign(
    CampaignId: number,
    SellerId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CampaignJoinedAdvertListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-housiy-campaign-joined-seller-avert-list`,
      { CampaignId, SellerId, Page, Take, searchText, OrderBy }
    );
  }

  // #endregion

  //#region idea-list start region
  async getIdeaList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    CategoryId?: number
  ): Promise<Models.ResponseModel<Models.ProjectListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/idea-list-for-admin`,
      { Page, Take, searchText, OrderBy, CategoryId }
    );
  }
  async deleteIdea(TargetIdeaId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/remove-idea`,
      { TargetIdeaId }
    );
  }
  async changeIdeaStatus(
    Id: number,
    IsEnabled
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/change-idea-status`,
      { Id, IsEnabled }
    );
  }
  async updateIdea(
    IdeaId: number,
    Name: string,
    CategoryId: number,
    ElementData: Models.ElementDataModel[],
    KeywordData: string[],
    Description: string,
    ImageList: Models.ProjectMediaModel[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/update-idea`,
      {
        IdeaId,
        Name,
        CategoryId,
        ElementData,
        KeywordData,
        Description,
        ImageList,
      }
    );
  }
  async getIdeaDetail(
    TargetIdeaId: number
  ): Promise<Models.ResponseModel<Models.ProjectModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/get-idea-detail`,
      { TargetIdeaId }
    );
  }

  // #endregion

  //#region product question
  async getProductQuestion(
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.ProductQuestionModelList>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-product-question-list-for-admin`,
      { Page, Take, OrderBy, searchText }
    );
  }

  async getQuestionListOfProduct(
    ProductId: number,
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.ProductQuestionModelForPanel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-products-question-list`,
      { ProductId, Page, Take, OrderBy, searchText }
    );
  }

  async rejectProductQuestion(
    ProductQuestionId: number
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/reject-product-question`,
      { ProductQuestionId }
    );
  }

  async approveProductQuestion(
    ProductQuestionId: number
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/approve-product-question`,
      { ProductQuestionId }
    );
  }

  // #endregion
  // #idea-project-detail question start

  async getProjectDetailQuestionList(
    ProjectId: number,
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.ProjectQuestionListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/get-projects-question-list`,
      { ProjectId, Page, Take, OrderBy, searchText }
    );
  }

  async rejectProjectQuestion(
    ProjectQuestionId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/reject-project-question`,
      { ProjectQuestionId }
    );
  }

  // #idea-project-detail question end

  //#region idea-project-product
  async searchProductsForProject(
    SearchText: string,
    Url: string
  ): Promise<Models.ResponseModel<Models.ProductModelForProject[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/search-products-for-project`,
      { SearchText, Url }
    );
  }

  async saveProductToProject(
    ProjectId: number,
    ProductList: Models.ProjectProductInnerModel[],
    ImageList: { MediaId: number; PinLocations: string }[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/save-product-to-project`,
      { ProjectId, ProductList, ImageList }
    );
  }

  async getProjectProductList(
    ProjectId: number,
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.ProjectProductListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/product-list-for-project`,
      { ProjectId, Page, Take, OrderBy, searchText }
    );
  }

  async deleteProductFromProject(
    ProjectProductId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/delete-product-from-project`,
      { ProjectProductId }
    );
  }
  //#endregion

  //#region ProductSimilar

  async getProductSimilarList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductSimilarModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-product-similar-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async mergeProductSimilar(
    ProductSimilarId: number,
    ToModelNo1: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/merge-product-similar`,
      { ProductSimilarId, ToModelNo1 }
    );
  }

  async deleteProductSimilar(
    ProductSimilarId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/delete-product-similar`,
      { ProductSimilarId }
    );
  }

  //#endregion

  //#region Agreement
  async getAgreementList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsEnabled?: number
  ): Promise<Models.ResponseModel<Models.AgreementListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-agreement-list`,
      { Page, Take, searchText, OrderBy, IsEnabled }
    );
  }

  async getAgreementDetail(
    ContentType: number
  ): Promise<Models.ResponseModel<Models.AgreementModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-agreement-detail`,
      { ContentType }
    );
  }

  async updateAgreement(
    ContentId: number,
    ContentType: number,
    Title: string,
    OrderBy: number,
    Description: string,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-agreement`,
      { ContentId, ContentType, Title, OrderBy, Description, IsEnabled }
    );
  }
  //#endregion

  //#region customer shipping price settings start
  async getCustomerShippingPriceList(
    Page: number,
    Take: number,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CustomerShippingPriceListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-customer-cargo-price-list`,
      { Page, Take, OrderBy }
    );
  }

  async addCustomerShippingPrice(
    MinPrice: string,
    MaxPrice: string,
    CargoPrice: string,
    IsFreeShipping: boolean
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/create-customer-cargo-price`,
      { MinPrice, MaxPrice, CargoPrice, IsFreeShipping }
    );
  }

  async updateCustomerShippingPrice(
    CustomertCargoPriceId: number,
    MinPrice: string,
    MaxPrice: string,
    CargoPrice: string,
    IsFreeShipping: boolean
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/update-customer-cargo-price`,
      { CustomertCargoPriceId, MinPrice, MaxPrice, CargoPrice, IsFreeShipping }
    );
  }

  async removeCustomerShippingPrice(
    CustomerCargoPriceId: number
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/delete-customer-cargo-price`,
      { CustomerCargoPriceId }
    );
  }
  //#endregion

  // #region idea-project question list start
  async getAllIdeaProjectQuestionList(
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.AllProjectQuestionListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/get-all-project-question-list-for-admin`,
      { Page, Take, OrderBy, searchText }
    );
  }
  async getWaitingApprovalQuestionsList(
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.WaitingApprovalQuestionListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/get-waiting-project-question-list-for-admin`,
      { Page, Take, OrderBy, searchText }
    );
  }

  async approveProjectQuestion(
    ProjectQuestionId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/approve-project-question`,
      { ProjectQuestionId }
    );
  }

  // #region idea-project question list end
  //list dynamic start

  async createDynamicList(
    Type: number,
    ShownType: number,
    Title: string,
    ButtonTitle: string,
    ButtonUrl: string,
    Description: string,
    CanSellerPromote: boolean,
    OneDaySellerPromotePrice: string,
    ThreeDaySellerPromotePrice: string,
    SevenDaySellerPromotePrice: string,
    FourteenDaySellerPromotePrice: string,
    Items: Models.ItemModel[],
    Placements: Models.PlacementModel[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/create-dynamic-list`,
      {
        Type,
        ShownType,
        Title,
        ButtonTitle,
        ButtonUrl,
        Description,
        CanSellerPromote,
        OneDaySellerPromotePrice,
        ThreeDaySellerPromotePrice,
        SevenDaySellerPromotePrice,
        FourteenDaySellerPromotePrice,
        Items,
        Placements,
      }
    );
  }

  async getDynamicListForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.DynamicListListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/get-dynamic-lists-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async deleteDynamicList(
    DynamicListId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/delete-dynamic-list`,
      { DynamicListId }
    );
  }

  async getDynamicListDetail(
    DynamicListId: number
  ): Promise<Models.ResponseModel<Models.DynamicListDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/get-dynamic-list-detail`,
      { DynamicListId }
    );
  }

  async updateDynamicList(
    DynamicListId: number,
    ShownType: number,
    Title: string,
    ButtonTitle: string,
    ButtonUrl: string,
    Description: string,
    CanSellerPromote: boolean,
    OneDaySellerPromotePrice: string,
    ThreeDaySellerPromotePrice: string,
    SevenDaySellerPromotePrice: string,
    FourteenDaySellerPromotePrice: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/update-dynamic-list`,
      {
        DynamicListId,
        ShownType,
        Title,
        ButtonTitle,
        ButtonUrl,
        Description,
        CanSellerPromote,
        OneDaySellerPromotePrice,
        ThreeDaySellerPromotePrice,
        SevenDaySellerPromotePrice,
        FourteenDaySellerPromotePrice,
      }
    );
  }

  async getDynamicListItems(
    DynamicListId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.DynamicListItemModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/get-dynamic-list-items`,
      { DynamicListId, Page, Take, searchText, OrderBy }
    );
  }

  async deleteItemFromDynamicList(
    DynamicListItemId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/delete-dynamic-list-item`,
      { DynamicListItemId }
    );
  }

  async addItemToDynamicList(
    DynamicListId: number,
    ItemIds: number[],
    Medias: Models.DynamicListAddingMediaModel[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/add-dynamic-list-item`,
      { DynamicListId, ItemIds, Medias }
    );
  }

  async getPlacementList(
    DynamicListId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.DynamicListPlacementModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/get-dynamic-list-placements`,
      { DynamicListId, Page, Take, searchText, OrderBy }
    );
  }

  async deletePlacementList(
    DynamicListPlacementId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/delete-dynamic-list-placement`,
      { DynamicListPlacementId }
    );
  }

  async addDynamicListPlacement(
    DynamicListId: number,
    PageLocation: number,
    CategoryId: number,
    SortOrder: number,
    IsShownOnWeb: boolean,
    IsShownOnMobileApp: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_DYNAMICLIST_URL}/add-dynamic-list-placement`,
      {
        DynamicListId,
        PageLocation,
        CategoryId,
        SortOrder,
        IsShownOnWeb,
        IsShownOnMobileApp,
      }
    );
  }
  //list dynamin end
  //#region seller shipping price settings start
  async getSellerShippingPriceList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerShippingPriceListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-seller-cargo-price-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getCargoCompaniesList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CargoCompaniesListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-cargo-companies-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async addSellerShippingPrice(
    CargoCompanyId: number,
    MinDesi: string,
    MaxDesi: string,
    CargoPrice: string,
    IsFreeShipping: boolean
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/create-seller-cargo-price`,
      { CargoCompanyId, MinDesi, MaxDesi, CargoPrice, IsFreeShipping }
    );
  }
  async updateSellerShippingPrice(
    SellerCargoPriceId: number,
    CargoCompanyId: number,
    MinDesi: string,
    MaxDesi: string,
    CargoPrice: string,
    IsFreeShipping: boolean
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/update-seller-cargo-price`,
      {
        SellerCargoPriceId,
        CargoCompanyId,
        MinDesi,
        MaxDesi,
        CargoPrice,
        IsFreeShipping,
      }
    );
  }

  async removeSellerShippingPrice(
    SellerCargoPriceId: number
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/delete-seller-cargo-price`,
      { SellerCargoPriceId }
    );
  }

  //#endregion

  //#region order list

  async getOrderList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.OrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-order-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getOrderDetail(
    UserOrderId: number
  ): Promise<Models.ResponseModel<Models.AdminOrderDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-order-detail-for-admin`,
      { UserOrderId }
    );
  }

  async getCanceledOrderListBySeller(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CanceledOrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-canceled-by-seller-order-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }
  async getCanceledOrderListByUser(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.CanceledOrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-canceled-by-user-order-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getOrderLateList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.OrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-delayed-order-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  //#endregion

  //#region Faq
  async getFaqList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    IsEnabled?: number
  ): Promise<Models.ResponseModel<Models.FaqListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-faq-list`,
      { Page, Take, searchText, OrderBy, IsEnabled }
    );
  }

  async getFaqDetail(
    FaqId: number
  ): Promise<Models.ResponseModel<Models.FaqModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-faq-detail`,
      { FaqId }
    );
  }

  async createFaq(
    Question: string,
    Answer: string,
    OrderBy: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-faq`,
      { Question, Answer, OrderBy, IsEnabled }
    );
  }

  async updateFaq(
    FaqId: number,
    Question: string,
    Answer: string,
    OrderBy: number,
    IsEnabled: boolean
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-faq`,
      { FaqId, Question, Answer, OrderBy, IsEnabled }
    );
  }

  async deleteFaq(FaqId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/delete-faq`,
      { FaqId }
    );
  }
  //#endregion

  //#region SocialMedia
  async getSocialMediaAccountList(): Promise<
    Models.ResponseModel<Models.SocialMediaAccountModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-social-media-account-list`,
      {}
    );
  }

  async updateSocialMediaAccount(
    ContentType: number,
    Title: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-social-media-account`,
      { ContentType, Title }
    );
  }
  //#endregion

  //#region Product-Advert start
  async getEvaluationList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.EvaluateAdvertListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-evaluated-product-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }
  async getProductEvaluationsForDetail(
    ProductId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.EvaluateAdvertDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-products-evaluate-list-for-admin`,
      { ProductId, Page, Take, searchText, OrderBy }
    );
  }
  async getAdvertEvaluationsForDetail(
    AdvertId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.EvaluateAdvertDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-averts-evaluate-list-for-admin`,
      { AdvertId, Page, Take, searchText, OrderBy }
    );
  }
  async getStoreEvaluationsForDetail(
    SellerId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.EvaluateAdvertDetailModelForSeller>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-store-evaluate-list-for-admin`,
      { SellerId, Page, Take, searchText, OrderBy }
    );
  }
  //#endregion Product-Advert end

  //#region BrandRequest Start
  async getBrandRequestList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.BrandRequestListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/brand-request-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async deleteBrandRequest(
    RequestId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/delete-brand-request`,
      { RequestId }
    );
  }

  async deleteCategoryRequest(
    RequestId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-seller-category-request`,
      { RequestId }
    );
  }
  //#endregion BrandRequest End

  //#region excel start
  async getExcelUploadSummary(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.UploadedExcelLogModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/excel-upload-summary-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }
  //#endregion excel start

  //#region avertisement start
  async getAdSponsorPriceList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.AdvertisementSponsorPriceListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ADVERTISEMENT_URL}/get-avertisement-price-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async createAdSponsorPrice(
    AdvertisementType: number,
    DayCount: number,
    TotalPrice: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ADVERTISEMENT_URL}/create-avertisement-price`,
      { AdvertisementType, DayCount, TotalPrice }
    );
  }

  async getListSponsorPriceList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ListSponsorPriceListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ADVERTISEMENT_URL}/get-avertisement-price-list-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }
  async updateSponsorPrice(
    AdvertisementPriceId: number,
    AdvertisementType: number,
    DayCount: number,
    TotalPrice: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ADVERTISEMENT_URL}/update-avertisement-price`,
      { AdvertisementPriceId, AdvertisementType, DayCount, TotalPrice }
    );
  }

  async getSponsoredProductList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SponsoredProductListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ADVERTISEMENT_URL}/get-seller-all-avertisement-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async suspendSponsoredProduct(
    AdvertisementId: number
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ADVERTISEMENT_URL}/suspend-seller-avertisement`,
      { AdvertisementId }
    );
  }

  async getSponsoredProfessionalList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SponsoredProfessionalListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ADVERTISEMENT_URL}/get-pro-all-avertisement-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async suspendSponsoredProfessional(
    AdvertisementId: number
  ): Promise<Models.ResponseModel<string>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ADVERTISEMENT_URL}/suspend-professional-avertisement`,
      { AdvertisementId }
    );
  }

  //#endregion avertisement end

  //#region Pro Evaluate Data Start
  async getProEvaluateSummary(
    ProId: number
  ): Promise<Models.ResponseModel<Models.ProEvaluationSummaryModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-pro-evaluate-summary`,
      { ProId }
    );
  }

  async getProEvaluateList(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkEvaluateListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-pro-evaluate-list`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }
  //#endregion Pro Evaluate Data End

  //#region Pro-Detail-Request-Offer-Work-Services-Start
  async getProRequestListForAdmin(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProRequestListModelForAdmin>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-request-list-for-admin`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }

  async getProOfferListForAdmin(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProOfferListModelForAdmin>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-offer-list-for-admin`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }

  async getProWorkListForAdmin(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProWorkModelListForAdmin>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-work-list-for-admin`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }
  //#endregion Pro-Detail-Request-Offer-Work-Services-End

  //#region Finance start
  async getCompletedSellerPaymentList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCompletedPaymentList>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-completed-seller-payments-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerWaitingInvoicePaymentActionList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    Type: number
  ): Promise<Models.ResponseModel<Models.WaitingInvoiceSellerPaymentsModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-waiting-invoice-seller-payment-action`,
      { Page, Take, searchText, OrderBy, Type }
    );
  }

  async updateInvoicePaymentAction(
    PaymentId: number,
    FilePath: string,
    InvoiceNo: string,
    InvoiceDate: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/update-invoice-payment-action`,
      { PaymentId, FilePath, InvoiceNo, InvoiceDate }
    );
  }

  async cancelPaymentAction(
    ActionId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/cancel-payment-action`,
      { ActionId }
    );
  }

  async createPaymentAction(
    Type: number,
    TotalPrice: string,
    TaxRate: number,
    SellerIds: number[],
    ProIds: number[]
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/create-payment-action`,
      { Type, TotalPrice, TaxRate, SellerIds, ProIds }
    );
  }

  async getInvoicedSellerPaymentActionsForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.InvoicedSellerPaymentsModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-invoiced-seller-payment-actions-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getCreateReceiptSellerList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WaitingReceiptSellerModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-create-receipt-seller-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerPaymentActionsWithoutReceipt(
    SellerId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerPaymentsWithoutRecipteModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-seller-payment-actions-without-receipt`,
      { SellerId, Page, Take, searchText, OrderBy }
    );
  }

  async createSellerReceipt(
    SellerId: number,
    PaymentIds: number[],
    PlannedPayDate: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/create-seller-receipt`,
      { SellerId, PaymentIds, PlannedPayDate }
    );
  }

  async getSellerReceipts(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerReceiptModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-seller-receipts-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async saveReceiptPayment(
    ReceiptId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/save-receipt-payment`,
      { ReceiptId }
    );
  }

  async cancelReceipt(ReceiptId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/cancel-receipt`,
      { ReceiptId }
    );
  }

  async getReceiptDetail(
    ReceiptId: number
  ): Promise<Models.ResponseModel<Models.ReceiptDetailForAdmin>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-receipt-detail-for-admin`,
      { ReceiptId }
    );
  }

  async getReceiptPaymentAction(
    ReceiptId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ReceiptPaymentRowModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-receipt-payment-actions-for-admin`,
      {
        ReceiptId,
        Page,
        Take,
        searchText,
        OrderBy,
      }
    );
  }

  async getReceiptPaymentTypeAction(
    ReceiptId: number,
    PaymentType: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ReceiptPaymentRowModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-seller-invoiced-receipt-detail-for-admin`,
      {
        ReceiptId,
        Page,
        PaymentType,
        Take,
        searchText,
        OrderBy,
      }
    );
  }

  async getProReceiptPaymentTypeAction(
    ReceiptId: number,
    PaymentType: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ReceiptPaymentRowModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-pro-invoiced-receipt-detail-for-admin`,
      {
        ReceiptId,
        Page,
        PaymentType,
        Take,
        searchText,
        OrderBy,
      }
    );
  }

  async getSellerPaidReceiptList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerPaidReceiptModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-paid-seller-receipts-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerUnPaidReceiptList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerPaidReceiptModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-paid-uncomplete-seller-receipts-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProWaitingPaymentsList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProPaymentModelForFinance>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-waiting-pro-payments-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProDelayedPaymentsList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProPaymentModelForFinance>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-delayed-pro-payments-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProCompletedPaymentsList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProPaymentModelForFinance>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-completed-pro-payments-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProWaitingInvoicePaymentActionList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number,
    Type: number
  ): Promise<Models.ResponseModel<Models.WaitingInvoiceProPaymentsModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-waiting-invoice-pro-payment-action`,
      { Page, Take, searchText, OrderBy, Type }
    );
  }

  async getInvoicedProPaymentActionsForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.InvoicedProPaymentsModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-invoiced-pro-payment-actions-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getCreateReceiptProList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WaitingReceiptProModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-create-receipt-pro-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProPaymentActionsWithoutReceipt(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProPaymentsWithoutRecipteModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-pro-payment-actions-without-receipt`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }

  async createProReceipt(
    ProId: number,
    PaymentIds: number[],
    PlannedPayDate: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/create-pro-receipt`,
      { ProId, PaymentIds, PlannedPayDate }
    );
  }

  async getProReceipts(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProReceiptModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-pro-receipts-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProPaidReceiptList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProPaidReceiptModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-paid-pro-receipts-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProWaitingAdvertisementPayments(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WaitingAdvertiseInvoiceProModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-waiting-invoice-pro-avertise-payment-action`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSellerWaitingAdvertisementPayments(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WaitingAdvertiseInvoiceSellerModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_FINANCE_URL}/get-waiting-invoice-seller-avertise-payment-action`,
      { Page, Take, searchText, OrderBy }
    );
  }
  //#endregion Finance end
  //#region Work-Messages-Start
  async getMessagesForAdmin(
    WorkId: number,
    OldestMessageDate?: number
  ): Promise<Models.ResponseModel<Models.MessageListDataModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-messages-for-admin`,
      { WorkId, OldestMessageDate }
    );
  }
  //#endregion Work-Messages-End

  //#region Site-User
  async getSiteUserList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SiteUserListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-siteuser-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getUserDetailForAdmin(
    UserId: number
  ): Promise<Models.ResponseModel<Models.SiteUserModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-user-detail-for-admin`,
      { UserId }
    );
  }

  async deleteUser(UserId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/delete-user`,
      { UserId }
    );
  }

  async blockUser(UserId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/block-user`,
      { UserId }
    );
  }

  async unBlockUser(UserId: number): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/unblock-user`,
      { UserId }
    );
  }

  async updateUserForAdmin(
    UserId: number,
    Photo: File | undefined,
    BirthDate: number,
    NameSurname: string,
    Phone: string,
    Email: string,
    Gender: number
  ): Promise<Models.ResponseModel<null>> {
    let formData = new FormData();
    formData.append("UserId", JSON.stringify(UserId));
    formData.append("Photo", Photo || "");
    formData.append("BirthDate", JSON.stringify(BirthDate));
    formData.append("NameSurname", NameSurname);
    formData.append("Phone", Phone);
    formData.append("Email", Email);
    formData.append("Gender", JSON.stringify(Gender));
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/update-user-for-admin`,
      formData
    );
  }

  async getUserAddressListForAdmin(
    UserId: number
  ): Promise<Models.ResponseModel<Models.SiteUserAddressModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-user-address-list-for-admin`,
      { UserId }
    );
  }

  async updateUserAddress(
    UserId: number,
    AddressId: number,
    CountryId: number,
    DistrictId: number,
    CityId: number,
    ZipCode: string,
    AddressDescription: string,
    AddressName: string,
    Phone: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/update-address`,
      {
        UserId,
        AddressId,
        CountryId,
        DistrictId,
        CityId,
        ZipCode,
        AddressDescription,
        AddressName,
        Phone,
      }
    );
  }

  async deleteUserAddress(
    UserId: number,
    AddressId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/remove-address`,
      { UserId, AddressId }
    );
  }

  async getUserOrdersForAdmin(
    UserId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.UserOrderListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-user-orders-for-admin`,
      { UserId, Page, Take, searchText, OrderBy }
    );
  }

  async getUserWorksForAdmin(
    UserId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.UserWorkListForAdminModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-user-orders-for-admin`,
      { UserId, Page, Take, searchText, OrderBy }
    );
  }

  async getUserProductEvaluatesForAdmin(
    UserId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.UserProductEvaluateListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-user-product-evaluates-for-admin`,
      { UserId, Page, Take, searchText, OrderBy }
    );
  }

  async getUserProfessionalEvaluatesForAdmin(
    UserId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.UserWorkListForAdminModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-user-product-evaluates-for-admin`,
      { UserId, Page, Take, searchText, OrderBy }
    );
  }

  async getUsersDiscountCouponListForAdmin(
    UserId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.DiscountCouponListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-users-discount-coupon-list-for-admin`,
      { UserId, Page, Take, searchText, OrderBy }
    );
  }

  async getUsersShoppingCartListForAdmin(
    UserId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<
    Models.ResponseModel<Models.ProductAdvertListModelForShoppingCart>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-users-shopping-cart-list-for-admin`,
      { UserId, Page, Take, searchText, OrderBy }
    );
  }

  async removeFromShoppingCartHandler(
    ShoppingCartItemId: number,
    UserId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/remove-from-shopping-cart`,
      { ShoppingCartItemId, UserId }
    );
  }

  async getUserProductQuestionsForAdminHandler(
    UserId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductQuestionModelForPanel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SITE_USER_URL}/get-user-product-questions-for-admin`,
      { UserId, Page, Take, searchText, OrderBy }
    );
  }
  //#endregion

  //#region Pro-Report-Services
  async getReportedProList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-reported-pro-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getProReportsForAdmin(
    ProId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.WorkReportlistModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-reports-for-admin`,
      { ProId, Page, Take, searchText, OrderBy }
    );
  }

  async deleteProReportForAdmin(
    ReportId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/delete-pro-report-for-admin`,
      { ReportId }
    );
  }
  //#endregion

  //#region SingleSeo
  async updateSingleProSeo(
    ProId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-single-pro-seo`,
      { ProId, SeoTitle, SeoDescription }
    );
  }

  async updateSingleIdeaSeo(
    IdeaId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-single-idea-seo`,
      { IdeaId, SeoTitle, SeoDescription }
    );
  }

  async updateSingleProductSeo(
    ProductId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-single-product-seo`,
      { ProductId, SeoTitle, SeoDescription }
    );
  }
  //#endregion

  //#region SEO
  async getGeneralSeoList(): Promise<
    Models.ResponseModel<Models.GeneralSeoModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-general-seo-list`,
      {}
    );
  }

  async getIdeaCategorySeoData(
    CategoryId: number
  ): Promise<Models.ResponseModel<Models.CategorySeoData>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-idea-category-seo-data`,
      { CategoryId }
    );
  }

  async getProCategorySeoData(
    CategoryId: number
  ): Promise<Models.ResponseModel<Models.CategorySeoData>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-pro-category-seo-data`,
      { CategoryId }
    );
  }

  async getSellerCategorySeoData(
    CategoryId: number
  ): Promise<Models.ResponseModel<Models.CategorySeoData>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-seller-category-seo-data`,
      { CategoryId }
    );
  }

  async updateGeneralSeoData(
    SeoTitle: string,
    SeoDescription: string,
    Page: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-general-seo`,
      { SeoTitle, SeoDescription, Page }
    );
  }

  async updateIdeaCategorySeoData(
    CategoryId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-idea-category-seo-data`,
      { CategoryId, SeoTitle, SeoDescription }
    );
  }

  async updateIdeaSeoData(
    CategoryId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-idea-seo-data`,
      { CategoryId, SeoTitle, SeoDescription }
    );
  }

  async updateProCategorySeoData(
    CategoryId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-pro-category-seo-data`,
      { CategoryId, SeoTitle, SeoDescription }
    );
  }

  async updateProSeoData(
    CategoryId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-pro-seo-data`,
      { CategoryId, SeoTitle, SeoDescription }
    );
  }

  async updateProductSeoData(
    CategoryId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-product-seo-data`,
      { CategoryId, SeoTitle, SeoDescription }
    );
  }

  async updateSellerCategorySeoData(
    CategoryId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-seller-category-seo-data`,
      { CategoryId, SeoTitle, SeoDescription }
    );
  }

  async updateSellerSeoData(
    SellerId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-seller-seo-data`,
      { SellerId, SeoTitle, SeoDescription }
    );
  }

  async getSellerCategoryGroupSeoData(
    GroupId: number
  ): Promise<Models.ResponseModel<Models.CategorySeoData>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-seller-category-group-seo-data`,
      { GroupId }
    );
  }
  async updateSellerCategoryGroupSeoData(
    GroupId: number,
    SeoTitle: string,
    SeoDescription: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-seller-category-group-seo-data`,
      { GroupId, SeoTitle, SeoDescription }
    );
  }
  //#endregion

  //#region Xml-Management
  async getCategoryXmlData(): Promise<
    Models.ResponseModel<Models.CategoryGeneralXMLData>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/get-category-xml-data`,
      {}
    );
  }

  async updateCategoryXmlData(
    CategoryId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-category-xml-data`,
      { CategoryId }
    );
  }

  async updateCimriXmlData(): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/update-cimri-xml-data`,
      {}
    );
  }
  //#endregion

  //#region Announcement
  async getWaitingAnnouncementList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.AnnouncementListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-waiting-announcement-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getSendedAnnouncementList(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.AnnouncementListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-sended-announcement-list`,
      { Page, Take, searchText, OrderBy }
    );
  }

  async getAnnouncementDetail(
    AnnouncementId: number
  ): Promise<Models.ResponseModel<Models.AnnouncementDetailModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-announcement-detail`,
      { AnnouncementId }
    );
  }

  async createAnnouncement(
    Title: string,
    Description: string,
    RedirectUrl: string,
    PhotoUrl: string,
    WhereToShow: number,
    ReceiverData: number[],
    IsSendSms: boolean,
    IsSendPush: boolean,
    IsSendWebPush: boolean,
    IsSendLater: boolean,
    SendOption: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-announcement`,
      {
        Title,
        Description,
        RedirectUrl,
        PhotoUrl,
        WhereToShow,
        ReceiverData,
        IsSendSms,
        IsSendPush,
        IsSendWebPush,
        IsSendLater,
        SendOption,
      }
    );
  }

  async updateAnnouncement(
    AnnouncementId: number,
    Title: string,
    Description: string,
    RedirectUrl: string,
    PhotoUrl: string,
    WhereToShow: number,
    ReceiverData: number[],
    IsSendSms: boolean,
    IsSendPush: boolean,
    IsSendWebPush: boolean,
    IsSendLater: boolean,
    SendOption: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-announcement`,
      {
        AnnouncementId,
        Title,
        Description,
        RedirectUrl,
        PhotoUrl,
        WhereToShow,
        ReceiverData,
        IsSendSms,
        IsSendPush,
        IsSendWebPush,
        IsSendLater,
        SendOption,
      }
    );
  }

  async deleteAnnouncement(
    AnnouncementId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/delete-announcement`,
      { AnnouncementId }
    );
  }

  async sendAnnouncementNotification(
    AnnouncementId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/send-announcement-notification`,
      { AnnouncementId }
    );
  }

  async createAnnouncementAndSendNotification(
    Title: string,
    Description: string,
    RedirectUrl: string,
    PhotoUrl: string,
    WhereToShow: number,
    ReceiverData: number[],
    IsSendSms: boolean,
    IsSendPush: boolean,
    IsSendWebPush: boolean,
    IsSendLater: boolean,
    SendOption: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-announcement-and-send-notification`,
      {
        Title,
        Description,
        RedirectUrl,
        PhotoUrl,
        WhereToShow,
        ReceiverData,
        IsSendSms,
        IsSendPush,
        IsSendWebPush,
        IsSendLater,
        SendOption,
      }
    );
  }
  //#endregion

  //#region Product-Detail-Services
  async getShoppingCartUsersForProduct(
    ProductId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ShoppingCartListModelForAdmin>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-shopping-cart-users-for-product`,
      { ProductId, Page, Take, searchText, OrderBy }
    );
  }

  async getProductsOtherVariations(
    ProductId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-products-other-variations`,
      { ProductId, Page, Take, searchText, OrderBy }
    );
  }

  async getProductsOtherSellersForAdmin(
    ProductId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<
    Models.ResponseModel<Models.GetProductsOtherSellersForAdminResponseModel>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-products-other-sellers-for-admin`,
      { ProductId, Page, Take, searchText, OrderBy }
    );
  }

  async getProjectListForProduct(
    ProductId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProjectListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PROJECT_URL}/project-list-for-product`,
      { ProductId, Page, Take, searchText, OrderBy }
    );
  }

  async getProductCampaignList(
    ProductId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductCampaignListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-product-campaign-list`,
      { ProductId, Page, Take, searchText, OrderBy }
    );
  }
  //#endregion

  //#region Advert-Detail-Services
  async getShoppingCartUsersForAdvert(
    AdvertId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ShoppingCartListModelForAdmin>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_ORDER_URL}/get-shopping-cart-users-for-avert`,
      { AdvertId, Page, Take, searchText, OrderBy }
    );
  }

  async getAdvertsOtherVariations(
    AdvertId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-averts-other-variations`,
      { AdvertId, Page, Take, searchText, OrderBy }
    );
  }

  async getAdvertsOtherSellersForAdmin(
    AdvertId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<
    Models.ResponseModel<Models.GetProductsOtherSellersForAdminResponseModel>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRODUCT_URL}/get-averts-other-sellers-for-admin`,
      { AdvertId, Page, Take, searchText, OrderBy }
    );
  }

  async getAdvertCampaignList(
    AdvertId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProductCampaignListModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-avert-campaign-list`,
      { AdvertId, Page, Take, searchText, OrderBy }
    );
  }
  //#endregion

  //#region ProStoreRates
  async getProStoreRates(
    ProId: number
  ): Promise<Models.ResponseModel<Models.ProStoreRateModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-store-rates`,
      { ProId }
    );
  }
  //#endregion

  //#region store rates start
  async getSellerStoreRates(
    SellerId: number
  ): Promise<Models.ResponseModel<Models.StoreRatesModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/get-seller-store-rates`,
      { SellerId }
    );
  }
  //#endregion store rates end

  //#region seller reject reason start
  async getSellerRejectReasonOptionList(
    Type: number,
    Page: number,
    Take: number,
    OrderBy: number,
    searchText: string
  ): Promise<Models.ResponseModel<Models.SellerRejectReasonList>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/get-reject-reasons`,
      { Type, Page, Take, OrderBy, searchText }
    );
  }

  async getSellerRejectReasonsCount(): Promise<
    Models.ResponseModel<Models.SellerRejectReasonsCountModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/get-reject-reasons-count`,
      {}
    );
  }

  async createSellerRejectReasonOption(
    Type: number,
    Text: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/create-reject-reason`,
      { Type, Text }
    );
  }
  async updateSellerRejectReasonOption(
    RejectReasonId: number,
    Text: string
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/update-reject-reason`,
      { RejectReasonId, Text }
    );
  }
  async removeSellerRejectReasonOption(
    RejectReasonId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SELLER_URL}/delete-reject-reason`,
      { RejectReasonId }
    );
  }

  //#endregion seller reject reason end

  //#region sub category list start
  async getSellerCategoryListForVariations(
    VariationId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCategoryListForVariations>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-list-for-variations`,
      { VariationId, Page, Take, searchText, OrderBy }
    );
  }
  async getSellerCategoryListForFeature(
    ElementId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCategoryListForElements>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-list-for-elements`,
      { ElementId, Page, Take, searchText, OrderBy }
    );
  }
  async getSellerSubCategoryList(
    CategoryId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerSubCategoryList>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-sub-category-list`,
      { CategoryId, Page, Take, searchText, OrderBy }
    );
  }
  async getSellerCategoryListForGroups(
    GroupId: number,
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.SellerCategoryListForGroup>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/seller-category-list-for-groups`,
      { GroupId, Page, Take, searchText, OrderBy }
    );
  }
  //#endregion sub category list start

  //#region Dashboard
  async getDashboardLastOrders(): Promise<
    Models.ResponseModel<Models.GetDashboardLastOrdersResponseModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-dashboard-last-orders`,
      {}
    );
  }

  async getDashboardLastWorks(
    IsRefresh: boolean
  ): Promise<
    Models.ResponseModel<Models.GetDashboardLastWorksResponseModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-dashboard-last-works`,
      { IsRefresh }
    );
  }

  async getDashboardProRecourses(): Promise<
    Models.ResponseModel<Models.GetDashboardProRecoursesResponseModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-dashboard-pro-recourses`,
      {}
    );
  }

  async getDashboardSellerRecourses(): Promise<
    Models.ResponseModel<Models.GetDashboardSellerRecoursesResponseModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-dashboard-seller-recourses`,
      {}
    );
  }

  async getDashboardTotalCounts(): Promise<
    Models.ResponseModel<Models.GetDashboardTotalCountsResponseModel>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-dashboard-total-counts`,
      {}
    );
  }

  async getOrderEarningChart(
    DateJSTime: number
  ): Promise<Models.ResponseModel<Models.GetOrderEarningChartResponseModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-order-earning-chart`,
      { DateJSTime: this.currentDateStampForPost(DateJSTime) }
    );
  }

  async getProductCategoryChart(
    IsRefresh: boolean
  ): Promise<
    Models.ResponseModel<Models.GetProductCategoryChartResponseModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-product-category-chart`,
      { IsRefresh }
    );
  }

  async getSiteUserChart(
    DateJSTime: number
  ): Promise<Models.ResponseModel<Models.GetSiteUserChartResponseModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-site-user-chart`,
      { DateJSTime: this.currentDateStampForPost(DateJSTime) }
    );
  }

  async getWorkCategoryChart(
    IsRefresh: boolean
  ): Promise<Models.ResponseModel<Models.GetWorkCategoryChartResponseModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-work-category-chart`,
      { IsRefresh }
    );
  }

  async getWorkEarningChart(
    DateJSTime: number
  ): Promise<Models.ResponseModel<Models.GetWorkEarningChartResponseModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_USER_URL}/get-work-earning-chart`,
      { DateJSTime: this.currentDateStampForPost(DateJSTime) }
    );
  }
  //#endregion

  //#region select product filter start
  async searchAvertForAdmin(
    SearchText: string,
    Page: number,
    PageSize: number,
    Order: number,
    Category: string,
    Campaign: string,
    MinPrice: string,
    MaxPrice: string,
    MinDiscountRate: string,
    MaxDiscountRate: string,
    Rate: number[],
    Elements: Models.ElementFilter[]
  ): Promise<Models.ResponseModel<Models.AvertSearchModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_SEARCH_URL}/search-avert-for-admin`,
      {
        SearchText,
        Page,
        PageSize,
        Order,
        Category,
        Campaign,
        MinPrice,
        MaxPrice,
        MinDiscountRate,
        MaxDiscountRate,
        Rate,
        Elements,
      }
    );
  }
  async searchAvertForAdminBySellerIdAsAdvertSearchResult(sellerId:number,page:number,take:number,order:number):Promise<Models.ResponseModel<Models.AvertSearchModel>>{

      const response:Models.ResponseModel<Models.ProductAdvertListModel> =await this.baseFetch(`${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-advert-list-for-admin-by-seller-Id`,{
        SellerId:sellerId,
        Page:page,
        Take:take,
        Order:order
      });
      if(response.succeeded){
        if(response.data==undefined || response.data.Data.length==0){
          return <Models.ResponseModel<Models.AvertSearchModel>>{
            succeeded:response.succeeded,
            message:response.message,
            data:{
              Data:<Models.AdvertSearchResult[]>[],
              TotalCount:response.data.TotalCount
            }
          }
        }
      }
      const avSearchModelData=response.data.Data.map(x=>{
        return {
            advertId:x.AdvertId.toString(),
            barcodeNo:x.BarcodeNo,
            buyboxPrice:x.BuyboxPrice,
            category:x.Category.split("\n"),
            productId:x.ProductId,
            price:x.SalePrice,
            mainPhoto:x.ProductMainPhoto,
            isEnabled:x.ProductIsEnabled,
            marketPrice:x.MarketPrice,
            productName:x.ProductName,
            sellerName:x.SellerName,
            stockCount:x.StockCount
        } as Models.AdvertSearchResult
      })
      return <Models.ResponseModel<Models.AvertSearchModel>>{
        succeeded:response.succeeded,
        message:response.message,
        data:{
          Data:avSearchModelData,
          TotalCount:response.data.TotalCount
        }
      }
  }

  async searchAvertForAdminBySellerCampaignIds(sellerCampaignIds:number[],page:number,take:number,order:number):Promise<Models.ResponseModel<Models.AvertSearchModel>>{
    const response:Models.ResponseModel<Models.ProductAdvertListModel> =await this.baseFetch(`${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-advert-list-for-admin-by-seller-campaign-ids`,{
      SellerCampaignIds:sellerCampaignIds,
      Page:page,
      Take:take,
      Order:order
    });
    if(response.succeeded){
      if(response.data==undefined || response.data.Data.length==0){
        return <Models.ResponseModel<Models.AvertSearchModel>>{
          succeeded:response.succeeded,
          message:response.message,
          data:{
            Data:<Models.AdvertSearchResult[]>[],
            TotalCount:response.data.TotalCount
          }
        }
      }
    }
    const avSearchModelData=response.data.Data.map(x=>{
      return {
          advertId:x.AdvertId.toString(),
          barcodeNo:x.BarcodeNo,
          buyboxPrice:x.BuyboxPrice,
          category:x.Category.split("\n"),
          productId:x.ProductId,
          price:x.SalePrice,
          mainPhoto:x.ProductMainPhoto,
          isEnabled:x.ProductIsEnabled,
          marketPrice:x.MarketPrice,
          productName:x.ProductName,
          sellerName:x.SellerName,
          stockCount:x.StockCount
      } as Models.AdvertSearchResult
    })
    return <Models.ResponseModel<Models.AvertSearchModel>>{
      succeeded:response.succeeded,
      message:response.message,
      data:{
        Data:avSearchModelData,
        TotalCount:response.data.TotalCount
      }
    }
  }
  async getActiveCampaignList(): Promise<
    Models.ResponseModel<{ CampaignId: number; CampaignName: string }[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CAMPAIGN_URL}/get-active-housiy-campaign-list-for-admin`,{}
    );
  }

  //#endregion select product filter start

  //#region linked categories start
  async getSellerLinkedCategoriesListForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<
    Models.ResponseModel<Models.SellerCategoryLinkRelationAdminModel>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/get-seller-linked-categories-for-admin`,
      { Page, Take, searchText, OrderBy }
    );
  }
  async removeSellerLinkedCategoryForAdmin(
    LinkRelationId: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/delete-seller-category-link-relation`,
      { LinkRelationId }
    );
  }
  async createSellerCategoryLinkRelation(
    SelectedCategoryId: number,
    LinkedCategoryId: number,
    CategoryOrder: number
  ): Promise<Models.ResponseModel<null>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_CATEGORY_URL}/create-seller-category-link-relation`,
      { SelectedCategoryId, LinkedCategoryId, CategoryOrder }
    );
  }
  //#endregion linked categories end

  //#endregion penalty fee start
  async getWorkPenaltyFeeList(): Promise<
    Models.ResponseModel<Models.WorkPenaltyFeeListResponseModel[]>
  > {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/get-work-penalty-fee-list`,
      {}
    );
  }
  async getUpdateWorkPenaltyFeeList(
    Type: number,
    ValueType: number,
    Value: number
  ): Promise<Models.ResponseModel<Models.WorkPenaltyFeeListResponseModel[]>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_WORK_URL}/update-work-penalty-fee`,
      { Type, ValueType, Value }
    );
  }
  //#endregion  penalty fee end

  //#region pro-subscription-payments-for-admin
  async getProSubscriptionPaymentsForAdmin(
    Page: number,
    Take: number,
    searchText: string,
    OrderBy: number
  ): Promise<Models.ResponseModel<Models.ProSubscriptionPaymentsModel>> {
    return await this.baseFetch(
      `${Constants.SERVICES.API_ADMIN_PRO_URL}/get-pro-subscription-payments-for-admin`,
      {Page, Take, searchText, OrderBy}
    );
  }

  //#endregion pro-subscription-payments-for-admin end

  //#region Banner
  async getBannerList(body: { Page: number; Take: number; searchText: string; OrderBy: number; }): Promise<Models.ResponseModel<{ Data: Models.Banner[]; TotalCount: number; }>> {
    return await this.baseFetch(`${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-all-banner-paginated`, body);
  }

  async getBannerById(body: { Id: number; }): Promise<Models.ResponseModel<Models.Banner>> {
    return await this.baseFetch(`${Constants.SERVICES.API_ADMIN_GENERAL_URL}/get-by-id-banner`, body);
  }

  async deleteBannerById(body: { Id: number; }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_ADMIN_GENERAL_URL}/delete-banner`, body);
  }

  async createBanner(body: {
    Name: string; Photo: string | File; TargetUrl: string; Description: string; IsEnabled: boolean; BackgroundColor: string; TargetType: string; SkipSecond: string; StartDate: Date; EndDate: Date;
  }): Promise<Models.ResponseModel<Models.Banner>> {
    const formData = new FormData();
    formData.append("Name", body.Name);
    formData.append("Photo", body.Photo || "");
    formData.append("TargetUrl", body.TargetUrl);
    formData.append("Description", body.Description);
    formData.append("IsEnabled", JSON.stringify(body.IsEnabled));
    formData.append("BackgroundColor", body.BackgroundColor);
    formData.append("TargetType", body.TargetType);
    formData.append("SkipSecond", body.SkipSecond);
    formData.append("StartDate", body.StartDate.toISOString());
    formData.append("EndDate", body.EndDate.toISOString());
    return await this.baseFetch(`${Constants.SERVICES.API_ADMIN_GENERAL_URL}/create-banner`, formData);
  }

  async updateBanner(body: {
    Id: string; Name: string; Photo: string | File; TargetUrl: string; Description: string; IsEnabled: boolean; BackgroundColor: string; TargetType: string; SkipSecond: string; StartDate: Date; EndDate: Date;
  }): Promise<Models.ResponseModel<Models.Banner>> {
    const formData = new FormData();
    formData.append("Id", body.Name);
    formData.append("Name", body.Name);
    formData.append("Photo", body.Photo || "");
    formData.append("TargetUrl", body.TargetUrl);
    formData.append("Description", body.Description);
    formData.append("IsEnabled", JSON.stringify(body.IsEnabled));
    formData.append("BackgroundColor", body.BackgroundColor);
    formData.append("TargetType", body.TargetType);
    formData.append("SkipSecond", body.SkipSecond);
    formData.append("StartDate", body.StartDate.toISOString());
    formData.append("EndDate", body.EndDate.toISOString());
    return await this.baseFetch(`${Constants.SERVICES.API_ADMIN_GENERAL_URL}/update-banner`, body);
  }

  //#endregion

  //#region GroupParticipantSettings
  async getGroupParticipantSettingsList(body: { page: number; take: number; searchText: string; sellerId: number; includeGeneral?: boolean; includeSpecial?: boolean; }): Promise<Models.ResponseModel<{ Data: Models.GroupParticipantSetting[]; TotalCount: number; }>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/paginated-list-group-participant-setting`, body);
  }

  async getGroupParticipantSettingsById(body: { id: number; }): Promise<Models.ResponseModel<Models.GroupParticipantSetting>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/get-by-id-group-participant-setting`, body);
  }

  async deleteGroupParticipantSettings(body: { id: number; }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/delete-group-participant-setting`, body);
  }

  async createGroupParticipantSettings(body: { name: string; description: string; participantCount: number; isGeneral: boolean; sellerId: number | null; }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/create-group-participant-setting`, body);
  }

  async updateGroupParticipantSettings(body: { id: number; name: string; description: string; participantCount: number; isGeneral: boolean; sellerId: number | null; }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/update-group-participant-setting`, body);
  }

  //#endregion

  //#region GroupLiveTimeSetting
  // todo add includeGeneral
  async getGroupLiveTimeSettingsList(body: { page: number; take: number; searchText: string; sellerId: number | null; includeGeneral?: boolean; includeSpecial?: boolean; orderBy: number; }): Promise<Models.ResponseModel<{ Data: Models.GroupLiveTimeSetting[]; TotalCount: number; }>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/paginated-list-group-live-time-setting`, body);
  }

  async getGroupLiveTimeSettingsByParticipantId(body: { groupParticipantSettingId: number; sellerId: number | null; }): Promise<Models.ResponseModel<Models.GroupLiveTimeSetting[]>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/live-times-by-participant-id`, body);
  }

  async getGroupLiveTimeSettingsById(body: { id: number; }): Promise<Models.ResponseModel<Models.GroupLiveTimeSetting>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/get-by-id-group-live-time-setting`, body);
  }

  async deleteGroupLiveTimeSettings(body: { id: number; }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/delete-group-live-time-setting`, body);
  }

  async createGroupLiveTimeSettings(body: { groupParticipantSettingId: number; isGeneral: boolean; sellerId: number | null; liveTime: number }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/create-group-live-time-setting`, body);
  }

  async updateGroupLiveTimeSettings(body: { id: number; groupParticipantSettingId: number; isGeneral: boolean; sellerId: number | null; liveTime: number }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/update-group-live-time-setting`, body);
  }

  //#endregion

  //#region GroupBuy
  async getGroupBuyList(body: { page: number; take: number; searchText: string; sellerId: null | number; }): Promise<Models.ResponseModel<{ Data: Models.GroupBuyListItem[]; TotalCount: number; }>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/paginated-list-group-for-product`, body);
  }

  async getGroupBuyById(body: { id: number; }): Promise<Models.ResponseModel<Models.GroupBuyById>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/get-by-id-group-for-product`, body);
  }

  async getGroupBuyParticipants(body: { groupId: number; page: number; take: number; searchText: string; }): Promise<Models.ResponseModel<{ Data: Models.GroupBuyParticipant[]; TotalCount: number; }>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/get-participants-by-group-id`, body);
  }

  async deleteGroupBuy(body: { id: number; }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/delete-group-for-product`, body);
  }

  async createGroupBuy(body: { name: string; description: string; groupParticipantSettingId: number; groupLifeHours: number; productAdvertId: number; deposit: number; groupBuyingPrice: number; canGroupStartFrom: string | null }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/create-group-for-product`, body);
  }

  async updateGroupBuy(body: { id: number; name: string; description: string; groupParticipantSettingId: number; groupLifeHours: number; productAdvertId: number; deposit: number; groupBuyingPrice: number; canGroupStartFrom: string | null }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/update-group-live-time-setting`, body);
  }

  async extendGroupBuy(body: { groupId: number; endDate: string; }): Promise<Models.ResponseModel<never>> {
    return await this.baseFetch(`${Constants.SERVICES.API_GROUP_BUY_URL}/extend-end-date`, body);
  }

  //#endregion


}

export default new ApiService();
