package in.stay.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import in.stay.entity.ResortReview;

public interface ResortReviewRepo extends JpaRepository<ResortReview, Integer>{
	
	
	//get all resorts belongs to particular resort
	@Query("SELECT r FROM ResortReview r WHERE r.resort.resortId = :id")
	List<ResortReview> getReviewByResort(@Param("id") Integer id);
	
	
	//get all resorts reviews belongs to ownerId given
	@Query("SELECT rr FROM ResortReview rr WHERE rr.resort.user.userId = :ownerId")
	List<ResortReview> getReviewByOwnerId(@Param("ownerId") Integer ownerId);
	
}
