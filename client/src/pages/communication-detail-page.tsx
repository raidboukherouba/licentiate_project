import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCommunicationById } from '../services/communicationService';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface Researcher {
  res_code: number;
  res_fname: string;
  res_lname: string;
  res_prof_email: string;
}

interface DoctoralStudent {
  reg_num: number;
  doc_stud_fname: string;
  doc_stud_lname: string;
  doc_stud_prof_email: string;
}

export default function CommunicationDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idComm } = useParams<{ idComm: string }>();
  const [communication, setCommunication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCommunicationDetails = async () => {
      if (!idComm) return;

      try {
        const response = await fetchCommunicationById(Number(idComm));
        if ('communication' in response) {
          setCommunication(response.communication);
        }
      } catch (error: any) {
        navigate("/research-productions/communications", {
          state: { errorMessage: t("error.FailedToLoadCommunicationDetails") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunicationDetails();
  }, [idComm, navigate]);
  
  if (isLoading) {
    return <div>{t("global.loading")}...</div>;
  }

  if (!communication) {
    return <div>{t("communication.not_found")}</div>;
  }

  return (
    <div className="container bg-sidebar rounded-md mx-auto p-2 mt-4">
      <div>
        <div className="p-2">
          <div className="text-xl font-semibold text-gray-700 dark:text-white text-center">
            {communication.title_comm}
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <strong>{t("communication.event_title")}:</strong> {communication.event_title}
          </div>
          <div>
            <strong>{t("communication.year_comm")}:</strong> {communication.year_comm}
          </div>
          {communication.url_comm && (
            <div>
              <strong>{t("communication.url_comm")}:</strong>{' '}
              <a 
                href={communication.url_comm} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {t("global.view_link")}
              </a>
            </div>
          )}
          <div>
            <strong>{t("communication.type")}:</strong> {communication.production_type?.type_name || "N/A"}
          </div>
          <div>
            <strong>{t("laboratory.title")}:</strong> {communication.Researchers[0]?.laboratory?.lab_name || "N/A"}
          </div>
          <div>
            <strong>{t("researcher.plural")}:</strong>
            {communication.Researchers && communication.Researchers.length > 0 ? (
              <ul>
                {communication.Researchers.map((researcher: Researcher) => (
                  <li key={researcher.res_code}>- {researcher.res_fname} {researcher.res_lname} ({researcher.res_prof_email})</li>
                ))}
              </ul>
            ) : (
              <span>{t("communication.noResearchersAssigned")}</span>
            )}
          </div>
          <div>
            <strong>{t("doctoralStudent.plural")}:</strong>
            {communication.DoctoralStudents && communication.DoctoralStudents.length > 0 ? (
              <ul>
                {communication.DoctoralStudents.map((student: DoctoralStudent) => (
                  <li key={student.reg_num}>- {student.doc_stud_fname} {student.doc_stud_lname} ({student.doc_stud_prof_email}) ({student.reg_num})</li>
                ))}
              </ul>
            ) : (
              <span>{t("communication.noStudentsAssigned")}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate('/research-productions/communications')}
        >
          <ArrowLeft className="w-4 h-4"/>
          {t("global.back")}
        </Button>
      </div>
    </div>
  );
}