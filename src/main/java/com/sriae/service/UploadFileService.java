package com.sriae.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UploadFileService {
    private final String folder = "uploads";

    public String copiar(MultipartFile archivo) throws IOException {
        Path carpeta = Paths.get(folder).toAbsolutePath();
        Files.createDirectories(carpeta);

        String nombreOriginal = Paths.get(archivo.getOriginalFilename()).getFileName().toString();
        String nombreArchivo = UUID.randomUUID() + "_" + nombreOriginal;
        Path rutaAbsoluta = carpeta.resolve(nombreArchivo);

        Files.copy(archivo.getInputStream(), rutaAbsoluta);
        return nombreArchivo;
    }

    public boolean eliminar(String nombreFoto) {
        if (nombreFoto == null || nombreFoto.isEmpty()) return false;

        Path rutaAbsoluta = Paths.get(folder).toAbsolutePath().resolve(nombreFoto);
        try {
            return Files.deleteIfExists(rutaAbsoluta);
        } catch (IOException e) {
            System.err.println("Error al eliminar el archivo: " + e.getMessage());
            return false;
        }
    }
}
