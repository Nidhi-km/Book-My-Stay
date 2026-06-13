package in.stay.service.imple;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.stay.emuns.Status;
import in.stay.entity.BookResort;
import in.stay.entity.Users;
import in.stay.repo.BookResortRepo;
import in.stay.service.IResortBookService;
@Service
public class BookResortServiceImple implements IResortBookService{
	
	@Autowired
	private BookResortRepo bookingRepo;

	@Override
	public BookResort createOrder(BookResort r) {	
		return bookingRepo.save(r);
	}

	@Override
	public List<BookResort> getMyBooking(Users user) {
		return bookingRepo.findByUser(user);
	}


	@Override
	public BookResort getBookingById(Integer BookingId) {
		return bookingRepo.findById(BookingId).get();
	}

	@Override
	public void cancelBooking(Integer BookingId) {
		bookingRepo.ChangeBookingstatus(BookingId, Status.CANCELLED);
		
	}

	@Override
	public List<BookResort> getAdminBookings(Integer adminId) {	
		return bookingRepo.getAdminBookings(adminId);
	}

	@Override
	public void stayCompleted(Integer BookingId) {
		bookingRepo.ChangeBookingstatus(BookingId, Status.COMPLETED);	
	}

}
