export class Combo {
    cod: string;
    valor: string;

    /**
     * 
     * @param combo 
     */
    constructor(combo) {
        this.cod = combo.cod || '';
        this.valor = combo.valor || '';
    }
}
