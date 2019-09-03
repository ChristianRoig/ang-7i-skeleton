export class Combo {
    cod: string;
    valor: string;
    valor2: string;

    /**
     * Constructor
     * @param combo 
     */
    constructor(combo) {
        this.cod = combo.cod || combo.codigo || '';
        this.valor = combo.valor || combo.nombre || '';
        this.valor2 = combo.valor2 || '';

    }
}
