import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicationSchema } from "../validations/publication-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate, useParams } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllProductionTypes } from '../services/productionTypeService';
import { fetchAllReviews } from '@/services/reviewService';
import { fetchPublicationById, updatePublication } from '../services/publicationService';

export default function EditPublicationPage() {
  interface ProductionType {
    type_id: number;
    type_name: string;
  }

  interface Review {
    review_num: number;
    review_title: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { doi } = useParams<{ doi: string }>();

  const [productionTypes, setProductionTypes] = useState<ProductionType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const typesResponse = await fetchAllProductionTypes();
        const reviewsResponse = await fetchAllReviews();
        setProductionTypes(typesResponse.productionTypes);
        setReviews(reviewsResponse.reviews);

        if (doi) {
          const publicationResponse = await fetchPublicationById(doi);
          if ('publication' in publicationResponse) {
            const publication = publicationResponse.publication;
            
            form.reset({
              doi: publication.doi,
              article_title: publication.article_title,
              submission_date: new Date(publication.submission_date).toISOString(),
              acceptance_date: new Date(publication.acceptance_date).toISOString(),
              pub_pages: publication.pub_pages || "",
              review_num: publication.review_num,
              type_id: publication.type_id,
            });
          }
        }
      } catch (error: any) {
        navigate("/research-productions/publications", {
          state: { errorMessage: t("error.FailedToLoadData") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [doi]);

  const form = useForm<z.infer<typeof publicationSchema>>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      doi: "",
      article_title: "",
      submission_date: "",
      acceptance_date: "",
      pub_pages: "",
      review_num: undefined,
      type_id: undefined,
    },
  });

  const handleEdit = async (values: z.infer<typeof publicationSchema>) => {
    if (!doi) return;

    try {
      const response = await updatePublication(doi, {
        article_title: values.article_title,
        submission_date: values.submission_date,
        acceptance_date: values.acceptance_date,
        pub_pages: values.pub_pages || undefined,
        review_num: values.review_num,
        type_id: values.type_id
      });
      
      if ("message" in response) {
        navigate('/research-productions/publications', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t("error.InternalServerError");
      navigate("/research-productions/publications", {
        state: { errorMessage: errorMessage },
      });
    }
  };
  
  if (isLoading) {
    return <div>{t("global.loading")}...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("publication.edit_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-6">
          {/* DOI Field (read-only) */}
          <FormField
            control={form.control}
            name="doi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("publication.doi")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Article Title Field */}
          <FormField
            control={form.control}
            name="article_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("publication.article_title")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Submission Date Field */}
            <FormField
              control={form.control}
              name="submission_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("publication.submission_date")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Acceptance Date Field */}
            <FormField
              control={form.control}
              name="acceptance_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("publication.acceptance_date")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pages Field */}
            <FormField
              control={form.control}
              name="pub_pages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("publication.pub_pages")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="e.g., 123-130"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Review Field */}
            <FormField
              control={form.control}
              name="review_num"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("publication.review")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t("publication.select_review")} />
                      </SelectTrigger>
                      <SelectContent>
                        {reviews.map((review) => (
                          <SelectItem key={review.review_num} value={review.review_num.toString()}>
                            {review.review_title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Production Type Field */}
          <FormField
            control={form.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("publication.type")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t("publication.select_type")} />
                    </SelectTrigger>
                    <SelectContent>
                      {productionTypes.map((type) => (
                        <SelectItem key={type.type_id} value={type.type_id.toString()}>
                          {type.type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/research-productions/publications');
              }}
            >
              {t("global.cancel")}
            </Button>
            <Button size="sm" type="submit">
              <CircleCheck className="w-4 h-4" />
              {t("global.save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}