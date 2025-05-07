import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { superviseSchema } from "../validations/supervise-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { createSupervise } from "../services/superviseService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllResearchers } from '../services/researcherService';
import { fetchAllDoctoralStudents } from '../services/doctoralStudentService';

export default function AddSupervisePage() {
  // Define Researcher type
  interface Researcher {
    res_code: number;
    res_fname: string;
    res_lname: string;
    res_prof_email: string;
  }

  // Define DoctoralStudent type
  interface DoctoralStudent {
    reg_num: number;
    doc_stud_fname: string;
    doc_stud_lname: string;
    doc_stud_prof_email: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [doctoralStudents, setDoctoralStudents] = useState<DoctoralStudent[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const researchers = await fetchAllResearchers();
      const doctoralStudents = await fetchAllDoctoralStudents();
      setResearchers(researchers.researchers);
      setDoctoralStudents(doctoralStudents.doctoralStudents);
    };

    loadData();
  }, []);

  const form = useForm<z.infer<typeof superviseSchema>>({
    resolver: zodResolver(superviseSchema),
    defaultValues: {
      res_code: undefined,
      reg_num: undefined,
      super_start_date: "",
      super_end_date: null,
      super_theme: "",
    },
  });

  const handleAdd = async (values: z.infer<typeof superviseSchema>) => {
    try {
      const response = await createSupervise(
        values.res_code,
        values.reg_num,
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
      const errorMessage = error.response?.data?.error || t('supervise.error_creating');
      navigate("/personnel-management/supervise", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("supervise.add_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Researcher Field */}
            <FormField
              control={form.control}
              name="res_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("supervise.researcher")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t("supervise.select_researcher")} />
                      </SelectTrigger>
                      <SelectContent>
                        {researchers.map((researcher) => (
                          <SelectItem 
                            key={researcher.res_code} 
                            value={researcher.res_code.toString()}
                          >
                            {`${researcher.res_fname} ${researcher.res_lname} (${researcher.res_prof_email})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Doctoral Student Field */}
            <FormField
              control={form.control}
              name="reg_num"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("supervise.doctoral_student")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t("supervise.select_student")} />
                      </SelectTrigger>
                      <SelectContent>
                        {doctoralStudents.map((student) => (
                          <SelectItem 
                            key={student.reg_num} 
                            value={student.reg_num.toString()}
                          >
                            {`${student.doc_stud_fname} ${student.doc_stud_lname} (${student.doc_stud_prof_email})`}
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

          {/* Supervision Theme Field */}
          <FormField
            control={form.control}
            name="super_theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("supervise.super_theme")}</FormLabel>
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
            {/* Start Date Field */}
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

            {/* End Date Field */}
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
              onClick={() => navigate('/personnel-management/supervise')}
            >
              {t("global.cancel")}
            </Button>
            <Button 
              size="sm" 
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              <CircleCheck className="w-4 h-4 mr-2" />
              {t("global.add")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}