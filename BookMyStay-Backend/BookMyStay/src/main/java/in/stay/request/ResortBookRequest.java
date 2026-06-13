package in.stay.request;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import in.stay.emuns.PaymentMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class ResortBookRequest {
	@NotNull
	private Long noOfDays;
	@NotNull
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate checkInDate;
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate checkOutDate;
	@NotNull
	private Integer numOfPersons;
	@NotNull
	private Integer resortId;
	@NotNull
	private Integer userId;
	@NotBlank
	private String guestName;
	@NotBlank
	private String email;
	@NotBlank
	private String phone;
	@NotNull
	private PaymentMode paymentMode;


}
