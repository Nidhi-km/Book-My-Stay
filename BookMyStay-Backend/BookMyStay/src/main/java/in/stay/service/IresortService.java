package in.stay.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import in.stay.entity.Resort;

public interface IresortService {
	public Resort createResort(Resort r);
	public Resort findById(Integer id);
	public void upload(Resort r);
	public void updateResort(Resort r);
	public void deleteResort(Integer resortId);
	public Page<Resort> findAll(String location,Pageable pageable);
	public List<Resort> findResortByUserId(int id);
	
}
