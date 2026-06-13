package in.stay.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddReviewRequest {
	@NotNull
	private Integer userId;
	
	@NotNull
	private Integer resortId;
	
	@NotBlank
	private String review;
	
	@NotNull
	@Min(1)
	@Max(5)
	private Integer rating;
	
	@NotNull
	private Integer bookingId;
    
}
