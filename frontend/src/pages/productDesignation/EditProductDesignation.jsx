import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";  // Import useParams and useNavigate
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../lib/PdValidation";
import { getPDById, updatePD } from "../../apis/ProductDesignation-api";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EditProductDesignation({ onSuccess }) {
  const { id: productId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "",
      part_name: "",
      reference: "",
    },
  });

  useEffect(() => {
    if (!productId) {
      setErrorMessage("Invalid Product ID.");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const product = await getPDById(productId);
        if (!product) {
          setErrorMessage("Product not found.");
          return;
        }
        form.reset(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setErrorMessage("Failed to load product. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, form]);

  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      await updatePD(productId, data);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/pd"); // Redirect to product list after update
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage(error.message || "Failed to update product. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product Designation</CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="part_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit">
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
