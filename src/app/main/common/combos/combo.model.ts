export class Combo {
    cod: string;
    valor: string;
    valor2: string;
    valor3: string;

    /**
     * Constructor
     * @param combo 
     */
    constructor(combo) {
        this.cod = combo.cod || combo.codigo || '';
        this.valor = combo.valor || combo.nombre || '';
        this.valor2 = combo.valor2 || '';
        this.valor3 = combo.valor3 || '';
    }
}
