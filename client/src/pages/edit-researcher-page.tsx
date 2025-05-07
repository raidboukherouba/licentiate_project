import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { researcherSchema } from "../validations/researcher-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate, useParams } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllTeams } from '../services/teamService';
import { fetchAllFunctions } from '../services/functionService';
import { fetchAllSpecialities } from '../services/specialityService';
import { fetchAllLaboratories } from '../services/laboratoryService';
import { fetchResearcherById, updateResearcher } from '../services/researcherService';

// Define types
interface Team {
  team_id: number;
  team_name: string;
}

interface Function {
  func_code: number;
  func_name: string;
}

interface Speciality {
  spec_code: number;
  spec_name: string;
}

interface Laboratory {
  lab_code: number;
  lab_name: string;
}

export default function EditResearcherPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resCode } = useParams<{ resCode: string }>();

  const [teams, setTeams] = useState<Team[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const form = useForm<z.infer<typeof researcherSchema>>({
    resolver: zodResolver(researcherSchema),
    defaultValues: {
      res_fname: "",
      res_lname: "",
      res_fname_ar: "",
      res_lname_ar: "",
      res_gender: undefined,
      res_prof_email: "",
      func_code: undefined,
      spec_code: undefined,
      team_id: undefined,
      lab_code: undefined,
      res_attach_struc: "",
      res_birth_date: null,
      res_phone: "",
      res_address: "",
      res_grade: "",
      res_diploma: "",
      res_pers_email: "",
      res_gs_link: "",
      res_rg_link: "",
      res_page_link: "",
      res_orcid: "",
      res_pub_count: 0,
      res_cit_count: 0,
      is_director: undefined
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, functionsData, specialitiesData, laboratoriesData] = await Promise.all([
          fetchAllTeams(),
          fetchAllFunctions(),
          fetchAllSpecialities(),
          fetchAllLaboratories()
        ]);
        
        setTeams(teamsData.teams);
        setFunctions(functionsData.functions);
        setSpecialities(specialitiesData.specialities);
        setLaboratories(laboratoriesData.laboratories);

        if (resCode) {
          const response = await fetchResearcherById(Number(resCode));
          if ('researcher' in response) {
            const researcher = response.researcher;
            form.reset({
              res_fname: researcher.res_fname,
              res_lname: researcher.res_lname,
              res_fname_ar: researcher.res_fname_ar,
              res_lname_ar: researcher.res_lname_ar,
              res_gender: researcher.res_gender,
              res_prof_email: researcher.res_prof_email,
              func_code: researcher.func_code,
              spec_code: researcher.spec_code,
              team_id: researcher.team_id,
              lab_code: researcher.lab_code,
              is_director: researcher.is_director,
              res_attach_struc: researcher.res_attach_struc || "",
              res_birth_date: researcher.res_birth_date || null,
              res_phone: researcher.res_phone || "",
              res_address: researcher.res_address || "",
              res_grade: researcher.res_grade || "",
              res_diploma: researcher.res_diploma || "",
              res_pers_email: researcher.res_pers_email || "",
              res_gs_link: researcher.res_gs_link || "",
              res_rg_link: researcher.res_rg_link || "",
              res_page_link: researcher.res_page_link || "",
              res_orcid: researcher.res_orcid || "",
              res_pub_count: researcher.res_pub_count || 0,
              res_cit_count: researcher.res_cit_count || 0,
            });
          }
        }
      } catch (error: any) {
        navigate("/personnel-management/researchers", {
          state: { errorMessage: "Failed to load data" },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [resCode]);

  const handleEdit = async (values: z.infer<typeof researcherSchema>) => {
    if (!resCode) return;

    try {
      const response = await updateResearcher(
        Number(resCode),
        values.res_fname,
        values.res_lname,
        values.res_fname_ar,
        values.res_lname_ar,
        values.res_gender,
        values.res_prof_email,
        values.func_code,
        values.spec_code,
        values.team_id,
        values.lab_code,
        values.is_director,
        values.res_attach_struc || undefined,
        values.res_birth_date || undefined,
        values.res_phone || undefined,
        values.res_address || undefined,
        values.res_grade || undefined,
        values.res_diploma || undefined,
        values.res_pers_email || undefined,
        values.res_gs_link || undefined,
        values.res_rg_link || undefined,
        values.res_page_link || undefined,
        values.res_orcid || undefined,
        values.res_pub_count,
        values.res_cit_count
      );

      if ("message" in response) {
        navigate('/personnel-management/researchers', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      navigate("/personnel-management/researchers", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("researcher.edit_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("researcher.personal_info")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="res_fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_fname")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_lname")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_fname_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_fname_ar")}</FormLabel>
                    <FormControl>
                      <Input {...field} dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_lname_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_lname_ar")}</FormLabel>
                    <FormControl>
                      <Input {...field} dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_gender")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("researcher.select_gender")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">{t("researcher.male")}</SelectItem>
                          <SelectItem value="Female">{t("researcher.female")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_birth_date")}</FormLabel>
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
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("researcher.contact_info")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="res_prof_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_prof_email")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_pers_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_pers_email")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_address")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("researcher.professional_info")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="team_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.team")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("researcher.select_team")} />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.team_id} value={team.team_id.toString()}>
                              {team.team_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="func_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.function")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("researcher.select_function")} />
                        </SelectTrigger>
                        <SelectContent>
                          {functions.map((func) => (
                            <SelectItem key={func.func_code} value={func.func_code.toString()}>
                              {func.func_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spec_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.speciality")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("researcher.select_speciality")} />
                        </SelectTrigger>
                        <SelectContent>
                          {specialities.map((spec) => (
                            <SelectItem key={spec.spec_code} value={spec.spec_code.toString()}>
                              {spec.spec_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lab_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.laboratory")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className='w-full truncate'>
                          <SelectValue placeholder={t("researcher.select_laboratory")} />
                        </SelectTrigger>
                        <SelectContent>
                          {laboratories.map((lab) => (
                            <SelectItem key={lab.lab_code} value={lab.lab_code.toString()}>
                              {lab.lab_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_attach_struc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_attach_struc")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.is_director")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value !== undefined ? String(field.value) : ""}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("researcher.is_director")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">{t("global.yes")}</SelectItem>
                          <SelectItem value="false">{t("global.no")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("researcher.academic_info")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="res_grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_grade")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_diploma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_diploma")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_pub_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_pub_count")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_cit_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_cit_count")}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        min="0" 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* research profiles */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("researcher.research_profiles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="res_gs_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_gs_link")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_rg_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_rg_link")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_page_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_page_link")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="res_orcid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("researcher.res_orcid")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://orcid.org/0000-0000-0000-0000"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/personnel-management/researchers');
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