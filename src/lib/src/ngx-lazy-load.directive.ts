import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

/**
 * Angular Lazy Loading Images Directive
 *
 * Directive to easily allow to lazy load the images
 * that your application/PWA contains using MutationObserver
 * and the praised IntersectionObserver.
 *
 * How does it work?
 *
 * You only need to include the directive in the container node
 * that holds all the images you want to lazy load. It supports
 * <img> tags, as well as background images in any HTML node.
 *
 * Example
 *
 * <div class="container" ngx-lazy-load>
 *  <img attr.data-src="img/logo.png">
 *  <div class="thumbnail" attr.data-background-src="{{ background_image }}"></div>
 * </div>
 */
@Directive({
  selector: '[ngx-lazy-load]' // Attribute selector
})
export class LazyLoadingDirective {

  @Input('ngx-lazy-load') intersectionObserverConfig: Object;

  intersectionObserverSupported: Boolean = false;
  intersectionObserver: IntersectionObserver;
  rootElement: HTMLElement;
  renderer: Renderer2;

  constructor(element: ElementRef, renderer: Renderer2) {
    this.intersectionObserverSupported = 'IntersectionObserver' in window;
    this.rootElement = element.nativeElement;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.registerIntersectionObserver();

    this.observeDOMChanges(this.rootElement, () => {
      const imagesFoundInDOM = this.getAllImagesToLazyLoad(this.rootElement);

      // Why can't I use rest operator instead forEach?
      // this.intersectionObserver.observe(...imagesFoundInDOM);

      imagesFoundInDOM.forEach((element: HTMLElement) => this.intersectionObserver.observe(element));
    });
  }

  registerIntersectionObserver() {
    if (!this.intersectionObserverSupported) {
      // Load polyfill for unsupported Browsers
      console.error('IntersectionObserver is not supported in this browser');

      // Insection Observer Polyfill
      // https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill
      // The browser hangs up when importing this code, don't know why

      // https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver
    }

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
      childList: true
    };

    // Observe Directive DOM Node
    observer.observe(rootElement, observerConfig);

    return observer;
  }

  getAllImagesToLazyLoad(pageNode: HTMLElement) {
    let images = [];
    let imagesToLazyLoad = pageNode.querySelectorAll('img[data-src], [data-background-src]');

    for (let i = 0; i < imagesToLazyLoad.length; i++) {
      images.push(imagesToLazyLoad[i]);
    }

    return images;
  }

  onIntersectionChange(image: any) {
    if (!image.isIntersecting) {
      return;
    }

    this.onImageAppearsInViewport(image.target);
  }

  onImageAppearsInViewport(image: any) {
    if (image.dataset.src) {
      this.renderer.setAttribute(image, 'src', image.dataset.src);
      this.renderer.removeAttribute(image, 'data-src');
    }

    if (image.dataset.backgroundSrc) {
      this.renderer.setStyle(image, 'background-image', `url(${image.dataset.backgroundSrc})`);
      this.renderer.removeAttribute(image, 'data-background-src');
    }

    // Stop observing the current target
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(image);
    }
  }
}
