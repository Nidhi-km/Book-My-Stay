package in.stay.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.stay.dto.ResortReviewDto;
import in.stay.entity.BookResort;
import in.stay.entity.Resort;
import in.stay.entity.ResortReview;
import in.stay.exception.ResortException;
import in.stay.exception.UserException;
import in.stay.repo.BookResortRepo;
import in.stay.repo.ResortRepo;
import in.stay.repo.ResortReviewRepo;
import in.stay.repo.UserRepo;
import in.stay.request.AddReviewRequest;
import in.stay.response.ApiResponse;
import in.stay.service.CustomUserDetails;
import in.stay.service.IResortReviewService;
import in.stay.service.IresortService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("stay/review")
public class ReviewController {
	
	@Autowired
	private IResortReviewService reviewService;
	
	@Autowired
	private IresortService resortService;
	
	@Autowired
	private ResortRepo resortRepo;
	
	@Autowired
	private ResortReviewRepo reviewRepo;
	
	
	@Autowired
	private BookResortRepo bookingRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private ModelMapper mapper;

	//add review
	@PostMapping("/add")
	@PreAuthorize("hasRole('CUSTOMER')")
	ResponseEntity<ApiResponse<?>> addReview(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@Valid @RequestBody AddReviewRequest reviewrequest,BindingResult bindingResult){
		
		if(bindingResult.hasErrors()) {
			throw new UserException("invalid user input", HttpStatus.BAD_REQUEST);
		}
		if(customUserDetails==null) {
			throw new UserException("Login First to Review", HttpStatus.UNAUTHORIZED);
		}
		
		if(customUserDetails.getUser().getUserId()!=reviewrequest.getUserId()) {
			throw new UserException("You can only give review from your account", HttpStatus.BAD_REQUEST);
		}
		Resort resort=resortService.findById(reviewrequest.getResortId());//for this resort we r reviewing
		
		if(resort==null) {
			throw new ResortException("Resort not found", HttpStatus.NOT_FOUND);
		}
		
		ResortReview resortReview=new ResortReview();
		resortReview.setRating(reviewrequest.getRating());
		resortReview.setReview(reviewrequest.getReview());
		resortReview.setResort(resortRepo.findById(reviewrequest.getResortId()).get());
		resortReview.setUser(userRepo.findById(reviewrequest.getUserId()).get());
		resortReview.setCreatedAt(LocalDateTime.now());
		
		ResortReview res=reviewService.createReview(resortReview);
		//after review added now i need to update booking table because as of now review is null there
		int bookingId=reviewrequest.getBookingId();
        BookResort bookedResort=bookingRepo.findById(bookingId).get();
        if(bookedResort!=null) {
        	bookedResort.setReview(res);
        }
        bookingRepo.save(bookedResort);

		return ResponseEntity.ok(new ApiResponse<>("success", "review added", res));
	}
	
	
	//edit review
	@PutMapping("/edit/{reviewId}")
	@PreAuthorize("hasRole('CUSTOMER')")
	ResponseEntity<ApiResponse<?>> editReview(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@Valid @RequestBody AddReviewRequest editRequest,
			@PathVariable Integer reviewId,
			BindingResult bindingResult){	
		if(bindingResult.hasErrors()) {
			throw new UserException("incorrect input", HttpStatus.BAD_REQUEST);
		}
		if(customUserDetails==null) {
			throw new UserException("Unauthorized", HttpStatus.UNAUTHORIZED);
		}
		if(customUserDetails.getUser().getUserId()!=editRequest.getUserId()) {
			throw new UserException("you can only change your review", HttpStatus.BAD_REQUEST);
		}
		ResortReview resortReview=reviewRepo.findById(reviewId).get();
		
		if(resortReview==null) {
			throw new ResortException("Review not found", HttpStatus.NOT_FOUND);
		}
		Resort resort=resortRepo.findById(editRequest.getResortId()).get();
		if(resort==null) {
			throw new ResortException("Resort Not Found", HttpStatus.NOT_FOUND);
		}
		
		resortReview.setRating(editRequest.getRating());
		resortReview.setReview(editRequest.getReview());
		resortReview.setResort(resort);
		resortReview.setUser(userRepo.findById(editRequest.getUserId()).get());
		resortReview.setCreatedAt(LocalDateTime.now());
		
		reviewService.updateReview(resortReview);
		return ResponseEntity.ok(new ApiResponse<>("success", "Review Updated", null));
		
	}
	
	
	@GetMapping("/getReview/{reviewId}")
	@PreAuthorize("hasRole('CUSTOMER')")
	ResponseEntity<ApiResponse<?>> getReviewById(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer reviewId)
	{
		if(customUserDetails==null) {
			throw new UserException("Unauthorized", HttpStatus.UNAUTHORIZED);
		}
		ResortReview review =reviewRepo.findById(reviewId).get();
		if(review==null) {
			throw new ResortException("review not found", HttpStatus.NOT_FOUND);
		}
		
		
		return ResponseEntity.ok(new ApiResponse<>("sucess", "review found", review));
	}
	
	@DeleteMapping("/deleteReview/{reviewId}")
	@PreAuthorize("hasRole('CUSTOMER')")
	ResponseEntity<ApiResponse<?>> deleteReview(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer reviewId){
		if(customUserDetails==null) {
			throw new UserException("Unauthorized", HttpStatus.UNAUTHORIZED);
		}
		
		ResortReview review=reviewRepo.findById(reviewId).get();
		if(review==null) {
			throw new ResortException("Review not found to delete", HttpStatus.NOT_FOUND);
		}
		
		//getting resort info which user wants to delete review from
		Resort resort= resortRepo.findById(review.getResort().getResortId()).get();
		
		if(resort==null) {
			throw new ResortException("resort not found", HttpStatus.NOT_FOUND);
		}
		reviewService.deleteReview(reviewId);
	return  ResponseEntity.ok(new ApiResponse<>("success", "review deleted", null));
   }
	
	@GetMapping("/owner/getreviews/{ownerId}")
	@PreAuthorize("hasRole('RESORT_OWNER')")
	ResponseEntity<ApiResponse<?>> getResortReviewByownerId(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer ownerId){
		if(customUserDetails==null) {
			throw new UserException("login to get reviews", HttpStatus.UNAUTHORIZED);
		}
		userRepo.findById(ownerId)
				.orElseThrow(()->new UserException("User not found", HttpStatus.NOT_FOUND));
		
		if(customUserDetails.getUser().getUserId()!=ownerId) {
			throw new UserException("you can only get your resort reviews", HttpStatus.BAD_REQUEST);
		}
		List<ResortReview> resortreviews=reviewService.getResortReviewByownerId(ownerId);
		
		if(resortreviews==null) {
			throw new ResortException("No review for your resorts", HttpStatus.NOT_FOUND);
		}
		List<ResortReviewDto> reviewsDtos=resortreviews.stream()
				.map(review->mapper.map(review, ResortReviewDto.class)).toList();
		return ResponseEntity.ok(new ApiResponse<>("success", "resort reviews", reviewsDtos));
	}
}