import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignDoctoralStudentSchema } from "../validations/assign-doctoral-student-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { createAssignDoctoralStudent } from "../services/assignDoctoralStudentService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllDoctoralStudents } from '../services/doctoralStudentService';
import { fetchAllEquipments } from '../services/equipmentService';

export default function AddAssignDoctoralStudentPage() {
  // Define DoctoralStudent type
  interface DoctoralStudent {
    reg_num: number;
    doc_stud_fname: string;
    doc_stud_lname: string;
    doc_stud_prof_email: string;
  }

  // Define Equipment type
  interface Equipment {
    inventory_num: string;
    equip_name: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [doctoralStudents, setDoctoralStudents] = useState<DoctoralStudent[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const students = await fetchAllDoctoralStudents();
      const equipment = await fetchAllEquipments();
      setDoctoralStudents(students.doctoralStudents);
      setEquipmentList(equipment.equipments);
    };

    loadData();
  }, []);

  const form = useForm<z.infer<typeof assignDoctoralStudentSchema>>({
    resolver: zodResolver(assignDoctoralStudentSchema),
    defaultValues: {
      reg_num: undefined,
      inventory_num: undefined,
      doc_stud_assign_date: "",
      doc_stud_return_date: null,
    },
  });

  const handleAdd = async (values: z.infer<typeof assignDoctoralStudentSchema>) => {
    try {
      const response = await createAssignDoctoralStudent(
        values.reg_num,
        values.inventory_num,
        values.doc_stud_assign_date,
        values.doc_stud_return_date || undefined
      );

      if ("message" in response) {
        navigate('/equipment-management/assign-doctoral-student', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t('assignDoctoralStudent.error_creating');
      navigate("/equipment-management/assign-doctoral-student", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("assignDoctoralStudent.add_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctoral Student Field */}
            <FormField
              control={form.control}
              name="reg_num"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignDoctoralStudent.doctoral_student")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t("assignDoctoralStudent.select_doctoral_student")} />
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

            {/* Equipment Field */}
            <FormField
              control={form.control}
              name="inventory_num"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignDoctoralStudent.equipment")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t("assignDoctoralStudent.select_equipment")} />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentList.map((equipment) => (
                          <SelectItem 
                            key={equipment.inventory_num} 
                            value={equipment.inventory_num}
                          >
                            {`${equipment.equip_name} (${equipment.inventory_num})`}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignment Date Field */}
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

            {/* Return Date Field */}
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
              onClick={() => navigate('/equipment-management/assign-doctoral-student')}
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