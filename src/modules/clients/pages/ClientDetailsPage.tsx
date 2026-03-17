import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { LegalEntityType } from "../types";
import { useClientDetails } from "../hooks/useClientDetails";
import ClientDetailsHeader from "../components/ClientDetailsHeader";
import IndividualFormSections from "../components/detail/IndividualFormSections";
import OrganizationFormSections from "../components/detail/OrganizationFormSections";
import CommercialSidebar from "../components/detail/CommercialSidebar";

const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    client,
    isLoading,
    error,
    isUpdating,
    formData,
    isActive,
    setIsActive,
    isDirty,
    selectedCity,
    selectedAdvisor,
    selectedPriceList,
    handleChange,
    handleDiscountChange,
    handleCityChange,
    handleAdvisorChange,
    handlePriceListChange,
    handleUpdate,
  } = useClientDetails(id);

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center p-20 min-h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !client || !formData) {
    return (
      <Box className="p-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/clientes")}
          className="mb-6"
          sx={{ textTransform: "none" }}
        >
          Volver a Clientes
        </Button>
        <Box className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center shadow-sm">
          <Typography variant="h6" className="font-semibold mb-2">
            Error
          </Typography>
          <Typography>{error || "No se encontró el cliente."}</Typography>
        </Box>
      </Box>
    );
  }

  const isNatural = client.legalEntityType === LegalEntityType.NATURAL;
  const formSectionProps = { formData, selectedCity, onChange: handleChange, onCityChange: handleCityChange };

  return (
    <Box className="p-6 max-w-7xl mx-auto animate-fade-in">
      <ClientDetailsHeader
        client={client}
        isActive={isActive}
        onActiveChange={setIsActive}
        isDirty={isDirty}
        isUpdating={isUpdating}
        onUpdate={handleUpdate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {isNatural
            ? <IndividualFormSections {...formSectionProps} />
            : <OrganizationFormSections {...formSectionProps} />
          }
        </div>

        <div className="lg:col-span-4 space-y-6">
          <CommercialSidebar
            formData={formData}
            selectedPriceList={selectedPriceList}
            selectedAdvisor={selectedAdvisor}
            onChange={handleChange}
            onDiscountChange={handleDiscountChange}
            onPriceListChange={handlePriceListChange}
            onAdvisorChange={handleAdvisorChange}
          />
        </div>
      </div>
    </Box>
  );
};

export default ClientDetailsPage;
