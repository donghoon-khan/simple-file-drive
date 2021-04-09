package com.donghoonkhan.simplefiledrive.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.FileSystemAlreadyExistsException;
import java.nio.file.FileSystemNotFoundException;
import java.util.Date;

import com.donghoonkhan.simplefiledrive.model.ErrorResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(annotations = RestController.class)
public class ControllerAdvice {

	//
    @ExceptionHandler(value = {FileSystemNotFoundException.class})
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public ErrorResponse handleFileSystemNotFoundException(FileSystemNotFoundException e) {
        ErrorResponse response = new ErrorResponse();
        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setTimeStamp(new Date());
        response.setMessage("Not found directory: " + e.getMessage());
        return response;
    }

    @ExceptionHandler(value = {FileSystemAlreadyExistsException.class})
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorResponse handleFileSystemAlreadyExistsException(FileSystemAlreadyExistsException e) {
        ErrorResponse response = new ErrorResponse();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setTimeStamp(new Date());
        response.setMessage("Already exists directory: " + e.getMessage());
        return response;
    }

    @ExceptionHandler(value = {FileNotFoundException.class})
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    public ErrorResponse handleFileNotFoundException(FileNotFoundException e) {
        ErrorResponse response = new ErrorResponse();
        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setTimeStamp(new Date());
        response.setMessage("Not found file: " + e.getMessage());
        return response;
    }

    @ExceptionHandler(value = {FileAlreadyExistsException.class})
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorResponse handleFileAlreadyExistsException(FileAlreadyExistsException e) {
        ErrorResponse response = new ErrorResponse();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setTimeStamp(new Date());
        response.setMessage("Already exists file: " + e.getMessage());
        return response;
    }

    @ExceptionHandler(value = {IOException.class})
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleIOException(IOException e) {
        ErrorResponse response = new ErrorResponse();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setTimeStamp(new Date());
        response.setMessage(e.getMessage());
        return response;
    }
}
