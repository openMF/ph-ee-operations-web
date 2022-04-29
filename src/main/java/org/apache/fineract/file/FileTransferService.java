package org.apache.fineract.file;

import org.springframework.stereotype.Service;

import java.io.File;

@Service
public interface FileTransferService {

    String uploadFile(File file, String bucketName);

    byte[] downloadFile(String fileName, String bucketName);

    void deleteFile(String fileName, String bucketName);

}
