LaTeX GitHub Markdown
=====================

[![travis-ci](https://travis-ci.org/CyberZHG/LaTeXGitHubMarkdown.svg)](https://travis-ci.org/CyberZHG/LaTeXGitHubMarkdown)

### Installation

Chrome Web Store: [LaTeX GitHub Markdown](https://chrome.google.com/webstore/detail/latex-github-markdown/bembdpjahbkabjdpdgdmalckbbcglhjb)

### Introduction

A chrome extension that adds `LaTeX` buttons to Markdown elements on GitHub.
The LaTeX formulas begin and end with `$` or `$$` are all rendered as inline style.
Following is an example:

$$\nabla \times \mathbf{B} = \displaystyle \mu_0\mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}} {\partial t}$$

If you successfully installed this extension, you can see the `LaTeX` buttons in the right-top corner of the Markdown documents:

![README.md](https://cloud.githubusercontent.com/assets/853842/17482634/446e99f4-5db5-11e6-9ec2-55c976dfe970.png)

![Issue](https://cloud.githubusercontent.com/assets/853842/17482548/df9b9f40-5db4-11e6-8544-d00bf0c05a9c.png)

![Gist](https://cloud.githubusercontent.com/assets/853842/17482705/982472e4-5db5-11e6-9498-ea2913803f60.png)

![Wiki](https://cloud.githubusercontent.com/assets/853842/17482586/169a7494-5db5-11e6-9454-54abffba0a6f.png)

You can see the `LaTeX` button in the following elements:

* The default `README.md`.
* The Markdown file in a repository.
* The comments in a issue.
* Gist file whose extension is `.md`.

### More details

* The formulas are rendered with [MathJax](https://www.mathjax.org/).
* Due to content security policy, we cannot render the formulas in the same page.
