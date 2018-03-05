import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class WindowRef {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public getNativeWindow(): Window {
    if (this.isBrowser) {
      return window;
    }
    return {} as Window;
  }
}
