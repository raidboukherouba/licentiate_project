import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchReviewById } from '../services/reviewService';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface ReviewSpeciality {
  spec_id_review: number;
  spec_name_review: string;
}

interface Category {
  cat_id: number;
  cat_name: string;
}
export default function ReviewDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reviewNum } = useParams<{ reviewNum: string }>();
  const [review, setReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadReviewDetails = async () => {
      if (!reviewNum) return;

      try {
        const response = await fetchReviewById(Number(reviewNum));
        if ('review' in response) {
          setReview(response.review);
        }
      } catch (error: any) {
        navigate("/publications-management/scientific-reviews", {
          state: { errorMessage: t("error.FailedToLoadReviewDetails") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReviewDetails();
  }, [reviewNum, navigate]);
  
  if (isLoading) {
    return <div>{t("global.loading")}...</div>;
  }

  if (!review) {
    return <div>{t("review.not_found")}</div>;
  }

  return (
    <div className="container bg-sidebar rounded-md mx-auto p-2 mt-4">
      <div>
        <div className="p-2">
          <div className="text-xl font-semibold text-gray-700 dark:text-white text-center">
            {review.review_title} (ID: {review.review_num})
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <strong>ISSN:</strong> {review.issn}
          </div>
          {review.e_issn && (
            <div>
              <strong>E-ISSN:</strong> {review.e_issn}
            </div>
          )}
          {review.review_vol && (
            <div>
              <strong>{t("review.review_vol")}:</strong> {review.review_vol}
            </div>
          )}
          <div>
            <strong>Categories:</strong>
            {review.Categories && review.Categories.length > 0 ? (
              <ul>
                {review.Categories.map((Category: Category) => (
                  <li key={Category.cat_id}>- {Category.cat_name}</li>
                ))}
              </ul>
            ) : (
              <span>No categories assigned</span>
            )}
          </div>
          <div>
            <strong>Specialities:</strong>
            {review.ReviewSpecialities && review.ReviewSpecialities.length > 0 ? (
              <ul>
                {review.ReviewSpecialities.map((ReviewSpeciality: ReviewSpeciality) => (
                  <li key={ReviewSpeciality.spec_id_review}>- {ReviewSpeciality.spec_name_review}</li>
                ))}
              </ul>
            ) : (
              <span>No specialities assigned</span>
            )}
          </div>
          <div> 
            <strong>{t("review.publisher")}:</strong> {review.publisher.publisher_name || "N/A"}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate('/publications-management/scientific-reviews')}
        >
          <ArrowLeft className="w-4 h-4"/>
          {t("global.back")}
        </Button>
      </div>
    </div>
  );
}