package org.apache.fineract.file;

import com.azure.storage.blob.BlobClientBuilder;
import com.azure.storage.blob.models.BlobProperties;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
@Qualifier("azureStorage")
@ConditionalOnProperty(
        value="cloud.azure.enabled",
        havingValue = "true")
public class AzureFileTransferImpl implements FileTransferService {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    BlobClientBuilder client;

    @Override
    public String uploadFile(File file, String bucketName) {

        try {
            String fileName = System.currentTimeMillis() + "_" + file.getName();
            client.containerName(bucketName).blobName(fileName).buildClient().upload(FileUtils.openInputStream(file), file.length());
            file.delete();
            return fileName;
        } catch (IOException e) {
            logger.error("Error uploading file to Azure", e);
        }

        return null;
    }

    @Override
    public byte[] downloadFile(String fileName, String bucketName) {
        try {
            File temp = new File("/temp/"+fileName);
            BlobProperties properties = client.containerName(bucketName).blobName(fileName).buildClient().downloadToFile(temp.getPath());
            byte[] content = Files.readAllBytes(Paths.get(temp.getPath()));
            temp.delete();
            return content;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void deleteFile(String fileName, String bucketName) {
        client.containerName(bucketName).blobName(fileName).buildClient().delete();
    }
}
