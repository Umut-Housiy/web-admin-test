import { FunctionComponent, useState } from "react"
import { Link } from "react-router-dom";
import { SearchIcon } from "./Icons"
import { useStateEffect } from "./UseStateEffect";


export const SearchBarHeader: FunctionComponent = () => {

  const menulinks = [
    {
      id: 1,
      name: "Profesyonel Yeni Kategori Oluştur",
      url: "/pro-kategori-ekle"
    },
    {
      id: 2,
      name: "Profesyonel Kategori Listesi",
      url: "/pro-kategori-listesi"
    },
    {
      id: 3,
      name: "Profesyonel Hizmet Talepleri",
      url: "/pro-hizmet-talepleri"
    },
    {
      id: 4,
      name: "Yeni Rozet Oluştur",
      url: "/pro-rozet-ekle"
    },
    {
      id: 5,
      name: "Rozet Listesi",
      url: "/pro-rozet-listesi"
    },
    {
      id: 6,
      name: "Rozet Ata",
      url: "/pro-rozet-ata"
    },
    {
      id: 7,
      name: "Hizmet Talepleri",
      url: "/pro-talepler"
    },
    {
      id: 8,
      name: "Devam Eden İşler",
      url: "/devam-eden-isler"
    },
    {
      id: 9,
      name: "Teslim Edilen İşler",
      url: "/teslim-edilen-isler"
    },
    {
      id: 10,
      name: "İptal Edilen İşler",
      url: "/iptal-edilen-isler"
    },
    {
      id: 11,
      name: "İş İptal Talepleri",
      url: "/is-iptal-talepleri"
    },
    {
      id: 12,
      name: "Taksitli Hizmet Ödemeleri",
      url: "/taksitli-odemeler"
    },
    {
      id: 14,
      name: "Hizmet Sorun Bildirimleri",
      url: "/hizmet-sorun-bildirimleri"
    },
    {
      id: 15,
      name: "Profesyonel İptal Ve Red Sebep Yönetimi",
      url: "/iptal-red-yonetimi"
    },
    {
      id: 16,
      name: "Profesyonel Üyelik Başvuru Listesi",
      url: "/pro-uye-basvuru-listesi"
    },
    {
      id: 17,
      name: "Profesyonel Reddedilen Üyelik Başvuruları",
      url: "/pro-reddedilen-uye-basvuru-listesi"
    },
    {
      id: 18,
      name: "Profesyonel Listesi",
      url: "/pro-profesyonel-listesi"
    },
    {
      id: 19,
      name: "Profesyonel Belgeleri",
      url: "/pro-profesyonel-belgeleri-listesi"
    },
    {
      id: 20,
      name: "Profesyonel Üyelik Listesi",
      url: "/pro-profesyonel-uye-listesi"
    },
    {
      id: 21,
      name: "Üye Dernekleri Listesi",
      url: "/uye-dernekleri"
    },
    {
      id: 22,
      name: "Profesyonel Sorun Bildirimleri",
      url: "/pro-sorun-bildirimleri"
    },
    {
      id: 23,
      name: "Sponsorlu Profesyoneller",
      url: "/sponsorlu-profesyoneller"
    },
    {
      id: 24,
      name: "Satıcı Yeni Kategori Grubu Oluştur",
      url: "/satici-kategori-grup-ekle"
    },
    {
      id: 25,
      name: "Satıcı Kategori Grup Listesi",
      url: "/satici-kategori-grup-listesi",
    },
    {
      id: 26,
      name: "Satıcı Yeni Kategori Oluştur",
      url: "/satici-kategori-bilgileri-ekle",
    },
    {
      id: 27,
      name: "Satıcı Kategori Listesi",
      url: "/satici-kategori-listesi",
    },
    {
      id: 28,
      name: "Satıcı Alt Kategori Listesi",
      url: "/satici-alt-kategori-listesi",
    },
    {
      id: 29,
      name: "Satıcı Kategori Ağacı",
      url: "/satici-kategori-agaci",
    },
    {
      id: 30,
      name: "Satıcı Kategori Linkleme",
      url: "/satici-kategori-linkleme",
    },
    {
      id: 31,
      name: "Satıcı Kategori Özellik Listesi",
      url: "/satici-kategori-ozellikleri",
    },
    {
      id: 32,
      name: "Satıcı Kategori Varyasyon Listesi",
      url: "/satici-kategori-varyasyonlari",
    },
    {
      id: 33,
      name: "Satıcı Kategori Talepleri",
      url: "/satici-kategori-talepleri",
    },
    {
      id: 34,
      name: "Markalar",
      url: "/marka-listesi",
    },
    {
      id: 35,
      name: "Marka Talepleri",
      url: "/marka-talep-listesi",
    },
    {
      id: 36,
      name: "Ürün Kataloğu",
      url: "/urun-katalogu",
    },
    {
      id: 37,
      name: "Benzer Ürün Listesi",
      url: "/benzer-urun-listesi",
    },
    {
      id: 38,
      name: "Ürün İlan Listesi",
      url: "/urun-ilan-listesi",
    },
    {
      id: 39,
      name: "Onay Bekleyen İlanlar",
      url: "/onay-bekleyen-ilanlar",
    },
    {
      id: 40,
      name: "Katalog Güncellemesi Bekleyen Ürünler",
      url: "/urun-katalogu-guncelleme-listesi",
    },
    {
      id: 41,
      name: "Reddedilen İlanlar",
      url: "/reddedilen-ilanlar",
    },
    {
      id: 42,
      name: "Ürün Değerlendirmeleri",
      url: "/urun-degerlendirmeleri",
    },
    {
      id: 43,
      name: "Ürün Soru ve Cevapları",
      url: "/urun-soru-cevap",
    },
    {
      id: 44,
      name: "Toplu Ürün İşlemleri",
      url: "/toplu-urun-islemleri",
    },
    {
      id: 45,
      name: "Bildirilen Ürünler",
      url: "/bildirilen-urunler",
    },
    {
      id: 46,
      name: "Kampanya Listesi",
      url: "/housiy-kampanya-listesi",
    },
    {
      id: 47,
      name: "Satıcı Kampanyaları",
      url: "/satici-kampanya-listesi",
    },
    {
      id: 48,
      name: "Yönetim Kampanyaları",
      url: "/yonetim-kampanyalari",
    },
    {
      id: 49,
      name: "Yeni Housiy Kampanyası Oluştur",
      url: "/housiy-kampanyasi-ekle",
    },
    {
      id: 50,
      name: "Yeni Yönetim Kampanyası Oluştur",
      url: "/yonetim-kampanyasi-olustur",
    },
    {
      id: 51,
      name: "Satıcı Başvuruları",
      url: "/satici-basvuru-listesi",
    },
    {
      id: 53,
      name: "Reddedilen Satıcı Başvuruları",
      url: "/reddedilen-satici-listesi",
    },
    {
      id: 53,
      name: "Onaylı Satıcı Listesi",
      url: "/onayli-satici-listesi",
    },
    {
      id: 54,
      name: "Satıcı Belgeleri",
      url: "/satici-belgeleri",
    },
    {
      id: 55,
      name: "Sepet Listesi",
      url: "/sepet-listesi",
    },
    {
      id: 56,
      name: "Sipariş Listesi",
      url: "/siparis-listesi",
    },
    {
      id: 57,
      name: "Geciken Sipariş Listesi",
      url: "/geciken-siparis-listesi",
    },
    {
      id: 58,
      name: "İptal Edilen Siparişler",
      url: "/iptal-edilen-siparis-listesi",
    },
    {
      id: 59,
      name: "İade Talepleri",
      url: "/siparis-iade-talepleri",
    },
    {
      id: 60,
      name: "Satıcı İptal ve İade Yönetimi",
      url: "/satici-iptal-iade-yonetimi",
    },
    {
      id: 61,
      name: "Sponsorlu Ürünler",
      url: "/sponsorlu-urunler",
    },
    {
      id: 62,
      name: "Yeni Fikir Kategorisi Oluştur",
      url: "/fikir-kategori-ekle",
    },
    {
      id: 63,
      name: "Fikir Kategori Listesi",
      url: "/fikir-kategori-listesi",
    },
    {
      id: 64,
      name: "Fikir Kategori Özellikleri",
      url: "/fikir-kategori-ozellikleri",
    },
    {
      id: 65,
      name: "Onay Bekleyen Projeler",
      url: "/onay-bekleyen-projeler",
    },
    {
      id: 66,
      name: "Onaylanan Projeler",
      url: "/onaylanan-projeler",
    },
    {
      id: 67,
      name: "Reddedilen Projeler",
      url: "/reddedilen-projeler",
    },
    {
      id: 68,
      name: "Fikir Listesi",
      url: "/fikir-listesi",
    },
    {
      id: 69,
      name: "Fikir Soru ve Cevapları",
      url: "/fikir-ve-proje-sorulari",
    },
    {
      id: 70,
      name: "Anasayfa Slider Yönetimi",
      url: "/anasayfa-slider-listesi",
    },
    {
      id: 71,
      name: "Profesyonel Slider Yönetimi",
      url: "/profesyonel-slider-listesi",
    },
    {
      id: 72,
      name: "Kategori Slider Yönetimi",
      url: "/kategori-slider-listesi",
    },
    {
      id: 73,
      name: "Pro-Panel Slider Yönetimi",
      url: "/pro-panel-slider-listesi",
    },
    {
      id: 74,
      name: "Seller-Panel Slider Yönetimi",
      url: "/seller-panel-slider-listesi",
    },
    {
      id: 75,
      name: "Yeni Liste Oluştur",
      url: "/yeni-liste-olustur",
    },
    {
      id: 76,
      name: "Oluşturulan Listeler",
      url: "/olusturulan-listeler",
    },
    {
      id: 77,
      name: "Reklam Sponsorluk Ücretleri",
      url: "/reklam-sponsorluk-ucretleri",
    },
    {
      id: 78,
      name: "Sponsorluk Ücret Listesi",
      url: "/liste-sponsorluk-ucretleri",
    },
    {
      id: 79,
      name: "İptal-İade Yönetimi",
      url: "/iptal-iade-yonetimi",
    },
    {
      id: 80,
      name: "Ceza ve Hizmet Kesintileri",
      url: "/ceza-hizmet-kesintileri",
    },
    {
      id: 81,
      name: "Blog Kategorisi Oluştur",
      url: "/blog-kategori-ekle",
    },
    {
      id: 82,
      name: "Blog Kategori Listesi",
      url: "/blog-kategori-listesi",
    },
    {
      id: 83,
      name: "Blog Yazarları",
      url: "/blog-yazar-listesi",
    },
    {
      id: 84,
      name: "Yeni Blog Oluştur",
      url: "/blog-ekle",
    }, {
      id: 85,
      name: "Blog Listesi",
      url: "/blog-listesi",
    },
    {
      id: 86,
      name: "Akademi Kategori Oluştur",
      url: "/akademi-kategori-ekle",
    },
    {
      id: 87,
      name: "Akademi Kategori Listesi",
      url: "/akademi-kategori-listesi",
    },
    {
      id: 88,
      name: "Akademi Yeni Eğitim Ekle",
      url: "/akademi-ekle",
    },
    {
      id: 89,
      name: "Akademi Eğitim Listesi",
      url: "/akademi-listesi",
    },
    {
      id: 90,
      name: "Yanıt Bekleyen Akademi Eğitim Soru Listesi",
      url: "/akademi-soru-listesi",
    },
    {
      id: 91,
      name: "XML Yönetimi",
      url: "/xml-yonetimi",
    },
    {
      id: 92,
      name: "Genel SEO Yönetimi",
      url: "/genel-seo",
    },
    {
      id: 93,
      name: "Satıcı SEO Yönetimi",
      url: "/satici-seo",
    },
    {
      id: 94,
      name: "Ürün SEO Yönetimi",
      url: "/urun-seo",
    },
    {
      id: 95,
      name: "Ürün Grupları SEO Yönetimi",
      url: "/urun-gruplari-seo",
    },
    {
      id: 96,
      name: "Ürün Kategori SEO Yönetimi",
      url: "/urun-kategori-seo",
    },
    {
      id: 97,
      name: "Profesyonel SEO Yönetimi",
      url: "/profesyonel-seo",
    },
    {
      id: 98,
      name: "Profesyonel Kategori SEO Yönetimi",
      url: "/profesyonel-kategori-seo",
    },
    {
      id: 99,
      name: "Fikir SEO Yönetimi",
      url: "/fikir-seo",
    },
    {
      id: 100,
      name: "fikir Kategori SEO Yönetimi",
      url: "/fikir-kategori-seo",
    },
    {
      id: 101,
      name: "Yardım Grubu Oluştur",
      url: "/yardim-grubu-olustur",
    },
    {
      id: 102,
      name: "Yardım Grup Listesi",
      url: "/yardim-grup-listesi",
    },
    {
      id: 103,
      name: "Yardım Kategorisi Oluştur",
      url: "/yardim-kategori-olustur",
    },
    {
      id: 104,
      name: "Yardım Kategori Listesi",
      url: "/yardim-kategori-listesi",
    },
    {
      id: 105,
      name: "Yardım İçeriği Oluştur",
      url: "/yardim-icerigi-olustur",
    },
    {
      id: 106,
      name: "Yardım İçerik Listesi",
      url: "/yardim-icerik-listesi",
    },
    {
      id: 107,
      name: "Pro-Seller Login Anasayfa İçerikleri",
      url: "/genel-anasayfa-icerikleri",
    },
    {
      id: 108,
      name: "Pro-Seller Login Hakkımızda İçerikleri",
      url: "/genel-hakkimizda-icerikleri",
    },
    {
      id: 109,
      name: "Pro-Seller Login Profesyonel İçerikleri",
      url: "/genel-profesyonel-icerikleri",
    },
    {
      id: 110,
      name: "Pro-Seller Login Satıcı İçerikleri",
      url: "/genel-satici-icerikleri",
    },
    {
      id: 111,
      name: "Pro-Seller Login Üyelik Paketleri",
      url: "/genel-uyelik-paketleri",
    },
    {
      id: 112,
      name: "Sözleşme Yönetimi",
      url: "/sozlesme-listesi",
    },
    {
      id: 113,
      name: "SSS (Sıkça Sorulan Sorular) Yönetimi",
      url: "/sss-listesi",
    },
    {
      id: 114,
      name: "Web Destek Talepleri",
      url: "/web-destek-talepleri",
    },
    {
      id: 115,
      name: "Profesyonel Destek Talepleri",
      url: "/profesyonel-destek-talepleri",
    },
    {
      id: 116,
      name: "Satıcı Destek Talepleri",
      url: "/satici-destek-talepleri",
    },
    {
      id: 117,
      name: "Web Destek Konuları",
      url: "/web-destek-konulari",
    },
    {
      id: 118,
      name: "Profesyonel Destek Konuları",
      url: "/profesyonel-destek-konulari",
    },
    {
      id: 119,
      name: "Satıcı Destek Konuları",
      url: "/satici-destek-konulari",
    },
    {
      id: 120,
      name: "İndirim Kuponları",
      url: "/indirim-kuponlari",
    },
    {
      id: 121,
      name: "Duyuru Yönetimi",
      url: "/duyuru-yonetimi",
    },
    {
      id: 122,
      name: "Sosyal Medya Yönetimi",
      url: "/sosyal-medya-listesi",
    },
    {
      id: 123,
      name: "Üye Listesi",
      url: "/uye-listesi",
    },
    {
      id: 124,
      name: "Tamamlanan Satıcı Tahsilatları",
      url: "/tamamlanan-tahsilatlar",
    },
    {
      id: 125,
      name: "Faturalandırılması Gereken Satıcı İşlemleri",
      url: "/satici-faturalandirilmasi-gereken-islemler",
    },
    {
      id: 126,
      name: "Faturalandırılmış Satıcı İşlemleri",
      url: "/satici-faturalandirilmis-islemler",
    },
    {
      id: 127,
      name: "Satıcı Ekstre Oluştur",
      url: "/satici-ekstre-olustur",
    },
    {
      id: 128,
      name: "Satıcı Ödeme Emirleri",
      url: "/satici-odeme-emirleri",
    },
    {
      id: 129,
      name: "Bekleyen Profesyonel Tahsilatları",
      url: "/pro-bekleyen-tahsilatlar",
    },
    {
      id: 130,
      name: "Geciken Profesyonel Tahsilatları",
      url: "/pro-geciken-tahsilatlar",
    },
    {
      id: 131,
      name: "Tamamlanan Profesyonel Tahsilatları",
      url: "/pro-tamamlanan-tahsilatlar",
    },
    {
      id: 132,
      name: "Profesyonel Abonelik Ödeme Listesi",
      url: "/pro-abonelik-odemeleri",
    },
    {
      id: 133,
      name: "Faturalandırılması Gereken Profesyonel İşlemleri",
      url: "/pro-faturalandirilmasi-gereken-islemler",
    },
    {
      id: 134,
      name: "Faturalandırılmış Profesyonel İşlemleri",
      url: "/pro-faturalandirilmis-islemler",
    },
    {
      id: 135,
      name: "Profesyonel Ekstre Oluştur",
      url: "/pro-ekstre-olustur",
    },
    {
      id: 136,
      name: "Profesyonel Ödeme Emirleri",
      url: "/pro-odeme-emirleri",
    },
    {
      id: 137,
      name: "Profesyonel Tamamlanan Odemeler",
      url: "/pro-tamamlanan-odemeler",
    },
    {
      id: 138,
      name: "Profesyonel Reklam Ödemeleri",
      url: "/pro-reklam-odemeleri",
    },
    {
      id: 139,
      name: "Satıcı Reklam Ödemeleri",
      url: "/satici-reklam-odemeleri",
    },
    {
      id: 140,
      name: "Admin Kullanıcıları",
      url: "/admin-kullanicilari",
    },
    {
      id: 141,
      name: "Müşteri Kargo Fiyatlandırması",
      url: "/musteri-kargo-fiyatlandirmasi",
    },
    {
      id: 142,
      name: "Mağaza Kargo Fiyatlandırması",
      url: "/magaza-kargo-fiyatlandirmasi",
    },
  ]

  const [searchText, setSearchText] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useStateEffect(() => {
    if (searchText.length >= 2 && menulinks.filter(x => x.name.toLocaleLowerCase('tr').indexOf(searchText.toLocaleLowerCase('tr')) > -1).length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchText]);

  const onClickOutsideListener = () => {
    setIsDropdownOpen(false);
    setSearchText("");
    document.removeEventListener("click", onClickOutsideListener)
  }



  return (
    <>
      <div className={`flex-1 mx-6 relative`}>
        <div className={`text-tiny rounded-lg flex text-gray-700 flex-1  relative`}>
          <span className="w-auto flex justify-end items-center p-2 absolute left-0 bottom-0 top-0">
            <SearchIcon className={`text-blue-400 icon-md transform -rotate-90`} />
          </span>
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)} className={`bg-gray-100 w-full rounded-lg focus:outline-none border border-gray-200 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 pl-10  `} type="text" placeholder={"Arama Yapın"} />
        </div>
        {(isDropdownOpen && searchText.length >= 2) &&
          <div onMouseLeave={() => {
            document.addEventListener("click", onClickOutsideListener)
          }} className="absolute top-14 bg-white right-0 left-0  rounded-lg shadow border border-gray-300 py-3">
            {((searchText.length >= 2) ? menulinks.filter(x => x.name.toLocaleLowerCase('tr').indexOf(searchText.toLocaleLowerCase('tr')) > -1) : []).map((item, index) => (
              <Link onClick={() => { setIsDropdownOpen(false); }} to={{ pathname: `${item.url}` }} key={item.id + "_" + index} className="text-sm font-normal text-gray-900 block py-2 px-3 hover:bg-blue-100 cursor-pointer hover:text-blue-400 transition-all duration-300 ">{item.name}</Link>
            ))}
          </div>
        }
      </div>
    </>
  )
}
