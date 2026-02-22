"use client";

import { useLocale, useTranslations } from "next-intl";
import FormInput from "@/components/common/FormInput";
import type { CheckoutData } from "@/hooks/checkout/useCheckoutWizard";

interface TaxInvoiceSectionProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
  errors: Record<string, string>;
  isThai: boolean;
}

export default function TaxInvoiceSection({
  checkoutData,
  updateCheckoutData,
  errors,
  isThai,
}: TaxInvoiceSectionProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const tCheckoutFallback = (
    key: string,
    fallbackEn: string,
    fallbackTh?: string,
  ) => {
    try {
      return t(key);
    } catch {
      return locale === "th" ? fallbackTh || fallbackEn : fallbackEn;
    }
  };

  const handleTaxInvoiceToggle = (checked: boolean) => {
    if (!checked) {
      updateCheckoutData({
        needTaxInvoice: false,
        taxName: "",
        taxId: "",
        taxAddress: "",
        taxSubDistrict: "",
        taxDistrict: "",
        taxProvince: "",
        taxPostalCode: "",
      });
      return;
    }

    updateCheckoutData({ needTaxInvoice: true });
  };

  const labels = isThai
    ? {
        taxId: tCheckoutFallback("taxId", "Tax ID", "เลขประจำตัวผู้เสียภาษี"),
        taxIdPlaceholder: tCheckoutFallback("taxIdPlaceholder", "13-digit tax ID", "เลข 13 หลัก"),
        taxAddress: tCheckoutFallback("taxAddress", "Address", "ที่อยู่"),
        taxAddressPlaceholder: tCheckoutFallback(
          "taxAddressPlaceholder",
          "House no., village, building, soi, road",
          "เลขที่ หมู่บ้าน อาคาร ซอย ถนน",
        ),
        taxSubDistrict: tCheckoutFallback("taxSubDistrict", "Sub-district", "ตำบล/แขวง"),
        taxSubDistrictPlaceholder: tCheckoutFallback("taxSubDistrictPlaceholder", "Sub-district", "ตำบล/แขวง"),
        taxDistrict: tCheckoutFallback("taxDistrict", "District", "อำเภอ/เขต"),
        taxDistrictPlaceholder: tCheckoutFallback("taxDistrictPlaceholder", "District", "อำเภอ/เขต"),
        taxProvince: tCheckoutFallback("taxProvince", "Province", "จังหวัด"),
        taxProvincePlaceholder: tCheckoutFallback("taxProvincePlaceholder", "Province", "จังหวัด"),
        taxPostalCode: tCheckoutFallback("taxPostalCode", "Postal Code", "รหัสไปรษณีย์"),
        taxPostalCodePlaceholder: tCheckoutFallback("taxPostalCodePlaceholder", "5-digit postal code", "รหัสไปรษณีย์ 5 หลัก"),
      }
    : {
        taxId: tCheckoutFallback("taxIdInter", "Tax ID / VAT Number", "Tax ID / VAT Number"),
        taxIdPlaceholder: tCheckoutFallback("taxIdInterPlaceholder", "Your tax ID or VAT number", "Your tax ID or VAT number"),
        taxAddress: tCheckoutFallback("taxAddress", "Address", "ที่อยู่"),
        taxAddressPlaceholder: tCheckoutFallback("taxAddressInterPlaceholder", "Street address", "Street address"),
        taxSubDistrict: tCheckoutFallback("taxSubDistrictInter", "City / Town", "City / Town"),
        taxSubDistrictPlaceholder: tCheckoutFallback("taxSubDistrictInterPlaceholder", "City or town", "City or town"),
        taxDistrict: tCheckoutFallback("taxDistrictInter", "State / Province", "State / Province"),
        taxDistrictPlaceholder: tCheckoutFallback("taxDistrictInterPlaceholder", "State or province", "State or province"),
        taxProvince: tCheckoutFallback("taxProvinceInter", "Country", "Country"),
        taxProvincePlaceholder: tCheckoutFallback("taxProvinceInterPlaceholder", "Country", "Country"),
        taxPostalCode: tCheckoutFallback("taxPostalCode", "Postal Code", "Postal Code"),
        taxPostalCodePlaceholder: tCheckoutFallback("taxPostalCodeInterPlaceholder", "Postal code", "Postal code"),
      };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        border: "1px solid #eee",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "700",
          marginBottom: "20px",
          color: "#1a1a2e",
        }}
      >
        {tCheckoutFallback(
          "taxInvoiceInformation",
          "Tax Invoice Information",
          "ข้อมูลใบกำกับภาษี",
        )}
      </h3>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
          cursor: "pointer",
          fontWeight: "600",
          color: "#333",
        }}
      >
        <input
          type="checkbox"
          checked={checkoutData.needTaxInvoice}
          onChange={(e) => handleTaxInvoiceToggle(e.target.checked)}
          style={{ width: "18px", height: "18px", accentColor: "#00C853" }}
        />
        {tCheckoutFallback(
          "needTaxInvoice",
          "I need a tax invoice",
          "ต้องการใบกำกับภาษี",
        )}
      </label>

      {checkoutData.needTaxInvoice && (
        <>
          <div className="row">
            <div className="col-md-6">
              <FormInput
                label={tCheckoutFallback("taxName", "Name / Company", "ชื่อ / บริษัท")}
                type="text"
                name="taxName"
                value={checkoutData.taxName}
                onChange={(e) => updateCheckoutData({ taxName: e.target.value })}
                placeholder={tCheckoutFallback(
                  "taxNamePlaceholder",
                  "Name or company for tax invoice",
                  "ชื่อหรือบริษัทสำหรับออกใบกำกับภาษี",
                )}
                error={errors.taxName}
                required
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label={labels.taxId}
                type="text"
                name="taxId"
                value={checkoutData.taxId}
                onChange={(e) =>
                  updateCheckoutData({
                    taxId: isThai
                      ? e.target.value.replace(/\D/g, "").slice(0, 13)
                      : e.target.value,
                  })
                }
                placeholder={labels.taxIdPlaceholder}
                maxLength={isThai ? 13 : undefined}
                error={errors.taxId}
                required
              />
            </div>
          </div>

          <FormInput
            label={labels.taxAddress}
            type="text"
            name="taxAddress"
            value={checkoutData.taxAddress}
            onChange={(e) => updateCheckoutData({ taxAddress: e.target.value })}
            placeholder={labels.taxAddressPlaceholder}
            error={errors.taxAddress}
            required
          />

          <div className="row">
            <div className="col-md-6">
              <FormInput
                label={labels.taxSubDistrict}
                type="text"
                name="taxSubDistrict"
                value={checkoutData.taxSubDistrict}
                onChange={(e) => updateCheckoutData({ taxSubDistrict: e.target.value })}
                placeholder={labels.taxSubDistrictPlaceholder}
                error={errors.taxSubDistrict}
                required
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label={labels.taxDistrict}
                type="text"
                name="taxDistrict"
                value={checkoutData.taxDistrict}
                onChange={(e) => updateCheckoutData({ taxDistrict: e.target.value })}
                placeholder={labels.taxDistrictPlaceholder}
                error={errors.taxDistrict}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <FormInput
                label={labels.taxProvince}
                type="text"
                name="taxProvince"
                value={checkoutData.taxProvince}
                onChange={(e) => updateCheckoutData({ taxProvince: e.target.value })}
                placeholder={labels.taxProvincePlaceholder}
                error={errors.taxProvince}
                required
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label={labels.taxPostalCode}
                type="text"
                name="taxPostalCode"
                value={checkoutData.taxPostalCode}
                onChange={(e) =>
                  updateCheckoutData({
                    taxPostalCode: isThai
                      ? e.target.value.replace(/\D/g, "").slice(0, 5)
                      : e.target.value,
                  })
                }
                placeholder={labels.taxPostalCodePlaceholder}
                maxLength={isThai ? 5 : undefined}
                error={errors.taxPostalCode}
                required
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
