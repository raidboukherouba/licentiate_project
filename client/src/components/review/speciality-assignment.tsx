import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { fetchReviewById } from "@/services/reviewService";
import { fetchAllReviewSpecialities } from '@/services/reviewSpecialityService';

import { createHasSpeciality, deleteHasSpeciality } from '@/services/assignReviewSpecialityService';

interface ReviewSpeciality {
  spec_id_review: number;
  spec_name_review: string;
}

export default function SpecialityAssignment() {
  const { reviewNum } = useParams<{ reviewNum: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [review, setReview] = useState<any>(null);
  const [allSpecialities, setAllSpecialities] = useState<ReviewSpeciality[]>([]);
  const [assignedSpecialities, setAssignedSpecialities] = useState<ReviewSpeciality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const reviewData = await fetchReviewById(Number(reviewNum));
        const specialitiesData = await fetchAllReviewSpecialities();
        
        setReview(reviewData.review);
        setAllSpecialities(specialitiesData.reviewSpecialities);
        setAssignedSpecialities(reviewData.review.ReviewSpecialities || []);
      } catch (error) {
        toast.error(t('error.loadingData'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reviewNum]);
  
  const handleAssign = async (specialityId: number) => {
    try {
      const result = await createHasSpeciality(Number(reviewNum), specialityId);
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      const speciality = allSpecialities.find(s => s.spec_id_review === specialityId);
      if (speciality) {
        setAssignedSpecialities([...assignedSpecialities, speciality]);
      }
      toast.success(t('review.specialityAssigned'));
    } catch (error) {
      toast.error(t('error.assignmentFailed'));
    }
  };

  const handleRemove = async (specialityId: number) => {
    try {
      const result = await deleteHasSpeciality(Number(reviewNum), specialityId);
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      setAssignedSpecialities(assignedSpecialities.filter(s => s.spec_id_review !== specialityId));
      toast.success(t('review.specialityRemoved'));
    } catch (error) {
      toast.error(t('error.removalFailed'));
    }
  };

  if (loading) return <div>{t('global.loading')}...</div>;

  return (
    <div className="container mx-auto p-2">
      <div className='flex justify-between gap-2 bg-sidebar p-2 mb-4'>
        <h1>
          <span className='font-semibold'>{t('review.manageSpecialities')}:</span>
          <span className='text-sm'> "{review?.review_title}"</span>
        </h1>

        <Button 
          size="sm"
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-3 w-3" />
          {t('global.back')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-3 pl-2">{t('review.availableSpecialities')}</h2>
          <div className="space-y-2">
            {allSpecialities
              .filter(s => !assignedSpecialities.some(as => as.spec_id_review === s.spec_id_review))
              .map(speciality => (
                <div key={speciality.spec_id_review} className="flex justify-between items-center p-2 border rounded hover:bg-sidebar">
                  <span className='text-sm'>{speciality.spec_name_review}</span>
                  <div 
                    className='cursor-pointer'
                    onClick={() => handleAssign(speciality.spec_id_review)}
                  >
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 pl-2">{t('review.assignedSpecialities')}</h2>
          <div className="space-y-2">
            {assignedSpecialities.length > 0 ? (
              assignedSpecialities.map(speciality => (
                <div key={speciality.spec_id_review} className="flex justify-between items-center p-2 border rounded hover:bg-sidebar">
                  <span className='text-sm'>{speciality.spec_name_review}</span>
                  <div 
                    className='cursor-pointer'
                    onClick={() => handleRemove(speciality.spec_id_review)}
                  >
                    <X className="h-3 w-3" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">{t('review.noSpecialitiesAssigned')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}