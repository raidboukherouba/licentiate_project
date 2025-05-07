import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "../validations/review-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate, useParams } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllPublishers } from '../services/publisherService';
import { fetchReviewById, updateReview } from '../services/reviewService';

export default function EditReviewPage() {
  // Define Publisher type
  interface Publisher {
    publisher_id: number;
    publisher_name: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reviewNum } = useParams<{ reviewNum: string }>();

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchAllPublishers();
        setPublishers(response.publishers);

        if (reviewNum) {
          const reviewResponse = await fetchReviewById(Number(reviewNum));
          if ('review' in reviewResponse) {
            const review = reviewResponse.review;
            
            form.reset({
              review_title: review.review_title,
              issn: review.issn,
              e_issn: review.e_issn || "",
              review_vol: review.review_vol || "",
              publisher_id: review.publisher_id,
            });
          }
        }
      } catch (error: any) {
        navigate("/publications-management/scientific-reviews", {
          state: { errorMessage: t("error.FailedToLoadData") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [reviewNum]);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      review_title: "",
      issn: "",
      e_issn: "",
      review_vol: "",
      publisher_id: undefined,
    },
  });

  const handleEdit = async (values: z.infer<typeof reviewSchema>) => {
    if (!reviewNum) return;

    try {
      const response = await updateReview(Number(reviewNum), {
        review_title: values.review_title,
        issn: values.issn,
        publisher_id: values.publisher_id,
        e_issn: values.e_issn || undefined,
        review_vol: values.review_vol || undefined
      });
      
      if ("message" in response) {
        navigate('/publications-management/scientific-reviews', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t("error.InternalServerError");
      navigate("/publications-management/scientific-reviews", {
        state: { errorMessage: errorMessage },
      });
    }
  };
  
  if (isLoading) {
    return <div>{t("global.loading")}...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("review.edit_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-6">
          {/* Review Title Field */}
          <FormField
            control={form.control}
            name="review_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("review.title")}</FormLabel>
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
            {/* ISSN Field */}
            <FormField
              control={form.control}
              name="issn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISSN</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* E-ISSN Field */}
            <FormField
              control={form.control}
              name="e_issn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-ISSN</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Volume Field */}
          <FormField
            control={form.control}
            name="review_vol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("review.review_vol")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Publisher Field */}
          <FormField
            control={form.control}
            name="publisher_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("review.publisher")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t("review.select_publisher")} />
                    </SelectTrigger>
                    <SelectContent>
                      {publishers.map((publisher) => (
                        <SelectItem key={publisher.publisher_id} value={publisher.publisher_id.toString()}>
                          {publisher.publisher_name}
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
                navigate('/publications-management/scientific-reviews');
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