package in.stay.exception;

import org.springframework.http.HttpStatus;

public class ResortBookingException extends RuntimeException{
	private static final long serialVersionUID = 1L;

	private HttpStatus httpStatus;

	public ResortBookingException(String message , HttpStatus httpStatus) {
		super(message);
		this.httpStatus = httpStatus;
		this.httpStatus = httpStatus!=null ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR;	
	}

	public HttpStatus getHttpStatus() {
		return httpStatus;
	}

}
