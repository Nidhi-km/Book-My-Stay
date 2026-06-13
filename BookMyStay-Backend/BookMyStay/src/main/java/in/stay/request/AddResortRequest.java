package in.stay.request;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class AddResortRequest {
	@NotBlank
	private String name; 
	@NotBlank
	private String location;
	@NotBlank
	private String description;
	@NotNull
	private Integer amount;
	@NotNull
	private List<String> facilities;
}
