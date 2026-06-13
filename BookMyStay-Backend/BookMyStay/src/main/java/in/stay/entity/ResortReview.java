package in.stay.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class ResortReview {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer reviewId;
	
	@Column(nullable = false ,length=700000)
	private String review;

	private Integer rating;
	
	@ManyToOne //many review can be given by one user
	@JoinColumn(name="user_id")//who reviewed
	private Users user;
	
	@ManyToOne//many review can given to one resort
	@JoinColumn(name="resort_id")//for which resort reviewed
	private Resort resort;
	
	private LocalDateTime createdAt;
}
