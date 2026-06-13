package in.stay.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
@Entity
@Data
public class Resort {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int resortId;
	
	private String name; 
	private String location;
	private String description;
	
	private String resortImgUrl;
	private String resortImgUrlPublicId;
	
	@ManyToOne//many Resorts can belongs to one RESORT_OWNER
	@JoinColumn(name="owner_id")
	private Users user;
	
	@CreatedDate
	private LocalDateTime createdDate;
	
	private Integer amount;
	
	private List<String> facilities;
	
	@JsonIgnore
	@OneToMany(mappedBy = "resort")//one resort can hv many reviews
	private List<ResortReview> review;
	
}
