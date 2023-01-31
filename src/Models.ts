export interface ResponseModel<T> {
  succeeded: boolean,
  message: string,
  data: T
}

export interface GeneralBankModel {
  Id: string,
  Name: string
}

export interface BadgeModel {
  ProRequestCount: number,
  WaitingCategoryCount: number,
  WaitingBrandCount: number,
  WaitingAdvertCount: number,
  WaitingProductUpdateCount: number,
  WaitingApproveAdvertQuestionCount: number,
  WaitingApproveProjectCount: number,
  WaitingProSupportCount: number,
  WaitingSellerSupportCount: number,
  WaitingUserSupportCount: number,
  WaitingApproveProjectQuestionCount: number,
  WaitingBillPaymentsSeller: number,
  SellerRecourseCount: number,
  ProRecourseCount: number,
  WaitingProReportCount: number,
  WaitingBillPaymentsPro: number,
  WaitingReceiptSeller: number,
  WaitingReceiptPro: number
}

export interface GeneralLocationModel {
  id: string,
  name: string
}

export interface ProductSimilarModel {
  Data: ProductSimilarListModel[],
  TotalCount: number
}

export interface ProductSimilarListModel {
  ProductSimilarId: number,
  ModelNo1: string,
  ModelNo1Images: string[],
  ModelNo1ProductId: number,
  ModelNo2: string,
  ModelNo2Images: string[],
  ModelNo2ProductId: number,
}
// <<--- Pro Category --- >>

export interface ProCategoryListModel {
  Data: ProCategoryListInnerModel[],
  TotalCount: number,
}

export interface ProCategoryListInnerModel {
  Id: number,
  PhotoPath: string,
  CategoryName: string,
  CategoryCode: string,
  ParentCategory?: string,
  CategoryOrder: number,
  CategoryStatus: boolean,
  QuestionCount?: number,
  ParentName?: string

}

export interface ProCategoryDetailModel {
  Id: number,
  CategoryName: string,
  CategoryOrder: number,
  CategoryPhoto: string,
  CategoryDescription: string,
  CategoryStatus: boolean,
  TopCategory?: string,
  ParentId: number
}

export interface TopCategories {
  key: string,
  value: string,
}

export interface ProQuestionListModel {
  Data: ProQuestionListInnerModel[],
  TotalCount: number
}
export interface ProQuestionListInnerModel {
  Id: number,
  QuestionOrder: number,
  QuestionText: string,
  QuestionDescription: string,
  AnswerType: string,
  AnswerCount?: number,
  Answers?: string[]
}
//#region <<--- Seller Category --- >>

export interface SellerCategoryListModel {
  Data: SellerCategoryListInnerModel[],
  TotalCount: number
}

export interface SellerCategoryListInnerModel {
  Id: number,
  PhotoPath: string,
  CategoryName: string,
  CategoryCode: string,
  ParentName?: string,
  CategoryOrder: number,
  CommissionPercentage: number,
  CategoryStatus: boolean,
  GroupId: number,
  ParentCategory?: number
}

export interface SellerCategoryDetailModel {
  Id: number
  Name: string,
  CategoryGroup: string,
  Order: number,
  PhotoPath: string,
  CommissionPercentage: number,
  Description: string,
  IsEnabled: boolean,
  Elements: SellerCategorySelectedElementList[],
  Variations: SellerCategorySelectedVariationList[],
  GroupId: number,
  ParentCategory: number,
}

export interface SellerTopCategoriesModel {
  key: string,
  value: string,
  groupId?: number
}

export interface SellerCategoryGroupsModel {
  key: string,
  value: string,
}

export interface SellerCategoryVariationList {
  ElementId: number,
  Name: string,
}

export interface SellerCategorySelectedVariationList {
  ElementId: number,
  IsRequired: boolean,
  IsImageRequired: boolean
}

export interface SellerCategoryElementList {
  ElementId: number,
  Name: string,
}

export interface SellerCategorySelectedElementList {
  ElementId: number,
  IsRequired: boolean
}


export interface SellerCategoryElementListModel {
  Data: SellerCategoryElementListInnerModel[],
  TotalCount: number,
}


export interface SellerCategoryElementListInnerModel {
  Id: number,
  DataType: number
  Name: string,
  Options?: string[],
  Alias?: string,
  NameWithAlias: string,
  UsedCategoryCount: number,
}
export interface SellerCategoryVariationListModel {
  Data: SellerCategoryVariationListInnerModel[],
  TotalCount: number,
}


export interface SellerCategoryVariationListInnerModel {
  Id: number,
  DataType: number
  Name: string,
  Options?: string[],
  Alias?: string,
  NameWithAlias: string,
  UsedCategoryCount: number,
}

export interface SellerCategoryGroupListModel {
  Data: SellerCategoryGroupListInnerModel[],
  TotalCount: number
}

export interface SellerCategoryGroupListInnerModel {
  Id: number,
  OrderBy: number,
  PhotoPath: string,
  GroupName: string,
  GroupDescription: string,
  GroupCode?: string,
  IsActive: boolean,
}

export interface SellerCategoryRequestListModel {
  Data: SellerCategoryRequestListInnerModel[],
  TotalCount: number
}

export interface SellerCategoryRequestListInnerModel {
  Id: number,
  RequestDate: string,
  SellerName: string,
  CategoryName: string,
  Description: string
}

//#endregion

//#region <<--- Seller Commission --->>

export interface SellerCategoryCommissionDiscount {
  Id: number;
  SellerCategoryCommissionId: number;
  SellerCategoryId: number;
  StartDate: string;
  EndDate: string;
  CommissionDiscount: number;
  FinishPrice: number;
  TotalPrice: number;
  FinishItemQuantity: number;
  TotalQuantity: number;
  IsActive: boolean;
}

export interface SellerCommissionDiscount {
  Id: number;
  SellerId: number;
  CommissionDiscountName: string;
  CommissionDiscountDescription: string;
  StartDate: string;
  EndDate: string;
  SellerCategories: SellerCategoryCommissionDiscount[];
  IsActive: boolean;
}

//#endregion <<--- Seller Commission --->>


// <<--- SELLER PRODUCT MODULE --- START --- >>
export interface SellerProductList {
  Id: number,
  ProductPhoto: string,
  ProductName: string,
  ProductBarcode: number,
  ProductModelNo: string,
  ProductCategory: string,
  ProductStockCode: string,
  ProductStockCount: number,
  ProductMarketSalePrice: number,
  ProductSalePrice: number,
  ProductBuyBox: number,
  ProductSellerName: string,
  SellerId: number,
  NumberOfAdditionsToBasket: number,
  NumberOfFavoruite: number,
  ProductStatus: number,
}

// SELLER PRODUCT DETAIL
export interface SellerProductDetailProductInfoModel {
  ProductInformation: SellerDetailProductInformation,
  SalesInformation: SellerDetailSalesInformation,
  ProductProperties: SellerDetailProductProperties[],
  Descriptions: SellerDetailDescriptions,
}

export interface SellerDetailProductInformation {
  PhotoList: string[],
  CoverPhoto: string,
  ProductCategory: string[],
  ProductName: string,
  ProductBarcodeNo: number,
  ProductModelNo: string,
  ProductVariations: SellerDetailProductVariations[],
  CoverText: string,
  ShippingPreparationTime: string,
  IsAllTurkeyForDelivery: boolean,
  FreeDeliveryCities?: string[],
  FreeSetup: boolean,
  ProductStatus: number
}
export interface SellerDetailProductVariations {
  VariationId: number,
  label: string,
  isRequired?: boolean,
  value: string,
  options?: SellerDetailProductVariationsOptionModel[],
}

export interface SellerDetailProductVariationsOptionModel {
  key: string,
  value: string
}

export interface SellerDetailSalesInformation {
  SellerId: number,
  SellerName: string,
  IsTaxInclude: boolean,
  TaxRate: number,
  MarketPrice: number,
  SalePrice: number,
  PriceUpdateDate: string,
  PreviousPrice: number,
  SalesUnit: string,
  Desi: number,
}

export interface SellerDetailProductProperties {
  Id: number,
  label: string,
  value?: string,
  isRequired: boolean,
  options?: SellerEditProductPropertiesModel[],
}

export interface SellerEditProductPropertiesModel {
  key: string,
  value: string
}

export interface SellerDetailDescriptions {
  ProductDescription: string,
  ShippingDelivery: string,
  CancellationRefundConditions: SellerDetailCancellationRefundConditions[],
}

export interface SellerDetailCancellationRefundConditions {
  Question: string,
  Answer: string,
}

export interface SellerDetailUsersAddingToCartModel {
  Id: number,
  UserName: string,
  UserPhoto: string,
  CreatedDate: string,
  Email: string,
}

export interface SellerDetailEvaluationsModel {
  GeneralProductScore: number,
  EvaluationCount: number,
  SatisfactionRate: number,
  OrderCancellationRate: number,
  ProductReturnRate: number,
  EvaluationList: SellerDetailEvaluationListModel[],
}

export interface SellerDetailEvaluationListModel {
  Id: number,
  Date: string,
  UserName: string,
  UserPhoto: string,
  OrderNo: number,
  SellerId: number,
  SellerName: string,
  OrderStatus: number,
  EvaluationScore: number,
  EvaluationText?: string | undefined | null,
}

export interface SellerDetailQuestionAnswersModel {
  Id: number,
  Date: string,
  UserName: string,
  UserPhoto: string,
  Questiontext: string,
  IsAnswered: boolean,
  QuestionStatus: number,
  AnsweredDate: string,
  AnswerText?: string | undefined | null
}

export interface SellerDetailSellersOtherVariationModel {
  Id: number,
  ProductId: number,
  ProductPhoto: string,
  ProductName: string,
  ProductBarcode: number,
  ProductModelNo: string,
  ProductCategory: string,
  ProductStockCode: string,
  ProductStockCount: number,
  ProductMarketSalePrice: number,
  ProductSalePrice: number,
  ProductBuyBox: number,
  ProductSellerName: string,
  SellerId: number,
  NumberOfAdditionsToBasket: number,
  NumberOfFavoruite: number,
  ProductStatus: number,
}

export interface SellerDetailProductsOtherSellersModel {
  Id: number,
  SellerId: number,
  SellerNameSurname: string,
  SellerPhone: string,
  SellerEmail: string,
  SellerApplicationDate: string,
  SellerFirmType: string,
  SellerStoreName: string,
  SellerStorePoints: number,
  SellerStatus: number
}

export interface SellerDetailIdeasListModel {
  Id: number,
  IdeaId: number,
  ProfessionalId: number,
  IdeaName: string,
  IdeaCategory: string,
  ProfessionalName: string,
  IdeaCreatedDate: string,
  ProductCount: number,
  QuestionCount: number,
  NumberOfViews: number,
  NumberOfFavourites: number,
  IdeaStatus: number,
}

export interface SellerDetailProductCampaignsModel {
  Id: number,
  CampaignType: number,
  CampaignDates: string,
  CampaignRemaningTime: string,
  IsTimeShort: boolean,
  ProductName?: string | null | undefined,
  ProductPhotoUrl?: string | null | undefined,
  MinBasketAmount?: number | null | undefined,
  PercentageOfDiscount: number,
  CampaignStatus: number
}

//SELLER - PRODUCT EVALUATIONS
export interface SellerProductEvaluationsModel {
  Id: number,
  ProductId: number,
  ProductPhoto: string,
  ProductName: string,
  ProductBarcode: number,
  ProductCategory: string,
  ProductStockCode: string,
  NumberOfEvaluations: number,
  AverageScore: number,
}

//SELLER - PRODUCT QUESTİONS & ANSWERS
export interface SellerProductQuestionAnswersModel {
  Id: number,
  ProductId: number,
  ProductPhoto: string,
  ProductName: string,
  ProductBarcode: number,
  ProductModelNo: string,
  ProductCategory: string,
  ProductStockCode: string,
  ProductStockCount: number,
  ProductSalePrice: number,
  ProductSellerName: string,
  SellerId: number,
  NumberOfQuestion: number,
}

//SELLER - PRODUCT PENDİNG APPROVAL
export interface SellerProductPendingApprovalModel {
  Id: number,
  ProductId: number,
  ProductPhoto: string,
  ProductName: string,
  ProductBarcode: number,
  ProductModelNo: string,
  ProductCategory: string,
  ProductStockCode: string,
  ProductStockCount: number,
  ProductMarketSalePrice: number,
  ProductSalePrice: number,
  ProductBuyBox: number,
  ProductSellerName: string,
  SellerId: number,
  ProductStatus: number,
}

//SELLER - REJECTED PRODUCTS
export interface SellerRejectedProductsModel {
  Id: number,
  ProductId: number,
  ProductPhoto: string,
  ProductName: string,
  ProductBarcode: number,
  ProductModelNo: string,
  ProductCategory: string,
  ProductStockCode: string,
  ProductStockCount: number,
  ProductMarketSalePrice: number,
  ProductSalePrice: number,
  ProductBuyBox: number,
  ProductSellerName: string,
  SellerId: number,
  RejectedBy: string,
  RejectedDate: string,
  RejectedTitle: string,
  RejectedText: string,
}

//<<--- SELLER EDIT PRODUCT --->>

export interface ProductCategoryPropsList {
  id: number,
  title: string,
  childs?: ProductCategoryPropsList[],
}

export interface ProvinceListModel {
  Id: number,
  Name: string,
}

//Idea Category Models
export interface IdeaCategoryElementListModel {
  Data: IdeaCategoryElementInnerModel[],
  TotalCount: number
}
export interface IdeaCategoryElementInnerModel {
  Id: number,
  Name: string,
  CreatedDate: string,
  DataType: number,
  Options: string[],
  Alias?: string,
  NameWithAlias: string
}

export interface CategoryOptionsApiModel {
  ElementId: number,
  IsRequired: boolean
}
export interface IdeaCategoryListModel {
  Data: IdeaCategoryInnerModel[],
  TotalCount: number
}
export interface IdeaCategoryInnerModel {
  Id: number,
  Order: number,
  PhotoPath: string,
  Name: string,
  Description?: string,
  Code: string,
  IsEnabled: boolean,
  Elements: number[]
}

//Admin User Models
export interface AdminUserListModel {
  Data: AdminUserListInnerModel[],
  TotalCount: number
}

export interface AdminUserModel {
  Id: number,
  Email: string,
  IsSuperAdmin: boolean,
  PermissionList: string[],
  UserName: string,
  UserType: number,
}

export interface AdminUserListInnerModel {
  Id: number,
  CreatedDate: string,
  UpdateDate: string,
  Username: string,
  Email: string,
  UserType: number
}

//Seller List-Detail Models
export interface SellerListModel {
  Data: SellerModel[],
  TotalCount: number
}

export interface SellerModel {
  Id: number,
  StoreName: string,
  CompanyTitle: string,
  NameSurname: string
  Phone: string,
  Email: string,
  RecourseDate: string,
  CompanyType: number,
  Status: number,
  IsEnabled: boolean,
  StoreRate: number,
  RejectType: string,
  RejectReason: string,
  RejectDate: string,
  CreatedDateJSTime: number
}

export interface SellerDetailModel {
  Id: number,
  NameSurname: string,
  Phone: string,
  PhonePreview: string,
  Email: string,
  Logo: string,
  StoreName: string,
  CompanyTitle: string,
  TaxNumber: string,
  TaxDepartment: string,
  CitizenshipNumber: string,
  KepAddress: string,
  MersisNumber: string,
  CompanyType: number,
  Status: number,
  RejectTitle: string,
  RejectReason: string,
  RejectDate: string,
  IsEnabled: boolean,
  BillAddressId: number,
  ShippingAddressId: number,
  RefundsAddressId: number,
  ContactList: SellerContactModel[],
  AddressList: SellerAddressModel[],
  BankInfo: SellerBankModel,
  DocumentInfo: SellerDocumentModel,
  CanCreateIndividualCargo: boolean,//fe

}

export interface SellerContactListModel {
  Data: SellerContactModel[],
  TotalCount: number
}

export interface PhoneResultModel {
  purePhone: string,
  maskedPhone: string,
  phone: string,
  phonePreview: string,
  pureCountryCode: string,
  previewCountryCode: string
}

export interface SellerContactModel {
  Id: number,
  Title: string,
  NameSurname: string,
  Phone: string,
  Email: string,
  CreatedDate: string,
  Description: string,
  PhonePrewiew: string
}

export interface SellerAddressModel {
  Id: number,
  SellerId: number,
  AddressName: string,
  AddressDescription: string,
  Country: string,
  CountryId: number,
  City: string,
  CityId: number,
  District: string,
  DistrictId: number,
  ZipCode: string,
  Phone: string,
  PhonePreview: string,
}

export interface SellerBankModel {
  NameSurname: string,
  IBAN: string,
  BankId: number,
  BranchName: string,
  BranchCode: string,
  AccountNumber: string,
}

export interface SellerDocumentModel {
  PartnershipAgreementVerified: boolean,
  PartnershipAgreementUploadDate: string,
  TaxPlate: string,
  TaxPlateStatue: number,
  TaxPlateUploadDate: string,
  TaxPlateRejectReason: string,
  SignatureCirculars: string,
  SignatureCircularsStatue: number,
  SignatureCircularsUploadDate: string,
  SignatureCircularsRejectReason: string,
  RegistryGazette: string,
  RegistryGazetteStatue: number,
  RegistryGazetteUploadDate: string,
  RegistryGazetteRejectReason: string,
  BirthCertificate: string,
  BirthCertificateStatue: number,
  BirthCertificateUploadDate: string,
  BirthCertificateRejectReason: string,
}

export interface SellerCertificateModel {
  Id: number,
  CertificateName: string,
  CreateDate: string,
  Status: number,
  DeclineDescription: string
}

export interface SellerProductModel {
  Id: number,
  PhotoPath: string,
  ProductName: string,
  BarCode: string,
  Category: string,
  StockCode: string,
  Stock: number,
  Price: string,
  Status: boolean
}

export interface SellerOrderProduct {
  Id: number,
  PhotoPath: string
}

export interface SellerOrderModel {
  Id: number,
  OrderId: string,
  OrderDate: string,
  SellerId: Number,
  SellerName: string,
  ProductList: SellerOrderProduct[],
  BuyerPhotoPath: string,
  BuyerName: string,
  BuyerLocation: string,
  SellPrice: string,
  IsFreeCargo: boolean,
  ShippingDate: string,
  CargoCode: string,
  OrderStatus: number
}

export interface SellerCustomerCommentModel {
  Id: number,
  CreateDate: string,
  CustomerPhotoPath: string,
  CustomerName: string,
  OrderNo: string,
  OrderStatus: number,
  Rating: number,
  Comment: string
}

//Pro Badge Management
export interface ProBadgeModel {
  Id: number,
  PhotoPath: string,
  BadgeName: string,
  Description: string,
  AssignCount: number,
  IsActive: boolean
}

export interface AssignedProListModel {
  Id: number,
  ProName: string,
  ProRating: number,
  FavoriteCount: number,
  ActiveJobCount: number,
  CompletedJobCount: number,
  BadgeAssignDate: string
}

//Pro Membership Management
export interface ProDetailIdeaListModel {
  Id: number,
  IdeaName: string,
  Category: string,
  CreateDate: string,
  ProductCount: number,
  QuestionCount: number,
  ViewCount: number,
  FavoriteCount: number,
  IsActive: boolean
}

export interface ProDetailCustomerEvaluationModel {
  AverageRating: {
    Rating: number,
    VoteCount: number,
    CommentCount: number
  },
  TimingRating: {
    Rating: number,
    VoteCount: number
  },
  WorkRating: {
    Rating: number,
    VoteCount: number
  },
  TalentRating: {
    Rating: number,
    VoteCount: number
  },
  BehaviourRating: {
    Rating: number,
    VoteCount: number
  }
}

export interface WorkReportlistModel {
  Data: WorkReportModel[],
  TotalCount: number
}

export interface WorkReportModel {
  WorkReportId: number,
  CreatedDateJS: number,
  UserId: number,
  UserPhoto: string,
  UserName: string,
  ReportTitle: string
}

export interface ProListModel {
  Data: ProModel[],
  TotalCount: number
}

export interface ProModel {
  Id: number,
  NameSurname: string,
  Phone: string,
  Email: string,
  RecourseDate: string,
  CompanyType: number,
  Status: number,
  UserType: string,
  IsEnabled: boolean,
  StoreRate: number,
  RejectType: string,
  RejectReason: string,
  RejectDate: string,
  StoreName: string,
  OfferCount: number,
  FavoriteCount: number,
  ServiceCount: number,
  PaymentStatus: number,
  RefreshStatus: number,
  CompanyTitle: string,
  Logo: string,
  BadgeIds: number[],
  ReportCount: number,
  CommentCount: number,
  IsVerified: boolean,
  PackageName: string,
  PackageRefreshDate: number,
  CreatedDateJSTime: number,
  PackageExpirationDate: number
}

export interface ProDetailModel {
  Id: number,
  NameSurname: string,
  Phone: string,
  PhonePreview: string,
  Email: string,
  Logo: string,
  StoreName: string,
  CompanyTitle: string,
  TaxNumber: string,
  TaxDepartment: string,
  CitizenshipNumber: string,
  KepAddress: string,
  MersisNumber: string,
  CompanyType: number,
  Status: number,
  IsEnabled: boolean,
  BillAddressId: number,
  ContactEmail: string,
  WebsiteUrl: string,
  ContactAddress: string,
  ShiftData: ProServiceShiftModel[],
  MinPrice: number,
  MaxPrice: number,
  PriceData: string[]
  ServiceCityId: number,
  ServiceCityName: string,
  DistrictList: GeneralLocationModel[],
  RejectTitle: string,
  RejectReason: string,
  RejectDate: string,
  ContactList: ProContactModel[],
  AddressList: ProAddressModel[],
  BankInfo: ProBankModel,
  DocumentInfo: ProDocumentModel,
  ParentCategory: number,
  ParentCategoryName: string,
  ServiceCategoryList: ProServiceGeneralModel[],
  MediaList: ProMediaModel[],
  SocietyIds: number[],
  SocietyData: ProSocietyDataModel[],
  SectionData: ProSectionDataModel[],
  IntroText: string,
  IsVerified: boolean,
  SeoTitle: string,
  SeoDescription: string,
  ForeignLanguageData: string[]
}

export interface GetProSubscriptionHistoryResponseModel {
  Data: GetProSubscriptionHistoryResponseInnerModel[],
  TotalCount: number,
}

export interface GetProSubscriptionHistoryResponseInnerModel {
  PackageName: string,
  StartDateJSTime: number,
  PayedDateJSTime: number,
  PayInfo: string,
  PayedAmount: number,
  Bill: string
}

export interface GetProSubscriptionDetailResponseModel {
  Bill: string,
  ExpirationDateJSTime: number,
  IsInFreeTrial: boolean,
  PackageName: string,
  PaymentType: number,
  StartDateJSTime: number,
  Status: boolean
}

export interface ProContactListModel {
  Data: ProContactModel[],
  TotalCount: number
}

export interface ProContactModel {
  Id: number,
  ProId: number,
  Title: string,
  NameSurname: string,
  Phone: string,
  Email: string,
  CreatedDate: string,
  Description: string,
  IsDefault: boolean,
  PhonePreview: string
}

export interface ProAddressModel {
  Id: number,
  ProId: number,
  AddressName: string,
  AddressDescription: string,
  Country: string,
  CountryId: number,
  City: string,
  CityId: number,
  District: string,
  DistrictId: number,
  ZipCode: string,
  Phone: string,
  PhonePreview: string
}

export interface ProBankModel {
  NameSurname: string,
  IBAN: string,
  BankId: number,
  BranchName: string,
  BranchCode: string,
  AccountNumber: string
}

export interface ProDocumentModel {
  PartnershipAgreementVerified: boolean,
  PartnershipAgreementUploadDate: string,
  TaxPlate: string,
  TaxPlateStatue: number,
  TaxPlateUploadDate: string,
  TaxPlateRejectReason: string,
  SignatureCirculars: string,
  SignatureCircularsStatue: number,
  SignatureCircularsUploadDate: string,
  SignatureCircularsRejectReason: string,
  RegistryGazette: string,
  RegistryGazetteStatue: number,
  RegistryGazetteUploadDate: string,
  RegistryGazetteRejectReason: string,
  BirthCertificate: string,
  BirthCertificateStatue: number,
  BirthCertificateUploadDate: string,
  BirthCertificateRejectReason: string
}

export interface ProServiceShiftModel {
  Name: string,
  Type: number
}

export interface ProMediaModel {
  MediaId: number,
  FileUrl: string,
  FileName: string,
}

export interface ProSocietyDataModel {
  Id: number,
  Title: string,
  PhotoUrl: string,
}

export interface ProSectionDataModel {
  Title: string,
  Description: string
}


export interface ProServiceGeneralListModel {
  Data: ProServiceGeneralModel[],
  TotalCount: number
}

export interface ProServiceGeneralModel {
  Id: number,
  Name: string
}

export interface GeneralBankModel {
  Id: string,
  Name: string
}

export interface GeneralLocationModel {
  id: string,
  name: string
}

//#region Slider-Models
export interface SliderListModel {
  Data: SliderListInnerModel[],
  TotalCount: number
}

export interface SliderListInnerModel {
  Id: number,
  OrderBy: number,
  PhotoUrl: string
  Title: string
  TitleColor: string
  ButtonText: string
  ButtonTextColor: string
  RedirectLink: string
  Description: string
  DescriptionColor: string
  IsBlank: boolean,
  ShowOnWebsite: boolean,
  ShowOnMobilWeb: boolean,
  ShowOnApp: boolean,
  IsEnabled: boolean,
  SliderType: number
}
//#endregion

//#region Blog-Models
export interface BlogAuthorListModel {
  Data: BlogAuthorModel[],
  TotalCount: number
}
export interface BlogAuthorModel {
  Id: number,
  CreatedDate: string,
  Name: string
}

export interface BlogCategoryListModel {
  Data: BlogCategoryModel[],
  TotalCount: number
}

export interface BlogCategoryModel {
  Id: number
  CreatedDate: string
  OrderBy: number
  Name: string
  Description: string
  IsEnabled: boolean
}

export interface BlogListModel {
  Data: BlogModel[],
  TotalCount: number
}

export interface BlogModel {
  Id: number,
  CreatedDate: string,
  PhotoUrl: string,
  Title: string,
  Description: string,
  IsEnabled: boolean,
  CategoryId: number,
  CategoryName: string
  AuthorId?: number,
  AuthorName?: string,
  SeoTitle?: string,
  SeoDescription?: string
}
//#endregion

//#region Academy-Models
export interface AcademyCategoryListModel {
  Data: AcademyCategoryModel[],
  TotalCount: number
}

export interface AcademyCategoryModel {
  Id: number,
  CreatedDate: string,
  OrderBy: number,
  Name: string,
  Description: string,
  IsEnabled: boolean,
  CategoryType: number,
  CategoryTypeStr: string,
}

export interface AcademyListModel {
  Data: AcademyModel[],
  TotalCount: number
}

export interface AcademyModel {
  Id: number,
  CreatedDate: string,
  PhotoUrl: string,
  DocumentUrl: string,
  DocumentName: string,
  OrderBy: number,
  Title: string,
  Description: string,
  IsEnabled: boolean,
  AcademyType: number,
  AcademyTypeStr: string,
  CategoryId: number,
  CategoryName: string,
  CategoryType: number,
  CategoryTypeStr: string,
  ShortDescription: string,
  IsFeatured: boolean,
  VideoDuration: string,
  VideoUrl: string,
}

export interface AcademyQuestionListModel {
  Data: AcademyQuestionModel[],
  TotalCount: number
}

export interface AcademyQuestionModel {
  Id: number,
  Statue: number,
  CreatedDate: string,
  UpdatedDate: string,
  Question: string,
  QuestionTitle: string,
  Answer: string,
  CategoryId: number
  CategoryName: string,
  AcademyId: number
  AcademyName: string,
  StoreId: number,
  StoreName: string,
  Photo: string,
  AdminUsername: string,
}

export interface AcademyEvaluationListModel {
  Data: AcademyEvaluationModel[],
  TotalCount: number
}

export interface AcademyEvaluationModel {
  Id: number,
  IsEnabled: boolean,
  CreatedDate: string,
  Rating: number,
  Description: string,
  CategoryId: number,
  CategoryName: string,
  AcademyId: number,
  AcademyName: string,
  StoreId: number,
  StoreName: string,
  Photo: string,
  IsFirstEvaluation: boolean
}
//#endregion

//#region Help Group

export interface HelpGroupListModel {
  Data: HelpGroupListInnerModel[],
  TotalCount: number,
}

export interface HelpGroupListInnerModel {
  Id: number,
  OrderBy: number,
  PhotoUrl: string,
  Title: string,
  CreatedDate?: string,
  IsEnabled: boolean,
  Description?: string
}

export interface GroupCategoryListModelForDropdown {
  categoryList: CategoryListForDropdown[]
  groupList: GroupListForDropdown[]
}

export interface CategoryListForDropdown {
  Id: number,
  Title: string,
  ParentId: number
}

export interface GroupListForDropdown {
  Id: number,
  Title: string,
}

export interface GroupCategoryListModelForSelect {
  categoryList: CategoryListForSelect[]
  groupList: GroupListForSelect[]
}

export interface CategoryListForSelect {
  key: string,
  value: string,
  groupId: number
}

export interface GroupListForSelect {
  key: string,
  value: string,
}
//#endregion

//#region Help Category

export interface HelpCategoryListModel {
  Data: HelpCategoryListInnerModel[],
  TotalCount: number
}

export interface HelpCategoryListInnerModel {
  Id: number,
  OrderBy: number,
  Title: string,
  ParentId: number,
  ParentName?: string,
  CreatedDate?: string,
  IsEnabled: boolean
}
//#endregion

//#region Help
export interface HelpContentListModel {
  Data: HelpContentListInnerModel[],
  TotalCount: number,
}

export interface HelpContentListInnerModel {
  Id: number,
  OrderBy: number,
  Title: string,
  CreatedDate?: string,
  IsEnabled: boolean,
  Description?: string,
  CategoryId?: number,
  GroupId?: number,
  CategoryName?: string,
  GroupName?: string,
}
//#endregion

//#region brand
export interface BrandListModel {
  Data: BrandModel[],
  TotalCount: number,
}

export interface BrandModel {
  Id: number,
  CreatedDate: string,
  Name: string
}
//#endregion

//#regios association
export interface AssociationListModel {
  Data: AssociationListInnerModel[],
  TotalCount: number
}

export interface AssociationListInnerModel {
  Id: number,
  Title: string,
  PhotoUrl: string,
}

//#region refund-management
export interface RefundCategoryListModel {
  Data: RefundCategoryModel[],
  TotalCount: number
}

export interface RefundCategoryModel {
  Id: number,
  CategoryName: string,
  CategoryCode: string,
  PhotoPath: string,
  ParentName: string,
  RefundOptionCount: number
}

export interface RefundOptionListModel {
  Data: RefundOptionModel[],
  TotalCount: number
}

export interface RefundOptionModel {
  Id: number,
  Title: string,
  Description: string,
  CategoryId: number
}
//#endregion

//#region ProductDraftStatus

export enum ProductDraftStatus {
  DRAFT = 1,
  REJECTED = 2,
  CONFIRMED = 3
}

//#endregion

//#region Product
export enum ProductStatue {
  ACTIVE = 0,
  SUSPENDED = 1,
  DEACTIVE = 2
}

export const fraction = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 0,
});

export const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
export const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
export const daysShort = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']

export const locale = {
  localize: {
    month: n => months[n],
    day: n => days[n]
  },
  formatLong: {}
}

export interface ProductAdvertDraftListModel {
  Data: ProductAdvertDraftListInnerModel[],
  TotalCount: number
}

export interface ProductAdvertDraftListInnerModel {
  ProductId: number,
  AdvertId: number,
  DraftId: number,
  DraftStatue: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  StockCode: string,
  StockCount: number,
  MarketPrice: number,
  SalePrice: number,
  BuyboxPrice: number,
  SellerName: string,
  SellerId: number,
  CreatedDateJSTime: number,
  RejectDateJsTime: number,
  RejectDescription: string,
  RejectTitle: string
}

export interface ProductAdvertAdminDraftDetailModel {
  ProductId: number,
  DraftId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  Brand: string,
  BuyboxPrice: number,
  CreatedDateJSTime: number,
  Images: ProductImageModel[],
  CreatorSellerId: number,
  CategoryId: number,
  Name: string,
  BrandId?: number,
  ShortDescription: string,
  TaxRate?: number,
  Desi?: number,
  Variations: string,
  Properties: string,
  GroupData: string,
  Description: string,
  SalePrice: number,
  MarketPrice?: number,
  RejectDate?: number
  RejectTitle: string,
  RejectDescription: string,
  ShippingPrepareDay?: number,
  StockCode: string,
  ShowProduct: boolean,
  Stock?: number,
  StoreName: string,
  StoreNameSeo: string,
  StorePhoto: string,
  StoreRate: number,
  SellerId: number,
  Status: number,
  IsProductEnabled: boolean
}

export interface ProductListModel {
  Data: ProductListInnerModel[],
  TotalCount: number
}

export interface ProductListInnerModel {
  ProductId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  Brand: string,
  SellerCount: number,
  VariationCount: number,
  BuyboxPrice: number,
  CreatedDateJSTime: number,
  IsEnabled: boolean
}

export interface ProductAdminDetailModel {
  ProductId: number,
  DraftId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  Brand: string,
  BuyboxPrice: number,
  CreatedDateJSTime: number,
  AdvertDetail: ProductAdminAdvertDetailModel,
  Images: ProductImageModel[],
  CreatorSellerId: number,
  CategoryId: number,
  Name: string,
  BrandId: number,
  ShortDescription: string,
  TaxRate: number,
  Desi: number,
  Variations: string,
  Properties: string,
  GroupData: string,
  Description: string,
  IsEnabled: boolean,
  SeoTitle: string,
  SeoDescription: string
}

export interface ProductImageModel {
  PhotoUrl: string,
  IsMainPhoto: boolean
}

export interface ImagePostModel {
  IsMainPhoto: boolean,
  PhotoUrl: string
}

export interface ProductVariationModel {
  ElementId: number,
  DataType: number,
  Value: string
}

export interface ProductDraftAdvertListModel {
  Data: ProductDraftAdvertListInnerModel[],
  TotalCount: number
}

export interface ProductDraftAdvertListInnerModel {
  ProductId: number,
  DraftId: number,
  DraftStatue: number,
  ProductName: string,
  ProductMainPhoto: string,
  BuyboxPrice: number,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  StockCode: string,
  StockCount: number,
  MarketPrice: number,
  SalePrice: number,
  SellerName: string,
  SellerId: number,
  CreatedDateJSTime: number,
  RejectTitle: string,
  RejectDescription: string,
  RejectDateJsTime: number
}

export interface ProductAdminAdvertDetailModel {
  AdvertId: number,
  SalePrice: number,
  MarketPrice: number,
  AdvertStatue: number,
  RejectDate: Date,
  RejectDescription: string,
  ShippingPrepareDay: number,
  StockCode: string,
  ShowProduct: boolean,
  Stock: number,
  SellerId: number,
  StoreName: string,
  StoreNameSeo: string
}

export interface CategoryVariationValueListModel {
  ElementId: number,
  DataType: number,
  Value: string
}

export interface CategoryVariationsListModel {
  Name: string,
  DataType: number,
  Id: number,
  IsRequired: boolean,
  IsImageRequired: boolean,
  Options: {
    Id: number,
    Name: string
  }[]
}

export interface CategoryPropertyValueListModel {
  ElementId: number,
  DataType: number,
  Value: string
}

export interface CategoryPropertiesListModel {
  Name: string,
  DataType: number,
  Id: number,
  IsRequired: boolean,
  Options: {
    Id: number,
    Name: string
  }[]
}

export interface ProductUpdateRequestListModel {
  Data: ProductUpdateRequestListInnerModel[],
  TotalCount: number
}

export interface ProductUpdateRequestListInnerModel {
  ProductId: number,
  ProductRequestId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  Brand: string,
  SellerCount: number,
  VariationCount: number,
  BuyboxPrice: number,
  CreatedDateJSTime: number,
  SellerId: number,
  StoreName: string,
  Status: number,
  RejectReason: string,
  RejectDateJSTime: number,
}

export interface ProductAdminUpdateRequestDetailModel {
  ProductId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  Brand: string,
  CreatedDateJSTime?: number,
  AdvertDetail: ProductAdminAdvertDetailModel,
  Images: ProductImageModel[],
  CategoryId?: number,
  Name: string,
  BrandId?: number,
  ShortDescription: string,
  TaxRate?: number,
  Desi?: number,
  Variations: string,
  Properties: string,
  GroupData: string,
  Description: string,
  DeliveryAndShipping: string,
  CancelRefundInfo: string,
  SellerId: number,
  StoreName: string,
  StorePhoto: string,
  StoreRate: number,
  IsStoreEnable: boolean,
  RejectDateJSTime: number,
  Status: number,
  RejectReason: string,
}

export interface ProductUpdateRequestModel {
  Product: ProductAdminDetailModel,
  UpdateRequest: ProductAdminUpdateRequestDetailModel
}

export interface DropzoneFileUploadModel {
  FileUrl: string,
  FileName: string
}

export interface ProductProcessModel {
  Id: number,
  MainPhotoUrl: string,
  CreatorSellerId: number,
  CategoryId: number,
  Name: string,
  BrandId?: number,
  ModelNo: string,
  ShortDescription: string,
  BarcodeNo: string,
  BuyboxPrice?: number,
  BuyboxAdvertId?: number,
  TaxRate?: number,
  Desi?: number,
  Variations: string,
  Properties: string,
  GroupData: string,
  Description: string,
  DeliveryAndShipping: string,
  CancelRefundInfo: string,
  IsEnabled: boolean
}

export interface ReportedProductListModel {
  Data: ReportedProductListInnerModel[],
  TotalCount: number
}

export interface ReportedProductListInnerModel {
  ReportId: number,
  AdvertId: number,
  ProductId: number,
  ReportDate: number,
  ProductName: string,
  ProductPhoto: string,
  SellerId: number,
  SellerStoreName: string,
  ReportTitle: string,
  ReportReason: string,
  UserId: number,
  UserNameSurname: string
}

//#endregion

//#region Project-Models
export interface ProjectListModel {
  Data: ProjectModel[],
  TotalCount: number
}

export interface ProjectModel {
  Id: number,
  CreatedDate: string,
  CreatedDateJSTime: number,
  CategoryId: number,
  CategoryName: string,
  ProId: number,
  StoreName: string,
  Name: string,
  Description: string,
  IsEnabled: boolean,
  KeywordList: string[],
  Statue: number,
  IsDraft: boolean,
  RejectTitle: string,
  RejectReason: string,
  RejectDate: string,
  ProductCount: number,
  ViewCount: number,
  FavoriteCount: number,
  QuestionCount: number,
  MainPhoto: string,
  MediaList: ProjectMediaModel[],
  CategoryElementObj: ElementDataModel[],
  IdeaId?: number,
  IsIdeaApproved: boolean,
  Products: ProjectProductModel[],
  IsProVerified: boolean,
  SeoTitle: string,
  SeoDescription: string
}

export interface ProductSearchVariationModel {
  VariationName: string,
  Value: string
}

export interface ProjectProductModel {
  ProjectProductId: number,
  ProductId: number,
  PinLocation: string,
  ProductPhoto: string,
  ProductTitle: string,
  ProductPrice: number,
  DiscountedPrice: number,
  AdvertRate: number,
  AdvertId: number,
  ProductVariation: ProductSearchVariationModel[],
  ProductProperty: string,
  RawVariationData: string,
  ProductSeoUrl: string
}

export interface ProjectMediaModel {
  MediaId: number,
  FileUrl: string,
  FileName: string,
  IsMainPhoto: boolean,
  PinMap: string
}

export interface ProjectVariationModel {
  DataType: number,
  Id: number,
  Name: string,
  Options: ProjectVariationOptionModel[]
}

export interface ProjectVariationOptionModel {
  Id: number,
  Name: string,
}

export interface ElementDataModel {
  DataType: number,
  ElementId: number,
  Value: string
}
//#endregion

//#region Dropzone
export interface DropzoneFileUploadModel {
  FileUrl: string,
  FileName: string
}
//#endregion

//#region Badge
export interface BadgeListModel {
  Data: BadgeModel[],
  TotalCount: number
}

export interface BadgeModel {
  Id: number,
  Name: string,
  Description: string,
  PhotoUrl: string,
  IsEnabled: boolean,
  ProCount: number,
  AssignmentDate: string,
  AssignmentDateJSTime: number
}

export interface ProForBadgeDetailListModel {
  Data: ProForBadgeDetailModel[],
  TotalCount: number
}

export interface ProForBadgeDetailModel {
  Id: number,
  StoreName: string,
  StoreRate: number,
  FavoriteCount: number,
  OfferCount: number,
  ServiceCount: number,
  AssignmentDate: string
}
//#endregion

// #project-question  start

export interface ProjectQuestionListModel {
  Data: ProjectQuestionListInnerModel[],
  TotalCount: number,
}
export interface ProjectQuestionListInnerModel {
  Answer: string,
  AnswerDateJSTime: number,
  ApprovedDateJSTime: number,
  IsAnswered: boolean,
  ProjectId: number,
  ProjectQuestionId: number,
  QuestionCreatedDateJSTime: number,
  QuestionTitle: string,
  QuestionDescription: string,
  UserId: number,
  UserNameSurname: string,
  UserPhotoPath: string,
  IsApprovedFromAdmin: boolean,
  IsRejectedFromAdmin: boolean
}
// #project-question  end

//#region Project-Product
export interface ProductModelForProject {
  ProjectProductId: number,
  ProductId: number,
  PinLocation: string,
  ProductPhoto: string,
  ProductTitle: string,
  ProductPrice: number,
  DiscountedPrice: number,
  AdvertRate: number,
  AdvertId: number,
  Category: string,
  BarcodeNo: string,
  ModelNo: string,
  Brand: string,
  ProductVariation: ProductSearchVariationModel[],
  ProductProperty: string,
  RawVariationData: string,
  ProductSeoUrl: string
}

export interface ProjectProductInnerModel {
  ProductId: number,
  PinLocation: string
}

export interface ProImageListModel {
  MediaId: number,
  FileName: string,
  FileUrl: string
  IsMainPhoto: boolean
}

export interface ProjectProductListModel {
  Data: ProjectProductListInnerModel[],
  TotalCount: number
}

export interface ProjectProductListInnerModel {
  ProjectProductId: number,
  ProductId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  IsEnabled: boolean,
  Category: string,
  Brand: string,
  SellerCount: number,
  VariationCount: number,
  BuyboxPrice: number,
  CreatedDateJSTime: number
}
//#endregion

//#region management campaign module start
export interface CampaignListModel {
  Data: CampaignListInnerModel[],
  TotalCount: number
}

export interface CampaignListInnerModel {
  CampaignId: number,
  CampaignName: string,
  CampaignSeoUrl: string,
  Discount: number,
  DiscountType: number,
  StartDateJSTime: number,
  EndDateJSTime: number,
  LastJoinDateJSTime: number,
  Status: boolean,
  PhotoUrl: string,
  DiscountCommissionPercentage: number,
  AdvertCount: number,
  SellerId: number,
  StoreName: string,
  CampaignType: string
}

export interface DropzoneFileUploadModel {
  FileUrl: string,
  FileName: string
}

export interface CampaignDetailModel {
  CampaignId: number,
  CampaignName: string,
  StartDateJSTime: number,
  EndDateJSTime: number,
  PhotoUrl: string,
  ShowCountdown: boolean,
  SeoUrl: string,
  Status: boolean,
  Description: string,
  JoinInfo: string,
  CommissionDiscount: number,
  RequiredDiscount: number,
  SellerAdvertLimit: number,
  Categories: CampaignCategoryModel[],
  Discount: number,
  DiscountType: number,
  LastJoinDateJSTime: number,
  CreatedDateJSTime: number,
  RequiredStockAmount: number,
  MustPayStockAmount: number,
  SameBasketReuseCount: number,
  ReportData: CampaignReportModel,
  MainAdvertData: CampaignMainAdvertModel,
  SellerStoreName: string,
  CreatorSellerId: number,
  CampaignType: number,
  SortNumber:number,
}

export interface CampaignCategoryModel {
  CategoryId: number,
  CategoryName: string
}

export interface CampaignReportModel {
  OrderedCount: number,
  AddBasketCount: number,
  TotalEarning: number,
  ViewCount: number,
}

export interface CampaignMainAdvertModel {
  AdvertId: number,
  PhotoUrl: string,
  Name: string,
  StockCount: number,
  SalePrice: number,
  ShowProduct: boolean
}

export interface CampaignAdvertListModel {
  Data: CampaignAdvertListInnerModel[],
  TotalCount: number
}

export interface CampaignAdvertListInnerModel {
  AdvertId: number,
  CampaignAdvertId: number,
  PhotoUrl: string,
  ProductName: string,
  Barcode: string,
  ModelNo: string,
  Category: string,
  StockCode: string,
  StockCount: number,
  MarketPrice: number,
  SalePrice: number,
  BuyboxPrice: number,
  SellerId: number,
  StoreName: string,
  BrandName: string,
  CreatedDate: number,
  CreatedDateJSTime: number,
}


export interface CampaignJoinRequestListModel {
  Data: CampaignJoinRequestListInnerModel[],
  TotalCount: number,
}

export interface CampaignJoinRequestListInnerModel {
  SellerId: number,
  StoreName: string,
  StoreRate: number,
  RequestCrateDateJSTime: number,
  SelectedAdvertCount: number,
  ApprovedAdvertCount: number,
  RequestId: number,
}


export interface CampaignJoinRequestAdvertListModel {
  Data: CampaignJoinRequestAdvertListInnerModel[],
  TotalCount: number,
}

export interface CampaignJoinRequestAdvertListInnerModel {
  CampaignJoinRequestAdvertId: number,
  AdvertId: number,
  PhotoUrl: string,
  ProductName: string,
  Barcode: string,
  ModelNo: string,
  Category: string,
  StockCode: string,
  StockCount: number,
  MarketPrice: number,
  SalePrice: number,
  BuyboxPrice: number,
  RequestId: number,
  DiscountRate: number,
}

export interface CampaignJoinedAdvertListModel {
  Data: CampaignJoinedAdvertListInnerModel[],
  TotalCount: number
}

export interface CampaignJoinedAdvertListInnerModel {
  AdvertId: number,
  PhotoUrl: string,
  ProductName: string,
  Barcode: string,
  ModelNo: string,
  Category: string,
  StockCode: string,
  StockCount: number,
  MarketPrice: number,
  SalePrice: number,
  BuyboxPrice: number,
  CampaignAdvertId: number,
  DiscountRate: number//frontta eklendi kontrol edilmesi gerekiyo
}

export interface ProductAdvertListModel {
  Data: ProductAdvertListInnerModel[],
  TotalCount: number
}

export interface ProductAdvertListInnerModel {
  DraftId: number,
  AdvertId: number,
  ProductId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  StockCode: string,
  StockCount: number,
  MarketPrice: number,
  SalePrice: number,
  BuyboxPrice: number,
  SellerName: string,
  SellerId: number,
  CreatedDateJSTime: number,
  AdvertStatus: number,
  ShowProduct: boolean,
  ProductIsEnabled: boolean,
  FavoriteCount: number,
  ShoppingCartCount: number
}

// #endregion

//#region prorequeststart
export interface ProRequestListModel {
  Data: ProRequestListInnerModel[],
  TotalCount: number
}

export interface ProRequestListInnerModel {
  ClientName: string,
  CreatedDate: string,
  ProId: number,
  StoreName: string,
  Statue: number,
  Id: number,
  OfferExpireDateJS: number,
  CreatedOfferDateJS: number,
  RemainingOfferDateJS: number
}

export interface ProRequestModel {
  DataType: number,
  Question: string,
  QuestionId: number,
  Value: string
}

export interface ProRequestDetailModel {
  Data: ProRequestDetailInnerModel,
  RemainingHours: number
}
export interface ProRequestDetailInnerModel {
  Answers: ProRequestModel[],
  CategoryName: string,
  ClientName: string,
  ClientPhoto: string,
  ProPhoto: string,
  StoreName: string,
  CreatedDate: string,
  Statue: number,
  Id: number,
  ProId: number,
  SiteUserId: number,
  CategoryId: number,
  RejectTitle: string,
  RejectReason: string,
  RejectDate: string,
  CityId: number,
  WorkId: number,
  DistrictId: number,
  CityName: string,
  DistrictName: string,
  DateOption: number,
  RequestedServiceDate: string,
  OfferExpireDateJS: number,
  RemainingOfferDateJS: number,
  CreatedOfferDateJS: number,
  OfferId: number
}
//#endregion

//#region proofferstart
export interface ProOfferModel {
  Id: number,
  CreatedDate: number,
  OfferExpireDateJS: number,
  ProId: number,
  TotalPrice: number,
  ProjectDayCount: number,
  StoreName: string,
  SiteUserId: number,
  ClientName: string,
  Status: number,
  CategoryId: number,
  CategoryName: string,
  RejectTitle: string,
  RejectReason: string,
  RejectDate: string,
  ApproveDate: string,
  RequestId: number,
  JobStartDateJS: number,
  JobDueDateJS: number,
  Description: string,
  TotalWorkmanshipPrice: number,
  TaxRate: number,
  IsQuickOffer: boolean
  requestDateJS: number,
  PaymentType: number,
  InstallmentCount: number,
  PaymentFrequencyType: number,
  MaterialList: OfferMaterialModel[],
  InstallmentList: OfferInstallmentModel[],
}

export interface OfferMaterialModel {
  MaterialName: string,
  Brand: string,
  Quantity: number,
  Unit: number,
  TaxRate: number,
  TotalPrice: number,
}

export interface OfferInstallmentModel {
  InstallmentOrder: number,
  Price: number,
  PriceRatio: number,
  TotalInstallmentCount: number,
}

//#endregion

//#region General-Content-Models
export interface GeneralContentSliderListModel {
  Data: GeneralContentSliderModel[],
  TotalCount: number
}

export interface GeneralContentSliderModel {
  Id: number,
  Type: number,
  PhotoUrl: string,
  OrderBy: number,
  Title: string,
  SubTitle: string,
  TitleColor: string,
  SubTitleColor: string,
  ButtonTitleColor: string,
  RedirectLink: string,
  ButtonTitle: string,
  IsBlank: boolean,
  IsEnabled: boolean,
  ShowOnWebsite: boolean,
  ShowOnMobilWeb: boolean,
  ShowOnApp: boolean
}

export interface TestimonialListModel {
  Data: TestimonialModel[],
  TotalCount: number
}

export interface TestimonialModel {
  Id: number,
  Type: number,
  PhotoUrl: string,
  OrderBy: number,
  NameSurname: string,
  CompanyName: string,
  Title: string,
  Description: string,
  IsEnabled: boolean
}

export interface PromotionInfoListModel {
  Data: PromotionInfoModel[],
  TotalCount: number
}

export interface PromotionInfoModel {
  Id: number,
  Type: number,
  PhotoUrl: string,
  OrderBy: number
  Title: string,
  Description: string,
  IsEnabled: boolean,
  WhereToShow: number,
  ButtonUrl?: string,
  ButtonText?: string
}

export interface GeneralContentAboutListModel {
  Data: GeneralContentAboutModel[],
  TotalCount: number
}

export interface GeneralContentAboutModel {
  Id: number
  Type: number
  IconUrl: string,
  PhotoUrl: string,
  OrderBy: number,
  Title: string,
  SubTitle: string,
  ButtonText: string,
  Description: string
}


export interface MembershipPackageModel {
  Id: number,
  Type: number,
  Title: string,
  Price: number,
  Duration: string,
  Description: string
}
//#endregion

export interface RejectReasonCountModel {
  Type: number,
  Count: number
}

export interface RejectReasonsCountListModel {
  Id: number,
  Type: number,
  Text: string
}

export interface RejectReasonsModel {
  Id: number,
  Type: number,
  Text: string
}

export interface RejectReasonsListModel {
  Data: RejectReasonsModel[],
  TotalCount: number
}

export interface RejectReasonsListShowModel {
  Name: string,
  User: string,
  Condition: string,
  Count: number,
  Type: number

}

export enum RejectReasonTypes {
  REQUEST_CANCEL = 0,
  REQUEST_REJECT = 1,
  OFFER_REJECT = 2,
  WORK_CANCEL_FROM_PRO = 3,
  WORK_CANCEL_FROM_USER = 4,
  REPORT_PROFESSIONAL = 5,
  REPORT_WORK = 6
}

//#region Support-Models
export interface SupportSubjectListModel {
  Data: SupportSubjectModel[],
  TotalCount: number
}

export interface SupportSubjectModel {
  Id: number,
  CreatedDate: number,
  Title: string,
  OrderBy: number,
  Type: number
}

export interface SupportRequestListModel {
  Data: SupportRequestModel[],
  TotalCount: number
}

export interface SupportRequestModel {
  Id: number,
  CreatedDate: number,
  Subject: string,
  Name: string,
  Email: string,
  Description: string,
  Type: number,
  StoreId: number
}

//#endregion


//#region product list start

export interface ProductQuestionModelList {
  Data: ProductQuestionInnerModelList[],
  TotalCount: number
}
export interface ProductQuestionInnerModelList {
  ProductId: number,
  AdvertId: number,
  MainPhoto: string,
  ProductName: string,
  BarcodeNo: string,
  Category: string,
  ModelNo: string,
  QuestionCount: number,
  UnansweredQuestionCount: number,
  WaitingApprovalQuestionCount: number,
  AverageRate: number,
  StockCode: string, //fe
}

export interface ProductQuestionModelForPanel {
  Data: ProductQuestionInnerListModelForPanel[],
  TotalCount: number,
}

export interface ProductQuestionInnerListModelForPanel {
  ProductQuestionId: number,
  QuestionCreatedDateJSTime: number,
  UserId: number,
  SellerId: number,
  SellerStoreName: string,
  ProductId: number,
  ProductPhoto: string,
  ProductName: string,
  BarcodeNo: string,
  Question: string,
  Answer: string,
  IsAnswered: boolean,
  IsApprovedFromAdmin: boolean,
  IsRejectedFromAdmin: boolean,
  UserNameSurname: string,
  UserPhotoPath: string,
  AnswerDateJSTime: number,
  ApprovedDateJSTime: number,
}
//#endregion
//#region Order List start
export interface OrderListModel {
  Data: OrderListInnerModel[],
  TotalCount: number
}
export interface OrderListInnerModel {
  OrderId: number,
  UserOrderId: number,
  ImageList: string[],
  UserId: number,
  Status: string,
  StatusByte: number,
  CargoTrackNo: string,
  ProductCount: number,
  DeliveryCount: number,
  IsFreeShipping: boolean,
  IsAnyDelayedShipping: boolean,
  BuyerNameSurname: string,
  BuyerPhotoUrl: string,
  DeliveryAddressCity: string,
  DeliveryAddressDistrict: string,
  TotalPrice: number,
  CreatedDateJSTime: number,
  LastShippingDateJSTime: number,
  Sellers: SellerTempModel[],
  CancelDateJSTime: number,
  CanceledProductCount: number,
  ProductTotalPrice: number,
  CancelTitle: string,
  CancelReason: string,
  IsAnyCanceledProductByUser: boolean,
  IsAnyCanceledProductBySeller: boolean,
  ProductStatuses: number[],
  IsAnyRefundRejected: boolean,
  RefundCount: number,
  RefundPrice: number,
  RefundDateJSTime: number,
  RefundReason: string,
  RefundDescription: string,
  ShortestDeliveryDateJSTime?: number
}

export interface SellerTempModel {
  SellerId: number,
  SellerStoreName: string,
}

export interface AdminOrderDetailModel {
  CargoList: AdminOrderCargoListModel[]
  UserId: number,
  BillAddressDescription: string,
  BillAddressNameSurname: string,
  BillAddressPhone: string,
  BillCompanyName: string,
  BillTaxNumber: string,
  BillTaxDepartment: string,
  BillCitizenshipNo: string,
  DeliveryAddressDescription: string,
  DeliveryAddressNameSurname: string,
  DeliveryAddressPhone: string,
  IsPersonalBill: boolean,
  UserMail: string,
  TotalPrice: number,
  CargoPrice: number,
  TotalDiscount: number,
  ProductTotalPrice: number,
  ProductTotalPriceWoTax: number,
  Sellers: SellerTempModelForOrderDetail[]
  CreatedDateJSTime: number,
  ProductCount: number,
  OrderStatus: number,
  OrderStatusString: string,
  OrderNumber: number,//fe
  CargoType: string,//fe
  PaymentStatus: string,//fe
  PaymentDate: number,//fe
  PaymentType: string,//fe
  InstallmentCount: number,//fe
}

export interface SellerTempModelForOrderDetail {
  SellerOrderId: number,
  OwnerSellerId: number,
  SellerSeoUrl: string,
  SellerName: string,
  TotalPrice: number,
  Products: ProductsTempModel[],
}

export interface ProductsTempModel {
  SellerOrderProductId: number,
  ProductId: number,
  ProductName: string,
  ProductMainPhoto: string,
  Amount: number,
  Price: number,
  DiscountedPrice: number,
  Bill: string,
  TotalPrice: number,
  ProductStatus: string,
  ProductStatusCode: number,
  CargoTrackNo: string,
  CargoTrackUrl: string,
  CargoStatus: string,
  CargoIsDelivered: boolean,
  RefundAvailable: boolean,
  RefundTrackNo: string,
  CargoId: number,
  RefundCargoCompanyName: string,
  RefundCargoCompanyLogo: string,
  RefundCargoTrackNo: string,
  RefundCargoStatus: string,
  RefundCargoIsDelivered: boolean,
  CargoCompanyName: string,
  CargoCompanyLogo: string,
  RefundCargoId: number,
  EstimatedDeliveryDateJSTime: number,
  RefundFiles: string[],
  RefundReason: string,
  RefundDescription: string,
  RefundPaymentInfo: string,
  LastUpdateDateJSTime: number,
  Properties: string,
  BarcodeNo: string,//fe
  ShortestDeliveryDateJSTime: number, //fe -> kargo için kalan süre
  ProductApprovedOrRejectedDate: number, //fe -> onay/iptal tarihi
  ProductStatusType: number, //ürün durumu
}

export interface AdminOrderCargoListModel {
  CargoCompany: string,
  CargoCompanyImage: string,
  CargoBarcode: string,
  ShippedDateJSTime: number,
  DeliveredDateJSTime: number,
  SellerName: string,
  ProductList: SellerOrderCargoProductListModel[],
  CanCargoCancellable: boolean,
  CargoTrackNo: string,
  CargoTrackUrl: string,
}

export interface SellerOrderCargoProductListModel {
  Id: number,
  Name: string,
  Amount: number,
  Barcode: string,
  PhotoUrl: string,
}

export interface CanceledOrderListModel {
  Data: OrderListInnerModel[],
  TotalCount: number,
  CanceledBySellerOrderCount: number,
  CanceledByUserOrderCount: number,
}
//#endregion
// #region idea-project question list start
export interface AllProjectQuestionListModel {
  Data: AllProjectQuestionListInnerModel[],
  TotalCount: number
}

export interface AllProjectQuestionListInnerModel {
  Id: number,
  CategoryId: number,
  IsEnabled: boolean,
  IsIdeaApproved: boolean,
  Name: string,
  QuestionCount: number,
  CategoryName: string,
  UnansweredQuestionCount: number,
  WaitingApprovalQuestionCount: number,
  StoreName: string,
  ProId: number,
}

export interface WaitingApprovalQuestionListModel {
  Data: WaitingApprovalQuestionListInnerModel[],
  TotalCount: number
}

export interface WaitingApprovalQuestionListInnerModel {
  Answer: string,
  AnswerDateJSTime: number,
  IsAnswered: boolean,
  ProjectId: number,
  ProjectName: string,
  ProjectCategory: string,
  ProjectQuestionId: number,
  QuestionCreatedDateJSTime: number,
  QuestionTitle: string,
  QuestionDescription: string,
  UserId: number,
  UserNameSurname: string,
  UserPhotoPath: string,
  ProId: number,
  ProStoreName: string,
}

// #region idea-project question list end
//#dynamic lists start
export interface ProductAdvertListModel {
  Data: ProductAdvertListInnerModel[],
  TotalCount: number
}

export interface ProductAdvertListInnerModel {
  DraftId: number,
  AdvertId: number,
  ProductId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,

  Category: string,
  StockCode: string,
  StockCount: number,
  MarketPrice: number,
  SalePrice: number,
  BuyboxPrice: number,
  SellerName: string,
  SellerId: number,
  CreatedDateJSTime: number,
  AdvertStatus: number,
  ProductIsEnabled: boolean,
  ShowProduct: boolean
}

export interface ItemModel {
  ItemId: number,
  PhotoUrl: string,
  RedirectUrl: string,
  Title: string,
  Description: string,
  IsIdeaMainProduct: boolean
}

export interface BlockImagesMediaModel {
  FileUrl: string,
  FileName: string,
}

export interface BlockImagesModel {
  PhotoUrl: string,
  SeoUrl: string,
  Title: string,
  Description: string
}

export interface PlacementModel {
  PageLocation: number,
  CategoryId?: number,
  SortOrder: number,
  IsShownOnWeb: boolean,
  IsShownOnMobileApp: boolean,
}

export interface DynamicListListModel {
  Data: DynamicListListInnerModel[],
  TotalCount: number
}

export interface DynamicListListInnerModel {
  DynamicListId: number,
  Type: number,
  ShownType: number,
  Title: string,
  ContentCount: number,
  PlacementCount: number,
}

export interface DynamicListDetailModel {
  DynamicListId: number,
  Type: number,
  ShownType: number,
  Title: string,
  ButtonTitle: string,
  ButtonUrl: string,
  Description: string,
  CanSellerPromote: boolean,
  ContentCount: number,
  PlacementCount: number,
  ProductAdvert: ProductAdvertListInnerModel,
  OneDaySellerPromotePrice: string,
  ThreeDaySellerPromotePrice: string,
  SevenDaySellerPromotePrice: string,
  FourteenDaySellerPromotePrice: string,
  ProductBarcode: string,
  ProductId: number,
  ProductName: string,
  ProductPhoto: string,
}

export interface DynamicListItemModel {
  Data: DynamicListItemInnerModel[],
  TotalCount: number
}


export interface DynamicListItemInnerModel {
  Type: number
  CreatedDate: number,
  Advert: DynamicListAdvertModel,
  SellerCategory: DynamicListSellerCategoryModel,
  Professional: DynamicListProfessionalModel,
  ProfessionalCategory: DynamicListProfessionalCategoryModel,
  IdeaCategory: DynamicListIdeaCategoryModel,
  Idea: DynamicListIdeaModel,
  IdeaProduct: DynamicListIdeaProductModel
  Media: DynamicListMediaModel,
  Blog: DynamicListBlogModel,
}

export interface DynamicListAdvertModel {
  ItemId: number,
  AdvertId: number,
  MainPhoto: string,
  Title: string,
  BarcodeNo: string,
  StockCount: number,
  IsPromoted: boolean
  Category: string,
  SalePrice: number,
  AdvertRate: number,
  PromoteStartDateJsTime: number,
  PromoteEndDateJsTime: number,
  ProductName: string,
}

export interface DynamicListSellerCategoryModel {
  ItemId: number,
  CategoryId: number,
  CategoryPhoto: string,
  CategoryName: string,
  ParentName: string,
  CommissionPercentage: number,
  CategoryStatus: boolean,
}

export interface DynamicListProfessionalModel {
  ItemId: number,
  ProfessionalId: number,
  StoreName: string,
  IsPromoted: boolean
  PromoteStartDateJsTime: number,
  PromoteEndDateJsTime: number,
  StoreRate: number,
  OfferCount: number,
  FavoriteCount: number,
  ServiceCount: number,
  IsEnabled: boolean

}
export interface DynamicListProfessionalCategoryModel {
  ItemId: number,
  CategoryId: number,
  CategoryPhoto: string,
  CategoryName: string,
  ParentName: string,
  CategoryStatus: boolean,
}

export interface DynamicListIdeaCategoryModel {
  ItemId: number,
  CategoryId: number,
  PhotoPath: string,
  Name: string,
  Code: string,
  IsEnabled: boolean,
}

export interface DynamicListIdeaModel {
  ItemId: number,
  IdeaId: number,
  Name: string,
  CategoryName: string,
  ViewCount: number,
  FavoriteCount: number,
  IsEnabled: boolean,
  IdeaPrice: number//gereksiz??
}

export interface DynamicListIdeaProductModel {
  ItemId: number,
  IdeaId: number,
  IdeaName: string,
  IdeaPrice: number,
}

export interface DynamicListMediaModel {
  ItemId: number,
  PhotoUrl: string,
  RedirectUrl: string,
  Title: string,
  Description: string,
}

export interface DynamicListBlogModel {
  ItemId: number,
  BlogId: number,
  Title: string,
  PhotoUrl: string,
  CategoryName: string,
  AuthorName: string,
  IsEnabled: boolean
}

export interface DynamicListAddingMediaModel {
  PhotoUrl: string,
  RedirectUrl: string,
  Title: string,
  Description: string,
}

export interface DynamicListPlacementModel {
  Data: DynamicListPlacementInnerModel[],
  TotalCount: number
}

export interface DynamicListPlacementInnerModel {
  PlacementId: number,
  Location: string,
  SortOrder: number,
  ShowOnWeb: boolean,
  ShowOnMobile: boolean,
  Statue: boolean,
}


//#dynamic lists end
//#region customer shipping price list

export interface CustomerShippingPriceListModel {
  Data: CustomerShippingPriceListInnerModel[],
  TotalCount: number
}


export interface CustomerShippingPriceListInnerModel {
  Id: number,
  MinPrice: number,
  MaxPrice: number,
  CargoPrice: number,
  IsFreeShipping: boolean
}

//#endregion

//#region RefundRequest
export interface RefundOrderListModel {
  Data: RefundOrderListInnerModel[],
  WaitingSellerApproveCount: number,
  ApprovedRefundCount: number,
  RejectedRefundCount: number,
  WaitingAdminActionCount: number,
}

export interface RefundOrderListInnerModel {
  OrderProductId: number,
  RefundCreatedDateJSTime: number,
  OrderCreatedDateJSTime: number,
  RefundUpdateDateJSTime: number,
  AdvertId: number,
  ProductId: number,
  Amount: number,
  IsPricePaidToSeller: boolean,
  IsRefundRequestedBefore: boolean,
  RefundCargoTrackNo: string,
  RefundReason: string,
  RefundDescription: string,
  RefundProofFile: string[],
  RefundSellerRejectDescription: string,
  RefundSellerRejectReason: string,
  RefundTransactionId: string,
  SellerOrderId: number,
  UserOrderId: number,
  TotalPrice: number,
  StoreName: string,
  SellerId: number,
  BuyerId: number,
  BuyerName: string,
  BuyerPhoto: string
  ProductName: string,
  BarcodeNo: string,
  Variations: string,
  MainPhotoUrl: string,
  Status: number
}

export enum AdminRefundOrderFilterType {
  WAITING_SELLER_APPROVE = 1,
  APPROVED_REFUND = 2,
  REJECTED_REFUND = 3,
  WAITING_ADMIN_ACTION = 4
}

export enum ProductOrderDataType {
  WAITING = 0,
  PREPARING = 1,
  SHIPPED = 2,
  DONE = 3,
  CANCELED = 4,
  REFUND_REQUESTED = 5,
  REFUNDED = 6,
  REFUND_REJECTED = 7,
  SHIPPING_PROCESS = 8,
}
//#endregion

//#region Work
export interface WorkListModel {
  Data: WorkListInnerModel[],
  TotalCount: number
}

export interface WorkListInnerModel {
  WorkId: number,
  ProId: number,
  ProPhoto: string,
  ProStoreName: string,
  ProRate: number,
  ProCommentCount: number,
  RequestId: number,
  RequestCreatedDate: number,
  Status: number,
  StatusExpirationDate: number,
  ProOfferId: number,
  ProOfferExpirationDate: number,
  ProOfferApproveDate: number,
  WorkCompleteDescription: string,
  WorkCompleteDate: number,
  WorkCompleteApproveDate: number,
  RejectReason: string,
  RejectTitle: string,
  RejectDate: number,
  RequestCancelFromPro: boolean,
  RequestCancelFromUser: boolean,
  StartPenaltyFeeDesc: string,
  StartPenaltyFee: number,
  CompletePenaltyFeeDesc: string,
  CompletePenaltyFee: number,
  PlannedWorkStartDate: number,
  PlannedWorkCompleteDate: number,
  TotalPrice: number,
  WorkName: string,
  IsEvaluated: boolean,
  CancelPenaltyFeeForUserDesc: string,
  CancelPenaltyFeeForUser: number,
  CancelPenaltyFeeForProDesc: string,
  CancelPenaltyFeeForPro: number,
  UserId: number,
  UserPhoto: string,
  UserName: string,
  PaymentStatus: number,
  WorkStartDateJS: number,
  CancellationReason: string,
  CancellationTitle: string,
  CancellationDateJS: number,
  CreatedDateJS: number,
  IsCancellationRejected: boolean,
  IsProSendedCancelRequest: boolean
}

export const WorkPaymentStatus =
{
  COMPLETED: 1,
  WAITING_FOR_INSTALLMENT_PAY: 2,
  PAYMENT_DELAY: 3,
  WAITING_FOR_REFUND: 4,
  REFUNDED: 5
}

export const WorkRejectReasonTypes = {
  REQUEST_CANCEL: 7,
  REQUEST_REJECT: 1,
  OFFER_REJECT: 2,
  WORK_CANCEL_FROM_PRO: 3,
  WORK_CANCEL_FROM_USER: 4,
  REPORT_PROFESSIONAL: 5,
  REPORT_WORK: 6,
  CANCEL_REQUEST_REJECT: 8
}

export interface WorkRejectReasonListModel {
  Data: WorkRejectReasonListInnerModel[],
  TotalCount: number
}


export interface WorkRejectReasonListInnerModel {
  Id: number,
  Type: number,
  Text: string
}

export interface WorkPaymentListModelForAdmin {
  Data: WorkPaymentListInnerModelForAdmin[],
  TotalCount: number
}

export interface WorkPaymentListInnerModelForAdmin {
  WorkId: number,
  ProId: number,
  UserId: number,
  UserName: string,
  ProStoreName: string,
  UserPhoto: string,
  WorkName: string,
  PaymentType: string,
  PaymentDateJSTime: number,
  TotalPrice: number,
  RemainingPrice: number,
  InstallmentOrder: number,
}

export interface WorkPaymentModel {
  InstallmentOrder: number,
  Price: number,
  PriceRatio: number,
  TotalInstallmentCount: number,
  MustPayDateJS: number,
  PayedDateJS: number,
  IsPayed: boolean,
  PaymentType: number,
  TransactionId: string
}

export const WorkStatus =
{
  REQUEST_CANCELED: 0,
  REQUEST_REJECTED: 1,
  WAITING_OFFER: 2,
  WAITING_OFFER_RESULT: 3,
  OFFER_REJECTED: 4,
  WATING_WORK_START: 5,
  WAITING_TO_WORK_COMPLETE: 6,
  WAITING_WORK_COMPLETE_APPROVAL: 7,
  WORK_COMPLETED: 8,
  WORK_CANCELED_BY_PRO: 9,
  WORK_CANCELED_BY_USER: 10
}


export interface WorkDetailModel {
  WorkId: number,
  ProId: number,
  ProPhoto: string,
  ProStoreName: string,
  ProRate: number,
  ProCommentCount: number,
  RequestId: number,
  RequestCreatedDate: number,
  Status: number,
  StatusExpirationDate: number,
  ProOfferId: number,
  ProOfferExpirationDate: number,
  ProOfferApproveDate: number,
  WorkCompleteDescription: string,
  WorkCompleteDate: number,
  WorkCompleteApproveDate: number,
  RejectReason: string,
  RejectTitle: string,
  RejectDate: number,
  RequestCancelFromPro: boolean,
  RequestCancelFromUser: boolean,
  StartPenaltyFeeDesc: string,
  StartPenaltyFee: number,
  CompletePenaltyFeeDesc: string,
  CompletePenaltyFee: number,
  PlannedWorkStartDate: number,
  PlannedWorkCompleteDate: number,
  TotalPrice: number,
  WorkName: string,
  IsEvaluated: boolean,
  CancelPenaltyFeeForUserDesc: string,
  CancelPenaltyFeeForUser: number,
  CancelPenaltyFeeForProDesc: string,
  CancelPenaltyFeeForPro: number,
  UserId: number,
  UserPhoto: string,
  UserName: string,
  PaymentStatus: number,
  WorkStartDateJS: number,
  CancellationReason: string,
  CancellationTitle: string,
  CancellationDateJS: number,
  CreatedDateJS: number,
  IsCancellationRejected: boolean,
  TotalWorkmanshipPrice: number,
  TaxRate: number,
  Documents: WorkDocumentModel[],
  MaterialList: OfferMaterialModel[],
  PaymentData: WorkPaymentModel[],
  OfferDescription: string,
  EvaluateDateJSTime: number,
  EvaluateDescription: string,
  EvaluateAverageRate: number
}

export interface WorkDocumentModel {
  WorkDocumentId: number,
  CreatedDateJS: number,
  Name: string,
  Url: string,
  Type: number
}

export interface OfferMaterialModel {
  MaterialName: string,
  Brand: string,
  Quantity: number,
  Unit: number,
  TaxRate: number,
  TotalPrice: number
}

export const OfferMaterialUnitType =
{
  PIECE: 1,
  M2: 2,
  LT: 3,
  KG: 4
}


export interface ProRequestAnswerModel {
  QuestionId: number,
  Question: string,
  DataType: number,
  Value: string,
}

export interface ProRequestNewModel {
  Id: number,
  CreatedDate: string,
  ProId: number,
  StoreName: string,
  SiteUserId: number,
  ClientName: string,
  Statue: number,
  CategoryId: number,
  CategoryName: string,
  Answers: ProRequestAnswerModel[],
  RejectTitle: string,
  RejectReason: string,
  RejectDate: string,
  CityId: number,
  DistrictId: number,
  CityName: string,
  DistrictName: string,
  DateOption: number,
  RequestedServiceDate: string,
  OfferExpireDateJS: number,
  RemainingOfferDateJS: number,
  CreatedOfferDateJS: number,
  OfferId: number
}
//#endregion
//#region Discount-Coupon
export interface DiscountCouponListModel {
  Data: DiscountCouponModel[],
  TotalCount: number
}

export interface DiscountCouponModel {
  Id: number,
  Code: string,
  Title: string,
  Description: string,
  StartDateJS: number,
  EndDateJS: number,
  MinimumCartPrice: number,
  Discount: number,
}

export interface DiscountCouponUser {
  UserId: number;
  IsUsed: boolean;
  NameSurname: string;
  CouponId: number;
}

export interface SiteUserListModel {
  Data: SiteUserModel[],
  TotalCount: number
}

export interface SiteUserModel {
  Id: number,
  UserPhoto?: string
  NameSurname: string,
  CreatedDateJS: number,
  Email: string,
  Phone: string,
  PhonePreview?: string,
  BirthDateJS: number,
  CartProductCount: number,
  TotalShoppingPrice: number,
  IsBlocked: boolean,
  Gender: number
}

export interface SiteUserAddressModel {
  Id: number,
  UserId: number,
  AddressName: string,
  AddressDescription: string,
  Country: string,
  CountryId: number,
  City: string,
  CityId: number,
  District: string,
  DistrictId: number,
  ZipCode: string,
  Phone: string,
  PhonePreview: string,
}

export interface UserOrderListModel {
  Data: UserOrderListInnerModel[],
  TotalCount: number
}

export interface UserOrderListInnerModel {
  OrderId: number,
  Status: string,
  StatusByte: number,
  ProductCount: number,
  DeliveryCount: number,
  SummaryData: string,
  ImageList: string[],
  TotalPrice: number,
  CreatedDateJSTime: number
}

export interface UserWorkListForAdminModel {
  Data: UserWorkListInnerForAdminModel[],
  TotalCount: number
}

export interface UserWorkListInnerForAdminModel {
  WorkId: number,
  ProId: number,
  StoreName: string,
  WorkName: string,
  CreatedDateJSTime: number,
  WorkStartDateJSTime: number,
  WorkCompleteDateJSTime: number,
  TotalPrice: number,
  PaymentStatus: number,
  Status: number
}

export interface UserProductEvaluateListModel {
  Data: UserProductEvaluateModel[],
  TotalCount: number
}

export interface UserProductEvaluateModel {
  EvaluateId: number,
  CreatedDateJSTime: number,
  ProductPhoto: string,
  ProductName: string,
  OrderId: number,
  SellerName: string,
  SellerId: number,
  OrderStatus: number,
  OrderStatusDescription: string
}

export interface ProductAdvertListModelForShoppingCart {
  Data: ProductAdvertListInnerModelForShoppingCart[],
  TotalCount: number
}

export interface ProductAdvertListInnerModelForShoppingCart {
  ShoppingCartItemId: number,
  AdvertId: number,
  ProductId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  StockCode: string,
  StockCount: number,
  SalePrice: number,
  SellerId: number,
  AdvertStatus: number,
  ShowProduct: boolean,
  ProductIsEnabled: boolean
}
//#endregion

//#region Agreement
export interface AgreementListModel {
  Data: AgreementModel[],
  TotalCount: number
}

export interface AgreementModel {
  Id: number,
  Type: number,
  Title: string,
  Description: string,
  OrderBy: number,
  IsEnabled: boolean
  CreatedDateJSTime: number
}
//#endregion

//#region Faq-Models
export interface FaqListModel {
  Data: FaqModel[],
  TotalCount: number
}

export interface FaqModel {
  Id: number,
  CreatedDateJSTime: number,
  Question: string,
  Answer: string,
  OrderBy: number,
  IsEnabled: boolean
}
//#endregion

//#region General-Content-Data-Type
export enum GeneralContentDataType {
  SLIDER = 1,
  PROMOTION_INFO = 2,
  TESTIMONIAL = 3,
  ABOUT = 4,
  PRO_CONTENT = 5,
  SELLER_CONTENT = 6,
  MONTHLY_MEMBERSHIP = 7,
  YEARLY_MEMBERSHIP = 8,
  FREE_TRIAL_MEMBERSHIP = 9,
  AGREEMENT = 10,
  FACEBOOK = 11,
  TWITTER = 12,
  INSTAGRAM = 13,
  YOUTUBE = 14,
  LINKEDIN = 15
}
//#endregion

//#region SocialMedia
export interface SocialMediaAccountModel {
  Id: number,
  Type: number,
  Title: string
}

//#endregion

//#region Cargo-Prices
export interface CustomerCargoPriceListModel {
  Data: CustomerCargoPriceModel[],
  TotalCount: number
}

export interface CustomerCargoPriceModel {
  Id: number,
  MinPrice: number,
  MaxPrice: number,
  CargoPrice: number,
  IsFreeShipping: boolean
}
//#endregion

//#region seller shipping price list
export interface SellerShippingPriceListModel {
  Data: SellerShippingPriceListInnerModel[],
  TotalCount: number
}

export interface SellerShippingPriceListInnerModel {
  Id: number,
  CargoCompanyId: number,
  CargoCompanyName: string,
  CargoPrice: number,
  IsFreeShipping: boolean,
  MaxDesi: number,
  MinDesi: number,
}

export interface CargoCompaniesListModel {
  Data: CargoCompaniesListInnerModel[],
  TotalCount: number
}

export interface CargoCompaniesListInnerModel {
  Id: number,
  APIScheme: string,
  LogoPath: string,
  Name: string,
  TrackUrlPattern: string,
}
//#endregion

//#region cargoLists
export interface SellerCargoPriceListModel {
  Data: SellerCargoPriceModel[],
  TotalCount: number
}

export interface SellerCargoPriceModel {
  Id: number,
  CargoCompanyId: number,
  CargoCompanyName: string,
  MinDesi: number,
  MaxDesi: number,
  CargoPrice: number,
  IsFreeShipping: boolean
}

export interface CargoCompanyListModel {
  Data: CargoCompanyModel[],
  TotalCount: number
}

export interface CargoCompanyModel {
  Id: number,
  Name: string,
  LogoPath: string,
  APIScheme: string,
  TrackUrlPattern: string
}
//#endregion

//#region shopping cart start
export interface ShoppingCartListModel {
  Data: ShoppingCartListInnerModel[],
  TotalCount: number
}

export interface ShoppingCartListInnerModel {

  ShoppingCartItemId: number,
  UserId: number,
  UserPhoto: string,
  UserName: string,
  AddedDateJSTime: number,
  SellerId: number,
  SellerName: string,
  Amount: number,
  TotalPrice: number,
  ProductCount: number,
}

export interface AdvertListForShopingCartListModel {
  Data: AdvertListForShopingCartListInnerModel[],
  TotalCount: number
}

export interface AdvertListForShopingCartListInnerModel {
  AdvertId: number,
  ProductId: number,
  ShoppingCartItemId: number,
  ProductName: string,
  ProductMainPhoto: string,
  BarcodeNo: string,
  ModelNo: string,
  Category: string,
  StockCode: string,
  StockCount: number,
  SalePrice: number,
  AdvertStatus: number,
  ShowProduct: boolean,
  ProductIsEnabled: boolean
}
//#endregion shopping cart end

//#region Product-Advert start

export enum OrderStatusTypes {
  WAITING = 0,
  PREPARING = 1,
  SHIPPED = 2,
  DONE = 3,
  CANCELED = 4,
  REFUND_PROCESSING = 5,
  REFUNDED = 6
}

export interface EvaluateAdvertListModel {
  Data: EvaluateAdvertListInnerModel[],
  TotalCount: number,
}

export interface EvaluateAdvertListInnerModel {
  OrderProductId: number,
  AdvertId: number,
  ProductId: number,
  ProductName: string,
  ProductMainPhoto: string,
  ProductCategory: string,
  BarcodeNo: string,
  UserOrderId: number,
  SellerOrderId: number,
  DeliveredDateJSTime: number,
  AdvertRate: number,
  EvaluateRate: number,
  Comment: string,
  EvaluateCount: number,
  StockCode?: string, //fe
}

export interface EvaluateAdvertDetailModel {
  Data: EvaluateAdvertDetailInnerModel[],
  TotalCount: number,
  AdvertRate: number,
  SatisfactionRate: number,
  CancelRate: number,
  RefundRate: number,
}

export interface EvaluateAdvertDetailInnerModel {
  ProductEvaluateId: number,
  ProductId: number,
  AdvertId: number,
  UserOrderId: number,
  CreatedDateJSTime: number,
  EvaluateRate: number,
  Comment: string,
  UserName: string,
  UserPhoto: string,
  UserId: number,
  OrderStatus: string,
  IsShowUserName: boolean
  SellerId: number,
  StoreName: string,
  OrderStatusType: number,//fe
}
export interface EvaluateAdvertDetailModelForSeller {
  Data: EvaluateAdvertDetailInnerModel[],
  TotalCount: number,
  StoreRate: number,
  SatisfactionRate: number,
  CancelRate: number,
  RefundRate: number,
}

//#endregion Product-Advert end

//#region Brand-Request Model
export interface BrandRequestListModel {
  Data: BrandRequestModel[],
  TotalCount: number
}

export interface BrandRequestModel {
  RequestId: number,
  CreatedDateJSTime: number,
  SellerId: number,
  StoreName: string,
  BrandName: string,
  Description: string
}
//#endregion Brand-Request Model

//#region excel start
export interface UploadedExcelLogModel {
  Data: UploadedExcelLogInnerModel[],
  TotalCount: number
}
export interface UploadedExcelLogInnerModel {
  UploadedDateJSTime: number,
  SellerId: number,
  SellerStoreName: string,
  CategoryId: number,
  CategoryName: string,
  ExcelPath: string,
  IsCompleted: boolean,
  ExcelType: number,
  ResultMessage: string
}
//#endregion excel start

//#region advertisement
export interface AdvertisementSponsorPriceListModel {
  Data: AdvertisementSponsorPriceListInnerModel[],
  TotalCount: number,
}

export interface AdvertisementSponsorPriceListInnerModel {
  AdvertisementPriceId: number,
  Type: string,
  DayCount: number,
  Price: number,
}

export interface ListSponsorPriceListModel {
  Data: ListSponsorPriceListInnerModel[],
  TotalCount: number,
}
export interface ListSponsorPriceListInnerModel {
  AdvertisementPriceId: number,
  AdType: string,
  ListType: string,
  ListName: string,
  OneDayPrice: number,
  ThreeDayPrice: number,
  SevenDayPrice: number,
  FourteenDayPrice: number,
  ListId: number //liste detay sayfasını gidip fiyat düzenleyebilmesi için (liste değilse 0 gelmeli)
}

export interface SponsoredProductListModel {
  Data: SponsoredProductListInnerModel[],
  TotalCount: number,
}
export interface SponsoredProductListInnerModel {
  AdvertisementId: number,
  AdvertisementArea: string,
  AdvertMainPhoto: string,
  AdvertTitle: string,
  AdvertId: number,
  SellerId: number,
  SellerStoreName: string,
  ProId: number,
  ProStoreName: string,
  AdvertSalePrice: number,
  AdvertisementDayCount: number,
  AdvertisementStartDateJSTime: number,
  AdvertisementEndDateJSTime: number,
  ClickCount: number,
  ViewCount: number,
  Status: string,
}

export interface SponsoredProfessionalListModel {
  Data: SponsoredProductListInnerModel[],
  TotalCount: number,
}


//#endregion advertisement

//#region ProEvaluateModels
export interface ProEvaluationSummaryModel {
  AverageTimingRate: number,
  AveragePerfectionRate: number,
  AverageSkillRate: number,
  AverageBehaviorRate: number,
  FiveStarCount: number,
  FourStarCount: number,
  ThreeStarCount: number,
  TwoStarCount: number,
  OneStarCount: number
}

export interface WorkEvaluateListModel {
  Data: WorkEvaluateListInnerModel[],
  TotalCount: number
}

export interface WorkEvaluateListInnerModel {
  WorkEvaluteId: number,
  CreatedDateJSTime: number,
  WorkId: number,
  ProId: number,
  UserId: number,
  TimingRate: number,
  PerfectionRate: number,
  SkillRate: number,
  BehaviorRate: number,
  AverageRate: number,
  UserComment: string,
  UserName: string,
  UserPhoto: string,
  WorkName: string,
  IsWorkCompleted: boolean,
  IsCommented: boolean
}

//#endregion ProEvaluateModels

//#region Pro-Detail-Request-Offer-Work-Models Start
export enum ProRequestStatues {
  WAITING_APPROVAL = 1,
  REJECTED = 2,
  OFFER_CREATED = 3,
  CANCELED = 4
}

export enum OfferStatusType {
  WAITING_APPROVAL = 1,
  APPROVED = 2,
  REJECTED = 3
}

export interface ProRequestListModelForAdmin {
  Data: ProRequestInnerModelForAdmin[],
  TotalCount: number
}

export interface ProRequestInnerModelForAdmin {
  WorkId: number,
  RequestId: number,
  CreatedDateJSTime: number,
  SiteUserId: number,
  UserName: string,
  UserPhoto: string,
  Status: number,
  CategoryId: number,
  CategoryName: string,
  RejectTitle: string,
  RejectReason: string,
  RejectDate: number,
  CreatedOfferDateJSTime: number,
  OfferExpireDateJSTime: number
}

export interface ProOfferListModelForAdmin {
  Data: ProOfferInnerModelForAdmin[],
  TotalCount: number
}

export interface ProOfferInnerModelForAdmin {
  WorkId: number,
  OfferId: number,
  CreatedDateJSTime: number,
  SiteUserId: number,
  UserName: string,
  UserPhoto: string,
  Status: number,
  CategoryId: number,
  CategoryName: number,
  RejectTitle: string,
  RejectReason: string
  RejectDate: number,
  ApprovedOfferDateJSTime: number,
  TotalPrice: number,
  ProjectDayCount: number,
  OfferExpireDateJSTime: number
}

export interface ProWorkModelListForAdmin {
  Data: ProWorkModelInnerForAdmin[],
  TotalCount: number
}

export interface ProWorkModelInnerForAdmin {
  WorkId: number,
  CreatedDateJSTime: number,
  SiteUserId: number,
  UserName: string,
  UserPhoto: string,
  Status: number,
  WorkName: string,
  RejectTitle: string,
  RejectReason: string,
  RejectDate: number,
  ApprovedWorkDateJSTime: number,
  TotalPrice: number,
  WorkStartDateJSTime: number,
  WorkCompleteDateJSTime: number,
  OfferExpireDateJSTime: number
}
//#endregion Pro-Detail-Request-Offer-Work-Models End

//#region finance start

export interface SellerCompletedPaymentList {
  Data: SellerCompletedPaymentInnerList[],
  TotalCount: number
}
export interface SellerCompletedPaymentInnerList {
  UserOrderId: number,
  SellerOrderId: number,
  SellerId: number,
  SellerStoreName: string,
  PaymentType: number,
  OrderDateJSTime: number,
  TotalPrice: number,
}

export interface WaitingInvoiceSellerPaymentsModel {
  Data: WaitingInvoiceSellerPaymentsInnerModel[],
  TotalCount: number
}

export interface WaitingInvoiceSellerPaymentsInnerModel {
  AdvertisementIds: string,
  AdvertisementType: string,
  IsBilledFromNetsis: boolean,
  MustAddReceipt: boolean,
  PaymentDateJSTime: number,
  PaymentId: number,
  PaymentType: number,
  PriceWithoutTax: number,
  ReceiptId: number,
  SellerId: number,
  SellerStoreName: string,
  TaxRate: number,
  TotalPrice: number,
  UserOrderId: number
}

export const TotalPaymentType = {
  LastPaymentNumber: 2,
  LastInvoiceNumber: 193
}
export const PaymentType = {
  SATIS: 1,
  HIZMET: 2,
  KARGO_FATURASI: 101,
  KOMISYON_FATURASI: 102,
  MARKETING_INFLUENCER_AFFILIATE_BEDELI_IADESI: 103,
  MP_EKSIK_URUN: 104,
  MP_YANLIS_URUN: 105,
  MP_KUSURLU_URUN: 106,
  TERMIN_GECIKME_FATURA_ITIRAZ: 107,
  CEZAI_SART_YANSITMA_BEDELI: 108,
  KAYIP_VE_HASARLI_KARGO_TAZMINI: 109,
  BARKODLAMA_POSETLEME: 110,
  KARGO_KAMPANYA_KATILIM_BEDELI: 111,
  KOMISYON_FARK_FATURASI_CIRO: 112,
  KUPON_SATISLARI: 113,
  MP_EKSIK_YANLIS_KUSURLU_URUN: 114,
  MP_KARGO_FATURA: 115,
  EKSIK_YANLIS_KUSURLU_URUN_FATURASI: 116,
  KOMISYON_IADESI: 117,
  TERMIN_GECIKME_BEDELI: 118,
  HEDIYE_CEKI_FATURA_ITIRAZ: 119,
  EKSIK_YANLIS_KUSURLU_URUN_FATURA_ITIRAZ: 120,
  DEPO_KAYIP: 121,
  KOMISYON_MUTABAKATI: 122,
  KOMISYON_FARK_FATURASI: 123,
  MARKETING_INFLUENCER_AFFILIATE_BEDELI: 124,
  MP_OUTSOURCE_GORSEL_BEDELI: 125,
  MARKETING_INDIRIM_KOD_BEDELI: 126,
  TEMINAT_MEKTUBU_KOMISYON_YANSITMASI: 127,
  TEDARIK_EDEMEME: 128,
  KAMPANYA_BEDELI: 129,
  CIRO_PRIMI: 131,
  KUPON_FATURASI: 132,
  MARKETING_TY_INSTAGRAM_REKLAM_BEDELI: 133,
  MARKETING_ASSOCIATE_BEDELI: 134,
  MARKETING_GORSEL_SATINALMA_BEDELI: 135,
  MARKETING_OUTDOOR_REKLAM_BEDELI: 136,
  MARKETING_PRODUKSIYON_BEDELI: 137,
  GOOGLE_ARAMA_REKLAM_BEDELI: 138,
  MARKETING_RADYO_REKLAM_BEDELI: 139,
  MARKETING_TOOL_KULLANIM_BEDELI: 140,
  MARKETING_TVC_BEDELI: 141,
  MARKETING_AGENCY_FEE_BEDELI: 142,
  MARKETING_TY_YOUTUBE_BEDELI: 143,
  ONLINE_GORSEL_REKLAM_BEDELI: 144,
  ONLINE_VIDEO_REKLAM_BEDELI: 145,
  BARKODLAMA_POSETLEME_IADELERI: 146,
  BIRIM_DESTEK_BEDELI_IADESI: 147,
  CEZAI_SART_YANSITMA_BEDELI_IADESI: 148,
  GOOGLE_ARAMA_REKLAM_BEDELI_IADESI: 149,
  KARGO_KAMPANYA_KATILIM_BEDELI_IADESI: 150,
  KATEGORI_MP_EKSIK_YANLIS_KUSURLU_URUN_IADE_FATURASI: 151,
  KATEGORI_MP_KARGO_IADE_FATURASI: 152,
  KATEGORI_TERMIN_GECIKME_BEDELI_IADE_FATURASI: 153,
  KAYIP_VE_HASARLI_KARGO_TAZMINI_IADESI: 154,
  KOMISYON_FARK_FATURASI_CIRO_IADESI: 155,
  KUPON_SATISLARI_IADESI: 156,
  MARKETING_INFLUENCER_YOUTUBE_REKLAM_BEDELI: 157,
  MARKETING_AGENCY_FEE_BEDELI_IADESI: 158,
  MARKETING_ASSOCIATE_BEDELI_IADESI: 159,
  MARKETING_GORSEL_SATINALMA_BEDELI_IADESI: 160,
  MARKETING_INFLUENCER_FIXED_BEDELI_IADESI: 161,
  MARKETING_INFLUENCER_YOUTUBE_REKLAM_BEDELI_IADESI: 162,
  MARKETING_INDIRIM_KOD_BEDELI_IADESI: 163,
  MARKETING_OUTDOOR_REKLAM_BEDELI_IADESI: 164,
  MARKETING_PRODUKSIYON_BEDELI_IADESI: 165,
  MARKETING_RADYO_REKLAM_BEDELI_IADESI: 166,
  MARKETING_TOOL_KULLANIM_BEDELI_IADESI: 167,
  MARKETING_TVC_BEDELI_IADESI: 168,
  KOMISYON_FARKI_FATURASI: 169,
  MARKETING_YT_YOUTUBE_BEDELI_IADESI: 170,
  ERKEN_ODEME_KESINTI_FATURASI: 171,
  MARKETING_SERVICES_GELIRI: 172,
  MARKETING_TY_INSTAGRAM_REKLAM_BEDELI_IADESI: 173,
  TEMINAT_MEKTUBU_KOMISYON_YANSITMASI_IADESI: 174,
  KARGO_FATURA_ITIRAZ: 175,
  KOMISYON_MUTABAKATI_IADE: 176,
  FATURA_KONTOR_SATIS_BEDELI: 177,
  KAMPANYA_KATILIM_BEDELI_KDV_8: 178,
  HEDIYE_CEKI_BEDELI_KDV_0: 179,
  COZUM_ORTAKLIGI_BEDELI_MP: 180,
  MUSTERI_MEMNUNIYETI_GIDERLERI: 181,
  MP_BAREM_ALTI_KARGO_GIDERLERI: 182,
  ONLINE_GORSEL_REKLAM_BEDELI_IADESI: 183,
  ERKEN_ODEME_KESINTI_FATURASI_IADESI: 184,
  FATURA_KONTOR_SATIS_BEDELI_IADESI: 185,
  ICRA_MASRAF_VE_FAIZ_BEDELI: 186,
  REKLAM_BEDELI: 187,
  MARKETING_INFLUENCER_FIXED_BEDELI: 188,
  MARKETING_DESTEK_BEDELI_MP: 189,
  ONLINE_VIDEO_REKLAM_BEDELI_IADESI: 190,
  BAGIS_VE_YARDIMLARI: 191,
  MARKETING_SERVIS_GELIRI_IADESI: 192,
  TUKETICI_HAKEM_HEYET_YANSITMA_BEDELI: 193,
  URUN_IPTAL_CEZAI_BEDEL: 194,
  KARGO_GECIKME_BEDELI: 195,
  HIZMET_BASLANGIC_GECIKME_BEDELI: 196,
  HIZMET_BITIS_GECIKME_BEDELI: 197,
  KATEGORI_KOMISYONU: 198,
  PROFESYONEL_ABONELIK: 199,
  SIPARIS_IPTALI: 200,
  SIPARIS_IADESI: 201,
  EKSTRE_TRANSFERINDEN_KALAN_TUTAR: 203
}

export interface InvoicedSellerPaymentsModel {
  Data: InvoicedSellerPaymentsInnerModel[],
  TotalCount: number
}

export interface InvoicedSellerPaymentsInnerModel {
  InvoiceNo: string,
  PaymentId: number,
  PaymentType: number,
  SellerId: number,
  SellerStoreName: string,
  UserOrderId: number,
  OrderDateJSTime: number,
  InvoiceDateJSTime: number,
  InvoicePath: string,
  TotalPrice: number,
  IsCanceled: boolean
}

export interface WaitingReceiptSellerModel {
  Data: WaitingReceiptSellerInnerModel[],
  TotalCount: number,
}

export interface WaitingReceiptSellerInnerModel {
  SellerId: number,
  SellerStoreName: string,
  TotalActionCount: number,
  TotalPrice: number,
}

export interface SellerPaymentsWithoutRecipteModel {
  Data: SellerPaymentsWithoutRecipteInnerModel[],
  TotalCount: number,
}

export interface SellerPaymentsWithoutRecipteInnerModel {
  PaymentId: number,
  CreatedDateJSTime: number,
  UserOrderId: number,
  InvoiceNo: string,
  PaymentType: number,
  OrderDateJSTime: number,
  InvoiceDateJSTime: number,
  TotalPrice: number,
}

export interface SellerReceiptModel {
  Data: SellerReceiptInnerModel[],
  TotalCount: number
}

export interface SellerReceiptInnerModel {
  ReceiptId: number,
  SellerId: number,
  SellerStoreName: string,
  PlannedDateJSTime: number,
  ReceiptDateJSTime: number,
  TotalPrice: number,
  IsPaid: boolean,
  SellerAccountInfo: string,
}


export interface ReceiptDetailForAdmin {
  ReceiptId: number,
  ReceiptDateJSTime: number,
  SellerId: number,
  SellerStoreName: string,
  PlannedDateJSTime: number,
  TotalPrice: number,
  SellerAccountInfo: string,
  PayedDateJSTime: number,
  ProId: number,
  ProStoreName: string,
  ProAccountInfo: string,
  CompletedTransactionIds: string[],
  UncompleteTransactionIds: string[]
}

export interface ReceiptPaymentRowModel {
  Data: ReceiptPaymentRowInnerModel[],
  TotalCount: number,
}

export interface ReceiptPaymentRowInnerModel {
  ActionType: string,
  CreatedDateJSTime: number,
  UserOrderId: number,
  WorkId: number,
  InvoiceNo: string,
  InvoicePath: string,
  PaymentType: number,
  OrderDateJSTime: number,
  WorkDateJSTime: number,
  InvoiceDateJSTime: number,
  TotalPrice: number,
}

export interface SellerPaidReceiptModel {
  Data: SellerPaidReceiptInnerModel[],
  TotalCount: number,
}

export interface SellerPaidReceiptInnerModel {
  ReceiptId: number,
  SellerId: number,
  SellerStoreName: string,
  PayedDateJSTime: number,
  ReceiptDateJSTime: number,
  TotalPrice: number,
  SellerAccountInfo: string,
}

export interface ProPaymentModelForFinance {
  Data: ProPaymentInnerModelForFinance[],
  TotalCount: number,
}

export interface ProPaymentInnerModelForFinance {
  UserId: number,
  UserPhoto: string,
  UserName: string,
  ProId: number,
  ProStoreName: string,
  WorkId: number,
  WorkDescription: string,
  PlannedPayDateJSTime: number,
  LastPayDateJSTime: number,
  IncomingPrice: number,
  RemainingPrice: number,
  TotalPrice: number,
}

export interface WaitingInvoiceProPaymentsModel {
  Data: WaitingInvoiceProPaymentsInnerModel[],
  TotalCount: number,
}

export interface WaitingInvoiceProPaymentsInnerModel {
  AdvertisementIds: string,
  AdvertisementType: string,
  IsBilledFromNetsis: boolean,
  MustAddReceipt: boolean,
  PaymentDateJSTime: number,
  PaymentId: number,
  PaymentType: number,
  PriceWithoutTax: number,
  ProId: number,
  ProStoreName: string,
  ReceiptId: number,
  TaxRate: number,
  TotalPrice: number,
  WorkId: number
}

export interface InvoicedProPaymentsModel {
  Data: InvoicedProPaymentsInnerModel[],
  TotalCount: number,
}

export interface InvoicedProPaymentsInnerModel {
  InvoiceNo: string,
  PaymentId: number,
  PaymentType: number,
  ProId: number,
  ProStoreName: string,
  WorkId: number,
  WorkDateJSTime: number,
  InvoiceDateJSTime: number,
  InvoicePath: string,
  TotalPrice: number,
  IsCanceled: boolean,
}

export interface WaitingReceiptProModel {
  Data: WaitingReceiptProInnerModel[],
  TotalCount: number,
}

export interface WaitingReceiptProInnerModel {
  ProId: number,
  ProStoreName: string,
  TotalActionCount: number,
  TotalPrice: number,
}

export interface ProPaymentsWithoutRecipteModel {
  Data: ProPaymentsWithoutRecipteInnerModel[],
  TotalCount: number,
}

export interface ProPaymentsWithoutRecipteInnerModel {
  PaymentId: number,
  CreatedDateJSTime: number,
  WorkId: number,
  InvoiceNo: string,
  PaymentType: number,
  WorkDateJSTime: number,
  InvoiceDateJSTime: number,
  TotalPrice: number,
}


export interface ProReceiptModel {
  Data: ProReceiptInnerModel[],
  TotalCount: number,
}

export interface ProReceiptInnerModel {
  ReceiptId: number,
  ProId: number,
  ProStoreName: string,
  PlannedDateJSTime: number,
  TotalPrice: number,
  ProAccountInfo: string,
  IsPaid: boolean,
}

export interface ProPaidReceiptModel {
  Data: ProPaidReceiptInnerModel[],
  TotalCount: number,
}

export interface ProPaidReceiptInnerModel {
  ReceiptId: number,
  ProId: number,
  ProStoreName: string,
  PayedDateJSTime: number,
  ReceiptDateJSTime: number,
  ProAccountInfo: string,
  TotalPrice: number,
}

export interface WaitingAdvertiseInvoiceProModel {
  Data: WaitingAdvertiseInvoiceProInnerModel[],
  TotalCount: number,
}

export interface WaitingAdvertiseInvoiceProInnerModel {
  AdvertiseId: string,
  AdvertiseType: number,
  AdvertiseDay: number,
  PaymentId: number,
  ProId: number,
  ProStoreName: string,
  PayedDateJSTime: number,
  TotalPrice: number,
}

export interface WaitingAdvertiseInvoiceSellerModel {
  Data: WaitingAdvertiseInvoiceSellerInnerModel[],
  TotalCount: number,
}

export interface WaitingAdvertiseInvoiceSellerInnerModel {
  AdvretiseId: string,
  AdvertiseType: number,
  AdvertiseDay: number,
  PaymentId: number,
  SellerId: number,
  AdvertCount: number,
  SellerStoreName: string,
  PayedDateJSTime: number,
  TotalPrice: number,
}
//#endregion finance end

//#region Work-Messages-Start
export enum WorkMessageType {
  TEXT_MESSAGE = 1,
  FILE_MESSAGE = 2,
  REQUEST_CREATED_MESSAGE = 3, // BU MESAJ USERDAN GİDER - Data Yok
  REQUEST_CANCELED_MESSAGE = 4, // BU MESAJ USERDAN GİDER - Data Yok
  REQUEST_REJECTED_MESSAGE = 5, // BU MESAJ PRODAN GİDER - {title:"", reason : ""}
  OFFER_SENDED_MESSAGE = 6, // BU MESAJ PRODAN GİDER - {offerId:number}
  OFFER_REJECTED_MESSAGE = 7, // BU MESAJ USERDAN GİDER - {offerId:number,title:"", reason : ""}
  OFFER_ACCEPTED_MESSAGE = 8, // BU MESAJ USERDAN GİDER - {offerId:number}
  WORK_STARTED_MESSAGE = 9, // BU MESAJ PRODAN GİDER - Data Yok
  WORK_COMPLETED_MESSAGE = 10, // BU MESAJ PRODAN GİDER - Data Yok
  WORK_APPROVED_MESSAGE = 11, // BU MESAJ USERDAN GİDER - Data Yok
  WORK_CANCELED_BY_PRO_MESSAGE = 12, // BU MESAJ PRODAN GİDER - {title:"", reason : ""}
  WORK_CANCELED_BY_USER_MESSAGE = 13 // BU MESAJ USERDAN GİDER - {title:"", reason : ""}
}


export interface MessageSummaryListModel {
  Data: MessageSummaryModel[],
  TotalCount: number
}

export interface MessageSummaryModel {
  WorkSummaryId: number,
  WorkId: number,
  WorkName: string,
  LastMessageDateJSTime: number,
  ProPhoto: string,
  ProName: string,
  UnreadMessageCount: number,
  WorkStatus: number
}

export interface MessageListDataModel {
  Data: MessageDataModel[],
  IsContinue: boolean,
  OldestMessageDate: number
}

export interface MessageLatestListDataModel {
  Data: MessageDataModel[],
  NewestMessageDate: number
}

export interface MessageDataModel {
  MessageId: number,
  MessageData: string,
  MessageType: number,
  CreatedDateJSTime: number,
  PhotoUrl: string,
  SenderName: string,
  IsPro: boolean,
  IsDeleted: boolean,
  IsReaded: boolean
}
//#endregion Work-Messages-End

//#region SEO
export interface GeneralSeoModel {
  Title: string,
  Description: string,
  Page: number
}

export interface CategorySeoData {
  SeoTitle: string,
  SeoDescription: string
}
//#endregion

//#region XML-Management
export interface CategoryXMLData {
  CategoryId: number,
  CategoryName: string,
  xmlUrl: string,
  LastUpdatedDateJSTime: number
}

export interface CategoryGeneralXMLData {
  catList: CategoryXMLData[],
  nextUpdate: number,
  cimriXmlData: CategoryXMLData
}
//#endregion

//#region Announcement
export enum AnnouncementSendType {
  SPECIFIC_USERS = 1,
  SELLERS_WHO_RECEIVED_AN_OFFER_LAST_THREE_DAYS = 2
}

export enum AnnouncementWhereToShowType {
  SELLER = 1,
  PROFESSIONAL = 2
}

export interface AnnouncementListModel {
  Data: AnnouncementListInnerModel[],
  TotalCount: number
}

export interface AnnouncementListInnerModel {
  AnnouncementId: number,
  Title: string,
  Description: string,
  SendedDateJSTime: string,
  IsSendLater: boolean
}

export interface AnnouncementDetailModel {
  AnnouncementId: number,
  Title: string,
  Description: string,
  SendedDateJSTime: number,
  IsSendLater: boolean,
  RedirectUrl: string,
  PhotoUrl: string,
  WhereToShow: number,
  ReceiverIds: number[]
  ReceiverData: AnnouncementReceiverModel[],
  IsSendSms: boolean,
  IsSendPush: boolean,
  IsSendWebPush: boolean,
  SendOption: number
}

export interface AnnouncementReceiverModel {
  StoreId: number,
  StoreName: string,
  MembershipDateJSTime: number
}
//#endregion

//#region Product-Advert-Detail-Models
export interface ShoppingCartListModelForAdmin {
  Data: ShoppingCartListInnerModelForAdmin[],
  TotalCount: number
}

export interface ShoppingCartListInnerModelForAdmin {
  ShoppingCartItemId: number,
  UserId: number,
  UserPhoto: string,
  UserName: string,
  AddedDateJSTime: number,
  SellerId: number,
  SellerName: string,
  Amount: number,
  TotalPrice: number,
  ProductCount: number
}

export interface GetProductsOtherSellersForAdminResponseModel {
  Data: GetProductsOtherSellersForAdminResponseInnerModel[],
  TotalCount: number
}

export interface GetProductsOtherSellersForAdminResponseInnerModel {
  SellerId: number,
  StoreName: string,
  StoreRate: number,
  StockCode: string,
  StockCount: number,
  MarketPrice: number,
  SalePrice: number,
  BuyboxPrice: number,
  ShoppingCartCount: number,
  FavoriteCount: number,
  Status: number
}

export interface ProductCampaignListModel {
  Data: ProductCampaignListInnerModel[],
  TotalCount: number
}

export interface ProductCampaignListInnerModel {
  CampaignType: string,
  CampaignKind: string,
  StartDateJSTime: number,
  EndDateJSTime: number,
  SellerId: number,
  StoreName: string,
  StoreNameSeo: string,
  DiscountRate?: number,
  CommissionDiscountRate?: number,
  CampaignId: number,
  Status: boolean,
  CampaignTypeByte: number
}

//#region ProStoreRatesModels
export interface ProStoreRateModel {
  ProId: number,
  TotalRequestCount: number,
  RejectedRequestCount: number,
  ApprovedRequestCount: number,
  ExpiredRequestCount: number,
  ApprovedRequestRate: number,
  CompletedWorkCount: number,
  CompletedInTimeWorkCount: number,
  DelayedWorkCount: number,
  WorkDelayRate: number,
  TotalMessageCount: number,
  ShortestMessageTime: number,
  LongestMessageTime: number,
  AverageMessageTime: number,
  TotalOfferCount: number,
  ApprovedOfferCount: number,
  RejectedOfferCount: number,
  TotalWorkCount: number,
  CanceledByUserWorkCount: number,
  CanceledByProWorkCount: number,
  ApprovedOfferRate: number,
  CanceledWorkRate: number
}
//#endregion

//#region store rate start
export interface StoreRatesModel {
  ApprovedProductCount: number,
  AverageCampaignDay: number,
  AverageDiscountRate: number,
  AverageProductRate: number,
  AverageShippingDay: number,
  BuyboxProductCount: number,
  BuyboxProductRate: number,
  CreatedCampaignCount: number,
  DelayedOrderCount: number,
  RefundRate: number,
  RejectedProductCount: number,
  TotalApprovedRefundCount: number,
  TotalCommentCount: number,
  TotalEvaluateCount: number,
  TotalOrderCount: number,
  TotalProductCount: number,
  TotalRefundRequestCount: number,
  OrderDelayRate: number,
  ApprovedProductRate: number,
}
//#endregion store rate start

//#region seller reject reason start
export interface SellerRejectReasonList {
  Data: SellerRejectReasonInnerList[],
  TotalCount: number
}

export interface SellerRejectReasonInnerList {
  Id: number,
  Type: number,
  Text: string,
}

export interface SellerRejectReasonsCountModel {
  Type: number,
  Count: number,
}

export interface SellerRejectReasonsListShowModel {
  Name: string,
  User: string,
  Condition: string,
  Count: number,
  Type: number
}
//#endregion seller reject reason end

//#region

export interface SellerCategoryListForElements {
  Data: SellerCategoryListWithSubsInnerModel[],
  TotalCount: number
}

export interface SellerCategoryListForVariations {
  Data: SellerCategoryListWithSubsInnerModel[],
  TotalCount: number
}

export interface SellerSubCategoryList {
  Data: SellerCategoryListWithSubsInnerModel[],
  TotalCount: number
}

export interface SellerCategoryListForGroup {
  Data: SellerCategoryListWithSubsInnerModel[],
  TotalCount: number
}

export interface SellerCategoryListWithSubsInnerModel {
  Id: number,
  CategoryName: string,
  CategoryCode: string,
  CategoryStatus: boolean,
  CategoryOrder: number,
  PhotoPath: string,
  ParentCategory: number,
  ParentName: string,
  CommissionPercentage: number,
  SubCategoryCount: number
}
//#endregion

//#region Dashboard
export interface GetDashboardLastWorksResponseModel {
  UserPhoto: string,
  UserName: string,
  ProStoreName: string,
  ProId: number,
  WorkName: string,
  WorkId: number,
  TotalPrice: number,
  PaymentStatus: number
}

export interface GetDashboardProRecoursesResponseModel {
  StoreId: number,
  Id: number,
  StoreName: string,
  PhotoUrl: string,
  Status: number
}

export interface GetDashboardSellerRecoursesResponseModel {
  StoreId: number,
  Id: number,
  StoreName: string,
  PhotoUrl: string,
  Status: number
}

export interface GetDashboardTotalCountsResponseModel {
  TotalUserCount: number,
  LastDaysUserCount: number,
  TotalProfessionalCount: number,
  LastDaysProfessionalCount: number,
  TotalProductCount: number,
  LastDaysProductCount: number,
  TotalSellerCount: number,
  LastDaysSellerCount: number,
  WaitingApprovalAdvertCount: number,
  LastDaysWaitingApprovalAdvertCount: number,
  ApprovedAdvertCount: number,
  LastDaysApprovedAdvertCount: number
}

export interface GetOrderEarningChartResponseModel //List
{
  Price: number,
  DateJSTime: number
}

export interface GetProductCategoryChartResponseModel //List
{
  CategoryName: string,
  Count: number
}

export interface GetSiteUserChartResponseModel //List
{
  DateJSTime: number,
  UserCount: number
}

export interface GetWorkCategoryChartResponseModel //List
{
  CategoryName: string
  Count: number
}

export interface GetWorkEarningChartResponseModel //List
{
  Price: number,
  DateJSTime: number
}

export interface GetDashboardLastOrdersResponseModel //List
{
  OrderId: number,
  Status: string,
  StatusByte: number,
  BuyerNameSurname: string,
  BuyerPhotoUrl: string,
  TotalPrice: number,
  CreatedDateJSTime: number,
  Sellers: { SellerId: number, SellerStoreName: string }[]
}
//#endregion

//#region start
export interface ElementFilter {
  ElementName: string,
  Values: string[]
}

export interface AvertSearchModel {
  Data: AdvertSearchResult[],
  TotalCount: number,
  Facets: FacetsModel[],
}

export interface FacetsModel {
  Alias: string,
  Data: FacetsDataModel[],
  FieldName: string,
}
export interface FacetsDataModel {
  To: string,
  Value: string,
  Count: number
}

export interface AdvertSearchResult {
  advertId: string,
  productId: number,
  productName: string,
  category: string[],
  hasStock: boolean,
  isFreeShipping: boolean,
  categoryId: number,
  sellerName: string,
  mainPhoto: string,
  rateCount: number,
  rate: number,
  price: number,
  marketPrice: number,
  discountedPrice: number,
  discountRate: number,
  seoUrl: string,
  discountStartDate: number,
  discountEndDate: number,
  campaignType: number,
  isSponsored: boolean,
  barcodeNo: string,//fe
  stockCount: number,//fe
  buyboxPrice: number,//fe
  isEnabled: boolean,//fe
}
//#endregion

//#region linked category start
export interface SellerCategoryLinkRelationAdminModel {
  Data: SellerCategoryLinkRelationAdminListModel[],
  TotalCount: number,
}
export interface SellerCategoryLinkRelationAdminListModel {
  LinkedCategoryName: string,
  LinkedCategoryPhoto: string,
  SelectedCategoryName: string,
  SelectedCategoryPhoto: string,
  RelationId: number,
  SelectedCategoryId: number,
  CategoryOrder: number,
  LinkedCategoryId: number
}

//endregion linked category end

//#region work penalty start
export interface WorkPenaltyFeeListResponseModel {
  Type: number,
  ValueType: number,
  Value: number
}

export interface WorkPenaltyFeeListShowModel {
  Name: string,
  User: string,
  Statu: string,
  ValueType: string,
  Type: number,
  Value: number
}
//#endregion work penalty end

export interface ProSubscriptionPaymentsModel {
  Data: ProSubscriptionPaymentsModel[],
  TotalCount: number
}
export interface ProSubscriptionPaymentsInnerModel {
  ProId: number,
  ProStoreName: string,
  PackageName: string
  PayedDateJSTime: number,
  TotalPrice: number
}

export const SellerType = {
  1: "Anonim Şirket",
  2: "Şahıs Şirketi",
  3: "Limited Şirket",
  4: "Kolektif Şirket",
  5: "Kooperatif Şirket",
  6: "Adi Ortaklık",
}

//#region Banner
export interface Banner {
  Id: number;
  Name: string;
  Description: string;
  BackgroundColor: string;
  StartDate: string;
  EndDate: string;
  IsEnabled: boolean;
  PhotoUrl: string;
  SkipSecond: number;
  TargetType: number;
  TargetUrl: string;
}

//#endregion

//#region Group Buy
export interface GroupParticipantSetting {
  Name: string;
  Description: string;
  Id: number;
  IsGeneral: boolean;
  ParticipantCount: number;
  SellerId: number;
}

export interface GroupLiveTimeSetting {
  Id: number;
  GroupParticipantSettingId: number;
  IsGeneral: boolean;
  SellerId: number;
  LiveTime: number;
}

export interface GroupBuyListItem {
  Id: number;
  ParticipantCount: number;
  CanGroupStartFrom: string;
  CreatedBySeller: boolean;
  Name: string;
  Description: string;
  EndDate: string;
  GroupLifeHours: number;
  ParticipantCountLimit: number;
  ProductAdvertId: number;
  ProductId: number;
  ProductName: string;
  SellerId: number;
  StartDate: string;
  GeneralStatus: number;
}

export interface GroupBuyById {
  CanGroupStartFrom: string;
  CreatedBySeller: false
  CreatorId: number;
  Deposit: number;
  Description: string;
  EndDate: string;
  GeneralStatus: number;
  GroupBuyingPrice: number;
  GroupLifeHours: number;
  Name: string;
  OrdersCreatedForSeller: boolean;
  OrdersCreatedForUser: boolean;
  ParticipantCount: number;
  ParticipantCountLimit: number;
  PaymentStatus: number;
  ProductActualPrice: number;
  ProductAdvertId: number;
  ProductId: number;
  ProductName: string;
  SellerId: number;
  SellerName: string;
  StartDate: string;
}

export interface GroupBuyParticipant {
  Id: number;
  Installment: number;
  NameAndSurname: string;
  PayedPrice: number;
  Photo: string;
  Status: number;
  SuccessPaymentDate: string;
  UserMessage: string;
}

//#endregion

