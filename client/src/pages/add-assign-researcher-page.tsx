import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignResearcherSchema } from "../validations/assign-researcher-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { createAssignResearcher } from "../services/assignResearcherService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllResearchers } from '../services/researcherService';
import { fetchAllEquipments } from '../services/equipmentService';

export default function AddAssignResearcherPage() {
  // Define Researcher type
  interface Researcher {
    res_code: number;
    res_fname: string;
    res_lname: string;
    res_prof_email: string;
  }

  // Define Equipment type
  interface Equipment {
    inventory_num: string;
    equip_name: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const researchers = await fetchAllResearchers();
      const equipment = await fetchAllEquipments();
      setResearchers(researchers.researchers);
      setEquipmentList(equipment.equipments);
    };

    loadData();
  }, []);

  const form = useForm<z.infer<typeof assignResearcherSchema>>({
    resolver: zodResolver(assignResearcherSchema),
    defaultValues: {
      res_code: undefined,
      inventory_num: undefined,
      res_assign_date: "",
      res_return_date: null,
    },
  });

  const handleAdd = async (values: z.infer<typeof assignResearcherSchema>) => {
    try {
      const response = await createAssignResearcher(
        values.res_code,
        values.inventory_num,
        values.res_assign_date,
        values.res_return_date || undefined
      );

      if ("message" in response) {
        navigate('/equipment-management/assign-researcher', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t('assignResearcher.error_creating');
      navigate("/equipment-management/assign-researcher", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("assignResearcher.add_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Researcher Field */}
            <FormField
              control={form.control}
              name="res_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignResearcher.researcher")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t("assignResearcher.select_researcher")} />
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

            {/* Equipment Field */}
            <FormField
              control={form.control}
              name="inventory_num"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignResearcher.equipment")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={t("assignResearcher.select_equipment")} />
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

            {/* Return Date Field */}
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
              onClick={() => navigate('/equipment-management/assign-researcher')}
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