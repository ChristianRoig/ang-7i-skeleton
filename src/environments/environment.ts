// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr       : false,

    API_LOG        : 'http://server.sieteideas.com.ar:8080/fava-auth-svc/fava-auth-svc/login',
    API            : 'http://server.sieteideas.com.ar:8080/ges-rrhh-svc/ges-rrhh-svc/',
    
    Cookie_User    : 'user', // Parametro que guarda el usuario logueado en la Cookie
    Cookie_Token   : 'token', // Parametro que guarda el token de autentificacion en la Cookie
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
