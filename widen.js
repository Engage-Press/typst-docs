function fixPreviewWidths() {
    const previewDivs = document.getElementsByClassName('previewed-code');
    Array.from(previewDivs).forEach((theDiv) => {
        const thePre = theDiv.childNodes[0];
        const theCode = thePre.childNodes[0];

        if (thePre.getBoundingClientRect().width < theCode.getBoundingClientRect().width) {
            thePre.setAttribute('class', 'big');
        }
    })
}

fixPreviewWidths();
