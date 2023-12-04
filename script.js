var canvas = new fabric.Canvas('canvas', {
    width: window.innerWidth * 0.55, 
    height: window.innerHeight * 0.6,
});

var textControls = document.getElementById('textControls');
var textInput = document.getElementById('textInput');
var fontSizeInput = document.getElementById('fontSizeInput');
var fontFamilyInput = document.getElementById('fontFamilyInput');
var favcolor = document.getElementById('favcolor');
var undoStack = [];
var redoStack = [];

window.addEventListener('resize', function () {
    canvas.setDimensions({
        width: window.innerWidth * 0.55,
        height: window.innerHeight * 0.6,
    });
});


function addText() {
    var text = new fabric.Textbox('New Text', {
        left: 100,
        top: 100,
        fontSize: 20,
        fontFamily: fontFamilyInput.value,
        fill: favcolor.value,
    });

    canvas.add(text);
    undoStack.push({ action: 'add', object: text });
    redoStack = [];
}

function showTextControls() {
    var activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === 'textbox') {
        textControls.style.display = 'block';
        textInput.value = activeObject.text;
        fontSizeInput.value = activeObject.fontSize;
        fontFamilyInput.value = activeObject.fontFamily;
        favcolor.value = activeObject.fill;
    } else {
        alert('Please select a text object.');
    }
}

function applyTextChanges() {
    var activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === 'textbox') {
        undoStack.push({ action: 'edit', object: activeObject.toObject() });
        redoStack = [];

        activeObject.set({
            text: textInput.value,
            fontSize: parseInt(fontSizeInput.value),
            fontFamily: fontFamilyInput.value,
            fill: favcolor.value,
        });

        canvas.renderAll();
        textControls.style.display = 'none';
    }
}

function undo() {
    if (undoStack.length > 0) {
        var lastAction = undoStack.pop();

        if (lastAction.action === 'add') {
            canvas.remove(lastAction.object);
        } else if (lastAction.action === 'edit') {
            var object = canvas.getObjects().find(function(obj) {
                return obj.id === lastAction.object.id;
            });
            object.set(lastAction.object);
            canvas.renderAll();
        }

        redoStack.push(lastAction);
    }
}

function redo() {
    if (redoStack.length > 0) {
        var lastAction = redoStack.pop();

        if (lastAction.action === 'add') {
            var text = new fabric.Textbox(lastAction.object.text, lastAction.object);
            canvas.add(text);
        } else if (lastAction.action === 'edit') {
            var object = canvas.getObjects().find(function(obj) {
                return obj.id === lastAction.object.id;
            });
            object.set(lastAction.object);
            canvas.renderAll();
        }

        undoStack.push(lastAction);
    }
}

