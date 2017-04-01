import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[imageLazyLoading]'
})
export class ImageLazyLoadingDirective implements OnInit, OnDestroy {
  private rootElement;
  private renderer;
  private currentIntersectionObserver;
  private imageElements = [];
  private interactionObserverSupported = false;
  private eventsAlreadyRegistered = false;
  private registeredEventListeners = {
    contentLoaded: null,
    pageLoad: null,
    resize: null,
    scroll: null
  };

  constructor(element: ElementRef, renderer: Renderer2) {
    this.interactionObserverSupported = Boolean(window['IntersectionObserver']);
    this.rootElement = element.nativeElement;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.imageElements = this.__getAllImages(this.rootElement);
  
    if (this.interactionObserverSupported) {
      this.__registerIntersectionObserver()
    } else {
      this.__registerScrollEventFallback();
    }
  }

  ngOnDestroy() {
    this.__unregisterScrollEventFallback();
  }

  __getAllImages(pageNode) {
    return pageNode.querySelectorAll('img[data-src]')
  }

  __registerIntersectionObserver() {
    if (!this.imageElements.length) {
      this.__unregisterScrollEventFallback();
      return console.warn('Image Lazy Loading: You are not targeting any image to lazy load');
    }

    this.currentIntersectionObserver = new IntersectionObserver(
      images => images.forEach(image => this.__onImageAppearsInViewport(image))
    );

    this.currentIntersectionObserver.observe(...this.imageElements);
  }

  __registerScrollEventFallback() {
    if (this.eventsAlreadyRegistered) return;

    // Yeah, too much event listeners :(
    let callbackFunction = () => this.__pageChangedCallback();
    
    this.registeredEventListeners.contentLoaded = this.renderer.listen('window', 'DOMContentLoaded', callbackFunction)
    this.registeredEventListeners.pageLoad = this.renderer.listen('window', 'load', callbackFunction);
    this.registeredEventListeners.resize = this.renderer.listen('window', 'resize', callbackFunction);
    this.registeredEventListeners.scroll = this.renderer.listen('window', 'scroll', callbackFunction);

    this.eventsAlreadyRegistered = true;
  }

  __unregisterScrollEventFallback() {
    if (!this.eventsAlreadyRegistered) return;
  
    this.registeredEventListeners.contentLoaded();
    this.registeredEventListeners.pageLoad();
    this.registeredEventListeners.resize();
    this.registeredEventListeners.scroll();

    this.eventsAlreadyRegistered = false;
  }

  __pageChangedCallback() {
    if (!this.imageElements.length) {
      return this.__unregisterScrollEventFallback();
    }
    
    this.imageElements.forEach(
      (image, imageIndex) => {
        if (!this.__isElementInViewport(image)) return;

        this.__onImageAppearsInViewport(image);
      }
    );

    this.imageElements = this.__getAllImages(this.rootElement);
  }

  __isElementInViewport(domElement) {
    var rect = domElement.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
  }

  __onImageAppearsInViewport(image) {
    this.renderer.setAttribute(image.target, 'src', image.target.dataset.src);
    this.renderer.removeAttribute(image.target, 'data-src');
    
    // Stop observing the current target
    if (this.currentIntersectionObserver) {
      this.currentIntersectionObserver.unobserve(image.target);
    }
  }
}
