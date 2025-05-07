import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAssignResearcherSchema } from "../validations/assign-researcher-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { fetchAssignResearcherById, updateAssignResearcher } from "../services/assignResearcherService";

export default function EditAssignResearcherPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resCode, inventoryNum } = useParams();

  const [loading, setLoading] = useState(true);
  const [researcherName, setResearcherName] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  
  const form = useForm<z.infer<typeof updateAssignResearcherSchema>>({
    resolver: zodResolver(updateAssignResearcherSchema),
    defaultValues: {
      res_assign_date: "",
      res_return_date: null,
    },
  });

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        if (resCode && inventoryNum) {
          const response = await fetchAssignResearcherById(Number(resCode), inventoryNum);
          if ('assignment' in response) {
            form.reset({
              res_assign_date: new Date(response.assignment.res_assign_date).toISOString(),
              res_return_date: response.assignment.res_return_date 
                ? new Date(response.assignment.res_return_date).toISOString() 
                : null,
            });
            setResearcherName(
              `${response.assignment.Researcher?.res_fname} ${response.assignment.Researcher?.res_lname} (${response.assignment.Researcher?.res_prof_email})`
            );
            setEquipmentName(
              `${response.assignment.Equipment?.equip_name} (${inventoryNum})`
            );
          }
        }
      } catch (error) {
        navigate('/equipment-management/assign-researcher', {
          state: { errorMessage: t('assignResearcher.error_fetching') }
        });
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [resCode, inventoryNum, form, navigate, t]);

  const handleUpdate = async (values: z.infer<typeof updateAssignResearcherSchema>) => {
    try {
      if (!resCode || !inventoryNum) return;
      
      const response = await updateAssignResearcher(
        Number(resCode),
        inventoryNum,
        values.res_assign_date,
        values.res_return_date || undefined
      );

      if ("message" in response) {
        navigate('/equipment-management/assign-researcher', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t('assignResearcher.error_updating');
      navigate("/equipment-management/assign-researcher", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  if (loading) return <p>{t('global.loading')}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("assignResearcher.edit_title")}</h1>
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

            {/* Equipment Name (Disabled) */}
            <FormItem>
              <FormLabel>{t("equipment.title")}</FormLabel>
              <FormControl>
                <Select disabled>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={equipmentName} />
                  </SelectTrigger>
                </Select>
              </FormControl>
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="res_assign_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignResearcher.assign_date")}</FormLabel>
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
              name="res_return_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignResearcher.return_date")} ({t("global.optional")})</FormLabel>
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
              onClick={() => navigate('/equipment-management/assign-researcher')}
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