{Pos} = CodeMirror
autocomplete = (cm) ->
    CodeMirror.showHint cm, CodeMirror.hint.tag


window.codeMirror = CodeMirror firepad,
   extraKeys:
     'Tab': autocomplete
   lineWrapping: true
   lineNumbers: true
   mode: 'javascript'
