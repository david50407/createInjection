# createInjection

Template-level provide/inject simplifies your developer life.

## Installation

```sh
npm i create-injection
```

### CDN

```html
<script src="https://unpkg.com/create-injection"></script>
```

## Motivation

[Provide / inject pattern](https://www.patterns.dev/vue/provide-inject) in Vue is convenient to pass data through components avoiding prop-passing-hell.

But Vue only has component-level provide/inject as minimal scope, that cause we only can divide component into multiple provider components if we want to provide variant values into different scopes, e.g.

```vue
<!-- Layout.vue -->
<template>
  <div v-show="show">
    <HeaderProvider :value="header">
      <header>
        <slot name="header" />
      </header>
    </HeaderProvider>

    <main>
      <slot />
    </main>

    <FooterProvider :value="footer">
      <footer>
        <slot name="footer" />
      </footer>
    </FooterProvider>
  </div>
</template>

<script setup>
const header = {
  /* some header-related stuffs */
}

const footer = {
  /* some footer-related stuffs */
}
</script>
```

```vue
<!-- HeaderProvider.vue -->
<template>
  <slot />
</template>

<script setup>
const props = defineProps(['value'])

provide('header', props.value)
</script>
```

```vue
<!-- FooterProvider.vue -->
<template>
  <slot />
</template>

<script setup>
const props = defineProps(['value'])

provide('footer', props.value)
</script>
```

We'd like to keep things simple as much as possible. So we might not want to create such duplicated component files.

So this package is made to provide a way for easily bringing provide/inject usage into template scope.

## Usage

```ts
// context.ts
import { inject, InjectionKey } from 'vue'
import { createInjection } from 'create-injection'

type HeaderInjection = { /* definition of header-related stuffs */}
type FooterInjection = { /* definition of header-related stuffs */}

const headerKey = Symbol('header') as InjectionKey<HeaderInjection>
const footerKey = Symbol('footer') as InjectionKey<FooterInjection>

// Array style de-structure
const [HeaderProvider, HeaderInjector] = createInjection(headerKey)

// Object style de-structure
const {
  provide: FooterProvider,
  inject: FooterInjector,
} = createInjection(footerKey)

export const useHeader = () => inject(headerKey)
export const useFooter = () => inject(footerKey)

export {
  HeaderProvider,
  HeaderInjector,
  FooterProvider,
  FooterInjector,
}
```

```vue
<!-- Layout.vue -->
<template>
  <div v-show="show">
    <HeaderProvider :value="header">
      <header>
        <slot name="header" />
      </header>
    </HeaderProvider>

    <main>
      <slot />
    </main>

    <FooterProvider :value="footer">
      <footer>
        <slot name="footer" />
      </footer>
    </FooterProvider>
  </div>
</template>

<script setup lang="ts">
import { HeaderProvider, FooterProvider } from './context'

const header = {
  /* some header-related stuffs */
}

const footer = {
  /* some footer-related stuffs */
}
</script>
```

```vue
<!-- SomewhereInsideHeader.vue -->
<template>
  <span>
    <HeaderInjector v-slot="injection">
      {{ injection.title }}
    </HeaderInjector>

    {{ header.subtitle }}
  </span>
</template>

<script setup lang="ts">
import { HeaderInjector, useHeader } from 'context.ts'

// We can still use the original inject with provider component
const header = useHeader()
</script>
```

## Thanks

This project uses utility function [`makeDestructurable`](./src/makeDestructrable/index.ts) from [@vueuse/shared](https://github.com/vueuse/vueuse/blob/v10.6.1/packages/shared/makeDestructurable/index.ts) under [MIT License](https://github.com/vueuse/vueuse/blob/v10.6.1/LICENSE)

## License

[MIT License](./LICENSE) (c) 2023-PRESENT [Tzu-Te "Davy" Kuo](https://github.com/david50407)
