package in.stay.request;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddOfferRequest {
	@NotNull
	private Integer resortId;
	@NotBlank
    private String title;
	@NotBlank
    private String description;
	@NotNull
    private Double discountPercentage;
	@NotNull
    private LocalDate startDate;
	@NotNull
    private LocalDate endDate;

}
