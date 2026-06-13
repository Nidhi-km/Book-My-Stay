package in.stay.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import in.stay.entity.Resort;

public interface ResortRepo extends JpaRepository<Resort, Integer>{
	
	//get resort by name
	Resort findByName(String name);
	
	
	//get all resorts by adminId
	@Query("SELECT r FROM Resort r where r.user.userId=:id")
	List<Resort> getResortsByUserId(int id);
	
	
	//using findBy method
	Page<Resort> findByLocation(String location, Pageable pageable);

	
}
