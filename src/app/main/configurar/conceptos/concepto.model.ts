export class Concepto
{

    idConcepto: string;
    tipoNov: string;
    codNov: string;
    descripcion: string;
    codOrigen: string;
    observaciones: string;

    /**
     * Constructor
     *
     * @param concepto
     */
    constructor(concepto)
    {
        this.idConcepto = concepto.idConcepto || null;
        this.tipoNov = concepto.tipoNov || '';
        this.codNov = concepto.codNov || '';
        this.descripcion = concepto.descripcion || '';
        this.codOrigen = concepto.codOrigen || null;
        this.observaciones = concepto.observaciones || null;
    }
}
