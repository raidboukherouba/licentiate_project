import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSuperviseById } from '@/services/superviseService';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function SuperviseDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resCode, regNum } = useParams<{ resCode: string; regNum: string }>();
  const [supervise, setSupervise] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadSuperviseDetails = async () => {
      if (!resCode || !regNum) return;

      try {
        const response = await fetchSuperviseById(Number(resCode), Number(regNum));
        if ('supervise' in response) {
          setSupervise(response.supervise);
        }
      } catch (error: any) {
        navigate("/personnel-management/supervise", {
          state: { errorMessage: t('supervise.error_loading_details') },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSuperviseDetails();
  }, [resCode, regNum, navigate, t]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div>{t('global.loading')}...</div>
    </div>;
  }

  if (!supervise) {
    return <div className="flex justify-center items-center h-64">
      <div>{t('supervise.not_found')}</div>
    </div>;
  }

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return t('supervise.ongoing');
    return format(new Date(dateString), 'PP');
  };

  return (
    <div className="container bg-sidebar mx-auto p-4 mt-4">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {supervise.super_theme}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('supervise.supervision_details')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Researcher Section */}
          <div className="bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">{t('supervise.researcher')}</h2>
            </div>
            {supervise.Researcher ? (
              <div className="space-y-3">
                <p><strong>{t('global.full_name')}:</strong> {supervise.Researcher.res_fname} {supervise.Researcher.res_lname}</p>
                <p><strong>{t('researcher.res_prof_email')}:</strong> {supervise.Researcher.res_prof_email}</p>
                <p><strong>{t('laboratory.title')}:</strong> {supervise.Researcher.laboratory?.lab_name || 'N/A'}</p>
              </div>
            ) : (
              <p>{t('supervise.researcher_not_found')}</p>
            )}
          </div>

          {/* Student Section */}
          <div className="bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">{t('supervise.doctoral_student')}</h2>
            </div>
            {supervise.DoctoralStudent ? (
              <div className="space-y-3">
                <p><strong>{t('global.full_name')}:</strong> {supervise.DoctoralStudent.doc_stud_fname} {supervise.DoctoralStudent.doc_stud_lname}</p>
                <p><strong>{t('doctoralStudent.doc_stud_prof_email')}:</strong> {supervise.DoctoralStudent.doc_stud_prof_email}</p>
                <p><strong>{t('doctoralStudent.reg_num')}:</strong> {supervise.DoctoralStudent.reg_num}</p>
              </div>
            ) : (
              <p>{t('supervise.student_not_found')}</p>
            )}
          </div>

          {/* Supervision Period */}
          <div className="bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">{t('supervise.supervision_period')}</h2>
            </div>
            <div className="space-y-3">
              <p><strong>{t('supervise.start_date')}:</strong> {formatDate(supervise.super_start_date)}</p>
              <p><strong>{t('supervise.end_date')}:</strong> {formatDate(supervise.super_end_date)}</p>
              <p><strong>{t('supervise.duration')}:</strong> {
                supervise.super_end_date 
                  ? `${Math.ceil((new Date(supervise.super_end_date).getTime() - new Date(supervise.super_start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} ${t('global.months')}`
                  : t('supervise.ongoing')
              }</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-6">
          <Button 
            size="sm"
            variant="outline"
            onClick={() => navigate('/personnel-management/supervise')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("global.back")}
          </Button>
        </div>
      </div>
    </div>
  );
}