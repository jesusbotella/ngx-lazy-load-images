import { NgModule } from '@angular/core';

import { LazyLoadImagesDirective } from './ngx-lazy-load-images.directive';
import { WindowRef } from './window-ref.service';

@NgModule({
  declarations: [LazyLoadImagesDirective],
  exports: [LazyLoadImagesDirective],
  providers: [WindowRef]
})
export class LazyLoadImagesModule {}
