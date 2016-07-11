(function(){

	var str = '3+5-(8+1)';

	var calc = new Calculator();
	console.log( calc.dataValidation( str ) );
  console.log( calc.getSumInQuotes( str ) );

})();