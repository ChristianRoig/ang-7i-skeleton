export class Combo {
    cod: string;
    valor: string;

    /**
     * Constructor
     * @param combo 
     */
    constructor(combo) {
        this.cod = combo.cod || combo.codigo || '';
        this.valor = combo.valor || combo.nombre || '';
    }
}
