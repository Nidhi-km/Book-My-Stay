package in.stay.exception;

import org.springframework.http.HttpStatus;

public class ResortException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	private HttpStatus httpStatus;

	public ResortException(String message , HttpStatus httpStatus) {
		super(message);
		this.httpStatus = httpStatus;
		this.httpStatus = httpStatus!=null ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR;	
	}

	public HttpStatus getHttpStatus() {
		return httpStatus;
	}
}
