function converterHora(horaAmericana) {
    let periodo = horaAmericana.slice(-2); // Pega AM ou PM
    let [horas, minutos] = horaAmericana.slice(0, -2).split(':'); // Separa horas e minutos

    horas = parseInt(horas);

    if (periodo === 'PM' && horas !== 12) {
        horas += 12;
    } 
    // else if (periodo === 'AM' && horas === 12) {
    //     horas = 0; // Corrige 12 AM para 00h
    // }

    // Formata a hora com dois dígitos
    let horasFormatadas = horas.toString().padStart(2, '0');
    
    return `${horasFormatadas}:${minutos}`;
}

// Exporta as funções para serem usadas em outros arquivos
module.exports = {
    converterHora
};