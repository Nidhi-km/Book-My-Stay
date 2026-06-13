package in.stay.service.imple;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.stay.entity.ResortReview;
import in.stay.repo.ResortReviewRepo;
import in.stay.service.IResortReviewService;
@Service
public class ResortReviewImple implements IResortReviewService{
	
	@Autowired
	private ResortReviewRepo reviewRepo;

	@Override
	public ResortReview createReview(ResortReview review) {
		return reviewRepo.save(review);
	}

	@Override
	public void updateReview(ResortReview review) {
		reviewRepo.save(review);	
	}

	@Override
	public void deleteReview(Integer reviewId) {
	   reviewRepo.deleteById(reviewId);	
	}

	@Override
	public List<ResortReview> getAllReviewsByResort(Integer id) {
		return reviewRepo.getReviewByResort(id);
	}

	@Override
	public List<ResortReview> getResortReviewByownerId(Integer ownerId) {
		
		return reviewRepo.getReviewByOwnerId(ownerId);
	}

}
