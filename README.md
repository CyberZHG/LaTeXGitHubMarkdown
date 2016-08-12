LaTeX GitHub Markdown
=====================

[![travis-ci](https://travis-ci.org/CyberZHG/LaTeXGitHubMarkdown.svg)](https://travis-ci.org/CyberZHG/LaTeXGitHubMarkdown)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/bembdpjahbkabjdpdgdmalckbbcglhjb.svg?maxAge=2592000)](https://chrome.google.com/webstore/detail/latex-github-markdown/bembdpjahbkabjdpdgdmalckbbcglhjb)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/d/bembdpjahbkabjdpdgdmalckbbcglhjb.svg?maxAge=2592000)](https://chrome.google.com/webstore/detail/latex-github-markdown/bembdpjahbkabjdpdgdmalckbbcglhjb)
[![Gratipay User](https://img.shields.io/gratipay/user/CyberZHG.svg?maxAge=2592000)](https://gratipay.com/~CyberZHG/)

### Installation

[![Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_340x96.png)](https://chrome.google.com/webstore/detail/latex-github-markdown/bembdpjahbkabjdpdgdmalckbbcglhjb)

### Introduction

A chrome extension that adds `LaTeX` buttons to Markdown elements on GitHub.
The LaTeX formulas begin and end with `$` or `$$` are all rendered as inline style.
Following is an example:

$$\nabla \times \mathbf{B} = \displaystyle \mu_0\mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}} {\partial t}$$

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

### Help us improve

Due to the conflict of escape characters (`\`), some escape characters will be missing in LaTeX formulas.
We will try to recover the characters in some common situations.
However, if you find your formulas are not rendered correctly, please tell us with [issues](https://github.com/CyberZHG/LaTeXGitHubMarkdown/issues).

### About private repos

We use local storage to store the rendered contents for private repositories, the results could only be viewed in your own browser. And the contents will be deleted immediately.

### More details

* The formulas are rendered with [MathJax](https://www.mathjax.org/).
* Due to content security policy, we cannot render the formulas in the same page.
