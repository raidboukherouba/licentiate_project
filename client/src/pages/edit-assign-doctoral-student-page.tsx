import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAssignDoctoralStudentSchema } from "../validations/assign-doctoral-student-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { fetchAssignDoctoralStudentById, updateAssignDoctoralStudent } from "../services/assignDoctoralStudentService";

export default function EditAssignDoctoralStudentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { regNum, inventoryNum } = useParams();

  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  
  const form = useForm<z.infer<typeof updateAssignDoctoralStudentSchema>>({
    resolver: zodResolver(updateAssignDoctoralStudentSchema),
    defaultValues: {
      doc_stud_assign_date: "",
      doc_stud_return_date: null,
    },
  });

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        if (regNum && inventoryNum) {
          const response = await fetchAssignDoctoralStudentById(Number(regNum), inventoryNum);
          if ('assignment' in response) {
            form.reset({
              doc_stud_assign_date: new Date(response.assignment.doc_stud_assign_date).toISOString(),
              doc_stud_return_date: response.assignment.doc_stud_return_date 
                ? new Date(response.assignment.doc_stud_return_date).toISOString() 
                : null,
            });
            setStudentName(
              `${response.assignment.DoctoralStudent?.doc_stud_fname} ${response.assignment.DoctoralStudent?.doc_stud_lname} (${response.assignment.DoctoralStudent?.doc_stud_email})`
            );
            setEquipmentName(
              `${response.assignment.Equipment?.equip_name} (${inventoryNum})`
            );
          }
        }
      } catch (error) {
        navigate('/equipment-management/assign-doctoral-student', {
          state: { errorMessage: t('assignDoctoralStudent.error_fetching') }
        });
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [regNum, inventoryNum, form, navigate, t]);

  const handleUpdate = async (values: z.infer<typeof updateAssignDoctoralStudentSchema>) => {
    try {
      if (!regNum || !inventoryNum) return;
      
      const response = await updateAssignDoctoralStudent(
        Number(regNum),
        inventoryNum,
        values.doc_stud_assign_date,
        values.doc_stud_return_date || undefined
      );

      if ("message" in response) {
        navigate('/equipment-management/assign-doctoral-student', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t('assignDoctoralStudent.error_updating');
      navigate("/equipment-management/assign-doctoral-student", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  if (loading) return <p>{t('global.loading')}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("assignDoctoralStudent.edit_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctoral Student Full Name (Disabled) */}
            <FormItem>
              <FormLabel>{t("doctoralStudent.title")}</FormLabel>
              <FormControl>
                <Select disabled>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={studentName} />
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
              name="doc_stud_assign_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignDoctoralStudent.assign_date")}</FormLabel>
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
              name="doc_stud_return_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignDoctoralStudent.return_date")} ({t("global.optional")})</FormLabel>
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
              onClick={() => navigate('/equipment-management/assign-doctoral-student')}
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