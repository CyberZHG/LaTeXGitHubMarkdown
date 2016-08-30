LaTeX GitHub Markdown
=====================

[![travis-ci](https://travis-ci.org/CyberZHG/LaTeXGitHubMarkdown.svg)](https://travis-ci.org/CyberZHG/LaTeXGitHubMarkdown)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/price/bembdpjahbkabjdpdgdmalckbbcglhjb.svg)](https://chrome.google.com/webstore/detail/latex-github-markdown/bembdpjahbkabjdpdgdmalckbbcglhjb)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/bembdpjahbkabjdpdgdmalckbbcglhjb.svg)](https://chrome.google.com/webstore/detail/latex-github-markdown/bembdpjahbkabjdpdgdmalckbbcglhjb)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/d/bembdpjahbkabjdpdgdmalckbbcglhjb.svg)](https://chrome.google.com/webstore/detail/latex-github-markdown/bembdpjahbkabjdpdgdmalckbbcglhjb)

### Installation

[![Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_340x96.png)](https://chrome.google.com/webstore/detail/latex-github-markdown/bembdpjahbkabjdpdgdmalckbbcglhjb)

### Introduction

A chrome extension that adds `LaTeX` buttons to Markdown elements on GitHub.
The LaTeX formulas begin and end with `$` or `$$` are all rendered as inline style.
Following is an example:

$$\left \{ \begin{array}{rll}
\nabla \cdot \mathbf{E} &=& \displaystyle \frac {\rho} {\varepsilon_0} \\
\nabla \cdot \mathbf{B} &=& 0 \\
\nabla \times \mathbf{E} &=& \displaystyle - \frac{\partial \mathbf{B}} {\partial t} \\
\nabla \times \mathbf{B} &=& \displaystyle \mu_0\mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}} {\partial t}  \\
\end{array} \right .$$

If you successfully installed this extension, you can see a `LaTeX` button in the right-top corner of this Markdown document.

You can see the `LaTeX` buttons in the following elements:

* A Markdown file in a repository.

![README.md](https://cloud.githubusercontent.com/assets/853842/17482634/446e99f4-5db5-11e6-9ec2-55c976dfe970.png)

* The comments in an issue.

![Issue](https://cloud.githubusercontent.com/assets/853842/17482548/df9b9f40-5db4-11e6-8544-d00bf0c05a9c.png)

* A gist file whose extension is `.md`.

![Gist](https://cloud.githubusercontent.com/assets/853842/17482705/982472e4-5db5-11e6-9498-ea2913803f60.png)

* A wiki page.

![Wiki](https://cloud.githubusercontent.com/assets/853842/17482586/169a7494-5db5-11e6-9454-54abffba0a6f.png)

### About private repos

We use local storage to store the rendered contents for private repositories, the results could only be viewed in your own browser. And the contents will be deleted immediately.

### More details

* The formulas are rendered with [MathJax](https://www.mathjax.org/).
