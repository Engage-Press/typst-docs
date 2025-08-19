#!/usr/bin/env node
import * as fs from 'fs';
const docs = JSON.parse(fs.readFileSync('./output/docs.json'));

const types = {
    ['any']: {route: '', pill: 'pill-obj'},
    ['arguments']: {route: '/reference/foundations/arguments/', pill: 'pill-collect'},
    ['array']: {route: '/reference/foundations/array/', pill: 'pill-collect'},
    ['auto']: {route: '/reference/foundations/auto/', pill: 'pill-kw'},
    ['bool']: {route: '/reference/foundations/bool/', pill: 'pill-num'},
    ['bytes']: {route: '/reference/foundations/bytes/', pill: 'pill-collect'},
    ['content']: {route: '/reference/foundations/content/', pill: 'pill-con'},
    ['datetime']: {route: '/reference/foundations/datetime/', pill: 'pill-date'},
    ['decimal']: {route: '/reference/foundations/decimal/', pill: 'pill-num'},
    ['dictionary']: {route: '/reference/foundations/dictionary/', pill: 'pill-collect'},
    ['duration']: {route: '/reference/foundations/duration/', pill: 'pill-date'},
    ['float']: {route: '/reference/foundations/float/', pill: 'pill-num'},
    ['function']: {route: '/reference/foundations/function/', pill: 'pill-fn'},
    ['int']: {route: '/reference/foundations/int/', pill: 'pill-num'},
    ['label']: {route: '/reference/foundations/label/', pill: 'pill-meta'},
    ['module']: {route: '/reference/foundations/module/', pill: 'pill-fn'},
    ['none']: {route: '/reference/foundations/none/', pill: 'pill-kw'},
    ['regex']: {route: '/reference/foundations/regex/', pill: 'pill-str'},
    ['selector']: {route: '/reference/foundations/selector/', pill: 'pill-meta'},
    ['str']: {route: '/reference/foundations/str/', pill: 'pill-str'},
    ['symbol']: {route: '/reference/foundations/symbol/', pill: 'pill-str'},
    ['type']: {route: '/reference/foundations/type/', pill: 'pill-fn'},
    ['version']: {route: '/reference/foundations/version/', pill: 'pill-collect'},
    ['alignment']: {route: '/reference/layout/alignment/', pill: 'pill-layout'},
    ['angle']: {route: '/reference/layout/angle/', pill: 'pill-num'},
    ['direction']: {route: '/reference/layout/direction/', pill: 'pill-num'},
    ['fraction']: {route: '/reference/layout/fraction/', pill: 'pill-num'},
    ['length']: {route: '/reference/layout/length/', pill: 'pill-num'},
    ['ratio']: {route: '/reference/layout/ratio/', pill: 'pill-num'},
    ['relative']: {route: '/reference/layout/relative/', pill: 'pill-num'},
    ['color']: {route: '/reference/visualize/color/', pill: 'pill-col'},
    ['gradient']: {route: '/reference/visualize/gradient/', pill: 'pill-col'},
    ['stroke']: {route: '/reference/visualize/stroke/', pill: 'pill-col'},
    ['tiling']: {route: '/reference/visualize/tiling/', pill: 'pill-tiling'},
    ['counter']: {route: '/reference/visualize/counter/', pill: 'pill-obj'},
    ['location']: {route: '/reference/foundations/location/', pill: 'pill-meta'},
    ['state']: {route: '/reference/visualize/state/', pill: 'pill-obj'},
}

function indexDoc(doc, nesting) {
    const navNesting = `nav-nested`
    const docLink = `<a href="${doc.route}">${doc.title}</a>`;
    const theDiv = doc.children && doc.children.length > 0
          ? `<div class="nav-entry nav-children ${navNesting}">${docLink}${
              doc.children.map((child) => {return indexDoc(child, nesting + 1);}).join(" ")
            }</div>`
          : `<div class="nav-entry nav-no-children ${navNesting}">${docLink}</div>`;

    if (doc.part) {
        return `<div class="nav-part-heading ${navNesting}">${doc.part}</div>${theDiv}`;
    } else {
        return theDiv;
    }
}

const navBar = docs.map((doc) => {
    return indexDoc(doc, 0);
}).join("\n");

function monospace(st) {
    return `<span class="monospace">${st}</span>`
}

function htmlEncode(str) {
    // https://stackoverflow.com/a/57702435
    let buf = [];

    for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }

    return buf.join('');
}

function getHexCodePoint(num) {
    const codePointHex = num.toString(16);
    switch (codePointHex.length) {
    case 3:
        return `0${codePointHex}`
        break;
    case 2:
        return `00${codePointHex}`
        break;
    case 1:
        return `000${codePointHex}`
        break;
    default:
        return codePointHex;
        break;
    }
}

function outputShItemKeyValue(fn, key, value) {
    fs.appendFileSync(fn, '<div class="shorthand-item-entry">');
    fs.appendFileSync(fn, `<span class="shorthand-item-key">${key}:</span>`);
    fs.appendFileSync(fn, ` <span class="shorthand-item-value">${value}</span>`);
    fs.appendFileSync(fn, '</div>');
}

function outputShItem(fn, shItem) {
    const codePointHex = getHexCodePoint(shItem.codepoint);
    fs.appendFileSync(fn, `<div class="shorthand-item">`);
    outputShItemKeyValue(fn, 'Entity', `&#x${codePointHex};`);
    outputShItemKeyValue(fn, 'Name', monospace(shItem.name));
    outputShItemKeyValue(fn, 'Escape', monospace(
        `\\u{ ${codePointHex.toUpperCase()} }`));

    if (shItem.markupShorthand && shItem.mathShorthand) {
        if (shItem.markupShorthand === shItem.mathShorthand) {
            outputShItemKeyValue(fn, 'Shorthand',
                                 monospace(htmlEncode(shItem.mathShorthand)));
        } else {
            outputShItemKeyValue(fn, 'Markup Shorthand',
                                 monospace(shItem.markupShorthand));
            outputShItemKeyValue(fn, 'Math Shorthand',
                                 monospace(htmlEncode(shItem.mathShorthand)));
        }
    } else if (shItem.markupShorthand) {
        outputShItemKeyValue(fn, 'Shorthand (only in markup)',
                             monospace(shItem.markupShorthand));
    } else if (shItem.mathShorthand) {
        outputShItemKeyValue(fn, 'Shorthand (only in math)',
                             monospace(htmlEncode(shItem.mathShorthand)));
    }
    if (shItem.accent) {
        outputShItemKeyValue(fn, 'Accent', 'Yes');
    }
    if (shItem.mathClass) {
        outputShItemKeyValue(fn, 'Math Class', shItem.mathClass);
    }
    if (shItem.deprecation) {
        outputShItemKeyValue(fn, 'Deprecation', shItem.deprecation);
    }
    fs.appendFileSync(fn, "</div>");
}

function outputCategory(fn, doc, content) {
    fs.appendFileSync(fn, `<h1 id=summary>${content.title || doc.title}</h1>`);
    fs.appendFileSync(fn, content.details);
    if (content.items.length > 0) {
        fs.appendFileSync(fn, "<h2>Definitions</h2><ul class='definition-list'>");
        content.items.forEach((item) => {
            const cssClass = item.code ? 'definition-code' : 'definition-noncode';
            fs.appendFileSync(
                fn,
                `<li><a class="${cssClass}" href="${item.route}">${item.name}</a> &mdash; ${item.oneliner}</li>`
            );
        });
        fs.appendFileSync(fn, "</ul>");
    }

    if (content.shorthands) {
        fs.appendFileSync(fn, "<h2>Definitions</h2>");
        [
            ["markup", "Within Markup Mode"],
            ["math", "Within Math Mode"]
        ].forEach(([key, title]) => {
            fs.appendFileSync(fn, `<h3>${title}</h2>`);
            content.shorthands[key].forEach((shItem) => {
                outputShItem(fn, shItem);
            });
        });
    }
}

function outputTypeData(fn, typeName, tag = 'div', link = false, id=null) {
    const idStr = id ? `id=${id}` : ''
    const typeData = types[typeName];
    fs.appendFileSync(fn, `<${tag} ${idStr} class="pill ${typeData.pill}">`)
    if (link && typeName !== 'any') {
        fs.appendFileSync(fn, `<a href='${typeData.route}'>`);
        fs.appendFileSync(fn, typeName);
        fs.appendFileSync(fn, '</a>')
    } else {
        fs.appendFileSync(fn, typeName);
    }
    fs.appendFileSync(fn, `</${tag}>`);
}

function outputFunc(fn, content, id, headerLevel, paramLevel, overrideTitle = null) {
    const hx = `h${headerLevel}`;
    const title = overrideTitle ? overrideTitle : content.name;
    const titleId = headerLevel === 1 ? 'summary' : id;
    fs.appendFileSync(fn, `<${hx} id="${titleId}">${title}`);
    if (content.element) {
        fs.appendFileSync(fn, '<span class="param-predicate"> Element');
    }
    fs.appendFileSync(fn, `</${hx}>`)
    fs.appendFileSync(fn, content.details);

    if (headerLevel === 1) {
        fs.appendFileSync(fn, '<h2 id="parameters">Parameters</h2>');
    }

    const punct = '<span class="typ-punct">.</span>';

    const defPrefix = content.self
          ? `self${punct}`
          : content.path.length > 0
          ? `${content.path.join(punct)}${punct}`
          : '';
    fs.appendFileSync(fn, '<pre class="code-definition"><code>');
    fs.appendFileSync(
        fn, `${defPrefix}<span class="typ-func">${content.name}</span>(`);
    if (content.params.length === 1) {
        const param = content.params[0];
        const paramId = `${id}-${param.name}`;
        fs.appendFileSync(fn, '<span class="single-argument">');
        if (param.variadic) {
            fs.appendFileSync(fn, `<a href='#${paramId}'>.. </a>`);
        }
        if (!param.positional) {
            fs.appendFileSync(fn, `<a href='#${paramId}'>${param.name}: </a>`);
        }
        param.types.forEach((ty, i) => {
            outputTypeData(fn, ty, 'span', true);
        })
        fs.appendFileSync(fn, '</span>');
    } else if (content.params.length > 1) {
        fs.appendFileSync(fn, '<div class="arguments">');
        content.params.forEach((param) => {
            const paramId = `${id}-${param.name}`;
            fs.appendFileSync(fn, '<div class="argument">');
            if (param.variadic) {
                fs.appendFileSync(fn, `<a href='#${paramId}'>.. </a>`);
            }
            if (!param.positional) {
                fs.appendFileSync(fn, `<a href='#${paramId}'>${param.name}: </a>`);
            }
            param.types.forEach((ty) => {
                outputTypeData(fn, ty, 'span', true);
            })
            fs.appendFileSync(fn, ',</div>');
        })
        fs.appendFileSync(fn, '</div>')
    }
    fs.appendFileSync(fn, `) -&gt; `);
    content.returns.forEach((retType) => {
        outputTypeData(fn, retType, 'span', true);
    })
    fs.appendFileSync(fn, '</code></pre>');

    if (content.example) {
        fs.appendFileSync(fn, content.example);
    }
    if (content.deprecation) {
        fs.appendFileSync(fn, content.deprecation);
    }

    content.params.forEach((param) => {
        const hy = `h${paramLevel}`
        fs.appendFileSync(fn, `<${hy} id="${id}-${param.name}">`);
        fs.appendFileSync(fn, `<span class="param-container">`);
        fs.appendFileSync(fn, `<span class="param-title">${param.name}</span>`);
        param.types.forEach((ty) => {
            outputTypeData(fn, ty, 'span', true);
        })
        if (param.required) {
            fs.appendFileSync(fn, '<span class="param-predicate">Required</span>')
        }
        if (param.positional) {
            fs.appendFileSync(fn, '<span class="param-predicate">Positional</span>')
        }
        if (param.variadic) {
            fs.appendFileSync(fn, '<span class="param-predicate">Variadic</span>')
        }
        if (param.settable) {
            fs.appendFileSync(fn, '<span class="param-predicate">Settable</span>')
        }
        if (param.named) {
            fs.appendFileSync(fn, '<span class="param-predicate">Named</span>')
        }
        fs.appendFileSync(fn, `</span></${hy}>`);
        fs.appendFileSync(fn, param.details);
        if (param['default']) {
            fs.appendFileSync(fn, `<p>Default: <code>${param['default']}</code></p>`)
        }
        if (param.example) {
            fs.appendFileSync(fn, param.example);
        }
    })

    if (content.scope?.length > 0) {
        if (headerLevel === 1) {
            fs.appendFileSync(fn, '<h2 id="parameters">Parameters</h2>');

            content.scope.forEach((scoped) => {
                outputFunc(fn, scoped, `definitions-${scoped.name}`, 3, 4)
            });
        } else {
            content.scope.forEach((scoped) => {
                outputFunc(fn, scoped, `${id}-${scoped.name}`, headerLevel+1, headerLevel+2)
            });
        }
    }
}

function outputTypeDoc(fn, doc, content) {
    outputTypeData(fn, content.name, 'h1', false, 'summary')
    fs.appendFileSync(fn, content.details);
    if (content.constructor) {
        outputFunc(fn, content.constructor, 'constructor', 2, 4, 'Constructor');
    }
    if (content.scope?.length > 0) {
        fs.appendFileSync(fn, `<h2 id="definitions">Definitions</h2>`);
        content.scope.forEach((scoped) => {
            outputFunc(fn, scoped, `definitions-${scoped.name}`, 3, 4)
        })
    }
}

function outputFuncDoc(fn, doc, content) {
    outputFunc(fn, content, 'parameters', 1, 3, content.title);
}

function outputGroupDoc(fn, doc, content) {
    fs.appendFileSync(fn, `<h1 id=summary>${content.title}</h1>`);
    fs.appendFileSync(fn, content.details);
    fs.appendFileSync(fn, `<h2 id="functions">Functions</h2>`);
    content.functions.forEach((scoped) => {
        outputFunc(fn, scoped, `functions-${scoped.name}`, 3, 4);
    })
}

function docHeader(fn, doc, crumbs) {
    fs.appendFileSync(fn, '<!DOCTYPE html><html><head>');
    fs.appendFileSync(fn, '<meta charset="utf-8">');
    fs.appendFileSync(fn, `<title>${doc.title}</title>`);
    fs.appendFileSync(fn, '<link rel="stylesheet" href="/assets/style.css">');
    fs.appendFileSync(fn, '<script src="/assets/widen.js" defer></script>');
    fs.appendFileSync(fn, '<meta name="viewport" content="width=device-width, initial-scale=1">');
    fs.appendFileSync(fn, `<meta name="x-typst-kind" content="${doc.body.kind}">`);
    fs.appendFileSync(fn, '</head><body>');

    fs.appendFileSync(fn, '<div id="main-grid">');

    fs.appendFileSync(fn, '<nav>');
    fs.appendFileSync(fn, navBar);
    fs.appendFileSync(fn, '</nav>');

    fs.appendFileSync(fn, '<main>');

    const crumbSep = '<li aria-hidden=true>/</li>';
    fs.appendFileSync(fn, '<ul class=breadcrumbs>')
    fs.appendFileSync(fn, '<li class=root><a href="/">Docs</a></li>')
    fs.appendFileSync(fn, crumbSep)
    fs.appendFileSync(fn, crumbs.map((breadcrumb) => {
        return `<li><a href=${breadcrumb.route}>${breadcrumb.title}</a></li>`;
    }).concat(`<li><a href=${doc.route}>${doc.title}</a></li>`).join(crumbSep))
    fs.appendFileSync(fn, '</ul>')
}

function outputNavNode(fn, node) {
    fs.appendFileSync(fn, '<li class="outline-entry">');
    fs.appendFileSync(fn, `<a href="#${node.id}">${node.name}</a>`)

    if (node.children && node.children.length > 0) {
        fs.appendFileSync(fn, '<ul class="outline">');
        node.children.forEach((child) => {
            outputNavNode(fn, child);
        })
        fs.appendFileSync(fn, '</ul>');
    }

    fs.appendFileSync(fn, '</li>');
}

function docNav(fn, doc) {
    if (doc.outline && doc.outline.length > 0) {
        fs.appendFileSync(fn, '<nav id=\'page-outline\'>');
        fs.appendFileSync(fn, '<strong>On this page</strong>');
        fs.appendFileSync(fn, '<ul class="outline">');
        doc.outline.forEach((node) => {
            outputNavNode(fn, node);
        })
        fs.appendFileSync(fn, '</ul>');
        fs.appendFileSync(fn, '</nav>');
        fs.appendFileSync(fn, '</nav>');
    }
}

function docFooter(fn, doc, routeSlashed) {
    const date = new Date().toString();
    fs.appendFileSync(fn, '<footer>');
    fs.appendFileSync(fn, `<p>This page is an unofficial mirror, generated ${date}`);
    fs.appendFileSync(fn, ' using <a href="https://github.com/Engage-Press/typst-docs">Engage-Press/typst-docs</a></p>');
    fs.appendFileSync(fn, '<p>A newer version of this page may be available at the');
    fs.appendFileSync(fn, ` <a href="https://typst.app/docs${routeSlashed}">upstream url for ${doc.title}</a></p>`);

    fs.appendFileSync(fn, '</footer></body></html>');
}

function outputDoc(doc, breadcrumbs=[]) {
    const routeSlashed = doc.route.startsWith("/")
          ? doc.route.endsWith("/")
          ? doc.route
          : `${doc.route}/`
          : doc.route.endsWith("/")
          ? `/${doc.route}`
          : `/${doc.route}/`;
    fs.mkdirSync(`output${routeSlashed}`, { recursive: true });
    const fn = `output${routeSlashed}index.html`;
    fs.rmSync(fn, { force: true });
    docHeader(fn, doc, breadcrumbs ?? []);
    switch (doc.body.kind) {
    case "html":
        fs.appendFileSync(fn, doc.body.content);
        break;
    case "category":
        outputCategory(fn, doc, doc.body.content);
        break;
    case "type":
        outputTypeDoc(fn, doc, doc.body.content);
        break;
    case "func":
        outputFuncDoc(fn, doc, doc.body.content);
        break;
    case "group":
        outputGroupDoc(fn, doc, doc.body.content);
        break;
    case "symbols":
        fs.appendFileSync(fn, `<h1 id=summary>${doc.body.content.title}</h1>`);
        fs.appendFileSync(fn, doc.body.content.details);
        doc.body.content.list.forEach((shItem) => {
            outputShItem(fn, shItem);
        });
        break;
    default:
        const key = doc.body.kind;
        console.log(
            `${doc.route} ${doc.title}: Unknown kind ${doc.body.kind}: ${JSON.stringify(doc.body)}`);
        if (unknownKinds[key]) {
            unknownKinds[key].unshift(doc.title);
        } else {
            unknownKinds[key] = [doc.title];
        }
        fs.appendFileSync(fn, doc.body.content.details);
    }
    fs.appendFileSync(fn, '</main>');
    docNav(fn, doc);
    fs.appendFileSync(fn, '</div>');
    docFooter(fn, doc, routeSlashed);
    doc.children.forEach((child) => {
        outputDoc(child, [...breadcrumbs, { title: doc.title, route: routeSlashed }]);
    });
}

const unknownKinds = {};

docs.forEach((doc) => outputDoc(doc, []));

if (Object.keys(unknownKinds).length > 0) {
    console.log("Unknown document kinds:")
    Object.keys(unknownKinds).forEach((kind) => {
        console.log(`${kind}\t[${unknownKinds[kind].reverse().join()}]`)
    });
}

fs.copyFileSync('style.css', 'output/assets/style.css');
fs.copyFileSync('widen.js', 'output/assets/widen.js');
