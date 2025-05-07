import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchResearcherById } from '../services/researcherService';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function ResearcherDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resCode } = useParams<{ resCode: string }>();
  const [researcher, setResearcher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadResearcherDetails = async () => {
      if (!resCode) return;

      try {
        const response = await fetchResearcherById(Number(resCode));
        if ('researcher' in response) {
          setResearcher(response.researcher);
        }
      } catch (error: any) {
        navigate("/personnel-management/researchers", {
          state: { errorMessage: "Failed to load researcher details" },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResearcherDetails();
  }, [resCode, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!researcher) {
    return <div className="text-center py-8 text-lg text-muted-foreground">
      {t("researcher.not_found")}
    </div>;
  }

  return (
    <>
      <nav className='flex justify-between gap-2 p-2 mt-2 mb-4'>
        <h1 className="text-lg">{t("researcher.researcher_details")}</h1>
        <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/personnel-management/researchers')}
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
              {researcher.res_fname} {researcher.res_lname}
            </h1>
            {researcher.res_fname_ar && researcher.res_lname_ar && (
              <h1 className="text-lg text-muted-foreground mt-1" dir="rtl">
                {researcher.res_fname_ar} {researcher.res_lname_ar}
              </h1>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary border-b pb-2">
              {t("researcher.personal_info")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem label={t("researcher.res_gender")} value={researcher.res_gender || "N/A"} />
              <DetailItem label={t("researcher.res_birth_date")} value={researcher.res_birth_date ? researcher.res_birth_date.split('T')[0] : "N/A"} />
              <DetailItem label={t("researcher.res_prof_email")} value={researcher.res_prof_email || "N/A"} isEmail />
              <DetailItem label={t("researcher.res_phone")} value={researcher.res_phone || "N/A"} isPhone />
              <DetailItem label={t("researcher.res_pers_email")} value={researcher.res_pers_email || "N/A"} isEmail />
              <DetailItem label={t("researcher.res_address")} value={researcher.res_address || "N/A"} />
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary border-b pb-2">
              {t("researcher.professional_info")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem label={t("researcher.res_attach_struc")} value={researcher.res_attach_struc || "N/A"} />
              <DetailItem label={t("researcher.team")} value={researcher.team?.team_name || "N/A"} />
              <DetailItem label={t("researcher.function")} value={researcher.function?.func_name || "N/A"} />
              <DetailItem label={t("researcher.speciality")} value={researcher.speciality?.spec_name || "N/A"} />
              <DetailItem label={t("researcher.laboratory")} value={researcher.laboratory?.lab_name || "N/A"} />
              <DetailItem 
                label={t("researcher.is_director")} 
                value={researcher.is_director ? t("global.yes") : t("global.no")}
                highlight={researcher.is_director}
              />
              <DetailItem label={t("researcher.res_grade")} value={researcher.res_grade || "N/A"} />
              <DetailItem label={t("researcher.res_diploma")} value={researcher.res_diploma || "N/A"} />
            </div>
          </div>

          {/* Research Metrics Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary border-b pb-2">
              {t("researcher.research_metrics")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricItem 
                label={t("researcher.res_pub_count")} 
                value={researcher.res_pub_count || 0} 
                icon="📝"
              />
              <MetricItem 
                label={t("researcher.res_cit_count")} 
                value={researcher.res_cit_count || 0} 
                icon="🔗"
              />
            </div>
          </div>

          {/* Research Profiles Section */}
          {(researcher.res_gs_link || researcher.res_rg_link || researcher.res_page_link || researcher.res_orcid) && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-primary border-b pb-2">
                {t("researcher.research_profiles")}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {researcher.res_gs_link && (
                  <LinkItem 
                    label={t("researcher.res_gs_link")} 
                    url={researcher.res_gs_link} 
                    icon="🔍"
                  />
                )}
                {researcher.res_rg_link && (
                  <LinkItem 
                    label={t("researcher.res_rg_link")} 
                    url={researcher.res_rg_link} 
                    icon="🧪"
                  />
                )}
                {researcher.res_page_link && (
                  <LinkItem 
                    label={t("researcher.res_page_link")} 
                    url={researcher.res_page_link} 
                    icon="🌐"
                  />
                )}
                {researcher.res_orcid && (
                  <LinkItem 
                    label={t("researcher.res_orcid")} 
                    url={researcher.res_orcid} 
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