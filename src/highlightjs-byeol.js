/*
Language: byeol
Description: byeol is strong-typed OOP script language.
Author: kniz
Website: https://byeol.codes
Version: v0.2.8
Category: common
*/

// this code is super simple: may need to refactor and develop more.
(() => {
    var lang = (() => {
      const regex = hljs.regex;
      const ID_RE = `[a-zA-Z_\+]+[a-zA-Z0-9]*`
      const SPACE_RE = `[ \t]+`;
      const ACCESSIBLE_ID_RE = `[_\\\+]*${ID_RE}`;

      const RESERVED_WORDS = [
        'def', 'as', 'is', 'ctor',
        'on', 'in', 'next', 'else',
        'for', 'if', 'ret', 'while',
        'with', 'pack', 'break', 'get',
        'set', 'end',
      ];

      const BUILT_INS = [
        'print', 'input',
      ];

      const LITERALS = [
        'true', 'false', 'nul',
      ];

      const TYPES = [
        'void', 'err', 'int', 'super',
        'byte', 'flt', 'str', 'char',
        'me', 'it',
      ];

      const KEYWORDS = {
        keyword: RESERVED_WORDS,
        built_in: BUILT_INS,
        literal: LITERALS,
        type: TYPES
      };

      const ID = {
        scope: `variables`,
        match: ID_RE,
        keywords: KEYWORDS,
      }

      const OPERATORS_RE = `[.,\\\{\\\}\\\+\\\-=%\\\/\\\*\\\^\\\|&!\\\[\\\]]`
      const OPERATORS = {
        scope: "operator",
        relevance: 0,
        match: OPERATORS_RE
      }

      const STRING = {
        scope: 'string',
        contains: [ hljs.BACKSLASH_ESCAPE ],
        variants: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      };

      const NUMBER = {
        scope: 'number',
        relevance: 0,
        variants: [
          { // int
            begin: /[0-9]+/,
          },
          { // flt
            begin: /[0-9]+\.[0-9]+[f]?/,
          },
        ]
      };

      const COMMENT = hljs.COMMENT('#', '$');
      const BLOCK_COMMENT = hljs.COMMENT(`##`, `##`);

      // e.g. (args1 type, args2 type)
      const PARAM = {
        match: [
            ID_RE, SPACE_RE, ID_RE
        ],
        keywords: KEYWORDS,
        scope: {
          1: 'variables',
          3: 'title.class',
        }
      };

      const PARAMS = {
        scope: 'params',
        begin: /\(/,
        beginScope: "operator",
        end: /\)/,
        endScope: "operator",
        contains: [
          BLOCK_COMMENT, COMMENT,
          OPERATORS, PARAM,
          NUMBER, ID, STRING
        ],
        keywords: KEYWORDS,
      };

      const DEF_ASSIGN = {
          scope: "def_assign",
          begin: [
             ID_RE, SPACE_RE, `:=`, SPACE_RE
          ],
          beginScope: {
              1: "variables",
              3: "operator",
          },
          keywords: KEYWORDS,
          contains: [
             BLOCK_COMMENT, COMMENT,
             STRING, NUMBER, ID, OPERATORS, PARAMS
          ]
      }

      // e.g. main(args1 type, args2 type) retType
      const DEF_FUNC = {
        scope: "function",
        begin: [
            `${ID_RE}\\s*(?=\\\()`
        ],
        beginScope: {
          1: "title.function",
        },
        end: `\\\)(?!${SPACE_RE}${ID_RE})`,
        keywords: KEYWORDS,
        returnEnd: true,
        contains: [
            {
                scope: 'params1',
                begin: /\(/,
                beginScope: "operator",
                end: /\)/,
                endScope: "operator",
                illegal: /\n/,
                contains: [
                  BLOCK_COMMENT, COMMENT,
                  OPERATORS, PARAM,
                  NUMBER, ID, STRING
                ],
                keywords: KEYWORDS,
                endsParent: true,
            }
        ]
      };

      const STATEMENT = {
          contains: [
              BLOCK_COMMENT, COMMENT, DEF_FUNC, PARAMS, STRING, NUMBER, ID, OPERATORS, DEF_ASSIGN,
          ],
          keywords: KEYWORDS,
      }

      // e.g. def myObj
      const DEF_OBJ = {
        variants: [
            {
                begin: [
                  `def`, SPACE_RE, ACCESSIBLE_ID_RE,
                ],
                end: `$`,
                scope: {
                  1: "keyword",
                  3: "title.class"
                },
            },
            {
                begin: [
                  `def`, SPACE_RE, `${ACCESSIBLE_ID_RE}(?=\\\()`
                ],
                beginScope: {
                    1: "keyword",
                    3: "title.class",
                },
                end: /\)/,
                returnEnd: true,
                contains: [
                    `self`, STATEMENT
                ]
            }
        ],
        scope: "object",
        keywords: KEYWORDS,
      };

      return E => ({
            name: 'byeol',
            aliases: [ 'nm' ],
            unicodeRegex: true,
            keywords: KEYWORDS,
            contains: [
              BLOCK_COMMENT,
              COMMENT,
              NUMBER,
              STRING,
              OPERATORS,
              DEF_ASSIGN,
              DEF_OBJ,
              DEF_FUNC,
            ]
          })
      })();
      hljs.registerLanguage("byeol", lang);
})();
