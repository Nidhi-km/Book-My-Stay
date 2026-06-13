package in.stay.dto;

import java.time.LocalDateTime;
import in.stay.entity.Resort;
import in.stay.entity.Users;
import lombok.Data;
@Data
public class ResortReviewDto {
	private Integer reviewId;	
	private String review;
	private Integer rating;
	private Users user;
	private Resort resort;
	private LocalDateTime createdAt;
	
}
