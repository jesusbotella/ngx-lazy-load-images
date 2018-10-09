import { Directive, ElementRef, Renderer2, Input, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var require: any;

/**
 * Angular Lazy Loading Images Directive
 *
 * The library allows to lazy load images from your web application
 * using the MutationObserver and the IntersectionObserver. Images will be loaded as
 * soon as they enter the viewport in a non-blocking way.
 */
@Directive({
  selector: '[lazy-load-images]'
})
export class LazyLoadImagesDirective {

  @Input('lazy-load-images') intersectionObserverConfig: Object;

  intersectionObserver: IntersectionObserver;
  rootElement: HTMLElement;

  constructor(
    element: ElementRef,
    public renderer: Renderer2,
    public ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any) {
    this.rootElement = element.nativeElement;
  }

  init() {
    this.registerIntersectionObserver();

    this.observeDOMChanges(this.rootElement, () => {
      this.getAllImagesToLazyLoad(this.rootElement)
          .forEach(this.onImageFound);
    });
  }

  ngOnInit() {
    if (!this.isBrowser()) {
      return;
    }

    require('intersection-observer');
    this.ngZone.runOutsideAngular(() => this.init());
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  registerIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      images => images.forEach(image => this.onIntersectionChange(image)),
      this.intersectionObserverConfig instanceof Object ? this.intersectionObserverConfig : undefined
    );

    return this.intersectionObserver;
  }

  observeDOMChanges(rootElement: HTMLElement, onChange: Function) {
    // Create a Mutation Observer instance
    const observer = new MutationObserver(mutations => onChange(mutations));

    // Observer Configuration
    const observerConfig = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    };

    // Observe Directive DOM Node
    observer.observe(rootElement, observerConfig);

    // Fire onChange callback to check current DOM nodes
    onChange();

    return observer;
  }

  onImageFound(image: HTMLImageElement) {
    this.setPlaceholderInElement(image);
    this.intersectionObserver.observe(image);
  }

  getAllImagesToLazyLoad(pageNode: HTMLElement) {
    return Array.from(pageNode.querySelectorAll('img[data-src], [data-srcset], [data-background-src]'));
  }

  onIntersectionChange(image: any) {
    if (!image.isIntersecting) {
      return;
    }

    this.onImageAppearsInViewport(image.target);
  }

  onImageAppearsInViewport(image: any) {
    this.setImageInElement(image);

    // Set loaded class
    this.renderer.addClass(image, 'lazy-load-images__loaded');

    // Stop observing the current target
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(image);
    }
  }

  setImageInElement(image: HTMLImageElement) {
    if (image.dataset.src) {
      this.renderer.setAttribute(image, 'src', image.dataset.src);
      this.renderer.removeAttribute(image, 'data-src');
    }

    if (image.dataset.srcset) {
      this.renderer.setAttribute(image, 'srcset', image.dataset.srcset);
      this.renderer.removeAttribute(image, 'data-srcset');
    }

    if (image.dataset.backgroundSrc) {
      this.renderer.setStyle(image, 'background-image', `url(${image.dataset.backgroundSrc})`);
      this.renderer.removeAttribute(image, 'data-background-src');
    }
  }

  setPlaceholderInElement(image: HTMLImageElement) {
    if (image.dataset.placeholderSrc) {
      this.renderer.setAttribute(image, 'src', image.dataset.placeholderSrc);
      this.renderer.removeAttribute(image, 'data-placeholder-src');
    }

    if (image.dataset.placeholderSrcset) {
      this.renderer.setAttribute(image, 'srcset', image.dataset.placeholderSrcset);
      this.renderer.removeAttribute(image, 'data-placeholder-srcset');
    }

    if (image.dataset.placeholderBackgroundSrc) {
      this.renderer.setStyle(image, 'background-image', `url(${image.dataset.placeholderbackgroundSrc})`);
      this.renderer.removeAttribute(image, 'data-placeholder-background-src');
    }
  }
}
