package in.stay.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserSigninRequest {
	@NotBlank
	private String email;
	@NotBlank
	private String password;
}
