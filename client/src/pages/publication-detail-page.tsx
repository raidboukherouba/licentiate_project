import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPublicationById } from '../services/publicationService';
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

interface Review {
  review_num: number;
  review_title: string;
}

export default function PublicationDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { doi } = useParams<{ doi: string }>();
  const [publication, setPublication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPublicationDetails = async () => {
      if (!doi) return;

      try {
        const decodedDoi = decodeURIComponent(doi); // ✅ Decode the DOI
        const response = await fetchPublicationById(decodedDoi);
        if ('publication' in response) {
          setPublication(response.publication);
        }
      } catch (error: any) {
        navigate("/research-productions/publications", {
          state: { errorMessage: t("error.FailedToLoadPublicationDetails") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicationDetails();
  }, [doi, navigate]);
  
  if (isLoading) {
    return <div>{t("global.loading")}...</div>;
  }

  if (!publication) {
    return <div>{t("publication.not_found")}</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container bg-sidebar rounded-md mx-auto p-2 mt-4">
      <div>
        <div className="p-2">
          <div className="text-xl font-semibold text-gray-700 dark:text-white text-center">
            {publication.article_title}
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <strong>{t("publication.submission_date")}:</strong> {formatDate(publication.submission_date)}
          </div>
          <div>
            <strong>{t("publication.acceptance_date")}:</strong> {formatDate(publication.acceptance_date)}
          </div>
          {publication.pub_pages && (
            <div>
              <strong>{t("publication.pub_pages")}:</strong> {publication.pub_pages}
            </div>
          )}
          {publication.review?.review_title && (
            <div>
              <strong>{t("publication.review")}:</strong> {publication.review.review_title}
            </div>
          )}
          <div>
            <strong>{t("publication.type")}:</strong> {publication.production_type?.type_name || "N/A"}
          </div>
          <div>
            <strong>{t("laboratory.title")}:</strong> {publication.Researchers?.[0]?.laboratory?.lab_name || "N/A"}
          </div>
          <div>
            <strong>{t("researcher.plural")}:</strong>
            {publication.Researchers && publication.Researchers.length > 0 ? (
              <ul>
                {publication.Researchers.map((researcher: Researcher) => (
                  <li key={researcher.res_code}>- {researcher.res_fname} {researcher.res_lname} ({researcher.res_prof_email})</li>
                ))}
              </ul>
            ) : (
              <span>{t("publication.noResearchersAssigned")}</span>
            )}
          </div>
          <div>
            <strong>{t("doctoralStudent.plural")}:</strong>
            {publication.DoctoralStudents && publication.DoctoralStudents.length > 0 ? (
              <ul>
                {publication.DoctoralStudents.map((student: DoctoralStudent) => (
                  <li key={student.reg_num}>- {student.doc_stud_fname} {student.doc_stud_lname} ({student.doc_stud_prof_email}) ({student.reg_num})</li>
                ))}
              </ul>
            ) : (
              <span>{t("publication.noStudentsAssigned")}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate('/research-productions/publications')}
        >
          <ArrowLeft className="w-4 h-4"/>
          {t("global.back")}
        </Button>
      </div>
    </div>
  );
}