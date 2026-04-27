import React from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import type { ClientFormData } from "../form/types";
import type { PriceListResponse } from "../../types";
import type { User } from "../../../iam/types";
import SectionCard from "./SectionCard";
import { ClientTypeSelector } from "../../../../shared/components/ClientTypeSelector/ClientTypeSelector";
import { PriceListAutocomplete } from "../../../../shared/components/PriceListAutocomplete/PriceListAutocomplete";
import { AdvisorAutocomplete } from "../../../../shared/components/AdvisorAutocomplete/AdvisorAutocomplete";
import CommercialDiscountSelect from "../../../../shared/components/CommercialDiscountSelect/CommercialDiscountSelect";

interface CommercialSidebarProps {
  formData: ClientFormData;
  selectedPriceList: PriceListResponse | null;
  selectedAdvisor: User | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscountChange: (value: string) => void;
  onPriceListChange: (pl: PriceListResponse | null) => void;
  onAdvisorChange: (advisor: User | null) => void;
}

const CommercialSidebar = ({
  formData,
  selectedPriceList,
  selectedAdvisor,
  onChange,
  onDiscountChange,
  onPriceListChange,
  onAdvisorChange,
}: CommercialSidebarProps) => (
  <>
    <SectionCard title="Información Comercial" icon={<StorefrontIcon fontSize="small" />}>
      <div className="flex flex-col gap-4">
        <ClientTypeSelector required value={formData.clientTypeId} onChange={onChange} />
        <PriceListAutocomplete required value={selectedPriceList} onChange={onPriceListChange} />
        <CommercialDiscountSelect
          label="Descuento comercial"
          value={formData.defaultDiscountRate}
          onChange={onDiscountChange}
        />
      </div>
    </SectionCard>

    <SectionCard title="Asesor Asignado" icon={<AccountBoxIcon fontSize="small" />}>
      <AdvisorAutocomplete required value={selectedAdvisor} onChange={onAdvisorChange} />
    </SectionCard>
  </>
);

export default CommercialSidebar;
