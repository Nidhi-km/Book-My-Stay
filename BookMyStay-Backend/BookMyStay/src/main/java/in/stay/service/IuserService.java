package in.stay.service;

import in.stay.entity.Users;

public interface IuserService {
	public Users addUser(Users user);	
	public Users findUser(int id);
	public Users update(Users user);
	
}
