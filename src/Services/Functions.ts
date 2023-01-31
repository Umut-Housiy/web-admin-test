import { PaymentType } from "../Models";
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";

export const autonNumericOptions = {
  TL: {
    currencySymbol: " ₺",
    currencySymbolPlacement: "s",
    minimumValue: "0",
    decimalCharacter: ",",
    digitGroupSeparator: ".",
    modifyValueOnWheel: false,
    decimalPlaces: 2,
    roundingMethod: "S",
    emptyInputBehavior: "zero",
  },
  KG: {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    modifyValueOnWheel: false,
    currencySymbol: " Kg",
    decimalPlaces: 0,
    currencySymbolPlacement: "s",
    roundingMethod: "S",
    emptyInputBehavior: "zero",
    minimumValue: "0"
  },
  ADET: {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    modifyValueOnWheel: false,
    decimalPlaces: 0,
    currencySymbol: " Adet",
    currencySymbolPlacement: "s",
    roundingMethod: "S",
    emptyInputBehavior: "zero",
    minimumValue: "0"
  },
  GUN: {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    modifyValueOnWheel: false,
    decimalPlaces: 0,
    currencySymbol: " Gün",
    currencySymbolPlacement: "s",
    roundingMethod: "S",
    emptyInputBehavior: "zero",
    minimumValue: "0"
  },
  LIRA: {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    modifyValueOnWheel: false,
    currencySymbol: " Lira",
    decimalPlaces: 0,
    currencySymbolPlacement: "s",
    roundingMethod: "S",
    emptyInputBehavior: "zero",
    minimumValue: "0"
  },
  KURUS: {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    modifyValueOnWheel: false,
    currencySymbol: " Kuruş",
    decimalPlaces: 0,
    currencySymbolPlacement: "s",
    roundingMethod: "S",
    emptyInputBehavior: "zero",
    maximumValue: "99",
    minimumValue: "0"
  },
  QUANTITY: {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    modifyValueOnWheel: false,
    decimalPlaces: 0,
    currencySymbol: "",
    currencySymbolPlacement: "s",
    roundingMethod: "S",
    emptyInputBehavior: "zero",
    minimumValue: "0"
  },
  NUMBERTYPE: {
    currencySymbol: "",
    currencySymbolPlacement: "s",
    minimumValue: "0",
    decimalCharacter: ",",
    digitGroupSeparator: "",
    modifyValueOnWheel: false,
    decimalPlaces: 0,
    roundingMethod: "S",
    emptyInputBehavior: "zero",
  },
};

export const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
export const days = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']

export const locale = {
  localize: {
    month: n => months[n],
    day: n => days[n]
  },
  formatLong: {}
}

export const formatter = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const fraction = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 0,
});


export const returnPaymentType = (dataType: number) => {
  switch (dataType) {
    case PaymentType.SATIS:
      return "Satış";
    case PaymentType.HIZMET:
      return "Hizmet";
    case PaymentType.KARGO_FATURASI:
      return "Kargo Faturası";
    case PaymentType.KOMISYON_FATURASI:
      return "Komisyon Faturası";
    case PaymentType.MARKETING_INFLUENCER_AFFILIATE_BEDELI_IADESI:
      return "Marketing Influencer Affiliate Bedeli İadesi";
    case PaymentType.MP_EKSIK_URUN:
      return "MP Eksik Ürün";
    case PaymentType.MP_YANLIS_URUN:
      return "MP Yanlış Ürün";
    case PaymentType.MP_KUSURLU_URUN:
      return "MP Kusurlu Ürün";
    case PaymentType.TERMIN_GECIKME_FATURA_ITIRAZ:
      return "Termin Gecikme Fatura İtiraz";
    case PaymentType.CEZAI_SART_YANSITMA_BEDELI:
      return "Cezai Şart Yansıtma Bedeli";
    case PaymentType.KAYIP_VE_HASARLI_KARGO_TAZMINI:
      return "Kayıp Ve Hasarlı Kargo Tazmini";
    case PaymentType.BARKODLAMA_POSETLEME:
      return "Barkodlama, Poşetleme";
    case PaymentType.KARGO_KAMPANYA_KATILIM_BEDELI:
      return "Kargo Kampanya Katılım Bedeli";
    case PaymentType.KOMISYON_FARK_FATURASI_CIRO:
      return "Komisyon Fark Faturası Ciro";
    case PaymentType.KUPON_SATISLARI:
      return "Kupon Satışları";
    case PaymentType.MP_EKSIK_YANLIS_KUSURLU_URUN:
      return "MP Eksik, Yanlış, Kusurlu Ürün";
    case PaymentType.MP_KARGO_FATURA:
      return "MP Kargo Faturalama";
    case PaymentType.EKSIK_YANLIS_KUSURLU_URUN_FATURASI:
      return "Eksik, Yanlış, Kusurlu Ürün Faturası";
    case PaymentType.KOMISYON_IADESI:
      return "Komisyon İadesi";
    case PaymentType.TERMIN_GECIKME_BEDELI:
      return "Termin Gecikme Bedeli";
    case PaymentType.HEDIYE_CEKI_FATURA_ITIRAZ:
      return "Hediye Çeki Fatura İtiraz";
    case PaymentType.EKSIK_YANLIS_KUSURLU_URUN_FATURA_ITIRAZ:
      return "Eksik, Yanlış, Kusurlu Ürün Fatura İtiraz";
    case PaymentType.DEPO_KAYIP:
      return "Depo Kayıp";
    case PaymentType.KOMISYON_MUTABAKATI:
      return "Komisyon Mutabakatı";
    case PaymentType.KOMISYON_FARK_FATURASI:
      return "Komisyon_FARK_Faturası";
    case PaymentType.MARKETING_INFLUENCER_AFFILIATE_BEDELI:
      return "Marketing Influencer Affiliate Bedeli";
    case PaymentType.MP_OUTSOURCE_GORSEL_BEDELI:
      return "MP Outsource Görsel Bedeli";
    case PaymentType.MARKETING_INDIRIM_KOD_BEDELI:
      return "Marketing İndirim Kodu Bedeli";
    case PaymentType.TEMINAT_MEKTUBU_KOMISYON_YANSITMASI:
      return "Teminat Mektubu Komisyon Yansıtması";
    case PaymentType.TEDARIK_EDEMEME:
      return "Tedarik Edememe";
    case PaymentType.KAMPANYA_BEDELI:
      return "Kampanya Bedeli";
    case PaymentType.CIRO_PRIMI:
      return "Ciro Primi";
    case PaymentType.KUPON_FATURASI:
      return "Kupon Faturası";
    case PaymentType.MARKETING_TY_INSTAGRAM_REKLAM_BEDELI:
      return "Marketing - TY Instagram Reklam Bedeli";
    case PaymentType.MARKETING_ASSOCIATE_BEDELI:
      return "Marketing Associate Bedeli";
    case PaymentType.MARKETING_GORSEL_SATINALMA_BEDELI:
      return "Marketing Görsel Satınalma Bedeli";
    case PaymentType.MARKETING_OUTDOOR_REKLAM_BEDELI:
      return "Marketing Outdoor Reklam Bedeli";
    case PaymentType.MARKETING_PRODUKSIYON_BEDELI:
      return "Marketing Produksiyon Bedeli";
    case PaymentType.GOOGLE_ARAMA_REKLAM_BEDELI:
      return "Google Arama Reklam Bedeli";
    case PaymentType.MARKETING_RADYO_REKLAM_BEDELI:
      return "Marketing Radyo Reklam Bedeli";
    case PaymentType.MARKETING_TOOL_KULLANIM_BEDELI:
      return "Marketing Tool Kullanım Bedeli";
    case PaymentType.MARKETING_TVC_BEDELI:
      return "Marketing TVC Bedeli";
    case PaymentType.MARKETING_AGENCY_FEE_BEDELI:
      return "Marketing Agency Fee Bedeli";
    case PaymentType.MARKETING_TY_YOUTUBE_BEDELI:
      return "Marketing - TY Youtube Bedeli";
    case PaymentType.ONLINE_GORSEL_REKLAM_BEDELI:
      return "Online Görsel Reklam Bedeli";
    case PaymentType.ONLINE_VIDEO_REKLAM_BEDELI:
      return "Online Video Reklam Bedeli";
    case PaymentType.BARKODLAMA_POSETLEME_IADELERI:
      return "Barkodlama & Poşetleme İadeleri";
    case PaymentType.BIRIM_DESTEK_BEDELI_IADESI:
      return "Birim Destek Bedeli İadesi";
    case PaymentType.CEZAI_SART_YANSITMA_BEDELI_IADESI:
      return "Cezai Şart Yansıtma Bedeli İadesi";
    case PaymentType.GOOGLE_ARAMA_REKLAM_BEDELI_IADESI:
      return "Google Arama Reklam Bedeli İadesi";
    case PaymentType.KARGO_KAMPANYA_KATILIM_BEDELI_IADESI:
      return "Kargo Kampanya Katılım Bedeli İadesi";
    case PaymentType.KATEGORI_MP_EKSIK_YANLIS_KUSURLU_URUN_IADE_FATURASI:
      return "Kategori MP Eksik, Yanlış, Kusurlu Ürün İade Faturası";
    case PaymentType.KATEGORI_MP_KARGO_IADE_FATURASI:
      return "Kategori MP Kargo İade Faturası";
    case PaymentType.KATEGORI_TERMIN_GECIKME_BEDELI_IADE_FATURASI:
      return "Kategori Termin Gecikme Bedeli İade Faturası";
    case PaymentType.KAYIP_VE_HASARLI_KARGO_TAZMINI_IADESI:
      return "Kayıp ve Hasarlı Kargo Tazmini İadesi";
    case PaymentType.KOMISYON_FARK_FATURASI_CIRO_IADESI:
      return "Komisyon Fark Faturası (Ciro) İadesi";
    case PaymentType.KUPON_SATISLARI_IADESI:
      return "Kupon Satışları İadesi";
    case PaymentType.MARKETING_INFLUENCER_YOUTUBE_REKLAM_BEDELI:
      return "Marketing Influencer Youtube Reklam Bedeli";
    case PaymentType.MARKETING_AGENCY_FEE_BEDELI_IADESI:
      return "Marketing Agency Fee Bedeli İadesi";
    case PaymentType.MARKETING_ASSOCIATE_BEDELI_IADESI:
      return "Marketing Associate Bedeli İadesi";
    case PaymentType.MARKETING_GORSEL_SATINALMA_BEDELI_IADESI:
      return "Marketing Görsel Satınalma Bedeli İadesi";
    case PaymentType.MARKETING_INFLUENCER_FIXED_BEDELI_IADESI:
      return "Marketing Influencer Fixed Bedeli İadesi";
    case PaymentType.MARKETING_INFLUENCER_YOUTUBE_REKLAM_BEDELI_IADESI:
      return "Marketing Influencer Youtube Reklam Bedeli İadesi";
    case PaymentType.MARKETING_INDIRIM_KOD_BEDELI_IADESI:
      return "Marketing İndirim Kodu Bedeli İadesi";
    case PaymentType.MARKETING_OUTDOOR_REKLAM_BEDELI_IADESI:
      return "Marketing Outdoor Reklam Bedeli İadesi";
    case PaymentType.MARKETING_PRODUKSIYON_BEDELI_IADESI:
      return "Marketing Produksiyon Bedeli İadesi";
    case PaymentType.MARKETING_RADYO_REKLAM_BEDELI_IADESI:
      return "Marketing Radyo Reklam Bedeli İadesi";
    case PaymentType.MARKETING_TOOL_KULLANIM_BEDELI_IADESI:
      return "Marketing Tool Kullanım Bedeli İadesi";
    case PaymentType.MARKETING_TVC_BEDELI_IADESI:
      return "Marketing TVC Bedeli İadesi";
    case PaymentType.KOMISYON_FARKI_FATURASI:
      return "Komisyon Farkı Faturası";
    case PaymentType.MARKETING_YT_YOUTUBE_BEDELI_IADESI:
      return "Marketing -YT Youtube Bedeli İadesi";
    case PaymentType.ERKEN_ODEME_KESINTI_FATURASI:
      return "Erken Ödeme Kesinti Faturası";
    case PaymentType.MARKETING_SERVICES_GELIRI:
      return "Marketing Services Geliri";
    case PaymentType.MARKETING_TY_INSTAGRAM_REKLAM_BEDELI_IADESI:
      return "Marketing TY İnstagram Reklam Bedeli İadesi";
    case PaymentType.TEMINAT_MEKTUBU_KOMISYON_YANSITMASI_IADESI:
      return "Teminat Mektubu Komisyon Yansıtması İadesi";
    case PaymentType.KARGO_FATURA_ITIRAZ:
      return "Kargo Fatura İtiraz";
    case PaymentType.KOMISYON_MUTABAKATI_IADE:
      return "Komisyon Mütabakatı İade";
    case PaymentType.FATURA_KONTOR_SATIS_BEDELI:
      return "Fatura Kontör Satış Bedeli";
    case PaymentType.KAMPANYA_KATILIM_BEDELI_KDV_8:
      return "Kampanya Katılım Bedeli KDV 8";
    case PaymentType.HEDIYE_CEKI_BEDELI_KDV_0:
      return "Hediye Çeki Bedeli KDV 0";
    case PaymentType.COZUM_ORTAKLIGI_BEDELI_MP:
      return "Çözüm Ortaklığı Bedeli";
    case PaymentType.MUSTERI_MEMNUNIYETI_GIDERLERI:
      return "Müşteri Memnuniyeti Giderleri";
    case PaymentType.MP_BAREM_ALTI_KARGO_GIDERLERI:
      return "MP Barem Altı Kargo Giderleri";
    case PaymentType.ONLINE_GORSEL_REKLAM_BEDELI_IADESI:
      return "Online Görsel Reklam Bedeli İadesi";
    case PaymentType.ERKEN_ODEME_KESINTI_FATURASI_IADESI:
      return "Erken Ödeme Kesinti Faturası İadesi";
    case PaymentType.FATURA_KONTOR_SATIS_BEDELI_IADESI:
      return "Fatura Kontör Satış Bedeli İadesi";
    case PaymentType.ICRA_MASRAF_VE_FAIZ_BEDELI:
      return "İcra Masraf Ve Faiz Bedeli";
    case PaymentType.REKLAM_BEDELI:
      return "Reklam Bedeli";
    case PaymentType.MARKETING_INFLUENCER_FIXED_BEDELI:
      return "Marketing Influencer Fixed Bedeli";
    case PaymentType.MARKETING_DESTEK_BEDELI_MP:
      return "Marketing Destek Bedeli MP";
    case PaymentType.ONLINE_VIDEO_REKLAM_BEDELI_IADESI:
      return "Online Video Reklam Bedeli İadesi";
    case PaymentType.BAGIS_VE_YARDIMLARI:
      return "Bağış Ve Yardımları";
    case PaymentType.MARKETING_SERVIS_GELIRI_IADESI:
      return "Marketin Servis Geliri İadesi";
    case PaymentType.TUKETICI_HAKEM_HEYET_YANSITMA_BEDELI:
      return "Tüketici Hakem Heyet Yansıtma Bedeli";
    case PaymentType.URUN_IPTAL_CEZAI_BEDEL:
      return "Ürün İptal Cezai Bedel";
    case PaymentType.KARGO_GECIKME_BEDELI:
      return "Kargo Gecikme Bedeli";
    case PaymentType.HIZMET_BASLANGIC_GECIKME_BEDELI:
      return "Hizmet Başlangıç Gecikme Bedeli";
    case PaymentType.HIZMET_BITIS_GECIKME_BEDELI:
      return "Hizmet Bitiş Gecikme Bedeli";
    case PaymentType.KATEGORI_KOMISYONU:
      return "Kategori Komisyonu";
    case PaymentType.PROFESYONEL_ABONELIK:
      return "Profesyonel Abonelik";
    case PaymentType.SIPARIS_IPTALI:
      return "Sipariş İptali";
    case PaymentType.SIPARIS_IADESI:
      return "Sipariş İadesi";
    case PaymentType.EKSTRE_TRANSFERINDEN_KALAN_TUTAR:
      return "Ekstre Transferinden Kalan Tutar";
    default:
      return "";
  }
}

export const readPageQueryString = (location) => {
  const query = new URLSearchParams(location.search.replace("?", ""));
  const page = query.get("sayfa");

  return page;
};

//#region download excel
export const getSheetData = (data, header) => {
  var fields = Object.keys(data[0]);
  var sheetData = data.map(function (row) {
    return fields.map(function (fieldName) {
      return row[fieldName] ? row[fieldName] : "";
    });
  });
  sheetData.unshift(header);
  return sheetData;
}

export const saveAsExcel = async (data, header, listname) => {

  XlsxPopulate.fromBlankAsync().then(async (workbook) => {
    const sheet1 = workbook.sheet(0);
    const sheetData = getSheetData(data, header);
    const totalColumns = sheetData[0].length;

    sheet1.cell("A1").value(sheetData);
    const range = sheet1.usedRange();
    const endColumn = String.fromCharCode(64 + totalColumns);
    sheet1.row(1).style("bold", true);
    sheet1.range("A1:" + endColumn + "1").style("fill", "BFBFBF");
    range.style("border", true);
    return workbook.outputAsync().then((res) => {
      saveAs(res, `${listname}.xlsx`);
    });
  });
}


//#endregion

export const currentDateStampForCompare = () => {
  const currentDate = new Date();

  const gmtPlusThreeMilisec = 10800000; // 3 * 60 * 60 * 1000

  const currentDateStamp = currentDate.getTime() + gmtPlusThreeMilisec;

  return currentDateStamp;
}
