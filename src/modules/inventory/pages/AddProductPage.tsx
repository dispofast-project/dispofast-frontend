import { Box } from "@mui/material";
import { Button } from "../../../shared/components/Button/Button";
import { useAddProduct } from "../hooks/useAddProduct";
import ProductInfoSection from "../components/form/ProductInfoSection";
import ProductCategoriesSection from "../components/form/ProductCategoriesSection";
import ProductInventorySection from "../components/form/ProductInventorySection";
import ProductSeoSection from "../components/form/ProductSeoSection";
import CustomTitle from "../../../shared/components/Title/Title";

const AddProductPage = () => {
  const { form, categories, isSubmitting, submitError, imageFile, setImageFile, onSubmit, onDiscard } =
    useAddProduct();
  return (
    <Box className="flex flex-col gap-6 pb-8">
      <Box className="grid grid-cols-2 items-center">
        <CustomTitle mainTitle="Agregar producto" description="Añadir un nuevo producto al inventario"/>
        <Box className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onDiscard} disabled={isSubmitting}>
            Descartar
          </Button>
          <Button variant="primary" onClick={onSubmit} isLoading={isSubmitting}>
            Guardar
          </Button>
        </Box>
      </Box>

      {submitError && (
        <Box className="bg-red-100 text-red-700 p-4 rounded">{submitError}</Box>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ProductInfoSection
            control={form.control}
            imageFile={imageFile}
            onImageChange={setImageFile}
            onImageClear={() => setImageFile(null)}
          />
          <ProductCategoriesSection
            control={form.control}
            categories={categories}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <ProductInventorySection control={form.control} />
          <ProductSeoSection control={form.control} />
        </div>
      </div>
    </Box>
  );
};

export default AddProductPage;
