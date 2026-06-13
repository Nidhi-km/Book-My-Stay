package in.stay.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import in.stay.emuns.Status;
import in.stay.entity.Resort;
import in.stay.entity.ResortReview;
import in.stay.entity.Users;
import lombok.Data;
@Data
public class ResortBookDto {
	private Integer bookingId;
	private Status status;
	private LocalDate checkInDate;
	private LocalDate checkOutDate;
	private Long noOfDays;
	private LocalDateTime bookedAt;	
	private Integer numOfPersons;
	private double totalAmount;	
	private ResortReview review;
	private Users user;
	private Resort resort;
	private String guestName;
	private String email;
	private String phone;

}
