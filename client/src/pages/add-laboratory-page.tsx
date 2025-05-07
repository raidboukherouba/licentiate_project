import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { laboratorySchema } from "../validations/laboratory-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { createLaboratory } from "../services/laboratoryService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllFaculties} from '../services/facultyService';
import { fetchAllDomains } from '../services/domainService';
import { fetchAllDepartments } from '../services/departmentService';

export default function AddLaboratoryPage() {
  // Define Domain type
  interface Domain {
    domain_id: number;
    domain_name: string;
    domain_abbr?: string | null;
  }

  // Define Faculty type
  interface Faculty {
    faculty_id: number;
    faculty_name: string;
  }

  // Define Department type
  interface Department {
    dept_id: number;
    dept_name: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const faculties = await fetchAllFaculties();
      const domains = await fetchAllDomains();
      const departments = await fetchAllDepartments();
      setFaculties(faculties.faculties);
      setDomains(domains.domains);
      setDepartments(departments.departments);
    };

    loadData();
  }, []);

  const form = useForm<z.infer<typeof laboratorySchema>>({
    resolver: zodResolver(laboratorySchema),
    defaultValues: {
      lab_name: "",
      lab_abbr: "",
      lab_desc: "",
      lab_address: "",
      lab_phone: "",
      faculty_id: undefined,
      domain_id: undefined,
      dept_id: undefined,
    },
  });

  const handleAdd = async (values: z.infer<typeof laboratorySchema>) => {
    try {
      const response = await createLaboratory(
        values.lab_name,
        values.faculty_id,
        values.domain_id,
        values.dept_id,
        values.lab_abbr || undefined,
        values.lab_desc || undefined,
        values.lab_address || undefined,
        values.lab_phone || undefined
      );

      if ("message" in response) {
        navigate('/organizational-structure/laboratories', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      navigate("/organizational-structure/laboratories", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("laboratory.add_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6">
          {/* Laboratory Name Field */}
          <FormField
            control={form.control}
            name="lab_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("laboratory.lab_name")}</FormLabel>
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
            {/* Laboratory Abbreviation Field */}
            <FormField
              control={form.control}
              name="lab_abbr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("laboratory.lab_abbr")}</FormLabel>
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

            {/* Laboratory Address Field */}
            <FormField
              control={form.control}
              name="lab_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("laboratory.lab_address")}</FormLabel>
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

          {/* Laboratory Description Field */}
          <FormField
            control={form.control}
            name="lab_desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("laboratory.lab_desc")}</FormLabel>
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
            {/* Laboratory Phone Field */}
            <FormField
              control={form.control}
              name="lab_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("laboratory.lab_phone")}</FormLabel>
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

            {/* Faculty ID Field */}
            <FormField
              control={form.control}
              name="faculty_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("faculty.title")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))} // Convert to number
                      value={field.value?.toString()} // Ensure it's a string for Select component
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty.faculty_id} value={faculty.faculty_id.toString()}>
                            {faculty.faculty_name}
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
            {/* Domain ID Field */}
            <FormField
              control={form.control}
              name="domain_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("domain.title")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))} // Convert to number
                      value={field.value?.toString()} // Ensure it's a string for Select component
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domains.map((domain) => (
                          <SelectItem key={domain.domain_id} value={domain.domain_id.toString()}>
                            {domain.domain_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department ID Field */}
            <FormField
              control={form.control}
              name="dept_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("department.title")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))} // Convert to number
                      value={field.value?.toString()} // Ensure it's a string for Select component
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.dept_id} value={department.dept_id.toString()}>
                            {department.dept_name}
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

          <div className="flex justify-end space-x-4">
            <Button size="sm" variant="outline" onClick={() => navigate('/organizational-structure/laboratories')}>
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