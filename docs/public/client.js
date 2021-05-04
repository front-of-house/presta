;(() => {
  const n = [].slice.call(
    document.querySelectorAll(
      '.wysiwyg h1, .wysiwyg h2, .wysiwyg h3, .wysiwyg h4, .wysiwyg h5, .wysiwyg h6'
    )
  )
  console.log(n),
    n.forEach(n => {
      const e = document.createElement('a')
      ;(e.href = `#${n.id}`),
        (e.style.cssText =
          '\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    margin: auto 0;\n    transform: translateX(-100%) translateX(-8px);\n  '),
        (e.innerHTML = '#'),
        (n.innerHTML = `\n    ${e.outerHTML}\n    <span>${n.innerHTML}</span>\n  `),
        (n.style.cssText = 'position: relative'),
        n.classList.add('md-heading')
    })
})()
//# sourceMappingURL=client.js.map
