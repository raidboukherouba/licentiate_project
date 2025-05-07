import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communicationSchema } from "../validations/communication-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { createCommunication } from "../services/communicationService";
import { fetchAllProductionTypes } from '../services/productionTypeService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddCommunicationPage() {
  // Define ProductionType type
  interface ProductionType {
    type_id: number;
    type_name: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [productionTypes, setProductionTypes] = useState<ProductionType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchAllProductionTypes();
      setProductionTypes(response.productionTypes);
    };

    loadData();
  }, []);

  const form = useForm<z.infer<typeof communicationSchema>>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      title_comm: "",
      event_title: "",
      year_comm: new Date().getFullYear(),
      url_comm: "",
      type_id: undefined,
    },
  });

  const handleAdd = async (values: z.infer<typeof communicationSchema>) => {
    try {
      const response = await createCommunication({
        title_comm: values.title_comm,
        event_title: values.event_title,
        year_comm: values.year_comm,
        type_id: values.type_id,
        url_comm: values.url_comm || undefined
      });

      if ("message" in response) {
        navigate('/research-productions/communications', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t("error.InternalServerError");
      navigate("/research-productions/communications", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("communication.add_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6">
          {/* Communication Title Field */}
          <FormField
            control={form.control}
            name="title_comm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("communication.title")}</FormLabel>
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

          {/* Event Title Field */}
          <FormField
            control={form.control}
            name="event_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("communication.event_title")}</FormLabel>
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
            {/* Year Field */}
            <FormField
              control={form.control}
              name="year_comm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("communication.year_comm")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL Field */}
            <FormField
              control={form.control}
              name="url_comm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("communication.url_comm")}</FormLabel>
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

          {/* Production Type Field */}
          <FormField
            control={form.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("communication.type")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={t("communication.select_type")} />
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
            <Button size="sm" variant="outline" onClick={() => navigate('/research-productions/communications')}>
              {t("global.cancel")}
            </Button>
            <Button size="sm" type="submit">
              <CircleCheck className="w-4 h-4" />
              {t("global.add")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}