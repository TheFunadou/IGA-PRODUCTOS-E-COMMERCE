export function stringStrengthEvaluator(password: string): number {
    let puntuacion = 0;

    // Validar longitud mínima de 8 caracteres (20 puntos)
    if (password.length >= 8) {
        puntuacion += 20;
    }

    // Puntos adicionales por longitud extra (máximo 15 puntos)
    if (password.length >= 12) {
        puntuacion += 10;
    }
    if (password.length >= 16) {
        puntuacion += 5;
    }

    // Validar que tenga al menos una letra minúscula (20 puntos)
    if (/[a-z]/.test(password)) {
        puntuacion += 20;
    }

    // Validar que tenga al menos una letra mayúscula (20 puntos)
    if (/[A-Z]/.test(password)) {
        puntuacion += 20;
    }

    // Validar que tenga al menos un número (15 puntos)
    if (/[0-9]/.test(password)) {
        puntuacion += 15;
    }

    // Validar que tenga al menos un carácter especial (25 puntos)
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        puntuacion += 25;
    }

    // Asegurar que el valor esté entre 0 y 100
    return Math.min(100, Math.max(0, puntuacion));
};