# ngx-lazy-load

ngx-lazy-load is a image lazy load library for Angular 2+.

The library allows you to lazy load the images that your application/PWA contains using [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) and the praised [IntersectionObserver](https://developer.mozilla.org/en/docs/Web/API/IntersectionObserver). The images will be loaded as soon as they enter into the browser viewport, instead of loading them as soon as they are loaded.

It supports ```<img>``` tags as well as background images.

## Installation
You can install the library via npm with this command:
```
npm install npx-lazy-load
```


## Usage
**1. Import the `LazyLoadModule`**:

To use the library you need to import the LazyLoadModule in the module that you want to use the component in. You need to import `LazyLoadModule` from the `npx-lazy-load` package, and add it to `NgModule` imports.

```typescript
import { NgModule } from '@angular/core';
import { LazyLoadModule } from 'npx-lazy-load';

@NgModule({
    imports: [
        LazyLoadModule
    ]
})
export class AppComponent { }
```

**2. Use the `image-lazy-load` directive:**

The `image-lazy-load` directive should be used in the HTML/Component tag that will contain all of the image DOM nodes to lazy load:

```html
<div class="image-list" image-lazy-load>
  <img *ngFor="let imageUrl in images" [attr.data-src]="imageUrl">
</div>
```

It doesn't need to exclusively contain the image nodes, it can contain any HTML or component tag inside the directive HTML tag. But the less nodes inside the tag, the faster it will be.

  - **Intersection Observer Configuration**
    - In case you want to make some configuration changes to the intersection observer you can do it by passing an object to the `image-lazy-load` directive. The object takes the [Intersection Observer configuration parameters](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options) as keys.
    <br />
    ```html
    <div class="image-list" [image-lazy-load]="{ rootMargin: '50px' }">
    </div>
    ```



**3. Set the `data-src` or `data-background-src` attribute:**

We need to set `data-src` or `data-background-src` attribute in the images or backgrounds that we want to lazy load.

The `data-src` attribute allow to lazy load images inside the img tags. You can use it by passing a variable to the attribute, interpolating a component variable into the attribute, or inserting a URL string in the attribute.
```html
  <img [attr.data-src]="imageUrlVariable">
  <img attr.data-src="{{ imageUrlVariable }}">
  <img attr.data-src="https://example.com/cute_kitten.jpg">
```

The `data-background-src` attribute lazy loads background images inside any HTML tag. You can use it like `data-src` attribute.
```html
  <div [attr.data-background-src]="imageUrlVariable"></div>
  <div attr.data-background-src="{{ imageUrlVariable }}"></div>
  <div attr.data-background-src="https://example.com/cute_kitten.jpg"></div>
```

**4. Have fun  🎉**


## Browser Compatibility

The library has been tested and known to work in the latest version of all major browsers.

However, the compatibility with older browsers is limited by the [`Mutation Observer` support](https://caniuse.com/#feat=mutationobserver), which is known to work from:

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
