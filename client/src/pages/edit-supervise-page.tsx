import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSuperviseSchema } from "../validations/supervise-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { fetchSuperviseById, updateSupervise } from "../services/superviseService";

export default function UpdateSupervisePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resCode, regNum } = useParams();

  const [loading, setLoading] = useState(true);
  const [researcherName, setResearcherName] = useState("");
  const [doctoralStudentName, setDoctoralStudentName] = useState("");
  
  const form = useForm<z.infer<typeof updateSuperviseSchema>>({
    resolver: zodResolver(updateSuperviseSchema),
    defaultValues: {
      super_start_date: "",
      super_end_date: null,
      super_theme: "",
    },
  });

  useEffect(() => {
    const loadSupervise = async () => {
      try {
        if (resCode && regNum) {
          const response = await fetchSuperviseById(Number(resCode), Number(regNum));
          if ('supervise' in response) {
            form.reset({
              super_start_date: new Date(response.supervise.super_start_date).toISOString(),
              super_end_date: response.supervise.super_end_date ? new Date(response.supervise.super_end_date).toISOString() : null,
              super_theme: response.supervise.super_theme,
            });
            setResearcherName(`${response.supervise.Researcher?.res_fname} ${response.supervise.Researcher?.res_lname}`);
            setDoctoralStudentName(`${response.supervise.DoctoralStudent?.doc_stud_fname} ${response.supervise.DoctoralStudent?.doc_stud_lname} (${regNum})`);

          }
        }
        
      } catch (error) {
        navigate('/personnel-management/supervise', {
          state: { errorMessage: t('supervise.error_fetching') }
        });
      } finally {
        setLoading(false);
      }
    };

    loadSupervise();
  }, [resCode, regNum, form]);

  const handleUpdate = async (values: z.infer<typeof updateSuperviseSchema>) => {
    try {
      const response = await updateSupervise(
        Number(resCode),
        Number(regNum),
        values.super_start_date,
        values.super_theme,
        values.super_end_date || undefined
      );

      if ("message" in response) {
        navigate('/personnel-management/supervise', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t('supervise.error_updating');
      navigate("/personnel-management/supervise", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  if (loading) return <p>{t('global.loading')}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("supervise.edit_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Researcher Full Name (Disabled) */}
            <FormItem>
              <FormLabel>{t("researcher.title")}</FormLabel>
              <FormControl>
                <Select disabled>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={researcherName} />
                  </SelectTrigger>
                </Select>
              </FormControl>
            </FormItem>

            {/* Doctoral Student Full Name (Disabled) */}
            <FormItem>
              <FormLabel>{t("doctoralStudent.title")}</FormLabel>
              <FormControl>
                <Select disabled>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={doctoralStudentName} />
                  </SelectTrigger>
                </Select>
              </FormControl>
            </FormItem>
          </div>
          
          <FormField
            control={form.control}
            name="super_theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("supervise.super_theme")}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="super_start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("supervise.start_date")}</FormLabel>
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

            <FormField
              control={form.control}
              name="super_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("supervise.end_date")} ({t("global.optional")})</FormLabel>
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

          <div className="flex justify-end space-x-4">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => navigate('/personnel-management/supervise')}
            >
              {t("global.cancel")}
            </Button>
            <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>
              <CircleCheck className="w-4 h-4 mr-2" />
              {t("global.save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
