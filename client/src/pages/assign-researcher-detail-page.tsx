import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAssignResearcherById } from '@/services/assignResearcherService';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Box } from 'lucide-react';
import { format } from 'date-fns';

export default function AssignResearcherDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resCode, inventoryNum } = useParams<{ resCode: string; inventoryNum: string }>();
  const [assignment, setAssignment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadAssignmentDetails = async () => {
      if (!resCode || !inventoryNum) return;

      try {
        const response = await fetchAssignResearcherById(Number(resCode), inventoryNum);
        if ('assignment' in response) {
          setAssignment(response.assignment);
        }
      } catch (error: any) {
        navigate("/equipment-management/assign-researcher", {
          state: { errorMessage: t('assignResearcher.error_loading_details') },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignmentDetails();
  }, [resCode, inventoryNum, navigate, t]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div>{t('global.loading')}...</div>
    </div>;
  }

  if (!assignment) {
    return <div className="flex justify-center items-center h-64">
      <div>{t('assignResearcher.not_found')}</div>
    </div>;
  }

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return t('assignResearcher.not_returned');
    return format(new Date(dateString), 'PP');
  };

  // Calculate duration in months
  const calculateDuration = () => {
    if (!assignment.res_assign_date) return 'N/A';
    const endDate = assignment.res_return_date ? new Date(assignment.res_return_date) : new Date();
    const startDate = new Date(assignment.res_assign_date);
    const months = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return `${months} ${t('global.months')}`;
  };

  return (
    <div className="container bg-sidebar mx-auto p-4 mt-4">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {assignment.Equipment?.equip_name || t('assignResearcher.equipment_assignment')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('assignResearcher.assignment_details')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Researcher Section */}
          <div className="bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">{t('assignResearcher.researcher')}</h2>
            </div>
            {assignment.Researcher ? (
              <div className="space-y-3">
                <p><strong>{t('global.full_name')}:</strong> {assignment.Researcher.res_fname} {assignment.Researcher.res_lname}</p>
                <p><strong>{t('researcher.res_prof_email')}:</strong> {assignment.Researcher.res_prof_email}</p>
                <p><strong>{t('laboratory.title')}:</strong> {assignment.Researcher.laboratory?.lab_name || 'N/A'}</p>
              </div>
            ) : (
              <p>{t('assignResearcher.researcher_not_found')}</p>
            )}
          </div>

          {/* Equipment Section */}
          <div className="bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <Box className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">{t('equipment.title')}</h2>
            </div>
            {assignment.Equipment ? (
              <div className="space-y-3">
                <p><strong>{t('equipment.equip_name')}:</strong> {assignment.Equipment.equip_name}</p>
                <p><strong>{t('equipment.inventory_num')}:</strong> {assignment.Equipment.inventory_num}</p>
                <p><strong>{t('assignResearcher.assignment_status')}:</strong> 
                  {assignment.res_return_date 
                    ? t('assignResearcher.returned') 
                    : t('assignResearcher.currently_assigned')}
                </p>
              </div>
            ) : (
              <p>{t('assignResearcher.equipment_not_found')}</p>
            )}
          </div>

          {/* Assignment Period */}
          <div className="bg-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium">{t('assignResearcher.assignment_period')}</h2>
            </div>
            <div className="space-y-3">
              <p><strong>{t('assignResearcher.assign_date')}:</strong> {formatDate(assignment.res_assign_date)}</p>
              <p><strong>{t('assignResearcher.return_date')}:</strong> {formatDate(assignment.res_return_date)}</p>
              <p><strong>{t('assignResearcher.duration')}:</strong> {calculateDuration()}</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-6">
          <Button 
            size="sm"
            variant="outline"
            onClick={() => navigate('/equipment-management/assign-researcher')}
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