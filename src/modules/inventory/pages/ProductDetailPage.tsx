import { Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../shared/components/Button/Button";
import CustomTitle from "../../../shared/components/Title/Title";
import { StatusBadge } from "../../../shared/components/StatusBadge/StatusBadge";
import ProductInfoSection from "../components/form/ProductInfoSection";
import ProductCategoriesSection from "../components/form/ProductCategoriesSection";
import ProductInventorySection from "../components/form/ProductInventorySection";
import ProductSeoSection from "../components/form/ProductSeoSection";
import { useEditProduct } from "../hooks/useEditProduct";
import { PRODUCT_STATUS_CONFIG } from "../config/statusConfig";
import { BackButton } from "../../../shared/components/BackButton/BackButton";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    form,
    categories,
    product,
    isLoading,
    isEditing,
    isSubmitting,
    submitError,
    imageFile,
    setImageFile,
    startEditing,
    cancelEditing,
    onSubmit,
  } = useEditProduct(id!);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <CircularProgress size={40} sx={{ color: "var(--dispofast-primary)" }} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="flex items-center justify-center h-64">
        <p className="text-gray-500">Producto no encontrado.</p>
      </Box>
    );
  }


  return (
    <Box className="flex flex-col gap-5 pb-8 justify-start">

      <Box className="grid grid-cols-2 items-center">

        <Box className="flex items-center gap-4">
          <BackButton onClick={() => navigate("/inventario")} />
          <CustomTitle  mainTitle={product.name} />
          <StatusBadge status={product.state} configMap={PRODUCT_STATUS_CONFIG} />
        </Box>
        <Box className="flex items-center justify-end gap-3">
          
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={cancelEditing} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={onSubmit} isLoading={isSubmitting}>
                Guardar
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={startEditing}>
              Editar
            </Button>
          )}
        </Box>
      </Box>

      {submitError && (
        <Box className="bg-red-100 text-red-700 p-4 rounded">{submitError}</Box>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ProductInfoSection
            control={form.control}
            disabled={!isEditing}
            currentImageUrl={product?.imageUrl}
            imageFile={imageFile}
            onImageChange={setImageFile}
            onImageClear={() => setImageFile(null)}
          />
          <ProductCategoriesSection
            control={form.control}
            categories={categories}
            disabled={!isEditing}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ProductInventorySection
            control={form.control}
            disabled={!isEditing}
            showInitialStock={false}
          />
          <ProductSeoSection control={form.control} disabled={!isEditing} />
        </div>
      </div>
    </Box>
  );
};

export default ProductDetailPage;
