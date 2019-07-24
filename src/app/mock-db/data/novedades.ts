export class Novedades
{
   
    public static FN0051 = Novedades.crearNovedades();
    public static FC0784 = Novedades.crearNovedades();
    public static FC7871 = Novedades.crearNovedades();
    public static FC4152 = Novedades.crearNovedades();
    public static FC0192 = Novedades.crearNovedades();
    public static FC1068 = Novedades.crearNovedades();
    public static FC1791 = Novedades.crearNovedades();
    public static FC1966 = Novedades.crearNovedades();
    public static FC2173 = Novedades.crearNovedades();
    public static FN0038 = Novedades.crearNovedades();
    public static FN0042 = Novedades.crearNovedades();
    public static FN0061 = Novedades.crearNovedades();
    public static FN0063 = Novedades.crearNovedades();
    public static FN0094 = Novedades.crearNovedades();
    public static FN0097 = Novedades.crearNovedades();
    public static FN0120 = Novedades.crearNovedades();
    public static FH0248 = Novedades.crearNovedades();
    public static FH0492 = Novedades.crearNovedades();
    public static FH0568 = Novedades.crearNovedades();
    public static FH0569 = Novedades.crearNovedades();
    

    private static crearNovedades(): any {
        const cantEq = Math.floor(Math.random() * 10);
        const cantEx = Math.floor(Math.random() * 10);

        // const cant = 0; //Para testear cuando la cantidad es 0 de novedades
    
        const response = {
            'Eq' : [],
            'Ex' : [],
        };

        const responseEq: any[] = [];
        const responseEx: any[] = [];

        for (let i = 1; i <= cantEq; i++) {
            responseEq.push(this.crearNovedadEq());
        }
    
        for (let i = 1; i <= cantEx; i++) {
            responseEx.push(this.crearNovedadEx());
        }

        response.Eq = responseEq;
        response.Ex = responseEx;

        // console.log(response);

        return response;
    }
    

    private static crearNovedadEx(): any {
        const novedadEx = {
            'id': new Date().getTime(),
            'fecha': this.getNumber(27) + '/' + this.getNumber(12) + '/2019',
            'concepto': '',
            'monto': ''
        };

        const ConceptosEx = [
            'Mailing',
            'Diferencia de Caja',
            'Remuneracion Variable',
            'Premio de Ventas',
            'Incentivo Entrega En Mano',
            'Premios Fava Salud',
            'Comisiones Gestion Domiciliaria',
            'Liquidación Equipos de Venta',
            'Corporativo',
            'Premio de Cobranzas',
        ];

        //    Externas

        const posEx = Math.floor((Math.random() * (ConceptosEx.length - 1)));

        novedadEx.concepto = ConceptosEx[posEx];
        novedadEx.monto = "$" + Math.floor((Math.random() * 1000)).toString();

        //    -Externas

        return novedadEx;
    }



    private static crearNovedadEq(): any {
        const novedadEq = {
            'id': new Date().getTime(),
            'fecha': this.getNumber(27) + '/' + this.getNumber(12) + '/2019',
            'concepto': '',
            'cantidad': '',
            'tipo': '',
            'unidad': ''
        };

        const ConceptosEquipo = [
            {
                valor: 'Falta Injustificada',
                tipo: 'cuantitativo',
                unidad: 'dias',
            },
            {
                valor: 'Feriado Trabajado(Horas)',
                tipo: 'cuantitativo',
                unidad: 'horas',
            },
            {
                valor: 'Horas Extras 100%',
                tipo: 'cuantitativo',
                unidad: 'horas',
            },
            {
                valor: 'Horas Extras 50%',
                tipo: 'cuantitativo',
                unidad: 'horas',
            },
            {
                valor: 'Lic.Por Enfermedad',
                tipo: 'cuantitativo',
                unidad: 'dias',
            },
            {
                valor: 'Lic.Por Excedencia',
                tipo: 'cuantitativo',
                unidad: 'dias'
            },
            {
                valor: 'Lic.Por Fliar Enfermo',
                tipo: 'cuantitativo',
                unidad: 'dias'
            },
            {
                valor: 'Lic.Por Maternidad',
                tipo: 'cuantitativo',
                unidad: 'dias'
            },
            {
                valor: 'Lic.Por Matrimonio',
                tipo: 'cuantitativo',
                unidad: 'dias'
            },
            {
                valor: 'Vacaciones(Días)',
                tipo: 'cuantitativo',
                unidad: 'dias'
            },

            {
                valor: 'Adicional Caj.Prop. - No Habitual',
                tipo: 'cualitativo'
            },
            {
                valor: 'Adicional Cajero - No Habitual',
                tipo: 'cualitativo'
            },
            {
                valor: 'Alta Cuota Sindical',
                tipo: 'cualitativo'
            },
            {
                valor: 'Alta Fliar.Adicional Sindicato',
                tipo: 'cualitativo'
            },
            {
                valor: 'Baja Cuota Sindical',
                tipo: 'cualitativo'
            },
            {
                valor: 'Baja Fliar.Adicional Sindicato',
                tipo: 'cualitativo'
            },
            {
                valor: 'Días De Estudio',
                tipo: 'cualitativo'
            },
            {
                valor: 'Ingreso A Rem.Variable',
                tipo: 'cualitativo'
            },
            {
                valor: 'Licencias Especiales',
                tipo: 'cualitativo'
            },
            {
                valor: 'Plus Asesor Junior Experto',
                tipo: 'cualitativo'
            },
            {
                valor: 'Plus Master',
                tipo: 'cualitativo'
            },

        ];

        //    Equipo
        const pos = Math.floor((Math.random() * (ConceptosEquipo.length - 1)));  
    
        novedadEq.concepto = ConceptosEquipo[pos].valor;
        novedadEq.tipo = ConceptosEquipo[pos].tipo;
    
        if (novedadEq.tipo === 'cuantitativo') {
            novedadEq.cantidad = Math.floor((Math.random() * 6) + 1).toString();
            novedadEq.unidad = ConceptosEquipo[pos].unidad;
        }
        //    -Equipo

        return novedadEq;
    }

    private static getNumber(limite: number): string{
        let n = '';
        n = Math.floor((Math.random() * limite) + 1).toString();

        return (n.length === 1) ? 0 + n : n;
    }


}



