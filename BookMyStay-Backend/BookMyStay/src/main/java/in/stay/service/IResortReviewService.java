package in.stay.service;

import java.util.List;

import in.stay.entity.ResortReview;

public interface IResortReviewService {
	public ResortReview createReview(ResortReview review); 
	public void updateReview(ResortReview review);
	public void deleteReview(Integer reviewId);
	public List<ResortReview> getAllReviewsByResort(Integer id);
	public List<ResortReview> getResortReviewByownerId(Integer ownerId);
}
