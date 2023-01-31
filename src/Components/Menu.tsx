import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { ChevronDownIcon, GroupBuyIcon, HamburgerIcon, HelmetIcon, HomeIcon, LightBulbIcon, SettingsIcon, SiteGeneralManagementIcon, StatisticalIcon, TagIcon, UserGearIcon } from "./Icons"

interface MenuItem {
  id: number,
  name: string,
  permission?: string,
  url: string,
  displayChildren?: boolean,
  children: MenuItem[],
  badgeCaller?: string
}

export const Menu: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const currentUser = context.currentUser;
  const checkUser = currentUser !== null && currentUser.IsSuperAdmin !== true;
  const [badges, setBadges] = useState<BadgeModel>({
    ProRecourseCount: 0,
    ProRequestCount: 0,
    SellerRecourseCount: 0,
    WaitingAdvertCount: 0,
    WaitingApproveAdvertQuestionCount: 0,
    WaitingApproveProjectCount: 0,
    WaitingApproveProjectQuestionCount: 0,
    WaitingBillPaymentsSeller: 0,
    WaitingBrandCount: 0,
    WaitingCategoryCount: 0,
    WaitingProReportCount: 0,
    WaitingProSupportCount: 0,
    WaitingProductUpdateCount: 0,
    WaitingSellerSupportCount: 0,
    WaitingUserSupportCount: 0,
    WaitingBillPaymentsPro: 0,
    WaitingReceiptSeller: 0,
    WaitingReceiptPro: 0,
  } as BadgeModel)

  useEffect(() => {
    if (context.IsLoggedIn?.()) {
      ApiService.getBadges().then(e => {
        if (e.succeeded)
          setBadges(e.data)
      });
    }
  }, []);


  const [menu, setMenu] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Anasayfa",
      permission: "Home",
      url: "/",
      displayChildren: true,
      children: [],
    },
    {
      id: 2,
      name: "Housiy Pro Yönetimi",
      url: "#",
      displayChildren: true,
      children: [
        {
          id: 1,
          name: "Kategori Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "ProCategoryManagement",
          children: [
            {
              id: 1,
              name: "Yeni Kategori Oluştur",
              url: "/pro-kategori-ekle",
              children: []
            },
            {
              id: 2,
              name: "Kategori Listesi",
              url: "/pro-kategori-listesi",
              children: []
            },
            {
              id: 3,
              name: "Hizmet Talepleri",
              url: "/pro-hizmet-talepleri",
              children: []
            }
          ]
        },
        {
          id: 2,
          name: "Profesyonel Rozetleri",
          url: "#",
          displayChildren: true,
          permission: "ProBadges",
          children: [
            {
              id: 1,
              name: "Yeni Rozet Oluştur",
              url: "/pro-rozet-ekle",
              children: []
            },
            {
              id: 2,
              name: "Rozet Listesi",
              url: "/pro-rozet-listesi",
              children: []
            },
            {
              id: 3,
              name: "Rozet Ata",
              url: "/pro-rozet-ata",
              children: []
            },

          ]
        },
        {
          id: 3,
          name: "Hizmetler",
          url: "#",
          displayChildren: true,
          permission: "ProServices",
          children: [
            {
              id: 1,
              name: "Talepler",
              url: "/pro-talepler",
              badgeCaller: "ProRequestCount",
              children: []
            },
            {
              id: 2,
              name: "Devam Eden İşler",
              url: "/devam-eden-isler",
              children: []
            },
            {
              id: 3,
              name: "Teslim Edilen İşler",
              url: "/teslim-edilen-isler",
              children: []
            },
            {
              id: 4,
              name: "İptal Edilen İşler",
              url: "/iptal-edilen-isler",
              children: []
            },
            {
              id: 5,
              name: "İptal Talepleri",
              url: "/is-iptal-talepleri",
              children: []
            },

            {
              id: 6,
              name: "Taksitli Ödemeler",
              url: "/taksitli-odemeler",
              children: []
            },

            {
              id: 7,
              name: "Tamamlanan Ödemeler",
              url: "/tamamlanan-odemeler",
              children: []
            },

            {
              id: 8,
              name: "Hizmet Sorun Bildirimleri",
              url: "/hizmet-sorun-bildirimleri",
              children: []
            },
          ]
        },
        {
          id: 4,
          name: "İptal-Red Yönetimi",
          url: "/iptal-red-yonetimi",
          displayChildren: true,
          permission: "ProCancelRejectManagement",
          children: []
        },
        {
          id: 4,
          name: "Üye Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "ProMembershipMembership",
          children: [
            {
              id: 1,
              name: "Üyelik Başvuru Listesi",
              url: "/pro-uye-basvuru-listesi",
              children: [],
              badgeCaller: "ProRecourseCount"
            },
            {
              id: 2,
              name: "Reddedilen Üyelik Başvuruları",
              url: "/pro-reddedilen-uye-basvuru-listesi",
              children: []
            },
            {
              id: 3,
              name: "Profesyonel Listesi",
              url: "/pro-profesyonel-listesi",
              children: []
            },
            {
              id: 4,
              name: "Profesyonel Belgeleri",
              url: "/pro-profesyonel-belgeleri-listesi",
              children: []
            },
            {
              id: 5,
              name: "Profesyonel Üyelik Listesi",
              url: "/pro-profesyonel-uye-listesi",
              children: []
            },
            {
              id: 6,
              name: "Üye Dernekleri",
              url: "/uye-dernekleri",
              children: []
            },
            {
              id: 7,
              name: "Profesyonel Sorun Bildirimleri",
              url: "/pro-sorun-bildirimleri",
              children: [],
              badgeCaller: "WaitingProReportCount"
            },
          ]
        },
        {
          id: 5,
          name: "Reklam",
          url: "#",
          displayChildren: true,
          permission: "ProAd",
          children: [
            {
              id: 2,
              name: "Sponsorlu Profesyoneller",
              url: "/sponsorlu-profesyoneller",
              children: []
            },
          ]
        }
      ],
    },
    {
      id: 3,
      name: "Housiy Satıcı Yönetimi",
      url: "#",
      children: [
        {
          id: 1,
          name: "Kategori Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "SellerCategoryManagement",
          children: [
            {
              id: 1,
              name: "Yeni Grup Oluştur",
              url: "/satici-kategori-grup-ekle",
              children: []
            },
            {
              id: 2,
              name: "Kategori Grup Listesi",
              url: "/satici-kategori-grup-listesi",
              children: []
            },
            {
              id: 3,
              name: "Yeni Kategori Oluştur",
              url: "/satici-kategori-bilgileri-ekle",
              children: []
            },
            {
              id: 4,
              name: "Kategori Listesi",
              url: "/satici-kategori-listesi",
              children: []
            },
            {
              id: 10,
              name: "Alt Kategori Listesi",
              url: "/satici-alt-kategori-listesi",
              children: []
            },
            {
              id: 11,
              name: "Kategori Ağacı",
              url: "/satici-kategori-agaci",
              children: []
            },
            {
              id: 12,
              name: "Kategori Linkleme",
              url: "/satici-kategori-linkleme",
              children: []
            },

            {
              id: 5,
              name: "Kategori Özellikleri Ayarları",
              url: "/satici-kategori-ozellikleri",
              children: []
            },
            {
              id: 6,
              name: "Kategori Varyasyon Ayarları",
              url: "/satici-kategori-varyasyonlari",
              children: []
            },
            {
              id: 7,
              name: "Kategori Talepleri",
              url: "/satici-kategori-talepleri",
              badgeCaller: "WaitingCategoryCount",
              children: []
            },
            {
              id: 8,
              name: "Markalar",
              url: "/marka-listesi",
              children: []
            },
            {
              id: 9,
              name: "Marka Talepleri",
              url: "/marka-talep-listesi",
              children: [],
              badgeCaller: "WaitingBrandCount"

            }
          ]
        },
        {
          id: 2,
          name: "Ürün Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "ProductManagement",
          children: [
            {
              id: 1,
              name: "Ürün Kataloğu",
              url: "/urun-katalogu",
              children: []
            },
            {
              id: 2,
              name: "Benzer Ürün Listesi",
              url: "/benzer-urun-listesi",
              children: []
            },
            {
              id: 3,
              name: "Ürün İlan Listesi",
              url: "/urun-ilan-listesi",
              children: []
            },
            {
              id: 4,
              name: "Onay Bekleyen İlanlar",
              url: "/onay-bekleyen-ilanlar",
              children: [],
              badgeCaller: "WaitingAdvertCount"
            },
            {
              id: 5,
              name: "Katalog Güncellemesi Bekleyen Ürünler",
              url: "/urun-katalogu-guncelleme-listesi",
              children: [],
              badgeCaller: "WaitingProductUpdateCount"
            },
            {
              id: 6,
              name: "Reddedilen İlanlar",
              url: "/reddedilen-ilanlar",
              children: []
            },
            {
              id: 7,
              name: "Ürün Değerlendirmeleri",
              url: "/urun-degerlendirmeleri",
              children: []
            },
            {
              id: 8,
              name: "Ürün Soru & Cevapları",
              url: "/urun-soru-cevap",
              badgeCaller: "WaitingApproveAdvertQuestionCount",
              children: []
            },
            {
              id: 9,
              name: "Toplu Ürün İşlemleri",
              url: "/toplu-urun-islemleri",
              children: []
            },
            {
              id: 10,
              name: "Bildirilen Ürünler",
              url: "/bildirilen-urunler",
              children: []
            }
          ]
        },
        {
          id: 3,
          name: "Kampanyalar",
          url: "#",
          displayChildren: true,
          permission: "SellerCampaigns",
          children: [
            {
              id: 1,
              name: "Kampanya Listesi",
              url: "/housiy-kampanya-listesi",
              children: []
            },
            {
              id: 2,
              name: "Satıcı Kampanyaları",
              url: "/satici-kampanya-listesi",
              children: []
            },
            {
              id: 3,
              name: "Yönetim Kampanyaları",
              url: "/yonetim-kampanyalari",
              children: []
            },
          ]
        },
        {
          id: 4,
          name: "Satıcı Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "SellerListManagement",
          children: [
            {
              id: 1,
              name: "Satıcı Başvuruları",
              url: "/satici-basvuru-listesi",
              children: [],
              badgeCaller: "SellerRecourseCount"
            },
            {
              id: 2,
              name: "Reddedilen Satıcı Başvuruları",
              url: "/reddedilen-satici-listesi",
              children: []
            },
            {
              id: 3,
              name: "Onaylı Satıcı Listesi",
              url: "/onayli-satici-listesi",
              children: []
            },
            {
              id: 4,
              name: "Satıcı Belgeleri",
              url: "/satici-belgeleri",
              children: []
            },
            {
              id: 5,
              name: "Mağaza Komisyon Oranları",
              url: "/magaza-komisyon-oranlari-listesi",
              children: []
            },
          ]
        },
        {
          id: 5,
          name: "Sipariş Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "OrderManagement",
          children: [
            {
              id: 1,
              name: "Sepet Listesi",
              url: "/sepet-listesi",
              children: []

            },
            {
              id: 2,
              name: "Sipariş Listesi",
              url: "/siparis-listesi",
              children: []

            },
            {
              id: 3,
              name: "Geciken Sipariş Listesi",
              url: "/geciken-siparis-listesi",
              children: []

            },
            {
              id: 4,
              name: "İptal Edilen Siparişler",
              url: "/iptal-edilen-siparis-listesi",
              children: []
            },
            {
              id: 5,
              name: "İade Talepleri",
              url: "/siparis-iade-talepleri",
              children: []
            },
          ]
        },
        {
          id: 70,
          name: "İptal ve İade Yönetimi",
          url: "/satici-iptal-iade-yonetimi",
          displayChildren: true,
          permission: "SellerCancelRefundManagement",
          children: [],
        },
        {
          id: 6,
          name: "Reklam",
          url: "#",
          displayChildren: true,
          permission: "SellerAd",
          children: [
            {
              id: 1,
              name: "Sponsorlu Ürünler",
              url: "/sponsorlu-urunler",
              children: []
            }
          ]
        }
      ],
    },
    {
      id: 4,
      name: "Fikirler Yönetimi",
      url: "#",
      children: [
        {
          id: 1,
          name: "Kategori Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "IdeaCategoryManagement",
          children: [
            {
              id: 1,
              name: "Yeni Kategori Oluştur",
              url: "/fikir-kategori-ekle",
              children: []
            },
            {
              id: 2,
              name: "Kategori Listesi",
              url: "/fikir-kategori-listesi",
              children: []
            },
            {
              id: 3,
              name: "Kategori Özellikleri",
              url: "/fikir-kategori-ozellikleri",
              children: []
            },
          ]
        },
        {
          id: 2,
          name: "Projeler",
          url: "#",
          displayChildren: true,
          permission: "ProjectsManagement",
          children: [
            {
              id: 1,
              name: "Onay Bekleyen Projeler",
              url: "/onay-bekleyen-projeler",
              children: [],
              badgeCaller: "WaitingApproveProjectCount"

            },
            {
              id: 2,
              name: "Onaylanan Projeler",
              url: "/onaylanan-projeler",
              children: []
            },
            {
              id: 3,
              name: "Reddedilen Projeler",
              url: "/reddedilen-projeler",
              children: []
            },
          ]
        },
        {
          id: 3,
          name: "Fikir Listesi",
          url: "/fikir-listesi",
          displayChildren: true,
          permission: "IdeaList",
          children: [],
        },
        {
          id: 5,
          name: "Fikir Soru & Cevapları",
          url: "/fikir-ve-proje-sorulari",
          displayChildren: true,
          permission: "IdeaQuestions",
          children: [],
          badgeCaller: "WaitingApproveProjectQuestionCount"
        },
      ],
    },
    {
      id: 5,
      name: "Site Genel Yönetimi",
      url: "#",
      children: [
        {
          id: 1,
          name: "Slider Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "SliderManagement",
          children: [
            {
              id: 1,
              name: "Anasayfa Slider",
              url: "/anasayfa-slider-listesi",
              children: []
            },
            {
              id: 2,
              name: "Profesyonel Slider",
              url: "/profesyonel-slider-listesi",
              children: []
            },
            {
              id: 4,
              name: "Pro-Panel Slider",
              url: "/pro-panel-slider-listesi",
              children: []
            },
            {
              id: 5,
              name: "Seller-Panel Slider",
              url: "/seller-panel-slider-listesi",
              children: []
            },
          ]
        },
        {
          id: 2,
          name: "Öne Çıkan Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "HighlightManagement",
          children: [
            {
              id: 1,
              name: "Yeni Liste Oluştur",
              url: "/yeni-liste-olustur",
              children: []

            },
            {
              id: 2,
              name: "Oluşturulan Listeler",
              url: "/olusturulan-listeler",
              children: []
            },
            {
              id: 3,
              name: "Yeni Banner Oluştur",
              url: "/banner-olustur",
              children: []
            },
            {
              id: 4,
              name: "Oluşturulan Bannerlar",
              url: "/liste-banner",
              children: []
            },
          ]
        },
        {
          id: 3,
          name: "Reklam",
          url: "#",
          displayChildren: true,
          permission: "AdManagement",
          children: [
            {
              id: 1,
              name: "Reklam Sponsorluk Ücretleri",
              url: "/reklam-sponsorluk-ucretleri",
              displayChildren: true,
              children: []
            },
            {
              id: 2,
              name: "Liste Sponsorluk Ücretleri",
              url: "/liste-sponsorluk-ucretleri",
              displayChildren: true,
              children: []
            },
          ]
        },
        {
          id: 4,
          name: "İptal-İade Yönetimi",
          url: "/iptal-iade-yonetimi",
          displayChildren: true,
          permission: "CancelRefundManagement",
          children: []
        },
        {
          id: 5,
          name: "Ceza-Hizmet Kesintileri",
          url: "/ceza-hizmet-kesintileri",
          displayChildren: true,
          permission: "PenaltyServiveDeduction",
          children: []
        },
        {
          id: 5,
          name: "Blog Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "BlogManagement",
          children: [
            {
              id: 1,
              name: "Yeni Kategori Oluştur",
              url: "/blog-kategori-ekle",
              children: []

            },
            {
              id: 2,
              name: "Kategori Listesi",
              url: "/blog-kategori-listesi",
              children: []
            },
            {
              id: 3,
              name: "Blog Yazarları",
              url: "/blog-yazar-listesi",
              children: []
            },
            {
              id: 4,
              name: "Yeni Blog Oluştur",
              url: "/blog-ekle",
              children: []
            },
            {
              id: 5,
              name: "Blog Listesi",
              url: "/blog-listesi",
              children: []
            },
          ]
        },
        {
          id: 6,
          name: "Akademi Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "AcademyManagement",
          children: [
            {
              id: 1,
              name: "Yeni Kategori Oluştur",
              url: "/akademi-kategori-ekle",
              children: []
            },
            {
              id: 2,
              name: "Kategori Listesi",
              url: "/akademi-kategori-listesi",
              children: []
            },
            {
              id: 3,
              name: "Yeni Eğitim Ekle",
              url: "/akademi-ekle",
              children: []
            },
            {
              id: 4,
              name: "Eğitim Listesi",
              url: "/akademi-listesi",
              children: []
            },
            {
              id: 5,
              name: "Yanıt Bekleyen Eğitim Soruları",
              url: "/akademi-soru-listesi",
              children: []
            },
          ]
        },
        {
          id: 7,
          name: "XML Yönetimi",
          url: "/xml-yonetimi",
          displayChildren: true,
          permission: "XMLManagement",
          children: []
        },
        {
          id: 8,
          name: "SEO Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "SEOManagement",
          children: [
            {
              id: 1,
              name: "Genel SEO",
              url: "/genel-seo",
              children: []
            },
            {
              id: 2,
              name: "Satıcı SEO",
              url: "/satici-seo",
              children: []
            },
            {
              id: 3,
              name: "Ürün SEO",
              url: "/urun-seo",
              children: []
            },
            {
              id: 9,
              name: "Ürün Grupları SEO",
              url: "/urun-gruplari-seo",
              children: []
            },
            {
              id: 4,
              name: "Ürün Kategori SEO",
              url: "/urun-kategori-seo",
              children: []
            },
            {
              id: 5,
              name: "Profesyonel SEO",
              url: "/profesyonel-seo",
              children: []
            },
            {
              id: 6,
              name: "Profesyonel Kategori SEO",
              url: "/profesyonel-kategori-seo",
              children: []
            },
            {
              id: 7,
              name: "Fikir SEO",
              url: "/fikir-seo",
              children: []
            },
            {
              id: 8,
              name: "Fikir Kategori SEO",
              url: "/fikir-kategori-seo",
              children: []
            },
          ]
        },
        {
          id: 8,
          name: "Yardım Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "HelpManagement",
          children: [
            {
              id: 1,
              name: "Yeni Grup Oluştur",
              url: "/yardim-grubu-olustur",
              children: []
            },
            {
              id: 2,
              name: "Grup Listesi",
              url: "/yardim-grup-listesi",
              children: []
            },
            {
              id: 3,
              name: "Yeni Kategori Oluştur",
              url: "/yardim-kategori-olustur",
              children: []
            },
            {
              id: 4,
              name: "Kategori Listesi",
              url: "/yardim-kategori-listesi",
              children: []
            },
            {
              id: 5,
              name: "Yardım İçeriği Oluştur",
              url: "/yardim-icerigi-olustur",
              children: []
            },
            {
              id: 6,
              name: "İçerik Listesi",
              url: "/yardim-icerik-listesi",
              children: []
            },
          ]
        },
        {
          id: 9,
          name: "Pro-Seller Login Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "ProSellerLoginManagement",
          children: [
            {
              id: 1,
              name: "Anasayfa İçerikleri",
              url: "/genel-anasayfa-icerikleri",
              children: []
            },
            {
              id: 2,
              name: "Hakkımızda İçerikleri",
              url: "/genel-hakkimizda-icerikleri",
              children: []
            },
            {
              id: 3,
              name: "Housiy Profesyonel İçerikleri",
              url: "/genel-profesyonel-icerikleri",
              children: []
            },
            {
              id: 4,
              name: "Housiy Satıcı İçerikleri",
              url: "/genel-satici-icerikleri",
              children: []
            },
            {
              id: 5,
              name: "Üyelik Paketleri",
              url: "/genel-uyelik-paketleri",
              children: []
            },
          ]
        },
        {
          id: 10,
          name: "Sözleşme Yönetimi",
          url: "/sozlesme-listesi",
          displayChildren: true,
          permission: "AgreementManagement",
          children: []
        },
        {
          id: 11,
          name: "S.S.S. Yönetimi",
          url: "/sss-listesi",
          displayChildren: true,
          permission: "FAQManagement",
          children: []
        },
        {
          id: 12,
          name: "Destek Talepleri",
          url: "#",
          displayChildren: true,
          permission: "HelpRequest",
          children: [
            {
              id: 1,
              name: "Web Destek Talepleri",
              url: "/web-destek-talepleri",
              children: [],
              badgeCaller: "WaitingUserSupportCount"
            },
            {
              id: 2,
              name: "Profesyonel Destek Talepleri",
              url: "/profesyonel-destek-talepleri",
              children: [],
              badgeCaller: "WaitingProSupportCount"
            },
            {
              id: 3,
              name: "Satıcı Destek Talepleri",
              url: "/satici-destek-talepleri",
              children: [],
              badgeCaller: "WaitingSellerSupportCount"
            },
            {
              id: 4,
              name: "Web Destek Konuları",
              url: "/web-destek-konulari",
              children: []
            },
            {
              id: 5,
              name: "Profesyonel Destek Konuları",
              url: "/profesyonel-destek-konulari",
              children: []
            },
            {
              id: 6,
              name: "Satıcı Destek Konuları",
              url: "/satici-destek-konulari",
              children: []
            },
          ]
        },
        {
          id: 13,
          name: "İndirim Kuponları",
          url: "/indirim-kuponlari",
          displayChildren: true,
          permission: "DiscountCoupons",
          children: []
        },
        {
          id: 14,
          name: "Bildirim Yönetimi",
          url: "#",
          displayChildren: true,
          permission: "NotificationManagement",
          children: []
        },
        {
          id: 15,
          name: "Duyuru Yönetimi",
          url: "/duyuru-yonetimi",
          displayChildren: true,
          permission: "AnnouncementManagement",
          children: []
        },
        {
          id: 16,
          name: "Sosyal Medya Yönetimi",
          url: "/sosyal-medya-listesi",
          displayChildren: true,
          permission: "SocialMediaManagement",
          children: []
        },
        {
          id: 17,
          name: "Kargo İşlemleri",
          url: "#",
          displayChildren: true,
          permission: "CargoManagement",
          children: []
        },
      ],
    },
    {
      id: 9,
      name: "Group Alım Yönetimi",
      url: "#",
      children: [
        {
          id: 1,
          name: "Katılımcı Ayarları",
          url: "#",
          displayChildren: true,
          permission: "SliderManagement",
          children: [
            {
              id: 1,
              name: "Katılımcı Ayarı Oluştur",
              url: "/grup-alim-katilimci-ayari/olustur",
              children: []
            },
            {
              id: 2,
              name: "Oluşturulmuş Katılımcı Ayarları",
              url: "/grup-alim-katilimci-ayarlari",
              children: []
            },
          ]
        },
        {
          id: 2,
          name: "Süre Ayarları",
          url: "#",
          displayChildren: true,
          permission: "SliderManagement",
          children: [
            {
              id: 1,
              name: "Süre Ayarı Oluştur",
              url: "/grup-alim-sure-ayari/olustur",
              children: []
            },
            {
              id: 2,
              name: "Oluşturulmuş Süre Ayarları",
              url: "/grup-alim-sure-ayarlari",
              children: []
            },
          ]
        },
        {
          id: 3,
          name: "Grup Alım",
          url: "#",
          displayChildren: true,
          permission: "SliderManagement",
          children: [
            {
              id: 1,
              name: "Grup Alım Oluştur",
              url: "/grup-alim/olustur",
              children: []
            },
            {
              id: 2,
              name: "Oluşturulmuş Grup Alımlar",
              url: "/grup-alimlar",
              children: []
            },
          ]
        },
      ],
    },
    {
      id: 6,
      name: "Üye Yönetimi",
      url: "#",
      children: [
        {
          id: 1,
          name: "Üye Listesi",
          url: "/uye-listesi",
          displayChildren: true,
          permission: "UserMembershipList",
          children: []
        },
      ],
    },
    {
      id: 7,
      name: "Finans Yönetimi",
      url: "#",
      children: [
        {
          id: 1,
          name: "Satıcı Tahsilatları",
          url: "#",
          displayChildren: true,
          permission: "SellerCollections",
          children: [
            {
              id: 1,
              name: "Tamamlanan Tahsilatlar",
              url: "/tamamlanan-tahsilatlar",
              displayChildren: true,
              children: []
            },
          ]
        },
        {
          id: 2,
          name: "Satıcı Ödemeleri",
          url: "#",
          displayChildren: true,
          permission: "SellerPayments",
          children: [
            {
              id: 1,
              name: "Faturalandırılması Gereken İşlemler",
              url: "/satici-faturalandirilmasi-gereken-islemler",
              displayChildren: true,
              children: [],
              badgeCaller: "WaitingBillPaymentsSeller"
            },
            {
              id: 2,
              name: "Faturalandırılmış İşlemler",
              url: "/satici-faturalandirilmis-islemler",
              displayChildren: true,
              children: []
            },
            {
              id: 3,
              name: "Ekstre Oluştur",
              url: "/satici-ekstre-olustur",
              displayChildren: true,
              badgeCaller: "WaitingReceiptSeller",
              children: []
            },
            {
              id: 4,
              name: "Ödeme Emirleri",
              url: "/satici-odeme-emirleri",
              displayChildren: true,
              children: []
            },
            {
              id: 5,
              name: "Tamamlanan Ödemeler",
              url: "/satici-tamamlanan-odemeler",
              displayChildren: true,
              children: []
            },
            {
              id: 6,
              name: "Tamamlanmayan Ödemeler",
              url: "/satici-tamamlanmayan-odemeler",
              displayChildren: true,
              children: []
            },
          ]
        },
        {
          id: 3,
          name: "Profesyonel Tahsilatları",
          url: "#",
          displayChildren: true,
          permission: "ProCollections",
          children: [
            {
              id: 1,
              name: "Bekleyen Tahsilatlar",
              url: "/pro-bekleyen-tahsilatlar",
              displayChildren: true,
              children: []
            },
            {
              id: 2,
              name: "Geciken Tahsilatlar",
              url: "/pro-geciken-tahsilatlar",
              displayChildren: true,
              children: []
            },
            {
              id: 3,
              name: "Tamamlanan Tahsilatlar",
              url: "/pro-tamamlanan-tahsilatlar",
              displayChildren: true,
              children: []
            },
            {
              id: 4,
              name: "Abonelik Ödemeleri",
              url: "/pro-abonelik-odemeleri",
              displayChildren: true,
              children: []
            },
          ]
        },
        {
          id: 4,
          name: "Profesyonel Ödemeleri",
          url: "#",
          displayChildren: true,
          permission: "ProPayments",
          children: [
            {
              id: 1,
              name: "Faturalandırılması Gereken İşlemler",
              url: "/pro-faturalandirilmasi-gereken-islemler",
              displayChildren: true,
              badgeCaller: "WaitingBillPaymentsPro",
              children: []
            },
            {
              id: 2,
              name: "Faturalandırılmış İşlemler",
              url: "/pro-faturalandirilmis-islemler",
              displayChildren: true,
              children: []
            },
            {
              id: 3,
              name: "Ekstre Oluştur",
              url: "/pro-ekstre-olustur",
              displayChildren: true,
              badgeCaller: "WaitingReceiptPro",
              children: []
            },
            {
              id: 4,
              name: "Ödeme Emirleri",
              url: "/pro-odeme-emirleri",
              displayChildren: true,
              children: []
            },
            {
              id: 5,
              name: "Tamamlanan Ödemeler",
              url: "/pro-tamamlanan-odemeler",
              displayChildren: true,
              children: []
            },
          ]
        },
        {
          id: 5,
          name: "Reklam Ödemeleri",
          url: "#",
          displayChildren: true,
          permission: "AdPayments",
          children: [
            {
              id: 1,
              name: "Profesyonel Reklam Ödemeleri",
              url: "/pro-reklam-odemeleri",
              displayChildren: true,
              children: []
            },
            {
              id: 2,
              name: "Satıcı Reklam Ödemeleri",
              url: "/satici-reklam-odemeleri",
              displayChildren: true,
              children: []
            },

          ]
        },
      ],
    },
    {
      id: 8,
      name: "Ayarlar",
      url: "#",
      children: [
        {
          id: 1,
          name: "Admin Kullanıcıları",
          url: "/admin-kullanicilari",
          displayChildren: true,
          permission: "AdminUsers",
          children: []
        },
        {
          id: 2,
          name: "Kargo İşlemleri",
          url: "#",
          displayChildren: true,
          permission: "CargoOperations",
          children: [
            {
              id: 1,
              name: "Müşteri Kargo Fiyatlandırması",
              url: "/musteri-kargo-fiyatlandirmasi",
              displayChildren: true,
              children: []
            },
            {
              id: 2,
              name: "Mağaza Kargo Fiyatlandırması",
              url: "/magaza-kargo-fiyatlandirmasi",
              displayChildren: true,
              children: []
            }
          ]
        },
      ],
    },
  ]);

  const [activeMenuId, setActiveMenuId] = useState<number>(0);
  const [showDetailMenu, setShowDetailMenu] = useState<boolean>(false);
  const [showLongSidebar, setShowLongSidebar] = useState<boolean>(false);

  const setOnClickFunc = (menuItem: MenuItem) => {
    (activeMenuId === menuItem.id && showDetailMenu === true) ? setActiveMenuId(0) : setActiveMenuId(menuItem.id);

    menuItem.children?.length === 0 ? setShowDetailMenu(false) : (activeMenuId === menuItem.id ? setShowDetailMenu(!showDetailMenu) : setShowDetailMenu(true));

    setShowLongSidebar(false);
  }

  const isBadge = (item: MenuItem) => {
    let isBadge: boolean = false;
    item.children.forEach((innerItem) => {
      if (badges[innerItem.badgeCaller ?? ""] > 0) {
        isBadge = true;
      }
      innerItem.children.forEach((innerInnerItem) => {
        if (badges[innerInnerItem.badgeCaller ?? ""] > 0) {
          isBadge = true;
        }
      })
    })
    return isBadge;
  }

  return (
    <>
      <div className={`${showLongSidebar ? "w-60" : "w-16"} fixed top-0 bottom-0 left-0 px-4 bg-white hidden lg:block z-60`}>
        <div className="grid grid-cols-1 divide-y mt-6 bg-white">
          <HamburgerIcon className="w-8 h-8 mb-5 mt-3 cursor-pointer" onClick={() => { setShowLongSidebar(!showLongSidebar); setShowDetailMenu(false); setActiveMenuId(0); }} />
          {menu.map((item, index) => (
            <div className="py-3 flex items-center cursor-pointer"
                 key={`menu_item_${index}`}
                 onClick={() => { setOnClickFunc(item); }}>
              <div className={`${activeMenuId === item.id && "bg-blue-100 rounded-lg"} p-2`}>
                {item.id === 1 &&
                  <Link to={item.url}>
                    <HomeIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                  </Link>
                }
                {item.id === 2 &&
                  <div className="relative">
                    <HelmetIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                    {
                      isBadge(item) &&
                      <span className="w-2 h-2 bg-red-400 absolute -right-1 top-0 rounded-full"></span>
                    }
                  </div>
                }
                {item.id === 3 &&
                  <div className="relative">
                    <TagIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                    {
                      isBadge(item) &&
                      <span className="w-2 h-2 bg-red-400 absolute -right-1 top-0 rounded-full"></span>
                    }
                  </div>
                }
                {item.id === 4 &&
                  <div className="relative">
                    <LightBulbIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                    {
                      isBadge(item) &&
                      <span className="w-2 h-2 bg-red-400 absolute -right-1 top-0 rounded-full"></span>
                    }
                  </div>
                }
                {item.id === 5 &&
                  <div className="relative">
                    <SiteGeneralManagementIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                    {
                      isBadge(item) &&
                      <span className="w-2 h-2 bg-red-400 absolute -right-1 top-0 rounded-full"></span>
                    }
                  </div>
                }
                {item.id === 6 &&
                  <div className="relative">
                    <UserGearIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                    {
                      isBadge(item) &&
                      <span className="w-2 h-2 bg-red-400 absolute -right-1 top-0 rounded-full"></span>
                    }
                  </div>
                }
                {item.id === 7 &&
                  <div className="relative">
                    <StatisticalIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                    {
                      isBadge(item) &&
                      <span className="w-2 h-2 bg-red-400 absolute -right-1 top-0 rounded-full"></span>
                    }
                  </div>
                }
                {item.id === 8 &&
                  <div>
                    <SettingsIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                    {
                      isBadge(item) &&
                      <span className="w-2 h-2 bg-red-400 absolute -right-1 top-0 rounded-full"></span>
                    }
                  </div>
                }
                {item.id === 9 &&
                  <div>
                    <GroupBuyIcon className={`${activeMenuId === item.id ? "text-blue-400" : "text-gray-900 "} icon-md`} />
                    {
                      isBadge(item) &&
                      <span className="w-2 h-2 bg-red-400 absolute -right-1 top-0 rounded-full"></span>
                    }
                  </div>
                }
              </div>
              {showLongSidebar && <h6 className="ml-2">{item.name}</h6>}
            </div>

          ))}
        </div>
        {showDetailMenu &&
          <div className="bg-white w-80 absolute left-16 top-20 bottom-0 border-l p-4 max-h-screen custom-scrollbar overflow-auto">
            <h5 className="text-gray-400 font-medium my-2 ">{menu.find(m => m.id === activeMenuId)?.name}</h5>
            {menu.find(m => m.id === activeMenuId)?.children.map((i2, index) => (
              ((checkUser && currentUser.Roles?.indexOf(i2.permission ?? "") === -1) ?
                <></>
                :
                <>
                  <div className="py-3 border-b" key={index}>
                    {i2.children.length > 0 ?
                      <>
                        <h5 className={`flex justify-between items-center text-gray-900 cursor-pointer ${i2.displayChildren ? "mb-2" : ""} `} onClick={() => {
                          i2.displayChildren = !i2.displayChildren;
                          setMenu([...menu]);
                        }}>
                          {i2.name}
                          <ChevronDownIcon className={`${i2.displayChildren ? "" : "transform -rotate-90"} transition-all duration-300 w-3 h-3 text-gray-400`} />
                        </h5>
                        {i2.displayChildren &&
                          <>
                            {i2.children.map((i3, index) => (
                              <div className="px-2 pb-2" key={index}>
                                <p className="pt-2 relative">
                                  <Link to={i3.url} onClick={() => setShowDetailMenu(false)} className="hover:text-blue-400 text-gray-700 hover:font-medium">
                                    {i3.name}
                                  </Link>
                                  {badges[i3.badgeCaller ?? ""] > 0 ? <>
                                    <span className="absolute right-0 px-2" style={{
                                      backgroundColor: "red",
                                      borderRadius: 10,
                                      color: "white",
                                      fontSize: 11
                                    }}>
                                      {badges[i3.badgeCaller ?? ""]}
                                    </span>
                                  </> : <>
                                  </>}

                                </p>
                              </div>
                            ))}
                          </>
                        }
                      </>
                      :
                      <h5 className="flex justify-between items-center text-black-400">
                        <Link to={i2.url} onClick={() => setShowDetailMenu(false)}>
                          {i2.name}
                        </Link>
                        {badges[i2.badgeCaller ?? ""] > 0 ? <>
                          <span className="absolute right-6 px-2" style={{
                            backgroundColor: "red",
                            borderRadius: 10,
                            color: "white",
                            fontSize: 11
                          }}>
                            {badges[i2.badgeCaller ?? ""]}
                          </span>
                        </> : <>
                        </>}
                      </h5>
                    }
                  </div>
                </>
              )
            ))}
          </div>
        }
      </div>
      {(showLongSidebar === true || showDetailMenu == true) &&
        <div className="fixed inset-0 bg-black-400 opacity-50 z-30" onClick={() => { setShowDetailMenu(false); setActiveMenuId(0); }}></div>
      }
    </>
  )
}
