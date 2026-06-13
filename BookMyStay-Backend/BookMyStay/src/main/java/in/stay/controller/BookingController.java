package in.stay.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.stay.exception.ResortBookingException;
import in.stay.exception.ResortException;
import in.stay.exception.UserException;
import in.stay.repo.ResortRepo;
import in.stay.repo.UserRepo;
import in.stay.request.ResortBookRequest;
import in.stay.response.ApiResponse;
import in.stay.service.CustomUserDetails;
import in.stay.service.EmailService;
import in.stay.service.IResortBookService;
import in.stay.dto.ResortBookDto;
import in.stay.emuns.Status;
import in.stay.entity.BookResort;
import in.stay.entity.Resort;
import in.stay.entity.Users;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/stay/booking")
public class BookingController {
	@Autowired
	private ResortRepo resortRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private IResortBookService bookService;
	
	@Autowired
	private EmailService emailService;
	
	@PostMapping("/bookResort")
	@PreAuthorize("hasRole('CUSTOMER')")
	ResponseEntity<ApiResponse<?>> BookResort(
	        @AuthenticationPrincipal CustomUserDetails customUserDetails,
	        @Valid @RequestBody ResortBookRequest request,
	        BindingResult bindingResult) {

	    if (bindingResult.hasErrors()) {
	        throw new UserException("Invalid UserInput", HttpStatus.BAD_REQUEST);
	    }

	    if (customUserDetails == null) {
	        throw new UserException("Login First To Book Resort", HttpStatus.BAD_REQUEST);
	    }

	    Resort resort = resortRepo.findById(request.getResortId())
	            .orElseThrow(() -> new ResortException("Resort Not Found", HttpStatus.BAD_REQUEST));

	    Users user = userRepo.findById(request.getUserId())
	            .orElseThrow(() -> new UserException("User Not Found", HttpStatus.BAD_REQUEST));

	    BookResort booked = mapper.map(request, BookResort.class);
	    LocalDate checkIn = request.getCheckInDate();
	    Long days = request.getNoOfDays();
	    
	    //get->checkOut date by using checkIn and NumOfdays
	    LocalDate checkOut = checkIn.plusDays(days);

	    booked.setCheckInDate(checkIn);
	    booked.setCheckOutDate(checkOut);
	    booked.setNoOfDays(days);
	    booked.setBookedAt(LocalDateTime.now());
	    booked.setResort(resort);//which resort booked
	    booked.setUser(user);//who booked

	   
	    //calculate total amount
	    long totalAmount =(long) resort.getAmount() *request.getNumOfPersons() *request.getNoOfDays();

	    booked.setTotalAmount(totalAmount);
	    booked.setStatus(Status.BOOKED);//by default BOOKED
	    bookService.createOrder(booked);

	  
	    try {
	    	emailService.sendMail(
	    		    request.getEmail(),
	    		    "Resort Booking Confirmed",
	    		    "Hi " + user.getName() +
	    		    "\n\nYour booking at " + resort.getName() +
	    		    " is confirmed from " + checkIn +
	    		    " to " + checkOut +
	    		    "\nTotal Amount: ₹" + totalAmount +
	    		    "\n\nPlease note: Checkout time is 10:00 AM on your checkout day." +
	    		    "\n\nThank you!"
	    		);

	    } catch (Exception e) {
	        System.out.println("Mail not sent");
	    }

	    return ResponseEntity.ok(new ApiResponse<>("success", "Resort Booked Successfully", booked)
	    );
	}

	
	//get booking data of each user
	@GetMapping("/mybookings")
	@PreAuthorize("hasRole('CUSTOMER')")
	ResponseEntity<ApiResponse<?>> getMyBookkings(@AuthenticationPrincipal CustomUserDetails customUserDetails){
		if(customUserDetails==null) {
			throw new UserException("Login First To get Your Booking data", HttpStatus.BAD_REQUEST);
		}
		//if logined user data is present in CustomerUserDetails so getting user data
		Users user=customUserDetails.getUser();
		List<BookResort> bookings=bookService.getMyBooking(user);
		
		List<ResortBookDto> bookingDtos=bookings.stream().
				map(resort->mapper.map(resort, ResortBookDto.class)).toList();
		return ResponseEntity.ok(new ApiResponse<>("success", "Your Booking Data", bookingDtos));
	}
	
	//cancel the booking by both user resort owner
	@PutMapping("/cancel/{bookingId}")
	ResponseEntity<ApiResponse<?>> cancelBooking(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer bookingId){
		if(customUserDetails==null) {
			throw new UserException("Login First cancel booking", HttpStatus.BAD_REQUEST);
		}
		BookResort bookedresort=bookService.getBookingById(bookingId);
	
		//if already cancelled or completed we can't cancel again
		if(bookedresort.getStatus()==Status.CANCELLED) {
			throw new ResortBookingException("Booking already canceled", HttpStatus.CONFLICT);
		}
		if(bookedresort.getStatus()==Status.COMPLETED) {
			throw new ResortBookingException("Stay Completed cant cancel now", HttpStatus.CONFLICT);
		}
		if(resortRepo.findById(bookedresort.getResort().getResortId()) == null) {
			throw new ResortException("Resort Not Found", HttpStatus.NOT_FOUND);
		}
        bookService.cancelBooking(bookingId);	
        
        //after cancel send mail to user
        String subject = "Resort Booking Cancelled";
        String text = "Hi " + bookedresort.getUser().getName() + ",\n\n" +
                      "Your booking for " + bookedresort.getResort().getName() + " has been cancelled successfully.";
        emailService.sendMail(bookedresort.getEmail(), subject, text);	
		return ResponseEntity.ok(new ApiResponse<>("sucess", "Booking cancelled", null));
	}
	
	
	//to get booking data in resort-owner page
	@GetMapping("/getBookedInfo")
	@PreAuthorize("hasRole('RESORT_OWNER')")
	ResponseEntity<ApiResponse<?>> getBookedResorts(@AuthenticationPrincipal CustomUserDetails customUserDetails){
		if(customUserDetails==null) {
			throw new UserException("Login First to get booking data", HttpStatus.BAD_REQUEST);
		}
		Users user=customUserDetails.getUser();
	    List<BookResort> bookedData=bookService.getAdminBookings(user.getUserId());
		
		List<ResortBookDto> bookingDtos=bookedData.stream().
				map(resort->mapper.map(resort, ResortBookDto.class)).toList();
		
		return ResponseEntity.ok(new ApiResponse<>("Sucess", "Booking data fetched", bookingDtos));
	}
	
	
	
	//change to completed after user checkout 
	@PutMapping("/staycompleted/{bookingId}")
	@PreAuthorize("hasRole('RESORT_OWNER')")
	ResponseEntity<ApiResponse<?>> markCompleted(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer bookingId){
		if(customUserDetails==null) {
			throw new UserException("Login First to make changes", HttpStatus.BAD_REQUEST);
		}
		BookResort bookedResort=bookService.getBookingById(bookingId);
		if(bookedResort.getResort().getUser().getUserId()!=customUserDetails.getUser().getUserId()) {
			throw new UserException("You can only make change your resorts", HttpStatus.BAD_REQUEST);
		}
		//if booking cancelled or completed we can't male complete again
		if(bookedResort.getStatus()==Status.CANCELLED) {
			throw new UserException("already Booking canceled You cant change to Completed", HttpStatus.NOT_FOUND);
		}
		if(bookedResort.getStatus()==Status.COMPLETED) {
			throw new UserException("Stay Completed already", HttpStatus.BAD_REQUEST);
		}
	    bookService.stayCompleted(bookingId);
	    
	    //after completed send mail to give review
	    String subject = "Stay Completed";
	    String text = "Hi " + bookedResort.getUser().getName() + ",\n\n" +
	                  "Your stay at " + bookedResort.getResort().getName() + " has been completed.\n" +
	                  "Please share your experience by giving a review.\n\nThank you!";
	    emailService.sendMail(bookedResort.getUser().getEmail(), subject, text);
		return ResponseEntity.ok(new ApiResponse<>("Sucess","Stay Marked as Completed", null));
	}
	
	

}
