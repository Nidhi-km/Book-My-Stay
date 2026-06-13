package in.stay.entity;

import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import in.stay.emuns.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
@Entity
@Data
public class Users {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userId;
	
	private String name;
	
	@Column(unique = true)
	private String email;
	
	private String phoneNumber;
	
	private String password;
	
	@CreatedDate
	private LocalDateTime createdAt;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	private String profileImgUrl;
	
	private String profileImgUrlPublicId;
}

