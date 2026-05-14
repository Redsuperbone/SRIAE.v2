package com.sriae.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UploadFileService {
    private final Path folder;

    public UploadFileService(@Value("${sriae.upload.dir}") String folder) {
        this.folder = Paths.get(folder).toAbsolutePath().normalize();
    }

    public String copiar(MultipartFile archivo) throws IOException {
        Files.createDirectories(folder);

        String nombreOriginal = Paths.get(archivo.getOriginalFilename()).getFileName().toString();
        String nombreArchivo = UUID.randomUUID() + "_" + nombreOriginal;
        Path rutaAbsoluta = folder.resolve(nombreArchivo);

        Files.copy(archivo.getInputStream(), rutaAbsoluta);
        return nombreArchivo;
    }

    public boolean eliminar(String nombreFoto) {
        if (nombreFoto == null || nombreFoto.isEmpty()) return false;

        Path rutaAbsoluta = folder.resolve(nombreFoto).normalize();
        try {
            return Files.deleteIfExists(rutaAbsoluta);
        } catch (IOException e) {
            System.err.println("Error al eliminar el archivo: " + e.getMessage());
            return false;
        }
    }
}
