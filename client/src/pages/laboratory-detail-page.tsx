import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLaboratoryById } from '../services/laboratoryService';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function LaboratoryDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { labCode } = useParams<{ labCode: string }>();
  const [laboratory, setLaboratory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadLaboratoryDetails = async () => {
      if (!labCode) return;

      try {
        const response = await fetchLaboratoryById(Number(labCode));
        if ('laboratory' in response) {
          setLaboratory(response.laboratory);
        }
      } catch (error: any) {
        navigate("/organizational-structure/laboratories", {
          state: { errorMessage: "Failed to load laboratory details" },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLaboratoryDetails();
  }, [labCode, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!laboratory) {
    return <div>Laboratory not found</div>;
  }

  return (
    <div className="container bg-sidebar rounded-md mx-auto p-2 mt-4">
      <div>
        <div className="p-2">
          <div className="text-xl font-semibold text-gray-700 dark:text-white text-center">{laboratory.lab_name}</div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <strong>{t("laboratory.lab_abbr")}:</strong> {laboratory.lab_abbr || "N/A"}
          </div>
          <div>
            <strong>{t("laboratory.lab_desc")}:</strong>
            <p className="text-base">{laboratory.lab_desc || "N/A"}</p>
          </div>
          <div>
            <strong>{t("laboratory.lab_address")}:</strong> {laboratory.lab_address || "N/A"}
          </div>
          <div>
            <strong>{t("laboratory.lab_phone")}:</strong> {laboratory.lab_phone || "N/A"}
          </div>
          <div>
            <strong>{t("faculty.title")}:</strong> {laboratory.faculty.faculty_name || "N/A"}
          </div>
          <div>
            <strong>{t("domain.title")}:</strong> {laboratory.domain.domain_name || "N/A"}
          </div>
          <div>
            <strong>{t("department.title")}:</strong> {laboratory.department.dept_name || "N/A"}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate('/organizational-structure/laboratories')}
        >
          <ArrowLeft className="w-4 h-4"/>
          {t("global.back")}
        </Button>
      </div>
    </div>
  );
}