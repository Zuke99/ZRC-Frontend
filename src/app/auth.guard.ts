import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core'
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth=inject(AuthService)
  const router = inject(Router)

  const userRole=auth.getUserRole()
  if(auth.isLoggedIn() && userRole === 'MasterAdmin'){
    return true;
  } else if(auth.isLoggedIn()  && userRole === 'Contributor'){
    const allowedRoutes = ['add','view','updatefile','indent','indent-letter','search-bar','pdf-view','zrc-reports','indent-reports','login','master-list','update'];
    const routePath=route.routeConfig?.path ?? '';
    if(allowedRoutes.includes(routePath)){
      return true;
    }
  } else if(auth.isLoggedIn() && userRole === 'User'){
    const allowedRoutes=['indent','search-bar','pdf-view','zrc-reports','login','indent-letter','indent-reports']
    const routePath=route.routeConfig?.path ?? '';
    if(allowedRoutes.includes(routePath)){
      return true;
    }
  }
  alert("UnAuthorized Access")
  if(auth.isLoggedIn()){
  router.navigate(['search-bar'])
  } else {
    router.navigate(['login'])
  }
  return false;
};
