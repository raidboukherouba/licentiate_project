import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctoralStudentSchema } from "../validations/doctoral-student-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from "lucide-react";
import { createDoctoralStudent } from "../services/doctoralStudentService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllTeams } from '../services/teamService';
import { fetchAllFunctions } from '../services/functionService';
import { fetchAllSpecialities } from '../services/specialityService';
import { fetchAllLaboratories } from '../services/laboratoryService';

export default function AddDoctoralStudentPage() {
  // Define Team type
  interface Team {
    team_id: number;
    team_name: string;
  }

  // Define Function type
  interface Function {
    func_code: number;
    func_name: string;
  }

  // Define Speciality type
  interface Speciality {
    spec_code: number;
    spec_name: string;
  }

  // Define Laboratory type
  interface Laboratory {
    lab_code: number;
    lab_name: string;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const teams = await fetchAllTeams();
      const functions = await fetchAllFunctions();
      const specialities = await fetchAllSpecialities();
      const laboratories = await fetchAllLaboratories();
      setTeams(teams.teams);
      setFunctions(functions.functions);
      setSpecialities(specialities.specialities);
      setLaboratories(laboratories.laboratories);
    };

    loadData();
  }, []);

  const form = useForm<z.infer<typeof doctoralStudentSchema>>({
    resolver: zodResolver(doctoralStudentSchema),
    defaultValues: {
      reg_num: 0,
      doc_stud_fname: "",
      doc_stud_lname: "",
      doc_stud_fname_ar: "",
      doc_stud_lname_ar: "",
      doc_stud_gender: undefined,
      doc_stud_prof_email: "",
      func_code: undefined,
      spec_code: undefined,
      team_id: undefined,
      lab_code: undefined,
      doc_stud_attach_struc: "",
      doc_stud_birth_date: null,
      doc_stud_phone: "",
      doc_stud_address: "",
      doc_stud_grade: "",
      doc_stud_diploma: "",
      doc_stud_pers_email: "",
      doc_stud_gs_link: "",
      doc_stud_rg_link: "",
      doc_stud_page_link: "",
      doc_stud_orcid: "",
      doc_stud_pub_count: 0,
      doc_stud_cit_count: 0,
    },
  });

  const handleAdd = async (values: z.infer<typeof doctoralStudentSchema>) => {
    try {
      const response = await createDoctoralStudent(
        values.reg_num,
        values.doc_stud_fname,
        values.doc_stud_lname,
        values.doc_stud_fname_ar,
        values.doc_stud_lname_ar,
        values.doc_stud_gender,
        values.doc_stud_prof_email,
        values.func_code,
        values.spec_code,
        values.team_id,
        values.lab_code,
        values.doc_stud_attach_struc || undefined,
        values.doc_stud_birth_date || undefined,
        values.doc_stud_phone || undefined,
        values.doc_stud_address || undefined,
        values.doc_stud_grade || undefined,
        values.doc_stud_diploma || undefined,
        values.doc_stud_pers_email || undefined,
        values.doc_stud_gs_link || undefined,
        values.doc_stud_rg_link || undefined,
        values.doc_stud_page_link || undefined,
        values.doc_stud_orcid || undefined,
        values.doc_stud_pub_count,
        values.doc_stud_cit_count,
      );

      if ("message" in response) {
        navigate('/personnel-management/doctoral-students', {
          state: { successMessage: response.message }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      navigate("/personnel-management/doctoral-students", {
        state: { errorMessage: errorMessage },
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t("doctoralStudent.add_title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("doctoralStudent.personal_info")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reg_num"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.reg_num")}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_fname")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_lname")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_fname_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_fname_ar")}</FormLabel>
                    <FormControl>
                      <Input {...field} dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_lname_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_lname_ar")}</FormLabel>
                    <FormControl>
                      <Input {...field} dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_gender")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("doctoralStudent.select_gender")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">{t("doctoralStudent.male")}</SelectItem>
                          <SelectItem value="Female">{t("doctoralStudent.female")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_birth_date")}</FormLabel>
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
            <h2 className="text-lg font-semibold text-muted-foreground">{t("doctoralStudent.contact_info")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doc_stud_prof_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_prof_email")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_pers_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_pers_email")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_address")}</FormLabel>
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
            <h2 className="text-lg font-semibold text-muted-foreground">{t("doctoralStudent.professional_info")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="team_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.team")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("doctoralStudent.select_team")} />
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
                    <FormLabel>{t("doctoralStudent.function")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("doctoralStudent.select_function")} />
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
                    <FormLabel>{t("doctoralStudent.speciality")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t("doctoralStudent.select_speciality")} />
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
                    <FormLabel>{t("doctoralStudent.laboratory")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className='w-full truncate'>
                          <SelectValue placeholder={t("doctoralStudent.select_laboratory")} />
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
                name="doc_stud_attach_struc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_attach_struc")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("doctoralStudent.academic_info")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doc_stud_grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_grade")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_diploma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_diploma")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_pub_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_pub_count")}</FormLabel>
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
                name="doc_stud_cit_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_cit_count")}</FormLabel>
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

          {/* Research Profiles */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("doctoralStudent.research_profiles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doc_stud_gs_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_gs_link")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_rg_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_rg_link")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_page_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_page_link")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doc_stud_orcid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("doctoralStudent.doc_stud_orcid")}</FormLabel>
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
            <Button size="sm" variant="outline" onClick={() => navigate('/personnel-management/doctoral-students')}>
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