// https://salithachathuranga94.medium.com/validation-and-exception-handling-in-spring-boot-51597b580ffd

// package io.hexlet.blog.handler;
//
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.ControllerAdvice;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
//
// import io.hexlet.blog.exception.ResourceNotFoundException;
//
// @ControllerAdvice
// public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
//
//     @ExceptionHandler(ResourceNotFoundException.class)
//     public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//     }
// }
