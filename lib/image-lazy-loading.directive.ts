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
 * <div class="container" image-lazy-load>
 *  <img attr.data-src="img/logo.png">
 *  <div class="thumbnail" attr.data-background-src="{{ background_image }}"></div>
 * </div>
 */
@Directive({
  selector: '[image-lazy-load]' // Attribute selector
})
export class ImageLazyLoadingDirective {

  @Input('image-lazy-load') intersectionObserverConfig: Object;

  private intersectionObserverSupported: Boolean = false;
  private intersectionObserver: IntersectionObserver;
  private rootElement: HTMLElement;
  private renderer: Renderer2;

  constructor(element: ElementRef, renderer: Renderer2) {
    this.intersectionObserverSupported = Boolean(window['IntersectionObserver']);
    this.rootElement = element.nativeElement;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.registerIntersectionObserver();

    this.observeDOMChanges(this.rootElement, () => {
      const imagesFoundInDOM = this.getAllImages(this.rootElement);

      // Why can't I use rest operator instead forEach?
      // this.intersectionObserver.observe(...imagesFoundInDOM);

      imagesFoundInDOM.forEach(element => this.intersectionObserver.observe(element));
    });
  }

  observeDOMChanges(rootElement: HTMLElement, onChange: Function) {
    // Create a Mutation Observer instance
    const observer = new MutationObserver(mutations => onChange(mutations));

    // Observer Configuration
    const observerConfig = {
      childList: true,
      characterData: true
    };

    // Observe Directive DOM Node
    observer.observe(rootElement, observerConfig);

    return observer;
  }

  getAllImages(pageNode: HTMLElement) {
    return Array.from(pageNode.querySelectorAll('img[data-src], [data-background-src]'));
  }

  registerIntersectionObserver() {
    if (!this.intersectionObserverSupported) {
      // Load polyfill for unsupported Browsers
      console.error('IntersectionObserver is not supported in this browser');
    }

    this.intersectionObserver = new IntersectionObserver(
      images => images.forEach(image => this.onIntersectionChange(image)),
      this.intersectionObserverConfig instanceof Object ? this.intersectionObserver : null
    );

    return this.intersectionObserver;
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
      this.renderer.setStyle(image, 'background-image', `url(${image.dataset['backgroundSrc']})`);
      this.renderer.removeAttribute(image, 'data-background-src');
    }

    // Stop observing the current target
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(image);
    }
  }

}
