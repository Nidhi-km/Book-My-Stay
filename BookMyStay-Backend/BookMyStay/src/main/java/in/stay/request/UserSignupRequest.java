package in.stay.request;

import in.stay.emuns.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserSignupRequest {
	  @NotBlank
	  private String name;
	  @NotBlank
	  private String email;
	  @NotBlank
	  private String phoneNumber;
	  @NotBlank
	  private String password;
	  private Role role;
}
