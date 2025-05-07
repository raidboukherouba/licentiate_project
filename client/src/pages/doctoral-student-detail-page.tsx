import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDoctoralStudentById } from '../services/doctoralStudentService';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function DoctoralStudentDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { regNum } = useParams<{ regNum: string }>();
  const [doctoralStudent, setDoctoralStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDoctoralStudentDetails = async () => {
      if (!regNum) return;

      try {
        const response = await fetchDoctoralStudentById(Number(regNum));
        if ('doctoralStudent' in response) {
          setDoctoralStudent(response.doctoralStudent);
        }
      } catch (error: any) {
        navigate("/personnel-management/doctoral-students", {
          state: { errorMessage: "Failed to load doctoral student details" },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctoralStudentDetails();
  }, [regNum, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!doctoralStudent) {
    return <div className="text-center py-8 text-lg text-muted-foreground">
      {t("doctoralStudent.not_found")}
    </div>;
  }

  return (
    <>
      <nav className='flex justify-between gap-2 p-2 mt-2 mb-4'>
        <h1 className="text-lg">{t("doctoralStudent.doctoral_student_details")}</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/personnel-management/doctoral-students')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4"/>
          {t("global.back")}
        </Button>
      </nav>

      <div className="container bg-sidebar mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">
              {doctoralStudent.doc_stud_fname} {doctoralStudent.doc_stud_lname}
            </h1>
            {doctoralStudent.doc_stud_fname_ar && doctoralStudent.doc_stud_lname_ar && (
              <h1 className="text-lg text-muted-foreground mt-1" dir="rtl">
                {doctoralStudent.doc_stud_fname_ar} {doctoralStudent.doc_stud_lname_ar}
              </h1>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary border-b pb-2">
              {t("doctoralStudent.personal_info")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem label={t("doctoralStudent.doc_stud_gender")} value={doctoralStudent.doc_stud_gender || "N/A"} />
              <DetailItem label={t("doctoralStudent.doc_stud_birth_date")} value={doctoralStudent.doc_stud_birth_date ? doctoralStudent.doc_stud_birth_date.split('T')[0] : "N/A"} />
              <DetailItem label={t("doctoralStudent.doc_stud_prof_email")} value={doctoralStudent.doc_stud_prof_email || "N/A"} isEmail />
              <DetailItem label={t("doctoralStudent.doc_stud_phone")} value={doctoralStudent.doc_stud_phone || "N/A"} isPhone />
              <DetailItem label={t("doctoralStudent.doc_stud_pers_email")} value={doctoralStudent.doc_stud_pers_email || "N/A"} isEmail />
              <DetailItem label={t("doctoralStudent.doc_stud_address")} value={doctoralStudent.doc_stud_address || "N/A"} />
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary border-b pb-2">
              {t("doctoralStudent.academic_info")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem label={t("doctoralStudent.doc_stud_attach_struc")} value={doctoralStudent.doc_stud_attach_struc || "N/A"} />
              <DetailItem label={t("doctoralStudent.team")} value={doctoralStudent.team?.team_name || "N/A"} />
              <DetailItem label={t("doctoralStudent.function")} value={doctoralStudent.function?.func_name || "N/A"} />
              <DetailItem label={t("doctoralStudent.speciality")} value={doctoralStudent.speciality?.spec_name || "N/A"} />
              <DetailItem label={t("doctoralStudent.laboratory")} value={doctoralStudent.laboratory?.lab_name || "N/A"} />
              <DetailItem label={t("doctoralStudent.doc_stud_grade")} value={doctoralStudent.doc_stud_grade || "N/A"} />
              <DetailItem label={t("doctoralStudent.doc_stud_diploma")} value={doctoralStudent.doc_stud_diploma || "N/A"} />
            </div>
          </div>

          {/* Research Metrics Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary border-b pb-2">
              {t("doctoralStudent.research_metrics")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricItem 
                label={t("doctoralStudent.doc_stud_pub_count")} 
                value={doctoralStudent.doc_stud_pub_count || 0} 
                icon="📝"
              />
              <MetricItem 
                label={t("doctoralStudent.doc_stud_cit_count")} 
                value={doctoralStudent.doc_stud_cit_count || 0} 
                icon="🔗"
              />
            </div>
          </div>

          {/* Research Profiles Section */}
          {(doctoralStudent.doc_stud_gs_link || doctoralStudent.doc_stud_rg_link || doctoralStudent.doc_stud_page_link || doctoralStudent.doc_stud_orcid) && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-primary border-b pb-2">
                {t("doctoralStudent.research_profiles")}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {doctoralStudent.doc_stud_gs_link && (
                  <LinkItem 
                    label={t("doctoralStudent.doc_stud_gs_link")} 
                    url={doctoralStudent.doc_stud_gs_link} 
                    icon="🔍"
                  />
                )}
                {doctoralStudent.doc_stud_rg_link && (
                  <LinkItem 
                    label={t("doctoralStudent.doc_stud_rg_link")} 
                    url={doctoralStudent.doc_stud_rg_link} 
                    icon="🧪"
                  />
                )}
                {doctoralStudent.doc_stud_page_link && (
                  <LinkItem 
                    label={t("doctoralStudent.doc_stud_page_link")} 
                    url={doctoralStudent.doc_stud_page_link} 
                    icon="🌐"
                  />
                )}
                {doctoralStudent.doc_stud_orcid && (
                  <LinkItem 
                    label={t("doctoralStudent.doc_stud_orcid")} 
                    url={doctoralStudent.doc_stud_orcid} 
                    icon="🆔"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Reusable Detail Item Component
function DetailItem({ label, value, isEmail = false, isPhone = false, highlight = false }: { 
  label: string; 
  value: string; 
  isEmail?: boolean;
  isPhone?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={`text-base ${highlight ? 'font-bold text-primary' : 'text-foreground'}`}>
        {isEmail ? (
          <a href={`mailto:${value}`} className="hover:underline">{value}</a>
        ) : isPhone ? (
          <a href={`tel:${value}`} className="hover:underline">{value}</a>
        ) : value}
      </p>
    </div>
  );
}

// Reusable Metric Item Component
function MetricItem({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg border">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  );
}

// Reusable Link Item Component
function LinkItem({ label, url, icon }: { label: string; url: string; icon: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg border hover:bg-muted/80 transition-colors">
      <span className="text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline truncate block"
        >
          {url}
        </a>
      </div>
    </div>
  );
}