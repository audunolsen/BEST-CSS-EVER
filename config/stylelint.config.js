module.exports = {
    
    plugins: [
        "stylelint-order",
        "stylelint-scss"
    ],
    
    defaultSeverity: "warning",
    
    rules: {
        
        /* Rules from https://stylelint.io/user-guide/rules/list
           Fetched 25.03.2020 */
           
        // ———— 1. POSSIBLE ERRORS ———— 
        
        // COLOR
        "color-no-invalid-hex": err(true),
        
        // FONT
        "font-family-no-duplicate-names"                : err(true),
        "font-family-no-missing-generic-family-keyword" : err(true),
        
        // FUNCTION 
        "function-calc-no-invalid"                          : err(true), 
        "function-calc-no-unspaced-operator"                : err(true),
        "function-linear-gradient-no-nonstandard-direction" : err(true),
        
        // STRING
        "string-no-newline": err(true),
        
        // UNIT
        "unit-no-unknown": err(true),
        
        // PROPERTY
        "property-no-unknown": err(true),
        
        // KEYFRAME DECLARATION
        "keyframe-declaration-no-important": err(true),
        
        // DECKLARATION BLOCK
        "declaration-block-no-duplicate-properties"         : err(true),
        "declaration-block-no-shorthand-property-overrides" : err(true),
        
        // BLOCK
        "block-no-empty": err(true),
        
        // SELECTOR
        "selector-pseudo-class-no-unknown"   : err(true),
        "selector-pseudo-element-no-unknown" : err(true),
        "selector-type-no-unknown"           : err(true),
        
        // MEDIA FEATURE
        "media-feature-name-no-unknown": err(true),
        
        // AT RULE
        "at-rule-no-unknown": err(true, {
            ignoreAtRules: [ // Ignore all Sass funcitonality
                "use",
                "forward",
                "mixin",
                "if",
                "else",
                "each",
                "for",
                "while",
                "include",
                "funtion",
                "extend",
                "content",
                "error",
                "warn",
                "debug",
                "at-root"
            ]
        }),
        
        // COMMENT
        "comment-no-empty": err(true),
        
        // GENERAL / SHEET
        "no-descending-specificity"        : err(true),
        "no-duplicate-at-import-rules"     : err(true),
        "no-duplicate-selectors"           : err(true),
        // "no-empty-source"                  : null,
        "no-extra-semicolons"              : err(true),
        // "no-invalid-double-slash-comments" : null,
        
        // ———— 2. LIMIT LANGUAGE FEATURES ———— 
        
        // COLOR
        "color-named"  : "always-where-possible",
        // "color-no-hex" : null,
        
        // FUNCTION
        // "function-blacklist"              : null,
        // "function-whitelist"              : null,
        "function-url-no-scheme-relative" : true,
        // "function-url-scheme-blacklist"   : null,
        // "function-url-scheme-whitelist"   : null,
        
        // KEYFRAMES
        // "keyframes-name-pattern": null,
        
        // NUMBER
        // "number-max-precision": null,
        
        // TIME
        // "time-min-milliseconds": null,
        
        // UNIT
        // "unit-blacklist" : null,
        // "unit-whitelist" : null,
        
        // SHORTHAND PROPERTY
        "shorthand-property-no-redundant-values": true,
        
        // VALUE
        "value-no-vendor-prefix": true,
        
        // CUSTOM PROPERTY
        // "custom-property-pattern": null,
        
        // PROPERTY
        // "property-blacklist"        : null,
        "property-no-vendor-prefix" : true,
        // "property-whitelist"        : null,
        
        // DECLARATION
        "declaration-block-no-redundant-longhand-properties" : true,
        "declaration-no-important"                           : true,
        // "declaration-property-unit-blacklist"                : null,
        // "declaration-property-unit-whitelist"                : null,
        // "declaration-property-value-blacklist"               : null,
        // "declaration-property-value-whitelist"               : null,
        
        // DECLARATION BLOCK
        "declaration-block-single-line-max-declarations": 1,
        
        // SELECTOR
        // "selector-attribute-operator-blacklist" : null,
        // "selector-attribute-operator-whitelist" : null, 
        // "selector-class-pattern"                : null,
        // "selector-combinator-blacklist"         : null,
        // "selector-combinator-whitelist"         : null,
        // "selector-id-pattern"                   : null,
        // "selector-max-attribute"                : null,
        // "selector-max-class"                    : null,
        // "selector-max-combinators"              : null,
        // "selector-max-compound-selectors"       : null,
        "selector-max-empty-lines"              : 0,
        // "selector-max-id"                       : null,
        // "selector-max-pseudo-class"             : null,
        // "selector-max-specificity"              : null,
        // "selector-max-type"                     : null,
        // "selector-max-universal"                : null,
        // "selector-nested-pattern"               : null,
        // "selector-no-qualifying-type"           : null,
        "selector-no-vendor-prefix"             : true,
        // "selector-pseudo-class-blacklist"       : null,
        // "selector-pseudo-class-whitelist"       : null,
        // "selector-pseudo-element-blacklist"     : null,
        // "selector-pseudo-element-whitelist"     : null,
        
        // MEDIA FEATURE
        // "media-feature-name-blacklist"        : null,
        "media-feature-name-no-vendor-prefix" : true,
        // "media-feature-name-value-whitelist"  : null,
        // "media-feature-name-whitelist"        : null,
        
        // CUSTOM MEDIA
        // "custom-media-pattern": null,
        
        // AT-RULE
        // "at-rule-blacklist"            : null,
        "at-rule-no-vendor-prefix"     : true,
        // "at-rule-property-requirelist" : null,
        // "at-rule-whitelist"            : null,
        
        // COMMENT
        // "comment-word-blacklist": null,
        
        // GENERAL / SHEET
        "max-nesting-depth"     : 3,
        // "no-unknown-animations" : null,
        
        // ———— 3. STYLISTIC ISSUES ———— 
        
        // COLOR
        "color-hex-case"   : "upper",
        "color-hex-length" : "short",
        
        // FONT
        "font-family-name-quotes" : "always-unless-keyword",
        // "font-weight-notation"    : null,
        
        // FUNCTION
        "function-comma-newline-after"        : "always-multi-line",
        "function-comma-newline-before"       : "never-multi-line",
        "function-comma-space-after"          : "always",
        "function-comma-space-before"         : "never",
        "function-max-empty-lines"            : 0,
        "function-name-case"                  : "lower",
        "function-parentheses-newline-inside" : "always-multi-line",
        "function-parentheses-space-inside"   : "never",
        "function-url-quotes"                 : "always",
        "function-whitespace-after"           : "always",
        
        // NUMBER
        "number-leading-zero"      : "never",
        "number-no-trailing-zeros" : true,
        
        // STRING
        "string-quotes": "double",
        
        // LENGTH:
        "length-zero-no-unit": true,
        
        // UNIT
        "unit-case": "lower",
        
        // VALUE
        "value-keyword-case": "lower",
        
        // VALUE LIST
        "value-list-comma-newline-after"  : "always-multi-line",
        "value-list-comma-newline-before" : "never-multi-line",
        "value-list-comma-space-after"    : "always",
        "value-list-comma-space-before"   : "never",
        "value-list-max-empty-lines"      : 0,
        
        // CUSTOM PROPERTY
        "custom-property-empty-line-before": "never",
        
        // PROPERTY
        "property-case": "lower",
        
        // DECLARATION
        "declaration-bang-space-after"    : "never",
        "declaration-bang-space-before"   : "always",
        "declaration-colon-newline-after" : "always-multi-line",
        "declaration-colon-space-after"   : "always-single-line",
        "declaration-colon-space-before"  : "never",
        "declaration-empty-line-before"   : "never", 
        
        // DECLARATION BLOCK
        "declaration-block-semicolon-newline-after"  : "always",
        "declaration-block-semicolon-newline-before" : "never-multi-line",
        "declaration-block-semicolon-space-after"    : "always-single-line",
        "declaration-block-semicolon-space-before"   : "never",
        "declaration-block-trailing-semicolon"       : "always",
        
        // BLOCK
        "block-closing-brace-empty-line-before" : ["never", {"except": ["after-closing-brace"]}],
        "block-closing-brace-newline-after"     : "always",
        "block-closing-brace-newline-before"    : "always-multi-line",
        // "block-closing-brace-space-after"       : "never", // Does this one work?
        "block-closing-brace-space-before"      : "always-single-line",
        "block-opening-brace-newline-after"     : "always-multi-line",
        // "block-opening-brace-newline-before"    : null,
        "block-opening-brace-space-after"       : "always-single-line",
        "block-opening-brace-space-before"      : "always",
        
        // SELECTOR
        "selector-attribute-brackets-space-inside"       : "never",
        "selector-attribute-operator-space-after"        : "always",
        "selector-attribute-operator-space-before"       : "always",
        "selector-attribute-quotes"                      : "always",
        "selector-combinator-space-after"                : "always",
        "selector-combinator-space-before"               : "always",
        // "selector-descendant-combinator-no-non-space"    : null,
        "selector-pseudo-class-case"                     : "lower",
        "selector-pseudo-class-parentheses-space-inside" : "never",
        "selector-pseudo-element-case"                   : "lower",
        "selector-pseudo-element-colon-notation"         : "double",
        "selector-type-case"                             : "lower",
        
        // SELECTOR LIST
        "selector-list-comma-newline-after"  : "always-multi-line",
        "selector-list-comma-newline-before" : "never-multi-line",
        "selector-list-comma-space-after"    : "always",
        "selector-list-comma-space-before"   : "never",
        
        // RULE
        "rule-empty-line-before": ["always-multi-line", {
            "ignore": ["after-comment", "first-nested", "inside-block"]
        }],
        
        // MEDIA FEATURE
        "media-feature-colon-space-after"           : "always",
        "media-feature-colon-space-before"          : "never",
        "media-feature-name-case"                   : "lower",
        "media-feature-parentheses-space-inside"    : "never",
        "media-feature-range-operator-space-after"  : "always",
        "media-feature-range-operator-space-before" : "always",
        
        // MEDIA QUERY LIST
        "media-query-list-comma-newline-after"  : "always-multi-line",
        "media-query-list-comma-newline-before" : "never-multi-line",
        "media-query-list-comma-space-after"    : "always-single-line",
        "media-query-list-comma-space-before"   : "never",
        
        // AT-RULE
        "at-rule-empty-line-before"       : "always",
        "at-rule-name-case"               : "lower",
        // "at-rule-name-newline-after"      : null,
        "at-rule-name-space-after"        : "always-single-line",
        "at-rule-semicolon-newline-after" : "always",
        "at-rule-semicolon-space-before"  : "never",
        
        // COMMENT
        "comment-empty-line-before" : "always",
        "comment-whitespace-inside" : "always",
        
        // GENERAL / SHEET
        "indentation"                      : 4,
        // "linebreaks"                       : null,
        "max-empty-lines"                  : 1,
        "max-line-length"                  : 80,
        "no-eol-whitespace"                : true,
        // "no-missing-end-of-source-newline" : null,
        // "no-empty-first-line"              : null,
        // "unicode-bom"                      : null,
        
        // ———— 3. PLUGINS ———— 
        
        // "scss/at-each-key-value-single-line": ,
        // 
        // "scss/at-if-closing-brace-newline-after": ,
        // "scss/at-if-closing-brace-space-after": ,
        // "scss/at-if-no-null": ,
        // 
        // "scss/at-else-closing-brace-newline-after": ,
        // "scss/at-else-closing-brace-space-after": ,
        // "scss/at-else-empty-line-before": ,
        // "scss/at-else-if-parentheses-space-before": ,
        // 
        // "scss/at-extend-no-missing-placeholder": ,
        // 
        // "scss/at-function-named-arguments": ,
        // "scss/at-function-parentheses-space-before": ,
        // "scss/at-function-pattern": ,
        // 
        // "scss/at-import-no-partial-leading-underscore": ,
        // "scss/at-import-partial-extension": ,
        // "scss/at-import-partial-extension-blacklist": ,
        // "scss/at-import-partial-extension-whitelist": ,
        // 
        // "scss/at-mixin-argumentless-call-parentheses": ,
        // "scss/at-mixin-named-arguments": ,
        // "scss/at-mixin-parentheses-space-before": ,
        // "scss/at-mixin-pattern": ,
        // 
        // "scss/at-rule-conditional-no-parentheses": ,
        // "scss/at-rule-no-unknown": ,
        // 
        // "scss/dollar-variable-colon-newline-after": ,
        // "scss/dollar-variable-colon-space-after": ,
        // "scss/dollar-variable-colon-space-before": ,
        // "scss/dollar-variable-default": ,
        // "scss/dollar-variable-empty-line-after": ,
        // "scss/dollar-variable-empty-line-before": ,
        // "scss/dollar-variable-first-in-block": ,
        // "scss/dollar-variable-no-missing-interpolation": ,
        // "scss/dollar-variable-pattern": ,
        // 
        // "scss/percent-placeholder-pattern": ,
        // 
        // "scss/double-slash-comment-empty-line-before": ,
        // "scss/double-slash-comment-inline": ,
        // "scss/double-slash-comment-whitespace-inside": ,
        // "scss/comment-no-loud": ,
        // 
        // "scss/declaration-nested-properties": ,
        // "scss/declaration-nested-properties-no-divided-groups": ,
        // 
        // "scss/dimension-no-non-numeric-values": ,
        // 
        // "scss/function-color-relative": ,
        // "scss/function-quote-no-quoted-strings-inside": ,
        // "scss/function-unquote-no-unquoted-strings-inside": ,
        // 
        // "scss/map-keys-quotes": ,
        // 
        // "scss/media-feature-value-dollar-variable": ,
        // 
        // "scss/operator-no-newline-after": ,
        // "scss/operator-no-newline-before": ,
        // "scss/operator-no-unspaced": ,
        // 
        // "scss/partial-no-import": ,
        // 
        // "scss/selector-nest-combinators": ,
        // "scss/selector-no-redundant-nesting-selector": ,
        // "scss/selector-no-union-class-name": ,
        // 
        // "scss/no-dollar-variables" : ,
        // "scss/no-duplicate-dollar-variables" : ,
        // "scss/no-duplicate-mixins" : ,
        // "scss/no-global-function-names" : ,
        
        "order/properties-order": [
            {
                groupName: "Reset",
                // order: null,
                // emptyLineBefore: null,
                properties: ["all"]
            },
            
            // AFFECTS OUTER — PLACEMENT AND BOX MODEL
            
            {
                groupName: "Positioning",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    
                    "position",
                    "top",
                    "right",
                    "bottom", 
                    "left",
                    
                    "inset",
                    "inset-block",
                    "inset-block-end",
                    "inset-block-start",
                    "inset-inline",
                    "inset-inline-end",
                    "inset-inline-start",
                    
                    "float",
                    "clear",
                    
                    "vertical-align",
                    
                    "z-index",
                    
                    "display",
                    
                    "grid-area", // shorthand
                    "grid-row",
                    "grid-row-start",
                    "grid-row-end",
                    "grid-column",
                    "grid-column-start",
                    "grid-column-end",
                    
                    "place-self", // shorthand
                    "align-self",
                    "justify-self"
                    
                ]
            },
            {
                groupName: "Box-Model",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    
                    "box-sizing",
                    
                    "width",
                    "min-width",
                    "max-width",
                    
                    "height",
                    "min-height",
                    "max-height",
                    
                    "inline-size",
                    "min-inline-size",
                    "max-inline-size",
                    
                    "block-size",
                    "min-block-size",
                    "max-block-size",
                    
                    "padding", // shorthand
                    "padding-top",
                    "padding-right",
                    "padding-bottom",
                    "padding-left",
                    
                    "padding-block",
                    "padding-block-end",
                    "padding-block-start",
                    "padding-inline",
                    "padding-inline-end",
                    "padding-inline-start",
                    
                    /* only border properties which affect box-model sizing */
                    "border", // shorthand
                    "border-width",
                    "border-top",
                    "border-top-width",
                    "border-right",
                    "border-right-width",
                    "border-bottom",
                    "border-bottom-width",
                    "border-left",
                    "border-left-width",
                    
                    "border-block",
                    "border-block-width",
                    "border-block-start",
                    "border-block-start-width",
                    "border-block-end",
                    "border-block-end-width",
                    
                    "border-inline",
                    "border-inline-width",
                    "border-inline-start",
                    "border-inline-start-width",
                    "border-inline-end",
                    "border-inline-end-width",
                    
                    "border-collapse",                    
                    "border-spacing",
                    
                    "margin", // shorthand
                    "margin-top",
                    "margin-right",
                    "margin-bottom",
                    "margin-left",
                    
                    "margin-block",
                    "margin-block-end",
                    "margin-block-start",
                    
                    "margin-inline",
                    "margin-inline-end",
                    "margin-inline-start",
                    
                    "shape-outside",
                    "shape-margin",
                    "shape-image-threshold",
                    
                    "resize"
                    
                ]
            },
            
            // AFFECTS INNER - Layout, type, visuals, etc…
            
            {
                groupName: "Content & content layout",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    
                    "content",
                    "counter-increment",
                    "counter-reset",
                    "counter-set",
                    
                    "grid", // shorthand
                    "grid-auto-rows",
                    "grid-auto-columns",
                    "grid-auto-flow",
                    "grid-template", // shorthand
                    "grid-template-rows",
                    "grid-template-columns",
                    "grid-template-areas",                
                    
                    "gap",
                    "row-gap",
                    
                    "flex", // shorthand
                    "flex-grow",
                    "flex-shrink",
                    "flex-basis",
                    
                    "flex-flow", // shorthand
                    "flex-direction",
                    "flex-wrap",
                    
                    "place-items", // shorthand
                    "align-items",
                    "justify-items",
                    
                    "place-content", // shorthand
                    "align-content",
                    "justify-content",
                    
                    "order",// bottom because both grid and flex
                    
                    "table-layout",
                    "caption-side",
                    "empty-cells",
                    
                    // move overflow properties ?
                    "overflow", // shorthand
                    "overflow-x",
                    "overflow-y",
                    
                    "overflow-anchor",
                    "overflow-block",
                    "overflow-inline",
                    
                ]
            },
            {
                groupName: "Typography",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    
                    "font", // shorthand
                    "font-style",
                    "font-variant", // shorthand
                        "font-variant-caps",
                        "font-variant-numeric",
                        "font-variant-alternates",
                        "font-variant-ligatures",
                        "font-variant-east-asian",
                        "font-variant-position",
                    "font-weight",
                    "font-stretch",
                    "font-size",
                    "line-height",
                    "font-family",
                    
                    "font-variation-settings",
                    "font-kerning",
                    "font-size-adjust",
                    "font-synthesis",
                    "font-feature-settings",
                    
                    "text-decoration", // shorthand
                    "text-decoration-color",
                    "text-decoration-style",
                    "text-decoration-line",
                    
                    "text-decoration-thickness",
                    "text-decoration-skip-ink",
                    "letter-spacing",
                    "text-transform",
                    "text-shadow",
                    "text-underline-offset",
                    "text-underline-position",
                    
                    "text-emphasis", // shorthand
                    "text-emphasis-style",
                    "text-emphasis-color",
                    "text-emphasis-position",
                    
                    // Rendering optimizations
                    "text-rendering",
                    "font-optical-sizing",
                    
                    // Glyph settings
                    "quotes",
                    "hyphens",
                    "tab-size",
                    "white-space",
                    
                    // Body text
                    "text-align",
                    "text-align-last",
                    "text-indent",
                    "word-spacing",
                    "word-break",
                    "overflow-wrap",
                    "hanging-punctuation",
                    "text-overflow",
                    "text-justify",
                    
                    // Type layout
                    "columns", // shorthand
                    "column-width",
                    "column-count",
                    
                    "column-rule", // shorthand
                    "column-rule-width",
                    "column-rule-style",
                    "column-rule-color",
                    
                    "column-fill",
                    "column-gap",
                    "column-span",
                    
                    "page-break-after",
                    "page-break-before",
                    "page-break-inside",
                    "break-after",
                    "break-before",
                    "break-inside",
                    
                    "widows",
                    "orphans",
                    
                    // Language
                    "unicode-bidi",
                    "direction",
                    "font-language-override",
                    "writing-mode",
                    "text-combine-upright",
                    "text-orientation",
                    "line-break"
                    
                ]
            },
            {
                groupName: "Visual",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    
                    // Affects whole element
                    "opacity",
                    "visibility",
                    
                    "transform",
                    "transform-box",
                    "transform-origin",
                    "transform-style",
                    "perspective",
                    "perspective-origin",
                    "backface-visibility",
                    
                    "filter",
                    "mix-blend-mode",
                    "isolation",
                    "backdrop-filter",
                    
                    "clip", // deprecatod - disallow
                    "clip-path",
                    
                    "mask", // shorthand
                    "mask-image",
                    "mask-mode",
                    "mask-repeat",
                    "mask-position",
                    "mask-clip",
                    "mask-origin",
                    "mask-size",
                    "mask-composite",
                    "mask-type",
                    
                    "mask-border", // shorthand
                    "mask-border-mode",
                    "mask-border-outset",
                    "mask-border-repeat",
                    "mask-border-slice",
                    "mask-border-source",
                    "mask-border-width",                    
                    
                    "rotate",    // should be disabled (firefox only)
                    "scale",     // should be disabled (firefox only)
                    "translate", // should be disabled (firefox only)
                    
                    // Outer & border
                    "outline", // shorthand
                    "outline-color",
                    "outline-style",
                    "outline-width",
                    "outline-offset",
                    
                    "box-shadow",
                    "box-decoration-break",
                    
                    "border-color",
                    "border-style",
                    "border-radius",
                    
                    "border-image", // shorthand
                    "border-image-source",
                    "border-image-slice",
                    "border-image-width",
                    "border-image-outset",
                    "border-image-repeat",
                    
                    "border-top-color",
                    "border-top-style",
                    "border-top-left-radius",
                    "border-top-right-radius",
                    
                    "border-right-color",
                    "border-right-style",
                    
                    "border-bottom-color",
                    "border-bottom-style",
                    "border-bottom-left-radius",
                    "border-bottom-right-radius",
                    
                    "border-left-color",
                    "border-left-style",
                    
                    "border-start-end-radius",
                    "border-start-start-radius",
                    "border-end-end-radius",
                    "border-end-start-radius",
                    
                    "border-block-color",
                    "border-block-style",
                    "border-block-start-color",
                    "border-block-start-style",
                    "border-block-end-color",
                    "border-block-end-style",
                    
                    "border-inline-color",
                    "border-inline-style",
                    "border-inline-start-color",
                    "border-inline-start-style",
                    "border-inline-end-color",
                    "border-inline-end-style",
                    
                    // Background
                    
                    "background", // shorthand
                    "background-image",
                    "background-position",
                    "background-size",
                    "background-repeat",
                    "background-origin",
                    "background-clip",
                    "background-attachment",
                    "background-color",
                    "background-blend-mode",
                    
                    "object-fit",
                    "object-position",
                    
                    // Foreground
                    
                    "color",
                    
                    "list-style", // shorthand
                    "list-style-type",
                    "list-style-position",
                    "list-style-image",
                    
                    "caret-color",
                    "cursor"
                    
                ]
            },
            {
                groupName: "Scroll behaviour & scrollbar styling",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    
                    "scroll-behavior",
                    
                    "overscroll-behavior", // shorthand
                    "overscroll-behavior-x",
                    "overscroll-behavior-y",
                    
                    "overscroll-behavior-block",
                    "overscroll-behavior-inline",
                    
                    "scroll-margin", // shorthand
                    "scroll-margin-top",
                    "scroll-margin-right",
                    "scroll-margin-left",
                    "scroll-margin-bottom",
                    
                    "scroll-margin-block",
                    "scroll-margin-block-start",
                    "scroll-margin-block-end",
                    
                    "scroll-margin-inline",
                    "scroll-margin-inline-start",
                    "scroll-margin-inline-end",
                    
                    "scroll-padding", // shorthand
                    "scroll-padding-top",
                    "scroll-padding-right",
                    "scroll-padding-bottom",
                    "scroll-padding-left",
                    
                    "scroll-padding-block",
                    "scroll-padding-block-start",
                    "scroll-padding-block-end",
                    
                    "scroll-padding-inline",
                    "scroll-padding-inline-start",
                    "scroll-padding-inline-end",
                    
                    "scroll-snap-align",
                    "scroll-snap-stop",
                    "scroll-snap-type",
                    
                    "scrollbar-color",
                    "scrollbar-width"
                    
                ]
            },
            {
                groupName: "Animation",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    
                    'transition', // shorthand
                    'transition-delay',
                    'transition-duration',
                    'transition-property',
                    'transition-timing-function',
                    
                    "animation", // shorthand
                    "animation-name",
                    "animation-duration",
                    "animation-timing-function",
                    "animation-delay",
                    "animation-iteration-count",
                    "animation-direction",
                    "animation-fill-mode",
                    "animation-play-state",
                    
                    "offset", // shorthand
                    "offset-position",
                    "offset-path",
                    "offset-distance",
                    "offset-anchor",
                    "offset-rotate"
                    
                ]
            },
            {
                groupName: "Optimization",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    "paint-order",
                    "will-change",
                    "color-adjust",
                    "image-rendering",
                    "contain"
                ]
            },
            {
                groupName: "Interaction",
                // order: null, // "flexible"
                // emptyLineBefore: null, // "always"|"never"|"threshold"
                noEmptyLineBetween: true,
                properties: [
                    "touch-action",
                    "pointer-events"
                ]
            }
            // {
            //     // disableFix: null, // Autofixing is on by default if it's enabled in stylelint conf
            //     // unspecified: null, // "top"|"bottom"|"bottomAlphabetical"|"ignore"
            //     // emptyLineBeforeUnspecified: null, // "always"|"never"|"threshold"
            //     
            //     /*
            //     for groups using the "emptyLineBefore: 'threshold'" option.
            //     Maybe set to 1 so e.g. shorthands do not need to follow a newline ?
            //     */
            //     // emptyLineMinimumPropertyThreshold: null // int
            //     
            // }
            
        ]
        
    }
    
}

function err(bool, secondaryOpts = {}) {
    
    return [bool, {severity: "error", ...secondaryOpts}]

}

/*
  
  A List of ALL CSS PROPERTIES per MDN web docs' CSS ference page (26 Mar 2020)
  All 362 entries listed in alphabetical order.
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference
  
  list entries prefixed with a "+" sign indicated that property is covered by
  stylelint-order custom config

  A

+ align-content
+ align-items
+ align-self
+ all
+ animation
+ animation-delay
+ animation-direction
+ animation-duration
+ animation-fill-mode
+ animation-iteration-count
+ animation-name
+ animation-play-state
+ animation-timing-function
  
  B
  
+ backdrop-filter
+ backface-visibility
+ background
+ background-attachment
+ background-blend-mode
+ background-clip
+ background-color
+ background-image
+ background-origin
+ background-position
+ background-repeat
+ background-size
+ block-size
+ border
+ border-block
+ border-block-color
+ border-block-end
+ border-block-end-color
+ border-block-end-style
+ border-block-end-width
+ border-block-start
+ border-block-start-color
+ border-block-start-style
+ border-block-start-width
+ border-block-style
+ border-block-width
+ border-bottom
+ border-bottom-color
+ border-bottom-left-radius
+ border-bottom-right-radius
+ border-bottom-style
+ border-bottom-width
+ border-collapse
+ border-color
+ border-end-end-radius
+ border-end-start-radius
+ border-image
+ border-image-outset
+ border-image-repeat
+ border-image-slice
+ border-image-source
+ border-image-width
+ border-inline
+ border-inline-color
+ border-inline-end
+ border-inline-end-color
+ border-inline-end-style
+ border-inline-end-width
+ border-inline-start
+ border-inline-start-color
+ border-inline-start-style
+ border-inline-start-width
+ border-inline-style
+ border-inline-width
+ border-left
+ border-left-color
+ border-left-style
+ border-left-width
+ border-radius
+ border-right
+ border-right-color
+ border-right-style
+ border-right-width
+ border-spacing
+ border-start-end-radius
+ border-start-start-radius
+ border-style
+ border-top
+ border-top-color
+ border-top-left-radius
+ border-top-right-radius
+ border-top-style
+ border-top-width
+ border-width
+ bottom
+ box-decoration-break
+ box-shadow
+ box-sizing
+ break-after
+ break-before
+ break-inside
  
  C
  
+ caption-side
+ caret-color
+ clear
+ clip // deprecated - dissallow
+ clip-path
+ color
+ color-adjust
+ column-count
+ column-fill
+ column-gap
+ column-rule
+ column-rule-color
+ column-rule-style
+ column-rule-width
+ column-span
+ column-width
+ columns
+ contain
+ content
+ counter-increment
+ counter-reset
+ counter-set
+ cursor
  
  D
  
+ direction
+ display
  
  E
  
+ empty-cells
  
  F
  
+ filter
+ flex
+ flex-basis
+ flex-direction
+ flex-flow
+ flex-grow
+ flex-shrink
+ flex-wrap
+ float
+ font
+ font-family
+ font-feature-settings
+ font-kerning
+ font-language-override
+ font-optical-sizing
+ font-size
+ font-size-adjust
+ font-stretch
+ font-style
+ font-synthesis
+ font-variant
+ font-variant-alternates
+ font-variant-caps
+ font-variant-east-asian
+ font-variant-ligatures
+ font-variant-numeric
+ font-variant-position
+ font-variation-settings
+ font-weight
  
  G
  
+ gap
+ grid
+ grid-area
+ grid-auto-columns
+ grid-auto-flow
+ grid-auto-rows
+ grid-column
+ grid-column-end
+ grid-column-start
+ grid-row
+ grid-row-end
+ grid-row-start
+ grid-template
+ grid-template-areas
+ grid-template-columns
+ grid-template-rows
  
  H
  
+ hanging-punctuation
+ height
+ hyphens
  
  I
  
  image-orientation // deprecated - dissallow
+ image-rendering
+ inline-size
+ inset
+ inset-block
+ inset-block-end
+ inset-block-start
+ inset-inline
+ inset-inline-end
+ inset-inline-start
+ isolation
  
  J
  
+ justify-content
+ justify-items
+ justify-self
  
  L
  
+ left
+ letter-spacing
+ line-break
+ line-height
+ list-style
+ list-style-image
+ list-style-position
+ list-style-type
  
  M
  
+ margin
+ margin-block
+ margin-block-end
+ margin-block-start
+ margin-bottom
+ margin-inline
+ margin-inline-end
+ margin-inline-start
+ margin-left
+ margin-right
+ margin-top
+ mask
+ mask-border
+ mask-border-mode
+ mask-border-outset
+ mask-border-repeat
+ mask-border-slice
+ mask-border-source
+ mask-border-width
+ mask-clip
+ mask-composite
+ mask-image
+ mask-mode
+ mask-origin
+ mask-position
+ mask-repeat
+ mask-size
+ mask-type
+ max-block-size
+ max-height
+ max-inline-size
+ max-width
+ min-block-size
+ min-height
+ min-inline-size
+ min-width
+ mix-blend-mode
  
  O
  
+ object-fit
+ object-position
+ offset
+ offset-anchor
+ offset-distance
+ offset-path
+ offset-position
+ offset-rotate
+ opacity
+ order
+ orphans
+ outline
+ outline-color
+ outline-offset
+ outline-style
+ outline-width
+ overflow
+ overflow-anchor
+ overflow-block
+ overflow-inline
+ overflow-wrap
+ overflow-x
+ overflow-y
+ overscroll-behavior
+ overscroll-behavior-block
+ overscroll-behavior-inline
+ overscroll-behavior-x
+ overscroll-behavior-y
  
  P
  
+ padding
+ padding-block
+ padding-block-end
+ padding-block-start
+ padding-bottom
+ padding-inline
+ padding-inline-end
+ padding-inline-start
+ padding-left
+ padding-right
+ padding-top
+ page-break-after
+ page-break-before
+ page-break-inside
+ paint-order
+ perspective
+ perspective-origin
+ place-content
+ place-items
+ place-self
+ pointer-events
+ position
  
  Q
  
+ quotes
  
  R
  
+ resize
+ right
+ rotate
+ row-gap
  
  S
  
+ scale
+ scroll-behavior
+ scroll-margin
+ scroll-margin-block
+ scroll-margin-block-end
+ scroll-margin-block-start
+ scroll-margin-bottom
+ scroll-margin-inline
+ scroll-margin-inline-end
+ scroll-margin-inline-start
+ scroll-margin-left
+ scroll-margin-right
+ scroll-margin-top
+ scroll-padding
+ scroll-padding-block
+ scroll-padding-block-end
+ scroll-padding-block-start
+ scroll-padding-bottom
+ scroll-padding-inline
+ scroll-padding-inline-end
+ scroll-padding-inline-start
+ scroll-padding-left
+ scroll-padding-right
+ scroll-padding-top
+ scroll-snap-align
+ scroll-snap-stop
+ scroll-snap-type
+ scrollbar-color
+ scrollbar-width
+ shape-image-threshold
+ shape-margin
+ shape-outside
  
  T
  
+ tab-size
+ table-layout
+ text-align
+ text-align-last
+ text-combine-upright
+ text-decoration
+ text-decoration-color
+ text-decoration-line
+ text-decoration-skip-ink
+ text-decoration-style
+ text-decoration-thickness
+ text-emphasis
+ text-emphasis-color
+ text-emphasis-position
+ text-emphasis-style
+ text-indent
+ text-justify
+ text-orientation
+ text-overflow
+ text-rendering
+ text-shadow
+ text-transform
+ text-underline-offset
+ text-underline-position
+ top
+ touch-action
+ transform
+ transform-box
+ transform-origin
+ transform-style
+ transition
+ transition-delay
+ transition-duration
+ transition-property
+ transition-timing-function
+ translate
  
  U
  
+ unicode-bidi
  
  V
  
+ vertical-align
+ visibility
  
  W
  
+ white-space
+ widows
+ width
+ will-change
+ word-break
+ word-spacing
+ word-wrap
+ writing-mode
  
  Z
  
+ z-index

*/