package com.sriae.util;

public final class RoleUtils {

    private RoleUtils() {
    }

    public static String normalizeRole(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) {
            return "ALUMNO";
        }

        String role = rawRole.trim().toUpperCase();
        if (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        return switch (role) {
            case "ADMINISTRADOR" -> "ADMIN";
            case "DIRECTOR" -> "DIRECTOR";
            case "MAESTRO", "PROFESOR" -> "DOCENTE";
            case "MEDICO", "MEDICA", "ENFERMERO" -> "ENFERMERA";
            default -> role;
        };
    }

    public static String toAuthority(String rawRole) {
        return "ROLE_" + normalizeRole(rawRole);
    }
}
