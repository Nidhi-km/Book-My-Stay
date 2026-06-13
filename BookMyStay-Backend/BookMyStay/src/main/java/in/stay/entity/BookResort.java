package in.stay.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import in.stay.emuns.PaymentMode;
import in.stay.emuns.Status;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
@Data
@Entity
public class BookResort {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer bookingId;
	
	@Enumerated(EnumType.STRING)
	private Status status;
	
	private LocalDate checkInDate;
	private LocalDate checkOutDate;
	private Long noOfDays;
	private LocalDateTime bookedAt;
	
	private Integer numOfPersons;
	private double totalAmount;
	
	@OneToOne
	@JoinColumn(name="reviewId")
	private ResortReview review;//once the status become completed

	@ManyToOne  //many users can book same resort
	@JoinColumn(name="userId")//who booked
	private Users user;
	
	@ManyToOne //many orders for one resort
	@JoinColumn(name="resortId")//which resort booked
	private Resort resort;
	
	private String guestName;
	private String email;
	private String phone;
	@Enumerated(EnumType.STRING)
	private PaymentMode paymentMode;

}
