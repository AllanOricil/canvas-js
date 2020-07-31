export const getTextHeight = function ({
    fontFamily,
    fontSize,
    fontWeight,
    element
}) {
    const doc = element || document.body;
    var text = document.createElement('span');
    text.innerHTML = 'Hg';
    text.setAttribute('style', `font-family: ${fontFamily} !important; font-size: ${fontSize}px !important; font-weight:${fontWeight} !important;`);
    var block = document.createElement('div');
    block.style.display = 'inline-block';
    block.style.width = '1px';
    block.style.height = '0px';
    var div = document.createElement('div');
    div.appendChild(text);
    div.appendChild(block);
    doc.appendChild(div);
    try {
        var result = {};
        block.style.verticalAlign = 'baseline';
        result.ascent = block.offsetTop - text.offsetTop;
        block.style.verticalAlign = 'bottom';
        result.height = block.offsetTop - text.offsetTop;
        result.descent = result.height - result.ascent;
    } finally {
        div.remove();
    }
    return result;
};