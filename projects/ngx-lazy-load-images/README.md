# ngx-lazy-load-images
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fjesusbotella%2Fngx-lazy-load-images.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fjesusbotella%2Fngx-lazy-load-images?ref=badge_shield)


ngx-lazy-load-images is a image lazy load library for Angular 2+.

The library allows to lazy load images from your web application using the [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) and the [IntersectionObserver](https://developer.mozilla.org/en/docs/Web/API/IntersectionObserver). Images will be loaded as soon as they enter the viewport in a non-blocking way.

It supports `<img>` tags as well as background images.


## Installation
You can install the library via npm with this command:
```
npm install ngx-lazy-load-images --save
```


## Usage

### 1. Import the `LazyLoadImagesModule`

Import `LazyLoadImagesModule` from the `ngx-lazy-load-images` package, and add it to the `NgModule` imports array of your component.

```typescript
import { NgModule } from '@angular/core';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

@NgModule({
  imports: [
    LazyLoadImagesModule
  ]
})
export class AppComponent {}
```

### 2. Use the `lazy-load-images` directive

Add the `lazy-load-images` directive to the tag containing all the DOM image nodes to lazy load:

```html
<!-- Image tags -->
<div class="image-list" lazy-load-images>
  <img *ngFor="let imageUrl in images" [attr.data-src]="imageUrl">
</div>

<!-- Background images -->
<div class="image-list" lazy-load-images>
  <div *ngFor="let imageUrl in images" [attr.data-background-src]="imageUrl"></div>
</div>
```

The container can have any HTML or components inside along with the images. But the less nodes inside the directive, the faster it will be.

**Intersection Observer Configuration**

If you want to make some configuration changes to the Intersection Observer, you can do it by passing an object to the `lazy-load-images` directive. The object takes the [Intersection Observer configuration parameters](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options) as keys.

  ```html
  <div class="image-list" [lazy-load-images]="{ rootMargin: '50px' }"></div>
  ```

### 3. Set the `data-src` or `data-background-src` attribute

Set the `data-src` or `data-background-src` attribute in the images or tags that you want to lazy load.

The `data-src` attribute allows to lazy load images inside `<img>` tags. You can define it by passing a variable to the attribute, interpolating a variable, or inserting the URL directly:

```html
<img [attr.data-src]="imageUrlVariable">
<img attr.data-src="{{ imageUrlVariable }}">
<img data-src="https://example.com/cute_kitten.jpg">
```

The `data-background-src` attribute lazy loads background images inside any HTML tag. It works the same way as the `data-src` attribute:

```html
<div [attr.data-background-src]="imageUrlVariable"></div>
<div attr.data-background-src="{{ imageUrlVariable }}"></div>
<div data-background-src="https://example.com/cute_kitten.jpg"></div>
```

### 4. Have fun  🎉

## Performance

- Will this module make my web application worse in terms of performance?
  - This module will make your app better in terms of overall and render performance, especially if it has a lot of images to show when the page is loaded. The images will be downloaded as soon as they appear in the viewport instead of all together. That means that your users will save network transfer data and the scroll will be less laggy.

- What happens if I have lots of images, will it consume too much memory?
  - The lifespan of the image observers is too short. It will only last until [the URL is set to the proper attribute, and destroyed right after that](https://github.com/jesusbotella/ngx-lazy-load-images/blob/master/src/lib/src/ngx-lazy-load-images.directive.ts#L82). And if the directive is destroyed, [all the remaining image observers and the intersection observer instance will be disconnected](https://github.com/jesusbotella/ngx-lazy-load-images/blob/master/src/lib/src/ngx-lazy-load-images.directive.ts#L38).


## Browser Compatibility

This library has been tested and known to work in the latest version of all major browsers.

The [WICG Intersection Observer Polyfill](https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill) is bundled within the module to use the Intersection Observer API in the non-compatible browsers. Avoid importing it in your application too, as it may cause unexpected issues.

However, the compatibility with older browsers is limited by the [`Mutation Observer` support](https://caniuse.com/#feat=mutationobserver), which is known to work in:

<table>
  <tr>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/39.2.2/src/chrome/chrome_48x48.png" alt="Chrome"><br>
      26+
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/39.2.2/src/firefox/firefox_48x48.png" alt="Firefox"><br>
      14+
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/39.2.2/src/safari/safari_48x48.png" alt="Safari"><br>
      6+
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/39.2.2/src/edge/edge_48x48.png" alt="Edge"><br>
      ✔
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/39.2.2/src/archive/internet-explorer_7-8/internet-explorer_7-8_48x48.png" alt="Internet Explorer"><br>
    11+
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/39.2.2/src/opera/opera_48x48.png" alt="Opera"><br>
      15+
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/39.2.2/src/android/android_48x48.png" alt="Android"><br>
      4.4+
    </td>
  </tr>
</table>

## License

MIT


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fjesusbotella%2Fngx-lazy-load-images.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fjesusbotella%2Fngx-lazy-load-images?ref=badge_large)
