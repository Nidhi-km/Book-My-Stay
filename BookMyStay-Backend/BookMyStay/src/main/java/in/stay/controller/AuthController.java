package in.stay.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import in.stay.dto.UserDto;
import in.stay.entity.Users;
import in.stay.exception.UserException;
import in.stay.repo.UserRepo;
import in.stay.request.UserSigninRequest;
import in.stay.request.UserSignupRequest;
import in.stay.response.ApiResponse;
import in.stay.service.CustomUserDetails;
import in.stay.service.EmailService;
import in.stay.service.ICloudinaryService;
import in.stay.service.IuserService;
import in.stay.utills.JwtUtil;
import jakarta.validation.Valid;

@RestController
@RequestMapping("stay/auth")
public class AuthController {
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private IuserService uservice;
	
	@Autowired
	private JwtUtil jwtUtil;
 
	@Autowired
	private UserRepo uRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private ICloudinaryService cloudinaryService;
	
	@Autowired
	private EmailService emailService;
	
	@PostMapping("/user/signup")
	ResponseEntity<?> userSignUp(@Valid@RequestBody UserSignupRequest signupRequest,BindingResult bindingResult){
		
		if (bindingResult.hasErrors()) {
			throw new UserException("Invalid User Input", HttpStatus.BAD_REQUEST);
		}
		
		//checking if user already exist or not 
		Users u=uRepo.findByEmail(signupRequest.getEmail());
		//if exist throw exception
		if (u != null) {
			throw new UserException("Email Already Exists", HttpStatus.CONFLICT);
		}
		
		//converting request class to entity using mapper
		Users user=mapper.map(signupRequest,Users.class);
		user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
		user.setCreatedAt(LocalDateTime.now());
		uservice.addUser(user);
		//after user registered sending mail to them
		emailService.sendMail(
			    user.getEmail(),
			    "Welcome to Resort Booking",
			    "Hello " + user.getName() + ",\n\nYour account has been created successfully.\n\nRegards,\nResort Team"
			);

		//creating token
		Map<String, Object> claims = new HashMap<>();
		claims.put("email", user.getEmail());
		claims.put("role", user.getRole());
		claims.put("userId", user.getUserId());
		String token = jwtUtil.generateToken(user.getEmail(), claims);
		
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Account created Successfully");
	    response.put("token", token);
	    response.put("role", user.getRole());
	    
    	return new ResponseEntity<>(response, HttpStatus.OK);
		
	}
	
	@PostMapping("/user/signin")
	ResponseEntity<?> userSignin(@Valid @RequestBody UserSigninRequest signinRequest,BindingResult bindingResult){
		if (bindingResult.hasErrors()) {
			throw new UserException("Invalid User Input", HttpStatus.BAD_REQUEST);
		}
		//checking user is present in DB, if Not Exception
		Users u=uRepo.findByEmail(signinRequest.getEmail());
		if(u==null) {
			throw new UserException("User not found", HttpStatus.NOT_FOUND);
		}
		
		//Matching the row password with encoded password by matches()
		if(!passwordEncoder.matches(signinRequest.getPassword(), u.getPassword())) {
			throw new UserException("Invalid password", HttpStatus.UNAUTHORIZED);
		}
		
		//generating token
		Map<String,Object> climes=new HashMap<>();
		climes.put("userid", u.getUserId());
		climes.put("role", u.getRole());
		String token=jwtUtil.generateToken(u.getEmail(), climes);
		
		
		Map<String,Object> response=new HashMap<>();
		response.put("status", "success");
		response.put("message", "login successfully");
		response.put("token", token);
		response.put("user", u);
		return new ResponseEntity<>(response,HttpStatus.OK);	
	}
	
	
	//if user forgot the password we hv to send link to login not password
//	@PostMapping("/user/forgotPassword/{email}")
//	ResponseEntity<?> forgotPassword(@PathVariable String email){
//		
//		Users u=uRepo.findByEmail(email);
//		if(u==null) {
//			throw new UserException("User not found", HttpStatus.NOT_FOUND);
//		}
//		System.out.println(u);
//		//i want to send password resent link to user email and call update()
//		Map<String,Object> response=new HashMap<>();
//		response.put("status", "success");
//		response.put("message", "user found");	
//		response.put("Role", u.getRole());
//		response.put("Password",u.getPassword());;
//		return new ResponseEntity<>(response,HttpStatus.OK);	
//	}
	
	//user profile data -> display to user in my profile/to show resort owner data user side
	@GetMapping("/user/profile/{id}")
	public ResponseEntity<ApiResponse<?>> getUserProfile(
			@PathVariable Integer id)
	{
		//by using id get the user data 
		Users findUser =uservice.findUser(id);
		if(findUser ==null)
		{
			throw new UserException("User not found", HttpStatus.NOT_FOUND);
		}
		//not sending password
		UserDto userDTO=new UserDto();
		userDTO.setUserId(findUser.getUserId());
		userDTO.setName(findUser.getName());
		userDTO.setCreatedAt(findUser.getCreatedAt());
		userDTO.setEmail(findUser.getEmail());
		userDTO.setPhoneNumber(findUser.getPhoneNumber());
		userDTO.setRole(findUser.getRole());
		userDTO.setProfileImgUrl(findUser.getProfileImgUrl());
		userDTO.setProfileImgUrlPublicId(findUser.getProfileImgUrlPublicId());
		return ResponseEntity.ok(new ApiResponse<>("success","Profile Data", userDTO));
		
	}	
	
	//to upload profile img and can update name,phone num
	@PutMapping(value = "/user/update" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
	public ResponseEntity<ApiResponse<?>> updateUserProfile(
	        @AuthenticationPrincipal  CustomUserDetails customUserDetails,
	        @RequestParam(name = "img" ,required = false) MultipartFile imageFile,
	        @RequestParam String name,//user name
	        @RequestParam String phoneNumber,
	        @RequestParam String isChanged,//if ur changing the img then give true
	        @RequestParam(required = true) Integer userId
	) {
		
		if(customUserDetails==null) {
			throw new UserException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
		}
		Users user=uRepo.findById(userId)
				.orElseThrow(()->new UserException("User not found", HttpStatus.NOT_FOUND));
		
	    if (imageFile != null && imageFile.getSize() > 2 * 1024 * 1024) {
	        throw new UserException("Image size must be less than 2MB", HttpStatus.BAD_REQUEST);
	    }
	    
	    //true->if u want to change img
	    if(isChanged.equalsIgnoreCase("true"))
	    {
	    		 //checking if already hv img ->if present delete old img first
	    		 if (user.getProfileImgUrlPublicId() != null) {
		 	        cloudinaryService.deleteFile(user.getProfileImgUrlPublicId());
		 	        user.setProfileImgUrl(null);
		 	        user.setProfileImgUrlPublicId(null);
		 	    }
	    		 
	    		 //uploading img to cloudinary
	    		 if(imageFile != null)
	    		 {
	    			 Map uploadResult = cloudinaryService.uploadFile(imageFile);
	 		        user.setProfileImgUrl((String) uploadResult.get("secure_url"));
	 		        user.setProfileImgUrlPublicId((String) uploadResult.get("public_id"));
	    			 
	    		 }       
	    }
	    //updating name,phoneNum
	    user.setName(name);
	    user.setPhoneNumber(phoneNumber);
	    
	    //at last update everything
	    uservice.update(user);

	    return ResponseEntity.ok(new ApiResponse<>("success", "Profile Updated Successfully", null));
	}
}
