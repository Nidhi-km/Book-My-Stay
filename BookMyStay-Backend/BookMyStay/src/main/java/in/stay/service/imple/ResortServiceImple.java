package in.stay.service.imple;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import in.stay.entity.Resort;
import in.stay.repo.ResortRepo;
import in.stay.service.IresortService;
@Service
public class ResortServiceImple implements IresortService{
	@Autowired
	private ResortRepo resortRepo;

	@Override
	public Resort createResort(Resort r) {
		Resort resort=resortRepo.save(r);
		return resort;
	}

	@Override
	public Resort findById(Integer id) {
		Resort resort=resortRepo.findById(id).get();
		return resort;
	}

	@Override
	public void upload(Resort r) {
		resortRepo.save(r);	
	}

	@Override
	public void updateResort(Resort r) {
		resortRepo.save(r);	
	}

	

	@Override
	public Page<Resort> findAll(String location,Pageable pageable) {
		System.out.println(location);
		return (location==null||location.isEmpty())?resortRepo.findAll(pageable)
				:resortRepo.findByLocation(location, pageable);
	}

	@Override
	public List<Resort> findResortByUserId(int id) {		
		return resortRepo.getResortsByUserId(id);
	}

	@Override
	public void deleteResort(Integer resortId) {
		resortRepo.deleteById(resortId);
	}



	

	

//	@Override
//	public Page<Resort> findAll(int page, int limit) {
//		Pageable pageable = PageRequest.of(page - 1, limit);
//	    return resortRepo.findAll(pageable);
//	}


}
