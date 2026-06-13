package in.stay.controller;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import in.stay.dto.ResortDto;
import in.stay.entity.Resort;
import in.stay.exception.ResortException;
import in.stay.exception.UserException;
import in.stay.repo.ResortRepo;
import in.stay.request.AddResortRequest;
import in.stay.response.ApiResponse;
import in.stay.service.CustomUserDetails;
import in.stay.service.ICloudinaryService;
import in.stay.service.IresortService;
import jakarta.validation.Valid;
@RestController
@RequestMapping("stay/resort")
public class ResortController {
	
	@Autowired
	private IresortService rService;
	
	@Autowired
	private ResortRepo rRepo;
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private ICloudinaryService cloudinaryService;
	
	//add resort
	@PostMapping("/add")
	@PreAuthorize("hasRole('RESORT_OWNER')")
	ResponseEntity<?> createResort(@AuthenticationPrincipal CustomUserDetails userDetails,
			@Valid @RequestBody AddResortRequest resort,
			BindingResult bindingResult){
		if (bindingResult.hasErrors()) {
			throw new UserException("Invalid resort Input", HttpStatus.BAD_REQUEST);
		}
		if(userDetails==null) {
			throw new UserException("Login first", HttpStatus.NOT_FOUND);
		}
		Resort r=rRepo.findByName(resort.getName());
		//if we hv resort with same name ->exception
		if(r!=null) {
			throw new UserException("Resort name Already Exists", HttpStatus.CONFLICT);
		}
		
		Resort resortEntity=mapper.map(resort, Resort.class);
		resortEntity.setCreatedDate(LocalDateTime.now());
		resortEntity.setUser(userDetails.getUser());
		
		Resort result=rService.createResort(resortEntity);
		
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Resort added Successfully");
		response.put("resort", result);
		return new ResponseEntity<>(response, HttpStatus.OK);	
		
	}
	

	//to upload resort imgs 
	@PutMapping(value = "/upload/{resortId}" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
	@PreAuthorize("hasRole('RESORT_OWNER')")
	public ResponseEntity<ApiResponse<?>> updateResort(
	        @AuthenticationPrincipal CustomUserDetails customUserDetails,
	        @RequestParam(name = "img" ,required = false) MultipartFile imageFile,
	        @RequestParam String isChanged,
	        @PathVariable Integer resortId

	){
		 if (customUserDetails.getUser()==null) {
		        throw new UserException("Unauthorized", HttpStatus.UNAUTHORIZED);
		    }
		    Resort findResort=rService.findById(resortId);
		    if (findResort == null) {
		        throw new ResortException("Resort not found", HttpStatus.NOT_FOUND);
		    }

			if(findResort.getUser().getUserId()!= customUserDetails.getUser().getUserId()) {
				throw new UserException("You can only update your Resort Data", HttpStatus.BAD_REQUEST);
			}

		    if (imageFile != null && imageFile.getSize() > 2 * 1024 * 1024) {
		        throw new ResortException("Image size must be less than 2MB", HttpStatus.BAD_REQUEST);
		    }
	
		    if(isChanged.equalsIgnoreCase("true"))
		    {
		    		 if (findResort.getResortImgUrlPublicId() != null) {
			 	        cloudinaryService.deleteFile(findResort.getResortImgUrlPublicId());
			 	        findResort.setResortImgUrl(isChanged);
			 	        findResort.setResortImgUrlPublicId(null);
			 	    }
		    		 
		    		 if(imageFile != null)
		    		 {
		    			Map uploadResult = cloudinaryService.uploadFile(imageFile);
		 		        findResort.setResortImgUrl((String) uploadResult.get("secure_url"));
		 		        findResort.setResortImgUrlPublicId((String) uploadResult.get("public_id"));
		    			 
		    		 }        
		    }
		   rService.upload(findResort);
		    
		return ResponseEntity.ok(new ApiResponse<>("success", "Resort img Uploaded Successfully", null));
	}	
	
	
	//to update the resort data
	@PutMapping("/updateResort/{id}")
	@PreAuthorize("hasRole('RESORT_OWNER')")
	ResponseEntity<ApiResponse<?>> updateResort(
			@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer id,
			@Valid @RequestBody AddResortRequest updateResort,
			BindingResult bindingResult){
		if(bindingResult.hasErrors()) {
			throw new ResortException("Invalid Data", HttpStatus.BAD_REQUEST);
		}
		if (customUserDetails.getUser()==null) {
	        throw new UserException("Unauthorized", HttpStatus.UNAUTHORIZED);
	    }
		Resort resort=rService.findById(id);
		if(resort==null) {
			throw new ResortException("resort not found", HttpStatus.NOT_FOUND);
		}
		
		if(resort.getUser().getUserId()!= customUserDetails.getUser().getUserId()) {
			throw new UserException("You can only update your Resort Data", HttpStatus.BAD_REQUEST);
		}
		
		resort.setName(updateResort.getName());
		resort.setFacilities(updateResort.getFacilities());
		resort.setAmount(updateResort.getAmount());
		resort.setDescription(updateResort.getDescription());
		resort.setLocation(updateResort.getLocation());
		rService.updateResort(resort);
		
		return ResponseEntity.ok(new ApiResponse<>("success","resort updated successfully",null));
	}
	
	
	//to delete resort 
	@DeleteMapping("/delete/{id}")
	@PreAuthorize("hasRole('RESORT_OWNER')")
	ResponseEntity<ApiResponse<?>> deleteResort(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer id){
		if (customUserDetails.getUser()==null) {
	        throw new UserException("Unauthorized", HttpStatus.UNAUTHORIZED);
	    }
		Resort resort=rService.findById(id);
		
		if(resort==null) {
			throw new ResortException("Resort not found", HttpStatus.NOT_FOUND);
		}

		if(resort.getUser().getUserId()!= customUserDetails.getUser().getUserId()) {
			throw new UserException("You can only delete your Resort Data", HttpStatus.BAD_REQUEST);
		}
		rService.deleteResort(id);
		
		return ResponseEntity.ok(new ApiResponse<>("Success","Resort Deleted Successfully",null));
	}
	
	
	//get particular resort
	@GetMapping("/getResort/{id}")
	ResponseEntity<ApiResponse<?>> getResortById(@PathVariable Integer id,
			@RequestParam(required = false, defaultValue = "1") Integer page,
			@RequestParam(required = false, defaultValue = "10") Integer limit){
		
			Resort resort=rService.findById(id);
			if(resort==null) {
				throw new ResortException("Resort Not Found", HttpStatus.NOT_FOUND);
			}		
			ResortDto resResortDTO=mapper.map(resort, ResortDto.class);
		return ResponseEntity.ok(new ApiResponse<>("success", "Resort found", resResortDTO));
	}
	
	
	//get all resorts
	@GetMapping("/allResort")
	ResponseEntity<ApiResponse<?>> getAllResort(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@RequestParam(required = false, defaultValue = "") String location,
			@RequestParam(required = false, defaultValue = "1") Integer page,
			@RequestParam(required = false, defaultValue = "10") Integer limit){
		Pageable pageable = PageRequest.of(page, limit, Sort.by("resortId").descending());
		Page<Resort> resorts=rService.findAll(location,pageable);
		Page<ResortDto> resortResponse=resorts.map(resort->{
			ResortDto resortDto=new ResortDto();
			resortDto.setResortId(resort.getResortId());
			resortDto.setName(resort.getName());
			resortDto.setResortImgUrl(resort.getResortImgUrl());
			resortDto.setResortImgUrlPublicId(resort.getResortImgUrlPublicId());
			resortDto.setCreatedDate(resort.getCreatedDate());
			resortDto.setAmount(resort.getAmount());
			resortDto.setDescription(resort.getDescription());
			resortDto.setFacilities(resort.getFacilities());
			resortDto.setLocation(resort.getLocation());
			return resortDto;
			
		});
			
		return ResponseEntity.ok(new ApiResponse<>("success", "Resorts data", resortResponse));
	}
	
	
	//taking admin id to fetch the resorts belongs to that owner
	@GetMapping("/adminResorts/{id}")
	@PreAuthorize("hasRole('RESORT_OWNER')")
	ResponseEntity<ApiResponse<?>> getResortsOfOwner(@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer id){
		
		    if (customUserDetails.getUser()==null) {
	            throw new UserException("Unauthorized", HttpStatus.UNAUTHORIZED);
	        }
			if(customUserDetails.getUser().getUserId()!=id) {
				throw new UserException("you can only see your resorts", HttpStatus.BAD_REQUEST);
			}
			List<Resort> ownerResorts=rService.findResortByUserId(id);
			
			List<ResortDto> resortDtos = ownerResorts.stream()
			        .map(resort -> mapper.map(resort, ResortDto.class))
			        .toList();
		    return ResponseEntity.ok(new ApiResponse<>("success", "Resorts data", resortDtos));
		
	}
}
