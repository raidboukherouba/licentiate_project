import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { fetchReviewById } from "@/services/reviewService";
import { fetchAllCategories } from '@/services/categoryService';
import { assignReviewCategory, removeReviewCategory } from '@/services/assignCategoryService';

interface Category {
  cat_id: number;
  cat_name: string;
}

export default function CategoryAssignment() {
  const { reviewNum } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [review, setReview] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [assignedCategories, setAssignedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const reviewData = await fetchReviewById(Number(reviewNum));
        const categoriesData = await fetchAllCategories();
        
        setReview(reviewData.review);
        setAllCategories(categoriesData.categories);
        setAssignedCategories(reviewData.review.Categories || []);
      } catch (error) {
        toast.error(t('error.loadingData'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reviewNum]);

  const handleAssign = async (cat_id: number) => {
    try {
      const result = await assignReviewCategory(Number(reviewNum), cat_id);
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      const category = allCategories.find(c => c.cat_id === cat_id);
      if (category) {
        setAssignedCategories([...assignedCategories, category]);
      }
      toast.success(t('review.categoryAssigned'));
    } catch (error) {
      toast.error(t('error.assignmentFailed'));
    }
  };

  const handleRemove = async (cat_id: number) => {
    try {
      const result = await removeReviewCategory(Number(reviewNum), cat_id);
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      setAssignedCategories(assignedCategories.filter(c => c.cat_id !== cat_id));
      toast.success(t('review.categoryRemoved'));
    } catch (error) {
      toast.error(t('error.removalFailed'));
    }
  };

  if (loading) return <div>{t('global.loading')}...</div>;

  return (
    <div className="container mx-auto p-2">
      <div className='flex justify-between gap-2 bg-sidebar p-2 mb-4'>
        <h1>
          <span className='font-semibold'>{t('review.manageCategories')}:</span>
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
          <h2 className="text-lg font-semibold mb-3 pl-2">{t('review.availableCategories')}</h2>
          <div className="space-y-2">
            {allCategories
              .filter(c => !assignedCategories.some(ac => ac.cat_id === c.cat_id))
              .map(category => (
                <div key={category.cat_id} className="flex justify-between items-center p-2 border rounded hover:bg-sidebar">
                  <span className='text-sm'>{category.cat_name}</span>
                  <div 
                    className='cursor-pointer'
                    onClick={() => handleAssign(category.cat_id)}
                  >
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 pl-2">{t('review.assignedCategories')}</h2>
          <div className="space-y-2">
            {assignedCategories.length > 0 ? (
              assignedCategories.map(category => (
                <div key={category.cat_id} className="flex justify-between items-center p-2 border rounded hover:bg-sidebar">
                  <span className='text-sm'>{category.cat_name}</span>
                  <div 
                    className='cursor-pointer'
                    onClick={() => handleRemove(category.cat_id)}
                  >
                    <X className="h-3 w-3" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">{t('review.noCategoriesAssigned')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}