"use strict";

var CALC = {
	result:		0,
	DIG_COUNT: 	12,
	ERR: 	[	"Деление на ноль!",				// описание возможных ошибок
				"Ошибка в формуле. Нажмите 'С' или '<-'",
				"Слишком длинное число (> 12 символов)"	]
};

CALC.init =  function () {
	var buttons = document.querySelectorAll("div.keys button"),
		i, len;
	
	for (i = 0, len = buttons.length; i < len; i++) {
		buttons[i].addEventListener("click", CALC.clickButton);
	}

	CALC.formula = document.querySelector(".formula");
	CALC.out = document.querySelector(".out");
	CALC.info = document.querySelector(".info");
};

CALC.clickButton =  function() {
	var val = this.innerHTML;

	switch (val)	{
		case "C":
			CALC.clearAll();
			break;
		case "&lt;-":		//	Нажата кнопка "<-" (удалить последний символ)
			CALC.delLast();
			break;
		case "=":
			CALC.getResult();
			break;	
		default:
			CALC.formula.innerHTML += val;
			CALC.out.innerHTML = '=';
			CALC.info.innerHTML = '';
	}		
}

CALC.clearAll =  function() {
	CALC.lastChar = "";
	CALC.formula.innerHTML = "";
	CALC.out.innerHTML = "0";
	CALC.info.innerHTML = '';
}

CALC.delLast =  function() {
	var txt = CALC.formula.innerHTML,
		start;
	
	if (txt) {
		start = txt.charAt(txt.length - 1) == ")" ? 1 : 0;		// удаляем парную открывающую скобку
		CALC.formula.innerHTML =  txt.substring(start, txt.length - 1);	
	}
	CALC.out.innerHTML = '=';
	CALC.info.innerHTML = '';	
}

CALC.formatOut =  function() {
	var outText = CALC.result.toString(),
		len = outText.length,
		round, temp;
		
	if (len > CALC.DIG_COUNT) { 
		temp = outText.indexOf(".");
		if (temp == -1) { outText = "error#2"; }
		else {
			round = CALC.DIG_COUNT - temp - 1;
			outText = CALC.result.toFixed(round, 10);
		}
	}
	if (!isFinite(CALC.result) && !isNaN(CALC.result) ) outText = "error#0";
	 
	CALC.out.innerHTML = outText;
	
	if (outText.substring(0, 5) == "error") {			// Вывод описания ошибки
		CALC.info.innerHTML = CALC.ERR[outText.charAt(outText.length-1)];
	}
}

CALC.getResult =  function() {
	var resFunc;
	
	try {
		resFunc = new Function("return " + (CALC.formula.innerHTML || "0"));
		CALC.result = resFunc();
	} catch (error) {
		CALC.result = "error#1";
	}
	CALC.formatOut();
	if (CALC.formula.innerHTML)  { CALC.formula.innerHTML = "(" + CALC.formula.innerHTML + ")"; }
}


document.addEventListener("DOMContentLoaded", CALC.init);
	