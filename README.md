template_string
===============

A way to use template strings earlier in javascript.

NOTE
----

For a reasonable situation, to provide fast and safe interpolation, this repo uses `{{` *double curly braces* instead of `{` *single curly braces*, and in order to provide more functions, SOME `ESCAPE SEQUENCIES` not supported in `ECMASCRIPT SPECIFICATION` are implemented.`

And WHILE converting from function (easier multiline), only one transformation is performed by default and cannot be canceled, for JavaScript syntax reason, `*//*`=>`*/`. The string now is called a raw string, since its class is `templateString`, a number of methods to perform escape, type converting, interpolations are associated to the string. (And its `valueOf` and `to(Locale)String` methods returns a permitive string the same as itself.)
