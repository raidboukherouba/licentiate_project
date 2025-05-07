import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema } from "../validations/equipment-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate, useParams } from 'react-router-dom';
import { CircleCheck, CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllLaboratories } from '../services/laboratoryService';
import { fetchEquipmentById, updateEquipment } from '../services/equipmentService';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function EditEquipmentPage() {
  // Define Laboratory type
  interface Laboratory {
    lab_code: number;
    lab_name: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { inventoryNum } = useParams<{ inventoryNum: string }>();

  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchAllLaboratories();
        setLaboratories(response.laboratories);

        if (inventoryNum) {
            const equipmentResponse = await fetchEquipmentById(inventoryNum);
            if ('equipment' in equipmentResponse) {
              const equipment = equipmentResponse.equipment;
              
              form.reset({
                inventory_num: equipment.inventory_num,
                equip_name: equipment.equip_name,
                equip_desc: equipment.equip_desc || "",
                // Ensure acq_date is either a valid ISO string or null
                acq_date: equipment.acq_date ? new Date(equipment.acq_date).toISOString() : null,
                purchase_price: equipment.purchase_price || null,
                equip_status: equipment.equip_status || "",
                equip_quantity: equipment.equip_quantity || null,
                lab_code: equipment.lab_code,
              });
            }
          }
      } catch (error: any) {
        navigate("/equipment-management/equipment-inventory", {
          state: { errorMessage: t("error.FailedToLoadData") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [inventoryNum]);

  const form = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      inventory_num: "",
      equip_name: "",
      equip_desc: "",
      acq_date: null,
      purchase_price: null,
      equip_status: "",
      equip_quantity: null,
      lab_code: undefined,
    },
  });

  const handleEdit = async (values: z.infer<typeof equipmentSchema>) => {
    if (!inventoryNum) return;

    try {
      const response = await updateEquipment(
        inventoryNum,
        values.equip_name,
        values.lab_code,
        values.equip_desc || undefined,
        values.acq_date || undefined,
        values.purchase_price || undefined,
        values.equip_status || undefined,
        values.equip_quantity || undefined
      );
      
      if ("message" in response) {
        navigate('/equipment-management/equipment-inventory', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t("error.InternalServerError");
      navigate("/equipment-management/equipment-inventory", {
        state: { errorMessage: errorMessage },
      });
    }
  };
  
  if (isLoading) {
    return <div>{t("global.loading")}...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("equipment.edit_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-6">
          {/* Inventory Number Field (read-only) */}
          <FormField
            control={form.control}
            name="inventory_num"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("equipment.inventory_num")}</FormLabel>
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

          {/* Equipment Name Field */}
          <FormField
            control={form.control}
            name="equip_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("equipment.equip_name")}</FormLabel>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Acquisition Date Field */}
            <FormField
              control={form.control}
              name="acq_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("equipment.acq_date")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>{t("equipment.select_date")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Price Field */}
            <FormField
              control={form.control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("equipment.purchase_price")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment Status Field */}
            <FormField
              control={form.control}
              name="equip_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("equipment.status")}</FormLabel>
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

            {/* Equipment Quantity Field */}
            <FormField
              control={form.control}
              name="equip_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("equipment.quantity")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Equipment Description Field */}
          <FormField
            control={form.control}
            name="equip_desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("equipment.description")}</FormLabel>
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

          {/* Laboratory Field */}
          <FormField
            control={form.control}
            name="lab_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("equipment.laboratory")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t("equipment.select_laboratory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {laboratories.map((laboratory) => (
                        <SelectItem key={laboratory.lab_code} value={laboratory.lab_code.toString()}>
                          {laboratory.lab_name}
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
                navigate('/equipment-management/equipment-inventory');
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