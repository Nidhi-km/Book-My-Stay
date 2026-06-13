package in.stay.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import in.stay.emuns.Status;
import in.stay.entity.BookResort;
import in.stay.entity.Users;
import jakarta.transaction.Transactional;
import java.util.List;

@Transactional
public interface BookResortRepo extends JpaRepository<BookResort, Integer>{
	
	// Get all bookings made by a specific user.
	List<BookResort> findByUser(Users user);
	
	//updating the status based on i/p(BOOKED,CANCELLED,COMPLETED) by using bookingId
	@Modifying
	@Query("UPDATE BookResort r SET r.status = :status WHERE r.bookingId = :bookingId")
	void ChangeBookingstatus(@Param("bookingId") Integer bookingId,@Param("status") Status status);

	//Get all bookings for resorts owned by a specific admin
	@Query("SELECT b From BookResort b where b.resort.user.userId=:adminId")
	List<BookResort> getAdminBookings(@Param("adminId") Integer adminId);

	

}
