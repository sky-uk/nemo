angular.module('nemo', ['ngSanitize'])

    .config(['nemoInputDirectiveCreatorProvider', 'nemoValidationDirectiveCreatorProvider', 'nemoUtilsProvider', 'captchaProvider', 'checkboxProvider', 'serverValidationProvider',
        function (inputProvider, validationProvider, utilsProvider, captchaProvider, checkboxProvider, serverValidation) {

            inputProvider

                .input('text', {
                    template: '<input type="text" />',
                    defaultValue: ''
                })

                .input('dropdown', {
                    template: '<select data-ng-options="option.value as option.text for option in model.options"><option value="">Please select...</option></select>',
                    defaultValue: ''
                })

                .input('hidden', {
                    template: '<input type="hidden" ng-value="model.value" />',
                    defaultValue: ''
                })

                .input('password', {
                    template: '<input type="password" />',
                    defaultValue: ''
                })

                .input('email', {
                    template: '<input type="text" />',
                    defaultValue: ''
                })

                .input('checkbox', checkboxProvider)

                .input('captcha', captchaProvider);

            validationProvider

                .validation('required', {
                    validateFn: function (value, validationRule, formHandlerController, ngModelController) {
                        return (validationRule.value) ? !ngModelController.$isEmpty(value) : true;
                    }
                })

                .validation('inlist', {
                    validateFn: function (value, validationRule) {
                        return (value) ? utilsProvider.contains(validationRule.value, value) : true;
                    }
                })

                .validation('pattern', {
                    validateFn: function (value, validationRule) {
                        return (value) ? new RegExp(validationRule.value).test(value) : true;
                    }
                })

                .validation('notpattern', {
                    validateFn: function (value, validationRule) {
                        return (value) ? !(new RegExp(validationRule.value).test(value)) : true;
                    }
                })

                .validation('mustnotcontain', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value && targetValue) ? value.toLowerCase().indexOf(targetValue.toLowerCase()) < 0 : true;
                    }
                })

                .validation('mustnotcontainmatchedgroup', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value.field, true);
                        if(targetValue) {
                            var matchedTargetValue = targetValue.match(validationRule.value.match);
                            targetValue = matchedTargetValue && matchedTargetValue[1];
                        }
                        return (value && targetValue) ? value.toLowerCase().indexOf(targetValue.toLowerCase()) < 0 : true;
                    }
                })

                .validation('mustmatch', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value) ? value === targetValue : true;
                    }
                })

                .validation('mustmatchcaseinsensitive', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var targetValue = formHandlerController.getFieldValue(validationRule.value, true);
                        return (value && targetValue) ? value.toLowerCase() === targetValue.toLowerCase() : true;
                    }
                })

                .validation('minlength', {
                    validateFn: function (value, validationRule) {
                        return (value && validationRule) ? value.length >= validationRule.value : true;
                    }
                })

                .validation('maxlength', {
                    validateFn: function (value, validationRule) {
                        return (value && validationRule) ? value.length <= validationRule.value : true;
                    }
                })

                .validation('email', {
                    validateFn: function (value, validationRule) {
                        if (value && validationRule.value) {
                            return new RegExp(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i).test(value);
                        }
                        return true;
                    }
                })

                .validation('mustbeequal', {
                    validateFn: function (value, validationRule) {
                        return (value || value === false) ? value === validationRule.value : true;
                    }
                })

                .validation('dependentpattern', {
                    validateFn: function (value, validationRule, formHandlerController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value, true),
                            regex = validationRule.patterns[otherFieldValue];
                        return (value) ? new RegExp(regex, 'i').test(value) : true;
                    }
                })

                .validation('dependentrequired', {
                    validateFn: function (value, validationRule, formHandlerController, ngModelController) {
                        var otherFieldValue = formHandlerController.getFieldValue(validationRule.value, true),
                            required = utilsProvider.contains(validationRule.when, otherFieldValue);

                        return required ? !ngModelController.$isEmpty(value) : true;
                    }
                })

                .validation('server', serverValidation);
    }]);
/**
 * @license AngularJS v1.5.8
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var $sanitizeMinErr = angular.$$minErr('$sanitize');
var bind;
var extend;
var forEach;
var isDefined;
var lowercase;
var noop;
var htmlParser;
var htmlSanitizeWriter;

/**
 * @ngdoc module
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/**
 * @ngdoc service
 * @name $sanitize
 * @kind function
 *
 * @description
 *   Sanitizes an html string by stripping all potentially dangerous tokens.
 *
 *   The input is sanitized by parsing the HTML into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string.
 *
 *   The whitelist for URL sanitization of attribute values is configured using the functions
 *   `aHrefSanitizationWhitelist` and `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider
 *   `$compileProvider`}.
 *
 *   The input may also contain SVG markup if this is enabled via {@link $sanitizeProvider}.
 *
 * @param {string} html HTML input.
 * @returns {string} Sanitized HTML.
 *
 * @example
   <example module="sanitizeExample" deps="angular-sanitize.js">
   <file name="index.html">
     <script>
         angular.module('sanitizeExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }]);
     </script>
     <div ng-controller="ExampleController">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </file>
   </example>
 */


/**
 * @ngdoc provider
 * @name $sanitizeProvider
 *
 * @description
 * Creates and configures {@link $sanitize} instance.
 */
function $SanitizeProvider() {
  var svgEnabled = false;

  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
    if (svgEnabled) {
      extend(validElements, svgElements);
    }
    return function(html) {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
        return !/^unsafe:/.test($$sanitizeUri(uri, isImage));
      }));
      return buf.join('');
    };
  }];


  /**
   * @ngdoc method
   * @name $sanitizeProvider#enableSvg
   * @kind function
   *
   * @description
   * Enables a subset of svg to be supported by the sanitizer.
   *
   * <div class="alert alert-warning">
   *   <p>By enabling this setting without taking other precautions, you might expose your
   *   application to click-hijacking attacks. In these attacks, sanitized svg elements could be positioned
   *   outside of the containing element and be rendered over other elements on the page (e.g. a login
   *   link). Such behavior can then result in phishing incidents.</p>
   *
   *   <p>To protect against these, explicitly setup `overflow: hidden` css rule for all potential svg
   *   tags within the sanitized content:</p>
   *
   *   <br>
   *
   *   <pre><code>
   *   .rootOfTheIncludedContent svg {
   *     overflow: hidden !important;
   *   }
   *   </code></pre>
   * </div>
   *
   * @param {boolean=} flag Enable or disable SVG support in the sanitizer.
   * @returns {boolean|ng.$sanitizeProvider} Returns the currently configured value if called
   *    without an argument or self for chaining otherwise.
   */
  this.enableSvg = function(enableSvg) {
    if (isDefined(enableSvg)) {
      svgEnabled = enableSvg;
      return this;
    } else {
      return svgEnabled;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Private stuff
  //////////////////////////////////////////////////////////////////////////////////////////////////

  bind = angular.bind;
  extend = angular.extend;
  forEach = angular.forEach;
  isDefined = angular.isDefined;
  lowercase = angular.lowercase;
  noop = angular.noop;

  htmlParser = htmlParserImpl;
  htmlSanitizeWriter = htmlSanitizeWriterImpl;

  // Regular Expressions for parsing tags and attributes
  var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
    // Match everything outside of normal chars and " (quote character)
    NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;


  // Good source of info about elements and attributes
  // http://dev.w3.org/html5/spec/Overview.html#semantics
  // http://simon.html5.org/html-elements

  // Safe Void Elements - HTML5
  // http://dev.w3.org/html5/spec/Overview.html#void-elements
  var voidElements = toMap("area,br,col,hr,img,wbr");

  // Elements that you can, intentionally, leave open (and which close themselves)
  // http://dev.w3.org/html5/spec/Overview.html#optional-tags
  var optionalEndTagBlockElements = toMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
      optionalEndTagInlineElements = toMap("rp,rt"),
      optionalEndTagElements = extend({},
                                              optionalEndTagInlineElements,
                                              optionalEndTagBlockElements);

  // Safe Block Elements - HTML5
  var blockElements = extend({}, optionalEndTagBlockElements, toMap("address,article," +
          "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
          "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul"));

  // Inline Elements - HTML5
  var inlineElements = extend({}, optionalEndTagInlineElements, toMap("a,abbr,acronym,b," +
          "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
          "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));

  // SVG Elements
  // https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Elements
  // Note: the elements animate,animateColor,animateMotion,animateTransform,set are intentionally omitted.
  // They can potentially allow for arbitrary javascript to be executed. See #11290
  var svgElements = toMap("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph," +
          "hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline," +
          "radialGradient,rect,stop,svg,switch,text,title,tspan");

  // Blocked Elements (will be stripped)
  var blockedElements = toMap("script,style");

  var validElements = extend({},
                                     voidElements,
                                     blockElements,
                                     inlineElements,
                                     optionalEndTagElements);

  //Attributes that have href and hence need to be sanitized
  var uriAttrs = toMap("background,cite,href,longdesc,src,xlink:href");

  var htmlAttrs = toMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
      'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
      'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
      'scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,' +
      'valign,value,vspace,width');

  // SVG attributes (without "id" and "name" attributes)
  // https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Attributes
  var svgAttrs = toMap('accent-height,accumulate,additive,alphabetic,arabic-form,ascent,' +
      'baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,' +
      'cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,' +
      'font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,' +
      'height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,' +
      'marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,' +
      'max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,' +
      'path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,' +
      'requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,' +
      'stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,' +
      'stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,' +
      'stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,' +
      'underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,' +
      'width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,' +
      'xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan', true);

  var validAttrs = extend({},
                                  uriAttrs,
                                  svgAttrs,
                                  htmlAttrs);

  function toMap(str, lowercaseKeys) {
    var obj = {}, items = str.split(','), i;
    for (i = 0; i < items.length; i++) {
      obj[lowercaseKeys ? lowercase(items[i]) : items[i]] = true;
    }
    return obj;
  }

  var inertBodyElement;
  (function(window) {
    var doc;
    if (window.document && window.document.implementation) {
      doc = window.document.implementation.createHTMLDocument("inert");
    } else {
      throw $sanitizeMinErr('noinert', "Can't create an inert html document");
    }
    var docElement = doc.documentElement || doc.getDocumentElement();
    var bodyElements = docElement.getElementsByTagName('body');

    // usually there should be only one body element in the document, but IE doesn't have any, so we need to create one
    if (bodyElements.length === 1) {
      inertBodyElement = bodyElements[0];
    } else {
      var html = doc.createElement('html');
      inertBodyElement = doc.createElement('body');
      html.appendChild(inertBodyElement);
      doc.appendChild(html);
    }
  })(window);

  /**
   * @example
   * htmlParser(htmlString, {
   *     start: function(tag, attrs) {},
   *     end: function(tag) {},
   *     chars: function(text) {},
   *     comment: function(text) {}
   * });
   *
   * @param {string} html string
   * @param {object} handler
   */
  function htmlParserImpl(html, handler) {
    if (html === null || html === undefined) {
      html = '';
    } else if (typeof html !== 'string') {
      html = '' + html;
    }
    inertBodyElement.innerHTML = html;

    //mXSS protection
    var mXSSAttempts = 5;
    do {
      if (mXSSAttempts === 0) {
        throw $sanitizeMinErr('uinput', "Failed to sanitize html because the input is unstable");
      }
      mXSSAttempts--;

      // strip custom-namespaced attributes on IE<=11
      if (window.document.documentMode) {
        stripCustomNsAttrs(inertBodyElement);
      }
      html = inertBodyElement.innerHTML; //trigger mXSS
      inertBodyElement.innerHTML = html;
    } while (html !== inertBodyElement.innerHTML);

    var node = inertBodyElement.firstChild;
    while (node) {
      switch (node.nodeType) {
        case 1: // ELEMENT_NODE
          handler.start(node.nodeName.toLowerCase(), attrToMap(node.attributes));
          break;
        case 3: // TEXT NODE
          handler.chars(node.textContent);
          break;
      }

      var nextNode;
      if (!(nextNode = node.firstChild)) {
      if (node.nodeType == 1) {
          handler.end(node.nodeName.toLowerCase());
        }
        nextNode = node.nextSibling;
        if (!nextNode) {
          while (nextNode == null) {
            node = node.parentNode;
            if (node === inertBodyElement) break;
            nextNode = node.nextSibling;
          if (node.nodeType == 1) {
              handler.end(node.nodeName.toLowerCase());
            }
          }
        }
      }
      node = nextNode;
    }

    while (node = inertBodyElement.firstChild) {
      inertBodyElement.removeChild(node);
    }
  }

  function attrToMap(attrs) {
    var map = {};
    for (var i = 0, ii = attrs.length; i < ii; i++) {
      var attr = attrs[i];
      map[attr.name] = attr.value;
    }
    return map;
  }


  /**
   * Escapes all potentially dangerous characters, so that the
   * resulting string can be safely inserted into attribute or
   * element text.
   * @param value
   * @returns {string} escaped text
   */
  function encodeEntities(value) {
    return value.
      replace(/&/g, '&amp;').
      replace(SURROGATE_PAIR_REGEXP, function(value) {
        var hi = value.charCodeAt(0);
        var low = value.charCodeAt(1);
        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
      }).
      replace(NON_ALPHANUMERIC_REGEXP, function(value) {
        return '&#' + value.charCodeAt(0) + ';';
      }).
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;');
  }

  /**
   * create an HTML/XML writer which writes to buffer
   * @param {Array} buf use buf.join('') to get out sanitized html string
   * @returns {object} in the form of {
   *     start: function(tag, attrs) {},
   *     end: function(tag) {},
   *     chars: function(text) {},
   *     comment: function(text) {}
   * }
   */
  function htmlSanitizeWriterImpl(buf, uriValidator) {
    var ignoreCurrentElement = false;
    var out = bind(buf, buf.push);
    return {
      start: function(tag, attrs) {
        tag = lowercase(tag);
        if (!ignoreCurrentElement && blockedElements[tag]) {
          ignoreCurrentElement = tag;
        }
        if (!ignoreCurrentElement && validElements[tag] === true) {
          out('<');
          out(tag);
          forEach(attrs, function(value, key) {
            var lkey = lowercase(key);
            var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
            if (validAttrs[lkey] === true &&
              (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
              out(' ');
              out(key);
              out('="');
              out(encodeEntities(value));
              out('"');
            }
          });
          out('>');
        }
      },
      end: function(tag) {
        tag = lowercase(tag);
        if (!ignoreCurrentElement && validElements[tag] === true && voidElements[tag] !== true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignoreCurrentElement) {
          ignoreCurrentElement = false;
        }
      },
      chars: function(chars) {
        if (!ignoreCurrentElement) {
          out(encodeEntities(chars));
        }
      }
    };
  }


  /**
   * When IE9-11 comes across an unknown namespaced attribute e.g. 'xlink:foo' it adds 'xmlns:ns1' attribute to declare
   * ns1 namespace and prefixes the attribute with 'ns1' (e.g. 'ns1:xlink:foo'). This is undesirable since we don't want
   * to allow any of these custom attributes. This method strips them all.
   *
   * @param node Root element to process
   */
  function stripCustomNsAttrs(node) {
    if (node.nodeType === window.Node.ELEMENT_NODE) {
      var attrs = node.attributes;
      for (var i = 0, l = attrs.length; i < l; i++) {
        var attrNode = attrs[i];
        var attrName = attrNode.name.toLowerCase();
        if (attrName === 'xmlns:ns1' || attrName.lastIndexOf('ns1:', 0) === 0) {
          node.removeAttributeNode(attrNode);
          i--;
          l--;
        }
      }
    }

    var nextNode = node.firstChild;
    if (nextNode) {
      stripCustomNsAttrs(nextNode);
    }

    nextNode = node.nextSibling;
    if (nextNode) {
      stripCustomNsAttrs(nextNode);
    }
  }
}

function sanitizeText(chars) {
  var buf = [];
  var writer = htmlSanitizeWriter(buf, noop);
  writer.chars(chars);
  return buf.join('');
}


// define ngSanitize module and register $sanitize service
angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

/**
 * @ngdoc filter
 * @name linky
 * @kind function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports `http/https/ftp/mailto` and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (`_blank|_self|_parent|_top`) or named frame to open links in.
 * @param {object|function(url)} [attributes] Add custom attributes to the link element.
 *
 *    Can be one of:
 *
 *    - `object`: A map of attributes
 *    - `function`: Takes the url as a parameter and returns a map of attributes
 *
 *    If the map of attributes contains a value for `target`, it overrides the value of
 *    the target parameter.
 *
 *
 * @returns {string} Html-linkified and {@link $sanitize sanitized} text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <example module="linkyExample" deps="angular-sanitize.js">
     <file name="index.html">
       <div ng-controller="ExampleController">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <th>Filter</th>
           <th>Source</th>
           <th>Rendered</th>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithSingleURL | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithSingleURL | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="linky-custom-attributes">
          <td>linky custom attributes</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithSingleURL | linky:'_self':{rel: 'nofollow'}"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithSingleURL | linky:'_self':{rel: 'nofollow'}"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </file>
     <file name="script.js">
       angular.module('linkyExample', ['ngSanitize'])
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.snippet =
             'Pretty text with some links:\n'+
             'http://angularjs.org/,\n'+
             'mailto:us@somewhere.org,\n'+
             'another@somewhere.org,\n'+
             'and one more: ftp://127.0.0.1/.';
           $scope.snippetWithSingleURL = 'http://angularjs.org/';
         }]);
     </file>
     <file name="protractor.js" type="protractor">
       it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
       });

       it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
       });

       it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithSingleURL | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });

       it('should optionally add custom attributes', function() {
        expect(element(by.id('linky-custom-attributes')).
            element(by.binding("snippetWithSingleURL | linky:'_self':{rel: 'nofollow'}")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-custom-attributes a')).getAttribute('rel')).toEqual('nofollow');
       });
     </file>
   </example>
 */
angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,
      MAILTO_REGEXP = /^mailto:/i;

  var linkyMinErr = angular.$$minErr('linky');
  var isDefined = angular.isDefined;
  var isFunction = angular.isFunction;
  var isObject = angular.isObject;
  var isString = angular.isString;

  return function(text, target, attributes) {
    if (text == null || text === '') return text;
    if (!isString(text)) throw linkyMinErr('notstring', 'Expected string but received: {0}', text);

    var attributesFn =
      isFunction(attributes) ? attributes :
      isObject(attributes) ? function getAttributesObject() {return attributes;} :
      function getEmptyAttributesObject() {return {};};

    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/www/mailto then assume mailto
      if (!match[2] && !match[4]) {
        url = (match[3] ? 'http://' : 'mailto:') + url;
      }
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(sanitizeText(text));
    }

    function addLink(url, text) {
      var key, linkAttributes = attributesFn(url);
      html.push('<a ');

      for (key in linkAttributes) {
        html.push(key + '="' + linkAttributes[key] + '" ');
      }

      if (isDefined(target) && !('target' in linkAttributes)) {
        html.push('target="',
                  target,
                  '" ');
      }
      html.push('href="',
                url.replace(/"/g, '&quot;'),
                '">');
      addText(text);
      html.push('</a>');
    }
  };
}]);


})(window, window.angular);

'use strict';
angular.module('nemo')

    .provider('nemoMessages', [function () {

        var messages = {};

        function set(key, value) {
            messages[key] = value;
        }

        function get(key) {
            return messages[key]
        }

        return {
            set: set,
            get: get,
            $get: function () {
                return {
                    set: set,
                    get: get
                }
            }
        }
    }]);
angular.module('nemo')

    .provider('nemoUtils', ['nemoMessagesProvider', function (messagesProvider) {

        'use strict';

        function capitalise(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function contains(list, item) {
            var isFound = false;
            if (list && list.length) {
                angular.forEach(list, function (listItem) {
                    isFound = isFound || (item === listItem);
                });
            }
            return isFound;
        }

        // Extracted from Underscore.js 1.5.2
        function debounce(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            return function () {
                context = this;
                args = arguments;
                timestamp = new Date();
                var later = function () {
                    var last = (new Date()) - timestamp;
                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    }
                };
                var callNow = immediate && !timeout;
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            };
        }

        function forceServerInvalid(errorMessage, errorIndex, scope, ngModelCtrl) {
            var validationId = scope.model.name + errorIndex;
            messagesProvider.set(validationId, errorMessage);
            ngModelCtrl.$setValidity(validationId, false);
            setValidOnChange(scope, ngModelCtrl, validationId);
        }

        function setValidOnChange(scope, ngModelCtrl, validationId) {
            var unregisterFn = scope.$watch(function () {
                return ngModelCtrl.$viewValue;
            }, function (newValue, oldValue) {
                //noinspection JSValidateTypes
                if (newValue !== oldValue) {
                    ngModelCtrl.$setValidity(validationId, true);
                    unregisterFn();
                }
            });
        }

        return {
            capitalise: capitalise,
            contains: contains,
            debounce: debounce,
            forceServerInvalid: forceServerInvalid,
            $get: function () {
                return {
                    capitalise: capitalise,
                    contains: contains,
                    debounce: debounce
                };
            }
        };
    }]);
angular.module('nemo').provider('captcha', ['nemoUtilsProvider', function (utilsProvider) {
    return {
        template: '<div class="nemo-captcha">' +
            '<img class="nemo-captcha-img" ng-src="{{captchaModel.getImageUri()}}">' +
            '<div class="nemo-captcha-play" ng-click="playAudio($event)"></div>' +
            '<p class="nemo-captcha-refresh" ng-click="refreshCaptcha($event)">{{getRequestCaptchaCopy()}}</p>' +
            '<input class="nemo-captcha-input" type="text" ng-model="model.value" name="captchaInput" ' +
                'placeholder="{{model.properties.placeholder.message}}" ng-focus="setActiveCaptchaField()" ng-blur="setTouchedCaptchaField()">' +
            '<audio class="nemo-captcha-audio" ng-src="{{captchaModel.getAudioUri()}}">' +
                'Your browser does not support audio' +
            '</audio>' +
        '</div>',
        linkFn: function (scope, element, attrs, controllers) {
            var ngModelCtrl = controllers[0],
                formHandlerCtrl = controllers[1],
                watcherUnbind = scope.$watch('model.value', function (newVal, oldVal) {
                    if(newVal !== oldVal) {
                        ngModelCtrl.$setDirty();
                        watcherUnbind();
                    }
                });

            scope.updateCaptchaId = function(value) {
                formHandlerCtrl.setFieldValue('captchaId', value);
            };

            scope.playAudio = function ($event) {
                $event.stopPropagation();
                $event.preventDefault();
                element.find('audio')[0].play();
            };

            scope.setActiveCaptchaField = function () {
                formHandlerCtrl.setActiveField(scope.model.name);
            };

            scope.setTouchedCaptchaField = function () {
                ngModelCtrl.$setTouched();
            };
        },
        fieldInterfaceFns: function(scope, element, ngModelCtrl) {
            return {
                setFocus: function () {
                    element.find('input')[0].focus();
                },
                forceServerInvalid: function (errorMessage, errorIndex) {
                    scope.refreshCaptcha();
                    utilsProvider.forceServerInvalid(errorMessage, errorIndex, scope, ngModelCtrl);
                }
            }
        },
        controller: 'CaptchaCtrl',
        $get: {}
    }
}]);
angular.module('nemo').provider('checkbox', [function () {
    return {
        template: '<div data-ng-click="toggle()" data-ng-keyup="toggleIfEnter($event)" data-ng-class="{checked: isChecked, focused: isFocused()}">' +
        '<label class="tick" data-ng-show="isChecked">\u2714</label>' +
        '<input type="text" data-ng-focus="setFocus()" data-ng-blur="releaseFocus()" ' +
            'style="position: absolute; top: 0; left: 0; opacity: 0; cursor: pointer; font-size: 0; color: transparent; text-indent: 100%; padding: 0; border: none;" />' +
        '</div>',
        defaultValue: false,
        linkFn: function (scope, element, attrs, controllers) {

            var ngModelCtrl = controllers[0],
                formHandlerCtrl = controllers[1],
                fieldValue = scope.model.value,
                fieldName = scope.model.name,
                hasGenuineFocus = false;

            setValue(fieldValue === true || fieldValue === 'true');

            scope.isFocused = function () {
                return hasGenuineFocus && ngModelCtrl.isActive;
            };

            scope.toggle = function () {
                setValue(!scope.isChecked);
                scope.setFocus();
                formHandlerCtrl.setFieldDirtyTouched(fieldName);
            };

            scope.toggleIfEnter = function ($event) {
                var spaceKeyCode = 32;
                if ($event.which === spaceKeyCode) {
                    scope.toggle();
                }
            };

            scope.setFocus = function () {
                hasGenuineFocus = true;
                setActiveState();
            };

            scope.releaseFocus = function () {
                hasGenuineFocus = false;
                formHandlerCtrl.setFieldDirtyTouched(fieldName);
            };

            function setValue(value) {
                scope.isChecked = value;
                formHandlerCtrl.setFieldValue(fieldName, value);
            }

            function setActiveState() {
                formHandlerCtrl.setActiveField(fieldName);
            }
        },
        $get: angular.noop
    }
}]);
/* jshint -W040 */

angular.module('nemo')

    .provider('nemoInputDirectiveCreator', ['$compileProvider', 'nemoUtilsProvider',
        function ($compileProvider, utilsProvider) {

            'use strict';

            function getTemplateWithAttributes(template) {
                var parentTemplateElement, templateElement;
                parentTemplateElement = document.createElement('div');
                parentTemplateElement.innerHTML = template;
                templateElement = parentTemplateElement.firstChild;
                templateElement.setAttribute('ng-model', 'model.value');
                templateElement.setAttribute('ng-focus', 'setActiveField()');
                templateElement.setAttribute('name', '{{model.name}}');
                templateElement.setAttribute('id', '{{model.id || model.name}}');
                templateElement.setAttribute('placeholder', '{{model.properties.placeholder.message}}');
                return parentTemplateElement.innerHTML;
            }

            function manageDefaultValue(scope, formHandlerCtrl, defaultValue) {
                var fieldName = scope.model.name,
                    unregisterFn = scope.$watch(function () {
                        return formHandlerCtrl.getFieldValue(fieldName);
                    }, function (fieldValue) {
                        if (defaultValue !== undefined && (fieldValue === null || fieldValue === undefined)) {
                            formHandlerCtrl.setFieldValue(fieldName, defaultValue);
                        }
                        unregisterFn();
                    });
            }

            function manageCustomLinkFn(scope, element, attrs, controllers, $compile, $http, linkFn) {
                (linkFn || angular.noop)(scope, element, attrs, controllers, $compile, $http);
            }

            function validateFormOnFieldChange(scope, ngModelCtrl, formHandlerCtrl) {
                scope.$watch(function () {
                    return ngModelCtrl.$viewValue;
                }, function (newVal, oldVal) {
                    scope.$evalAsync(function () {
                        //noinspection JSValidateTypes
                        if (newVal === oldVal) {
                            return;
                        }
                        ngModelCtrl.forcedValidityValue = undefined;
                        formHandlerCtrl.validateForm();
                    });
                });
            }

            function getLinkFn(options, $compile, $http, nemoMessages) {
                return function (scope, element, attrs, controllers) {
                    var ngModelCtrl = controllers[0],
                        formHandlerCtrl = controllers[1],
                        parentNgModelCtrl = controllers[2];
                    validateFormOnFieldChange(scope, ngModelCtrl, formHandlerCtrl);

                    var interfaceFuns = registerField(scope, element, ngModelCtrl, formHandlerCtrl, nemoMessages, options.fieldInterfaceFns);
                    interfaceFuns.setupBusinessRules();

                    manageCustomLinkFn(scope, element, attrs, controllers, $compile, $http, options.linkFn);
                    manageDefaultValue(scope, formHandlerCtrl, options.defaultValue);
                    handleActivationState(scope, formHandlerCtrl, parentNgModelCtrl);
                };
            }

            function handleActivationState(scope, formHandlerCtrl, parentNgModelCtrl) {
                var newActiveField = (parentNgModelCtrl) ? [parentNgModelCtrl.$name, scope.model.name] : scope.model.name;
                scope.setActiveField = function () {
                    formHandlerCtrl.setActiveField(newActiveField);
                };
            }

            function registerField(scope, element, ngModelCtrl, formHandlerCtrl, nemoMessages, customFieldInterfaceFns) {
                var fieldInterfaceFns = getFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl, nemoMessages),
                    customerFieldInterface = customFieldInterfaceFns ? customFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl) : {};
                angular.extend(fieldInterfaceFns, customerFieldInterface);
                formHandlerCtrl.registerField(scope.model.name, fieldInterfaceFns);
                return fieldInterfaceFns;
            }

            function getFieldInterfaceFns(scope, element, ngModelCtrl, formHandlerCtrl, nemoMessages) {
                return {
                    activeFieldChange: function (activeField) {
                        activeFieldChange(scope, ngModelCtrl, activeField);
                    },
                    releaseActive: function () {
                        ngModelCtrl.isActive = false;
                    },
                    isActive: function () {
                        return ngModelCtrl.isActive;
                    },
                    isValid: function () {
                        return ngModelCtrl.$valid;
                    },
                    isTouched: function () {
                        return ngModelCtrl.$touched;
                    },
                    hasHelp: function () {
                        return scope.model.properties && scope.model.properties.help && scope.model.properties.help.message;
                    },
                    setFocus: function () {
                        element[0].focus();
                        formHandlerCtrl.setActiveField(scope.model.name);
                    },
                    getValue: function () {
                        return ngModelCtrl.$viewValue;
                    },
                    setValue: function (value) {
                        ngModelCtrl.$setViewValue(value);
                        ngModelCtrl.$render();
                    },
                    getNgModelCtrl: function () {
                        return ngModelCtrl;
                    },
                    setFilthy: function () {
                        ngModelCtrl.$setDirty();
                        ngModelCtrl.$setTouched();
                    },
                    setupBusinessRules: function () {
                        if (scope.model.properties && scope.model.properties.businessrules) {
                            if (utilsProvider.contains(scope.model.properties.businessrules, 'noAutocomplete')) {
                                element.attr('autocomplete', 'off');
                            }
                            if (utilsProvider.contains(scope.model.properties.businessrules, 'noPaste')) {
                                element.attr('onPaste', 'return false;');
                            }
                        }
                    },
                    forceServerInvalid: function (errorMessage, errorIndex) {
                        utilsProvider.forceServerInvalid(errorMessage,errorIndex, scope, ngModelCtrl);
                    }
                };
            }

            function activeFieldChange(scope, ngModelCtrl, activeField) {
                ngModelCtrl.isActive = isFieldNowActive(scope.model.name, activeField);
            }

            function isFieldNowActive(fieldName, activeField) {
                if (typeof activeField === 'string') {
                    return isFieldTheOnlyActiveOne(fieldName, activeField);
                } else if (typeof activeField === 'object') {
                    return isFieldPartOfActiveList(fieldName, activeField);
                }
            }

            function isFieldTheOnlyActiveOne(fieldName, activeField) {
                return activeField === fieldName;
            }

            function isFieldPartOfActiveList(fieldName, activeFieldList) {
                var isFieldNowActive = false;
                for (var i = 0; i < activeFieldList.length; i++) {
                    if (activeFieldList[i] === fieldName) {
                        isFieldNowActive = true;
                        break;
                    }
                }
                return isFieldNowActive;
            }

            function getDirectiveDefinitionObject(options, $compile, $http, nemoMessages) {
                return {
                    require: ['ngModel', '^nemoFormHandler', '?^^ngModel'],
                    template: getTemplateWithAttributes(options.template),
                    replace: true,
                    restrict: 'A',
                    link: getLinkFn(options, $compile, $http, nemoMessages),
                    controller: options.controller
                };
            }

            function input(type, options) {
                $compileProvider.directive
                    .apply(null, [
                        'input' + utilsProvider.capitalise(type),
                        ['$compile', '$http', 'nemoMessages', function ($compile, $http, nemoMessages) {
                            return getDirectiveDefinitionObject(options, $compile, $http, nemoMessages);
                        }]]);
                return this;
            }

            return {
                input: input,
                $get: angular.noop
            };
        }
    ]);

angular.module('nemo').provider('serverValidation', function () {
    return {
        linkFn: function (scope, element, attrs, controllers, validFns) {
            var ngModelCtrl = controllers[0];

            scope.$watch(function () {
                return ngModelCtrl.$viewValue;
            }, function (newVal, oldVal) {
                if (newVal === oldVal) { return; }

                validFns.forceValid();
            });
        },
        $get: {}
    }
});
'use strict';

angular.module('nemo')

    .provider('nemoValidationDirectiveCreator', ['$compileProvider', 'nemoUtilsProvider', function ($compileProvider, utilsProvider) {

        var validationOptionsCache = {};

        function getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            var isValid;
            if(ngModelCtrl.forcedValidityValue !== undefined) {
                isValid = ngModelCtrl.forcedValidityValue;
            } else if(angular.isFunction(validateFn)) {
                isValid = validateFn(ngModelCtrl.$viewValue, validationRule, formHandlerCtrl, ngModelCtrl);
            } else {
                isValid = !ngModelCtrl.$error[validationRule.id];
            }
            return isValid;
        }

        function setupValidationRule(validationRule, ngModelCtrl, formHandlerCtrl, validateFn, messages) {
            ngModelCtrl.$validators[validationRule.id] = function () {
                return getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
            };
            messages.set(validationRule.id, validationRule.message);
        }

        function registerValidationRule(validationRule, formHandlerCtrl, validationRuleInterfaceFns) {
            formHandlerCtrl.registerValidationRule(validationRule.id, validationRuleInterfaceFns);
        }

        function getValidationRuleInterfaceFnsObject(scope, validateFn, validationRule, ngModelCtrl, formHandlerCtrl, options) {
            var validationRuleInterfaceFns = getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl),
                customerValidationRuleInterface = options.validationRuleInterfaceFns ?
                    options.validationRuleInterfaceFns(scope, ngModelCtrl) :
                {};
            angular.extend(validationRuleInterfaceFns, customerValidationRuleInterface);
            return validationRuleInterfaceFns;
        }

        function getValidationRuleInterfaceFns(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            return {
                forceInvalid: function () {
                    validityChange(ngModelCtrl, validationRule.id, false);
                },
                forceValid: function () {
                    validityChange(ngModelCtrl, validationRule.id, true);
                },
                refreshValidity: function () {
                    refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
                }
            };
        }

        function validityChange(ngModelCtrl, validationRuleCode, newValidity) {
            ngModelCtrl.$setValidity(validationRuleCode, newValidity);
            ngModelCtrl.forcedValidityValue = newValidity;
        }

        function refreshValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl) {
            var isValid = getValidity(validateFn, validationRule, ngModelCtrl, formHandlerCtrl);
            ngModelCtrl.$setValidity(validationRule.id, isValid);
        }

        function getLinkFn(options, directiveName, validateFn, messages) {
            return function (scope, element, attrs, controllers) {
                var validationRules = scope.$eval(attrs[directiveName]),
                    ngModelCtrl = controllers[0],
                    formHandlerCtrl = controllers[1];

                validationRules.forEach(function (validationRule) {
                    var validFns = getValidationRuleInterfaceFnsObject(scope, validateFn, validationRule, ngModelCtrl, formHandlerCtrl, options);

                    setupValidationRule(validationRule, ngModelCtrl, formHandlerCtrl, validateFn, messages);
                    registerValidationRule(validationRule, formHandlerCtrl, validFns);

                    if (options.linkFn) {
                        options.linkFn(scope, element, attrs, controllers, validFns);
                    }
                });
            };
        }

        function getDirectiveDefinitionObject(options, directiveName, validateFn, messages) {
            return {
                require: ['ngModel', '^nemoFormHandler'],
                restrict: 'A',
                link: getLinkFn(options, directiveName, validateFn, messages)
            };
        }

        function validation(type, options) {

            storeValidationOptionsInCache(type, options);

            var directiveName = 'validation' + utilsProvider.capitalise(type);
            $compileProvider.directive
                .apply(null, [directiveName, ['nemoMessages', function (messages) {
                    return getDirectiveDefinitionObject(options, directiveName, options.validateFn, messages);
                }]]);

            return this;
        }

        function storeValidationOptionsInCache(type, options) {
            validationOptionsCache[type] = options;
        }

        function getValidationOptionsFromCache(type) {
            return validationOptionsCache[type];
        }

        return {
            validation: validation,
            $get: function () {
                return {
                    getValidationOptions: getValidationOptionsFromCache
                };
            }
        };
    }]);

angular.module('nemo').service('Captcha', ['$http', 'CaptchaModel', function ($http, CaptchaModel) {

    function getCaptcha(captchaAction) {
        return $http.post(captchaAction.href).then(function (response) {
            return CaptchaModel.create(response.data);
        });
    }

    return {
        getCaptcha: getCaptcha
    }
}]);
angular.module('nemo').controller('CaptchaCtrl', ['$scope', 'Captcha', 'nemoUtils', function ($scope, Captcha, utils) {

    var debouncedGetCaptchaInfo = utils.debounce(getCaptchaInfo, 1000, true);

    function getCaptchaInfo() {
        $scope.model.value = '';
        return Captcha.getCaptcha($scope.model.action).then(function (captchaModel) {
            $scope.captchaModel = captchaModel;
            $scope.updateCaptchaId($scope.captchaModel.getId());
        });
    }

    $scope.refreshCaptcha = function ($event) {
        if ($event) {
            $event.stopPropagation();
            $event.preventDefault();
        }
        return debouncedGetCaptchaInfo();
    };

    $scope.getRequestCaptchaCopy = function () {
        return $scope.model.action.properties.actionsubmit.message;
    };

    getCaptchaInfo();
}]);
angular.module('nemo').factory('CaptchaModel', ['$sce', function ($sce) {
    function CaptchaModel(data) {
        var self = this;
        this.data = data;

        if (this.data.links) {
            this.data.links.forEach(function (link) {
                link.rel.forEach(function (relName) {
                    self.data[relName] = link;
                });
            });
        }
    }

    CaptchaModel.prototype = {
        getImageUri: function () {
            return this.data.captchaImage.href;
        },

        getAudioUri: function () {
            return $sce.trustAsResourceUrl(this.data.captchaAudio.href);
        },

        getId: function () {
            return this.data.properties.captchaId;
        }
    };

    return {
        create: function (data) {
            return new CaptchaModel(data);
        }
    }
}]);
'use strict';

angular.module('nemo')

    .controller('nemoFormHandlerCtrl', ['$scope', '$timeout', '$element', function ($scope, $timeout, $element) {

        var registeredFieldsFns = {}, registeredValidationRulesFns = {}, fieldNameOrder = [];

        function getRegisteredField(fieldName, skipRegisteredCheck) {
            return getRegisteredComponent(fieldName, registeredFieldsFns, skipRegisteredCheck);
        }

        function getRegisteredValidationRule(validationRuleCode, skipRegisteredCheck) {
            return getRegisteredComponent(validationRuleCode, registeredValidationRulesFns, skipRegisteredCheck);
        }

        function getRegisteredComponent(id, group, skipRegisteredCheck) {
            var registeredComponent = group[id];
            if (!registeredComponent) {
                if(skipRegisteredCheck) {
                    return {};
                } else {
                    throw new Error(id + ' is not registered in the form.');
                }
            } else {
                return registeredComponent;
            }
        }

        function getFieldInterfaceFn(fieldName, interfaceFn, skipRegisteredCheck) {
            return (getRegisteredField(fieldName, skipRegisteredCheck)[interfaceFn] || angular.noop);
        }

        function getValidationRuleInterfaceFn(fieldName, interfaceFn, skipRegisteredCheck) {
            return (getRegisteredValidationRule(fieldName, skipRegisteredCheck)[interfaceFn] || angular.noop);
        }

        this.getFieldsValues = function () {
            var fieldsValues = {};
            angular.forEach(registeredFieldsFns, function (fieldInterfaceFns, fieldName) {
                fieldsValues[fieldName] = fieldInterfaceFns.getValue();
            });
            return fieldsValues;
        };

        this.setFieldValue = function (fieldName, value, skipRegisteredCheck) {
            getFieldInterfaceFn(fieldName, 'setValue', skipRegisteredCheck)(value);
        };

        this.getFieldValue = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'getValue', skipRegisteredCheck)();
        };


        this.isFieldValid = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'isValid', skipRegisteredCheck)();
        };

        this.isFieldTouched = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'isTouched', skipRegisteredCheck)();
        };

        this.hasHelp = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'hasHelp', skipRegisteredCheck)();
        };

        this.isFieldActive = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'isActive', skipRegisteredCheck)();
        };

        this.getFieldNgModelCtrl = function (fieldName, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'getNgModelCtrl', skipRegisteredCheck)();
        };

        this.forceInvalid = function (validationRuleCode, skipRegisteredCheck) {
            getValidationRuleInterfaceFn(validationRuleCode, 'forceInvalid', skipRegisteredCheck)(validationRuleCode);
        };

        this.forceServerFieldInvalid = function (fieldName, errorMessage, index, skipRegisteredCheck) {
            return getFieldInterfaceFn(fieldName, 'forceServerInvalid', skipRegisteredCheck)(errorMessage, index);
        };

        this.setActiveField = function (activeFieldName, skipRegisteredCheck) {
            angular.forEach(registeredFieldsFns, function (fieldInterfaceFns, fieldName) {
                getFieldInterfaceFn(fieldName, 'activeFieldChange', skipRegisteredCheck)(activeFieldName);
            });
        };

        this.releaseActiveField = function (fieldName, skipRegisteredCheck) {
            getFieldInterfaceFn(fieldName, 'releaseActive', skipRegisteredCheck)(fieldName);
        };

        this.setFieldDirtyTouched = function (fieldName, skipRegisteredCheck) {
            getFieldInterfaceFn(fieldName, 'setFilthy', skipRegisteredCheck)();
        };

        this.validateFormAndSetDirtyTouched = function () {
            angular.forEach(registeredValidationRulesFns, function (registeredValidationRuleFns) {
                registeredValidationRuleFns.refreshValidity();
            });
            angular.forEach(registeredFieldsFns, function (registeredFieldFns) {
                registeredFieldFns.setFilthy();
            });
        };

        this.validateForm = function (skipRegisteredCheck) {
            angular.forEach(registeredValidationRulesFns, function (registeredValidationRuleFns, validationRuleCode) {
                getValidationRuleInterfaceFn(validationRuleCode, 'refreshValidity', skipRegisteredCheck)();
            });
        };

        this.giveFieldFocus = function (fieldName, skipRegisteredCheck) {
            getFieldInterfaceFn(fieldName, 'setFocus', skipRegisteredCheck)();
        };

        this.giveFirstInvalidFieldFocus = function () {
            $timeout(function() {
                angular.element($element).find('input.ng-invalid,select.ng-invalid,.field.ng-invalid input, .field.ng-invalid select').first().focus()
            });
        };

        this.registerField = function (fieldName, registerFieldFns) {
            registeredFieldsFns[fieldName] = registerFieldFns;
            fieldNameOrder.push(fieldName);
        };

        this.registerValidationRule = function (validationRuleCode, registerValidationRuleFns) {
            registeredValidationRulesFns[validationRuleCode] = registerValidationRuleFns;
        };
    }])

    .directive('nemoFormHandler', [function () {
        return {
            require: ['nemoFormHandler', 'form'],
            controller: 'nemoFormHandlerCtrl',
            link: function (scope, element, attrs, controllers) {

                var formHandlerCtrl = controllers[0],
                    formCtrl = controllers[1];

                formHandlerCtrl.isFormValid = function () {
                    return formCtrl.$valid;
                };
            }
        };
    }]);
'use strict';

angular.module('nemo')

    .directive('nemoInput', ['$compile', 'nemoValidationDirectiveCreator', function ($compile, validation) {

        function toSnakeCase(str) {
            return str.replace(/([A-Z])/g, function ($1) {
                return "-" + $1.toLowerCase();
            });
        }

        function createElement() {
            return angular.element('<div></div>');
        }

        function addInputAttributeToElement(type, tElement) {
            tElement[0].setAttribute('input-' + toSnakeCase(type), '');
        }

        function addValidationAttributeToElement(validationListItem, tElement, validationIndex) {
            var attributeKey = 'validation-' + toSnakeCase(validationListItem.type),
                attributeValue = 'model.properties.validation[' + validationIndex + '].rules';
            tElement[0].setAttribute(attributeKey, attributeValue);
        }

        function preCompileValidationRuleFn(validationListItem, tElement) {
            var validationOptions = validation.getValidationOptions(validationListItem.type);
            if (validationOptions && angular.isFunction(validationOptions.preCompileFn)) {
                validationOptions.preCompileFn(tElement);
            }
        }

        function setAutoFocus(tElement, hasFocus) {
            if (hasFocus) {
                tElement[0].setAttribute('autofocus', 'true');
            }
        }

        function replaceTemplate(oldTempate, newTemplate) {
            oldTempate.replaceWith(newTemplate);
        }

        function compileTemplate(template, scope) {
            $compile(template)(scope);
        }

        function manageValidationRules(fieldProperties, tElement) {
            var validationList = fieldProperties && fieldProperties.validation;
            if (validationList && validationList.length) {
                validationList.forEach(function (validationListItem, validationIndex) {
                    addValidationAttributeToElement(validationListItem, tElement, validationIndex);
                    preCompileValidationRuleFn(validationListItem, tElement);
                });
            }
        }

        function getLinkFn() {
            return function (scope, element) {
                var fieldElement = createElement();
                addInputAttributeToElement(scope.model.type, fieldElement);
                setAutoFocus(fieldElement, scope.hasFocus);
                manageValidationRules(scope.model.properties, fieldElement);
                replaceTemplate(element, fieldElement);
                compileTemplate(fieldElement, scope);
            }
        }

        return {
            transclude: 'element',
            restrict: 'E',
            scope: {
                model: '=',
                hasFocus: '='
            },
            link: getLinkFn()
        }
    }]);
'use strict';
angular.module('nemo')

    .directive('nemoHelpMessages', ['$compile', function ($compile) {
        return {
            scope: {
                fieldName: '@',
                help: '=model'
            },
            template:   '<div class="help-messages">{{help.message}}</div>',
            link: function(scope, element) {
                var dynamicContentId = scope.help.code.replace(/\./g, '-'),
                    dynamicContentElement = angular.element('<div></div>');

                dynamicContentElement.attr(dynamicContentId, true);
                dynamicContentElement.attr('field-name', '{{fieldName}}');
                dynamicContentElement.attr('help', 'help');
                angular.element(element.children()[0]).append(dynamicContentElement);
                $compile(dynamicContentElement)(scope);
            }
        }
    }]);

angular.module('nemo')

    .directive('nemoIcon', ['$sce', function ($sce) {
        return {
            template:'<div class="field-icon field-icon_{{type}} field-icon_{{fieldName}}" ' +
                        'data-ng-mouseover="onHover(fieldName)" ' +
                        'data-ng-mouseleave="onBlur(fieldName)" ' +
                        'data-ng-show="type" ng-bind-html="getText(type)">' +
                    '</div>',
            replace: true,
            scope: {
                fieldName: '@',
                type: '@',
                onHover: '&',
                onBlur: '&'
            },
            link: function (scope) {
                scope.getText = function (type) {
                    var iconText = ' ';
                    switch (type) {
                        case 'valid':
                            iconText = '&#10004;';
                            break;
                        case 'error':
                            iconText = '!';
                            break;
                        case 'help':
                            iconText = '?';
                            break;
                    }
                    return $sce.trustAsHtml(iconText);
                };
            }
        };
    }]);
'use strict';
angular.module('nemo')

    .directive('nemoValidationMessages', ['nemoMessages', function (messages) {
        return {
            scope: {
                validation: '=model'
            },
            template:   '<div data-t-validation-code="{{validationCode}}" data-ng-bind-html="getValidationMessage()" class="validation-messages"></div>',
            link: function(scope) {

                scope.getValidationMessage = function() {
                    for(var validationId in scope.validation.$error) {
                        if(scope.validation.$error.hasOwnProperty(validationId)) {
                            scope.validationCode = validationId;
                            return messages.get(validationId);
                        }
                    }
                };
            }
        }
    }]);
