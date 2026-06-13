package in.stay.dto;

import java.time.LocalDateTime;
import java.util.List;
import in.stay.entity.ResortReview;
import in.stay.entity.Users;
import lombok.Data;
@Data
public class ResortDto {
	private int resortId;
	private String name; 
	private String location;
	private String description;
	private String resortImgUrl;
	private String resortImgUrlPublicId;
	private Users user;
	private LocalDateTime createdDate;
	private Integer amount;
	private List<String> facilities;
	private List<ResortReview> review;
}
