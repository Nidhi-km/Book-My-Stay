package in.stay.dto;

import java.time.LocalDateTime;

import in.stay.emuns.Role;
import lombok.Data;
@Data
public class UserDto {
	private int userId;
	
	private String name;
	
	private String email;
	
	private String phoneNumber;
	
	private String password;
	
	private LocalDateTime createdAt;
	
	private Role role;
	
	private String profileImgUrl;
	
	private String profileImgUrlPublicId;

}
