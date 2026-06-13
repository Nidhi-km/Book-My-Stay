package in.stay.service;

import java.util.List;
import in.stay.entity.BookResort;
import in.stay.entity.ResortReview;
import in.stay.entity.Users;

public interface IResortBookService {
	public BookResort createOrder(BookResort r);
	public List<BookResort> getMyBooking(Users user);
	public BookResort getBookingById(Integer BookingId);
	public void cancelBooking(Integer BookingId);
	public List<BookResort> getAdminBookings(Integer adminId);
	public void stayCompleted(Integer BookingId);
	//public void addreview(ResortReview review);
	
}
