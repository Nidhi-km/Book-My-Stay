package in.stay.service.imple;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.stay.entity.Users;
import in.stay.repo.UserRepo;
import in.stay.service.IuserService;
@Service
public class UserServiceImple implements IuserService{
	
	@Autowired
	private UserRepo urepo;
	
	@Override
	public Users addUser(Users user) {
		Users u=urepo.save(user);
		return u;	
	}

	@Override
	public Users findUser(int id) {
		return urepo.findById(id).get();
	}

	@Override
	public Users update(Users user) {
		return urepo.save(user);
	}
}
