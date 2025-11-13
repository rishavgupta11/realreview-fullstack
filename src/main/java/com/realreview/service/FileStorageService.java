package com.realreview.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public void init() {
        try { Files.createDirectories(Paths.get(uploadDir).toAbsolutePath()); }
        catch (IOException e) { throw new RuntimeException("Could not create upload dir", e); }
    }

    public String storeFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path targetPath = Paths.get(uploadDir).resolve(fileName).normalize();

        Files.createDirectories(targetPath.getParent());
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    public Path loadFile(String fileName) {
        return Paths.get(uploadDir).toAbsolutePath().resolve(fileName).normalize();
    }
}
