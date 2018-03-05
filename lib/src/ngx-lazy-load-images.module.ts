import { NgModule } from '@angular/core';

import { LazyLoadImagesDirective } from './ngx-lazy-load-images.directive';

@NgModule({
  declarations: [LazyLoadImagesDirective],
  exports: [LazyLoadImagesDirective]
})
export class LazyLoadImagesModule {}
