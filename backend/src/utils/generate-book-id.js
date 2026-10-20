
import { randomInt } from "node:crypto";

// Genera una letra mayúscula aleatoria y dos dígitos.
export function generateBookId() {
    const letter = String.fromCharCode(
        randomInt(65, 91) // 65 = A y 90 = Z
    );

    const digits = String(randomInt(0, 100)).padStart(2, "0");

    return `${letter}${digits}`;
}