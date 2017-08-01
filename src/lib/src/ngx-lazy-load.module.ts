import { NgModule } from '@angular/core';

import { LazyLoadingDirective } from './ngx-lazy-load.directive';

@NgModule({
  declarations: [LazyLoadingDirective],
  exports: [LazyLoadingDirective]
})
export class LazyLoadModule { }
