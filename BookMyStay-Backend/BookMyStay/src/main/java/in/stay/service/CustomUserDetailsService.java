package in.stay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import in.stay.entity.Users;
import in.stay.repo.UserRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService 
{
	
	@Autowired
	private UserRepo uRepo;
	

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	   
		Users user = uRepo.findByEmail(username);
		
		if(user==null)
		{
			throw new UsernameNotFoundException("User Not Found");
		}
		
		return new CustomUserDetails(user);
		
	}

}

