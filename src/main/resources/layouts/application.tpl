yieldUnescaped '<!DOCTYPE html>'
html {
  head {
    title(pageTitle)
  }
  body {
    div(class: 'container') {
      div(class: 'navbar') {
        div(class: 'navbar-inner') {
          a(class: 'brand',
              href: '/',
              'Home')
          a(class: 'brand', href: '/posts', 'Posts')
        }
      }
      mainBody()
    }
  }
}
