export function validateUsername(nomeUsuario: string): string | null {
    if (!/^[a-zA-Z0-9_]/.test(nomeUsuario)) {
        return 'Nome de usuário deve começar com um caractere ou underline.';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(nomeUsuario)) {
        return 'Nome de usuário pode conter apenar caracteres, underline, e hiféns';
    }
    if (nomeUsuario.length > 15) {
        return "Nome de usuário não pode ser maior que 15 caracteres.";
    }
    return null;
}
