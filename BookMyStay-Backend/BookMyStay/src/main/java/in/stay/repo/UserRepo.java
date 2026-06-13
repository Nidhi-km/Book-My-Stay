package in.stay.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.stay.entity.Users;

public interface UserRepo extends JpaRepository<Users, Integer>{
	Users findByEmail(String email);
	
}
